import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SplashScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Automatically transition after 2.6s
    const timer = setTimeout(() => {
      handleComplete();
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 400); // Allow fade-out transition
  };

  const letters = ['H', 'o', 'm', 'e', 'C', 'r', 'e', 'w'];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-green-700 text-brand-cream overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          {/* Subtle background ambient pulse */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,176,0,0.12)_0%,transparent_70%)] pointer-events-none" />

          {/* Skippable button */}
          <button
            onClick={handleComplete}
            className="absolute top-6 right-6 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase bg-brand-green-800/80 hover:bg-brand-green-900 border border-brand-green-400/30 text-brand-cream/80 hover:text-brand-cream transition-colors z-20"
          >
            Skip Intro &rarr;
          </button>

          {/* Centered Animated SVG Canvas */}
          <div className="relative w-80 h-80 flex items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="splashGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Step 1: House outline draws itself (stroke animation) */}
              <motion.path
                d="M100 25L30 80H48V155H152V80H170L100 25Z"
                fill="#0B5D43"
                stroke="#FAFBF8"
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{
                  pathLength: 1,
                  fillOpacity: 1,
                  transition: {
                    pathLength: { duration: 0.9, ease: 'easeInOut' },
                    fillOpacity: { delay: 0.6, duration: 0.4 },
                  },
                }}
              />

              {/* Glowing Window in Attic */}
              <motion.rect
                x="88"
                y="52"
                width="24"
                height="24"
                rx="4"
                fill="#F9B000"
                stroke="#FAFBF8"
                strokeWidth="2.5"
                filter="url(#splashGlow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  transition: { delay: 0.8, type: 'spring', stiffness: 350, damping: 18 },
                }}
              />
              <motion.path
                d="M100 52V76M88 64H112"
                stroke="#0B5D43"
                strokeWidth="2.2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.9 } }}
              />

              {/* Step 2: Two worker icons pop in */}
              {/* Left Worker */}
              <motion.g
                transform="translate(62, 88)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  transition: { delay: 1.0, type: 'spring', stiffness: 380, damping: 20 },
                }}
              >
                <circle cx="10" cy="8" r="7" fill="#FAFBF8" />
                {/* Yellow Hardhat */}
                <path d="M3 8C3 4.2 6.1 1.8 10 1.8C13.9 1.8 17 4.2 17 8H3Z" fill="#F9B000" />
                {/* Torso */}
                <path d="M3 35C3 24 6 20 10 20C14 20 17 24 17 35H3Z" fill="#FAFBF8" />
                {/* Wrench */}
                <path
                  d="M18 24L26 18M26 18L30 22M26 18L23 15"
                  stroke="#F9B000"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </motion.g>

              {/* Right Worker */}
              <motion.g
                transform="translate(108, 86)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  transition: { delay: 1.15, type: 'spring', stiffness: 380, damping: 20 },
                }}
              >
                <circle cx="10" cy="8" r="7" fill="#FAFBF8" />
                {/* Painter Cap */}
                <path d="M3 7C5 4 11 3 17 7L19 10H3V7Z" fill="#F9B000" />
                {/* Torso */}
                <path d="M3 37C3 25 6 22 10 22C14 22 17 25 17 37H3Z" fill="#FAFBF8" />
              </motion.g>

              {/* Step 3: Golden hand swoops up from below and cradles the house */}
              <motion.path
                d="M20 148C30 130 55 125 80 130C105 135 120 152 145 142C155 137 160 127 165 119C167.5 116.5 171 118 170.5 121C167 135 155 162 135 168C110 175 75 173 50 164C37 160 22 153 20 148Z"
                fill="#F9B000"
                initial={{ y: 70, opacity: 0, scale: 0.8 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  transition: {
                    delay: 1.35,
                    type: 'spring',
                    stiffness: 240,
                    damping: 22,
                  },
                }}
              />
              <motion.path
                d="M130 145C138 138 148 134 156 136"
                stroke="#B88200"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 1.55 } }}
              />
            </svg>
          </div>

          {/* Step 4: The "HomeCrew" text fades and slides up letter by letter */}
          <div className="flex items-center justify-center space-x-0.5 mt-2 overflow-hidden">
            {letters.map((char, index) => {
              const isCrew = index >= 4;
              return (
                <motion.span
                  key={index}
                  className={`text-4xl md:text-5xl font-heading font-extrabold tracking-tight ${
                    isCrew ? 'text-brand-gold' : 'text-brand-cream'
                  }`}
                  initial={{ y: 35, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: {
                      delay: 1.6 + index * 0.05,
                      type: 'spring',
                      stiffness: 300,
                      damping: 18,
                    },
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </div>

          {/* Tagline: "Professional Hands in your Services" fades in */}
          <motion.p
            className="text-xs md:text-sm font-semibold tracking-widest text-brand-gold-100 uppercase mt-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 2.1, duration: 0.4 },
            }}
          >
            Professional Hands in your Services
          </motion.p>

          {/* Hackathon Badge */}
          <motion.div
            className="flex items-center gap-2 mt-6 text-xs text-brand-green-200/80 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 2.25, duration: 0.3 } }}
          >
            <span>Powered by</span>
            <span className="font-semibold text-brand-gold">Team ShadowX Coders</span>
            <span>• Social Impact</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
