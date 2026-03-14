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

## 🤖 The Agentic Flow (How it Works)

The system utilizes an **Orchestrated Multi-Agent Architecture** powered by the OpenAI Agents SDK, LangChain, and Vector Embeddings.

### 1. Advanced Document Processing (LangChain)
When a user uploads a file, the system uses **LangChain's PDFLoader** for structured text extraction. 
> **Recursive Vision Fallback**: If the PDF is a scan (missing text layer), the system automatically renders it into high-resolution images and uses **Vision-based OCR** to see the invoice just like a human would.

### 2. The Validation Agent (Accuracy Guard)
- **Role**: Data Extraction & Structural Validation.
- **Workflow**: 
    - Scans for mandatory fields (Merchant, Date, Grand Total).
    - Specifically hunts for the **Net Payable** amount to handle complex multi-tax invoices.
    - Uses structured parsing to ensure data integrity.

### 3. Semantic Policy Search (Vector Embeddings & RAG)
The system implements a **Retrieval-Augmented Generation (RAG)** pattern:
- **Embeddings**: Uses OpenAI's `text-embedding-3-small` to convert policy documents and search queries into high-dimensional vector space.
- **Semantic Search**: Performs vector similarity search in Supabase to find exact company policies relevant to the specific invoice category and amount.

### 4. The Policy Compliance Agent (Rule Enforcer)
- **Role**: Policy Verification & Risk Assessment.
- **Workflow**: 
    - Cross-references extracted data against the semantically retrieved policy sections.
    - Generates specific violations (e.g., "Meal limit exceeded", "Missing GST details").
    - Assigns a numeric Risk Score (0-100).

### 5. The Logging & Analytics Layer
- **Excel Synchronization**: Every result is instantly pushed to a structured Excel database (`invoice_logs.xlsx`).
- **Audit Dashboard**: Fetches real-time data from the logs to provide interactive analytics and expandable deep-dives.

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
