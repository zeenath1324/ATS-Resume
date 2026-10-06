import React, { useState } from 'react';
import {
  FileText,
  Briefcase,
  Target,
  Sparkles,
  Award,
  Layers,
  GraduationCap,
  Download,
  Plus,
  ChevronDown,
  LogOut,
  User,
  HeartPulse,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useResume } from '../../context/ResumeContext';

export type NavTab =
  | 'landing'
  | 'dashboard'
  | 'builder'
  | 'jobMatcher'
  | 'analyzer'
  | 'skillGap'
  | 'interview'
  | 'health'
  | 'preview';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAuth,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const {
    activeResume,
    savedResumes,
    switchResume,
    createNewResume,
    isFresherMode,
    toggleFresherMode,
  } = useResume();

  const [resumeDropdownOpen, setResumeDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'builder', label: 'Resume Builder', icon: FileText },
    { id: 'jobMatcher', label: 'Job Matcher', icon: Briefcase },
    { id: 'analyzer', label: 'ATS Analyzer', icon: Target },
    { id: 'skillGap', label: 'Skill Gap', icon: Award },
    { id: 'interview', label: 'Interview Coach', icon: Sparkles },
    { id: 'health', label: 'Resume Health', icon: HeartPulse },
    { id: 'preview', label: 'Preview & Export', icon: Download },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('landing')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900">
                    ATS <span className="text-blue-600">Pro</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 rounded-md">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">
                  Resume Builder & Optimizer
                </p>
              </div>
            </button>

            {/* Fresher Mode Pill Switch */}
            <div className="hidden md:flex items-center ml-4 pl-4 border-l border-slate-200">
              <button
                onClick={() => toggleFresherMode()}
                title="Fresher Mode prioritizes academic projects, internships, coursework, and technical skills over work history"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  isFresherMode
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <GraduationCap className={`w-3.5 h-3.5 ${isFresherMode ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Fresher Mode:</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] ${isFresherMode ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                  {isFresherMode ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Resume Selector + Auth / Profile */}
          <div className="flex items-center gap-3">
            {/* Resume Switcher */}
            <div className="relative">
              <button
                onClick={() => setResumeDropdownOpen(!resumeDropdownOpen)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 transition-colors border border-slate-200/60"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span className="max-w-[110px] truncate">{activeResume.title}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {resumeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      My Resumes ({savedResumes.length})
                    </span>
                    <button
                      onClick={() => {
                        createNewResume();
                        setResumeDropdownOpen(false);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> New
                    </button>
                  </div>
                  <div className="max-h-56 overflow-y-auto py-1">
                    {savedResumes.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          switchResume(r.id);
                          setResumeDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          r.id === activeResume.id ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                        }`}
                      >
                        <div className="truncate mr-2">
                          <p className="truncate">{r.title}</p>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {r.isFresher ? '🎓 Fresher' : '💼 Experienced'}
                          </span>
                        </div>
                        {r.id === activeResume.id && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Auth Button */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 transition-colors"
                >
                  <span className="text-xs font-semibold text-slate-700 hidden md:inline">
                    {user.name}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        onSelectTab('dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-slate-100"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase">Fresher Mode</span>
            <button
              onClick={() => toggleFresherMode()}
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isFresherMode ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {isFresherMode ? '🎓 Fresher ON' : '💼 Experienced'}
            </button>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
