# Changelog

## [Phase 3.7 Mobile Responsive Sidebar Implementation] - 2026-03-15

### Added
- **Mobile Responsive Navbar**: Refactored the header into a standalone `Navbar.jsx` component.
- **Hamburger Menu**: Integrated a Lucide `Menu` toggle for mobile viewports (below `md` breakpoint).
- **Glassmorphism Sidebar**: Implemented a slide-in sidebar with `backdrop-blur-xl`, `bg-slate-900/80`, and high-definition borders.
- **Animated Transitions**: Used `AnimatePresence` from Framer Motion for smooth sidebar entry and exit animations.
- **Interactive Overlay**: Added a darkened backdrop overlay (`bg-black/40`) that closes the menu on click.
- **Gating Logic Persistence**: Maintained strict access control for guests within the mobile navigation, ensuring redirects to `/signup` from the "History" link.

### Changed
- **Component Architecture**: Extracted layout logic from `App.jsx` to `src/components/layout/Navbar.jsx` to improve maintainability.
- **UX Optimization**: Ensured all mobile navigation targets meet or exceed the 48px touch target standard.

## [Phase 2.7 Auth Validation & Gating Implementation] - 2026-03-14

### Added
- **Password Confirmation**: Added a second password field to the Sign-Up form for verification.
- **Client-Side Validation**: Implemented a check to ensure passwords match before calling Supabase `signUp`.
- **Gated Access**: Restricted "History" access to registered users, redirecting guests to the Sign-Up page.

### Changed
- **Consolidated Auth Logic**: Merged registration logic into the main `Auth.jsx` component and removed the duplicate `SignUp.jsx`.
- **Unified Navigation**: Updated Navbar and App routes to use the consolidated `Auth` component for both login and signup flows.
- **Immediate State Update**: Verified that local state reflects "Registered" status immediately after a successful signup.

## [Phase 3.6 UX Navigation Enhancements] - 2026-03-13

### Added
- **"New Analysis" (Restart) Flow**: Introduced a tactical "New Analysis" button to instantly reset all inputs and results for a fresh start.
- **History Detail Navigation**: Implemented "Exit History" logic with an `ArrowLeft` action, allowing users to seamlessly return from deep-dive historical views to their active session.
- **Session State Guard**: Added logic to replace the primary "Analyze" action with a "Return to Active Session" trigger when viewing read-only historical data.
- **Improved Visual Context**: Integrated dynamic header labels ("Viewing Historical Result") to provide clear context when users are browsing past analyses.

### Changed
- **Tactile Feedback**: Enhanced all navigation elements with `hover:scale-105` and `active:scale-95` micro-interactions.
- **Premium Glassmorphism**: Refined button backgrounds with `backdrop-blur-md` and `bg-white/40` for a true premium SaaS aesthetic.
- **Mobile UX**: Optimized touch targets (44px min height) for all new navigation buttons to ensure accessibility on smaller devices.

## [Phase 3.5 History & State Persistence] - 2026-03-13

### Added
- **Global State Management**: Implemented `HistoryContext` using React Context API to manage analysis results, user history, and loading states application-wide.
- **Premium History Page**: Built `src/pages/History.jsx` featuring a high-fidelity Glassmorphism design, animated result cards, and interactive match score badges.
- **Save on Success**: Automated logic in `App.jsx` to immediately persist successful AI analyses to Supabase for authenticated users.
- **Recent Activity Section**: Added a dynamic "Recent Activity" grid to the main Dashboard showing the last 3 analyses with quick-view capabilities.
- **State Synchronization**: Implemented logic to populate the Dashboard with historical data when selecting items from the History page.
- **Delete Functionality**: Added the ability for users to permanently remove specific analysis records from their history.

### Changed
- **App Architecture**: Wrapped the application in `HistoryProvider` and refactored state management to utilize the new global context.
- **Dashboard UI**: Integrated "Recent Activity" mini-cards and updated result sections to consume state from the global context.

## [Phase 3.1 AI Refactor (Preview Model)] - 2026-03-13

### Changed
- **Direct API Integration**: Removed LangChain dependency and migrated to a direct REST API implementation for Gemini.
- **Model Migration**: Switched target model to `gemini-2.5-flash-preview-09-2025` to resolve environment compatibility issues.
- **Unified Payload Structure**: Refined outgoing requests to use `systemInstruction` and `contents` parts as per Gemini 2.5 requirements.
- **Custom Retry Logic**: Implemented strict exponential backoff (1s, 2s, 4s, 8s, 16s) for all AI service calls.

### Removed
- **LangChain Library**: Cleaned up `src/lib/langchain.js` as it is no longer required for the direct API approach.

## [Phase 3 AI Logic Integration] - 2026-03-12

