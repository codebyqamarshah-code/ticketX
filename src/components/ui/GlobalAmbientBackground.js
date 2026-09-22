'use client';

import React from 'react';
import { motion } from 'framer-motion';

// 8 Moving Head Stage Floor Spotlights Shooting EXCLUSIVELY from Bottom to Top (Spacious Layout)
const SPOTLIGHTS = [
  { id: 1, left: '4%', bottomWidth: '26px', topWidth: '350px', height: '230vh', coreVar: 'var(--beam-1-core)', auraVar: 'var(--beam-1-aura)', animationClass: 'animate-spotlight-sweep-1', blurCore: '14px', blurAura: '54px' },
  { id: 2, left: '17%', bottomWidth: '32px', topWidth: '420px', height: '240vh', coreVar: 'var(--beam-2-core)', auraVar: 'var(--beam-2-aura)', animationClass: 'animate-spotlight-sweep-2', blurCore: '18px', blurAura: '62px' },
  { id: 3, left: '30%', bottomWidth: '22px', topWidth: '330px', height: '225vh', coreVar: 'var(--beam-3-core)', auraVar: 'var(--beam-3-aura)', animationClass: 'animate-spotlight-sweep-3', blurCore: '12px', blurAura: '46px' },
  { id: 4, left: '43%', bottomWidth: '28px', topWidth: '390px', height: '235vh', coreVar: 'var(--beam-4-core)', auraVar: 'var(--beam-4-aura)', animationClass: 'animate-spotlight-sweep-4', blurCore: '16px', blurAura: '56px' },
  { id: 5, left: '56%', bottomWidth: '28px', topWidth: '390px', height: '235vh', coreVar: 'var(--beam-5-core)', auraVar: 'var(--beam-5-aura)', animationClass: 'animate-spotlight-sweep-5', blurCore: '16px', blurAura: '56px' },
  { id: 6, left: '69%', bottomWidth: '22px', topWidth: '330px', height: '225vh', coreVar: 'var(--beam-6-core)', auraVar: 'var(--beam-6-aura)', animationClass: 'animate-spotlight-sweep-6', blurCore: '12px', blurAura: '46px' },
  { id: 7, left: '82%', bottomWidth: '32px', topWidth: '420px', height: '240vh', coreVar: 'var(--beam-7-core)', auraVar: 'var(--beam-7-aura)', animationClass: 'animate-spotlight-sweep-7', blurCore: '18px', blurAura: '62px' },
  { id: 8, left: '95%', bottomWidth: '26px', topWidth: '350px', height: '230vh', coreVar: 'var(--beam-8-core)', auraVar: 'var(--beam-8-aura)', animationClass: 'animate-spotlight-sweep-8', blurCore: '14px', blurAura: '54px' },
];

