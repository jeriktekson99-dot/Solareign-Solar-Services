import React, { useState, useEffect } from 'react';
import {
  Lock,
  Share2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Video,
  Facebook,
  Instagram,
  Loader2
} from 'lucide-react';

export interface CustomIntegratedUrl {
  id: string;
  name: string;
  url: string;
  category?: 'Social / Video' | 'Website / Portal' | 'API / Webhook' | 'Customer Support' | 'Other';
  dateAdded?: string;
}

export interface SocialLinksConfig {
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  websiteUrl?: string;
  youtubeUrl?: string;
  webhookUrl?: string;
  customUrls?: CustomIntegratedUrl[];
}

export interface OperationalSettingsConfig {
  branchName: string;
  contactEmail: string;
  hotline: string;
  meralcoRate: string;
  netMeteringExportRate: string;
  defaultInverterBrand: string;
  defaultBatteryWarrantyYears: string;
  notifyOnNewInquiry: boolean;
  autoAssignEngineer: boolean;
  webhookEndpointUrl?: string;
  webhookSecretKey?: string;
}

export interface PasswordSaveResult {
  success: boolean;
  message?: string;
}

interface SystemSettingsPageProps {
  initialSocialLinks?: SocialLinksConfig;
  initialOperations?: OperationalSettingsConfig;
  onSavePassword?: (oldPass: string, newPass: string) => Promise<PasswordSaveResult | boolean> | PasswordSaveResult | boolean;
  onSaveSocialLinks?: (links: SocialLinksConfig) => void;
  onSaveOperations?: (ops: OperationalSettingsConfig) => void;
}

