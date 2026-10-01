import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  User,
  FolderGit2,
  TrendingUp,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  Award,
  Layers,
} from 'lucide-react';

export const MentorDashboard: React.FC = () => {
  const { user, mentorRecommendations, addMentorRecommendation, completeMentorRecommendation, credibilityScore } = useApp();

  const [recommendationText, setRecommendationText] = useState('');
  const [mentorName, setMentorName] = useState('Dr. S. K. Nair');
  const [mentorRole, setMentorRole] = useState('Senior Principal Architect & Faculty Mentor');

  const handleSendRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recommendationText.trim()) return;

    addMentorRecommendation({
      studentId: user?.id || 'std-1',
      mentorName,
      mentorDesignation: mentorRole,
      recommendationText: recommendationText.trim(),
      targetRole: user?.targetRole || 'Full Stack Developer',
    });

    setRecommendationText('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Faculty & Industry Advisory</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Mentor & Career Guidance Portal
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit mentee progress, verify project architectures, and issue milestone recommendations.
          </p>
        </div>

        <div className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-semibold">
          Logged as: <strong className="text-slate-900">{mentorName}</strong>
        </div>
      </div>

      {/* Mentee Status Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" />
          <span>Assigned Mentee Overview</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <h4 className="text-base font-extrabold text-slate-900">
              {user?.name || 'Aarav Sharma'}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {user?.college || 'IIT Bombay'} • {user?.degree} in {user?.branch}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                Target: {user?.targetRole || 'Full Stack Developer'}
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                Credibility: {credibilityScore.totalScore}/100
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500 block">Verification Standing</span>
            <span className="text-sm font-black text-emerald-600">
              {credibilityScore.label}
            </span>
          </div>
        </div>
      </div>

      {/* Issue Actionable Mentor Recommendation */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Send className="w-4 h-4 text-indigo-600" />
          <span>Issue Actionable Milestone Recommendation</span>
        </h3>

        <form onSubmit={handleSendRecommendation} className="space-y-3">
          <textarea
            rows={3}
            value={recommendationText}
            onChange={(e) => setRecommendationText(e.target.value)}
            placeholder="e.g. Build and deploy one deployment-ready microservice with containerized Redis and comprehensive unit tests to close the DevOps gap."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            required
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Recommendation</span>
            </button>
          </div>
        </form>
      </div>

      {/* Dispatched Recommendations Log */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Issued Recommendations Log ({mentorRecommendations.length})
        </h3>

        <div className="space-y-3">
          {mentorRecommendations.map(rec => (
            <div
              key={rec.id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{rec.mentorName}</span>
                  <span className="text-[11px] text-slate-400 font-mono">• {rec.createdAt}</span>
                </div>
                <p className="text-xs text-slate-700 font-medium">«{rec.recommendationText}»</p>
                <span className="text-[10px] text-slate-500">{rec.mentorDesignation}</span>
              </div>

              <div>
                {rec.isCompleted ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Completed</span>
                  </span>
                ) : (
                  <button
                    onClick={() => completeMentorRecommendation(rec.id)}
                    className="px-3 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Mark Done
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
