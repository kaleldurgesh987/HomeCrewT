import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Zap, MapPin, Clock, ArrowRight } from 'lucide-react';

export const WorkerCard = ({ worker, onBook, onViewProfile }) => {
  const {
    user,
    skills = [],
    hourlyRate = 350,
    avgRating = 4.8,
    totalReviews = 0,
    verificationStatus = 'pending',
    distanceKm = 2.4,
    etaMinutes = 15,
    isUnder30Min = true,
    etaFormatted = '15 min',
    availability = true,
  } = worker;

  const isVerified = verificationStatus === 'verified';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft hover:shadow-card transition-all flex flex-col justify-between relative overflow-hidden group"
    >
      {/* 30-min Guaranteed Badge */}
      {isUnder30Min && (
        <div className="absolute top-3 right-3 bg-brand-gold-50 border border-brand-gold-300 text-brand-gold-800 text-[11px] font-heading font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Zap className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
          <span>⚡ &lt; 30 MIN ETA</span>
        </div>
      )}

      <div>
        {/* Worker Header: Avatar, Name, Verification, Rating */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="relative shrink-0 cursor-pointer" onClick={() => onViewProfile && onViewProfile(worker)}>
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={user?.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-brand-green-100 group-hover:border-brand-gold transition-colors"
            />
            {/* Status dot */}
            <span
              className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                availability ? 'bg-emerald-500' : 'bg-gray-400'
              }`}
              title={availability ? 'Online & Ready' : 'Currently Busy'}
            />
          </div>

          <div className="flex-1 min-w-0 pr-16">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3
                onClick={() => onViewProfile && onViewProfile(worker)}
                className="font-heading font-bold text-gray-900 text-base hover:text-brand-green-700 cursor-pointer truncate"
              >
                {user?.name || 'Pro Worker'}
              </h3>
              {isVerified && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-brand-green-700 bg-brand-green-50 px-1.5 py-0.5 rounded-md border border-brand-green-200">
                  <ShieldCheck className="w-3 h-3 text-brand-green-600" />
                  Verified
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span className="truncate">{user?.address || 'Mumbai, Maharashtra'}</span>
            </p>

            <div className="flex items-center gap-2 mt-1.5">
              <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {avgRating} ({totalReviews})
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" />
                {etaFormatted} away
              </span>
            </div>
          </div>
        </div>

        {/* Skills Tag Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="text-[11px] font-semibold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-md"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Footer: Rate & Action Buttons */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            Worker Rate
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-heading font-extrabold text-brand-green-900">
              ₹{hourlyRate}
            </span>
            <span className="text-xs text-gray-500">/hr</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewProfile && onViewProfile(worker)}
            className="px-3 py-2 text-xs font-semibold text-gray-700 hover:text-brand-green-700 hover:bg-brand-green-50 rounded-xl transition-colors"
          >
            Profile
          </button>
          <button
            onClick={() => onBook && onBook(worker)}
            className="px-4 py-2 bg-brand-green-700 hover:bg-brand-green-800 text-white text-xs font-heading font-bold rounded-xl shadow-md hover:shadow-brand-green-700/25 transition-all flex items-center gap-1"
          >
            <span>Book / Offer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkerCard;
