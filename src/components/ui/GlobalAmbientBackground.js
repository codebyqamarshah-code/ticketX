'use client';

import React from 'react';
import { motion } from 'framer-motion';

// 8 Moving Head Spotlight Fixtures Positioned at Stage Floor (Shooting ONLY from Bottom to Top)
const SPOTLIGHTS = [
  {
    id: 1,
    left: '4%',
    bottomWidth: '24px',
    topWidth: '290px',
    height: '170vh',
    coreVar: 'var(--beam-1-core)',
    auraVar: 'var(--beam-1-aura)',
    animationClass: 'animate-spotlight-sweep-1',
    blurCore: '14px',
    blurAura: '48px',
  },
  {
    id: 2,
    left: '17%',
    bottomWidth: '30px',
    topWidth: '350px',
    height: '180vh',
    coreVar: 'var(--beam-2-core)',
    auraVar: 'var(--beam-2-aura)',
    animationClass: 'animate-spotlight-sweep-2',
    blurCore: '18px',
    blurAura: '58px',
  },
  {
    id: 3,
    left: '30%',
    bottomWidth: '20px',
    topWidth: '270px',
    height: '165vh',
    coreVar: 'var(--beam-3-core)',
    auraVar: 'var(--beam-3-aura)',
    animationClass: 'animate-spotlight-sweep-3',
    blurCore: '12px',
    blurAura: '40px',
  },
  {
    id: 4,
    left: '43%',
    bottomWidth: '26px',
    topWidth: '330px',
    height: '175vh',
    coreVar: 'var(--beam-4-core)',
    auraVar: 'var(--beam-4-aura)',
    animationClass: 'animate-spotlight-sweep-4',
    blurCore: '16px',
    blurAura: '52px',
  },
  {
    id: 5,
    left: '56%',
    bottomWidth: '26px',
    topWidth: '340px',
    height: '175vh',
    coreVar: 'var(--beam-5-core)',
    auraVar: 'var(--beam-5-aura)',
    animationClass: 'animate-spotlight-sweep-5',
    blurCore: '16px',
    blurAura: '54px',
  },
  {
    id: 6,
    left: '69%',
    bottomWidth: '20px',
    topWidth: '280px',
    height: '165vh',
    coreVar: 'var(--beam-6-core)',
    auraVar: 'var(--beam-6-aura)',
    animationClass: 'animate-spotlight-sweep-6',
    blurCore: '12px',
    blurAura: '42px',
  },
  {
    id: 7,
    left: '82%',
    bottomWidth: '30px',
    topWidth: '360px',
    height: '180vh',
    coreVar: 'var(--beam-7-core)',
    auraVar: 'var(--beam-7-aura)',
    animationClass: 'animate-spotlight-sweep-7',
    blurCore: '18px',
    blurAura: '60px',
  },
  {
    id: 8,
    left: '95%',
    bottomWidth: '24px',
    topWidth: '300px',
    height: '170vh',
    coreVar: 'var(--beam-8-core)',
    auraVar: 'var(--beam-8-aura)',
    animationClass: 'animate-spotlight-sweep-8',
    blurCore: '14px',
    blurAura: '48px',
  },
];

