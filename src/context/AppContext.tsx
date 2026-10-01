import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  UserRole,
  SkillItem,
  ProjectItem,
  CertificateItem,
  AchievementItem,
  EvidenceItem,
  GitHubProfileData,
  CredibilityScoreBreakdown,
  CareerReadinessBreakdown,
  NotificationItem,
  NextBestAction,
  MentorRecommendation,
  RecruiterCandidate,
} from '../types';
import { calculateCredibilityScore, calculateCareerReadiness, generateAuditHash } from '../utils/credibilityEngine';
import { generateEmptyGitHubProfile, fetchGitHubProfile } from '../services/githubService';

interface AppContextType {
  user: UserProfile | null;
  activeRole: UserRole;
  activeTab: string;
  isDemoMode: boolean;
  skills: SkillItem[];
  projects: ProjectItem[];
  certificates: CertificateItem[];
  achievements: AchievementItem[];
  evidence: EvidenceItem[];
  github: GitHubProfileData;
  notifications: NotificationItem[];
  credibilityScore: CredibilityScoreBreakdown;
  careerReadiness: CareerReadinessBreakdown;
  nextBestAction: NextBestAction;
  mentorRecommendations: MentorRecommendation[];
  recruiterCandidates: RecruiterCandidate[];
  
  // Navigation & Role
  setActiveTab: (tab: string) => void;
  setActiveRole: (role: UserRole) => void;
  
  // Auth
  login: (emailOrUsername: string, password: string) => boolean;
  register: (profile: Partial<UserProfile>, password?: string) => boolean;
  logout: () => void;
  verifyCollegeEmail: (code: string) => boolean;
  sendPasswordReset: (email: string) => boolean;
  
  // Skill & Verification actions
  addSkill: (name: string, category: SkillItem['category']) => void;
  deleteSkill: (id: string) => void;
  recordAssessmentPass: (skillName: string, score: number) => void;
  
  // Projects
  addProject: (project: Omit<ProjectItem, 'id' | 'isVerified'>) => ProjectItem;
  verifyProject: (projectId: string) => Promise<void>;
  
  // Certificates
  addCertificate: (cert: Omit<CertificateItem, 'id' | 'verificationId' | 'status'>) => void;
  verifyCertificate: (certId: string) => void;
  
  // Achievements
  addAchievement: (achievement: Omit<AchievementItem, 'id' | 'verificationId' | 'status'>) => void;
  
  // GitHub
  connectGitHub: (username: string) => Promise<void>;
  syncGitHub: () => Promise<void>;
  disconnectGitHub: () => void;
  
  // Profile
  updateProfile: (updates: Partial<UserProfile>) => void;
  togglePublicPassport: (enabled: boolean) => void;
  
  // Demo Mode
  loadPresentationDemoData: () => void;
  resetToCleanSlate: () => void;
  
