import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  GitBranch,
  FolderGit2,
  GraduationCap,
  Trophy,
  Award,
  Users,
  Briefcase,
  Layers,
  ChevronRight,
  TrendingUp,
  FileText,
  Search,
  Check,
  X,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LandingPageProps {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenRegister, onOpenLogin }) => {
  const { setActiveRole, setActiveTab, loadPresentationDemoData } = useApp();

  const pipelineSteps = [
    { title: 'SKILL', icon: Layers, desc: 'Declare Skill Claim' },
    { title: 'PROJECT', icon: FolderGit2, desc: 'Connect Real Repo' },
    { title: 'GITHUB', icon: GitBranch, desc: 'Analyze Commit Cadence' },
    { title: 'ASSESSMENT', icon: GraduationCap, desc: 'Timed Code Proctored' },
    { title: 'VERIFICATION', icon: ShieldCheck, desc: 'Audit Hash Minted' },
    { title: 'CREDIBILITY', icon: Award, desc: 'Proof-Backed Passport' },
  ];

  const comparisonRows = [
    {
      feature: 'Core Philosophy',
      resume: 'Self-reported claims ("I know Python")',
      skillpass: 'Verifiable evidence trail (3 projects + GitHub commits + quiz)',
    },
    {
      feature: 'Project Validation',
      resume: 'Unverified bullet points & buzzwords',
      skillpass: 'Cryptographic proof with contribution % and code activity',
    },
    {
      feature: 'GitHub Integration',
      resume: 'Static link buried at top',
      skillpass: '52-week verified heatmap, PRs, and language breakdown',
    },
    {
      feature: 'Assessments',
      resume: 'None or unproctored quizzes',
      skillpass: 'Proctored timed technical challenges linked to skill ID',
    },
    {
      feature: 'Certificates',
      resume: 'Easily forged; unverified stuffing',
      skillpass: 'QR verified with capped score influence to stop spam',
    },
    {
      feature: 'Recruiter Discovery',
      resume: 'Keyword scanning via dumb ATS',
      skillpass: 'Proof-first candidate filtering by authentic verified evidence',
    },
  ];

  const howItWorksSteps = [
    { num: '01', title: 'Create Passport', desc: 'Register with institutional or personal credentials and establish your digital proof profile.' },
    { num: '02', title: 'Add Skills', desc: 'Catalog your technical competencies across programming, frontend, backend, AI/ML, and DevOps.' },
    { num: '03', title: 'Add Evidence', desc: 'Attach repositories, deployed web apps, hackathons, and certifications to your Evidence Wallet.' },
    { num: '04', title: 'Verify Proof', desc: 'Trigger automated codebase parsing, commit checks, and proctored technical skill challenges.' },
    { num: '05', title: 'Build Credibility', desc: 'Watch your dynamic Skill Credibility Score climb transparently from 0 to 100.' },
    { num: '06', title: 'Find Skill Gaps', desc: 'Leverage AI role benchmarks to discover missing evidence and execute next best actions.' },
    { num: '07', title: 'Get Discovered', desc: 'Share your tamper-proof public passport or get shortlisted directly by evidence-first recruiters.' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-24 border-b border-slate-200/60 bg-gradient-to-b from-white via-indigo-50/20 to-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-bold mb-6 shadow-xs animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Digital Skill Passport & Proof-of-Skill Platform</span>
          </div>

          {/* Tagline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Don’t Just List Your Skills.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
              Prove Them.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Build a verified digital identity that transforms your projects, GitHub activity, assessments,
            certificates, and achievements into concrete, evidence-backed skills recruiters can trust.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Create My Skill Passport</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm sm:text-base rounded-xl transition-all border border-slate-200 shadow-xs cursor-pointer"
            >
              Explore How It Works
            </button>

            <button
              onClick={loadPresentationDemoData}
              className="w-full sm:w-auto px-5 py-3.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              title="Instant Evaluator Demo Mode"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Evaluator Demo Preview</span>
            </button>
          </div>

          {/* Hero Visual Pipeline: SKILL -> PROJECT -> GITHUB -> ASSESSMENT -> VERIFICATION -> CREDIBILITY */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              The SkillPass Proof Engine Workflow
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {pipelineSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={idx}
                    className="relative bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 text-center group"
                  >
                    <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-600 flex items-center justify-center transition-colors mb-2.5 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-black text-slate-900 tracking-wider">
                      {step.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-tight">
                      {step.desc}
                    </div>

                    {/* Step arrow */}
                    {idx < pipelineSteps.length - 1 && (
                      <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-20 text-slate-300">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/80 text-xs text-indigo-900 font-medium inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Core USP:</strong> Python → Project Evidence → GitHub Evidence → Assessment Passed → Achievement → Verified Skill
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Traditional Resume vs SkillPass (Section 2) */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
            Why SkillPass?
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Traditional Resume vs. SkillPass
          </h3>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Static resumes encourage exaggerations and certificate stuffing. SkillPass replaces hearsay with mathematical proof.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 py-3.5 px-4 sm:px-6 uppercase tracking-wider">
            <div className="col-span-4 sm:col-span-3">Dimension</div>
            <div className="col-span-4 sm:col-span-4 text-rose-700 flex items-center gap-1.5">
              <X className="w-4 h-4 text-rose-500" />
              <span>Traditional Resume</span>
            </div>
            <div className="col-span-4 sm:col-span-5 text-emerald-700 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>SkillPass Digital Passport</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {comparisonRows.map((row, idx) => (
              <div key={idx} className="grid grid-cols-12 py-4 px-4 sm:px-6 text-xs sm:text-sm items-center hover:bg-slate-50/70 transition-colors">
                <div className="col-span-4 sm:col-span-3 font-bold text-slate-900">
                  {row.feature}
                </div>
                <div className="col-span-4 sm:col-span-4 text-slate-500 pr-3">
                  <span className="line-through decoration-rose-400 text-slate-400">{row.resume}</span>
                </div>
                <div className="col-span-4 sm:col-span-5 text-slate-900 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{row.skillpass}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How SkillPass Works (7 Steps) */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
              Step-by-Step Architecture
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              How SkillPass Works
            </h3>
            <p className="mt-3 text-slate-600 text-sm">
              From day one in college to your first high-growth tech interview in 7 seamless milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {howItWorksSteps.map((s, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="text-2xl font-black text-indigo-600 mb-3 font-mono">
                  {s.num}
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">
                  {s.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}

            {/* Final Highlight Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl text-white shadow-md flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                  Ready to Prove?
                </span>
                <h4 className="text-lg font-black mt-2">
                  Launch Your Passport Today
                </h4>
                <p className="text-xs text-indigo-100 mt-2">
                  No fake demo clutter. Pure verifiable evidence that elevates your engineering career.
                </p>
              </div>
              <button
                onClick={onOpenRegister}
                className="mt-4 px-4 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl text-xs font-bold transition-colors cursor-pointer self-start shadow-sm"
              >
                Start Free Passport
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholder CTAs: Students, Recruiters, Colleges, Mentors */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
            Multi-Stakeholder Ecosystem
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900">
            Engineered for the Entire Hiring Lifecycle
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Students */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">For Students</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Turn hackathons, late-night code sprints, and repositories into an irrefutable proof-of-skill passport with live QR verification.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveRole('student');
                onOpenRegister();
              }}
              className="w-full py-2.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
            >
              Create Student Passport
            </button>
          </div>

          {/* 2. Recruiters */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">For Recruiters</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Filter candidates by actual code commits and verified technical evidence. Generate tailored interview questions from verified repos.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveRole('recruiter');
                setActiveTab('recruiter');
              }}
              className="w-full py-2.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer"
            >
              Open Recruiter Dashboard
            </button>
          </div>

          {/* 3. Colleges */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">For Colleges & TPOs</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Monitor student placement readiness, identify curriculum skill gaps, and export institutional accreditation placement reports.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveRole('college');
                setActiveTab('college');
              }}
              className="w-full py-2.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
            >
              Institutional Analytics
            </button>
          </div>

          {/* 4. Mentors */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">For Mentors</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Track assigned mentees, audit technical proof submissions, and prescribe actionable milestones to close key skill gaps.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveRole('mentor');
                setActiveTab('mentor');
              }}
              className="w-full py-2.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors cursor-pointer"
            >
              Mentor Portal
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 bg-white text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-700">SkillPass – Digital Skill Passport</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Proof-First Verification</span>
            <span>Anti-Stuffing Guarantee</span>
            <span>Clean Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