export default function GlobalAmbientBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none opacity-100"
      aria-hidden="true"
    >
      {/* Layer 1: Base Atmospheric Haze Glows at Floor & Mid-Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.85, scale: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        className="absolute -bottom-32 -left-32 w-[700px] h-[500px] rounded-full blur-[130px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--stage-haze-1) 0%, transparent 70%)',
          animation: 'stagePulseGlow 12s ease-in-out infinite alternate',
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{ duration: 2.0, ease: 'easeOut', delay: 0.2 }}
        className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[950px] h-[550px] rounded-full blur-[140px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--stage-haze-2) 0%, transparent 70%)',
          animation: 'stagePulseGlow 16s ease-in-out infinite alternate-reverse',
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.85, scale: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut', delay: 0.1 }}
        className="absolute -bottom-32 -right-32 w-[700px] h-[500px] rounded-full blur-[130px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--stage-haze-1) 0%, transparent 70%)',
          animation: 'stagePulseGlow 14s ease-in-out infinite alternate',
        }}
      />

      {/* Layer 2: Desktop Moving Head Spotlights Shooting ONLY from Bottom to Top */}
      <div className="hidden md:block absolute inset-0 pointer-events-none">
        {SPOTLIGHTS.map((spotlight) => (
          <motion.div
            key={spotlight.id}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{
              duration: 1.6,
              delay: spotlight.id * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              left: spotlight.left,
              bottom: 0,
              transformOrigin: 'bottom center',
            }}
            className="absolute bottom-0 pointer-events-none"
          >
            {/* Sweeping Moving Head Fixture (Rising from Bottom Upwards) */}
            <div
              className={`absolute bottom-0 pointer-events-none ${spotlight.animationClass}`}
              style={{
                transformOrigin: 'bottom center',
                willChange: 'transform, opacity',
              }}
            >
              {/* Spotlight Base Lens Dot */}
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full blur-[2px] z-20"
                style={{
                  background: spotlight.coreVar,
                  boxShadow: `0 0 24px 10px ${spotlight.coreVar}`,
                }}
              />

              {/* Outer Luminous Ambient Core Cone */}
              <div
                className="absolute bottom-0 -translate-x-1/2 transition-colors duration-700"
                style={{
                  width: spotlight.topWidth,
                  height: spotlight.height,
                  background: `linear-gradient(to top, ${spotlight.auraVar} 0%, rgba(0, 0, 0, 0) 90%)`,
                  filter: `blur(${spotlight.blurAura})`,
                  clipPath: 'polygon(40% 100%, 60% 100%, 100% 0%, 0% 0%)',
                  mixBlendMode: 'var(--beam-blend-mode, normal)',
                }}
              />

              {/* Inner Core Cone */}
              <div
                className="absolute bottom-0 -translate-x-1/2 transition-colors duration-700 z-10"
                style={{
                  width: `calc(${spotlight.topWidth} * 0.48)`,
                  height: spotlight.height,
                  background: `linear-gradient(to top, ${spotlight.coreVar} 0%, ${spotlight.auraVar} 55%, transparent 98%)`,
                  filter: `blur(${spotlight.blurCore})`,
                  clipPath: 'polygon(44% 100%, 56% 100%, 88% 0%, 12% 0%)',
                  mixBlendMode: 'var(--beam-blend-mode, normal)',
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Layer 3: Mobile & Tablet Ambient Beams (Shooting from Bottom to Top) */}
      <div className="md:hidden absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-[15%] pointer-events-none animate-spotlight-sweep-mobile-1"
          style={{ transformOrigin: 'bottom center' }}
        >
          <div
            className="absolute bottom-0 -translate-x-1/2 w-[180px] h-[150vh] transition-colors duration-700"
            style={{
              background: 'linear-gradient(to top, var(--beam-1-core) 0%, transparent 85%)',
              filter: 'blur(28px)',
              clipPath: 'polygon(42% 100%, 58% 100%, 100% 0%, 0% 0%)',
              mixBlendMode: 'var(--beam-blend-mode, normal)',
            }}
          />
        </motion.div>

        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-[50%] pointer-events-none animate-spotlight-sweep-mobile-2"
          style={{ transformOrigin: 'bottom center' }}
        >
          <div
            className="absolute bottom-0 -translate-x-1/2 w-[210px] h-[160vh] transition-colors duration-700"
            style={{
              background: 'linear-gradient(to top, var(--beam-4-core) 0%, transparent 85%)',
              filter: 'blur(32px)',
              clipPath: 'polygon(42% 100%, 58% 100%, 100% 0%, 0% 0%)',
              mixBlendMode: 'var(--beam-blend-mode, normal)',
            }}
          />
        </motion.div>

        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-[85%] pointer-events-none animate-spotlight-sweep-mobile-3"
          style={{ transformOrigin: 'bottom center' }}
        >
          <div
            className="absolute bottom-0 -translate-x-1/2 w-[180px] h-[150vh] transition-colors duration-700"
            style={{
              background: 'linear-gradient(to top, var(--beam-7-core) 0%, transparent 85%)',
              filter: 'blur(28px)',
              clipPath: 'polygon(42% 100%, 58% 100%, 100% 0%, 0% 0%)',
              mixBlendMode: 'var(--beam-blend-mode, normal)',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
