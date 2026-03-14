import React from 'react';

const ScoreDial = ({ score }) => {
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let textColor = "text-rose-500";
  if (score >= 75) textColor = "text-emerald-500";
  else if (score >= 50) textColor = "text-amber-500";

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/70 backdrop-blur-md border border-slate-200 shadow-sm rounded-3xl hover:scale-[1.01] transition-all duration-300">
      <h3 className="text-xl font-bold tracking-tight text-slate-800 mb-4">Match Score</h3>
      <div className="relative flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <defs>
            <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <circle
            stroke="currentColor"
            className="text-gray-100"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="url(#score-gradient)"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out`}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <span className={`absolute text-4xl font-bold tracking-tighter ${textColor}`}>
          {score}%
        </span>
      </div>
      <p className="mt-6 text-sm text-slate-500 text-center font-medium">
        {score >= 75 ? "Great match! Your CV alignment is strong." : score >= 50 ? "Good start, but some keywords are missing." : "Needs significant improvement for ATS systems."}
      </p>
    </div>
  );
};

export default ScoreDial;
