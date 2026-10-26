import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, KeyRound, ShieldCheck, UserCheck, Briefcase, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';

export const LoginSignup = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'customer';

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [skills, setSkills] = useState(['Plumber']);
  const [hourlyRate, setHourlyRate] = useState(350);
  const [address, setAddress] = useState('Bandra West, Mumbai');

  const [step, setStep] = useState(1); // 1 = Phone & Role, 2 = Enter OTP & Details
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSentMessage, setOtpSentMessage] = useState('');

  const { sendOtp, verifyOtp, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!phone || phone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp(phone);
      if (res.success) {
        setOtpSentMessage(res.message);
        setOtp('123456'); // Pre-fill mock OTP in dev mode for ease of evaluation!
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        phone,
        otp,
        role,
        name: name || (role === 'worker' ? 'Pro Worker' : 'Customer'),
        skills: role === 'worker' ? skills : [],
        hourlyRate: role === 'worker' ? Number(hourlyRate) : undefined,
        address,
      };

      const res = await verifyOtp(payload);
      if (res.success) {
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else if (res.user.role === 'worker') {
          navigate('/worker/dashboard');
        } else {
          navigate('/customer/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please check OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (demoPhone) => {
    setLoading(true);
    try {
      const res = await quickDemoLogin(demoPhone);
      if (res.success) {
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else if (res.user.role === 'worker') {
          navigate('/worker/dashboard');
        } else {
          navigate('/customer/dashboard');
        }
      }
    } catch (err) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8 select-none">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block mb-4">
          <Logo variant="full" interactive={true} size="large" />
        </Link>
        <h2 className="text-2xl font-heading font-extrabold text-gray-900 tracking-tight">
          {step === 1 ? 'Log In or Register' : 'Verify One-Time Password'}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Hyperlocal access to trusted blue-collar services
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-card border border-gray-100">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              {/* Role Selector Pill */}
              <div>
                <label className="block text-xs font-heading font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Your Account Type
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-heading font-bold transition-all ${
                      role === 'customer'
                        ? 'bg-brand-green text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Customer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('worker')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-heading font-bold transition-all ${
                      role === 'worker'
                        ? 'bg-brand-gold text-brand-green-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Pro Worker</span>
                  </button>
                </div>
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-xs font-heading font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 font-semibold text-xs">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9820011223"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 text-sm font-semibold tracking-wider text-gray-900 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand-green hover:bg-brand-green-700 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Sending Code...' : 'Get Verification Code'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="p-3 bg-brand-gold-50 border border-brand-gold-200 rounded-xl text-xs text-brand-green-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-gold-600 shrink-0" />
                <span>
                  Dev Mode Active: Use mock OTP <strong className="font-extrabold text-brand-green-900">123456</strong>
                </span>
              </div>

              {/* OTP Input */}
              <div>
                <label className="block text-xs font-heading font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Enter 6-Digit OTP
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 text-sm font-bold tracking-widest text-center text-gray-900 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-heading font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-brand-green"
                />
              </div>

              {/* If Worker: Skills & Hourly Rate */}
              {role === 'worker' && (
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-heading font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Primary Trade / Skill
                    </label>
                    <select
                      value={skills[0]}
                      onChange={(e) => setSkills([e.target.value])}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-brand-green bg-white"
                    >
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

                  <div>
                    <label className="block text-xs font-heading font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Your Hourly Rate (₹/hr)
                    </label>
                    <input
                      type="number"
                      min={100}
                      max={3000}
                      step={50}
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-brand-green focus:outline-none focus:border-brand-green"
                    />
                  </div>
                </div>
              )}

              {/* Address */}
              <div>
                <label className="block text-xs font-heading font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Neighborhood (Mumbai)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Bandra West, Mumbai"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-brand-green"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 border border-gray-300 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 py-3 bg-brand-green hover:bg-brand-green-700 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  {loading ? 'Verifying...' : 'Complete & Enter'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Instant 1-Click Hackathon Presets */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-[11px] font-heading font-bold text-gray-400 uppercase tracking-wider text-center mb-3">
              ⚡ 1-Click Hackathon Demo Login
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemo('9820011223')}
                className="p-2 rounded-xl bg-gray-50 hover:bg-brand-green-50 border border-gray-200 text-left transition-colors"
              >
                <span className="font-bold text-gray-800 block text-[11px]">Rahul (Customer)</span>
                <span className="text-[10px] text-gray-500">9820011223</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemo('9820099881')}
                className="p-2 rounded-xl bg-gray-50 hover:bg-brand-gold-50 border border-gray-200 text-left transition-colors"
              >
                <span className="font-bold text-gray-800 block text-[11px]">Ramesh (Plumber)</span>
                <span className="text-[10px] text-gray-500">9820099881</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemo('9820099882')}
                className="p-2 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-200 text-left transition-colors"
              >
                <span className="font-bold text-gray-800 block text-[11px]">Amit (Electrician)</span>
                <span className="text-[10px] text-gray-500">9820099882</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemo('9999999999')}
                className="p-2 rounded-xl bg-gray-50 hover:bg-purple-50 border border-gray-200 text-left transition-colors"
              >
                <span className="font-bold text-gray-800 block text-[11px]">Admin Portal</span>
                <span className="text-[10px] text-gray-500">9999999999</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
