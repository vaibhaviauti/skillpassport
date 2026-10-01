import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SkillCategory, SkillItem } from '../../types';
import { VerificationBadge } from '../common/VerificationBadge';
import { SkillAssessmentModal } from './SkillAssessmentModal';
import { EmptyState } from '../common/EmptyState';
import {
  Plus,
  Star,
  CheckCircle2,
  FolderGit2,
  GitBranch,
  GraduationCap,
  Trophy,
  Trash2,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

export const SkillList: React.FC = () => {
  const { skills, addSkill, deleteSkill, setActiveTab } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [assessmentSkill, setAssessmentSkill] = useState<string | null>(null);

  // New skill form
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('Programming');

  const categories: Array<'All' | SkillCategory> = [
    'All',
    'Programming',
    'Frontend',
    'Backend',
    'Database',
    'AI/ML',
    'DevOps',
    'Tools',
  ];

  const filteredSkills = skills.filter(
    s => selectedCategory === 'All' || s.category === selectedCategory
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    addSkill(newSkillName.trim(), newSkillCategory);
    setNewSkillName('');
    setShowAddModal(false);
  };

  const commonPresets = [
    { name: 'Python', cat: 'Programming' as SkillCategory },
    { name: 'React', cat: 'Frontend' as SkillCategory },
    { name: 'Node.js', cat: 'Backend' as SkillCategory },
    { name: 'MongoDB', cat: 'Database' as SkillCategory },
    { name: 'SQL', cat: 'Database' as SkillCategory },
    { name: 'TypeScript', cat: 'Programming' as SkillCategory },
    { name: 'Docker', cat: 'DevOps' as SkillCategory },
    { name: 'REST API', cat: 'Backend' as SkillCategory },
    { name: 'Git & GitHub', cat: 'Tools' as SkillCategory },
    { name: 'AI/ML', cat: 'AI/ML' as SkillCategory },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Digital Competency Matrix</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Skills & Evidence Proof ({skills.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Claims remain "Self Declared" until reinforced with repository commits, projects, or assessments.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-indigo-200 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill Claim</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {cat}
            {cat !== 'All' && (
              <span className="ml-1.5 opacity-70 text-[10px]">
                ({skills.filter(s => s.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredSkills.length === 0 ? (
        <EmptyState
          icon={Layers}
          title={selectedCategory === 'All' ? 'No Skills In Passport Yet' : `No ${selectedCategory} Skills Yet`}
          description="Add technical competencies you are proficient in. Then substantiate each skill with real project commits or timed challenges."
          actionText="Add My First Skill"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        /* Skill Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map(skill => {
            const hasChallenge = ['Python', 'React', 'JavaScript', 'SQL', 'Node.js'].includes(skill.name);

            return (
              <div
                key={skill.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Name + Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {skill.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {skill.name}
                      </h3>
                    </div>

                    <VerificationBadge status={skill.status} size="sm" />
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 my-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= skill.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] font-bold text-slate-500 ml-1.5">
                      {skill.rating}.0 / 5.0
                    </span>
                  </div>

                  {/* Evidence Checklist (Core USP) */}
                  <div className="my-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1.5 text-[11px]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Evidence Trail Checklist
                    </span>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <FolderGit2 className="w-3.5 h-3.5 text-blue-500" />
                        <span>Verified Projects</span>
                      </span>
                      {skill.evidenceBreakdown.projects > 0 ? (
                        <span className="font-bold text-emerald-700">
                          ✓ {skill.evidenceBreakdown.projects} Projects
                        </span>
                      ) : (
                        <span className="text-slate-400">None attached</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <GitBranch className="w-3.5 h-3.5 text-indigo-500" />
                        <span>GitHub Cadence</span>
                      </span>
                      {skill.evidenceBreakdown.github ? (
                        <span className="font-bold text-emerald-700">✓ Active Commits</span>
                      ) : (
                        <span className="text-slate-400">Not detected</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Assessment Passed</span>
                      </span>
                      {skill.evidenceBreakdown.assessment ? (
                        <span className="font-bold text-emerald-700">✓ Proctored 100%</span>
                      ) : (
                        <span className="text-slate-400">Pending</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <Trophy className="w-3.5 h-3.5 text-amber-500" />
                        <span>Hackathon Winner</span>
                      </span>
                      {skill.evidenceBreakdown.hackathon ? (
                        <span className="font-bold text-emerald-700">✓ Podiums Verified</span>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {hasChallenge ? (
                    <button
                      onClick={() => setAssessmentSkill(skill.name)}
                      className="flex-1 py-1.5 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Zap className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Take Challenge</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('projects')}
                      className="flex-1 py-1.5 px-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <FolderGit2 className="w-3.5 h-3.5 text-blue-500" />
                      <span>Add Project Proof</span>
                    </button>
                  )}

                  <button
                    onClick={() => deleteSkill(skill.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/40">
              <h3 className="text-base font-extrabold text-slate-900">
                Add Technical Skill Claim
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
                  Skill Name
                </label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. React, Python, PostgreSQL, Docker"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Skill Category
                </label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="Programming">Programming</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>

              {/* Quick Presets */}
              <div>
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Popular Skill Presets
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {commonPresets.map(p => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        setNewSkillName(p.name);
                        setNewSkillCategory(p.cat);
                      }}
                      className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium transition-colors"
                    >
                      + {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  Save Skill Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Challenge Quiz Modal */}
      {assessmentSkill && (
        <SkillAssessmentModal
          skillName={assessmentSkill}
          onClose={() => setAssessmentSkill(null)}
        />
      )}
    </div>
  );
};
