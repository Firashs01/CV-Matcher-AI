import React from 'react';
import { motion } from 'framer-motion';
import { useHistory } from '../context/HistoryContext';
import { useSupabase } from '../hooks/useSupabase';
import { Clock, Trash2, Eye, Calendar, Award, Briefcase } from 'lucide-react';

const History = () => {
  const { history, isLoading, deleteAnalysis, selectAnalysis } = useHistory();
  const { user } = useSupabase();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
       <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="text-center py-20 bg-white/50 backdrop-blur-md rounded-3xl border border-white/20"
      >
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">Please log in</h2>
        <p className="text-slate-500">You need to be logged in to view your history.</p>
      </motion.div>
    );
  }

  if (history.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="text-center py-20 bg-white/50 backdrop-blur-md rounded-3xl border border-white/20"
      >
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">No Analysis History Yet</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          Start by analyzing your first CV. Your results will automatically appear here for future reference.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Your History</h2>
          <p className="text-slate-500">Review, compare, and manage your past CV analyses.</p>
        </div>
        <div className="text-sm font-medium text-slate-400 bg-slate-100 px-4 py-2 rounded-full">
          {history.length} {history.length === 1 ? 'Record' : 'Records'}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {history.map((record, index) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 overflow-hidden"
          >
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${
               record.match_score >= 80 ? 'bg-emerald-500' : 
               record.match_score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
            }`}></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              {/* Left Side: Score & Date */}
              <div className="flex items-center space-x-6">
                <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border-2 ${
                  record.match_score >= 80 ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 
                  record.match_score >= 50 ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-rose-50 border-rose-200 text-rose-600'
                }`}>
                  <span className="text-xl font-black leading-none">{record.match_score}%</span>
                  <span className="text-[10px] font-bold uppercase tracking-tighter mt-1 opacity-70">Match</span>
                </div>
                
                <div>
                  <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                    <Calendar className="w-3 h-3 mr-1.5" />
                    {new Date(record.created_at).toLocaleDateString(undefined, { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1 max-w-md">
                    {record.job_description.slice(0, 50)}...
                  </h3>
                </div>
              </div>

              {/* Middle Side: Keywords Summary */}
              <div className="hidden lg:flex items-center space-x-12 px-8 border-x border-slate-100">
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Found</span>
                  <div className="flex items-center text-emerald-600 bg-emerald-100/50 px-2.5 py-0.5 rounded-lg text-sm font-bold">
                    <Award className="w-3.5 h-3.5 mr-1" />
                    {record.matched_keywords?.length || 0}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Missing</span>
                   <div className="flex items-center text-rose-600 bg-rose-100/50 px-2.5 py-0.5 rounded-lg text-sm font-bold">
                     <Briefcase className="w-3.5 h-3.5 mr-1" />
                     {record.missing_keywords?.length || 0}
                   </div>
                </div>
              </div>

              {/* Right Side: Actions */}
              <div className="flex items-center space-x-3 self-end md:self-center">
                <button
                  onClick={() => selectAnalysis(record)}
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-all hover:scale-105"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => deleteAnalysis(record.id)}
                  className="p-2.5 bg-slate-100 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all"
                  title="Delete Analysis"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default History;
