'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Top Ceiling Truss Spotlights (Shooting Downwards)
const TOP_SPOTLIGHTS = [
  {
    id: 't1',
    left: '6%',
    topWidth: '300px',
    height: '140vh',
    coreVar: 'var(--beam-1-core)',
    auraVar: 'var(--beam-1-aura)',
    animationClass: 'animate-spotlight-sweep-1',
    blurCore: '14px',
    blurAura: '46px',
  },
  {
    id: 't2',
    left: '22%',
    topWidth: '340px',
    height: '150vh',
    coreVar: 'var(--beam-2-core)',
    auraVar: 'var(--beam-2-aura)',
    animationClass: 'animate-spotlight-sweep-3',
    blurCore: '16px',
    blurAura: '52px',
  },
  {
    id: 't3',
    left: '38%',
    topWidth: '320px',
    height: '145vh',
    coreVar: 'var(--beam-3-core)',
    auraVar: 'var(--beam-3-aura)',
    animationClass: 'animate-spotlight-sweep-5',
    blurCore: '14px',
    blurAura: '48px',
  },
  {
    id: 't4',
    left: '54%',
    topWidth: '330px',
    height: '145vh',
    coreVar: 'var(--beam-4-core)',
    auraVar: 'var(--beam-4-aura)',
    animationClass: 'animate-spotlight-sweep-2',
    blurCore: '14px',
    blurAura: '48px',
  },
  {
    id: 't5',
    left: '70%',
    topWidth: '350px',
    height: '150vh',
    coreVar: 'var(--beam-5-core)',
    auraVar: 'var(--beam-5-aura)',
    animationClass: 'animate-spotlight-sweep-4',
    blurCore: '16px',
    blurAura: '54px',
  },
  {
    id: 't6',
    left: '86%',
    topWidth: '310px',
    height: '140vh',
    coreVar: 'var(--beam-6-core)',
    auraVar: 'var(--beam-6-aura)',
    animationClass: 'animate-spotlight-sweep-6',
    blurCore: '14px',
    blurAura: '46px',
  },
];

// Bottom Stage Floor Spotlights (Shooting Upwards)
const BOTTOM_SPOTLIGHTS = [
  {
    id: 'b1',
    left: '4%',
    topWidth: '280px',
    height: '150vh',
    coreVar: 'var(--beam-1-core)',
    auraVar: 'var(--beam-1-aura)',
    animationClass: 'animate-spotlight-sweep-1',
    blurCore: '14px',
    blurAura: '48px',
  },
  {
    id: 'b2',
    left: '18%',
    topWidth: '340px',
    height: '160vh',
    coreVar: 'var(--beam-2-core)',
    auraVar: 'var(--beam-2-aura)',
    animationClass: 'animate-spotlight-sweep-2',
    blurCore: '18px',
    blurAura: '58px',
  },
  {
    id: 'b3',
    left: '32%',
    topWidth: '280px',
    height: '145vh',
    coreVar: 'var(--beam-3-core)',
    auraVar: 'var(--beam-3-aura)',
    animationClass: 'animate-spotlight-sweep-3',
    blurCore: '12px',
    blurAura: '42px',
  },
  {
    id: 'b4',
    left: '46%',
    topWidth: '330px',
    height: '155vh',
    coreVar: 'var(--beam-4-core)',
    auraVar: 'var(--beam-4-aura)',
    animationClass: 'animate-spotlight-sweep-4',
    blurCore: '16px',
    blurAura: '52px',
  },
  {
    id: 'b5',
    left: '60%',
    topWidth: '330px',
    height: '155vh',
    coreVar: 'var(--beam-5-core)',
    auraVar: 'var(--beam-5-aura)',
    animationClass: 'animate-spotlight-sweep-5',
    blurCore: '16px',
    blurAura: '54px',
  },
  {
    id: 'b6',
    left: '74%',
    topWidth: '290px',
    height: '145vh',
    coreVar: 'var(--beam-6-core)',
    auraVar: 'var(--beam-6-aura)',
    animationClass: 'animate-spotlight-sweep-6',
    blurCore: '12px',
    blurAura: '44px',
  },
  {
    id: 'b7',
    left: '88%',
    topWidth: '350px',
    height: '160vh',
    coreVar: 'var(--beam-7-core)',
    auraVar: 'var(--beam-7-aura)',
    animationClass: 'animate-spotlight-sweep-7',
    blurCore: '18px',
    blurAura: '60px',
  },
];

