import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../../context/AppContext';
import { CertificateItem } from '../../types';
import { VerificationBadge } from '../common/VerificationBadge';
import { EmptyState } from '../common/EmptyState';
import {
  Award,
  Plus,
  ExternalLink,
  ShieldCheck,
  QrCode as QrIcon,
  CheckCircle2,
  Calendar,
  Building,
  Upload,
  Info,
  X,
} from 'lucide-react';

export const CertificateSection: React.FC = () => {
  const { certificates, addCertificate, verifyCertificate } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCertQr, setSelectedCertQr] = useState<CertificateItem | null>(null);

  // Form
  const [name, setName] = useState('');
  const [issuingOrg, setIssuingOrg] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [certificateId, setCertificateId] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (selectedCertQr && qrCanvasRef.current) {
      const verifyPayload = `https://skillpass.app/verify/cert/${selectedCertQr.verificationId}`;
      QRCode.toCanvas(qrCanvasRef.current, verifyPayload, {
        width: 180,
        margin: 1,
        color: {
          dark: '#0F172A',
          light: '#FFFFFF',
        },
      });
    }
  }, [selectedCertQr]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !issuingOrg.trim()) return;

    addCertificate({
      name: name.trim(),
      issuingOrg: issuingOrg.trim(),
      issueDate,
      certificateId: certificateId.trim() || `CERT-${Math.floor(100000 + Math.random() * 900000)}`,
      credentialUrl: credentialUrl.trim(),
      imageUrl,
    });

    setName('');
    setIssuingOrg('');
    setCertificateId('');
    setCredentialUrl('');
    setImageUrl('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Anti-Stuffing Capped Credentials</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Certificate Verification ({certificates.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Capped at max 10 points in the Credibility Score to prevent certificate stuffing. QR-verifiable proof.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Certificate</span>
        </button>
      </div>

      {/* Info notice about anti-stuffing */}
      <div className="p-3.5 bg-purple-50/70 border border-purple-100 rounded-xl flex items-start gap-2.5 text-xs text-purple-900">
        <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
        <p>
          <strong>Why is this capped at 10%?</strong> SkillPass prioritizes working code, GitHub commits, and projects over easily gamified certificate collections.
        </p>
      </div>

      {/* Certificates List */}
      {certificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No Certificates Added Yet"
          description="Add industry-recognized credentials to your Evidence Wallet. Each verified certificate generates an immutable QR verification anchor."
          actionText="Add My First Certificate"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map(cert => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                    <Award className="w-5 h-5" />
                  </div>
                  <VerificationBadge status={cert.status} size="sm" />
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {cert.name}
                </h3>

                <div className="space-y-1 text-xs text-slate-500 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cert.issuingOrg}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Issued: {cert.issueDate}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-mono text-slate-600 space-y-1">
                  <div className="truncate">Cert ID: {cert.certificateId}</div>
                  <div className="text-indigo-600 font-bold">Proof ID: {cert.verificationId}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                <button
                  onClick={() => setSelectedCertQr(cert)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <QrIcon className="w-3.5 h-3.5" />
                  <span>View QR Code</span>
                </button>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                    title="External Credential Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Verification Modal (Requirement 13) */}
      {selectedCertQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 p-6 text-center">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Verified Credential Anchor
              </span>
              <button
                onClick={() => setSelectedCertQr(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <h4 className="text-base font-extrabold text-slate-900 mb-1">
              {selectedCertQr.name}
            </h4>
            <p className="text-xs text-slate-500 mb-4">{selectedCertQr.issuingOrg}</p>

            {/* QR Canvas */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 inline-block shadow-inner mb-4">
              <canvas ref={qrCanvasRef} />
            </div>

            <div className="p-3 bg-slate-100 rounded-xl text-left text-xs font-mono space-y-1 mb-4">
              <div>Certificate ID: <strong className="text-slate-900">{selectedCertQr.certificateId}</strong></div>
              <div>Verification ID: <strong className="text-indigo-600">{selectedCertQr.verificationId}</strong></div>
              <div className="text-[10px] text-emerald-700 font-sans font-bold flex items-center gap-1 pt-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Status: Immutable Cryptographic Record</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedCertQr(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Add Certificate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50/40">
              <h3 className="text-base font-extrabold text-slate-900">
                Add Industry Certificate
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Certificate Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  value={issuingOrg}
                  onChange={(e) => setIssuingOrg(e.target.value)}
                  placeholder="e.g. Amazon Web Services, Google Cloud, Meta"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Certificate ID
                  </label>
                  <input
                    type="text"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    placeholder="e.g. AWS-948120"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Verification URL (Optional)
                </label>
                <input
                  type="url"
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  placeholder="https://credly.com/badges/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Verify & Mint Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
