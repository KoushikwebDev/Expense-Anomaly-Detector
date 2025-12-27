import { z } from 'zod';

// ============================================
// ZOD SCHEMAS FOR STRUCTURED OUTPUT
// ============================================

// Invoice validation result schema
export const InvoiceFieldsSchema = z.object({
    merchant_name: z.string().nullable(),
    merchant_address: z.string().nullable(),
    merchant_contact: z.string().nullable(),
    invoice_number: z.string().nullable(),
    invoice_date: z.string().nullable(),
    buyer_name: z.string().nullable(),
    employee_id: z.string().nullable(),
    description: z.string().nullable(),
    amount: z.number().nullable(),
    currency: z.string().nullable(),
    gstin: z.string().nullable(),
    tax_breakup: z.object({
        cgst: z.number().nullable(),
        sgst: z.number().nullable(),
        igst: z.number().nullable(),
        total_gst: z.number().nullable(),
    }).nullable(),
    payment_proof: z.string().nullable(),
    invoice_type: z.enum(['flight', 'hotel', 'meal', 'transport', 'other']).nullable(),
    travel_details: z.object({
        passenger_name: z.string().nullable(),
        from_location: z.string().nullable(),
        to_location: z.string().nullable(),
        travel_date: z.string().nullable(),
        pnr_number: z.string().nullable(),
    }).nullable(),
    hotel_details: z.object({
        guest_name: z.string().nullable(),
        check_in: z.string().nullable(),
        check_out: z.string().nullable(),
        city: z.string().nullable(),
    }).nullable(),
});

export const ValidationResultSchema = z.object({
    is_valid: z.boolean(),
    extracted_fields: InvoiceFieldsSchema,
    missing_mandatory_fields: z.array(z.string()),
    validation_errors: z.array(z.string()),
    confidence_score: z.number().min(0).max(100),
});

export const PolicyComplianceSchema = z.object({
    is_compliant: z.boolean(),
    policy_violations: z.array(z.object({
        rule: z.string(),
        violation: z.string(),
        severity: z.enum(['low', 'medium', 'high', 'critical']),
    })),
    risk_score: z.number().min(0).max(100),
    recommendations: z.array(z.string()),
    relevant_policy_sections: z.array(z.string()),
});

export const FinalAnalysisSchema = z.object({
    invoice_id: z.string(),
    status: z.enum(['approved', 'flagged', 'rejected', 'needs_review']),
    validation: ValidationResultSchema,
    policy_compliance: PolicyComplianceSchema,
    overall_risk_score: z.number().min(0).max(100),
    summary: z.string(),
    processed_at: z.string(),
});

// Type exports
export type InvoiceFields = z.infer<typeof InvoiceFieldsSchema>;
export type ValidationResult = z.infer<typeof ValidationResultSchema>;
export type PolicyCompliance = z.infer<typeof PolicyComplianceSchema>;
export type FinalAnalysis = z.infer<typeof FinalAnalysisSchema>;
