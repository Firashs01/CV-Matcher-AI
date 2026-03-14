import React from 'react';

const KeywordCloud = ({ matchedKeywords, missingKeywords }) => {
  return (
    <div className="p-8 bg-white/70 backdrop-blur-md border border-slate-200 shadow-sm rounded-3xl space-y-6 h-full hover:scale-[1.01] transition-all duration-300">
      <h3 className="text-xl font-bold tracking-tight text-slate-800">Keyword Analysis</h3>
      
      <div>
        <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Matched Found</h4>
        <div className="flex flex-wrap gap-2">
          {matchedKeywords.length > 0 ? (
            matchedKeywords.map((kw, i) => (
              <span key={i} className="px-3 py-1 text-sm font-medium text-emerald-700 bg-emerald-100/80 border border-emerald-200 rounded-full shadow-sm">
                {kw}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400">No matching keywords found.</span>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Missing Required</h4>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.length > 0 ? (
            missingKeywords.map((kw, i) => (
              <span key={i} className="px-3 py-1 text-sm font-medium text-amber-700 bg-amber-100/80 border border-amber-200 rounded-full shadow-sm">
                {kw}
              </span>
            ))
          ) : (
            <span className="text-sm text-slate-400">All keywords matched!</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default KeywordCloud;