export default function SystemSettingsPage({
  initialSocialLinks = {
    facebookUrl: 'https://web.facebook.com/profile.php?id=61566141530365',
    instagramUrl: 'https://web.facebook.com',
    tiktokUrl: 'https://tiktok.com/@powershift',
    websiteUrl: 'https://solareign.ph',
    webhookUrl: 'https://api.solareign.ph/webhooks/v1/inbound-leads',
    customUrls: []
  },
  initialOperations = {
    branchName: 'Solareign Solar Power Services - Cavite Operations',
    contactEmail: 'engineering@solareign.ph',
    hotline: '+63 917 843 4018',
    meralcoRate: '12.50',
    netMeteringExportRate: '5.20',
    defaultInverterBrand: 'Deye Hybrid / Growatt SPF Series',
    defaultBatteryWarrantyYears: '10',
    notifyOnNewInquiry: true,
    autoAssignEngineer: true,
    webhookEndpointUrl: 'https://api.solareign.ph/webhooks/v1/inbound-leads',
    webhookSecretKey: 'whsec_slr_live_8849206b9941a'
  },
  onSavePassword,
  onSaveSocialLinks,
  onSaveOperations: _onSaveOperations
}: SystemSettingsPageProps) {
  // Password Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypeNewPassword, setRetypeNewPassword] = useState('');

  // Password Visibility Toggles
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  // Password validation & error state
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Social Links Form State
  const [socialLinks, setSocialLinks] = useState<SocialLinksConfig>(initialSocialLinks);
  const [socialSuccess, setSocialSuccess] = useState(false);

  // Synchronize state when external initialSocialLinks updates
  useEffect(() => {
    if (initialSocialLinks) {
      setSocialLinks(initialSocialLinks);
    }
  }, [initialSocialLinks]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Handle Save Password
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!oldPassword.trim()) {
      setPasswordError('Please enter your current administrative password.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== retypeNewPassword) {
      setPasswordError('New passwords do not match. Please re-type accurately.');
      return;
    }

    if (newPassword === oldPassword) {
      setPasswordError('New password cannot be the same as your current password.');
      return;
    }

    setIsSavingPassword(true);

    try {
      if (onSavePassword) {
        const res = await onSavePassword(oldPassword, newPassword);
        if (typeof res === 'object' && res !== null && !res.success) {
          setPasswordError(res.message || 'Incorrect current administrative password.');
          setIsSavingPassword(false);
          return;
        } else if (res === false) {
          setPasswordError('Current administrative password does not match.');
          setIsSavingPassword(false);
          return;
        }
      }

      setPasswordSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setRetypeNewPassword('');
      showToast('Admin password updated successfully. New credentials active for future logins.');
      setTimeout(() => setPasswordSuccess(false), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update administrative password.';
      setPasswordError(msg);
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Handle Save All Social & Standard Links
  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveSocialLinks) {
      onSaveSocialLinks(socialLinks);
    }
    setSocialSuccess(true);
    showToast('All integration URLs saved and reflected live across the system.');
    setTimeout(() => setSocialSuccess(false), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-[#88D628]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F5A29] tracking-tight uppercase">
            SYSTEM CONFIGURATION
          </h1>
          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mt-1">
            MANAGE ADMINISTRATIVE PASSWORDS, CONNECTED URLS, AND SERVICE INTEGRATIONS.
          </p>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2-COLUMN PRIMARY CARDS                                                */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* =================================================================== */}
        {/* CARD 1 (LEFT): CHANGE PASSWORD                                      */}
        {/* =================================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between h-full">
          <div>
            <div className="mb-6">
                <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#0F5A29]" />
                  <span>CHANGE PASSWORD</span>
                </h2>
                <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mt-1">
                  UPDATE CORPORATE CREDENTIALS AND SECURITY ACCESS.
                </p>
              </div>

            {passwordError && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-[#0F5A29] shrink-0" />
                <span>Administrative password updated and security credentials refreshed!</span>
              </div>
            )}

            <form id="change-password-form" onSubmit={handleSavePassword} className="space-y-4">
              {/* Field 1: CURRENT / OLD PASSWORD */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                  CURRENT PASSWORD <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter your current password"
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#0F5A29] rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F5A29] transition-all font-medium pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    aria-label={showOldPassword ? 'Hide password' : 'Show password'}
                  >
                    {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Field 2: TYPE NEW PASSWORD */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                  NEW PASSWORD <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    minLength={6}
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#0F5A29] rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F5A29] transition-all font-medium pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {newPassword && (
                  <div className="mt-1.5 flex items-center gap-2 text-[10px] font-semibold text-slate-500">
                    <span
                      className={`h-1.5 flex-1 rounded-full ${
                        newPassword.length >= 8
                          ? 'bg-emerald-500'
                          : newPassword.length >= 6
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    />
                    <span>
                      {newPassword.length >= 8
                        ? 'Strong Security'
                        : newPassword.length >= 6
                        ? 'Acceptable'
                        : 'Too short (min 6 chars)'}
                    </span>
                  </div>
                )}
              </div>

              {/* Field 3: RETYPE NEW PASSWORD */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                  CONFIRM NEW PASSWORD <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showRetypePassword ? 'text' : 'password'}
                    value={retypeNewPassword}
                    onChange={(e) => setRetypeNewPassword(e.target.value)}
                    placeholder="Re-type new password"
                    required
                    className={`w-full px-4 py-3 bg-white border rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all font-medium pr-10 ${
                      retypeNewPassword && retypeNewPassword !== newPassword
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-slate-200 hover:border-slate-300 focus:border-[#0F5A29] focus:ring-1 focus:ring-[#0F5A29]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRetypePassword(!showRetypePassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    aria-label={showRetypePassword ? 'Hide password' : 'Show password'}
                  >
                    {showRetypePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {retypeNewPassword && retypeNewPassword === newPassword && (
                  <p className="mt-1 text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Passwords match</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="w-auto px-6 py-3 bg-[#0F5A29] hover:bg-[#0b401d] text-[#88D628] rounded-xl text-xs font-black tracking-wide uppercase transition-colors cursor-pointer shadow-xs inline-flex items-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isSavingPassword ? 'UPDATING...' : 'SAVE PASSWORD'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* =================================================================== */}
        {/* CARD 2 (RIGHT): INTEGRATION URLS & CHANNELS                        */}
        {/* =================================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between h-full">
          <div>
            {/* Header & Subtitle */}
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#0F5A29]" />
                <span>INTEGRATED URLS & CHANNELS</span>
              </h2>
              <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mt-1">
                MANAGE EXTERNAL LINKS, SOCIAL PLATFORMS, AND CUSTOM SERVICE ENDPOINTS.
              </p>
            </div>

            {socialSuccess && (
              <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-[#0F5A29] shrink-0" />
                <span>Integration channels updated and reflected across the system!</span>
              </div>
            )}

            <form id="social-integration-form" onSubmit={handleSaveSocial} className="space-y-4">
              {/* Field 1: FACEBOOK URL */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1.5">
                  <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
                  <span>FACEBOOK URL</span>
                </label>
                <input
                  type="url"
                  value={socialLinks.facebookUrl}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, facebookUrl: e.target.value })
                  }
                  placeholder="https://web.facebook.com/profile.php?id=..."
                  className="w-full px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#0F5A29] rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F5A29] transition-all font-medium"
                />
              </div>

              {/* Field 2: INSTAGRAM URL */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1.5">
                  <Instagram className="w-3.5 h-3.5 text-[#E4405F]" />
                  <span>INSTAGRAM URL</span>
                </label>
                <input
                  type="url"
                  value={socialLinks.instagramUrl}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, instagramUrl: e.target.value })
                  }
                  placeholder="https://instagram.com/solareignpower"
                  className="w-full px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#0F5A29] rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F5A29] transition-all font-medium"
                />
              </div>

              {/* Field 3: TIKTOK URL */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1.5">
                  <Video className="w-3.5 h-3.5 text-slate-800" />
                  <span>TIKTOK URL</span>
                </label>
                <input
                  type="url"
                  value={socialLinks.tiktokUrl}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, tiktokUrl: e.target.value })
                  }
                  placeholder="https://tiktok.com/@powershift"
                  className="w-full px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#0F5A29] rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F5A29] transition-all font-medium"
                />
              </div>

              {/* Save All URLs Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-auto px-6 py-3 bg-[#0F5A29] hover:bg-[#0b401d] text-[#88D628] rounded-xl text-xs font-black tracking-wide uppercase transition-colors cursor-pointer shadow-xs inline-flex items-center gap-2"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>SAVE INTEGRATED URLS</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
