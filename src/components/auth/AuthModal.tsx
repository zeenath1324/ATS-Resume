import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useResume } from '../../context/ResumeContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isFresher, setIsFresher] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { login, signup, demoLogin } = useAuth();
  const { toggleFresherMode, loadDemoData } = useResume();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'login') {
        await login(email, password);
        onClose();
      } else if (mode === 'signup') {
        await signup(name, email, password, isFresher);
        toggleFresherMode(isFresher);
        onClose();
      } else if (mode === 'forgot') {
        setMessage(`Password reset link sent to ${email}. Check your inbox!`);
      }
    } catch (err: any) {
      setMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = (fresher: boolean) => {
    demoLogin(fresher);
    toggleFresherMode(fresher);
    loadDemoData();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="p-8 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mb-3 shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {mode === 'login' && 'Welcome Back to ATS Pro'}
            {mode === 'signup' && 'Create Your Career Account'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {mode === 'login' && 'Sign in to access your resumes, ATS analyses, and interview sessions.'}
            {mode === 'signup' && 'Build ATS-compliant resumes tailored to high-paying roles.'}
            {mode === 'forgot' && 'Enter your email to receive recovery instructions.'}
          </p>
        </div>

        {/* Tab Switcher */}
        {mode !== 'forgot' && (
          <div className="flex border-b border-slate-100 px-8">
            <button
              onClick={() => { setMode('login'); setMessage(null); }}
              className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all ${
                mode === 'login'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setMessage(null); }}
              className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all ${
                mode === 'signup'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-4">
          {message && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setMessage(null); }}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Experience Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsFresher(true)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isFresher
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🎓 College / Fresher
                </button>
                <button
                  type="button"
                  onClick={() => setIsFresher(false)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    !isFresher
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  💼 Experienced
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                {isFresher
                  ? 'Prioritizes academic projects, internships, coursework, and technical skills.'
                  : 'Prioritizes employment history, leadership, and professional achievements.'}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {mode === 'login' && 'Sign In to Dashboard'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'forgot' && 'Send Recovery Email'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="px-8 pb-8 pt-0">
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold tracking-wider">
                Instant Demo Access
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoSignIn(true)}
              className="px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all text-left flex flex-col"
            >
              <span className="text-blue-600">⚡ Demo: Fresher</span>
              <span className="text-[10px] text-slate-400 font-normal">Aarav (CS 2025 Grad)</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoSignIn(false)}
              className="px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all text-left flex flex-col"
            >
              <span className="text-indigo-600">⚡ Demo: Experienced</span>
              <span className="text-[10px] text-slate-400 font-normal">Sarah (Senior Dev)</span>
            </button>
          </div>

          {mode === 'forgot' && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
