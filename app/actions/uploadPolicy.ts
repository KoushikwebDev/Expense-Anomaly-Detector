'use server';

import { createAdminClient } from '@/lib/supabase/server';
import OpenAI from 'openai';
import mammoth from 'mammoth';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

const openai = new OpenAI({ apiKey: process.env.NEXT_APP_OPENAI_API_KEY });

// ============================================
// MAIN SERVER ACTION
// ============================================
export async function uploadCompanyPolicy(formData: FormData) {
    let tempFilePath: string | null = null;

    try {
        // Step 1: Extract form data
        const file = formData.get('policy') as File;
        const companyId = (formData.get('companyId') as string) || 'default-company';

        if (!file) {
            return { success: false, error: 'No file provided' };
        }

        // Validate file type
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (!validTypes.includes(file.type)) {
            return { success: false, error: 'Invalid file type. Please upload PDF, DOCX, or TXT' };
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return { success: false, error: 'File too large. Maximum size is 10MB' };
        }

        console.log('📄 Step 1: Parsing document...');

        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        let docs: Array<{ pageContent: string; metadata: any }> = [];

        if (fileExtension === 'pdf') {
            // Write uploaded file to temp location for PDFLoader
            const buffer = Buffer.from(await file.arrayBuffer());
            tempFilePath = join(tmpdir(), `upload_${Date.now()}_${file.name}`);
            await writeFile(tempFilePath, buffer);

            // Use PDFLoader (same pattern as referenceIngest.ts)
            const loader = new PDFLoader(tempFilePath);
            docs = await loader.load();

        } else if (fileExtension === 'docx') {
            const buffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({
                buffer: Buffer.from(buffer)
            });
            docs = [{ pageContent: result.value, metadata: { source: file.name } }];

        } else if (fileExtension === 'txt') {
            const buffer = await file.arrayBuffer();
            const text = Buffer.from(buffer).toString('utf-8');
            docs = [{ pageContent: text, metadata: { source: file.name } }];

        } else {
            return { success: false, error: 'Unsupported file format' };
        }

        if (!docs.length || docs.every(d => !d.pageContent || d.pageContent.length < 50)) {
            return { success: false, error: 'Document appears empty or could not be parsed' };
        }

        console.log(`✅ Loaded ${docs.length} pages/sections`);

        // Step 2: Split documents (same pattern as referenceIngest.ts)
        console.log('✂️ Step 2: Chunking document...');

        const splitter = new RecursiveCharacterTextSplitter({
            separators: ['\n\n', '\n', '.', '!', '?', ',', ' ', ''],
            chunkSize: 3500,
            chunkOverlap: 500,
        });

        const splitDocs = await splitter.splitDocuments(docs);

        // Enrich metadata (same pattern as referenceIngest.ts)
        const withMeta = splitDocs.map((d, index) => ({
            ...d,
            metadata: {
                ...(d.metadata || {}),
                source_file: file.name,
                page: d.metadata?.loc?.pageNumber ?? d.metadata?.page ?? null,
                chunk_index: index,
                doc_id: `kb_${Date.now()}_${index}`,
                ingested_at: new Date().toISOString(),
            },
        }));

        console.log(`✅ Created ${withMeta.length} chunks`);

        // Step 3: Generate embeddings and store
        const supabase = createAdminClient();
        console.log('🔮 Step 3: Generating embeddings and storing in Knowledge Base...');

        let processedChunks = 0;
        const batchSize = 10;

        for (let i = 0; i < withMeta.length; i += batchSize) {
            const batch = withMeta.slice(i, i + batchSize);

            // Generate embeddings for batch
            const embeddings = await generateEmbeddingsBatch(
                batch.map(chunk => chunk.pageContent)
            );

            // Prepare records for knowledge_base_embeddings table
            const records = batch.map((chunk, idx) => ({
                document_name: file.name,
                document_version: '1.0',
                section: detectSection(chunk.pageContent),
                subsection: null,
                content: chunk.pageContent,
                embedding: embeddings[idx],
                metadata: {
                    ...chunk.metadata,
                    company_id: companyId,
                    file_size: file.size,
                }
            }));

            // Insert batch into Supabase
            const { error: insertError } = await supabase
                .from('knowledge_base_embeddings')
                .insert(records);

            if (insertError) {
                console.error('Database insertion error:', insertError);
                return { success: false, error: `Failed to store embeddings: ${insertError.message}` };
            }

            processedChunks += batch.length;
            console.log(`✅ Processed ${processedChunks}/${withMeta.length} chunks`);
        }

        console.log('✅ Knowledge Base upload complete!');

        // Extract unique sections for response
        const sections = [...new Set(withMeta.map(c => detectSection(c.pageContent)))];

        return {
            success: true,
            chunksCreated: withMeta.length,
            sections,
            message: `Successfully processed and embedded ${withMeta.length} sections from ${file.name}`
        };

    } catch (error: any) {
        console.error('Policy upload error:', error);
        return {
            success: false,
            error: error.message || 'An unexpected error occurred'
        };
    } finally {
        // Cleanup temp file
        if (tempFilePath) {
            try {
                await unlink(tempFilePath);
            } catch {
                // Ignore cleanup errors
            }
        }
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Detect section name from chunk content
function detectSection(text: string): string {
    const sectionPatterns = [
        /(?:^|\n)(SECTION \d+[:\s-]+.*?)(?:\n|$)/i,
        /(?:^|\n)(Chapter \d+[:\s-]+.*?)(?:\n|$)/i,
        /(?:^|\n)(Article \d+[:\s-]+.*?)(?:\n|$)/i,
        /(?:^|\n)((?:Expense|Travel|Meal|Accommodation|Transportation|Reimbursement)\s+Policy)(?:\n|$)/i,
        /(?:^|\n)((?:Category\s+)?Limits?)(?:\n|$)/i,
        /(?:^|\n)(Approval\s+(?:Matrix|Process|Rules?))(?:\n|$)/i,
        /(?:^|\n)(General\s+(?:Guidelines?|Rules?|Provisions?))(?:\n|$)/i
    ];

    for (const pattern of sectionPatterns) {
        const match = text.match(pattern);
        if (match) {
            return match[1].trim();
        }
    }

    const firstLine = text.split('\n')[0].trim();
    if (firstLine.length < 100 && firstLine.length > 5) {
        return firstLine;
    }

    return 'General Policy';
}

// Generate embeddings in batch using OpenAI
async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
    try {
        const response = await openai.embeddings.create({
            model: 'text-embedding-3-small', // 1536 dimensions
            input: texts,
            encoding_format: 'float'
        });

        return response.data.map(item => item.embedding);
    } catch (error: any) {
        console.error('Embedding generation error:', error);
        throw new Error(`Failed to generate embeddings: ${error.message}`);
    }
}
