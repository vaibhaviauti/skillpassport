import React, { useState } from 'react';
import { HelpCircle, Award, ShieldCheck, ChevronRight } from 'lucide-react';
import { CredibilityScoreBreakdown } from '../../types';
import { ScoringExplanationModal } from './ScoringExplanationModal';

interface ScoreRingProps {
  scoreData: CredibilityScoreBreakdown;
  size?: number;
  strokeWidth?: number;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  scoreData,
  size = 180,
  strokeWidth = 12,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { totalScore, label } = scoreData;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;

  // Color mapping based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return { stroke: '#10B981', gradient: 'from-emerald-500 to-teal-600', text: 'text-emerald-600' };
    if (score >= 60) return { stroke: '#3B82F6', gradient: 'from-blue-600 to-indigo-600', text: 'text-blue-600' };
    if (score >= 30) return { stroke: '#F59E0B', gradient: 'from-amber-500 to-orange-600', text: 'text-amber-600' };
    return { stroke: '#94A3B8', gradient: 'from-slate-400 to-slate-600', text: 'text-slate-500' };
  };

  const colors = getScoreColor(totalScore);

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
          <svg className="transform -rotate-90" width={size} height={size}>
            {/* Background track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#E2E8F0"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered Score */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900">
              {totalScore}
            </span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              / 100
            </span>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              <ShieldCheck className="w-3 h-3" />
              <span>{label}</span>
            </div>
          </div>
        </div>

        {/* Why is my score button */}
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100/80 cursor-pointer shadow-xs"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Why is my score {totalScore}?</span>
          <ChevronRight className="w-3 h-3 text-indigo-400" />
        </button>
      </div>

      {showModal && (
        <ScoringExplanationModal
          scoreData={scoreData}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};