export default function ConcertLightBeams() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none opacity-100"
      aria-hidden="true"
    >
      {/* Stage Atmospheric Haze Glows at Top and Bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1.5 }}
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full blur-[140px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--stage-haze-1) 0%, transparent 70%)',
          animation: 'stagePulseGlow 10s ease-in-out infinite alternate',
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full blur-[140px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--stage-haze-2) 0%, transparent 70%)',
          animation: 'stagePulseGlow 12s ease-in-out infinite alternate-reverse',
        }}
      />

      {/* 1. TOP CEILING TRUSS LIGHT BEAMS (Shooting Downwards across entire website top) */}
      <div className="hidden md:block absolute inset-0 pointer-events-none">
        {TOP_SPOTLIGHTS.map((spotlight, i) => (
          <motion.div
            key={spotlight.id}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{
              duration: 1.5,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              left: spotlight.left,
              top: 0,
              transformOrigin: 'top center',
            }}
            className="absolute pointer-events-none"
          >
            <div
              className={`absolute top-0 pointer-events-none ${spotlight.animationClass}`}
              style={{
                transformOrigin: 'top center',
                willChange: 'transform, opacity',
              }}
            >
              {/* Top Lens Dot */}
              <div
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full blur-[2px] z-20"
                style={{
                  background: spotlight.coreVar,
                  boxShadow: `0 0 20px 8px ${spotlight.coreVar}`,
                }}
              />
              {/* Outer Beam Cone Downwards */}
              <div
                className="absolute top-0 -translate-x-1/2 transition-colors duration-700"
                style={{
                  width: spotlight.topWidth,
                  height: spotlight.height,
                  background: `linear-gradient(to bottom, ${spotlight.auraVar} 0%, rgba(0, 0, 0, 0) 90%)`,
                  filter: `blur(${spotlight.blurAura})`,
                  clipPath: 'polygon(0% 100%, 100% 100%, 58% 0%, 42% 0%)',
                  mixBlendMode: 'var(--beam-blend-mode, normal)',
                }}
              />
              {/* Inner Core Cone Downwards */}
              <div
                className="absolute top-0 -translate-x-1/2 transition-colors duration-700 z-10"
                style={{
                  width: `calc(${spotlight.topWidth} * 0.45)`,
                  height: spotlight.height,
                  background: `linear-gradient(to bottom, ${spotlight.coreVar} 0%, ${spotlight.auraVar} 50%, transparent 98%)`,
                  filter: `blur(${spotlight.blurCore})`,
                  clipPath: 'polygon(12% 100%, 88% 100%, 55% 0%, 45% 0%)',
                  mixBlendMode: 'var(--beam-blend-mode, normal)',
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2. BOTTOM STAGE FLOOR LIGHT BEAMS (Shooting Upwards across entire website bottom) */}
      <div className="hidden md:block absolute inset-0 pointer-events-none">
        {BOTTOM_SPOTLIGHTS.map((spotlight, i) => (
          <motion.div
            key={spotlight.id}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{
              duration: 1.5,
              delay: i * 0.08 + 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              left: spotlight.left,
              bottom: 0,
              transformOrigin: 'bottom center',
            }}
            className="absolute pointer-events-none"
          >
            <div
              className={`absolute bottom-0 pointer-events-none ${spotlight.animationClass}`}
              style={{
                transformOrigin: 'bottom center',
                willChange: 'transform, opacity',
              }}
            >
              {/* Bottom Lens Dot */}
              <div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full blur-[2px] z-20"
                style={{
                  background: spotlight.coreVar,
                  boxShadow: `0 0 20px 8px ${spotlight.coreVar}`,
                }}
              />
              {/* Outer Beam Cone Upwards */}
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
              {/* Inner Core Cone Upwards */}
              <div
                className="absolute bottom-0 -translate-x-1/2 transition-colors duration-700 z-10"
                style={{
                  width: `calc(${spotlight.topWidth} * 0.45)`,
                  height: spotlight.height,
                  background: `linear-gradient(to top, ${spotlight.coreVar} 0%, ${spotlight.auraVar} 50%, transparent 98%)`,
                  filter: `blur(${spotlight.blurCore})`,
                  clipPath: 'polygon(44% 100%, 56% 100%, 88% 0%, 12% 0%)',
                  mixBlendMode: 'var(--beam-blend-mode, normal)',
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. MOBILE & TABLET FULL VIEWPORT LIGHT BEAMS */}
      <div className="md:hidden absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4 }}
          className="absolute inset-0 pointer-events-none animate-spotlight-sweep-mobile-1"
          style={{ transformOrigin: 'center center' }}
        >
          <div
            className="absolute top-0 left-1/4 w-[240px] h-[100vh] -translate-x-1/2 transition-colors duration-700"
            style={{
              background: 'linear-gradient(to bottom, var(--beam-1-core) 0%, transparent 85%)',
              filter: 'blur(35px)',
              mixBlendMode: 'var(--beam-blend-mode, normal)',
            }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-[240px] h-[100vh] translate-x-1/2 transition-colors duration-700"
            style={{
              background: 'linear-gradient(to top, var(--beam-4-core) 0%, transparent 85%)',
              filter: 'blur(35px)',
              mixBlendMode: 'var(--beam-blend-mode, normal)',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
