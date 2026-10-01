import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Shield,
  Share2,
  Github,
  Bell,
  Lock,
  Upload,
  Camera,
  CheckCircle2,
  Copy,
  ExternalLink,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user, updateProfile, togglePublicPassport, github, connectGitHub, disconnectGitHub } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'privacy' | 'connected'>('profile');

  // Edit fields
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [college, setCollege] = useState(user?.college || '');
  const [branch, setBranch] = useState(user?.branch || '');
  const [gradYear, setGradYear] = useState(user?.gradYear || '2026');
  const [linkedIn, setLinkedIn] = useState(user?.linkedIn || '');
  const [portfolio, setPortfolio] = useState(user?.portfolio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // GitHub input
  const [ghInput, setGhInput] = useState('');

  // Password fields
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');

  const [copySuccess, setCopySuccess] = useState(false);

  const passportUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/passport/${user?.username || 'student'}`
    : 'https://skillpass.app/passport';

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        updateProfile({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      bio,
      college,
      branch,
      gradYear,
      linkedIn,
      portfolio,
      avatar,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(passportUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-900">
          Account & Passport Settings
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your verified student identity, credentials, privacy visibility, and connected proof providers.
        </p>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 mt-4 border-b border-slate-100 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'privacy' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Public Passport Privacy
          </button>
          <button
            onClick={() => setActiveTab('connected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'connected' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Connected Accounts
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'security' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Security & Password
          </button>
        </div>
      </div>

      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          {/* Avatar edit */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="relative group">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-xs"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center">
                  {name ? name.slice(0, 2).toUpperCase() : 'SP'}
                </div>
              )}
              <label
                htmlFor="settings-photo-upload"
                className="absolute -bottom-1 -right-1 p-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full cursor-pointer shadow-md"
              >
                <Camera className="w-3 h-3" />
              </label>
              <input
                id="settings-photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Student Profile Photo</h4>
              <p className="text-[11px] text-slate-500">Upload clean photo. JPG or PNG under 2MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                College / Institution
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Short Bio / Focus
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={linkedIn}
                onChange={(e) => setLinkedIn(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Portfolio Website
              </label>
              <input
                type="url"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {activeTab === 'privacy' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Public Digital Passport Visibility
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                When enabled, your verified passport is accessible to recruiters and institutions via your unique URL.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={user?.isPublicPassportEnabled ?? true}
                onChange={(e) => togglePublicPassport(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Your Public Passport URL
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={passportUrl}
                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-600"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                {copySuccess ? 'Copied!' : 'Copy URL'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'connected' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Connected Proof Providers
          </h3>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Github className="w-6 h-6 text-slate-900" />
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  GitHub Integration
                </span>
                <span className="text-[11px] text-slate-500">
                  {github.isConnected ? `Connected as @${github.username}` : 'Not connected'}
                </span>
              </div>
            </div>

            <div>
              {github.isConnected ? (
                <button
                  onClick={disconnectGitHub}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold border border-rose-200 cursor-pointer"
                >
                  Disconnect
                </button>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Username"
                    value={ghInput}
                    onChange={(e) => setGhInput(e.target.value)}
                    className="px-2 py-1 bg-white border rounded text-xs"
                  />
                  <button
                    onClick={() => ghInput && connectGitHub(ghInput)}
                    className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-bold cursor-pointer"
                  >
                    Connect
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 max-w-md">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Change Password
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <button
              onClick={() => {
                alert('Password updated successfully.');
                setCurrentPw('');
                setNewPw('');
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Update Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
