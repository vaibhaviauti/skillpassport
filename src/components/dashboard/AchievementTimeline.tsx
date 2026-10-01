import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AchievementItem } from '../../types';
import { VerificationBadge } from '../common/VerificationBadge';
import { EmptyState } from '../common/EmptyState';
import {
  Trophy,
  Plus,
  Calendar,
  Building,
  Award,
  Sparkles,
  GitPullRequest,
  CheckCircle2,
  Medal,
} from 'lucide-react';

export const AchievementTimeline: React.FC = () => {
  const { achievements, addAchievement } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState<AchievementItem['type']>('Hackathon');
  const [organization, setOrganization] = useState('');
  const [year, setYear] = useState<number>(2026);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [rankOrRole, setRankOrRole] = useState('1st Place Winner');
  const [relatedSkillsInput, setRelatedSkillsInput] = useState('Python, React');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !organization.trim()) return;

    addAchievement({
      title: title.trim(),
      type,
      organization: organization.trim(),
      year,
      date,
      description: description.trim(),
      rankOrRole: rankOrRole.trim(),
      relatedSkills: relatedSkillsInput.split(',').map(s => s.trim()).filter(Boolean),
    });

    setTitle('');
    setOrganization('');
    setDescription('');
    setShowAddModal(false);
  };

  // Group achievements by year in descending order
  const years = Array.from(new Set(achievements.map(a => a.year))).sort((a, b) => b - a);

  const getTypeIcon = (t: AchievementItem['type']) => {
    switch (t) {
      case 'Hackathon': return Trophy;
      case 'Award': return Medal;
      case 'Open Source': return GitPullRequest;
      default: return Award;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>Chronological Proof Log</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Achievement & Hackathon Timeline ({achievements.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Competitive events, hackathon podiums, and open source merges verify real-world execution capacity.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Achievement</span>
        </button>
      </div>

      {achievements.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No Achievements Recorded Yet"
          description="Log hackathons, coding contests, open source contributions, and technical awards to demonstrate practical execution under pressure."
          actionText="Add Hackathon / Award"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="space-y-8">
          {years.map(yr => {
            const yearItems = achievements.filter(a => a.year === yr);

            return (
              <div key={yr} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-indigo-600 text-white font-black text-sm rounded-xl font-mono shadow-xs">
                    {yr}
                  </div>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-100 ml-4 space-y-6">
                  {yearItems.map(item => {
                    const Icon = getTypeIcon(item.type);

                    return (
                      <div key={item.id} className="relative group">
                        {/* Timeline dot */}
                        <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center text-indigo-600 shadow-2xs group-hover:scale-110 transition-transform">
                          <Icon className="w-3 h-3" />
                        </div>

                        {/* Card */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                  {item.type}
                                </span>
                                <span className="text-xs text-slate-400 font-mono">
                                  {item.date}
                                </span>
                              </div>
                              <h3 className="text-base font-bold text-slate-900 mt-1">
                                {item.title}
                              </h3>
                              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <Building className="w-3.5 h-3.5 text-slate-400" />
                                <span>{item.organization}</span>
                                {item.rankOrRole && (
                                  <>
                                    <span>•</span>
                                    <strong className="text-indigo-600 font-semibold">{item.rankOrRole}</strong>
                                  </>
                                )}
                              </p>
                            </div>

                            <VerificationBadge status={item.status} size="sm" />
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed my-2.5">
                            {item.description}
                          </p>

                          {/* Related skills */}
                          {item.relatedSkills && item.relatedSkills.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                                Proven:
                              </span>
                              {item.relatedSkills.map(s => (
                                <span
                                  key={s}
                                  className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1"
                                >
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                  <span>{s}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Achievement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-indigo-50/40">
              <h3 className="text-base font-extrabold text-slate-900">
                Log Verifiable Achievement
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Achievement Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Smart India Hackathon Finalist"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Event Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as AchievementItem['type'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Competition">Competition</option>
                    <option value="Award">Award</option>
                    <option value="Open Source">Open Source Contribution</option>
                    <option value="Internship">Technical Internship</option>
                    <option value="Technical Event">Technical Conference</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value={2026}>2026</option>
                    <option value={2025}>2025</option>
                    <option value={2024}>2024</option>
                    <option value={2023}>2023</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Host / Organization *
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Ministry of Education, Google, MLH"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Rank, Podium or Role
                </label>
                <input
                  type="text"
                  value={rankOrRole}
                  onChange={(e) => setRankOrRole(e.target.value)}
                  placeholder="e.g. 1st Place National Winner, Core Contributor"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Skills Proven (comma-separated)
                </label>
                <input
                  type="text"
                  value={relatedSkillsInput}
                  onChange={(e) => setRelatedSkillsInput(e.target.value)}
                  placeholder="Python, React, Distributed Systems"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description & Impact
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Built an automated telemetry pipeline evaluated by jury..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Save Achievement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
