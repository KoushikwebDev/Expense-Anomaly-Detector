'use server';

import { createAdminClient } from '@/lib/supabase/server';
import OpenAI from 'openai';
import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';
import {
    InvoiceFieldsSchema,
    ValidationResultSchema,
    PolicyComplianceSchema,
    type FinalAnalysis,
    type ValidationResult,
    type PolicyCompliance,
} from '@/lib/schemas/invoice';
import { logInvoiceAction } from '@/lib/excel';


// ============================================
// OPENAI CLIENT SETUP
// ============================================

// Set OPENAI_API_KEY for @openai/agents SDK (it requires this specific env var name)
if (!process.env.OPENAI_API_KEY && process.env.NEXT_APP_OPENAI_API_KEY) {
    process.env.OPENAI_API_KEY = process.env.NEXT_APP_OPENAI_API_KEY;
}

const openai = new OpenAI({ apiKey: process.env.NEXT_APP_OPENAI_API_KEY });

// ============================================
// TOOLS FOR AGENTS
// ============================================

// Tool to search knowledge base
const searchKnowledgeBaseTool = tool({
    name: 'search_knowledge_base',
    description: 'Search the company expense policy knowledge base for relevant rules and limits. Use this to find spending limits, approval requirements, and policy guidelines.',
    parameters: z.object({
        query: z.string().describe('Search query to find relevant policy sections'),
        limit: z.number().optional().default(5).describe('Number of results to return'),
    }),
    execute: async ({ query, limit = 5 }) => {
        const supabase = createAdminClient();

        // Generate embedding for the query
        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: query,
            encoding_format: 'float'
        });

        const queryEmbedding = embeddingResponse.data[0].embedding;

        // Try RPC function first
        const { data, error } = await supabase.rpc('match_knowledge_base', {
            query_embedding: queryEmbedding,
            match_threshold: 0.5,
            match_count: limit
        });

        if (error) {
            // Fallback: direct query
            const { data: fallbackData } = await supabase
                .from('knowledge_base_embeddings')
                .select('content, section, document_name')
                .limit(limit);

            if (fallbackData && fallbackData.length > 0) {
                return fallbackData.map(d => ({
                    section: d.section || d.document_name,
                    content: d.content
                }));
            }
            return [{ section: 'No Policy', content: 'No policy documents found in knowledge base.' }];
        }

        if (!data || data.length === 0) {
            return [{ section: 'No Results', content: 'No relevant policy sections found for this query.' }];
        }

        return data.map((d: any) => ({
            section: d.section || d.document_name,
            content: d.content,
            similarity: d.similarity
        }));
    }
});

// Tool to extract text from images using vision
const extractImageTextTool = tool({
    name: 'extract_image_text',
    description: 'Extract text from an invoice image using OCR/Vision',
    parameters: z.object({
        imageBase64: z.string().describe('Base64 encoded image data'),
        mimeType: z.string().describe('MIME type of the image'),
    }),
    execute: async ({ imageBase64, mimeType }) => {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: 'Extract ALL text from this invoice image. Include every detail: merchant name, address, date, items, amounts, taxes, etc.' },
                        { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } }
                    ]
                }
            ],
            max_tokens: 2000
        });

        return response.choices[0].message.content || 'Could not extract text from image';
    }
});

// ============================================
// AGENT DEFINITIONS USING @openai/agents
// ============================================

// Agent 1: Invoice Validation Agent
const validationAgent = new Agent({
    name: 'Invoice Validation Agent',
    model: 'gpt-4o',
    instructions: `You are an Invoice Validation Agent. Your job is to extract and validate invoice data.

CRITICAL: You MUST find the TOTAL AMOUNT to be paid (Grand Total).
Look for:
- "Grand Total"
- "Total Amount"
- "Amount Due"
- "Net Payable"
- "Balance Paid"
- "Total" (usually at the very bottom)

MANDATORY FIELDS that MUST be present:
1. Merchant/Vendor Name
2. Merchant Address
3. Invoice Number
4. Invoice Date
5. Description of goods/service
6. Grand Total Expense (The final, total amount including taxes. Return ONLY numeric digits and decimal. e.g. 1250.75)
7. Currency (Short format like INR, USD)

Format your response as a JSON object with exactly these fields:
- is_valid: boolean (true if all mandatory fields found)
- extracted_fields: { merchant_name, merchant_address, invoice_number, invoice_date, description, amount, currency }
- missing_mandatory_fields: array of strings (names of fields not found)
- validation_errors: array of strings
- confidence_score: number 0-100`,
    tools: [extractImageTextTool],
});

