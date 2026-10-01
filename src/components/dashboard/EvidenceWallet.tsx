import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EvidenceCategory, EvidenceItem } from '../../types';
import { VerificationBadge } from '../common/VerificationBadge';
import { EmptyState } from '../common/EmptyState';
import {
  Wallet,
  Search,
  Filter,
  FolderGit2,
  GitBranch,
  Award,
  Trophy,
  GraduationCap,
  Briefcase,
  Layers,
  ShieldCheck,
  Hash,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export const EvidenceWallet: React.FC = () => {
  const { evidence, setActiveTab } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: Array<'All' | EvidenceCategory> = [
    'All',
    'Projects',
    'GitHub',
    'Assessments',
    'Hackathons',
    'Certificates',
    'Internships',
    'Open Source',
    'Awards',
  ];

  const filteredEvidence = evidence.filter(item => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesQuery =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.relatedSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.verificationId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const getCategoryIcon = (cat: EvidenceCategory) => {
    switch (cat) {
      case 'Projects': return FolderGit2;
      case 'GitHub': return GitBranch;
      case 'Assessments': return GraduationCap;
      case 'Hackathons': return Trophy;
      case 'Certificates': return Award;
      case 'Internships': return Briefcase;
      default: return ShieldCheck;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-1">
            <Wallet className="w-3.5 h-3.5" />
            <span>Centralized Proof Repository</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Evidence Wallet ({evidence.length} Proof Tokens)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Single evidence items can substantiate multiple skills simultaneously (Multi-Skill Attribution USP).
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skill, token ID, title..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {cat}
            {cat !== 'All' && (
              <span className="ml-1.5 opacity-70 text-[10px]">
                ({evidence.filter(e => e.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Evidence Items Grid */}
      {filteredEvidence.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title={searchQuery ? 'No Matching Evidence Found' : 'Evidence Wallet Is Empty'}
          description="Your Evidence Wallet populates automatically when you verify projects, connect GitHub, pass skill assessments, or add credentials."
          actionText="Add a Project"
          onAction={() => setActiveTab('projects')}
          secondaryActionText="Take Assessment"
          onSecondaryAction={() => setActiveTab('skills')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvidence.map(item => {
            const Icon = getCategoryIcon(item.category);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {item.category} • {item.date}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 leading-tight">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    <VerificationBadge status={item.status} size="sm" />
                  </div>

                  {/* Multi-Skill Attribution USP */}
                  <div className="my-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Skills Proven by this Evidence ({item.relatedSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.relatedSkills.map(skill => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-white text-emerald-700 border border-emerald-200 shadow-2xs"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>{skill}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Audit Hash & Verification ID Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <div className="flex items-center gap-1 text-indigo-700 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>ID: {item.verificationId}</span>
                  </div>

                  {item.auditHash && (
                    <div className="text-slate-400 truncate max-w-[140px]" title={`Audit Hash: ${item.auditHash}`}>
                      {item.auditHash}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
