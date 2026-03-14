import React from 'react';
import ReactMarkdown from 'react-markdown';

const ComparisonView = ({ originalText, reformulatedMarkdown }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full mt-6">
      {/* Original CV */}
      <div className="flex flex-col h-full bg-white/70 backdrop-blur-md border border-slate-200 shadow-sm rounded-3xl overflow-hidden hover:scale-[1.01] transition-all duration-300">
        <div className="bg-slate-100/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center space-x-3">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-rose-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
          </div>
          <h3 className="font-bold tracking-tight text-slate-700 text-sm uppercase">Original CV Extract</h3>
        </div>
        <div className="p-8 overflow-y-auto max-h-[600px] text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-mono bg-slate-50/50">
          {originalText || "No original content available."}
        </div>
      </div>

      {/* Reformulated CV */}
      <div className="flex flex-col h-full bg-white/70 backdrop-blur-md border border-indigo-200 shadow-sm rounded-3xl overflow-hidden hover:scale-[1.01] transition-all duration-300">
        <div className="bg-indigo-50/80 backdrop-blur-md border-b border-indigo-100 px-6 py-4 flex items-center space-x-3">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-indigo-400/50"></div>
            <div className="w-3 h-3 rounded-full bg-indigo-400/50"></div>
            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
          </div>
          <h3 className="font-bold tracking-tight text-indigo-900 text-sm uppercase">Reformulated CV (Optimized)</h3>
        </div>
        <div className="p-8 overflow-y-auto max-h-[600px] prose prose-sm prose-slate max-w-none text-slate-800 bg-white/50">
          {reformulatedMarkdown ? (
            <ReactMarkdown>{reformulatedMarkdown}</ReactMarkdown>
          ) : (
            <span className="text-gray-500 italic">Optimized version will appear here...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
