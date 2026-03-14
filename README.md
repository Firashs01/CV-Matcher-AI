# 🎯 CV Matcher & AI Reformulator

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-1C1C1C?style=for-the-badge&logo=supabase&logoColor=3ECF8E)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

**Maximize your hiring potential with AI-driven CV gap analysis and professional STAR-method reformulation.**

---

## 🚀 Project Overview

In today's competitive job market, **Applicant Tracking Systems (ATS)** often filter out qualified candidates based on rigid keyword matching. The **CV Matcher & AI Reformulator** solves this by providing:

- **The Problem:** Qualified candidates getting "ghosted" by automated filters due to semantic gaps between their CV and the Job Description (JD).
- **The Solution:** A high-fidelity AI engine that analyzes your CV against a specific JD, identifies missing critical keywords, and reformulates your experience using the industry-standard **STAR method** (Situation, Task, Action, Result).

---

## ✨ Core Features

| Feature | Description |
| :--- | :--- |
| **🔍 AI Matching** | Leverages Gemini 2.5 to perform semantic extraction of hard/soft skills, providing a precise match percentage. |
| **✍️ Contextual Reformulation** | Intelligent CV rewriting that maps your existing experience to the target JD's requirements without "hallucinating" facts. |
| **🛡️ Tiered Access** | **Guests** enjoy instant, ephemeral analysis; **Registered Users** unlock persistent history and data synchronization. |
| **🎨 Modern UI** | A premium, responsive interface built with Glassmorphism principles, smooth Framer Motion animations, and intuitive workflows. |

---

## 🏗️ Technical Architecture

The project follows a modular architecture designed for scalability and performance.

### Directory Structure
```text
src/
├── components/     # Atomic UI (dashboard, upload, layout)
├── context/        # Global state management (HistoryContext)
├── hooks/          # Custom hooks (useSupabase)
├── lib/            # Configuration (supabase.js)
├── pages/          # View logic (Auth, History, Dashboard)
├── services/       # Business logic (aiService.js, dbService.js)
└── utils/          # Utilities (pdfParser.js)
```

### The Tech Stack
- **AI Engine:** Google Gemini 2.5 Flash for rapid extraction and deep reformulation.
- **Backend-as-a-Service:** Supabase handles Authentication (Email/Password & Anonymous), PostgreSQL database for persistence, and Storage for CV hosting.
- **Frontend:** React + Vite + Tailwind CSS for a lightning-fast, highly-styled SPA.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/cv-ia.git
cd cv-ia
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and populate it with your credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Supabase Setup
- Create a `cv_analysis` table with RLS enabled.
- (Optional) Use the migrations located in `supabase/migrations/` if available.
- Ensure the Storage bucket `cv_uploads` is created for production file hosting.

### 5. Run Locally
```bash
npm run dev
```

---

## 📖 Usage Guide

1.  **Upload:** Drop your CV (PDF format) and paste the target Job Description.
2.  **Analyze:** Hit the "Analyze Match" button to trigger the AI scoring engine.
3.  **Optimize:** Review the match score, identify missing keywords, and copy your newly reformulated STAR-method CV.

---

## 🔒 Security

We take your data privacy seriously:
- **Row Level Security (RLS):** Policies ensure that users can only read and write their own analysis history.
- **Anonymous Sessions:** Guests data is ephemeral and not shared; registered users have isolated data silos.
- **Factual Integrity:** The AI is instructed to never "hallucinate" experience—it only rephrases existing facts to better align with the target role.

---

> [!TIP]
> **Pro Tip:** Register an account to save your analysis history across sessions and track your progress over multiple applications!

![Dashboard Screenshot](https://via.placeholder.com/1200x600/6366f1/ffffff?text=CV+Matcher+AI+Dashboard+Preview)

---
*Developed with ❤️ for job seekers.*
