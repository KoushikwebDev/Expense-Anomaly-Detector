create extension if not exists vector
with schema extensions;


create table knowledge_base_embeddings (
  id uuid primary key default gen_random_uuid(),

  -- Policy metadata
  document_name text not null,          -- e.g. "Expense Reimbursement Policy"
  document_version text,                -- e.g. "2.0"
  section text,                         -- e.g. "Travel Expenses"
  subsection text,                      -- e.g. "Domestic Air Travel"

  -- Actual chunked policy text
  content text not null,

  -- Vector embedding
  embedding vector(1536) not null,

  -- Extra structured info (limits, approvals, currency, etc.)
  metadata jsonb,

  created_at timestamptz default now()
);



create index kb_embeddings_vector_idx
on knowledge_base_embeddings
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);