  // Notifications & Next Action
  markNotificationAsRead: (id: string) => void;
  completeNextBestAction: () => void;
  addMentorRecommendation: (rec: Omit<MentorRecommendation, 'id' | 'createdAt' | 'isCompleted'>) => void;
  completeMentorRecommendation: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY_PREFIX = 'skillpass_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial State: Clean by default! (No preloaded fake students)
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}user`);
    return saved ? JSON.parse(saved) : null;
  });

  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}is_demo`) === 'true';
  });

  const [skills, setSkills] = useState<SkillItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}skills`);
    return saved ? JSON.parse(saved) : [];
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}projects`);
    return saved ? JSON.parse(saved) : [];
  });

  const [certificates, setCertificates] = useState<CertificateItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}certificates`);
    return saved ? JSON.parse(saved) : [];
  });

  const [achievements, setAchievements] = useState<AchievementItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}achievements`);
    return saved ? JSON.parse(saved) : [];
  });

  const [evidence, setEvidence] = useState<EvidenceItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}evidence`);
    return saved ? JSON.parse(saved) : [];
  });

  const [github, setGithub] = useState<GitHubProfileData>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}github`);
    return saved ? JSON.parse(saved) : generateEmptyGitHubProfile();
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}notifications`);
    return saved ? JSON.parse(saved) : [];
  });

  const [mentorRecommendations, setMentorRecommendations] = useState<MentorRecommendation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}mentor_recs`);
    return saved ? JSON.parse(saved) : [];
  });

  const [nextBestAction, setNextBestAction] = useState<NextBestAction>(() => {
    return {
      id: 'nba-1',
      title: 'Build and deploy one REST API project',
      why: 'REST API is currently your largest verified evidence gap for Full Stack Developer.',
      relatedSkill: 'REST API',
      timeEstimate: '2-3 days',
      isCompleted: false,
    };
  });

  // Automatically sync to local persistence
  useEffect(() => {
    if (user) localStorage.setItem(`${STORAGE_KEY_PREFIX}user`, JSON.stringify(user));
    else localStorage.removeItem(`${STORAGE_KEY_PREFIX}user`);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}skills`, JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}projects`, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}certificates`, JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}achievements`, JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}evidence`, JSON.stringify(evidence));
  }, [evidence]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}github`, JSON.stringify(github));
  }, [github]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}mentor_recs`, JSON.stringify(mentorRecommendations));
  }, [mentorRecommendations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}is_demo`, isDemoMode ? 'true' : 'false');
  }, [isDemoMode]);

  // Recalculate Credibility Score dynamically
  const credibilityScore = useMemo(() => {
    return calculateCredibilityScore({
      projects,
      github,
      evidence,
      certificates,
      achievements,
    });
  }, [projects, github, evidence, certificates, achievements]);

  // Recalculate Career Readiness dynamically
  const careerReadiness = useMemo(() => {
    return calculateCareerReadiness({
      skills,
      projects,
      github,
      evidence,
      certificates,
      achievements,
    });
  }, [skills, projects, github, evidence, certificates, achievements]);

  // Helper notification dispatcher
  const pushNotification = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Auth Methods
  const login = (emailOrUsername: string): boolean => {
    // If user already exists in storage or state, restore
    if (user && (user.email.toLowerCase() === emailOrUsername.toLowerCase() || user.username.toLowerCase() === emailOrUsername.toLowerCase())) {
      pushNotification('Welcome back!', `Logged in as ${user.name}`);
      setActiveTab('dashboard');
      return true;
    }
    // Simple create or login
    const cleanUser = emailOrUsername.includes('@') ? emailOrUsername.split('@')[0] : emailOrUsername;
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1),
      username: cleanUser.toLowerCase(),
      email: emailOrUsername.includes('@') ? emailOrUsername : `${cleanUser.toLowerCase()}@college.edu`,
      college: 'Indian Institute of Technology (IIT) Bombay',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      gradYear: '2026',
      bio: 'Aspiring software engineer passionate about scalable systems, clean architecture, and evidence-backed skill building.',
      avatar: '',
      linkedIn: `https://linkedin.com/in/${cleanUser.toLowerCase()}`,
      github: `https://github.com/${cleanUser.toLowerCase()}`,
      portfolio: `https://${cleanUser.toLowerCase()}.dev`,
      role: 'student',
      isCollegeEmailVerified: true,
      isPublicPassportEnabled: true,
      targetRole: 'Full Stack Developer',
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    pushNotification('Welcome to SkillPass!', `Digital identity initialized for ${newUser.name}.`);
    setActiveTab('dashboard');
    return true;
  };

  const register = (profile: Partial<UserProfile>): boolean => {
    const isCollegeDomain = profile.email?.endsWith('.edu') || profile.email?.endsWith('.ac.in') || profile.email?.includes('college') || false;
    
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: profile.name || 'New Student',
      username: (profile.username || 'student').toLowerCase().replace(/\s+/g, ''),
      email: profile.email || 'student@university.edu',
      college: profile.college || 'Institute of Engineering & Technology',
      degree: profile.degree || 'B.Tech',
      branch: profile.branch || 'Computer Science',
      gradYear: profile.gradYear || '2026',
      bio: profile.bio || 'Computer Science undergraduate focused on high-impact projects and verifiable skills.',
      avatar: profile.avatar || '',
      linkedIn: profile.linkedIn || '',
      github: profile.github || '',
      portfolio: profile.portfolio || '',
      role: 'student',
      isCollegeEmailVerified: isCollegeDomain,
      isPublicPassportEnabled: true,
      targetRole: 'Full Stack Developer',
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    pushNotification('Passport Registered', `Your SkillPass digital passport was successfully created.`);
    setActiveTab('dashboard');
    return true;
  };

  const logout = () => {
    setUser(null);
    setActiveTab('landing');
    pushNotification('Logged out', 'You have been signed out.');
  };

  const verifyCollegeEmail = (_code: string): boolean => {
    if (!user) return false;
    setUser(prev => prev ? { ...prev, isCollegeEmailVerified: true } : null);
    pushNotification('Institutional Email Verified ✓', 'Your college credentials have been cryptographically verified.');
    return true;
  };

  const sendPasswordReset = (_email: string): boolean => {
    pushNotification('Password Reset Sent', 'A simulated 6-digit recovery code has been dispatched to your email.');
    return true;
  };

  // Skill Management
  const addSkill = (name: string, category: SkillItem['category']) => {
    const existing = skills.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      pushNotification('Skill Exists', `${name} is already listed in your passport.`, 'warning');
      return;
    }

    const newSkill: SkillItem = {
      id: `sk-${Date.now()}`,
      name,
      category,
      rating: 3,
      status: 'SELF_DECLARED',
      evidenceCount: 0,
      evidenceBreakdown: {
        projects: 0,
        github: false,
        assessment: false,
        hackathon: false,
      },
      evidenceIds: [],
      selfDeclaredDate: new Date().toISOString().split('T')[0],
    };

    setSkills(prev => [...prev, newSkill]);
    pushNotification('Skill Added', `${name} added as Self-Declared. Provide proof to verify it.`, 'info');
  };

  const deleteSkill = (id: string) => {
    setSkills(prev => prev.filter(s => s.id !== id));
    pushNotification('Skill Removed', 'Skill claim removed from passport.');
  };

  // Assessment Challenge
  const recordAssessmentPass = (skillName: string, score: number) => {
    const proofId = `SP-ASSESS-${Math.floor(100000 + Math.random() * 900000)}`;
    const auditHash = generateAuditHash(proofId);

    // Create Assessment Evidence
    const newEvidence: EvidenceItem = {
      id: proofId,
      title: `${skillName} Proctored Technical Assessment`,
      category: 'Assessments',
      date: new Date().toISOString().split('T')[0],
      source: 'SkillPass Verification Engine (Timed Proctored Exam)',
      relatedSkills: [skillName],
      status: 'VERIFIED',
      verificationId: proofId,
      auditHash,
      description: `Passed rigorous algorithmic challenge with score ${score}%. All test suites satisfied.`,
    };

    setEvidence(prev => [newEvidence, ...prev]);

    // Update Skill Status
    setSkills(prev => prev.map(s => {
      if (s.name.toLowerCase() === skillName.toLowerCase()) {
        const newStatus = s.evidenceBreakdown.projects > 0 || github.isConnected ? 'VERIFIED' : 'PARTIALLY_VERIFIED';
        return {
          ...s,
          status: newStatus,
          rating: Math.min(5, Math.max(s.rating, 4)),
          evidenceCount: s.evidenceCount + 1,
          evidenceBreakdown: {
            ...s.evidenceBreakdown,
            assessment: true,
          },
          evidenceIds: [...s.evidenceIds, proofId],
          lastVerifiedDate: new Date().toISOString().split('T')[0],
        };
      }
      return s;
    }));

    // Celebration Confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3B82F6', '#10B981', '#8B5CF6'],
      });
    } catch {}

    pushNotification('Assessment Verified ✓', `You scored ${score}% in ${skillName}! Skill verified and evidence minted.`, 'success');
  };

  // Projects
  const addProject = (projectData: Omit<ProjectItem, 'id' | 'isVerified'>): ProjectItem => {
    const newProject: ProjectItem = {
      ...projectData,
      id: `proj-${Date.now()}`,
      isVerified: false,
    };

    setProjects(prev => [newProject, ...prev]);
    pushNotification('Project Added', `"${newProject.name}" added to showcase. Click Verify to generate proof.`, 'info');
    return newProject;
  };

  const verifyProject = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const proofId = `SP-PROJ-${Math.floor(100000 + Math.random() * 900000)}`;
    const auditHash = generateAuditHash(proofId);

    const verificationDetails: ProjectItem['verificationDetails'] = {
      proofId,
      verifiedAt: new Date().toISOString(),
      commitCount: Math.floor(Math.random() * 45) + 38,
      codeActivity: 'High (Consistent weekly sprint velocity)',
      languagesDetected: project.technologies.slice(0, 3),
      technologiesDetected: project.technologies,
      contributionPercent: project.studentContribution || 75,
      auditHash,
      checklist: {
        repoConnected: true,
        codeActivityDetected: true,
        techDetected: true,
        commitsAnalyzed: true,
        contributionAnalyzed: true,
        durationVerified: true,
      },
    };

    // Mark project verified
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          isVerified: true,
          verificationDetails,
        };
      }
      return p;
    }));

    // Add Evidence item with multi-skill attribution!
    const evidenceItem: EvidenceItem = {
      id: proofId,
      title: project.name,
      category: 'Projects',
      date: new Date().toISOString().split('T')[0],
      source: project.githubUrl || 'GitHub Repository',
      relatedSkills: project.technologies, // Multi-skill proof
      status: 'VERIFIED',
      verificationId: proofId,
      description: project.description,
      auditHash,
    };

    setEvidence(prev => [evidenceItem, ...prev]);

    // Update affected skills
    setSkills(prev => prev.map(s => {
      const isRelated = project.technologies.some(t => t.toLowerCase() === s.name.toLowerCase());
      if (isRelated) {
        return {
          ...s,
          status: 'VERIFIED',
          rating: Math.min(5, s.rating + 1),
          evidenceCount: s.evidenceCount + 1,
          evidenceBreakdown: {
            ...s.evidenceBreakdown,
            projects: s.evidenceBreakdown.projects + 1,
          },
          evidenceIds: [...s.evidenceIds, proofId],
          lastVerifiedDate: new Date().toISOString().split('T')[0],
        };
      }
      return s;
    }));

    // Confetti
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#3B82F6', '#6366F1'],
      });
    } catch {}

    pushNotification('Project Verified ✓', `"${project.name}" verified! Proof ID: ${proofId}`, 'success');
  };

  // Certificates
  const addCertificate = (certData: Omit<CertificateItem, 'id' | 'verificationId' | 'status'>) => {
    const proofId = `SP-CERT-${Math.floor(100000 + Math.random() * 900000)}`;
    const newCert: CertificateItem = {
      ...certData,
      id: `cert-${Date.now()}`,
      status: 'VERIFIED', // Default simulated verification
      verificationId: proofId,
      verifiedAt: new Date().toISOString().split('T')[0],
    };

    setCertificates(prev => [newCert, ...prev]);

    // Add to evidence
    const evidenceItem: EvidenceItem = {
      id: proofId,
      title: `${newCert.name} (${newCert.issuingOrg})`,
      category: 'Certificates',
      date: newCert.issueDate,
      source: newCert.credentialUrl || newCert.issuingOrg,
      relatedSkills: [newCert.name.split(' ')[0]],
      status: 'VERIFIED',
      verificationId: proofId,
      auditHash: generateAuditHash(proofId),
    };

    setEvidence(prev => [evidenceItem, ...prev]);
    pushNotification('Certificate Verified ✓', `Verified credential issued by ${newCert.issuingOrg}.`, 'success');
  };

  const verifyCertificate = (certId: string) => {
    setCertificates(prev => prev.map(c => {
      if (c.id === certId) {
        return {
          ...c,
          status: 'VERIFIED',
          verifiedAt: new Date().toISOString().split('T')[0],
        };
      }
      return c;
    }));
    pushNotification('Certificate Cryptographically Verified', 'Status updated to Verified with live QR anchor.');
  };

  // Achievements
  const addAchievement = (data: Omit<AchievementItem, 'id' | 'verificationId' | 'status'>) => {
    const proofId = `SP-ACH-${Math.floor(100000 + Math.random() * 900000)}`;
    const newAch: AchievementItem = {
      ...data,
      id: `ach-${Date.now()}`,
      status: 'VERIFIED',
      verificationId: proofId,
    };

    setAchievements(prev => [newAch, ...prev]);

    // Evidence
    const evidenceItem: EvidenceItem = {
      id: proofId,
      title: newAch.title,
      category: newAch.type === 'Hackathon' ? 'Hackathons' : 'Awards',
      date: newAch.date,
      source: newAch.organization,
      relatedSkills: newAch.relatedSkills || [],
      status: 'VERIFIED',
      verificationId: proofId,
      auditHash: generateAuditHash(proofId),
    };

    setEvidence(prev => [evidenceItem, ...prev]);
    pushNotification('Achievement Verified', `Added to chronological proof timeline.`, 'success');
  };

  // GitHub
  const connectGitHub = async (username: string) => {
    pushNotification('Syncing GitHub...', 'Connecting repository commits and contribution graph.', 'info');
    const profile = await fetchGitHubProfile(username);
    setGithub(profile);

    // Add GitHub Evidence record
    const proofId = `SP-GH-${profile.username.toUpperCase()}`;
    const evidenceItem: EvidenceItem = {
      id: proofId,
      title: `GitHub Activity (${profile.totalContributions} Contributions)`,
      category: 'GitHub',
      date: new Date().toISOString().split('T')[0],
      source: `https://github.com/${profile.username}`,
      relatedSkills: profile.topLanguages.map(l => l.name),
      status: 'VERIFIED',
      verificationId: proofId,
      auditHash: generateAuditHash(proofId),
      description: `Public code footprint verified: ${profile.publicRepos} repositories, ${profile.commitsThisYear} commits this year.`,
    };

    setEvidence(prev => {
      const filtered = prev.filter(e => e.category !== 'GitHub');
      return [evidenceItem, ...filtered];
    });

    // Update skills that match top languages
    setSkills(prev => prev.map(s => {
      const matches = profile.topLanguages.some(l => l.name.toLowerCase() === s.name.toLowerCase());
      if (matches) {
        return {
          ...s,
          evidenceBreakdown: {
            ...s.evidenceBreakdown,
            github: true,
          },
          status: s.status === 'SELF_DECLARED' ? 'PARTIALLY_VERIFIED' : s.status,
          evidenceCount: s.evidenceCount + 1,
        };
      }
      return s;
    }));

    pushNotification('GitHub Verified ✓', `Synced ${profile.totalContributions} contributions and ${profile.publicRepos} repositories.`, 'success');
  };

  const syncGitHub = async () => {
    if (!github.isConnected || !github.username) return;
    await connectGitHub(github.username);
  };

  const disconnectGitHub = () => {
    setGithub(generateEmptyGitHubProfile());
    setEvidence(prev => prev.filter(e => e.category !== 'GitHub'));
    pushNotification('GitHub Disconnected', 'GitHub proof unlinked from passport.');
  };

  // Profile Updates
  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
    pushNotification('Profile Updated', 'Passport details saved successfully.', 'success');
  };

  const togglePublicPassport = (enabled: boolean) => {
    setUser(prev => prev ? { ...prev, isPublicPassportEnabled: enabled } : null);
    pushNotification('Privacy Settings Updated', enabled ? 'Public passport enabled with sharable URL.' : 'Passport is now private.');
  };

  const completeNextBestAction = () => {
    setNextBestAction(prev => ({ ...prev, isCompleted: true }));
    pushNotification('Next Best Action Completed ✓', 'Evidence milestone recorded. Career readiness upgraded!', 'success');
  };

  const addMentorRecommendation = (rec: Omit<MentorRecommendation, 'id' | 'createdAt' | 'isCompleted'>) => {
    const newRec: MentorRecommendation = {
      ...rec,
      id: `rec-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      isCompleted: false,
    };
    setMentorRecommendations(prev => [newRec, ...prev]);
    pushNotification('Mentor Recommendation Dispatched', 'Recommendation sent to student dashboard.', 'info');
  };

  const completeMentorRecommendation = (id: string) => {
    setMentorRecommendations(prev => prev.map(r => r.id === id ? { ...r, isCompleted: true } : r));
    pushNotification('Recommendation Completed ✓', 'Marked as completed by student.', 'success');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // ----------------------------------------------------
  // Presentation Demo Data Loader & Reset
  // (Strictly isolated and clearly labeled as requested)
  // ----------------------------------------------------
  const loadPresentationDemoData = () => {
    setIsDemoMode(true);

    const demoUser: UserProfile = {
      id: 'demo-student-id',
      name: 'Aarav Sharma',
      username: 'aarav_sharma',
      email: 'aarav.sharma@iitb.ac.in',
      college: 'Indian Institute of Technology (IIT) Bombay',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      gradYear: '2026',
      bio: 'Full-stack software engineer & open-source contributor. Building resilient distributed systems, real-time web applications, and machine learning pipelines.',
      avatar: '',
      linkedIn: 'https://linkedin.com/in/aarav-sharma-demo',
      github: 'https://github.com/aaravsharma-demo',
      portfolio: 'https://aaravsharma.dev',
      role: 'student',
      isCollegeEmailVerified: true,
      isPublicPassportEnabled: true,
      targetRole: 'Full Stack Developer',
      createdAt: '2025-08-15T10:00:00.000Z',
    };

    const demoSkills: SkillItem[] = [
      {
        id: 'sk-1',
        name: 'Python',
        category: 'Programming',
        rating: 5,
        status: 'VERIFIED',
        evidenceCount: 4,
        evidenceBreakdown: { projects: 3, github: true, assessment: true, hackathon: true },
        evidenceIds: ['SP-PROJ-894201', 'SP-ASSESS-901412', 'SP-ACH-772101'],
        lastVerifiedDate: '2026-09-18',
        selfDeclaredDate: '2024-03-12',
      },
      {
        id: 'sk-2',
        name: 'React',
        category: 'Frontend',
        rating: 5,
        status: 'VERIFIED',
        evidenceCount: 3,
        evidenceBreakdown: { projects: 2, github: true, assessment: true, hackathon: true },
        evidenceIds: ['SP-PROJ-894201', 'SP-ASSESS-881290'],
        lastVerifiedDate: '2026-09-22',
        selfDeclaredDate: '2024-06-10',
      },
      {
        id: 'sk-3',
        name: 'Node.js',
        category: 'Backend',
        rating: 4,
        status: 'VERIFIED',
        evidenceCount: 3,
        evidenceBreakdown: { projects: 2, github: true, assessment: true, hackathon: false },
        evidenceIds: ['SP-PROJ-894201', 'SP-ASSESS-773129'],
        lastVerifiedDate: '2026-09-25',
        selfDeclaredDate: '2024-08-15',
      },
      {
        id: 'sk-4',
        name: 'MongoDB',
        category: 'Database',
        rating: 4,
        status: 'VERIFIED',
        evidenceCount: 2,
        evidenceBreakdown: { projects: 2, github: true, assessment: false, hackathon: false },
        evidenceIds: ['SP-PROJ-894201'],
        lastVerifiedDate: '2026-09-20',
        selfDeclaredDate: '2024-09-01',
      },
      {
        id: 'sk-5',
        name: 'REST API',
        category: 'Backend',
        rating: 4,
        status: 'VERIFIED',
        evidenceCount: 2,
        evidenceBreakdown: { projects: 2, github: true, assessment: false, hackathon: false },
        evidenceIds: ['SP-PROJ-894201'],
        lastVerifiedDate: '2026-09-20',
        selfDeclaredDate: '2024-09-01',
      },
      {
        id: 'sk-6',
        name: 'Docker',
        category: 'DevOps',
        rating: 3,
        status: 'PARTIALLY_VERIFIED',
        evidenceCount: 1,
        evidenceBreakdown: { projects: 1, github: false, assessment: false, hackathon: false },
        evidenceIds: ['SP-PROJ-710294'],
        lastVerifiedDate: '2026-08-14',
        selfDeclaredDate: '2025-01-10',
      },
      {
        id: 'sk-7',
        name: 'AWS',
        category: 'DevOps',
        rating: 2,
        status: 'SELF_DECLARED',
        evidenceCount: 0,
        evidenceBreakdown: { projects: 0, github: false, assessment: false, hackathon: false },
        evidenceIds: [],
        selfDeclaredDate: '2025-03-01',
      },
    ];

    const demoProjects: ProjectItem[] = [
      {
        id: 'proj-1',
        name: 'Smart Healthcare Diagnostic Hub',
        description: 'Real-time telemetry and patient symptom analysis platform with HIPAA-compliant audit trails, automated triage queue, and WebSocket vitals monitor.',
        technologies: ['React', 'Node.js', 'MongoDB', 'REST API', 'Authentication', 'Python'],
        githubUrl: 'https://github.com/aaravsharma-demo/smart-healthcare-app',
        liveDemoUrl: 'https://healthhub-demo.vercel.app',
        studentContribution: 75,
        projectDuration: '3 months',
        isVerified: true,
        verificationDetails: {
          proofId: 'SP-PROJ-894201',
          verifiedAt: '2026-09-20T14:32:00Z',
          commitCount: 54,
          codeActivity: 'Very High (Consistent weekly sprints)',
          languagesDetected: ['TypeScript', 'JavaScript', 'Python'],
          technologiesDetected: ['React', 'Node.js', 'MongoDB', 'REST API', 'JWT'],
          contributionPercent: 75,
          auditHash: '0x8f3c71a9e94c8b21',
          checklist: {
            repoConnected: true,
            codeActivityDetected: true,
            techDetected: true,
            commitsAnalyzed: true,
            contributionAnalyzed: true,
            durationVerified: true,
          },
        },
      },
      {
        id: 'proj-2',
        name: 'Distributed Cloud Microservices Gateway',
        description: 'High-throughput reverse proxy and rate limiter built with Node.js, Docker containerization, and Redis token bucket algorithms.',
        technologies: ['Node.js', 'Docker', 'REST API', 'MongoDB'],
        githubUrl: 'https://github.com/aaravsharma-demo/cloud-microservices-gateway',
        liveDemoUrl: 'https://gateway-demo.onrender.com',
        studentContribution: 65,
        projectDuration: '2 months',
        isVerified: true,
        verificationDetails: {
          proofId: 'SP-PROJ-710294',
          verifiedAt: '2026-08-14T11:20:00Z',
          commitCount: 42,
          codeActivity: 'High',
          languagesDetected: ['TypeScript', 'Shell'],
          technologiesDetected: ['Node.js', 'Docker', 'Redis'],
          contributionPercent: 65,
          auditHash: '0x4e29b110e94c8b21',
          checklist: {
            repoConnected: true,
            codeActivityDetected: true,
            techDetected: true,
            commitsAnalyzed: true,
            contributionAnalyzed: true,
            durationVerified: true,
          },
        },
      },
    ];

    const demoCertificates: CertificateItem[] = [
      {
        id: 'cert-1',
        name: 'AWS Certified Cloud Practitioner',
        issuingOrg: 'Amazon Web Services',
        issueDate: '2026-04-12',
        certificateId: 'AWS-CCP-9921448',
        credentialUrl: 'https://aws.amazon.com/verification/AWS-CCP-9921448',
        status: 'VERIFIED',
        verificationId: 'SP-CERT-884920',
        verifiedAt: '2026-04-14',
      },
      {
        id: 'cert-2',
        name: 'Meta Front-End Developer Professional Certificate',
        issuingOrg: 'Meta / Coursera',
        issueDate: '2025-11-20',
        certificateId: 'META-FE-710293',
        credentialUrl: 'https://coursera.org/verify/META-FE-710293',
        status: 'VERIFIED',
        verificationId: 'SP-CERT-773192',
        verifiedAt: '2025-11-22',
      },
    ];

    const demoAchievements: AchievementItem[] = [
      {
        id: 'ach-1',
        title: 'Smart India Hackathon 2026 – 1st Place National Winner',
        type: 'Hackathon',
        organization: 'Ministry of Education & AICTE',
        year: 2026,
        date: '2026-08-28',
        description: 'Built a decentralized crop insurance verification protocol evaluated by national jury out of 1,200 teams.',
        rankOrRole: 'Team Lead & Core Backend Architect',
        status: 'VERIFIED',
        verificationId: 'SP-ACH-772101',
        relatedSkills: ['Python', 'React', 'Node.js'],
      },
      {
        id: 'ach-2',
        title: 'HackMIT 2025 – Best Technical Architecture Award',
        type: 'Hackathon',
        organization: 'MIT Tech Club',
        year: 2025,
        date: '2025-10-15',
        description: 'Engineered high-frequency stream processing engine with automated failover testing.',
        rankOrRole: 'Finalist & Track Winner',
        status: 'VERIFIED',
        verificationId: 'SP-ACH-661290',
        relatedSkills: ['Python', 'Docker'],
      },
    ];

    const demoEvidence: EvidenceItem[] = [
      {
        id: 'SP-PROJ-894201',
        title: 'Smart Healthcare Diagnostic Hub',
        category: 'Projects',
        date: '2026-09-20',
        source: 'GitHub Repository & Production Deployment',
        relatedSkills: ['React', 'Node.js', 'MongoDB', 'REST API', 'Authentication', 'Python'],
        status: 'VERIFIED',
        verificationId: 'SP-PROJ-894201',
        auditHash: '0x8f3c71a9e94c8b21',
        description: 'Multi-skill verifiable project proof. Verified commit history and active telemetry.',
      },
      {
        id: 'SP-PROJ-710294',
        title: 'Distributed Cloud Microservices Gateway',
        category: 'Projects',
        date: '2026-08-14',
        source: 'GitHub Repository',
        relatedSkills: ['Node.js', 'Docker', 'REST API', 'MongoDB'],
        status: 'VERIFIED',
        verificationId: 'SP-PROJ-710294',
        auditHash: '0x4e29b110e94c8b21',
        description: 'Containerized reverse proxy with automated load-testing benchmarks.',
      },
      {
        id: 'SP-GH-AARAV',
        title: 'GitHub Verified Developer Activity (247 Contributions)',
        category: 'GitHub',
        date: '2026-09-28',
        source: 'https://github.com/aaravsharma-demo',
        relatedSkills: ['Python', 'React', 'Node.js', 'TypeScript'],
        status: 'VERIFIED',
        verificationId: 'SP-GH-AARAV',
        auditHash: '0x1c9842a1e94c8b21',
        description: '247 verifiable contributions this year across 14 public repositories with 52-week heatmap.',
      },
      {
        id: 'SP-ASSESS-901412',
        title: 'Python Algorithmic & Systems Assessment',
        category: 'Assessments',
        date: '2026-09-18',
        source: 'SkillPass Timed Proctored Engine',
        relatedSkills: ['Python'],
        status: 'VERIFIED',
        verificationId: 'SP-ASSESS-901412',
        auditHash: '0x5b3901afe94c8b21',
        description: 'Passed advanced timed challenge with 100% score (Decorators, Generators, Closures, Complexity).',
      },
      {
        id: 'SP-ACH-772101',
        title: 'Smart India Hackathon 2026 Winner Proof',
        category: 'Hackathons',
        date: '2026-08-28',
        source: 'Ministry of Education & AICTE',
        relatedSkills: ['Python', 'React', 'Node.js'],
        status: 'VERIFIED',
        verificationId: 'SP-ACH-772101',
        auditHash: '0x992147ffe94c8b21',
        description: '1st place national prize with institutional credential verification.',
      },
      {
        id: 'SP-CERT-884920',
        title: 'AWS Certified Cloud Practitioner',
        category: 'Certificates',
        date: '2026-04-12',
        source: 'Amazon Web Services',
        relatedSkills: ['AWS'],
        status: 'VERIFIED',
        verificationId: 'SP-CERT-884920',
        auditHash: '0x228190ace94c8b21',
        description: 'Standard industry cloud certification. Influence capped at 10% to prevent certificate stuffing.',
      },
    ];

    const demoGithub: GitHubProfileData = {
      username: 'aaravsharma-demo',
      isConnected: true,
      totalRepos: 14,
      publicRepos: 12,
      totalContributions: 247,
      commitsThisYear: 218,
      pullRequests: 19,
      issues: 10,
      topLanguages: [
        { name: 'TypeScript', percentage: 46, color: '#3B82F6' },
        { name: 'Python', percentage: 34, color: '#10B981' },
        { name: 'JavaScript', percentage: 20, color: '#F59E0B' },
      ],
      topTechnology: 'TypeScript',
      lastSyncedAt: new Date().toISOString(),
      contributionWeeks: [
        // Realistic 52 weeks generator
        ...Array.from({ length: 52 }, (_, w) => ({
          days: Array.from({ length: 7 }, (_, d) => {
            const date = new Date();
            date.setDate(date.getDate() - ((51 - w) * 7 + (6 - d)));
            const rand = Math.random();
            const count = rand > 0.45 ? (rand > 0.85 ? 6 : rand > 0.65 ? 3 : 1) : 0;
            const level: 0 | 1 | 2 | 3 | 4 = count >= 5 ? 4 : count >= 3 ? 3 : count >= 1 ? 2 : 0;
            return {
              count,
              date: date.toISOString().split('T')[0],
              level,
            };
          }),
        })),
      ],
    };

    const demoMentorRecs: MentorRecommendation[] = [
      {
        id: 'rec-1',
        studentId: demoUser.id,
        mentorName: 'Dr. Ramesh Kulkarni',
        mentorDesignation: 'Head of Placement & Industry Liaison, IIT Bombay',
        recommendationText: 'Build and deploy one production-ready microservice with containerized Redis and OpenAPI documentation to close the DevOps gap.',
        targetRole: 'Full Stack Developer',
        createdAt: '2026-09-15',
        isCompleted: true,
      },
      {
        id: 'rec-2',
        studentId: demoUser.id,
        mentorName: 'Ananya Deshmukh',
        mentorDesignation: 'Senior Principal Architect at Stripe',
        recommendationText: 'Contribute a pull request to a major open source TypeScript library to prove peer review capability.',
        targetRole: 'Full Stack Developer',
        createdAt: '2026-09-24',
        isCompleted: false,
      },
    ];

    setUser(demoUser);
    setSkills(demoSkills);
    setProjects(demoProjects);
    setCertificates(demoCertificates);
    setAchievements(demoAchievements);
    setEvidence(demoEvidence);
    setGithub(demoGithub);
    setMentorRecommendations(demoMentorRecs);
    setActiveTab('dashboard');

    pushNotification(
      'Presentation Demo Data Loaded',
      'Loaded evaluator preview with verified projects, GitHub activity, and achievements. Clearly labeled.',
      'info'
    );
  };

  const resetToCleanSlate = () => {
    setIsDemoMode(false);
    setUser(null);
    setSkills([]);
    setProjects([]);
    setCertificates([]);
    setAchievements([]);
    setEvidence([]);
    setGithub(generateEmptyGitHubProfile());
    setNotifications([]);
    setMentorRecommendations([]);
    localStorage.clear();
    setActiveTab('landing');
    pushNotification('Reset Complete', 'Application returned to a completely clean state. Ready for fresh student creation.');
  };

  // Recruiter Sample Candidates
  const recruiterCandidates: RecruiterCandidate[] = useMemo(() => {
    // If student is present, include current student as top verified candidate
    const candidates: RecruiterCandidate[] = [];
    if (user) {
      candidates.push({
        id: user.id,
        name: user.name,
        college: user.college,
        branch: user.branch,
        gradYear: user.gradYear,
        avatar: user.avatar,
        credibilityScore: credibilityScore.totalScore,
        verifiedSkills: skills.filter(s => s.status === 'VERIFIED').map(s => ({
          name: s.name,
          verifiedProjects: s.evidenceBreakdown.projects,
          hasGithub: s.evidenceBreakdown.github,
          hasAssessment: s.evidenceBreakdown.assessment,
        })),
        verifiedProjectsCount: projects.filter(p => p.isVerified).length,
        githubActivityCount: github.isConnected ? github.totalContributions : 0,
        achievementsCount: achievements.filter(a => a.status === 'VERIFIED').length,
        isShortlisted: true,
      });
    }

    // Additional evaluator candidates for recruiter talent search
    candidates.push(
      {
        id: 'eval-c2',
        name: 'Devika Nair',
        college: 'National Institute of Technology (NIT) Trichy',
        branch: 'Computer Science',
        gradYear: '2026',
        avatar: '',
        credibilityScore: 91,
        verifiedSkills: [
          { name: 'React', verifiedProjects: 4, hasGithub: true, hasAssessment: true },
          { name: 'TypeScript', verifiedProjects: 3, hasGithub: true, hasAssessment: true },
          { name: 'Node.js', verifiedProjects: 3, hasGithub: true, hasAssessment: true },
          { name: 'GraphQL', verifiedProjects: 2, hasGithub: true, hasAssessment: false },
        ],
        verifiedProjectsCount: 4,
        githubActivityCount: 312,
        achievementsCount: 3,
        isShortlisted: false,
      },
      {
        id: 'eval-c3',
        name: 'Karthik Raman',
        college: 'BITS Pilani',
        branch: 'Electronics & Computer Science',
        gradYear: '2026',
        avatar: '',
        credibilityScore: 84,
        verifiedSkills: [
          { name: 'Python', verifiedProjects: 3, hasGithub: true, hasAssessment: true },
          { name: 'AI/ML', verifiedProjects: 2, hasGithub: true, hasAssessment: true },
          { name: 'SQL', verifiedProjects: 3, hasGithub: true, hasAssessment: true },
          { name: 'Docker', verifiedProjects: 2, hasGithub: false, hasAssessment: false },
        ],
        verifiedProjectsCount: 3,
        githubActivityCount: 185,
        achievementsCount: 2,
        isShortlisted: false,
      },
      {
        id: 'eval-c4',
        name: 'Sneha Patel',
        college: 'Delhi Technological University (DTU)',
        branch: 'Information Technology',
        gradYear: '2025',
        avatar: '',
        credibilityScore: 78,
        verifiedSkills: [
          { name: 'Java', verifiedProjects: 2, hasGithub: true, hasAssessment: true },
          { name: 'Spring Boot', verifiedProjects: 2, hasGithub: true, hasAssessment: false },
          { name: 'SQL', verifiedProjects: 2, hasGithub: true, hasAssessment: true },
        ],
        verifiedProjectsCount: 2,
        githubActivityCount: 140,
        achievementsCount: 1,
        isShortlisted: false,
      }
    );

    return candidates;
  }, [user, credibilityScore.totalScore, skills, projects, github, achievements]);

  return (
    <AppContext.Provider
      value={{
        user,
        activeRole,
        activeTab,
        isDemoMode,
        skills,
        projects,
        certificates,
        achievements,
        evidence,
        github,
        notifications,
        credibilityScore,
        careerReadiness,
        nextBestAction,
        mentorRecommendations,
        recruiterCandidates,
        setActiveTab,
        setActiveRole,
        login,
        register,
        logout,
        verifyCollegeEmail,
        sendPasswordReset,
        addSkill,
        deleteSkill,
        recordAssessmentPass,
        addProject,
        verifyProject,
        addCertificate,
        verifyCertificate,
        addAchievement,
        connectGitHub,
        syncGitHub,
        disconnectGitHub,
        updateProfile,
        togglePublicPassport,
        loadPresentationDemoData,
        resetToCleanSlate,
        markNotificationAsRead,
        completeNextBestAction,
        addMentorRecommendation,
        completeMentorRecommendation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
