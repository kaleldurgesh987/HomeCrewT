import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, MapPin, Phone, Mail, Award } from 'lucide-react';
import { Logo } from './Logo';

export const Footer = () => {
  return (
    <footer className="bg-brand-green-900 text-brand-cream border-t border-brand-green-800 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Brand & Social Impact Mission */}
          <div className="space-y-4 md:col-span-1">
            <Logo variant="full" interactive={false} size="normal" />
            <p className="text-xs text-brand-green-200 leading-relaxed">
              HomeCrew is a hyperlocal platform democratizing blue-collar livelihoods. We connect households
              with trusted informal workers within 30 minutes, guaranteeing 100% direct pay and zero commissions.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-gold bg-brand-green-800/80 px-2.5 py-1 rounded-full border border-brand-green-700">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
                Social Impact Domain
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-brand-gold uppercase tracking-wider">
              Explore Platform
            </h4>
            <ul className="space-y-2 text-xs text-brand-green-100">
              <li>
                <Link to="/find-workers" className="hover:text-brand-gold transition-colors">
                  Find Workers Near Me
                </Link>
              </li>
              <li>
                <Link to="/customer/dashboard" className="hover:text-brand-gold transition-colors">
                  Post a Job (30-min Urgent)
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="hover:text-brand-gold transition-colors">
                  How Live Negotiation Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-gold transition-colors">
                  The Informal Sector Crisis & Solution
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand-gold transition-colors">
                  Worker Registration (Zero Cuts)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Trades */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-brand-gold uppercase tracking-wider">
              Active Trades (Mumbai)
            </h4>
            <ul className="space-y-2 text-xs text-brand-green-100">
              <li>
                <Link to="/find-workers?service=Plumber" className="hover:text-brand-gold transition-colors">
                  Emergency Plumbers (Taps, Pipes)
                </Link>
              </li>
              <li>
                <Link to="/find-workers?service=Electrician" className="hover:text-brand-gold transition-colors">
                  Certified Electricians (MCB, Wiring)
                </Link>
              </li>
              <li>
                <Link to="/find-workers?service=Deep+Cleaning" className="hover:text-brand-gold transition-colors">
                  Deep Cleaning & Sanitization
                </Link>
              </li>
              <li>
                <Link to="/find-workers?service=Maid+%26+Cook" className="hover:text-brand-gold transition-colors">
                  Wholesome Cooks & House Maids
                </Link>
              </li>
              <li>
                <Link to="/find-workers?service=Painter" className="hover:text-brand-gold transition-colors">
                  Wall Painters & Waterproofing
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Safety & Hackathon Recognition */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-brand-gold uppercase tracking-wider">
              Safety & Emergency
            </h4>
            <p className="text-xs text-brand-green-200">
              Every job session is protected by live location broadcasts, emergency SOS alarms, and direct police integration.
            </p>
            <div className="bg-brand-green-800/60 p-3 rounded-xl border border-brand-green-700 text-xs space-y-1">
              <p className="text-brand-cream font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-brand-gold" />
                Emergency Helpline: 112 / 1091
              </p>
              <p className="text-brand-green-300 text-[11px]">HomeCrew Support: 1800-HOMECREW</p>
            </div>
            <Link
              to="/admin"
              className="inline-block text-[11px] text-brand-green-300 hover:text-brand-gold transition-colors"
            >
              Staff &amp; Admin Verification Portal &rarr;
            </Link>
          </div>
        </div>

        {/* Bottom Banner: Built by Team ShadowX Coders */}
        <div className="mt-12 pt-8 border-t border-brand-green-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Team ShadowX Coders Badge SVG */}
            <div className="flex items-center gap-2 bg-brand-green-800 px-3.5 py-1.5 rounded-xl border border-brand-green-600/60 shadow-sm">
              <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="#0B5D43" />
                <path d="M10 12L20 20L10 28M30 28L20 20L30 12" stroke="#F9B000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="20" cy="20" r="3" fill="#FAFBF8" />
              </svg>
              <div>
                <span className="text-xs font-heading font-bold text-brand-cream">
                  Team <span className="text-brand-gold">ShadowX</span> Coders
                </span>
                <p className="text-[10px] text-brand-green-300 tracking-wider uppercase font-semibold">
                  Hackathon • Social Impact
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-brand-green-300 text-center md:text-right">
            &copy; {new Date().getFullYear()} HomeCrew. Empowering informal blue-collar professionals across Mumbai.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
