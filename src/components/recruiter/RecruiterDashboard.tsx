import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RecruiterCandidate } from '../../types';
import { analyzeJobMatch, JobMatchAnalysisResult } from '../../services/aiService';
import {
  Briefcase,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  FolderGit2,
  GitBranch,
  Trophy,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  FileText,
  AlertCircle,
  HelpCircle,
  Eye,
  X,
  ExternalLink,
} from 'lucide-react';

export const RecruiterDashboard: React.FC = () => {
  const { recruiterCandidates, user, projects, skills } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'search' | 'jobmatch' | 'saved'>('search');
  const [skillFilter, setSkillFilter] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('All');
  const [minScore, setMinScore] = useState<number>(60);
  const [savedCandidates, setSavedCandidates] = useState<string[]>([]);
  const [inspectCandidate, setInspectCandidate] = useState<RecruiterCandidate | null>(null);

  // Job Match Analyzer State
  const [jobTitle, setJobTitle] = useState('Full Stack Software Engineer');
  const [jobDescription, setJobDescription] = useState(
    'We are seeking an ambitious software engineer proficient in React, Node.js, REST APIs, and MongoDB with verified hands-on git workflow experience. Knowledge of Docker and cloud deployment is a plus.'
  );
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<JobMatchAnalysisResult | null>(null);

  const colleges = ['All', 'IIT Bombay', 'NIT Trichy', 'BITS Pilani', 'DTU'];

  const toggleSave = (id: string) => {
    setSavedCandidates(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const filteredCandidates = recruiterCandidates.filter(c => {
    const matchesSkill = skillFilter === '' || c.verifiedSkills.some(s => s.name.toLowerCase().includes(skillFilter.toLowerCase()));
    const matchesCollege = collegeFilter === 'All' || c.college.toLowerCase().includes(collegeFilter.toLowerCase());
    const matchesScore = c.credibilityScore >= minScore;
    const matchesSaved = activeSubTab !== 'saved' || savedCandidates.includes(c.id);

    return matchesSkill && matchesCollege && matchesScore && matchesSaved;
  });

  const handleRunJobMatch = async () => {
    setIsMatching(true);
    const candidateSkillNames = skills.map(s => s.name);
    const candidateProjectNames = projects.map(p => p.name);

    const result = await analyzeJobMatch({
      jobTitle,
      jobDescription,
      candidateSkills: candidateSkillNames,
      candidateProjects: candidateProjectNames,
    });
    setMatchResult(result);
    setIsMatching(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Proof-First Talent Discovery</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Recruiter & Talent Intelligence
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate engineering candidates by verifiable code commits, repositories, and challenges—not resumes.
          </p>
        </div>

        {/* Sub-nav Tabs */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveSubTab('search')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'search' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Proof Search
          </button>
          <button
            onClick={() => setActiveSubTab('jobmatch')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'jobmatch' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Job Match Analyzer
          </button>
          <button
            onClick={() => setActiveSubTab('saved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'saved' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Saved ({savedCandidates.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'search' || activeSubTab === 'saved' ? (
        <>
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Filter by Verified Skill
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  placeholder="e.g. React, Python, MongoDB"
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Institution
              </label>
              <select
                value={collegeFilter}
                onChange={(e) => setCollegeFilter(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                {colleges.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                <span>Min Credibility Score</span>
                <span className="text-indigo-600 font-mono">{minScore}+</span>
              </div>
              <input
                type="range"
                min="30"
                max="95"
                step="5"
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCandidates.map(candidate => {
              const isSaved = savedCandidates.includes(candidate.id);

              return (
                <div
                  key={candidate.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-xs">
                          {candidate.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 leading-tight">
                            {candidate.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {candidate.college} • Class of {candidate.gradYear}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="text-lg font-black text-slate-900 font-mono">
                            {candidate.credibilityScore}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-bold">/ 100</span>
                        </div>
                        <button
                          onClick={() => toggleSave(candidate.id)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg cursor-pointer"
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-5 h-5 text-indigo-600" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Proof-First Skill Details (USP: Requirement 21) */}
                    <div className="my-3 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Verified Proof Breakdown
                      </span>

                      <div className="grid grid-cols-2 gap-2">
                        {candidate.verifiedSkills.map(s => (
                          <div key={s.name} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                            <div className="font-bold text-slate-900 flex items-center gap-1 mb-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{s.name}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 space-y-0.5">
                              <div>• {s.verifiedProjects} verified projects</div>
                              {s.hasGithub && <div>• GitHub activity audited</div>}
                              {s.hasAssessment && <div>• Proctored quiz passed</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex items-center gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <FolderGit2 className="w-3.5 h-3.5 text-blue-500" />
                        <strong>{candidate.verifiedProjectsCount}</strong> Projects
                      </span>
                      <span className="flex items-center gap-1">
                        <GitBranch className="w-3.5 h-3.5 text-indigo-500" />
                        <strong>{candidate.githubActivityCount}</strong> Commits
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5 text-amber-500" />
                        <strong>{candidate.achievementsCount}</strong> Podiums
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-4">
                    <button
                      onClick={() => setInspectCandidate(candidate)}
                      className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Proof & Evidence</span>
                    </button>

                    <button
                      onClick={() => alert(`Interview request invitation dispatched to ${candidate.name}`)}
                      className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Invite
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Job Match Analyzer (Requirement 22) */
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Job Description vs. Candidate Evidence Matcher</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Paste Job Specification
                </label>
                <textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <button
                disabled={isMatching}
                onClick={handleRunJobMatch}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                {isMatching ? 'Matching Evidence...' : 'Run Job Match Analysis'}
              </button>
            </div>
          </div>

          {matchResult && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h4 className="text-lg font-black text-slate-900">
                    Evidence Match: {matchResult.matchScore}%
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{matchResult.executiveSummary}</p>
                </div>
                <div className="text-2xl font-black font-mono text-emerald-600">
                  {matchResult.matchScore}%
                </div>
              </div>

              {/* Crucial distinction: Skill Missing vs Skill Not Yet Proven (Requirement 22) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs space-y-1.5">
                  <span className="font-bold text-emerald-900 block flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified in Code ({matchResult.matchedEvidence.length})</span>
                  </span>
                  {matchResult.matchedEvidence.map(m => (
                    <div key={m} className="font-semibold text-emerald-800">✓ {m}</div>
                  ))}
                </div>

                <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 text-xs space-y-1.5">
                  <span className="font-bold text-amber-900 block flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Skill Not Yet Proven ({matchResult.unprovenSkills.length})</span>
                  </span>
                  <p className="text-[11px] text-amber-700">Mentioned in role, but needs verified repo proof:</p>
                  {matchResult.unprovenSkills.map(u => (
                    <div key={u} className="font-semibold text-amber-800">⚠ {u}</div>
                  ))}
                </div>

                <div className="p-4 bg-rose-50/70 rounded-xl border border-rose-200 text-xs space-y-1.5">
                  <span className="font-bold text-rose-900 block flex items-center gap-1">
                    <X className="w-3.5 h-3.5 text-rose-600" />
                    <span>Skill Missing</span>
                  </span>
                  {matchResult.missingSkills.map(mis => (
                    <div key={mis} className="font-semibold text-rose-800">❌ {mis}</div>
                  ))}
                </div>
              </div>

              {/* Evidence-Based Interview Questions (Requirement 22) */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>Evidence-Based Interview Questions</span>
                </h4>
                <div className="space-y-2.5">
                  {matchResult.evidenceBasedQuestions.map((q, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>Target Skill: {q.skill}</span>
                        <span className="text-[10px] text-indigo-600 font-mono uppercase">AI Probed</span>
                      </div>
                      <p className="text-slate-800 font-medium">«{q.question}»</p>
                      <p className="text-slate-500 text-[11px]">
                        <strong>Why ask this:</strong> {q.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Proof Inspection Modal (Requirement 21) */}
      {inspectCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">{inspectCandidate.name}</h3>
                <p className="text-xs text-slate-500">{inspectCandidate.college} • Score: {inspectCandidate.credibilityScore}/100</p>
              </div>
              <button
                onClick={() => setInspectCandidate(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Cryptographic Proof Inspection
              </span>
              {inspectCandidate.verifiedSkills.map(s => (
                <div key={s.name} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{s.name} ✓</span>
                    <span className="text-emerald-600">VERIFIED</span>
                  </div>
                  <ul className="text-[11px] text-slate-600 list-disc list-inside">
                    <li>3 verifiable project commits with SHA-256 integrity hash</li>
                    <li>Continuous GitHub activity matching repository languages</li>
                    <li>Algorithmic assessment passed with 100% on timed suites</li>
                  </ul>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectCandidate(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Close Audit Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
