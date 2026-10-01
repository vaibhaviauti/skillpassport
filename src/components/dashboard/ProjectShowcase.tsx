import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectItem } from '../../types';
import { VerificationBadge } from '../common/VerificationBadge';
import { EmptyState } from '../common/EmptyState';
import { analyzeProjectSkills, ExtractedSkill } from '../../services/aiService';
import {
  FolderGit2,
  Plus,
  ExternalLink,
  Github,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  GitCommit,
  Clock,
  Users,
  Code2,
  Hash,
  ArrowRight,
  Loader2,
  Eye,
} from 'lucide-react';

export const ProjectShowcase: React.FC = () => {
  const { projects, addProject, verifyProject, addSkill } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVerificationProject, setSelectedVerificationProject] = useState<ProjectItem | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [techInput, setTechInput] = useState('');
  const [technologies, setTechnologies] = useState<string[]>(['React', 'Node.js', 'MongoDB', 'REST API']);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [teamMembers, setTeamMembers] = useState('Solo Developer');
  const [studentContribution, setStudentContribution] = useState<number>(75);
  const [projectDuration, setProjectDuration] = useState('2 months');

  // AI Extraction preview in Add form
  const [isExtracting, setIsExtracting] = useState(false);
  const [aiExtractedSkills, setAiExtractedSkills] = useState<ExtractedSkill[]>([]);
  const [aiConfidence, setAiConfidence] = useState<number>(0);

  const handleAddTech = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies(prev => [...prev, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (t: string) => {
    setTechnologies(prev => prev.filter(x => x !== t));
  };

  // Trigger AI skill analysis on the fly
  const handleRunAiAnalysis = async () => {
    if (!name && !description) return;
    setIsExtracting(true);
    const result = await analyzeProjectSkills({
      title: name,
      description,
      technologies,
      repositoryUrl: githubUrl,
    });
    setAiExtractedSkills(result.skills);
    setAiConfidence(result.overallConfidence);
    setIsExtracting(false);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProject({
      name: name.trim(),
      description: description.trim(),
      technologies,
      githubUrl: githubUrl.trim() || 'https://github.com/student/project',
      liveDemoUrl: liveDemoUrl.trim(),
      teamMembers,
      studentContribution,
      projectDuration,
    });

    // Reset form
    setName('');
    setDescription('');
    setTechnologies(['React', 'Node.js']);
    setShowAddModal(false);
    setAiExtractedSkills([]);
  };

  const handleTriggerVerify = async (projectId: string) => {
    setVerifyingId(projectId);
    // Simulate multi-step verification animation delay
    setTimeout(async () => {
      await verifyProject(projectId);
      setVerifyingId(null);
      const updated = projects.find(p => p.id === projectId);
      if (updated) setSelectedVerificationProject(updated);
    }, 1200);
  };

  const handleAcceptAiSkills = (skillsToAdd: ExtractedSkill[]) => {
    skillsToAdd.forEach(s => {
      addSkill(s.name, s.category);
    });
    alert(`Successfully minted ${skillsToAdd.length} proven skills into your passport!`);
    setAiExtractedSkills([]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full mb-1">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Proof-Backed Code Projects</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Project Showcase & Verification ({projects.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Every verified project counts for up to 35% of your total Skill Credibility Score with multi-skill attribution.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-indigo-200 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No Projects Yet"
          description="Your first project can become your first piece of skill evidence. Add a project repository and verify code activity."
          actionText="Add My First Project"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {projects.map(project => {
            const isCurrentlyVerifying = verifyingId === project.id;

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Status header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {project.projectDuration}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          Contribution: <strong className="text-slate-800">{project.studentContribution}%</strong>
                        </span>
                      </div>
                    </div>

                    <VerificationBadge
                      status={project.isVerified ? 'VERIFIED' : 'SELF_DECLARED'}
                      size="sm"
                    />
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.map(t => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold border border-slate-200/80"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Proof ID if verified */}
                  {project.isVerified && project.verificationDetails && (
                    <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/80 mb-4 text-xs space-y-1">
                      <div className="flex items-center justify-between text-emerald-900 font-bold">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Proof ID: {project.verificationDetails.proofId}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-mono">
                          {project.verificationDetails.commitCount} commits verified
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-800 flex items-center justify-between font-mono">
                        <span>Audit Hash: {project.verificationDetails.auditHash}</span>
                        <button
                          onClick={() => setSelectedVerificationProject(project)}
                          className="text-emerald-700 underline font-sans text-xs hover:text-emerald-900"
                        >
                          View Audit Card
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer with links and Verify button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                        title="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveDemoUrl && (
                      <a
                        href={project.liveDemoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-slate-200"
                        title="Live Deployment"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {!project.isVerified ? (
                    <button
                      disabled={isCurrentlyVerifying}
                      onClick={() => handleTriggerVerify(project.id)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-indigo-200 cursor-pointer flex items-center gap-1.5"
                    >
                      {isCurrentlyVerifying ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Auditing Commits...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Verify Project</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedVerificationProject(project)}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Audit Report</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Verification Engine Modal (Requirement 10) */}
      {selectedVerificationProject && selectedVerificationProject.verificationDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">
                  SkillPass Cryptographic Proof
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  PROJECT VERIFICATION
                </h3>
              </div>
              <button
                onClick={() => setSelectedVerificationProject(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Checklist */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2 text-xs font-medium">
                <div className="flex justify-between items-center text-slate-800">
                  <span>Repository Connected</span>
                  <span className="text-emerald-600 font-bold">✓</span>
                </div>
                <div className="flex justify-between items-center text-slate-800">
                  <span>Code Activity Detected</span>
                  <span className="text-emerald-600 font-bold">✓</span>
                </div>
                <div className="flex justify-between items-center text-slate-800">
                  <span>Technologies Detected</span>
                  <span className="text-emerald-600 font-bold">✓</span>
                </div>
                <div className="flex justify-between items-center text-slate-800">
                  <span>Commits Analyzed</span>
                  <span className="text-emerald-600 font-bold">✓</span>
                </div>
                <div className="flex justify-between items-center text-slate-800">
                  <span>Contribution Analyzed</span>
                  <span className="text-emerald-600 font-bold">✓</span>
                </div>
                <div className="flex justify-between items-center text-slate-800">
                  <span>Project Duration Verified</span>
                  <span className="text-emerald-600 font-bold">✓</span>
                </div>
              </div>

              {/* Status & Proof ID */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                    Verification Status
                  </span>
                  <span className="text-base font-extrabold text-emerald-900">
                    VERIFIED ✓
                  </span>
                </div>

                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Proof ID
                  </span>
                  <span className="text-sm font-mono font-bold text-slate-800">
                    {selectedVerificationProject.verificationDetails.proofId}
                  </span>
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Commit Count</span>
                  <strong className="text-slate-800">{selectedVerificationProject.verificationDetails.commitCount} commits</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Code Activity</span>
                  <strong className="text-slate-800">{selectedVerificationProject.verificationDetails.codeActivity}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Student Contribution</span>
                  <strong className="text-slate-800">{selectedVerificationProject.verificationDetails.contributionPercent}%</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Audit Timestamp</span>
                  <strong className="text-slate-800 font-mono text-[11px]">
                    {new Date(selectedVerificationProject.verificationDetails.verifiedAt).toLocaleString()}
                  </strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>Audit Hash</span>
                  <code className="text-indigo-600 font-mono text-[11px]">
                    {selectedVerificationProject.verificationDetails.auditHash}
                  </code>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedVerificationProject(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Close Audit Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal with AI Project-to-Skill Mapping */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/40">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Showcase Repository
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Add New Project
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Distributed Task Queue Engine"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Project Description *
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the architectural problem solved, tech stack, and key modules..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Technologies Tag input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Technologies Used
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="Type tech tag (e.g. TypeScript, Redis)"
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                  >
                    Add Tag
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {technologies.map(t => (
                    <span
                      key={t}
                      className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium flex items-center gap-1"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(t)}
                        className="hover:text-indigo-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Project-to-Skill Mapping Trigger (Requirement 11) */}
              <div className="p-3.5 bg-gradient-to-r from-indigo-50/60 to-purple-50/60 rounded-xl border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>AI Project-to-Skill Mapping</span>
                  </div>
                  <button
                    type="button"
                    disabled={isExtracting || !name}
                    onClick={handleRunAiAnalysis}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    {isExtracting ? 'Analyzing...' : 'Detect Proven Skills'}
                  </button>
                </div>

                {aiExtractedSkills.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-indigo-100">
                    <div className="flex items-center justify-between text-xs text-indigo-800">
                      <span>Evidence Confidence</span>
                      <strong className="text-emerald-700 font-bold">{aiConfidence}%</strong>
                    </div>

                    <div className="space-y-1">
                      {aiExtractedSkills.map((s, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-[11px] bg-white p-1.5 rounded-lg border border-indigo-100/70"
                        >
                          <span className="font-semibold text-slate-800">✓ {s.name} ({s.category})</span>
                          <span className="text-slate-500">{s.confidence}% confidence</span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAcceptAiSkills(aiExtractedSkills)}
                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs"
                    >
                      Add Proven Skills to Passport
                    </button>
                  </div>
                )}
              </div>

              {/* URLs and Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/user/repo"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Live Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={liveDemoUrl}
                    onChange={(e) => setLiveDemoUrl(e.target.value)}
                    placeholder="https://my-app.vercel.app"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Student Contribution %
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={studentContribution}
                    onChange={(e) => setStudentContribution(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Project Duration
                  </label>
                  <input
                    type="text"
                    value={projectDuration}
                    onChange={(e) => setProjectDuration(e.target.value)}
                    placeholder="e.g. 2 months"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
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
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  Save Project Showcase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