### Added
- **LangChain & Gemini Integration**: Initialized `src/lib/langchain.js` with `gemini-1.5-flash` for extraction and `gemini-1.5-pro` for high-quality reformulation.
- **Client-Side PDF Parsing**: Implemented `src/utils/pdfParser.js` using `pdfjs-dist` to extract clean text from PDF layers directly in the browser.
- **AI Analysis Service**: Created `analyzeCV` to extract keywords and calculate match scores with structured JSON output.
- **STAR Reformulator Service**: Created `reformulateCV` to rewrite CV sections using the STAR method in Markdown.
- **End-to-End Workflow**: Integrated parsing, analysis, and reformulation into the "Analyze Match" button in `App.jsx`.
- **Exponential Backoff**: Implemented retry logic for AI services to handle transient API issues.

### Changed
- **UI States**: Updated Dashboard to show real-time analysis status (Parsing, Scoring, etc.) and reflect real AI results in the ScoreDial and ComparisonView.
- **Database Persistence**: Automatic saving of match results to Supabase `cv_analysis` table upon successful analysis.

## [Phase 2.5 Tiered Auth Implementation] - 2026-03-12

### Added
- **Tiered Access Control**: Created conditionally gated navigation tabs. Guests cannot access the `History` tab.
- **Login Modal & Auth Page**: Implemented `src/pages/Auth.jsx` representing a beautifully designed Glassmorphism sign-in and sign-up interface. Used as both a standalone page and a Framer Motion-animated "blur-in" modal.
- **Data Sync Banner**: Added a subtle "Sync your data" action banner for guests on the dashboard encouraging sign-up for history persistence.
- **User Profile UI**: Updated the Navbar to dynamically show "Guest User" constraints or the registered user's associated email address with a responsive Logout button.
- **Database Profiles Schema**: Added `0001_tiered_access.sql` migration that introduces the `profiles` table to store extra metadata (like tiers), and ensures auto-generation via Postgres triggers upon user sign-up.

### Changed
- **useSupabase Hook**: Exposed `isAnonymous` and `isAuthenticated` state boolean flags along with `signIn` and `signUp` functions.
- **dbService Security**: Guarded `getUserHistory`. Anonymous users query requests immediately return an empty array protecting against illicit parameter fetching.
- **Bug Fix**: Improved error handling in `Auth.jsx` to provide specific guidance for `400 Bad Request` errors (e.g., unconfirmed emails or invalid credentials).
## [Phase 2 Backend & Supabase Integration] - 2026-03-12

### Added
- **Supabase Client**: Initialized via `src/lib/supabase.js` and added connection logging.
- **Authentication**: Added `src/hooks/useSupabase.js` to handle anonymous user fallback and user sessions.
- **Header Display**: Updated `src/App.jsx` navigation to conditionally show User ID string or "Guest" along with a `UserCircle` icon.
- **Database Services**: Created `src/services/dbService.js` exposing `saveAnalysis`, `getUserHistory`, `deleteAnalysis`, and `uploadCV`.
- **Database Schema**: Authored `supabase/migrations/0000_init.sql` containing the structured `cv_analysis` table, matching `PLAN.md`, with full Row Level Security (RLS) policies and storage bucket setup.
- **Testing Capabilities**: Added a temporary `Database` UI testing button in `App.jsx` to verify live Supabase writing and reading of data logic.
- **Phase 2 Verified: Auth, Database, and Storage fully operational.**

### Changed
- Installed `@supabase/supabase-js`.
## [Phase 1 UI Refinement] - 2026-03-12

### Added
- **Framer Motion Elements**: Integrated `framer-motion` for a smooth "fade-in-up" entrance sequence when the dashboard loads in `App.jsx`.
- **Micro-Interactions**: Added `hover:scale-[1.01] transition-all duration-300` wrapper classes to all major UI cards (`FileDropzone`, `ScoreDial`, `KeywordCloud`, `ComparisonView`, etc.).

### Changed
- **Glassmorphism & Depth**: Updated main panel styles to use `backdrop-blur-md bg-white/70` in `App.jsx`, `ScoreDial`, `KeywordCloud`, and `ComparisonView`.
- **High-Definition Borders**: Replaced heavy drop-shadows with thin, well-defined border strokes (`border-slate-200`, `border-indigo-200`).
- **Typography & Constrast**: Enhanced heading fonts with `tracking-tight` and `font-bold`. Implemented strong text contrast mappings using `slate-800` to `slate-500`.
- **FileDropzone**: Redesigned as a modern "Drop Area" that emphasizes a dashed stroke glowing soft indigo when active. Improved the indicator contrast.
- **ScoreDial**: Added a gradient (`score-gradient`) spanning from Emerald to Cyan for the progress bar. Greatly improved label positioning and sizes.
- **ComparisonView**: Re-themed into a dual "Code Editor" aesthetic featuring window dot controls, mono-font for original extracts, and clear inner boundaries.
