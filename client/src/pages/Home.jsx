import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Wrench,
  Zap,
  Paintbrush,
  Sparkles,
  Utensils,
  Hammer,
  Refrigerator,
  Bug,
  ShieldCheck,
  Clock,
  DollarSign,
  Star,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Home = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [selectedService, setSelectedService] = useState('All');
  const [locationQuery, setLocationQuery] = useState('Bandra West, Mumbai');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedService && selectedService !== 'All') {
      params.append('service', selectedService);
    }
    if (locationQuery) {
      params.append('search', locationQuery);
    }
    navigate(`/find-workers?${params.toString()}`);
  };

  const categories = [
    {
      name: 'Plumber',
      title: 'Plumbing & Drainage',
      icon: Wrench,
      avgRate: '₹350/hr',
      avgTime: '15 min',
      color: 'bg-emerald-50 text-brand-green-700 border-emerald-200',
    },
    {
      name: 'Electrician',
      title: 'Electrical & MCB',
      icon: Zap,
      avgRate: '₹400/hr',
      avgTime: '18 min',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      name: 'Deep Cleaning',
      title: 'Deep Home Cleaning',
      icon: Sparkles,
      avgRate: '₹380/hr',
      avgTime: '25 min',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      name: 'Maid & Cook',
      title: 'Cook & Housekeeper',
      icon: Utensils,
      avgRate: '₹300/hr',
      avgTime: '20 min',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      name: 'Painter',
      title: 'Wall Painting & Putty',
      icon: Paintbrush,
      avgRate: '₹450/hr',
      avgTime: '30 min',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      name: 'Carpenter',
      title: 'Carpentry & Furniture',
      icon: Hammer,
      avgRate: '₹450/hr',
      avgTime: '22 min',
      color: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    {
      name: 'Appliance Repair',
      title: 'AC & Appliances',
      icon: Refrigerator,
      avgRate: '₹500/hr',
      avgTime: '25 min',
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    },
    {
      name: 'Pest Control',
      title: 'Safe Pest Control',
      icon: Bug,
      avgRate: '₹420/hr',
      avgTime: '28 min',
      color: 'bg-teal-50 text-teal-700 border-teal-200',
    },
  ];

  const steps = [
    {
      number: '01',
      title: t('step1Title'),
      desc: t('step1Desc'),
      icon: Search,
    },
    {
      number: '02',
      title: t('step2Title'),
      desc: t('step2Desc'),
      icon: DollarSign,
    },
    {
      number: '03',
      title: t('step3Title'),
      desc: t('step3Desc'),
      icon: Clock,
    },
    {
      number: '04',
      title: t('step4Title'),
      desc: t('step4Desc'),
      icon: Star,
    },
  ];

  const testimonials = [
    {
      name: 'Priyanka Sen',
      area: 'Bandra West, Mumbai',
      role: 'Customer',
      text: 'My bathroom tap burst on a Sunday morning. Within 12 minutes of posting on HomeCrew, Ramesh arrived with spare washers and fixed it. Direct negotiation felt completely transparent!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    },
    {
      name: 'Ramesh Patil',
      area: 'Dadar, Mumbai',
      role: 'Pro Plumber (Partner)',
      text: 'Traditional platforms took 25% commission from my hard work. On HomeCrew, I get 100% of what the customer agrees to pay me, and my jobs are all within a 4 km radius!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=120&q=80',
    },
    {
      name: 'Aditya Mathur',
      area: 'Powai, Mumbai',
      role: 'Customer',
      text: 'The 30-minute arrival guarantee is a lifesaver. Our AC stopped cooling during a heatwave and Mohammad was at our door in 20 minutes. The live tracking gave us peace of mind.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-green to-brand-green-800 text-brand-cream pt-16 pb-24 md:pt-24 md:pb-36">
        {/* Ambient Decorative Shapes */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Guarantee Tag */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold-50/15 border border-brand-gold/40 text-brand-gold text-xs font-heading font-extrabold tracking-wide uppercase shadow-sm"
            >
              <Zap className="w-4 h-4 fill-brand-gold" />
              <span>{t('urgent30MinTag')}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-tight text-white"
            >
              {t('heroTitle')}{' '}
              <span className="text-brand-gold underline decoration-brand-gold/60 underline-offset-8">
                {t('heroHighlight')}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-brand-cream/85 leading-relaxed max-w-2xl mx-auto font-normal"
            >
              {t('heroSubtitle')}
            </motion.p>

            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="pt-4"
            >
              <form
                onSubmit={handleSearch}
                className="bg-white p-2.5 sm:p-3 rounded-2xl sm:rounded-full shadow-2xl flex flex-col sm:flex-row items-center gap-3 border border-gray-100 max-w-2xl mx-auto"
              >
                {/* Service Dropdown */}
                <div className="flex items-center gap-2 w-full sm:w-1/3 px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-200">
                  <Wrench className="w-4 h-4 text-brand-green shrink-0" />
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full text-xs font-semibold text-gray-800 bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="All">{t('allServices')}</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Deep Cleaning">Deep Cleaning</option>
                    <option value="Maid & Cook">Maid & Cook</option>
                    <option value="Painter">Painter</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Appliance Repair">Appliance Repair</option>
                    <option value="Pest Control">Pest Control</option>
                  </select>
                </div>

                {/* Location Input */}
                <div className="flex items-center gap-2 w-full sm:w-1/2 px-3 py-2">
                  <MapPin className="w-4 h-4 text-brand-gold shrink-0" />
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder={t('locationPlaceholder')}
                    className="w-full text-xs font-medium text-gray-800 bg-transparent focus:outline-none placeholder:text-gray-400"
                  />
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3.5 bg-brand-gold hover:bg-brand-gold-500 text-brand-green-900 font-heading font-extrabold text-xs tracking-wider uppercase rounded-xl sm:rounded-full shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105 shrink-0"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  <span>Search</span>
                </button>
              </form>
            </motion.div>

            {/* Quick Micro Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-6 text-xs text-brand-cream/80 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                Zero Commission Platform
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                Aadhaar Background Checked
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                Live GPS Tracking &amp; SOS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="relative -mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 md:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-3 border-r-0 sm:border-r border-gray-100">
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-green">
              2,500+
            </p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
              {t('statsWorkers')}
            </p>
          </div>
          <div className="text-center p-3 lg:border-r border-gray-100">
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-gold-600">
              18 min
            </p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
              {t('statsEta')}
            </p>
          </div>
          <div className="text-center p-3 border-r-0 sm:border-r border-gray-100">
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-green">
              4.9 / 5
            </p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
              {t('statsSatisfaction')}
            </p>
          </div>
          <div className="text-center p-3">
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-gold-600">
              100%
            </p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
              Direct Worker Pay (0% Cut)
            </p>
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900">
            {t('popularCategories')}
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            {t('popularCategoriesSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate(`/find-workers?service=${encodeURIComponent(cat.name)}`)}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft hover:shadow-card cursor-pointer flex flex-col justify-between transition-all group"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${cat.color} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-gray-900 text-base group-hover:text-brand-green transition-colors">
                    {cat.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 font-medium">
                    <span className="font-bold text-brand-green-800">{cat.avgRate}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                      <Clock className="w-3 h-3" /> ~{cat.avgTime}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-brand-green group-hover:text-brand-gold transition-colors">
                  <span>Browse Pros</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How It Works in 4 Steps */}
      <section id="how-it-works" className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900">
              {t('howItWorks')}
            </h2>
            <p className="text-sm text-gray-600 mt-2">{t('howItWorksSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={idx}
                  className="relative p-6 rounded-2xl bg-brand-cream/60 border border-gray-200/70 hover:border-brand-green-300 transition-colors"
                >
                  <span className="text-3xl font-heading font-extrabold text-brand-green-200 absolute top-4 right-4">
                    {st.number}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-brand-green text-brand-gold flex items-center justify-center mb-4 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-gray-900 mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-brand-gold-600">
            Safety, Dignity &amp; Equity
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mt-1">
            {t('trustSectionTitle')}
          </h2>
          <p className="text-sm text-gray-600 mt-2">{t('trustSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-brand-green flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-sm text-gray-900 mb-1">
              {t('trustCard1Title')}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">{t('trustCard1Desc')}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft">
            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-sm text-gray-900 mb-1">
              {t('trustCard2Title')}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">{t('trustCard2Desc')}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <DollarSign className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-sm text-gray-900 mb-1">
              {t('trustCard3Title')}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">{t('trustCard3Desc')}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-sm text-gray-900 mb-1">
              {t('trustCard4Title')}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">{t('trustCard4Desc')}</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-brand-green text-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              {t('testimonialsTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-brand-green-200 mt-2">
              Real stories from homeowners and pro workers across Mumbai neighborhoods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className="bg-brand-green-800/80 rounded-2xl p-6 border border-brand-green-700 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-brand-gold mb-3">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-brand-gold" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-brand-cream/90 leading-relaxed italic">
                    "{item.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-brand-green-700">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-brand-gold"
                  />
                  <div>
                    <h5 className="font-heading font-bold text-sm text-brand-cream">{item.name}</h5>
                    <p className="text-[11px] text-brand-gold">{item.role} • {item.area}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Worker Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-brand-gold-50 via-white to-brand-gold-50 border-t border-brand-gold-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-green-900 rounded-3xl p-8 sm:p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-brand-gold/15 blur-3xl pointer-events-none" />

            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              <span className="inline-block px-3.5 py-1 rounded-full bg-brand-gold/20 text-brand-gold border border-brand-gold/40 text-xs font-heading font-bold uppercase tracking-wider">
                Fair Pay • Zero Deductions
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
                {t('joinAsWorkerTitle')}
              </h2>
              <p className="text-sm sm:text-base text-brand-green-100 font-normal leading-relaxed">
                {t('joinAsWorkerSubtitle')}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/login?role=worker"
                  className="w-full sm:w-auto px-8 py-4 bg-brand-gold hover:bg-brand-gold-500 text-brand-green-900 font-heading font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-lg transition-transform hover:scale-105"
                >
                  {t('joinAsWorkerBtn')}
                </Link>
                <Link
                  to="/customer/dashboard"
                  className="w-full sm:w-auto px-8 py-4 bg-brand-green-800 hover:bg-brand-green-700 text-white font-heading font-semibold text-xs tracking-wider uppercase rounded-xl border border-brand-green-600 transition-colors"
                >
                  Post a Job Request
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
