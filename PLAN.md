# PLAN.md: CV Matcher & AI Reformulator

## 1\. Project Vision

The **CV Matcher & AI Reformulator** is a sophisticated web application designed to bridge the gap between job seekers and Applicant Tracking Systems (ATS). By leveraging Generative AI (Gemini) and structured orchestration (LangChain), the platform provides users with a quantitative match score against specific job descriptions and generates a reformulated version of their CV to maximize hiring potential.

## 2\. Core Functional Requirements

| **Feature** | **Description** | **Technical Requirement** |
| --- | --- | --- |
| **CV Ingestion** | Support for PDF/Docx uploads with text extraction. | pdf-parse / mammoth.js |
| --- | --- | --- |
| **JD Processing** | A structured input for pasting Job Descriptions (JD). | Clean text sanitization |
| --- | --- | --- |
| **Keyword Analysis** | Extraction of "Hard Skills" and "Soft Skills" from both docs. | LangChain Entity Extraction |
| --- | --- | --- |
| **Match Scoring** | A mathematical percentage representing the overlap. | Custom Prompt + Scoring Logic |
| --- | --- | --- |
| **AI Reformulation** | Content rewriting using the STAR method for ATS optimization. | Gemini 1.5 Pro |
| --- | --- | --- |
| **Data Persistence** | User history and previous analysis storage. | Supabase (Postgres + Storage) |
| --- | --- | --- |

## 3\. System Architecture

### Frontend (React + Vite)

- **Styling:** Tailwind CSS for a modern, high-contrast UI.
- **Icons:** Lucide React.
- **State:** React Context or Zustand for cross-component data flow.

### Backend (Supabase)

- **Auth:** Email/Password and Anonymous login.
- **Database:** PostgreSQL for storing CV metadata and match scores.
- **Storage:** Supabase Buckets for hosting original PDF files.

### AI Layer (LangChain + Gemini)

- **Model:** gemini-1.5-flash for fast analysis and gemini-1.5-pro for deep rewriting.
- **Orchestration:** LangChain LCEL (LangChain Expression Language) for chaining extraction, scoring, and generation.

## 4\. Technical File Structure (Source of Truth)

src/  
├── assets/ # Global styles, logos, and images  
├── components/ # Atomic UI components  
│ ├── layout/ # Navbar, Footer, App Container  
│ ├── dashboard/ # Score charts, Keyword chips, Comparison UI  
│ └── upload/ # FileDropzone, JDInput, LoadingStates  
├── hooks/ # useSupabase, useAIProcess, usePDFParser  
├── lib/ # Configs (supabase.js, langchain.js)  
├── pages/ # View logic (Home, Dashboard, History)  
├── services/ # Business logic (aiService.js, dbService.js)  
├── types/ # TypeScript interfaces (if applicable)  
└── utils/ # Text cleaners, PDF extractors, Date formatters  

## 5\. Data Schema

### Table: cv_analysis

- id: uuid (primary key)
- user_id: uuid (references auth.users)
- original_cv_url: text (link to Supabase storage)
- job_description: text
- match_score: integer (0-100)
- matched_keywords: text\[\]
- missing_keywords: text\[\]
- reformulated_cv_markdown: text
- created_at: timestamp

## 6\. Development Philosophy

- **Fact-First:** The AI must never "hallucinate" experience. It should only rephrase existing facts to match JD terminology.
- **Speed:** Initial keyword extraction should happen in near real-time.
- **Privacy:** User data must be protected via Supabase Row Level Security (RLS).