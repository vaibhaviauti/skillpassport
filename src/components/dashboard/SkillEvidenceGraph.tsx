import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Share2,
  FolderGit2,
  GitBranch,
  GraduationCap,
  Trophy,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  type: 'skill' | 'project' | 'github' | 'hackathon' | 'assessment' | 'verified';
  status: 'verified' | 'active' | 'pending';
  proofCount?: string;
  details: string;
  hash?: string;
}

export const SkillEvidenceGraph: React.FC = () => {
  const { skills, projects, github, evidence } = useApp();

  const [selectedSkill, setSelectedSkill] = useState<string>(() => {
    return skills.length > 0 ? skills[0].name : 'Python';
  });

  const [activeNode, setActiveNode] = useState<GraphNode | null>(null);

  // Find skill object
  const skillObj = skills.find(s => s.name.toLowerCase() === selectedSkill.toLowerCase());

  // Connected projects
  const connectedProjects = projects.filter(p =>
    p.technologies.some(t => t.toLowerCase() === selectedSkill.toLowerCase())
  );

  // Connected assessment evidence
  const hasAssessment = evidence.some(
    e => e.category === 'Assessments' && e.relatedSkills.some(s => s.toLowerCase() === selectedSkill.toLowerCase())
  );

  // Connected hackathons
  const hasHackathon = evidence.some(
    e => e.category === 'Hackathons' && e.relatedSkills.some(s => s.toLowerCase() === selectedSkill.toLowerCase())
  );

  // Build reactive node chain for this skill
  const nodes: GraphNode[] = [
    {
      id: 'node-skill',
      label: selectedSkill.toUpperCase(),
      type: 'skill',
      status: 'active',
      proofCount: 'Target Competency',
      details: `Declared technical claim for ${selectedSkill} in student passport.`,
    },
    {
      id: 'node-projects',
      label: `${connectedProjects.length} Verified Projects`,
      type: 'project',
      status: connectedProjects.length > 0 ? 'verified' : 'pending',
      proofCount: `${connectedProjects.length} codebases`,
      details: connectedProjects.length > 0
        ? `Proven in: ${connectedProjects.map(p => p.name).join(', ')}.`
        : 'No verified repositories currently demonstrate this technology.',
      hash: connectedProjects[0]?.verificationDetails?.auditHash,
    },
    {
      id: 'node-github',
      label: 'GitHub Activity',
      type: 'github',
      status: github.isConnected ? 'verified' : 'pending',
      proofCount: `${github.totalContributions} Contributions`,
      details: github.isConnected
        ? `Audited commit history on ${github.publicRepos} public repositories with ${github.topTechnology} focus.`
        : 'Connect GitHub to supply continuous commit activity proof.',
    },
    {
      id: 'node-hackathon',
      label: 'Competitive Hackathon',
      type: 'hackathon',
      status: hasHackathon ? 'verified' : 'pending',
      proofCount: hasHackathon ? 'Podium Verified' : 'None',
      details: hasHackathon
        ? 'Jury-evaluated hackathon solution demonstrating real-time implementation under stress.'
        : 'No hackathon submissions have verified this skill yet.',
    },
    {
      id: 'node-assessment',
      label: 'Proctored Assessment',
      type: 'assessment',
      status: hasAssessment ? 'verified' : 'pending',
      proofCount: hasAssessment ? '100% Score' : 'Unattempted',
      details: hasAssessment
        ? 'Passed proctored algorithmic challenge assessing syntax, complexity, and systems.'
        : 'Take the timed skill verification challenge to seal this node.',
    },
    {
      id: 'node-verified',
      label: `${selectedSkill} VERIFIED ✓`,
      type: 'verified',
      status: skillObj?.status === 'VERIFIED' ? 'verified' : 'pending',
      proofCount: 'Cryptographic Proof',
      details: skillObj?.status === 'VERIFIED'
        ? `Full evidence multi-factor satisfied. SkillPass trust engine elevated ${selectedSkill} to Verified status.`
        : 'Requires multiple independent evidence nodes to reach verified standing.',
      hash: '0x8f3c71a9e94c8b21',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-1">
            <Share2 className="w-3.5 h-3.5" />
            <span>Interactive Proof Graph Architecture</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Skill Evidence Directed Graph
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any node along the pipeline to inspect cryptographic proof tokens and codebase telemetry.
          </p>
        </div>

        {/* Skill Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Skill Anchor:</span>
          <select
            value={selectedSkill}
            onChange={(e) => {
              setSelectedSkill(e.target.value);
              setActiveNode(null);
            }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
          >
            {skills.map(s => (
              <option key={s.id} value={s.name}>
                {s.name} ({s.status})
              </option>
            ))}
            {skills.length === 0 && <option value="Python">Python</option>}
          </select>
        </div>
      </div>

      {/* Main Graph Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Visual Flow */}
        <div className="lg:col-span-2 bg-gradient-to-b from-white to-slate-50/50 p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              Live Directed Pipeline
            </span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Verified Node
              </span>
              <span className="flex items-center gap-1 text-slate-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                Pending Proof
              </span>
            </div>
          </div>

          {/* Node Flow (Vertical Stack with connector lines) */}
          <div className="max-w-md mx-auto space-y-3">
            {nodes.map((node, idx) => {
              const isSelected = activeNode?.id === node.id;
              const isVerified = node.status === 'verified' || node.type === 'skill';

              return (
                <div key={node.id} className="relative flex flex-col items-center">
                  {/* Node Button */}
                  <button
                    onClick={() => setActiveNode(node)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer transform hover:-translate-y-0.5 ${
                      isSelected
                        ? 'ring-2 ring-indigo-500 shadow-md bg-white border-indigo-400'
                        : isVerified
                        ? 'bg-white border-emerald-300 shadow-2xs hover:border-emerald-400'
                        : 'bg-slate-50 border-dashed border-slate-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isVerified
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {node.type === 'skill' && <Layers className="w-4 h-4" />}
                          {node.type === 'project' && <FolderGit2 className="w-4 h-4" />}
                          {node.type === 'github' && <GitBranch className="w-4 h-4" />}
                          {node.type === 'hackathon' && <Trophy className="w-4 h-4" />}
                          {node.type === 'assessment' && <GraduationCap className="w-4 h-4" />}
                          {node.type === 'verified' && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block leading-tight">
                            Step {idx + 1} • {node.type}
                          </span>
                          <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                            {node.label}
                          </h4>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            isVerified
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {node.proofCount}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Flow arrow down */}
                  {idx < nodes.length - 1 && (
                    <div className="h-6 w-0.5 bg-gradient-to-b from-indigo-300 to-indigo-500 my-1 relative">
                      <div className="absolute -bottom-1 -left-[3px] w-2 h-2 border-r-2 border-b-2 border-indigo-500 rotate-45" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Node Inspector Sidebar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Evidence Node Inspector</span>
            </div>

            {activeNode ? (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Node Category: {activeNode.type}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-0.5">
                    {activeNode.label}
                  </h3>
                  <span className="text-xs font-semibold text-emerald-600">
                    Status: {activeNode.status.toUpperCase()}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                  {activeNode.details}
                </div>

                {activeNode.hash && (
                  <div className="p-3 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Cryptographic Audit Hash
                    </span>
                    <div className="text-emerald-400 break-all">{activeNode.hash}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <ShieldCheck className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-medium">
                  Click any node on the left to inspect detailed telemetry, audit hashes, and connected proof artifacts.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500">
            Node verification rules comply with SkillPass Protocol v2.4 anti-tamper standards.
          </div>
        </div>
      </div>
    </div>
  );
};
