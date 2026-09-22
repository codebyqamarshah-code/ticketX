'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Bottom Floor Spotlights (Shooting UPWARDS)
const BOTTOM_SPOTLIGHTS = [
  { id: 1, left: '5%', bottomWidth: '24px', topWidth: '320px', height: '180vh', coreVar: 'var(--beam-1-core)', auraVar: 'var(--beam-1-aura)', animationClass: 'animate-spotlight-sweep-1', blurCore: '14px', blurAura: '52px' },
  { id: 2, left: '19%', bottomWidth: '30px', topWidth: '380px', height: '190vh', coreVar: 'var(--beam-2-core)', auraVar: 'var(--beam-2-aura)', animationClass: 'animate-spotlight-sweep-2', blurCore: '18px', blurAura: '60px' },
  { id: 3, left: '33%', bottomWidth: '20px', topWidth: '300px', height: '175vh', coreVar: 'var(--beam-3-core)', auraVar: 'var(--beam-3-aura)', animationClass: 'animate-spotlight-sweep-3', blurCore: '12px', blurAura: '44px' },
  { id: 4, left: '47%', bottomWidth: '26px', topWidth: '360px', height: '185vh', coreVar: 'var(--beam-4-core)', auraVar: 'var(--beam-4-aura)', animationClass: 'animate-spotlight-sweep-4', blurCore: '16px', blurAura: '54px' },
  { id: 5, left: '61%', bottomWidth: '26px', topWidth: '360px', height: '185vh', coreVar: 'var(--beam-5-core)', auraVar: 'var(--beam-5-aura)', animationClass: 'animate-spotlight-sweep-5', blurCore: '16px', blurAura: '56px' },
  { id: 6, left: '75%', bottomWidth: '20px', topWidth: '310px', height: '175vh', coreVar: 'var(--beam-6-core)', auraVar: 'var(--beam-6-aura)', animationClass: 'animate-spotlight-sweep-6', blurCore: '12px', blurAura: '46px' },
  { id: 7, left: '89%', bottomWidth: '30px', topWidth: '390px', height: '190vh', coreVar: 'var(--beam-7-core)', auraVar: 'var(--beam-7-aura)', animationClass: 'animate-spotlight-sweep-7', blurCore: '18px', blurAura: '62px' },
];

// Top Rig Spotlights (Shooting DOWNWARDS)
const TOP_SPOTLIGHTS = [
  { id: 101, left: '10%', topWidth: '280px', height: '180vh', coreVar: 'var(--beam-3-core)', auraVar: 'var(--beam-3-aura)', animationClass: 'animate-spotlight-top-1', blurCore: '14px', blurAura: '50px' },
  { id: 102, left: '26%', topWidth: '340px', height: '185vh', coreVar: 'var(--beam-5-core)', auraVar: 'var(--beam-5-aura)', animationClass: 'animate-spotlight-top-2', blurCore: '16px', blurAura: '56px' },
  { id: 103, left: '40%', topWidth: '320px', height: '175vh', coreVar: 'var(--beam-1-core)', auraVar: 'var(--beam-1-aura)', animationClass: 'animate-spotlight-top-3', blurCore: '14px', blurAura: '48px' },
  { id: 104, left: '54%', topWidth: '350px', height: '190vh', coreVar: 'var(--beam-7-core)', auraVar: 'var(--beam-7-aura)', animationClass: 'animate-spotlight-top-4', blurCore: '18px', blurAura: '58px' },
  { id: 105, left: '70%', topWidth: '310px', height: '180vh', coreVar: 'var(--beam-2-core)', auraVar: 'var(--beam-2-aura)', animationClass: 'animate-spotlight-top-5', blurCore: '14px', blurAura: '46px' },
  { id: 106, left: '84%', topWidth: '330px', height: '185vh', coreVar: 'var(--beam-4-core)', auraVar: 'var(--beam-4-aura)', animationClass: 'animate-spotlight-top-6', blurCore: '16px', blurAura: '52px' },
];