// Agent 2: Policy Compliance Agent
const policyComplianceAgent = new Agent({
    name: 'Policy Compliance Agent',
    model: 'gpt-4o',
    instructions: `You are a Policy Compliance Agent. Your job is to check if an expense invoice complies with company expense policies.

You have access to the company's knowledge base containing expense policies. Use the search_knowledge_base tool to find relevant policies.

Your task:
1. Search for relevant expense policies based on the invoice type and amount
2. Check if the expense complies with spending limits
3. Verify if proper approvals would be required
4. Identify any policy violations
5. Assign a risk score (0-100, higher = more risky)
6. Provide recommendations

Return a JSON object with:
- is_compliant: boolean
- policy_violations: array of {rule, violation, severity}
- risk_score: 0-100
- recommendations: array of suggestions
- relevant_policy_sections: array of policy section names used`,
    tools: [searchKnowledgeBaseTool],
});

// ============================================
// MAIN ANALYSIS FUNCTION
// ============================================
export async function analyzeInvoice(formData: FormData): Promise<FinalAnalysis> {
    const file = formData.get('invoice') as File;

    if (!file) {
        throw new Error('No invoice file provided');
    }

    console.log('🔍 Starting invoice analysis with OpenAI Agents SDK...');

    // Extract text from the invoice
    const invoiceText = await extractInvoiceText(file);

    console.log('📄 Step 1: Running Validation Agent...');

    // Run Validation Agent
    const validationResult = await run(validationAgent, `MANDATORY: Extract the EXACT GRAND TOTAL AMOUNT from this invoice.

INVOICE CONTENT:
${invoiceText}

Respond ONLY with a JSON object containing the extracted fields and validation status.`);

    // Parse validation result
    let validationData: ValidationResult;
    try {
        // The run() function returns a RunResult with finalOutput containing the agent's response
        const content = typeof validationResult.finalOutput === 'string'
            ? validationResult.finalOutput
            : JSON.stringify(validationResult.finalOutput);

        // Extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            validationData = JSON.parse(jsonMatch[0]);
            // Ensure amount is a number
            if (validationData.extracted_fields && validationData.extracted_fields.amount !== undefined) {
                const amt = validationData.extracted_fields.amount as any;
                if (typeof amt === 'string') {
                    const cleaned = amt.replace(/,/g, '').match(/[0-9.]+/);
                    validationData.extracted_fields.amount = cleaned ? parseFloat(cleaned[0]) : 0;
                }
            }
        } else {
            throw new Error('No JSON found in validation response');
        }
    } catch (e) {
        console.error('Failed to parse validation result:', e);
        validationData = {
            is_valid: false,
            extracted_fields: {
                merchant_name: null,
                merchant_address: null,
                merchant_contact: null,
                invoice_number: null,
                invoice_date: null,
                buyer_name: null,
                employee_id: null,
                description: null,
                amount: null,
                currency: null,
                gstin: null,
                tax_breakup: null,
                payment_proof: null,
                invoice_type: null,
                travel_details: null,
                hotel_details: null,
            },
            missing_mandatory_fields: ['Unable to parse invoice'],
            validation_errors: ['Failed to extract invoice data'],
            confidence_score: 0
        };
    }

    console.log('✅ Validation complete:', validationData.is_valid);

    // If validation fails critically, return early
    if (!validationData.is_valid && (validationData.missing_mandatory_fields?.length ?? 0) > 3) {
        const finalResult: FinalAnalysis = {
            invoice_id: `INV-${Date.now()}`,
            status: 'rejected',
            validation: validationData,
            policy_compliance: {
                is_compliant: false,
                policy_violations: [],
                risk_score: 100,
                recommendations: ['Fix validation errors before policy check'],
                relevant_policy_sections: []
            },
            overall_risk_score: 100,
            summary: `Invoice rejected due to missing mandatory fields: ${validationData.missing_mandatory_fields.join(', ')}`,
            processed_at: new Date().toISOString()
        };
        await logInvoiceAction(finalResult);
        return finalResult;

    }

    console.log('📚 Step 2: Running Policy Compliance Agent...');

    // Run Policy Compliance Agent
    const complianceResult = await run(policyComplianceAgent, `Check this invoice against company expense policy.

INVOICE DETAILS:
${JSON.stringify(validationData.extracted_fields, null, 2)}

RAW INVOICE TEXT:
${invoiceText}

Search the knowledge base for relevant policies and analyze compliance. Return your analysis as a JSON object.`);

    // Parse compliance result
    let complianceData: PolicyCompliance;
    try {
        // The run() function returns a RunResult with finalOutput containing the agent's response
        const content = typeof complianceResult.finalOutput === 'string'
            ? complianceResult.finalOutput
            : JSON.stringify(complianceResult.finalOutput);

        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            complianceData = JSON.parse(jsonMatch[0]);
        } else {
            throw new Error('No JSON found in compliance response');
        }
    } catch (e) {
        console.error('Failed to parse compliance result:', e);
        complianceData = {
            is_compliant: true,
            policy_violations: [],
            risk_score: 50,
            recommendations: ['Manual review recommended'],
            relevant_policy_sections: []
        };
    }

    console.log('✅ Policy check complete:', complianceData.is_compliant);

    // Calculate overall risk score
    const overallRisk = Math.round(
        (validationData.confidence_score > 0 ? (100 - validationData.confidence_score) : 50) * 0.3 +
        complianceData.risk_score * 0.7
    );

    // Determine status
    let status: 'approved' | 'flagged' | 'rejected' | 'needs_review';
    if (!validationData.is_valid) {
        status = 'rejected';
    } else if (!complianceData.is_compliant || overallRisk > 70) {
        status = complianceData.policy_violations.some(v => v.severity === 'critical') ? 'rejected' : 'flagged';
    } else if (overallRisk > 40) {
        status = 'needs_review';
    } else {
        status = 'approved';
    }

    // Generate summary
    const summary = generateSummary(validationData, complianceData, status);

    const finalResult: FinalAnalysis = {
        invoice_id: `INV-${Date.now()}`,
        status,
        validation: validationData,
        policy_compliance: complianceData,
        overall_risk_score: overallRisk,
        summary,
        processed_at: new Date().toISOString()
    };

    console.log('✅ Analysis complete!');

    await logInvoiceAction(finalResult);
    return finalResult;
}


