import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  DollarSign,
  Heart,
  Users,
  Target,
  ArrowRight,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { Logo } from '../components/Logo';

export const About = () => {
  return (
    <div className="min-h-screen bg-brand-cream py-16 select-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-gold-50 border border-brand-gold-300 text-brand-gold-800 text-xs font-heading font-extrabold tracking-wide uppercase">
            <Award className="w-3.5 h-3.5 text-brand-gold" />
            Hackathon Mission • Domain: Social Impact
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-gray-900 tracking-tight">
            Restoring Dignity to Informal Work, One Home at a Time
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
            HomeCrew was built by <strong>Team ShadowX Coders</strong> to solve a deep socio-economic
            challenge across Indian urban metros: informal blue-collar exploitation, lack of safety, and slow discovery.
          </p>
        </div>

        {/* The Problem vs The Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Problem Card */}
          <div className="bg-red-50/70 rounded-3xl p-8 border border-red-200/80 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center font-heading font-bold text-lg">
              ✕
            </div>
            <h2 className="text-xl font-heading font-bold text-red-950">
              The Problem: The Informal Sector Crisis
            </h2>
            <ul className="space-y-3 text-xs text-red-900/90 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="font-bold text-red-600 mt-0.5">•</span>
                <span>
                  <strong>Predatory Platform Cuts:</strong> Traditional gig platforms siphon 25% to 35%
                  commission on each repair task, leaving workers struggling to make minimum wage.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-red-600 mt-0.5">•</span>
                <span>
                  <strong>Agonizing Waiting Times:</strong> Homeowners facing plumbing leaks or short circuits wait 4 to 24 hours for technician arrival.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-red-600 mt-0.5">•</span>
                <span>
                  <strong>Safety Blindspots:</strong> Informal technicians and residents often feel vulnerable entering unfamiliar residences without panic support or GPS audits.
                </span>
              </li>
            </ul>
          </div>

          {/* Solution Card */}
          <div className="bg-brand-green-50/70 rounded-3xl p-8 border border-brand-green-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-green text-brand-gold flex items-center justify-center font-heading font-bold text-lg">
              ✓
            </div>
            <h2 className="text-xl font-heading font-bold text-brand-green-950">
              The Solution: The HomeCrew Model
            </h2>
            <ul className="space-y-3 text-xs text-brand-green-900/90 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="font-bold text-brand-green mt-0.5">•</span>
                <span>
                  <strong>100% Direct Worker Pay:</strong> HomeCrew charges 0% commission fees on labor.
                  Workers set their own base rates and negotiate freely with customers.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-brand-green mt-0.5">•</span>
                <span>
                  <strong>Under 30-Minute Hyperlocal Matching:</strong> Using MongoDB 2dsphere geospatial radius
                  queries, customers match with workers within 3 to 5 km of their doorstep (~25 km/h transit time).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-brand-green mt-0.5">•</span>
                <span>
                  <strong>Real-Time SOS Alarm System:</strong> One-tap SOS panic button broadcasts live GPS
                  coordinates directly to emergency response units, ensuring complete mutual security.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* 4 Pillars of Social Impact */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-soft space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-2xl font-heading font-bold text-gray-900">
              Our 4 Pillars of Impact
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Engineered for scalable community transformation
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-brand-green text-white flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-5 h-5 text-brand-gold" />
              </div>
              <h4 className="font-heading font-bold text-sm text-gray-900 mb-1">Financial Dignity</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Empowering blue-collar tradespeople with pricing autonomy and direct instantaneous cash settlements.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-brand-green text-white flex items-center justify-center mx-auto mb-3">
                <Zap className="w-5 h-5 text-brand-gold" />
              </div>
              <h4 className="font-heading font-bold text-sm text-gray-900 mb-1">Hyperlocal Speed</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Eliminating dead travel time and traffic fatigue through high-density neighborhood clustering.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-brand-green text-white flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-5 h-5 text-brand-gold" />
              </div>
              <h4 className="font-heading font-bold text-sm text-gray-900 mb-1">Audited Trust</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Aadhaar document reviews and verified badges guarantee dependable workmanship for homeowners.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-brand-green text-white flex items-center justify-center mx-auto mb-3">
                <Heart className="w-5 h-5 text-brand-gold" />
              </div>
              <h4 className="font-heading font-bold text-sm text-gray-900 mb-1">Community Equity</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Multilingual interface (English, Hindi, Marathi) ensuring zero barriers for informal workers.
              </p>
            </div>
          </div>
        </div>

        {/* Team ShadowX Coders Banner */}
        <div className="bg-brand-green rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-heading font-bold text-brand-gold uppercase tracking-wider">
              Hackathon Creator Showcase
            </span>
            <h3 className="text-2xl font-heading font-extrabold text-brand-cream">
              Built by Team ShadowX Coders
            </h3>
            <p className="text-xs text-brand-green-100 max-w-lg">
              Passionate full-stack developers committed to deploying tech for social equity,
              labor rights, and hyper-local urban empowerment.
            </p>
          </div>

          <Link
            to="/find-workers"
            className="px-6 py-3.5 bg-brand-gold hover:bg-brand-gold-500 text-brand-green-900 font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:scale-105 shrink-0"
          >
            Explore Platform &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
