import React from 'react';
import { FileText } from 'lucide-react';

const JDTextArea = ({ value, onChange }) => {
  return (
    <div className="flex flex-col w-full h-full space-y-2">
      <label htmlFor="jd-input" className="flex items-center space-x-2 text-lg font-bold tracking-tight text-slate-800 mb-2">
        <FileText className="w-5 h-5 text-indigo-600" />
        <span>Job Description</span>
      </label>
      <textarea
        id="jd-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the Job Description here..."
        className="w-full h-64 p-5 bg-white/50 backdrop-blur-md border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-300 shadow-sm hover:border-indigo-400 text-slate-700"
      />
    </div>
  );
};

export default JDTextArea;
