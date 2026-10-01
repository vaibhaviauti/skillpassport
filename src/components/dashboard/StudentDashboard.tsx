import React from 'react';
import { useApp } from '../../context/AppContext';
import { ScoreRing } from '../common/ScoreRing';
import { VerificationBadge } from '../common/VerificationBadge';
import {
  ShieldCheck,
  FolderGit2,
  GitBranch,
  GraduationCap,
  Trophy,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Share2,
  Calendar,
  ExternalLink,
  Plus,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    user,
    skills,
    projects,
    github,
    achievements,
    certificates,
    evidence,
    credibilityScore,
    careerReadiness,
    nextBestAction,
    completeNextBestAction,
    setActiveTab,
  } = useApp();

  // Profile completion calculation (Requirement 29)
  const missingItems: string[] = [];
  if (!user?.portfolio) missingItems.push('Add portfolio URL');
  if (!github.isConnected) missingItems.push('Connect GitHub');
  if (projects.length === 0) missingItems.push('Add project evidence');
  if (evidence.filter(e => e.category === 'Assessments').length === 0) missingItems.push('Pass skill assessment');

  const profileCompletionPercent = Math.max(
    40,
    100 - missingItems.length * 15
  );

  const verifiedSkillsCount = skills.filter(s => s.status === 'VERIFIED').length;
  const verifiedProjectsCount = projects.filter(p => p.isVerified).length;

  return (
    <div className="space-y-6">
      {/* Profile Overview & Credibility Score Cards (Requirement 4 & 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile Overview Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-indigo-50 shadow-md shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-md">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'SP'}
                </div>
              )}

              <div className="text-center sm:text-left space-y-1 flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl font-black text-slate-900">
                    {user?.name || 'Aarav Sharma'}
                  </h2>
                  {user?.isCollegeEmailVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Institutional Verified</span>
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-slate-500">
                  {user?.college || 'Indian Institute of Technology (IIT) Bombay'} • {user?.degree} in {user?.branch} • Class of {user?.gradYear}
                </p>

                <p className="text-xs text-slate-600 leading-relaxed pt-1 line-clamp-2">
                  {user?.bio || 'Building verifiable distributed systems with code commits and open source activity.'}
                </p>
              </div>
            </div>

            {/* Profile Completion Bar (Requirement 29) */}
            <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">
                  Profile Completeness: <strong className="text-indigo-600">{profileCompletionPercent}% Complete</strong>
                </span>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Complete Profile
                </button>
              </div>

              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletionPercent}%` }}
                />
              </div>

              {missingItems.length > 0 && (
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 pt-1">
                  <span className="text-slate-400 font-bold">Suggested:</span>
                  {missingItems.map(item => (
                    <span key={item} className="flex items-center gap-1 text-amber-700 font-medium">
                      <span>⚠</span>
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-100 mt-4 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Skills</span>
              <span className="text-lg font-black text-slate-900 font-mono">{verifiedSkillsCount}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Projects</span>
              <span className="text-lg font-black text-slate-900 font-mono">{verifiedProjectsCount}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Git Commits</span>
              <span className="text-lg font-black text-slate-900 font-mono">{github.commitsThisYear || 0}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Readiness</span>
              <span className="text-lg font-black text-emerald-600 font-mono">{careerReadiness.overall}%</span>
            </div>
          </div>
        </div>

        {/* Right: Skill Credibility Score Card (Requirement 5) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center justify-between text-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 inline-block mb-3">
              Skill Credibility Engine
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mb-4">
              Cryptographic Score
            </h3>
          </div>

          <ScoreRing scoreData={credibilityScore} size={160} strokeWidth={11} />

          <p className="text-[11px] text-slate-500 mt-4 max-w-xs leading-relaxed">
            Computed from verified projects (35%), GitHub (25%), assessments (15%), achievements (15%), and capped certs (10%).
          </p>
        </div>
      </div>

      {/* Next Best Action Card (Requirement 17) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-amber-300 text-[11px] font-bold border border-indigo-400/30">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>YOUR NEXT BEST ACTION</span>
          </div>
          <h3 className="text-lg font-black tracking-tight">
            «{nextBestAction.title}»
          </h3>
          <p className="text-xs text-indigo-200">
            {nextBestAction.why}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          {nextBestAction.isCompleted ? (
            <span className="px-3.5 py-1.5 bg-emerald-600/80 text-white rounded-xl text-xs font-bold border border-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Milestone Achieved ✓</span>
            </span>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('projects')}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Start Action
              </button>
              <button
                onClick={completeNextBestAction}
                className="px-3.5 py-2 bg-indigo-700/80 hover:bg-indigo-600 text-white border border-indigo-500/50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Mark Done
              </button>
            </>
          )}
        </div>
      </div>

      {/* Skill Growth Timeline (Requirement 18: Shows student development over time) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Skill Growth Trajectory Timeline</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Demonstrates consistent progression and commitment rather than static resume snapshot.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('achievements')}
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
          >
            <span>Full Timeline</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-black uppercase text-indigo-600 font-mono block">2024</span>
            <h4 className="text-xs font-bold text-slate-900">Python & Web Foundations</h4>
            <p className="text-[11px] text-slate-500">First repository initialized and algorithmic problem solving started.</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-black uppercase text-indigo-600 font-mono block">2025</span>
            <h4 className="text-xs font-bold text-slate-900">Timed Assessment & 1st Project</h4>
            <p className="text-[11px] text-slate-500">Passed proctored challenge and delivered full-stack architecture.</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-black uppercase text-indigo-600 font-mono block">2026</span>
            <h4 className="text-xs font-bold text-slate-900">Hackathon Podiums & CI/CD</h4>
            <p className="text-[11px] text-slate-500">1st place national prize with 247+ verified commits this year.</p>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
            <span className="text-[10px] font-black uppercase text-emerald-700 font-mono block">TODAY</span>
            <h4 className="text-xs font-bold text-emerald-900">Full-Stack Verified Passport</h4>
            <p className="text-[11px] text-emerald-700">Digital credential anchor active with 86/100 credibility.</p>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('skills')}
          className="p-4 bg-white hover:bg-indigo-50/50 rounded-2xl border border-slate-200 shadow-xs transition-all text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-600 flex items-center justify-center transition-colors mb-2">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Manage Skills</h4>
          <span className="text-[11px] text-slate-500">{skills.length} skills listed</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className="p-4 bg-white hover:bg-blue-50/50 rounded-2xl border border-slate-200 shadow-xs transition-all text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 group-hover:bg-blue-600 group-hover:text-white text-blue-600 flex items-center justify-center transition-colors mb-2">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Project Engine</h4>
          <span className="text-[11px] text-slate-500">{projects.length} repositories</span>
        </button>

        <button
          onClick={() => setActiveTab('gap')}
          className="p-4 bg-white hover:bg-purple-50/50 rounded-2xl border border-slate-200 shadow-xs transition-all text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-50 group-hover:bg-purple-600 group-hover:text-white text-purple-600 flex items-center justify-center transition-colors mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Skill Gap AI</h4>
          <span className="text-[11px] text-slate-500">{user?.targetRole || 'Full Stack'}</span>
        </button>

        <button
          onClick={() => setActiveTab('passport')}
          className="p-4 bg-white hover:bg-emerald-50/50 rounded-2xl border border-slate-200 shadow-xs transition-all text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white text-emerald-600 flex items-center justify-center transition-colors mb-2">
            <Share2 className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Public Passport</h4>
          <span className="text-[11px] text-slate-500">QR & PDF ready</span>
        </button>
      </div>
    </div>
  );
};
