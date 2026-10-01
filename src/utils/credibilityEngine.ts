import {
  ProjectItem,
  GitHubProfileData,
  EvidenceItem,
  CertificateItem,
  AchievementItem,
  CredibilityScoreBreakdown,
  CareerReadinessBreakdown,
  SkillItem,
} from '../types';

export function calculateCredibilityScore(params: {
  projects: ProjectItem[];
  github: GitHubProfileData;
  evidence: EvidenceItem[];
  certificates: CertificateItem[];
  achievements: AchievementItem[];
}): CredibilityScoreBreakdown {
  const { projects, github, evidence, certificates, achievements } = params;

  // 1. Verified Projects (Max 35 points)
  const verifiedProjects = projects.filter(p => p.isVerified);
  let verifiedProjectsPoints = 0;
  if (verifiedProjects.length > 0) {
    // 1st project: 15 pts, 2nd: 12 pts, 3rd: 8 pts -> 35 pts
    verifiedProjectsPoints = Math.min(
      35,
      verifiedProjects.length === 1 ? 15 : verifiedProjects.length === 2 ? 27 : 35
    );
  }

  // 2. GitHub Evidence (Max 25 points)
  let githubEvidencePoints = 0;
  if (github.isConnected) {
    const baseConn = 6;
    const contrib = github.totalContributions || 0;
    const repoBonus = Math.min(6, (github.publicRepos || 0) * 1.5);
    const contribBonus = Math.min(13, Math.round((contrib / 150) * 13));
    githubEvidencePoints = Math.min(25, baseConn + repoBonus + contribBonus);
  }

  // 3. Assessments (Max 15 points)
  const assessmentEvidence = evidence.filter(e => e.category === 'Assessments' && e.status === 'VERIFIED');
  let assessmentPoints = 0;
  if (assessmentEvidence.length > 0) {
    // 8 pts for first, 7 pts for second -> 15 pts
    assessmentPoints = Math.min(15, assessmentEvidence.length * 7.5);
  }

  // 4. Hackathons & Achievements (Max 15 points)
  const verifiedAchievements = achievements.filter(a => a.status === 'VERIFIED');
  let achievementsPoints = 0;
  if (verifiedAchievements.length > 0) {
    achievementsPoints = Math.min(15, verifiedAchievements.length * 7.5);
  }

  // 5. Certificates (Max 10 points - strictly capped against certificate stuffing)
  const verifiedCerts = certificates.filter(c => c.status === 'VERIFIED');
  let certificatesPoints = 0;
  if (verifiedCerts.length > 0) {
    // 5 pts each, strictly max 10
    certificatesPoints = Math.min(10, verifiedCerts.length * 5);
  }

  const totalScore = Math.min(
    100,
    Math.round(
      verifiedProjectsPoints +
      githubEvidencePoints +
      assessmentPoints +
      achievementsPoints +
      certificatesPoints
    )
  );

  let label: CredibilityScoreBreakdown['label'] = 'Unverified';
  if (totalScore >= 80) {
    label = 'Strong Evidence';
  } else if (totalScore >= 60) {
    label = 'Moderate Evidence';
  } else if (totalScore > 0) {
    label = 'Developing Evidence';
  }

  const formulaExplanation = `Verified Projects (${verifiedProjectsPoints}/35) + GitHub (${githubEvidencePoints}/25) + Assessments (${assessmentPoints}/15) + Achievements (${achievementsPoints}/15) + Certificates (${certificatesPoints}/10) = ${totalScore}/100`;

  return {
    totalScore,
    label,
    verifiedProjectsPoints: Math.round(verifiedProjectsPoints),
    githubEvidencePoints: Math.round(githubEvidencePoints),
    assessmentPoints: Math.round(assessmentPoints),
    achievementsPoints: Math.round(achievementsPoints),
    certificatesPoints: Math.round(certificatesPoints),
    formulaExplanation,
  };
}

export function calculateCareerReadiness(params: {
  skills: SkillItem[];
  projects: ProjectItem[];
  github: GitHubProfileData;
  evidence: EvidenceItem[];
  certificates: CertificateItem[];
  achievements: AchievementItem[];
}): CareerReadinessBreakdown {
  const { skills, projects, github, evidence, certificates, achievements } = params;

  const verifiedSkillsCount = skills.filter(s => s.status === 'VERIFIED').length;
  const technicalProof = Math.min(100, verifiedSkillsCount * 22);

  const verifiedProjectsCount = projects.filter(p => p.isVerified).length;
  const projectProof = Math.min(100, verifiedProjectsCount * 33);

  const githubEvidence = github.isConnected
    ? Math.min(100, Math.round(40 + (github.totalContributions / 200) * 60))
    : 0;

  const verifiedAchievementsCount = achievements.filter(a => a.status === 'VERIFIED').length;
  const industryExposure = Math.min(100, (verifiedAchievementsCount * 30) + (certificates.length * 15));

  const assessmentCount = evidence.filter(e => e.category === 'Assessments' && e.status === 'VERIFIED').length;
  const assessmentsScore = Math.min(100, assessmentCount * 50);

  const professionalProfile = Math.min(
    100,
    (github.isConnected ? 35 : 0) +
    (skills.length > 0 ? 30 : 0) +
    (projects.length > 0 ? 35 : 0)
  );

  const overall = Math.round(
    (technicalProof * 0.25) +
    (projectProof * 0.25) +
    (githubEvidence * 0.2) +
    (industryExposure * 0.1) +
    (assessmentsScore * 0.1) +
    (professionalProfile * 0.1)
  );

  return {
    overall: Math.min(100, overall),
    technicalProof: Math.min(100, technicalProof),
    projectProof: Math.min(100, projectProof),
    githubEvidence: Math.min(100, githubEvidence),
    industryExposure: Math.min(100, industryExposure),
    assessmentsScore: Math.min(100, assessmentsScore),
    professionalProfile: Math.min(100, professionalProfile),
  };
}

export function generateAuditHash(seed: string): string {
  let hash = 0;
  const str = `${seed}-${Date.now()}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hex}e94c8b21`;
}
