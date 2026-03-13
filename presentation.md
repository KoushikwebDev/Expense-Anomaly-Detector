# 🚀 Expense Anomaly Detector: Agentic AI Audit System

## 🎯 Project Goal
The **Expense Anomaly Detector** is designed to transform the cumbersome manual process of expense auditing into a seamless, high-accuracy AI-driven workflow. The goal is to:
- **Minimize Fraud**: Catch anomalies and policy violations before reimbursements are processed.
- **Maximize Accuracy**: Use Multi-Agent AI to extract data from even the most complex or scanned invoices.
- **Centralize Auditing**: Provide a secure hub for auditors to track, analyze, and export expense records.

---

## 🤖 The Agentic Flow (How it Works)

The system utilizes an **Orchestrated Multi-Agent Architecture** powered by the OpenAI Agents SDK and GPT-4o Vision.

### 1. The Extraction & Vision Layer
When a user uploads a file (PDF or Image), the system first attempts to extract raw text. 
> **Recursive Vision Fallback**: If the PDF is a scan (missing text layer), the system automatically renders the document into high-resolution images and uses **Vision-based OCR** to see the invoice just like a human would.

### 2. The Validation Agent (Accuracy Guard)
- **Role**: Data Extraction & Structural Validation.
- **Workflow**: 
    - Scans for mandatory fields (Merchant, Date, Grand Total).
    - Specifically hunts for the **Net Payable** amount to handle complex multi-tax invoices.
    - Assigns a confidence score to the extraction.

### 3. The Policy Compliance Agent (Rule Enforcer)
- **Role**: Policy Verification & Risk Assessment.
- **Workflow**: 
    - Cross-references extracted data against the **Company Policy Knowledge Base** (stored in Supabase).
    - Generates specific violations (e.g., "Meal limit exceeded", "Missing GST details").
    - Assigns a numeric Risk Score (0-100).

### 4. The Logging & Analytics Layer
- **Excel Synchronization**: Every result is instantly pushed to a structured Excel database (`invoice_logs.xlsx`).
- **Audit Dashboard**: Fetches real-time data from the logs to provide:
    - Interactive Recharts (Volume vs distribution).
    - Expandable deep-dives into every AI decision.
    - Export tools for offline reporting.

---

## 🛠 Tech Stack
- **Framework**: Next.js 15+ (App Router, Server Actions)
- **AI Core**: OpenAI Agents SDK (@openai/agents)
- **Vision/PDF**: PDFJS-Dist & Canvas for scanned document processing.
- **UX/Design**: Tailwind CSS v4, Framer Motion, Lucide Icons.
- **Data**: Supabase (Knowledge Base), XLSX (Local Database).

---

## 🔒 Security
Access to the audit data is strictly guarded by a **Secure Admin Portal** with encrypted visibility toggles and session-based protection for authorized personnel only.
