import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Building,
  GraduationCap,
  Calendar,
  Globe,
  Github,
  Linkedin,
  CheckCircle2,
  Camera,
  Upload,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface AuthModalsProps {
  loginOpen: boolean;
  registerOpen: boolean;
  onCloseLogin: () => void;
  onCloseRegister: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  loginOpen,
  registerOpen,
  onCloseLogin,
  onCloseRegister,
  onOpenLogin,
  onOpenRegister,
}) => {
  const { login, register, sendPasswordReset, verifyCollegeEmail } = useApp();

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot password sub-flow
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCollege, setRegCollege] = useState('');
  const [regDegree, setRegDegree] = useState('B.Tech');
  const [regBranch, setRegBranch] = useState('Computer Science');
  const [regGradYear, setRegGradYear] = useState('2026');
  const [regLinkedIn, setRegLinkedIn] = useState('');
  const [regGitHub, setRegGitHub] = useState('');
  const [regPortfolio, setRegPortfolio] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAvatar, setRegAvatar] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Image Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setRegAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier || !loginPassword) {
      alert('Please enter your email/username and password.');
      return;
    }
    const ok = login(loginIdentifier, loginPassword);
    if (ok) {
      onCloseLogin();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName || !regEmail || !regPassword) {
      alert('Please fill in all mandatory fields.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const ok = register(
      {
        name: regFullName,
        username: regUsername || regFullName.toLowerCase().replace(/\s+/g, '_'),
        email: regEmail,
        college: regCollege || 'Indian Institute of Technology',
        degree: regDegree,
        branch: regBranch,
        gradYear: regGradYear,
        avatar: regAvatar,
        linkedIn: regLinkedIn,
        github: regGitHub,
        portfolio: regPortfolio,
      },
      regPassword
    );

    if (ok) {
      onCloseRegister();
    }
  };

  return (
    <>
      {/* 1. Student Login Modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/40">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  SkillPass Authentication
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Student Sign In
                </h3>
              </div>
              <button
                onClick={onCloseLogin}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Username or College Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="student@iitb.ac.in or username"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(true)}
                    className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 cursor-pointer"
              >
                Sign In to SkillPass
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                New to SkillPass?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onCloseLogin();
                    onOpenRegister();
                  }}
                  className="font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  Create My Skill Passport
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Forgot Password Sub-Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-slate-900">Reset Credentials</h4>
              <button
                onClick={() => {
                  setForgotPasswordOpen(false);
                  setResetSent(false);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!resetSent ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Enter your registered institutional or personal email to receive a recovery token.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <button
                  onClick={() => {
                    if (forgotEmail) {
                      sendPasswordReset(forgotEmail);
                      setResetSent(true);
                    }
                  }}
                  className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Send 6-Digit Reset Code
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Recovery token simulated: <strong>849201</strong></span>
                </div>
                <input
                  type="text"
                  placeholder="Enter 6-digit code (e.g. 849201)"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className="w-full px-3.5 py-2 border rounded-xl text-xs"
                />
                <input
                  type="password"
                  placeholder="New Secure Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 border rounded-xl text-xs"
                />
                <button
                  onClick={() => {
                    alert('Password successfully reset! You can now sign in.');
                    setForgotPasswordOpen(false);
                    setResetSent(false);
                  }}
                  className="w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Confirm New Password
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Student Registration Modal (Full Field Set) */}
      {registerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 transform transition-all">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/40">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  New Student Identity
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Create Your Skill Passport
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Institutional verification turns your claims into verified proof.
                </p>
              </div>
              <button
                onClick={onCloseRegister}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Profile Photo Upload with real preview & fallback */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative group">
                  {regAvatar ? (
                    <img
                      src={regAvatar}
                      alt="Uploaded preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500 shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl border-2 border-dashed border-indigo-300">
                      {regFullName ? regFullName.slice(0, 2).toUpperCase() : <Camera className="w-7 h-7 text-indigo-400" />}
                    </div>
                  )}
                  <label
                    htmlFor="photo-upload-input"
                    className="absolute -bottom-1 -right-1 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full cursor-pointer shadow-md transition-transform hover:scale-110"
                    title="Upload student profile photo"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </label>
                  <input
                    id="photo-upload-input"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Profile Photo (Optional)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    If not uploaded, a clean initials badge will be automatically generated. No fake avatars!
                  </p>
                  <label
                    htmlFor="photo-upload-input"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose Image (Max 2MB)</span>
                  </label>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="e.g. Maya Krishnan"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="mayakrish"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Institutional Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    College / University *
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={regCollege}
                      onChange={(e) => setRegCollege(e.target.value)}
                      placeholder="e.g. IIT Bombay, BITS, NIT"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    College / Institutional Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="student@college.edu or .ac.in"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Degree
                  </label>
                  <select
                    value={regDegree}
                    onChange={(e) => setRegDegree(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="B.Tech">B.Tech / B.E.</option>
                    <option value="M.Tech">M.Tech / M.E.</option>
                    <option value="B.Sc">B.Sc / B.C.A.</option>
                    <option value="M.Sc">M.Sc / M.C.A.</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Branch / Major
                  </label>
                  <input
                    type="text"
                    value={regBranch}
                    onChange={(e) => setRegBranch(e.target.value)}
                    placeholder="Computer Science"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Graduation Year
                  </label>
                  <select
                    value={regGradYear}
                    onChange={(e) => setRegGradYear(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="2027">2027</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>
              </div>

              {/* Social / Proof Links */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Verification Footprint Links
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="relative">
                    <Github className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={regGitHub}
                      onChange={(e) => setRegGitHub(e.target.value)}
                      placeholder="GitHub username"
                      className="w-full pl-8 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="relative">
                    <Linkedin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={regLinkedIn}
                      onChange={(e) => setRegLinkedIn(e.target.value)}
                      placeholder="LinkedIn URL"
                      className="w-full pl-8 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="relative">
                    <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={regPortfolio}
                      onChange={(e) => setRegPortfolio(e.target.value)}
                      placeholder="Portfolio URL"
                      className="w-full pl-8 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password *
                  </label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 cursor-pointer"
              >
                Create Verified Passport
              </button>

              <p className="text-center text-xs text-slate-500">
                Already have a passport?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onCloseRegister();
                    onOpenLogin();
                  }}
                  className="font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
