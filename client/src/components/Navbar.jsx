import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Globe, Menu, X, User, LogOut, ShieldCheck, Zap, KeyRound, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const { user, workerProfile, logout, quickDemoLogin, toggleAvailability } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDemoSelect = async (phone) => {
    try {
      await quickDemoLogin(phone);
      setDemoModalOpen(false);
    } catch (err) {
      console.error('Demo login error:', err);
    }
  };

  const navLinks = [
    { name: t('findWorkersNav'), path: '/find-workers' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'About', path: '/about' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand-green shadow-md border-b border-brand-green-600 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo with hover animation */}
          <Link to="/" className="flex items-center">
            <Logo variant="nav" interactive={true} size="normal" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-brand-gold ${
                  location.pathname === link.path
                    ? 'text-brand-gold font-semibold'
                    : 'text-brand-cream/90'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Role-Specific Shortcuts */}
            {user && user.role === 'customer' && (
              <Link
                to="/customer/dashboard"
                className="text-sm font-medium text-brand-cream hover:text-brand-gold transition-colors"
              >
                {t('myJobsNav')}
              </Link>
            )}

            {user && user.role === 'worker' && (
              <Link
                to="/worker/dashboard"
                className="text-sm font-medium text-brand-cream hover:text-brand-gold flex items-center gap-1.5 transition-colors"
              >
                <span>{t('workerDashboardNav')}</span>
                {workerProfile && (
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      toggleAvailability();
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold cursor-pointer transition-colors ${
                      workerProfile.availability
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                        : 'bg-red-500/20 text-red-300 border border-red-400/40'
                    }`}
                  >
                    {workerProfile.availability ? '🟢 Online' : '🔴 Busy'}
                  </span>
                )}
              </Link>
            )}

            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                className="text-sm font-medium text-brand-gold hover:underline transition-colors flex items-center gap-1"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t('adminNav')}</span>
              </Link>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative flex items-center bg-brand-green-800/80 border border-brand-green-600 rounded-lg p-1 text-xs">
              <Globe className="w-3.5 h-3.5 text-brand-gold mx-1" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-brand-cream font-medium focus:outline-none cursor-pointer pr-1"
                aria-label="Select Language"
              >
                <option value="en" className="bg-brand-green text-brand-cream">
                  English
                </option>
                <option value="hi" className="bg-brand-green text-brand-cream">
                  हिन्दी (Hindi)
                </option>
                <option value="mr" className="bg-brand-green text-brand-cream">
                  मराठी (Marathi)
                </option>
              </select>
            </div>

            {/* Quick Demo Switcher Button for Hackathon Judges */}
            <button
              onClick={() => setDemoModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brand-gold/15 hover:bg-brand-gold/25 border border-brand-gold/40 text-brand-gold text-xs font-semibold transition-colors"
              title="Switch demo role instantly"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Roles</span>
            </button>

            {/* Post Job CTA button */}
            <Link
              to="/customer/dashboard"
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-brand-gold hover:bg-brand-gold-500 text-brand-green-900 font-heading font-bold text-xs tracking-wide shadow-md transition-all hover:scale-105"
            >
              <Zap className="w-3.5 h-3.5 fill-brand-green-900" />
              <span>{t('postJobBtn')}</span>
            </Link>

            {/* Auth status / Login Button */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-brand-green-600">
                <Link
                  to={user.role === 'worker' ? '/worker/dashboard' : '/customer/dashboard'}
                  className="flex items-center gap-2 text-brand-cream hover:text-brand-gold transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-brand-gold"
                  />
                  <div className="text-left text-xs leading-tight">
                    <p className="font-semibold text-brand-cream truncate max-w-[90px]">{user.name}</p>
                    <span className="text-[10px] text-brand-gold uppercase tracking-wider font-bold">
                      {user.role}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 text-brand-green-200 hover:text-red-300 transition-colors"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-green-700 hover:bg-brand-green-800 text-brand-cream font-medium text-xs border border-brand-green-500/40 transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5 text-brand-gold" />
                <span>{t('loginNav')}</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setDemoModalOpen(true)}
              className="p-1.5 bg-brand-gold/20 text-brand-gold rounded-lg text-xs font-bold"
            >
              Demo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-brand-cream hover:text-brand-gold rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-brand-green-800 border-t border-brand-green-700 px-4 pt-3 pb-6 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-brand-green-700">
              <span className="text-xs text-brand-green-200">Language:</span>
              <div className="flex gap-2">
                {['en', 'hi', 'mr'].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-2.5 py-1 rounded text-xs uppercase font-bold ${
                      lang === l
                        ? 'bg-brand-gold text-brand-green-900'
                        : 'bg-brand-green-700 text-brand-cream'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-brand-cream hover:bg-brand-green-700"
                >
                  {link.name}
                </Link>
              ))}

              {user && user.role === 'customer' && (
                <Link
                  to="/customer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-brand-gold hover:bg-brand-green-700"
                >
                  {t('myJobsNav')}
                </Link>
              )}

              {user && user.role === 'worker' && (
                <Link
                  to="/worker/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-brand-gold hover:bg-brand-green-700"
                >
                  {t('workerDashboardNav')}
                </Link>
              )}

              {user && user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-brand-gold hover:bg-brand-green-700"
                >
                  {t('adminNav')}
                </Link>
              )}

              <Link
                to="/customer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 py-2.5 text-center bg-brand-gold text-brand-green-900 rounded-xl font-heading font-bold text-xs"
              >
                ⚡ {t('postJobBtn')}
              </Link>

              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 text-center text-xs text-red-300 font-semibold"
                >
                  Logout ({user.name})
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center bg-brand-green-700 text-brand-cream rounded-xl text-xs font-semibold"
                >
                  {t('loginNav')}
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Demo Account Quick Switcher Modal (Hackathon evaluation aid) */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-gold" />
                <h3 className="font-heading font-bold text-gray-900 text-lg">
                  1-Click Hackathon Demo Login
                </h3>
              </div>
              <button
                onClick={() => setDemoModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 mt-2 mb-4">
              Select any pre-configured persona to test the platform workflows immediately (uses dev OTP <strong>123456</strong>):
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => handleDemoSelect('9820011223')}
                className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-brand-green-600 hover:bg-brand-green-50 transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-xs font-bold text-brand-green-800 uppercase tracking-wider">
                    Customer Account
                  </span>
                  <p className="text-sm font-semibold text-gray-900">Rahul Sharma (Bandra West)</p>
                  <span className="text-xs text-gray-500">Phone: 9820011223</span>
                </div>
                <span className="text-xs font-bold text-brand-green-700 group-hover:translate-x-1 transition-transform">
                  Log In &rarr;
                </span>
              </button>

              <button
                onClick={() => handleDemoSelect('9820099881')}
                className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-brand-gold-500 hover:bg-brand-gold-50 transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    Pro Worker (Plumber)
                  </span>
                  <p className="text-sm font-semibold text-gray-900">Ramesh Patil (4.9 ★, ₹350/hr)</p>
                  <span className="text-xs text-gray-500">Phone: 9820099881</span>
                </div>
                <span className="text-xs font-bold text-brand-gold-700 group-hover:translate-x-1 transition-transform">
                  Log In &rarr;
                </span>
              </button>

              <button
                onClick={() => handleDemoSelect('9820099882')}
                className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                    Pro Worker (Electrician)
                  </span>
                  <p className="text-sm font-semibold text-gray-900">Amit Verma (4.8 ★, ₹400/hr)</p>
                  <span className="text-xs text-gray-500">Phone: 9820099882</span>
                </div>
                <span className="text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
                  Log In &rarr;
                </span>
              </button>

              <button
                onClick={() => handleDemoSelect('9999999999')}
                className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                    Platform Administrator
                  </span>
                  <p className="text-sm font-semibold text-gray-900">HomeCrew Admin (Verification Queue)</p>
                  <span className="text-xs text-gray-500">Phone: 9999999999</span>
                </div>
                <span className="text-xs font-bold text-purple-700 group-hover:translate-x-1 transition-transform">
                  Log In &rarr;
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
