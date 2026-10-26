import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner = ({ size = 'md', text = 'Loading HomeCrew...' }) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-3 select-none">
      <motion.div
        className={`relative ${sizeMap[size] || sizeMap.md} flex items-center justify-center`}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.85, 1, 0.85],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          {/* House Roof & Body */}
          <path
            d="M32 8L10 26V54H54V26L32 8Z"
            fill="#0B5D43"
            stroke="#FAFBF8"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Pulsing Glowing Window */}
          <motion.rect
            x="26"
            y="24"
            width="12"
            height="12"
            rx="2"
            fill="#F9B000"
            stroke="#FAFBF8"
            strokeWidth="1.8"
            animate={{
              filter: ['drop-shadow(0px 0px 2px #F9B000)', 'drop-shadow(0px 0px 8px #F9B000)', 'drop-shadow(0px 0px 2px #F9B000)'],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
            }}
          />
          <path d="M32 24V36M26 30H38" stroke="#0B5D43" strokeWidth="1.5" />
          {/* Supportive Golden Hand Base */}
          <path
            d="M8 46C14 40 24 39 34 42C42 45 48 48 56 42C58 41 60 43 59 45C56 50 48 56 38 56C26 56 14 52 8 46Z"
            fill="#F9B000"
          />
        </svg>
      </motion.div>
      {text && (
        <p className="text-xs font-medium text-brand-green-700 tracking-wide animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
