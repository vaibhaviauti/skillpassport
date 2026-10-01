import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { analyzeSkillGap, SkillGapAnalysisResult } from '../../services/aiService';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Clock,
  Layers,
  Zap,
  Target,
  Check,
  RotateCw,
} from 'lucide-react';

export const SkillGapAnalyzer: React.FC = () => {
  const { skills, user, updateProfile, nextBestAction, completeNextBestAction, setActiveTab } = useApp();

  const targetRoles = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'AI/ML Engineer',
    'Software Engineer',
    'Cloud/DevOps Engineer',
    'Data Analyst',
  ];

  const currentTargetRole = user?.targetRole || 'Full Stack Developer';
  const [selectedRole, setSelectedRole] = useState(currentTargetRole);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [gapResult, setGapResult] = useState<SkillGapAnalysisResult | null>(null);

  const runAnalysis = async (role: string) => {
    setIsAnalyzing(true);
    const result = await analyzeSkillGap({
      targetRole: role,
      studentSkills: skills.map(s => s.name),
    });
    setGapResult(result);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    runAnalysis(selectedRole);
  }, [selectedRole, skills]);

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    updateProfile({ targetRole: role });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>AI Role Benchmark Intelligence</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Find My Skill Gap & Career Roadmap
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare your verified proof against market role expectations. No blind guessing.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <select
          value={selectedRole}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 shadow-2xs"
        >
          {targetRoles.map(role => (
            <option key={role} value={role}>
              🎯 Target: {role}
            </option>
          ))}
        </select>
      </div>

      {/* Next Best Action Card (Requirement 17) */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-amber-300 text-[11px] font-bold border border-indigo-400/30">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>YOUR NEXT BEST ACTION</span>
            </div>
            <h3 className="text-xl font-extrabold tracking-tight">
              «{nextBestAction.title}»
            </h3>
            <p className="text-xs text-indigo-200 leading-relaxed">
              <strong>Why?</strong> {nextBestAction.why}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            {nextBestAction.isCompleted ? (
              <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600/80 text-white rounded-xl text-xs font-bold border border-emerald-400">
                <Check className="w-4 h-4" />
                <span>Action Completed ✓</span>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Start Action
                </button>
                <button
                  onClick={completeNextBestAction}
                  className="px-4 py-2.5 bg-indigo-700/80 hover:bg-indigo-600 text-white border border-indigo-500/50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Mark Completed
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Career Readiness Progress Section */}
      {gapResult && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Target Role Benchmark
              </span>
              <h3 className="text-lg font-black text-slate-900">
                {selectedRole} Readiness
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {gapResult.readinessScore}%
                </span>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                  Career Readiness
                </span>
              </div>
            </div>
          </div>

          {/* Large Progress Bar */}
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 transition-all duration-700 rounded-full"
              style={{ width: `${gapResult.readinessScore}%` }}
            />
          </div>

          {/* Three Columns: Matched, Developing, Missing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Matched */}
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Matched ({gapResult.matchedSkills.length})</span>
              </div>
              <div className="space-y-1">
                {gapResult.matchedSkills.map(s => (
                  <div key={s} className="text-xs font-semibold text-emerald-900 flex items-center gap-1">
                    <span>✓</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Developing */}
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Developing / Partial</span>
              </div>
              <div className="space-y-1">
                {gapResult.developingSkills.map(s => (
                  <div key={s} className="text-xs font-semibold text-amber-900 flex items-center gap-1">
                    <span>⚠</span>
                    <span>{s} (Needs project proof)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Evidence Gaps ({gapResult.missingSkills.length})</span>
              </div>
              <div className="space-y-1">
                {gapResult.missingSkills.map(s => (
                  <div key={s} className="text-xs font-semibold text-rose-900 flex items-center gap-1">
                    <span>❌</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actionable Steps Roadmap (Requirement 16) */}
      {gapResult && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Your Personalized Skill Gap Closing Roadmap
            </h3>
          </div>

          <div className="space-y-3">
            {gapResult.actionableSteps.map(step => (
              <div
                key={step.step}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-start gap-3.5"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 font-mono">
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {step.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      ~{step.estimatedHours} hrs
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
