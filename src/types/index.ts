export type VerificationStatus = 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'SELF_DECLARED' | 'INVALID';

export type UserRole = 'student' | 'recruiter' | 'college' | 'mentor';

export type SkillCategory = 'Programming' | 'Frontend' | 'Backend' | 'Database' | 'AI/ML' | 'DevOps' | 'Tools';

export type EvidenceCategory = 'Projects' | 'GitHub' | 'Certificates' | 'Hackathons' | 'Internships' | 'Assessments' | 'Open Source' | 'Awards';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  college: string;
  degree: string;
  branch: string;
  gradYear: string;
  bio: string;
  avatar: string; // Base64 data URL or empty
  linkedIn: string;
  github: string;
  portfolio: string;
  role: UserRole;
  isCollegeEmailVerified: boolean;
  isPublicPassportEnabled: boolean;
  targetRole: string;
  createdAt: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  rating: number; // 1-5
  status: VerificationStatus;
  evidenceCount: number;
  evidenceBreakdown: {
    projects: number;
    github: boolean;
    assessment: boolean;
    hackathon: boolean;
  };
  evidenceIds: string[];
  lastVerifiedDate?: string;
  selfDeclaredDate: string;
}

export interface EvidenceItem {
  id: string; // SP-EV-xxxxxx
  title: string;
  category: EvidenceCategory;
  date: string;
  source: string;
  relatedSkills: string[]; // Multi-skill proof
  status: VerificationStatus;
  verificationId: string;
  description?: string;
  auditHash?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveDemoUrl?: string;
  screenshotUrl?: string;
  teamMembers?: string;
  studentContribution: number; // e.g. 65%
  projectDuration: string;
  isVerified: boolean;
  verificationDetails?: {
    proofId: string;
    verifiedAt: string;
    commitCount: number;
    codeActivity: string;
    languagesDetected: string[];
    technologiesDetected: string[];
    contributionPercent: number;
    auditHash: string;
    checklist: {
      repoConnected: boolean;
      codeActivityDetected: boolean;
      techDetected: boolean;
      commitsAnalyzed: boolean;
      contributionAnalyzed: boolean;
      durationVerified: boolean;
    };
  };
}

export interface CertificateItem {
  id: string;
  name: string;
  issuingOrg: string;
  issueDate: string;
  certificateId: string;
  credentialUrl: string;
  imageUrl?: string;
  status: VerificationStatus;
  verificationId: string;
  verifiedAt?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  type: 'Hackathon' | 'Competition' | 'Award' | 'Internship' | 'Workshop' | 'Open Source' | 'Technical Event';
  organization: string;
  year: number;
  date: string;
  description: string;
  rankOrRole?: string;
  status: VerificationStatus;
  verificationId: string;
  relatedSkills: string[];
}

export interface GitHubProfileData {
  username: string;
  isConnected: boolean;
  totalRepos: number;
  publicRepos: number;
  totalContributions: number;
  commitsThisYear: number;
  pullRequests: number;
  issues: number;
  topLanguages: Array<{ name: string; percentage: number; color: string }>;
  topTechnology: string;
  lastSyncedAt?: string;
  contributionWeeks: Array<{
    days: Array<{
      count: number;
      date: string;
      level: 0 | 1 | 2 | 3 | 4;
    }>;
  }>;
}

export interface CredibilityScoreBreakdown {
  totalScore: number;
  label: 'Exceptional Evidence' | 'Strong Evidence' | 'Moderate Evidence' | 'Developing Evidence' | 'Unverified';
  verifiedProjectsPoints: number; // Max 35
  githubEvidencePoints: number;   // Max 25
  assessmentPoints: number;       // Max 15
  achievementsPoints: number;     // Max 15
  certificatesPoints: number;     // Max 10 (capped)
  formulaExplanation: string;
}

export interface CareerReadinessBreakdown {
  overall: number;
  technicalProof: number;
  projectProof: number;
  githubEvidence: number;
  industryExposure: number;
  assessmentsScore: number;
  professionalProfile: number;
}

export interface NextBestAction {
  id: string;
  title: string;
  why: string;
  relatedSkill: string;
  timeEstimate: string;
  isCompleted: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface MentorRecommendation {
  id: string;
  studentId: string;
  mentorName: string;
  mentorDesignation: string;
  recommendationText: string;
  targetRole: string;
  createdAt: string;
  isCompleted: boolean;
}

export interface RecruiterCandidate {
  id: string;
  name: string;
  college: string;
  branch: string;
  gradYear: string;
  avatar: string;
  credibilityScore: number;
  verifiedSkills: Array<{
    name: string;
    verifiedProjects: number;
    hasGithub: boolean;
    hasAssessment: boolean;
  }>;
  verifiedProjectsCount: number;
  githubActivityCount: number;
  achievementsCount: number;
  isShortlisted?: boolean;
}
