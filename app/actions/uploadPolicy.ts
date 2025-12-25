'use server';

import { createAdminClient } from '@/lib/supabase/server';
import OpenAI from 'openai';
// const pdf = require('pdf-parse');
// eslint-disable-next-line @typescript-eslint/no-require-imports
// const pdfParse = require('pdf-parse');
import mammoth from 'mammoth';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ============================================
// MAIN SERVER ACTION
// ============================================
export async function uploadCompanyPolicy(formData: FormData) {
    try {
        // Step 1: Extract form data
        // const file = formData.get('policy') as File;
        // const companyId = formData.get('companyId') as string;
        // const userId = formData.get('userId') as string;

        const response = await fetch('expense_policy.pdf');
        const blob = await response.blob();
        const file = new File([blob], 'expense_policy.pdf', { type: 'application/pdf' });
        const companyId = 'company-123';
        const userId = 'user-456';

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
        // Step 2: Parse document to text
        const text = await parseDocument(file);

        if (!text || text.length < 100) {
            return { success: false, error: 'Document appears empty or could not be parsed' };
        }

        console.log(`✅ Extracted ${text.length} characters`);

        console.log('✂️ Step 2: Chunking document...');
        // Step 3: Chunk the document semantically
        const chunks = await chunkDocument(text, file.name);

        console.log(`✅ Created ${chunks.length} chunks`);

        const supabase = createAdminClient();

        console.log('💾 Step 3: Creating policy document record...');
        // Step 4: Create policy document record in Supabase
        const { data: policyDoc, error: docError } = await supabase
            .from('policy_documents')
            .insert({
                company_id: companyId,
                file_name: file.name,
                file_size: file.size,
                total_chunks: chunks.length,
                sections: extractUniqueSections(chunks),
                uploaded_by: userId,
                status: 'active'
            })
            .select()
            .single();

        if (docError) {
            console.error('Database error:', docError);
            return { success: false, error: `Database error: ${docError.message}` };
        }

        console.log(`✅ Created document record: ${policyDoc.id}`);

        console.log('🔮 Step 4: Generating embeddings and storing chunks...');
        // Step 5: Generate embeddings and store chunks in batches
        let processedChunks = 0;
        const batchSize = 10; // Process 10 chunks at a time to avoid rate limits

        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);

            // Generate embeddings for batch
            const embeddings = await generateEmbeddingsBatch(
                batch.map(chunk => chunk.content)
            );

            // Prepare records for insertion
            const chunkRecords = batch.map((chunk, idx) => ({
                document_id: policyDoc.id,
                company_id: companyId,
                content: chunk.content,
                section: chunk.section,
                page_number: chunk.pageNumber,
                chunk_index: i + idx,
                embedding: embeddings[idx]
            }));

            // Insert batch into Supabase
            const { error: chunkError } = await supabase
                .from('policy_chunks')
                .insert(chunkRecords);

            if (chunkError) {
                console.error('Chunk insertion error:', chunkError);
                // Rollback: Delete the policy document
                await supabase
                    .from('policy_documents')
                    .delete()
                    .eq('id', policyDoc.id);

                return { success: false, error: `Failed to store chunks: ${chunkError.message}` };
            }

            processedChunks += batch.length;
            console.log(`✅ Processed ${processedChunks}/${chunks.length} chunks`);
        }

        console.log('✅ Policy upload complete!');

        return {
            success: true,
            documentId: policyDoc.id,
            fileName: file.name,
            chunksCreated: chunks.length,
            sections: extractUniqueSections(chunks),
            message: `Successfully processed ${chunks.length} policy sections from ${file.name}`
        };

    } catch (error: any) {
        console.error('Policy upload error:', error);
        return {
            success: false,
            error: error.message || 'An unexpected error occurred'
        };
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Parse different document formats
async function parseDocument(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    try {
        if (fileExtension === 'pdf') {
            const pdf = (await import('pdf-parse')).default;
            const data = await pdf(Buffer.from(buffer));
            return data.text;
        } else if (fileExtension === 'docx') {
            const result = await mammoth.extractRawText({
                buffer: Buffer.from(buffer)
            });
            return result.value;
        } else if (fileExtension === 'txt') {
            return Buffer.from(buffer).toString('utf-8');
        } else {
            throw new Error('Unsupported file format');
        }
    } catch (error: any) {
        throw new Error(`Failed to parse document: ${error.message}`);
    }
}

// Chunk document using semantic splitting
async function chunkDocument(
    text: string,
    fileName: string
): Promise<Array<{ content: string; section: string; pageNumber: number }>> {

    // Initialize text splitter with optimal settings for policy documents
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 800, // ~200 words per chunk
        chunkOverlap: 100, // 12.5% overlap to preserve context
        separators: [
            '\n## ',      // Markdown headers
            '\n### ',
            '\n\n',       // Paragraphs
            '\n',         // Lines
            '. ',         // Sentences
            ' ',          // Words
            ''            // Characters (last resort)
        ]
    });

    // Split text into chunks
    const docs = await splitter.createDocuments([text]);

    // Process chunks and detect sections
    const chunks = docs.map((doc, index) => {
        const content = doc.pageContent;

        // Detect section from content
        const section = detectSection(content);

        // Estimate page number (rough approximation: 500 chars per page)
        const pageNumber = Math.floor(index * 800 / 500) + 1;

        return {
            content: content.trim(),
            section,
            pageNumber
        };
    });

    return chunks;
}

// Detect section name from chunk content
function detectSection(text: string): string {
    // Common policy section patterns
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

    // If no section detected, use first line or default
    const firstLine = text.split('\n')[0].trim();
    if (firstLine.length < 100 && firstLine.length > 5) {
        return firstLine;
    }

    return 'General Policy';
}

// Extract unique sections from chunks
function extractUniqueSections(chunks: Array<{ section: string }>): string[] {
    const sections = new Set(chunks.map(c => c.section));
    return Array.from(sections);
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
