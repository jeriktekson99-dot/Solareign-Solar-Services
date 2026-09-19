import { useState, FormEvent } from 'react';
import { 
  X, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Users, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  KeyRound,
  RefreshCw
} from 'lucide-react';
import { SOLAREIGN_LOGO_URL } from './SolareignLogo';
import AdminDashboard from './AdminDashboard';
import { useSolareignData } from '../context/DataContext';
import { isSupabaseConfigured, getSupabaseUrl, getSupabaseAnonKey } from '../lib/supabase';

interface AdminLoginPageProps {
  onBackToHome: () => void;
}

export default function AdminLoginPage({ onBackToHome }: AdminLoginPageProps) {
  const { loginAdminWithSupabase, resetAdminPasswordWithSupabase, isAdminAuthenticated, logoutAdmin } = useSolareignData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmailSent, setForgotEmailSent] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // Supabase Configuration drawer if not configured
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const [customUrl, setCustomUrl] = useState(getSupabaseUrl());
  const [customAnonKey, setCustomAnonKey] = useState(getSupabaseAnonKey());
  const [configSaved, setConfigSaved] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your corporate email address.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your access password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginAdminWithSupabase(email, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed. Please verify your Supabase email and password.');
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'An error occurred during Supabase authorization.';
      setErrorMessage(msg);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setPassword('');
    setErrorMessage(null);
  };

  const handleSendResetLink = async (e: FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    const targetEmail = forgotEmail.trim() || email.trim();
    if (!targetEmail) {
      setForgotError('Please enter a valid email address.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await resetAdminPasswordWithSupabase(targetEmail);
      setForgotLoading(false);
      if (res.success) {
        setForgotEmailSent(true);
      } else {
        setForgotError(res.error || 'Failed to send password recovery email through Supabase Auth.');
      }
    } catch (err: unknown) {
      setForgotLoading(false);
      const msg = err instanceof Error ? err.message : 'Failed to send reset link.';
      setForgotError(msg);
    }
  };

  const handleSaveCustomSupabaseConfig = (e: FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('solareign_supabase_url', customUrl.trim());
      localStorage.setItem('solareign_supabase_anon_key', customAnonKey.trim());
      setConfigSaved(true);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 font-sans antialiased selection:bg-[#88D628] selection:text-[#0F5A29]">
      {/* If Authenticated: Show the Solareign Admin Command Center Dashboard */}
      {isAdminAuthenticated ? (
        <AdminDashboard onBackToHome={onBackToHome} onLogout={handleLogout} />
      ) : (
        /* The Split-Screen Admin Portal Login Page matching Reference Image Structural Flow & Section Placement */
        <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 relative">
          {/* ============================================================ */}
          {/* LEFT PANEL: Atmospheric Brand & Welcome Overview Section     */}
          {/* ============================================================ */}
          <div className="relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 min-h-[460px] lg:min-h-screen overflow-hidden bg-[#0A1E13] text-white">
            {/* Background Image Overlay featuring Power Transmission Grid & Atmosphere matching reference flow */}
            <div 
              className="absolute inset-0 bg-cover bg-center z-0 opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=80')`
              }}
              aria-hidden="true"
            />
            {/* Brand Emerald Dark Gradient Overlay */}
            <div 
              className="absolute inset-0 bg-gradient-to-b from-[#0A1E13]/92 via-[#0B2A17]/88 to-[#05140B]/96 z-1" 
              aria-hidden="true" 
            />

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col justify-between h-full space-y-12">
              {/* TOP PLACEMENT: Company Brand Name */}
              <div>
                <div>
                  <span className="font-extrabold tracking-widest text-sm text-white uppercase select-none">
                    SOLAREIGN SOLAR POWER SERVICES
                  </span>
                </div>
              </div>

              {/* CENTER PLACEMENT: Accent Bar + Massive Headline + Subparagraph */}
              <div className="my-auto py-6 sm:py-10">
                {/* Horizontal Accent Bar in Solareign's signature vibrant green */}
                <div 
                  className="w-14 h-1.5 bg-[#88D628] rounded-full mb-8 shadow-sm"
                  aria-hidden="true"
                />

                {/* Primary Welcome Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                  WELCOME BACK. <br />
                  <span className="text-[#88D628]">ADMIN</span> PORTAL
                </h1>

                {/* Descriptive Subparagraph */}
                <p className="mt-6 text-slate-300 text-base sm:text-lg max-w-lg leading-relaxed font-normal">
                  Access the secure command center dashboard for grid load analytics, package models, and client proposals.
                </p>


              </div>

              {/* BOTTOM PLACEMENT: Sub-footer notice */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">
                  AUTHORIZED PERSONNEL ONLY • &copy; 2026 SOLAREIGN SOLAR POWER SERVICES
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT PANEL: Authentication Form Section with Close Button   */}
          {/* ============================================================ */}
          <div className="relative flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white min-h-[520px] lg:min-h-screen">
            {/* TOP RIGHT: Close Button ('X') returning back to the public website */}
            <div className="w-full flex justify-end">
              <button
                id="close-admin-portal-btn"
                type="button"
                onClick={onBackToHome}
                aria-label="Close portal and return to home"
                title="Return to Public Website"
                className="w-10 h-10 rounded-full border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#88D628]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CENTER PLACEMENT: Form Container */}
            <div className="w-full max-w-md mx-auto my-auto py-6 sm:py-10">
              {/* Form Header */}
              <div className="mb-8">
                <h2 className="text-3xl sm:text-4xl font-black text-[#0F5A29] tracking-tight font-sans">
                  SIGN IN
                </h2>
                <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mt-2 flex items-center gap-2">
                  <span>SUPABASE AUTHORIZATION GATEWAY</span>
                  {isSupabaseConfigured() ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      CONNECTED
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowConfigDrawer(!showConfigDrawer)}
                      className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold hover:bg-amber-100 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      SETUP SUPABASE
                    </button>
                  )}
                </p>
              </div>

              {/* Supabase Connection Setup Box (if triggered or not configured) */}
              {showConfigDrawer && (
                <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs animate-in fade-in">
                  <div className="font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center justify-between">
                    <span>Supabase Project Credentials</span>
                    <button 
                      type="button" 
                      onClick={() => setShowConfigDrawer(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <form onSubmit={handleSaveCustomSupabaseConfig} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        Supabase Project URL
                      </label>
                      <input
                        type="url"
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        placeholder="https://xyzcompany.supabase.co"
                        required
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        Supabase Anon Key
                      </label>
                      <input
                        type="text"
                        value={customAnonKey}
                        onChange={(e) => setCustomAnonKey(e.target.value)}
                        placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                        required
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-[#0F5A29] hover:bg-[#0c4720] text-white font-bold rounded-lg uppercase tracking-wider text-[11px]"
                    >
                      {configSaved ? 'Saved! Reloading...' : 'Save & Connect Supabase'}
                    </button>
                  </form>
                </div>
              )}

              {/* Error Notification */}
              {errorMessage && (
                <div 
                  role="alert"
                  className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2.5 animate-in fade-in"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Sign In Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Field 1: Corporate Email Address */}
                <div>
                  <label 
                    htmlFor="corporate-email-input"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
                  >
                    CORPORATE EMAIL ADDRESS
                  </label>
                  <input
                    id="corporate-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    autoComplete="username"
                    required
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-sm font-normal focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#88D628] focus:border-[#0F5A29] transition-all duration-200"
                  />
                </div>

                {/* Field 2: Password */}
                <div>
                  <label 
                    htmlFor="password-input"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
                  >
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      id="password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      required
                      className="w-full px-4 py-3.5 pr-11 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-sm font-normal focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#88D628] focus:border-[#0F5A29] transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Forgot Password Link - positioned right under password field */}
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(true)}
                      className="text-xs font-bold uppercase tracking-wider text-[#0F5A29] hover:text-[#0b421e] hover:underline cursor-pointer transition-colors"
                    >
                      FORGOT PASSWORD?
                    </button>
                  </div>
                </div>

                {/* Primary Action Button: SIGN IN */}
                <button
                  id="admin-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-xl bg-[#0F5A29] hover:bg-[#0c4720] text-white font-extrabold text-sm tracking-wider uppercase transition-all duration-200 shadow-md shadow-[#0F5A29]/20 hover:shadow-lg hover:shadow-[#0F5A29]/30 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#88D628]" />
                      <span>AUTHENTICATING GATEWAY...</span>
                    </>
                  ) : (
                    <span>SIGN IN</span>
                  )}
                </button>
              </form>
            </div>


          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-left relative">
            <button
              type="button"
              onClick={() => {
                setForgotPasswordOpen(false);
                setForgotEmailSent(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0F5A29] flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-slate-900">Reset Access Credentials</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Enter your corporate Solareign email address. Our systems engineering dispatcher will send an authorization token for password re-verification.
            </p>

            {forgotError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotEmailSent ? (
              <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-sm text-[#0F5A29]">
                  <CheckCircle2 className="w-4 h-4 text-[#88D628]" />
                  Supabase Recovery Email Dispatched
                </div>
                <p>
                  A password reset link has been dispatched to your email address from Supabase Authorization. Please check your inbox and spam folder.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotPasswordOpen(false);
                      setForgotEmailSent(false);
                      setForgotError(null);
                    }}
                    className="w-full py-2.5 rounded-lg bg-[#0F5A29] text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendResetLink} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    value={forgotEmail || email}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    placeholder="admin@solareign.ph"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#88D628] focus:border-[#0F5A29]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0F5A29] hover:bg-[#0c4720] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {forgotLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#88D628]" />
                      <span>Sending Supabase Recovery Email...</span>
                    </>
                  ) : (
                    <span>Send Recovery Link</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
