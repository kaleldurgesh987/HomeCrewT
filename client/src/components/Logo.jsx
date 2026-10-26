import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const Logo = ({
  variant = 'full', // 'full' | 'nav' | 'icon' | 'splash'
  interactive = true,
  className = '',
  size = 'normal', // 'small' | 'normal' | 'large'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Height mappings
  const heightMap = {
    small: 'h-8',
    normal: 'h-11',
    large: 'h-16',
    xl: 'h-24',
  };

  const isIconOnly = variant === 'icon';

  return (
    <div
      className={`inline-flex items-center select-none cursor-pointer group ${className}`}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      role="banner"
      aria-label="HomeCrew Logo"
    >
      <svg
        viewBox={isIconOnly ? '0 0 68 68' : '0 0 310 70'}
        className={`${heightMap[size] || 'h-11'} w-auto transition-transform duration-200`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="windowGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF275" stopOpacity="1" />
            <stop offset="60%" stopColor="#F9B000" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#D99B00" stopOpacity="0.7" />
          </radialGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Brand Icon Group */}
        <g transform="translate(4, 5)">
          {/* Main House Roof & Body */}
          <motion.path
            d="M32 4L6 26H13V56H51V26H58L32 4Z"
            fill="#0B5D43"
            stroke="#FAFBF8"
            strokeWidth="2.5"
            strokeLinejoin="round"
            initial={{ strokeDasharray: 200, strokeDashoffset: 0 }}
          />

          {/* Left Worker (with hardhat and wrench) */}
          <motion.g
            transform="translate(18, 29)"
            animate={
              isHovered
                ? { y: [0, -2, 0], transition: { duration: 0.6, repeat: Infinity } }
                : { y: 0 }
            }
          >
            {/* Head */}
            <circle cx="5" cy="4" r="3.2" fill="#FAFBF8" />
            {/* Hard hat */}
            <path d="M1.5 4C1.5 2.2 3.1 1 5 1C6.9 1 8.5 2.2 8.5 4H1.5Z" fill="#F9B000" />
            {/* Torso */}
            <path d="M1.5 17C1.5 11.5 3 9.5 5 9.5C7 9.5 8.5 11.5 8.5 17H1.5Z" fill="#FAFBF8" />
            {/* Wrench symbol */}
            <path
              d="M9 11L13 8M13 8L15 10M13 8L11.5 6.5"
              stroke="#F9B000"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </motion.g>

          {/* Right Worker (with painter cap and tool) */}
          <motion.g
            transform="translate(32, 28)"
            animate={
              isHovered
                ? { y: [0, -2, 0], transition: { duration: 0.6, delay: 0.15, repeat: Infinity } }
                : { y: 0 }
            }
          >
            {/* Head */}
            <circle cx="5" cy="4" r="3.2" fill="#FAFBF8" />
            {/* Cap */}
            <path d="M1.5 3.5C2.5 2 5.5 1.5 8.5 3.5L9.5 5H1.5V3.5Z" fill="#F9B000" />
            {/* Torso */}
            <path d="M1.5 18C1.5 12 3 10.5 5 10.5C7 10.5 8.5 12 8.5 18H1.5Z" fill="#FAFBF8" />
          </motion.g>

          {/* Window in Attic - Glows yellow on hover */}
          <motion.rect
            x="27"
            y="13"
            width="10"
            height="10"
            rx="2"
            fill="url(#windowGlowGrad)"
            stroke="#FAFBF8"
            strokeWidth="1.4"
            filter={isHovered ? 'url(#softGlow)' : 'none'}
            animate={
              isHovered
                ? {
                    scale: 1.12,
                    filter: 'drop-shadow(0px 0px 8px #F9B000)',
                    transition: { duration: 0.25 },
                  }
                : {
                    scale: 1,
                    filter: 'drop-shadow(0px 0px 2px #F9B000)',
                  }
            }
          />
          <path d="M32 13V23M27 18H37" stroke="#0B5D43" strokeWidth="1.1" />

          {/* Golden Yellow Hand Cradling the House - Lifts slightly on hover */}
          <motion.path
            d="M3 50C7 43 16 41 26 43C36 45 42 51 52 47C56 45 58 41 60 38C61 37 62.5 37.5 62.2 38.8C61 44 56 54 48 56C38 58.5 24 57.5 13 54C8 52.5 4 50.8 3 50Z"
            fill="#F9B000"
            animate={
              isHovered
                ? {
                    y: -3,
                    scale: 1.02,
                    transition: { type: 'spring', stiffness: 300, damping: 15 },
                  }
                : {
                    y: 0,
                    scale: 1,
                  }
            }
          />
          {/* Thumb detail */}
          <motion.path
            d="M47 48C50 45 54 43 57 44"
            stroke="#B88200"
            strokeWidth="1.2"
            strokeLinecap="round"
            animate={isHovered ? { y: -3 } : { y: 0 }}
          />
        </g>

        {/* Text and Tagline (when not icon-only) */}
        {!isIconOnly && (
          <g transform="translate(80, 16)">
            {/* "HomeCrew" Typography */}
            <text
              x="0"
              y="28"
              fontFamily="'Poppins', sans-serif"
              fontSize="29"
              fontWeight="800"
              fill="#FAFBF8"
              letterSpacing="-0.5"
            >
              Home<tspan fill="#F9B000">Crew</tspan>
            </text>

            {/* Tagline: "Professional Hands in your Services" */}
            <text
              x="1"
              y="44"
              fontFamily="'Inter', sans-serif"
              fontSize="8.5"
              fontWeight="600"
              fill="#D6ECE3"
              letterSpacing="1.1"
              textTransform="uppercase"
            >
              Professional Hands in your Services
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default Logo;
