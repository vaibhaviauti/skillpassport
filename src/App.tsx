import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { AuthModals } from './components/auth/AuthModals';
import { LandingPage } from './components/landing/LandingPage';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { SkillList } from './components/dashboard/SkillList';
import { EvidenceWallet } from './components/dashboard/EvidenceWallet';
import { ProjectShowcase } from './components/dashboard/ProjectShowcase';
import { CertificateSection } from './components/dashboard/CertificateSection';
import { AchievementTimeline } from './components/dashboard/AchievementTimeline';
import { GitHubIntegration } from './components/dashboard/GitHubIntegration';
import { SkillEvidenceGraph } from './components/dashboard/SkillEvidenceGraph';
import { SkillGapAnalyzer } from './components/dashboard/SkillGapAnalyzer';
import { CareerReadinessView } from './components/dashboard/CareerReadinessView';
import { SettingsView } from './components/dashboard/SettingsView';
import { PublicPassport } from './components/passport/PublicPassport';
import { RecruiterDashboard } from './components/recruiter/RecruiterDashboard';
import { CollegeDashboard } from './components/college/CollegeDashboard';
import { MentorDashboard } from './components/mentor/MentorDashboard';
import {
  Layers,
  FolderGit2,
  Wallet,
  Award,
  Trophy,
  GitBranch,
  Share2,
  Compass,
  TrendingUp,
  Settings,
  ShieldCheck,
  Home,
  Briefcase,
  Users,
} from 'lucide-react';

function AppContent() {
  const { user, activeTab, setActiveTab, activeRole, setActiveRole } = useApp();

  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  // Student Navigation Tabs
  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'passport', label: 'My Passport', icon: ShieldCheck },
    { id: 'skills', label: 'Skills', icon: Layers },
    { id: 'evidence', label: 'Evidence Wallet', icon: Wallet },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'github', label: 'GitHub Activity', icon: GitBranch },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'graph', label: 'Skill Graph', icon: Share2 },
    { id: 'gap', label: 'Skill Gap AI', icon: Compass },
    { id: 'career', label: 'Career Readiness', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderActiveView = () => {
    // If on Landing
    if (activeTab === 'landing' && !user) {
      return (
        <LandingPage
          onOpenRegister={() => setRegisterOpen(true)}
          onOpenLogin={() => setLoginOpen(true)}
        />
      );
    }

    // Role-specific primary views
    if (activeRole === 'recruiter' || activeTab === 'recruiter') {
      return <RecruiterDashboard />;
    }
    if (activeRole === 'college' || activeTab === 'college') {
      return <CollegeDashboard />;
    }
    if (activeRole === 'mentor' || activeTab === 'mentor') {
      return <MentorDashboard />;
    }

    // Student Views
    switch (activeTab) {
      case 'dashboard':
        return <StudentDashboard />;
      case 'passport':
        return <PublicPassport />;
      case 'skills':
        return <SkillList />;
      case 'evidence':
        return <EvidenceWallet />;
      case 'projects':
        return <ProjectShowcase />;
      case 'certificates':
        return <CertificateSection />;
      case 'achievements':
        return <AchievementTimeline />;
      case 'github':
        return <GitHubIntegration />;
      case 'graph':
        return <SkillEvidenceGraph />;
      case 'gap':
        return <SkillGapAnalyzer />;
      case 'career':
        return <CareerReadinessView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <StudentDashboard />;
    }
  };

  const isLandingView = activeTab === 'landing' && !user;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col">
      {/* Top Navbar */}
      <Header
        onOpenLogin={() => setLoginOpen(true)}
        onOpenRegister={() => setRegisterOpen(true)}
      />

      {/* Main Content Area */}
      {isLandingView ? (
        <main className="flex-1">{renderActiveView()}</main>
      ) : (
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Secondary Horizontal Student Navigation Tabs */}
          {activeRole === 'student' && (
            <div className="mb-6 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto scrollbar-none">
              {studentNavItems.map(item => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Active View Container */}
          <main className="animate-in fade-in duration-200">
            {renderActiveView()}
          </main>
        </div>
      )}

      {/* Authentication Modals */}
      <AuthModals
        loginOpen={loginOpen}
        registerOpen={registerOpen}
        onCloseLogin={() => setLoginOpen(false)}
        onCloseRegister={() => setRegisterOpen(false)}
        onOpenLogin={() => setLoginOpen(true)}
        onOpenRegister={() => setRegisterOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
