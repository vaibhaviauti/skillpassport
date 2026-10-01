import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  FolderGit2,
  GitBranch,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
} from 'lucide-react';

export const CareerReadinessView: React.FC = () => {
  const { careerReadiness, setActiveTab } = useApp();

  const metrics = [
    {
      title: 'Technical Proof',
      score: careerReadiness.technicalProof,
      targetTab: 'skills',
      icon: ShieldCheck,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      barColor: 'bg-indigo-600',
      description: 'Calculated from multi-skill verification density and verified rating level.',
    },
    {
      title: 'Project Proof',
      score: careerReadiness.projectProof,
      targetTab: 'projects',
      icon: FolderGit2,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      barColor: 'bg-blue-600',
      description: 'Evaluated from verified codebase repositories, commit cadence, and student contribution %.',
    },
    {
      title: 'GitHub Evidence',
      score: careerReadiness.githubEvidence,
      targetTab: 'github',
      icon: GitBranch,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      barColor: 'bg-purple-600',
      description: 'Continuous 52-week activity heatmap, public pull requests, and multi-language repositories.',
    },
    {
      title: 'Industry Exposure',
      score: careerReadiness.industryExposure,
      targetTab: 'achievements',
      icon: Briefcase,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      barColor: 'bg-amber-500',
      description: 'Jury-evaluated hackathon podiums, internships, and accredited industry credentials.',
    },
    {
      title: 'Proctored Assessments',
      score: careerReadiness.assessmentsScore,
      targetTab: 'skills',
      icon: GraduationCap,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      barColor: 'bg-emerald-600',
      description: 'Algorithmic, time-complexity, and framework verification challenges passed.',
    },
    {
      title: 'Professional Profile',
      score: careerReadiness.professionalProfile,
      targetTab: 'settings',
      icon: CheckCircle2,
      color: 'text-teal-600 bg-teal-50 border-teal-200',
      barColor: 'bg-teal-600',
      description: 'Institutional email validation, portfolio links, and cryptographic identity completeness.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Multi-Factor Benchmark Engine</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Career Readiness Passport ({careerReadiness.overall}%)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Every percentage represents real, authenticated evidence—never unsubstantiated resume claims.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-3xl font-black text-slate-900 font-mono">
            {careerReadiness.overall}%
          </span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {careerReadiness.overall >= 80 ? 'Market Ready' : careerReadiness.overall >= 60 ? 'Competitive' : 'Developing'}
          </span>
        </div>
      </div>

      {/* Grid of Individual Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {metrics.map(m => {
          const Icon = m.icon;
          return (
            <div
              key={m.title}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl border ${m.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {m.title}
                    </h3>
                  </div>

                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    {m.score}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${m.barColor}`}
                    style={{ width: `${m.score}%` }}
                  />
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {m.description}
                </p>
              </div>

              <button
                onClick={() => setActiveTab(m.targetTab)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors pt-3 border-t border-slate-100 cursor-pointer"
              >
                <span>View Attached Proof</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
