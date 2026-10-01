import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  Download,
  Building,
  CheckCircle2,
  PieChart,
  BarChart3,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';

export const CollegeDashboard: React.FC = () => {
  const { user } = useApp();
  const [isExporting, setIsExporting] = useState(false);

  const collegeName = user?.college || 'Indian Institute of Technology (IIT) Bombay';

  const skillDistribution = [
    { name: 'Python', count: 72, percent: 84 },
    { name: 'Java', count: 58, percent: 68 },
    { name: 'React', count: 41, percent: 48 },
    { name: 'AI/ML', count: 35, percent: 41 },
    { name: 'Node.js & Express', count: 32, percent: 38 },
    { name: 'SQL & Database Design', count: 49, percent: 57 },
  ];

  const branchReadiness = [
    { branch: 'Computer Science & Engineering', students: 120, readyPercent: 88 },
    { branch: 'Information Technology', students: 95, readyPercent: 82 },
    { branch: 'Electronics & Communication', students: 80, readyPercent: 64 },
    { branch: 'Data Science & AI', students: 60, readyPercent: 91 },
  ];

  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(`Institutional Placement Readiness Report for ${collegeName} exported successfully.`);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-1">
            <Building className="w-3.5 h-3.5" />
            <span>Training & Placement Cell (TPO)</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {collegeName} — Placement Intelligence
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cohort-level proof audit, accreditation compliance, and curriculum skill gap analytics.
          </p>
        </div>

        <button
          disabled={isExporting}
          onClick={handleExportReport}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Generating Report...' : 'Export Placement Report'}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">Total Students</span>
          <span className="text-2xl font-black text-slate-900 font-mono">355</span>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">100% Registered</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">Profiles Completed</span>
          <span className="text-2xl font-black text-indigo-600 font-mono">298</span>
          <span className="text-[10px] text-indigo-500 font-semibold block mt-0.5">84% Institutional rate</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">Verified Students</span>
          <span className="text-2xl font-black text-emerald-600 font-mono">241</span>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">With multi-skill proof</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">Placement Ready</span>
          <span className="text-2xl font-black text-teal-600 font-mono">76%</span>
          <span className="text-[10px] text-teal-600 font-bold block mt-0.5">Score &gt; 75/100</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">Needs Development</span>
          <span className="text-2xl font-black text-amber-600 font-mono">57</span>
          <span className="text-[10px] text-amber-600 font-bold block mt-0.5">Requires gap closing</span>
        </div>
      </div>

      {/* Skill Gap Intelligence Notice (Requirement 26) */}
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-extrabold text-amber-900">
            Institutional Skill Gap Intelligence (AI Diagnosis)
          </h4>
          <p className="text-xs text-amber-800 mt-1 leading-relaxed">
            «42% of students targeting Full Stack Development need stronger backend/REST API and containerization evidence before Tier-1 placements.
            Recommended action: Introduce a weekend Docker & Microservices hackathon sprint to close this institutional bottleneck.»
          </p>
        </div>
      </div>

      {/* Charts & Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            <span>Campus Skill Evidence Distribution</span>
          </h3>

          <div className="space-y-3 pt-2">
            {skillDistribution.map(s => (
              <div key={s.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-800">
                  <span>{s.name}</span>
                  <span className="font-mono text-slate-600">{s.count} students ({s.percent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${s.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Branch-wise Readiness */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Branch-Wise Placement Readiness</span>
          </h3>

          <div className="space-y-4 pt-2">
            {branchReadiness.map(b => (
              <div key={b.branch} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center text-xs font-bold text-slate-900 mb-1">
                  <span>{b.branch}</span>
                  <span className="text-emerald-700 font-mono">{b.readyPercent}% Ready</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-2">
                  <span>Cohort: {b.students} students</span>
                  <span>{Math.round((b.students * b.readyPercent) / 100)} Verified</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${b.readyPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