export default function GlobalAmbientBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none opacity-100"
      aria-hidden="true"
    >
      {/* 1. Base Stage Floor & Vertical Haze Orbs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        className="absolute -bottom-32 -left-32 w-[900px] h-[650px] rounded-full blur-[140px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--stage-haze-1) 0%, transparent 70%)',
          animation: 'stagePulseGlow 14s ease-in-out infinite alternate',
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut', delay: 0.2 }}
        className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[1200px] h-[750px] rounded-full blur-[160px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--stage-haze-2) 0%, transparent 70%)',
          animation: 'stagePulseGlow 16s ease-in-out infinite alternate-reverse',
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut', delay: 0.1 }}
        className="absolute -bottom-32 -right-32 w-[900px] h-[650px] rounded-full blur-[140px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--stage-haze-1) 0%, transparent 70%)',
          animation: 'stagePulseGlow 14s ease-in-out infinite alternate',
        }}
      />

      {/* Mid-screen Ambient Glow Orb for upper viewport coverage */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.75, scale: 1 }}
        transition={{ duration: 2.0, ease: 'easeOut', delay: 0.3 }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] rounded-full blur-[170px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--stage-haze-1) 0%, transparent 75%)',
          animation: 'stagePulseGlow 18s ease-in-out infinite alternate-reverse',
        }}
      />

      {/* 2. Desktop Floor Moving Head Spotlights (Igniting & Shooting ONLY from Bottom to Top) */}
      <div className="hidden md:block absolute inset-0 pointer-events-none">
        {SPOTLIGHTS.map((spotlight, index) => (
          <motion.div
            key={spotlight.id}
            initial={{ scaleY: 0, opacity: 0, y: 140 }}
            animate={{ scaleY: 1, opacity: 1, y: 0 }}
            transition={{
              duration: 1.8,
              delay: index * 0.09,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              left: spotlight.left,
              bottom: 0,
              transformOrigin: 'bottom center',
            }}
            className="absolute bottom-0 pointer-events-none"
          >
            {/* Sweeping Spotlight Fixture Cone (Shooting Upwards) */}
            <div
              className={`absolute bottom-0 pointer-events-none ${spotlight.animationClass}`}
              style={{
                transformOrigin: 'bottom center',
                willChange: 'transform, opacity',
              }}
            >
              {/* Floor Lens Glow Dot */}
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full blur-[2px] z-20"
                style={{
                  background: spotlight.coreVar,
                  boxShadow: `0 0 28px 12px ${spotlight.coreVar}`,
                }}
              />

              {/* Upward Outer Cone (Reaches all the way to top) */}
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

              {/* Upward Inner Core Beam */}
              <div
                className="absolute bottom-0 -translate-x-1/2 transition-colors duration-700 z-10"
                style={{
                  width: `calc(${spotlight.topWidth} * 0.52)`,
                  height: spotlight.height,
                  background: `linear-gradient(to top, ${spotlight.coreVar} 0%, ${spotlight.auraVar} 60%, transparent 98%)`,
                  filter: `blur(${spotlight.blurCore})`,
                  clipPath: 'polygon(44% 100%, 56% 100%, 88% 0%, 12% 0%)',
                  mixBlendMode: 'var(--beam-blend-mode, normal)',
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. Mobile & Tablet Floor Beams (Shooting ONLY from Bottom to Top) */}
      <div className="md:hidden absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ scaleY: 0, opacity: 0, y: 120 }}
          animate={{ scaleY: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-[15%] pointer-events-none animate-spotlight-sweep-mobile-1"
          style={{ transformOrigin: 'bottom center' }}
        >
          <div
            className="absolute bottom-0 -translate-x-1/2 w-[220px] h-[170vh] transition-colors duration-700"
            style={{
              background: 'linear-gradient(to top, var(--beam-1-core) 0%, transparent 88%)',
              filter: 'blur(32px)',
              clipPath: 'polygon(42% 100%, 58% 100%, 100% 0%, 0% 0%)',
              mixBlendMode: 'var(--beam-blend-mode, normal)',
            }}
          />
        </motion.div>

        <motion.div
          initial={{ scaleY: 0, opacity: 0, y: 120 }}
          animate={{ scaleY: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-[50%] pointer-events-none animate-spotlight-sweep-mobile-2"
          style={{ transformOrigin: 'bottom center' }}
        >
          <div
            className="absolute bottom-0 -translate-x-1/2 w-[240px] h-[180vh] transition-colors duration-700"
            style={{
              background: 'linear-gradient(to top, var(--beam-4-core) 0%, transparent 88%)',
              filter: 'blur(34px)',
              clipPath: 'polygon(42% 100%, 58% 100%, 100% 0%, 0% 0%)',
              mixBlendMode: 'var(--beam-blend-mode, normal)',
            }}
          />
        </motion.div>

        <motion.div
          initial={{ scaleY: 0, opacity: 0, y: 120 }}
          animate={{ scaleY: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-[85%] pointer-events-none animate-spotlight-sweep-mobile-3"
          style={{ transformOrigin: 'bottom center' }}
        >
          <div
            className="absolute bottom-0 -translate-x-1/2 w-[220px] h-[170vh] transition-colors duration-700"
            style={{
              background: 'linear-gradient(to top, var(--beam-7-core) 0%, transparent 88%)',
              filter: 'blur(32px)',
              clipPath: 'polygon(42% 100%, 58% 100%, 100% 0%, 0% 0%)',
              mixBlendMode: 'var(--beam-blend-mode, normal)',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
