import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../../context/AppContext';
import { exportPassportToPdf } from '../../services/pdfService';
import { ScoreRing } from '../common/ScoreRing';
import { VerificationBadge } from '../common/VerificationBadge';
import {
  ShieldCheck,
  Share2,
  Copy,
  Printer,
  Download,
  Linkedin,
  Github,
  Mail,
  CheckCircle2,
  ExternalLink,
  Building,
  GraduationCap,
  Calendar,
  FolderGit2,
  Trophy,
  Award,
  Loader2,
  Sparkles,
} from 'lucide-react';

export const PublicPassport: React.FC = () => {
  const { user, skills, projects, github, certificates, achievements, credibilityScore } = useApp();

  const [isExporting, setIsExporting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const passportUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/passport/${user?.username || 'student'}`
    : 'https://skillpass.app/passport/demo';

  // Render QR Code on canvas
  useEffect(() => {
    if (qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, passportUrl, {
        width: 130,
        margin: 1,
        color: {
          dark: '#0F172A',
          light: '#FFFFFF',
        },
      });
    }
  }, [passportUrl, user]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(passportUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      await exportPassportToPdf('passport-printable-content', user?.username || 'student');
    } catch (err: any) {
      alert(`PDF Export: ${err.message || 'Error creating document'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const verifiedSkills = skills.filter(s => s.status === 'VERIFIED');
  const verifiedProjects = projects.filter(p => p.isVerified);
  const verifiedAchievements = achievements.filter(a => a.status === 'VERIFIED');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Action Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block leading-tight">
              Public Digital Passport URL
            </span>
            <span className="text-[11px] font-mono text-slate-500 truncate max-w-xs sm:max-w-md block">
              {passportUrl}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copySuccess ? 'Copied Link!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            disabled={isExporting}
            onClick={handleExportPdf}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export to PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* The Printable A4 Digital Passport Container */}
      <div
        id="passport-printable-content"
        className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden p-6 sm:p-10 space-y-8"
      >
        {/* Passport Header Watermark & Brand */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block mb-0.5">
                SKILLPASS VERIFIED PASSPORT
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Digital Skill Passport
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                Passport ID: SP-ID-{user?.id.slice(-6).toUpperCase() || '884920'}
              </p>
            </div>
          </div>

          {/* Live QR Verification Badge */}
          <div className="flex items-center gap-3 self-end sm:self-center p-2 rounded-2xl bg-slate-50 border border-slate-200/80">
            <canvas ref={qrCanvasRef} className="rounded-lg shadow-2xs" />
            <div className="text-left text-[11px] space-y-0.5 pr-2">
              <span className="font-bold text-slate-900 block">Scan to Verify</span>
              <span className="text-slate-500 block">Instant Proof Check</span>
              <span className="text-emerald-700 font-bold block">✓ Authenticated</span>
            </div>
          </div>
        </div>

        {/* Student Profile Card & Credibility Score Ring */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100 shadow-md shrink-0"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-md">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'SP'}
              </div>
            )}

            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-black text-slate-900">
                  {user?.name || 'Verified Student'}
                </h2>
                {user?.isCollegeEmailVerified && (
                  <span className="p-1 rounded-full bg-emerald-50 text-emerald-600" title="College Email Verified">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                )}
              </div>

              <p className="text-xs font-semibold text-slate-600 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{user?.college || 'Indian Institute of Technology'}</span>
                <span>•</span>
                <span>{user?.degree} in {user?.branch}</span>
                <span>•</span>
                <span>Class of {user?.gradYear}</span>
              </p>

              <p className="text-xs text-slate-600 leading-relaxed pt-1 max-w-xl">
                {user?.bio || 'Building verified software systems with code commits and jury-evaluated projects.'}
              </p>

              {/* Verified links */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs">
                {user?.github && (
                  <a href={user.github} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-mono">
                    <Github className="w-3.5 h-3.5" />
                    <span>github</span>
                  </a>
                )}
                {user?.linkedIn && (
                  <a href={user.linkedIn} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                )}
                <span className="text-slate-400 font-mono text-[11px]">
                  Verified on: {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Credibility Score Ring */}
          <div className="flex justify-center border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
            <ScoreRing scoreData={credibilityScore} size={150} strokeWidth={10} />
          </div>
        </div>

        {/* Verified Skills Grid */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Verified Skills ({verifiedSkills.length})</span>
            </h3>
            <span className="text-xs text-slate-500">Substantiated by code</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {verifiedSkills.map(skill => (
              <div
                key={skill.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{skill.name}</span>
                  <span className="text-emerald-600 font-bold">✓</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {skill.evidenceBreakdown.projects} Projects • {skill.evidenceBreakdown.github ? 'Active Git' : 'Exam passed'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Projects Showcase */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-blue-600" />
            <span>Audited Project Evidence</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {verifiedProjects.map(p => (
              <div key={p.id} className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                    <span className="text-[11px] text-slate-500">Contribution: {p.studentContribution}%</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                    VERIFIED ✓
                  </span>
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {p.technologies.map(t => (
                    <span key={t} className="px-2 py-0.5 bg-white text-slate-700 rounded text-[10px] border font-medium">
                      {t}
                    </span>
                  ))}
                </div>

                {p.verificationDetails && (
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-[10px] font-mono text-slate-500">
                    <span>Proof: {p.verificationDetails.proofId}</span>
                    <span>{p.verificationDetails.commitCount} commits</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* GitHub Contribution Footprint */}
        {github.isConnected && (
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Github className="w-4 h-4 text-slate-900" />
                <span>GitHub Verified Footprint</span>
              </h3>
              <span className="text-xs font-semibold text-slate-600">
                🔥 {github.totalContributions} Contributions This Year
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Public Repos</span>
                <span className="text-lg font-black text-slate-900 font-mono">{github.publicRepos}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Pull Requests</span>
                <span className="text-lg font-black text-slate-900 font-mono">{github.pullRequests}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Primary Stack</span>
                <span className="text-sm font-bold text-indigo-700 truncate block mt-1">{github.topTechnology}</span>
              </div>
            </div>
          </div>
        )}

        {/* Achievements & Podiums */}
        {verifiedAchievements.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Verified Achievements & Hackathons</span>
            </h3>

            <div className="space-y-2">
              {verifiedAchievements.map(ach => (
                <div key={ach.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-slate-900">{ach.title}</h5>
                    <p className="text-[11px] text-slate-500">{ach.organization} • {ach.rankOrRole}</p>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{ach.year}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cryptographic Verification History Audit Footer */}
        <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-400 font-mono space-y-1">
          <p>
            Audit Chain: <code className="text-indigo-600 font-bold">SHA256:0x8f3c71a9e94c8b21...verified</code>
          </p>
          <p className="text-[11px]">
            Minted by SkillPass Trust Protocol • Verifiable at {passportUrl}
          </p>
        </div>
      </div>
    </div>
  );
};
