import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Bell,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  User,
  LogOut,
  Menu,
  X,
  Share2,
  Layers,
  GraduationCap,
  Briefcase,
  Users,
  Compass,
} from 'lucide-react';
import { UserRole } from '../../types';

interface HeaderProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLogin, onOpenRegister }) => {
  const {
    user,
    activeRole,
    setActiveRole,
    activeTab,
    setActiveTab,
    isDemoMode,
    loadPresentationDemoData,
    resetToCleanSlate,
    notifications,
    markNotificationAsRead,
    credibilityScore,
    logout,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);

  const roles: Array<{ id: UserRole; label: string; icon: any }> = [
    { id: 'student', label: 'Student', icon: GraduationCap },
    { id: 'recruiter', label: 'Recruiter', icon: Briefcase },
    { id: 'college', label: 'College / Placement', icon: Users },
    { id: 'mentor', label: 'Mentor', icon: Compass },
  ];

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'recruiter') setActiveTab('recruiter');
    else if (role === 'college') setActiveTab('college');
    else if (role === 'mentor') setActiveTab('mentor');
    else setActiveTab('dashboard');
  };

  // User initials fallback
  const getInitials = (name?: string) => {
    if (!name) return 'SP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      {/* Top evaluator announcement bar for presentation mode */}
      <div className={`px-4 py-1.5 text-xs font-medium flex items-center justify-between transition-colors ${
        isDemoMode
          ? 'bg-amber-500 text-slate-900 border-b border-amber-600/30 font-semibold'
          : 'bg-indigo-50/80 text-indigo-900 border-b border-indigo-100/60'
      }`}>
        <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-white/90 shadow-2xs">
              {isDemoMode ? '⚡ Evaluator Preview' : '✨ Clean State'}
            </span>
            <span className="hidden sm:inline">
              {isDemoMode
                ? 'Presentation Demo Data Active (Evaluator Preview) — Evaluated with verified evidence.'
                : 'SkillPass starts completely clean with zero preloaded fake profiles.'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isDemoMode ? (
              <button
                onClick={resetToCleanSlate}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
                title="Reset back to pristine empty state"
              >
                <RotateCcw className="w-3 h-3 text-red-600" />
                <span>Reset Clean Slate</span>
              </button>
            ) : (
              <button
                onClick={loadPresentationDemoData}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-2xs cursor-pointer"
                title="Load realistic verified profile for quick hackathon evaluation"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Load Presentation Demo Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab(user ? 'dashboard' : 'landing')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                    SkillPass
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-indigo-50 text-indigo-700 rounded border border-indigo-100">
                    Passport
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                  Don't Just List Skills. Prove Them.
                </p>
              </div>
            </button>

            {/* Role Switcher (Hackathon USP) */}
            <div className="hidden lg:flex items-center p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
              {roles.map(r => {
                const Icon = r.icon;
                const isCurrent = activeRole === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleRoleChange(r.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-3">
            {/* Quick Passport Link if student profile exists */}
            {user && (
              <button
                onClick={() => setActiveTab('passport')}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                title="View shareable public digital passport"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>My Passport</span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-100">
                  {credibilityScore.totalScore}/100
                </span>
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {/* Notification Drawer */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <span className="text-xs font-bold text-slate-900">
                      Notifications ({notifications.length})
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Close
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications yet. Verified actions will appear here.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3 text-xs transition-colors cursor-pointer ${
                            n.read ? 'bg-white text-slate-600' : 'bg-indigo-50/40 text-slate-900 font-medium'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-900">{n.title}</span>
                            <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar / Auth Buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-indigo-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {user.college.split(' ')[0]}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Layers className="w-4 h-4 text-slate-400" />
                      <span>Student Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('passport');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Digital Passport ({credibilityScore.totalScore}/100)</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Profile & Settings</span>
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenLogin}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Student Login
                </button>
                <button
                  onClick={onOpenRegister}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-xs hover:shadow-indigo-200 cursor-pointer"
                >
                  Create Passport
                </button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 border-t border-slate-200 bg-white space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            Switch Perspective
          </div>
          <div className="grid grid-cols-2 gap-2">
            {roles.map(r => (
              <button
                key={r.id}
                onClick={() => {
                  handleRoleChange(r.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2 rounded-lg text-xs font-semibold ${
                  activeRole === r.id ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-50 text-slate-700'
                }`}
              >
                <span>{r.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
