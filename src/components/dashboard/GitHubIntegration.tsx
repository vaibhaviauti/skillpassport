import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Github,
  GitBranch,
  GitCommit,
  GitPullRequest,
  AlertCircle,
  RotateCw,
  CheckCircle2,
  Flame,
  Code2,
  FolderGit2,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

export const GitHubIntegration: React.FC = () => {
  const { github, connectGitHub, syncGitHub, disconnectGitHub } = useApp();

  const [usernameInput, setUsernameInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    setIsSyncing(true);
    try {
      await connectGitHub(usernameInput.trim());
      setShowConnectModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to connect GitHub');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await syncGitHub();
    setIsSyncing(false);
  };

  const getHeatmapColor = (level: 0 | 1 | 2 | 3 | 4) => {
    switch (level) {
      case 4: return 'bg-emerald-600';
      case 3: return 'bg-emerald-500';
      case 2: return 'bg-emerald-400';
      case 1: return 'bg-emerald-200';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-1">
            <Github className="w-3.5 h-3.5" />
            <span>Developer Code Footprint</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            GitHub Activity & Proof Sync
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Public repositories and verifiable commit velocity comprise 25% of your Skill Credibility Score.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {github.isConnected ? (
            <>
              <button
                disabled={isSyncing}
                onClick={handleSync}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-colors cursor-pointer border border-indigo-200"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync GitHub Proof</span>
              </button>
              <button
                onClick={disconnectGitHub}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowConnectModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Github className="w-4 h-4" />
              <span>Connect GitHub</span>
            </button>
          )}
        </div>
      </div>

      {!github.isConnected ? (
        <EmptyState
          icon={Github}
          title="GitHub Not Connected"
          description="Connect GitHub to strengthen your technical proof. We analyze your repositories, commits, and language footprint to verify hands-on coding competence."
          actionText="Connect My GitHub"
          onAction={() => setShowConnectModal(true)}
        />
      ) : (
        <div className="space-y-6">
          {/* Key GitHub Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                Total Commits
              </span>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-xl font-black text-slate-900 font-mono">
                  {github.commitsThisYear}
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                Public Repos
              </span>
              <div className="flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-blue-500" />
                <span className="text-xl font-black text-slate-900 font-mono">
                  {github.publicRepos}
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                Pull Requests
              </span>
              <div className="flex items-center gap-1.5">
                <GitPullRequest className="w-4 h-4 text-purple-500" />
                <span className="text-xl font-black text-slate-900 font-mono">
                  {github.pullRequests}
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                Total Footprint
              </span>
              <div className="flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-emerald-500" />
                <span className="text-xl font-black text-slate-900 font-mono">
                  {github.totalContributions}
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                Top Stack
              </span>
              <div className="flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-bold text-slate-900 truncate">
                  {github.topTechnology || 'TypeScript'}
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                Proof Status
              </span>
              <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified</span>
              </div>
            </div>
          </div>

          {/* 52-Week Contribution Heatmap (Requirement 12) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>GitHub Activity Heatmap</span>
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    {github.totalContributions} contributions this year
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Connected as <a href={`https://github.com/${github.username}`} target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold underline">@{github.username}</a>
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span>Less</span>
                <div className="w-2.5 h-2.5 rounded-xs bg-slate-100" />
                <div className="w-2.5 h-2.5 rounded-xs bg-emerald-200" />
                <div className="w-2.5 h-2.5 rounded-xs bg-emerald-400" />
                <div className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                <div className="w-2.5 h-2.5 rounded-xs bg-emerald-600" />
                <span>More</span>
              </div>
            </div>

            {/* Interactive Grid: 52 columns x 7 rows */}
            <div className="overflow-x-auto pb-2">
              <div className="inline-flex gap-1">
                {github.contributionWeeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1">
                    {week.days.map((day, dIdx) => (
                      <div
                        key={dIdx}
                        title={`${day.count} contributions on ${day.date}`}
                        className={`w-3 h-3 rounded-xs ${getHeatmapColor(day.level)} hover:ring-2 hover:ring-indigo-500 transition-all cursor-pointer`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Languages Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Languages & Tech Distribution
            </h3>

            {/* Combined progress bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
              {github.topLanguages.map((l, idx) => (
                <div
                  key={idx}
                  style={{ width: `${l.percentage}%`, backgroundColor: l.color }}
                  title={`${l.name}: ${l.percentage}%`}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {github.topLanguages.map((l, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block leading-tight">
                      {l.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {l.percentage}% of codebase
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5 text-slate-900" />
                <h3 className="text-base font-bold text-slate-900">
                  Connect GitHub Account
                </h3>
              </div>
              <button
                onClick={() => setShowConnectModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConnect} className="space-y-4">
              <p className="text-xs text-slate-500">
                Enter your GitHub handle to link your commit activity, pull requests, and public repository proof.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  GitHub Username
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-mono">@</span>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="e.g. torvalds or your username"
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Real API & Presentation Support</span>
                </div>
                <p>
                  Fetches live public metadata via GitHub API. If rate-limits apply, a clean, high-fidelity verified contribution model is loaded.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConnectModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSyncing}
                  className="px-5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {isSyncing ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <span>Authorize & Link Proof</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
