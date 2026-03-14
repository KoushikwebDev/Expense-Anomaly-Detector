# 🚀 Expense Anomaly Detector: Agentic AI Audit System

## 🎯 Project Goal
The **Expense Anomaly Detector** is designed to transform the cumbersome manual process of expense auditing into a seamless, high-accuracy AI-driven workflow. The goal is to:
- **Minimize Fraud**: Catch anomalies and policy violations before reimbursements are processed.
- **Maximize Accuracy**: Use Multi-Agent AI to extract data from even the most complex or scanned invoices.
- **Centralize Auditing**: Provide a secure hub for auditors to track, analyze, and export expense records.

---

## 📋 Invoice Acceptance Parameters
For an invoice to be successfully processed, it must contain the following mandatory parameters:
1. **Merchant/Vendor Name**: Legal name of the business issuing the invoice.
2. **Merchant Address**: Physical location or registered office address.
3. **Invoice Date**: The date the transaction occurred or the bill was generated.
4. **Invoice Number**: A unique identifier for the document.
5. **Itemized Description**: Details of goods purchased or services rendered.
6. **Grand Total Amount**: The final payable amount (inclusive of taxes and discounts).
7. **Currency**: Valid currency code (e.g., INR, USD, EUR).

---

## ⛓️ Step-by-Step PDF Audit Journey

When a user uploads a PDF invoice, the following agentic chain is triggered:

### 1. The Multi-Modal Extraction Phase
- **Text Layer Check**: The system first attempts to "read" the PDF using **LangChain's PDFLoader**.
- **The Vision Fallback**: If the PDF is a scanned image with no text layer, the **Validation Agent** automatically triggers a multi-modal fallback. It renders the PDF pages into high-resolution images and uses **GPT-4o Vision** to "see" and OCR the content.

### 2. Validation Agent Execution
- **Handover**: The raw text (from either OCR or direct extraction) is handed to the **Validation Agent**.
- **Reasoning**: The agent analyzes the text against the **7 Mandatory Parameters**. It doesn't just look for keywords; it understands the context (e.g., distinguishing between a Billing Address and a Merchant Address).
- **Result**: Generates a structured JSON object. If critical data like "Grand Total" is missing, it flags the invoice immediately.

### 3. Semantic Retrieval (RAG)
- **Context Injection**: The extracted merchant name, invoice type, and amount are used to generate a **Vector Embedding**.
- **Discovery**: The system performs a semantic search in the **Supabase Knowledge Base** to find relevant company policies that apply *specifically* to this type of expense.

### 4. Policy Compliance Agent Execution
- **Handover**: The Validation Agent's data + the retrieved Policy sections are handed to the **Policy Compliance Agent**.
- **Analysis**: This agent acts as a "Legal Auditor." It cross-checks the invoice amount against policy limits (e.g., "Meal allowance is ₹1000") and checks for compliance with GST/Tax rules.
- **Risk Scoring**: It calculates an overall **Risk Score** based on violations and confidence.

### 5. Final Synthesis & Persistence
- **Decision Engine**: The results are combined into a **Final Analysis** report.
- **Database Update**: The **Excel Agent** (lib/excel) instantly appends the data to `invoice_logs.xlsx`.
- **UI Update**: The Admin Dashboard reflects the new entry within seconds, allowing auditors to expand the record and see the "Full AI Reasoning" behind the approval or rejection.

---

## 🛠 Tech Stack
- **Framework**: Next.js 15+ (App Router, Server Actions)
- **AI Core**: OpenAI Agents SDK (@openai/agents) & GPT-4o Vision
- **Orchestration**: **LangChain** (Document Loaders)
- **Vector Search**: **Vector Embeddings** (OpenAI) & Supabase pgvector
- **UX/Design**: Tailwind CSS v4, Framer Motion, Lucide Icons.
- **Data**: Supabase (Knowledge Base), XLSX (Local Database).

---

## 🔒 Security
Access to the audit data is strictly guarded by a **Secure Admin Portal** with encrypted visibility toggles and session-based protection for authorized personnel only.