export default function GlobalAmbientBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none opacity-100"
      aria-hidden="true"
    >
      {/* 1. Multi-level Atmospheric Stage Haze Glows across entire vertical space */}
      {/* Top Section Haze */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.85, scale: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        className="absolute -top-32 -left-32 w-[800px] h-[600px] rounded-full blur-[140px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--stage-haze-1) 0%, transparent 70%)',
          animation: 'stagePulseGlow 14s ease-in-out infinite alternate',
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.85, scale: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut', delay: 0.2 }}
        className="absolute -top-32 -right-32 w-[800px] h-[600px] rounded-full blur-[140px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--stage-haze-2) 0%, transparent 70%)',
          animation: 'stagePulseGlow 16s ease-in-out infinite alternate-reverse',
        }}
      />

      {/* Mid-Page Stage Haze */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.75, scale: 1 }}
        transition={{ duration: 2.2, ease: 'easeOut', delay: 0.3 }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[1000px] h-[650px] rounded-full blur-[160px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--stage-haze-1) 0%, transparent 75%)',
          animation: 'stagePulseGlow 18s ease-in-out infinite alternate',
        }}
      />

      {/* Bottom Section Stage Haze */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.85, scale: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[1050px] h-[650px] rounded-full blur-[150px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--stage-haze-2) 0%, transparent 70%)',
          animation: 'stagePulseGlow 15s ease-in-out infinite alternate-reverse',
        }}
      />

      {/* 2. Top Rig Moving Head Spotlights (Shooting DOWNWARDS) */}
      <div className="hidden md:block absolute inset-0 pointer-events-none">
        {TOP_SPOTLIGHTS.map((spotlight) => (
          <motion.div
            key={spotlight.id}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{
              duration: 1.6,
              delay: (spotlight.id - 100) * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              left: spotlight.left,
              top: 0,
              transformOrigin: 'top center',
            }}
            className="absolute top-0 pointer-events-none"
          >
            <div
              className={`absolute top-0 pointer-events-none ${spotlight.animationClass}`}
              style={{
                transformOrigin: 'top center',
                willChange: 'transform, opacity',
              }}
            >
              {/* Lens Fixture Dot */}
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full blur-[2px] z-20"
                style={{
                  background: spotlight.coreVar,
                  boxShadow: `0 0 24px 10px ${spotlight.coreVar}`,
                }}
              />

              {/* Downward Outer Cone */}
              <div
                className="absolute top-0 -translate-x-1/2 transition-colors duration-700"
                style={{
                  width: spotlight.topWidth,
                  height: spotlight.height,
                  background: `linear-gradient(to bottom, ${spotlight.auraVar} 0%, rgba(0, 0, 0, 0) 90%)`,
                  filter: `blur(${spotlight.blurAura})`,
                  clipPath: 'polygon(0% 100%, 100% 100%, 60% 0%, 40% 0%)',
                  mixBlendMode: 'var(--beam-blend-mode, normal)',
                }}
              />

              {/* Downward Inner Core */}
              <div
                className="absolute top-0 -translate-x-1/2 transition-colors duration-700 z-10"
                style={{
                  width: `calc(${spotlight.topWidth} * 0.48)`,
                  height: spotlight.height,
                  background: `linear-gradient(to bottom, ${spotlight.coreVar} 0%, ${spotlight.auraVar} 55%, transparent 98%)`,
                  filter: `blur(${spotlight.blurCore})`,
                  clipPath: 'polygon(12% 100%, 88% 100%, 56% 0%, 44% 0%)',
                  mixBlendMode: 'var(--beam-blend-mode, normal)',
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. Bottom Floor Moving Head Spotlights (Shooting UPWARDS) */}
      <div className="hidden md:block absolute inset-0 pointer-events-none">
        {BOTTOM_SPOTLIGHTS.map((spotlight) => (
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
            <div
              className={`absolute bottom-0 pointer-events-none ${spotlight.animationClass}`}
              style={{
                transformOrigin: 'bottom center',
                willChange: 'transform, opacity',
              }}
            >
              {/* Lens Base Dot */}
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full blur-[2px] z-20"
                style={{
                  background: spotlight.coreVar,
                  boxShadow: `0 0 24px 10px ${spotlight.coreVar}`,
                }}
              />

              {/* Upward Outer Cone */}
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

              {/* Upward Inner Core */}
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

      {/* 4. Mobile & Tablet Dual-Directional Ambient Beams */}
      <div className="md:hidden absolute inset-0 pointer-events-none">
        {/* Mobile Top Beam */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 left-[35%] pointer-events-none animate-spotlight-sweep-mobile-1"
          style={{ transformOrigin: 'top center' }}
        >
          <div
            className="absolute top-0 -translate-x-1/2 w-[220px] h-[150vh] transition-colors duration-700"
            style={{
              background: 'linear-gradient(to bottom, var(--beam-3-core) 0%, transparent 85%)',
              filter: 'blur(32px)',
              clipPath: 'polygon(0% 100%, 100% 100%, 58% 0%, 42% 0%)',
              mixBlendMode: 'var(--beam-blend-mode, normal)',
            }}
          />
        </motion.div>

        {/* Mobile Bottom Beams */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-[20%] pointer-events-none animate-spotlight-sweep-mobile-2"
          style={{ transformOrigin: 'bottom center' }}
        >
          <div
            className="absolute bottom-0 -translate-x-1/2 w-[200px] h-[160vh] transition-colors duration-700"
            style={{
              background: 'linear-gradient(to top, var(--beam-1-core) 0%, transparent 85%)',
              filter: 'blur(30px)',
              clipPath: 'polygon(42% 100%, 58% 100%, 100% 0%, 0% 0%)',
              mixBlendMode: 'var(--beam-blend-mode, normal)',
            }}
          />
        </motion.div>

        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-[75%] pointer-events-none animate-spotlight-sweep-mobile-3"
          style={{ transformOrigin: 'bottom center' }}
        >
          <div
            className="absolute bottom-0 -translate-x-1/2 w-[200px] h-[150vh] transition-colors duration-700"
            style={{
              background: 'linear-gradient(to top, var(--beam-7-core) 0%, transparent 85%)',
              filter: 'blur(30px)',
              clipPath: 'polygon(42% 100%, 58% 100%, 100% 0%, 0% 0%)',
              mixBlendMode: 'var(--beam-blend-mode, normal)',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
