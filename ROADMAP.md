# ROADMAP.md: CV Matcher Implementation

## 1\. Project Directory Architecture

To ensure code maintainability and agent compatibility, the project follows this structure:

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
├── types/ # TypeScript definitions (if applicable)  
└── utils/ # Text cleaners, PDF extractors, Date formatters  

## 2\. Phase 1: Frontend Development (UI/UX)

**Goal:** Build a fully interactive, responsive UI with mock data.

- \[ \] **Sprint 1.1: Project Initialization**
  - Setup Vite + React + Tailwind CSS.
  - Install dependencies: lucide-react, react-dropzone, framer-motion, react-markdown.
- \[ \] **Sprint 1.2: Core Input Components**
  - Build src/components/upload/FileDropzone.jsx (PDF/Docx support).
  - Build src/components/upload/JDTextArea.jsx (Clean text input).
- \[ \] **Sprint 1.3: Result Dashboards**
  - Create ScoreDial.jsx (Radial progress bar for match %).
  - Create KeywordCloud.jsx (Green/Red chips for skill analysis).
  - Create ComparisonView.jsx (Side-by-side Markdown viewer).

## 3\. Phase 2: Backend & Supabase Integration

**Goal:** Implement authentication and data persistence.

- [x] **Sprint 2.1: Database Configuration**
  - Initialize Supabase client in src/lib/supabase.js.
  - Create cv_analysis table and configure RLS (Row Level Security).
- [x] **Sprint 2.2: Services & Auth**
  - Create src/services/dbService.js for CRUD operations.
  - Implement anonymous/email authentication in src/hooks/useSupabase.js.
- [x] **Sprint 2.3: File Storage**
  - Setup Supabase Storage bucket for PDF resume hosting.

## 4\. Phase 3: AI Logic & LangChain

**Goal:** Integrate Gemini and the reformulation logic.

- \[ \] **Sprint 3.1: AI Orchestration Setup**
  - Configure Gemini 1.5 in src/lib/langchain.js.
  - Build src/utils/pdfParser.js using client-side extraction.
- \[ \] **Sprint 3.2: Prompt Engineering**
  - Implement Keyword Extraction Chain (JSON output).
  - Implement STAR-method Reformulation Chain in src/services/aiService.js.
- \[ \] **Sprint 3.3: Processing Workflow**
  - Connect UI triggers to the LangChain sequence.
  - Save analysis results to Supabase upon completion.

## 5\. Phase 4: Testing & Optimization

**Goal:** Refine the user experience and ensure accuracy.

- \[ \] **Sprint 4.1: Logic Validation**
  - Test extraction with multiple CV formats.
  - Validate match score accuracy against manual reviews.
- \[ \] **Sprint 4.2: UX Polish**
  - Add Skeleton loaders for AI processing states.
  - Implement Toast notifications for errors/success.
- \[ \] **Sprint 4.3: Deployment**
  - Deploy to Vercel/Netlify.
  - Final environment variable audit.

### Antigravity Context

Start with Phase 1, Sprint 1.1. Reference the directory structure in PLAN.md for all file creations. Update CHANGELOG.md after every sprint completion.