import React, { useState } from 'react';
import FileDropzone from './components/upload/FileDropzone';
import JDTextArea from './components/upload/JDTextArea';
import ScoreDial from './components/dashboard/ScoreDial';
import KeywordCloud from './components/dashboard/KeywordCloud';
import ComparisonView from './components/dashboard/ComparisonView';
import { BarChart2, FileText, CheckCircle2, UserCircle, Database, Check, Clock, ChevronRight, ArrowLeft, Lock as LockIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSupabase } from './hooks/useSupabase';
import { dbService } from './services/dbService';

import { supabase } from './lib/supabase';
import Auth from './pages/Auth';
import Navbar from './components/layout/Navbar';
import { extractTextFromPDF } from './utils/pdfParser';
import { analyzeCV, reformulateCV } from './services/aiService';
import { useHistory } from './context/HistoryContext';
import History from './pages/History';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';

function App() {
  const [cvFile, setCvFile] = useState(null);
  const [jdText, setJdText] = useState("");
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState(""); // Parsing, Scoring, Reformulating...
  const [analysisResult, setAnalysisResult] = useState(null);
  const [reformulatedText, setReformulatedText] = useState("");
  const [cvText, setCvText] = useState("");
  const { user, loading, isAnonymous, isAuthenticated, signOut } = useSupabase();
  const location = useLocation();
  const { 
    currentAnalysis, 
    history, 
    addAnalysis, 
    selectAnalysis, 
    refreshHistory, 
    isLoading: isHistoryLoading 
  } = useHistory();

  // Load history on mount or when user changes
  React.useEffect(() => {
    if (user) {
      refreshHistory(user.id, isAnonymous);
    }
  }, [user, isAnonymous, refreshHistory]);

  // Handle case where we click "View" from History
  React.useEffect(() => {
    if (currentAnalysis) {
      setJdText(currentAnalysis.job_description || "");
    }
  }, [currentAnalysis]);

  // Derived state for the UI
  const displayScore = currentAnalysis?.match_score || 0;
  const displayMatchedKeywords = currentAnalysis?.matched_keywords || [];
  const displayMissingKeywords = currentAnalysis?.missing_keywords || [];
  const displayOriginalText = cvText || "Provide a CV for analysis...";
  const displayReformulatedMarkdown = currentAnalysis?.reformulated_cv_markdown || "Reformulation will appear here...";

  const isClientReady = !!supabase;
  const isReadyToAnalyze = isClientReady && !!user && !loading;

  const handleExitHistory = () => {
    window.location.reload();
  };

  const handleAnalyze = async () => {
    if (!cvFile || !jdText) {
      alert("Please provide both a CV and a Job Description.");
      return;
    }

    if (cvFile.type !== 'application/pdf') {
       alert("AI Analysis currently only supports PDF files. Please upload a PDF version of your CV.");
       return;
    }

    try {
      setIsAnalyzing(true);
      setAnalysisStatus("Parsing PDF...");
      
      const extractedText = await extractTextFromPDF(cvFile);
      setCvText(extractedText);
      
      setAnalysisStatus("Analyzing Match...");
      const result = await analyzeCV(extractedText, jdText);
      
      setAnalysisStatus("Reformulating CV...");
      const reformulated = await reformulateCV(extractedText, jdText, result.missing_keywords);
      
      const analysisData = {
        job_description: jdText,
        match_score: result.match_score,
        matched_keywords: result.matched_keywords,
        missing_keywords: result.missing_keywords,
        reformulated_cv_markdown: reformulated,
      };

      if (isAuthenticated && !isAnonymous && user) {
        setAnalysisStatus("Saving Result...");
        const saved = await dbService.saveAnalysis({
          ...analysisData,
          user_id: user.id,
          original_cv_url: null // Future: upload and store URL
        });
        addAnalysis(saved);
      } else {
        // For guest users, just set current analysis in local state
        addAnalysis({ ...analysisData, id: 'guest-' + Date.now() });
      }
      
      setAnalysisStatus("Complete!");
      setTimeout(() => setAnalysisStatus(""), 2000);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Analysis failed: " + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 relative">
      <Navbar 
        user={user} 
        isAuthenticated={isAuthenticated} 
        isAnonymous={isAnonymous} 
        signOut={signOut} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <Routes>
          <Route path="/login" element={<Auth onSuccess={() => window.location.href = '/'} initialIsLogin={true} />} />
          <Route path="/signup" element={<Auth onSuccess={() => window.location.href = '/'} initialIsLogin={false} />} />
          <Route path="/history" element={
            isAnonymous ? <Navigate to="/signup" replace /> : <History />
          } />
          <Route path="/" element={
            <>
              {isAnonymous && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-indigo-50/80 backdrop-blur-md border border-indigo-200 text-indigo-800 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center shadow-sm"
                >
                  <div className="mb-4 sm:mb-0">
                    <strong className="block text-indigo-900">Sync your data and unlock history!</strong> 
                    <span className="text-sm text-indigo-700">Create an account to permanently save your CV analysis history.</span>
                  </div>
                  <Link 
                    to="/signup" 
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors shrink-0"
                  >
                    Create Account
                  </Link>
                </motion.div>
              )}

            {/* Recent Activity Mini-Section */}
            {!isAnonymous && history.length > 0 && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {history.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => selectAnalysis(item)}
                    className="flex items-center p-4 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-2xl text-left hover:bg-white hover:border-indigo-300 transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      item.match_score >= 80 ? 'bg-emerald-100 text-emerald-600' : 
                      item.match_score >= 50 ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                    }`}>
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-sm font-bold text-slate-700 truncate">
                        {item.job_description.slice(0, 30)}...
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </motion.section>
            )}

            {/* Input Section */}
            <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {currentAnalysis?.id ? "Viewing Historical Result" : "Upload & Analyze"}
              </h2>
              <p className="text-slate-500">
                {currentAnalysis?.id 
                  ? "You are viewing a previously saved analysis. Results are read-only." 
                  : "Provide your Resume and the Target Job Description to see how well you match."}
              </p>
            </div>
            {currentAnalysis?.id && (
              <button 
                onClick={handleExitHistory}
                className="flex items-center space-x-2 bg-indigo-50/80 backdrop-blur-md text-indigo-600 px-5 py-3 rounded-xl text-sm font-bold border border-indigo-100 hover:bg-indigo-100 hover:scale-105 transition-all active:scale-95 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Active Session</span>
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-sm hover:scale-[1.01] transition-all duration-300">
            <div className="flex flex-col bg-slate-100/50 p-6 rounded-2xl border border-slate-200/50">
               <label className="flex items-center space-x-2 text-lg font-bold tracking-tight text-slate-800 mb-4">
                 <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                 <span>Your Resume</span>
               </label>
               <FileDropzone file={cvFile} setFile={setCvFile} />
            </div>
            <div className="flex flex-col bg-slate-100/50 p-6 rounded-2xl border border-slate-200/50">
               <JDTextArea value={jdText} onChange={setJdText} />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end items-center space-x-4">
             {analysisStatus && (
               <div className="text-sm font-medium text-slate-500 animate-pulse">
                 {analysisStatus}
               </div>
             )}
             
             {/* Analyze Button - Only show if NOT viewing history */}
             {!currentAnalysis?.id ? (
               <button 
                 onClick={handleAnalyze}
                 disabled={!isReadyToAnalyze || isAnalyzing || !cvFile || !jdText}
                 className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 text-white font-bold tracking-tight py-3 px-8 rounded-xl shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:scale-105 transition-all duration-200"
               >
                 {isAnalyzing ? "Processing..." : "Analyze Match"}
               </button>
             ) : (
               <button 
                 onClick={handleExitHistory}
                 className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-tight py-3 px-8 rounded-xl shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:scale-105 transition-all duration-200"
               >
                 Return to Active Session
               </button>
             )}
          </div>
        </motion.section>

        <hr className="border-slate-200/60" />

        {/* Results Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Analysis Results</h2>
            <p className="text-slate-500">Review your match score and keyword breakdown.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <ScoreDial score={displayScore} />
            </div>
            <div className="md:col-span-2">
              <KeywordCloud 
                matchedKeywords={displayMatchedKeywords}
                missingKeywords={displayMissingKeywords} 
              />
            </div>
          </div>

            <ComparisonView 
              originalText={displayOriginalText} 
              reformulatedMarkdown={displayReformulatedMarkdown} 
            />
          </motion.section>
          </>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
