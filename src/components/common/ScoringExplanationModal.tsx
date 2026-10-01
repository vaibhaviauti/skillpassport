import React from 'react';
import { X, ShieldAlert, CheckCircle2, Info, GitBranch, FolderGit2, GraduationCap, Trophy, Award } from 'lucide-react';
import { CredibilityScoreBreakdown } from '../../types';

interface ScoringExplanationModalProps {
  scoreData: CredibilityScoreBreakdown;
  onClose: () => void;
}

export const ScoringExplanationModal: React.FC<ScoringExplanationModalProps> = ({
  scoreData,
  onClose,
}) => {
  const pillars = [
    {
      title: 'Verified Projects',
      earned: scoreData.verifiedProjectsPoints,
      max: 35,
      weight: '35%',
      icon: FolderGit2,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      barColor: 'bg-blue-600',
      description: 'Repositories analyzed with commit history, codebase contribution %, and duration signals.',
    },
    {
      title: 'GitHub Evidence',
      earned: scoreData.githubEvidencePoints,
      max: 25,
      weight: '25%',
      icon: GitBranch,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      barColor: 'bg-indigo-600',
      description: 'Active public commit frequency, contribution graph streaks, and multi-language repositories.',
    },
    {
      title: 'Technical Assessments',
      earned: scoreData.assessmentPoints,
      max: 15,
      weight: '15%',
      icon: GraduationCap,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      barColor: 'bg-emerald-600',
      description: 'Proctored timed algorithmic and framework verification challenges passed.',
    },
    {
      title: 'Hackathons & Achievements',
      earned: scoreData.achievementsPoints,
      max: 15,
      weight: '15%',
      icon: Trophy,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      barColor: 'bg-amber-500',
      description: 'Jury-evaluated hackathon podiums, open-source merges, and competitive awards.',
    },
    {
      title: 'Certificates (Anti-Stuffing Cap)',
      earned: scoreData.certificatesPoints,
      max: 10,
      weight: '10%',
      icon: Award,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      barColor: 'bg-purple-600',
      description: 'Verified industry certificates. Strictly capped at 10% to prevent certificate spamming.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/30">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-100/60 px-2.5 py-0.5 rounded-full mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Skill Credibility Engine v2.4</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Why is my score {scoreData.totalScore}/100?
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              Unlike traditional resumes, SkillPass computes your score strictly from{' '}
              <strong>verifiable proof</strong>. A thousand unverified certificates cannot match real codebase commits and jury-evaluated projects.
            </p>
          </div>

          <div className="space-y-3.5">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              const percentage = Math.round((p.earned / p.max) * 100);
              return (
                <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg border ${p.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-slate-900 block leading-tight">
                          {p.title}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Weight: {p.weight}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-900">
                        +{p.earned}
                      </span>
                      <span className="text-xs text-slate-400"> / {p.max} pts</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden my-1.5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${p.barColor}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mathematical breakdown footer */}
          <div className="mt-4 p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs space-y-1">
            <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">
              Audit Breakdown Log
            </div>
            <div className="flex justify-between">
              <span>Verified Projects</span>
              <span className="text-emerald-400">+{scoreData.verifiedProjectsPoints}</span>
            </div>
            <div className="flex justify-between">
              <span>GitHub Evidence</span>
              <span className="text-emerald-400">+{scoreData.githubEvidencePoints}</span>
            </div>
            <div className="flex justify-between">
              <span>Assessments Passed</span>
              <span className="text-emerald-400">+{scoreData.assessmentPoints}</span>
            </div>
            <div className="flex justify-between">
              <span>Achievements & Hackathons</span>
              <span className="text-emerald-400">+{scoreData.achievementsPoints}</span>
            </div>
            <div className="flex justify-between">
              <span>Certificates (Capped)</span>
              <span className="text-emerald-400">+{scoreData.certificatesPoints}</span>
            </div>
            <div className="pt-2 border-t border-slate-700 flex justify-between font-bold text-sm">
              <span>Credibility Score</span>
              <span className="text-emerald-300">{scoreData.totalScore} / 100</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Audit Hash: <code className="text-slate-700 font-mono">0x9e88b...verified</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