// ============================================
// HELPER FUNCTIONS
// ============================================

async function extractInvoiceText(file: File): Promise<string> {
    const fileType = file.type;

    if (fileType === 'application/pdf') {
        const { PDFLoader } = await import('@langchain/community/document_loaders/fs/pdf');
        const { writeFile, unlink } = await import('fs/promises');
        const { join } = await import('path');
        const { tmpdir } = await import('os');

        const buffer = Buffer.from(await file.arrayBuffer());
        const tempPath = join(tmpdir(), `invoice_${Date.now()}.pdf`);
        await writeFile(tempPath, buffer);

        try {
            const loader = new PDFLoader(tempPath);
            const docs = await loader.load();
            let text = docs.map(d => d.pageContent).join('\n\n').trim();

            // If text extraction is very poor, it might be a scanned PDF
            if (text.length < 50) {
                console.log('⚠️ PDF text extraction poor, attempting Vision rendering...');
                return await extractPdfTextViaVision(buffer);
            }

            return text;
        } catch (e) {
            console.error('PDF Text Extraction failed:', e);
            return await extractPdfTextViaVision(buffer);
        } finally {
            await unlink(tempPath).catch(() => { });
        }
    } else if (fileType.startsWith('image/')) {
        const base64 = Buffer.from(await file.arrayBuffer()).toString('base64');

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: 'Extract all text from this invoice image. Be extremely careful to find the Total Amount or Grand Total. List every number you see associated with "Total", "Net", or "Balance".' },
                        { type: 'image_url', image_url: { url: `data:${fileType};base64,${base64}` } }
                    ]
                }
            ],
            max_tokens: 2000
        });

        return response.choices[0].message.content || '';
    } else {
        return await file.text();
    }
}

async function extractPdfTextViaVision(pdfBuffer: Buffer): Promise<string> {
    try {
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf');
        const { createCanvas } = await import('canvas');

        const data = new Uint8Array(pdfBuffer);
        const loadingTask = pdfjs.getDocument({ data });
        const pdf = await loadingTask.promise;

        // Just process the first page for the total
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = createCanvas(viewport.width, viewport.height);
        const context = canvas.getContext('2d');

        await page.render({
            canvasContext: context as any,
            viewport: viewport
        }).promise;

        const base64Image = canvas.toBuffer('image/jpeg').toString('base64');

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: 'This is a scanned invoice PDF. Extract all text, focusing specifically on finding the GRAND TOTAL or TOTAL AMOUNT PAID.' },
                        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
                    ]
                }
            ],
            max_tokens: 2000
        });

        return response.choices[0].message.content || '';
    } catch (e) {
        console.error('PDF Vision Extraction failed:', e);
        return 'Could not extract text from PDF';
    }
}

function generateSummary(
    validation: ValidationResult,
    compliance: PolicyCompliance,
    status: string
): string {
    const parts: string[] = [];

    if (status === 'approved') {
        parts.push('✅ Invoice passed all checks and is approved for processing.');
    } else if (status === 'rejected') {
        parts.push('❌ Invoice has been rejected.');
        if (validation.missing_mandatory_fields.length > 0) {
            parts.push(`Missing fields: ${validation.missing_mandatory_fields.join(', ')}`);
        }
        if (compliance.policy_violations.filter(v => v.severity === 'critical').length > 0) {
            parts.push('Critical policy violations detected.');
        }
    } else if (status === 'flagged') {
        parts.push('⚠️ Invoice has been flagged for review.');
        parts.push(`${compliance.policy_violations.length} policy violation(s) detected.`);
    } else {
        parts.push('🔍 Invoice needs manual review.');
    }

    if (validation.extracted_fields.amount) {
        parts.push(`Amount: ${validation.extracted_fields.currency || '₹'}${validation.extracted_fields.amount}`);
    }

    return parts.join(' ');
}
