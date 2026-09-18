'use client';

import React from 'react';

// 8 Realistic Moving Head Spotlight Fixtures on Stage Floor
const SPOTLIGHTS = [
  {
    id: 1,
    left: '5%',
    bottomWidth: '22px',
    topWidth: '180px',
    height: '125vh',
    coreVar: 'var(--beam-1-core)',
    auraVar: 'var(--beam-1-aura)',
    animationClass: 'animate-spotlight-sweep-1',
    blurCore: '12px',
    blurAura: '38px',
    depth: 'midground',
  },
  {
    id: 2,
    left: '18%',
    bottomWidth: '28px',
    topWidth: '250px',
    height: '135vh',
    coreVar: 'var(--beam-2-core)',
    auraVar: 'var(--beam-2-aura)',
    animationClass: 'animate-spotlight-sweep-2',
    blurCore: '16px',
    blurAura: '48px',
    depth: 'background',
  },
  {
    id: 3,
    left: '30%',
    bottomWidth: '18px',
    topWidth: '140px',
    height: '115vh',
    coreVar: 'var(--beam-3-core)',
    auraVar: 'var(--beam-3-aura)',
    animationClass: 'animate-spotlight-sweep-3',
    blurCore: '10px',
    blurAura: '30px',
    depth: 'foreground',
  },
  {
    id: 4,
    left: '44%',
    bottomWidth: '24px',
    topWidth: '210px',
    height: '130vh',
    coreVar: 'var(--beam-4-core)',
    auraVar: 'var(--beam-4-aura)',
    animationClass: 'animate-spotlight-sweep-4',
    blurCore: '14px',
    blurAura: '42px',
    depth: 'midground',
  },
  {
    id: 5,
    left: '56%',
    bottomWidth: '24px',
    topWidth: '220px',
    height: '130vh',
    coreVar: 'var(--beam-5-core)',
    auraVar: 'var(--beam-5-aura)',
    animationClass: 'animate-spotlight-sweep-5',
    blurCore: '14px',
    blurAura: '44px',
    depth: 'midground',
  },
  {
    id: 6,
    left: '68%',
    bottomWidth: '18px',
    topWidth: '150px',
    height: '115vh',
    coreVar: 'var(--beam-6-core)',
    auraVar: 'var(--beam-6-aura)',
    animationClass: 'animate-spotlight-sweep-6',
    blurCore: '10px',
    blurAura: '32px',
    depth: 'foreground',
  },
  {
    id: 7,
    left: '80%',
    bottomWidth: '28px',
    topWidth: '260px',
    height: '135vh',
    coreVar: 'var(--beam-7-core)',
    auraVar: 'var(--beam-7-aura)',
    animationClass: 'animate-spotlight-sweep-7',
    blurCore: '16px',
    blurAura: '50px',
    depth: 'background',
  },
  {
    id: 8,
    left: '92%',
    bottomWidth: '22px',
    topWidth: '190px',
    height: '125vh',
    coreVar: 'var(--beam-8-core)',
    auraVar: 'var(--beam-8-aura)',
    animationClass: 'animate-spotlight-sweep-8',
    blurCore: '12px',
    blurAura: '38px',
    depth: 'midground',
  },
];

export default function ConcertLightBeams() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-40 select-none"
      aria-hidden="true"
    >
      {/* Stage Base Atmospheric Haze Glows */}
      <div
        className="absolute -bottom-32 -left-32 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none transition-colors duration-700 opacity-60"
        style={{
          background: 'radial-gradient(circle, var(--stage-haze-1) 0%, transparent 70%)',
          animation: 'stagePulseGlow 9s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[750px] h-[450px] rounded-full blur-[130px] pointer-events-none transition-colors duration-700 opacity-50"
        style={{
          background: 'radial-gradient(circle, var(--stage-haze-2) 0%, transparent 70%)',
          animation: 'stagePulseGlow 13s ease-in-out infinite alternate-reverse',
        }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none transition-colors duration-700 opacity-60"
        style={{
          background: 'radial-gradient(circle, var(--stage-haze-1) 0%, transparent 70%)',
          animation: 'stagePulseGlow 11s ease-in-out infinite alternate',
        }}
      />

      {/* Desktop Spotlight Fixtures (8 Beams in Front Overlay Layer) */}
      <div className="hidden md:block absolute inset-0">
        {SPOTLIGHTS.map((spotlight) => (
          <div
            key={spotlight.id}
            className={`absolute bottom-0 pointer-events-none ${spotlight.animationClass}`}
            style={{
              left: spotlight.left,
              transformOrigin: 'bottom center',
              willChange: 'transform, opacity',
            }}
          >
            {/* Spotlight Base Fixture Lens Dot */}
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full blur-[2px] z-20"
              style={{
                background: spotlight.coreVar,
                boxShadow: `0 0 18px 6px ${spotlight.coreVar}`,
              }}
            />

            {/* Outer Soft Transparent Aura Cone */}
            <div
              className="absolute bottom-0 -translate-x-1/2 transition-colors duration-700"
              style={{
                width: spotlight.topWidth,
                height: spotlight.height,
                background: `linear-gradient(to top, ${spotlight.auraVar} 0%, rgba(0, 0, 0, 0) 85%)`,
                filter: `blur(${spotlight.blurAura})`,
                clipPath: 'polygon(42% 100%, 58% 100%, 100% 0%, 0% 0%)',
                mixBlendMode: 'screen',
              }}
            />

            {/* Inner Sharper Bright Core Cone */}
            <div
              className="absolute bottom-0 -translate-x-1/2 transition-colors duration-700 z-10"
              style={{
                width: `calc(${spotlight.topWidth} * 0.45)`,
                height: spotlight.height,
                background: `linear-gradient(to top, ${spotlight.coreVar} 0%, ${spotlight.auraVar} 50%, transparent 95%)`,
                filter: `blur(${spotlight.blurCore})`,
                clipPath: 'polygon(45% 100%, 55% 100%, 85% 0%, 15% 0%)',
                mixBlendMode: 'screen',
              }}
            />
          </div>
        ))}
      </div>

      {/* Mobile & Tablet Optimized Spotlight Fixtures (3-4 Beams) */}
      <div className="md:hidden absolute inset-0">
        {/* Mobile Spotlight 1 */}
        <div
          className="absolute bottom-0 left-[15%] pointer-events-none animate-spotlight-sweep-mobile-1"
          style={{ transformOrigin: 'bottom center', willChange: 'transform, opacity' }}
        >
          <div
            className="absolute bottom-0 -translate-x-1/2 w-[140px] h-[100vh] transition-colors duration-700"
            style={{
              background: 'linear-gradient(to top, var(--beam-1-core) 0%, transparent 80%)',
              filter: 'blur(25px)',
              clipPath: 'polygon(42% 100%, 58% 100%, 100% 0%, 0% 0%)',
              mixBlendMode: 'screen',
            }}
          />
        </div>

        {/* Mobile Spotlight 2 */}
        <div
          className="absolute bottom-0 left-[50%] pointer-events-none animate-spotlight-sweep-mobile-2"
          style={{ transformOrigin: 'bottom center', willChange: 'transform, opacity' }}
        >
          <div
            className="absolute bottom-0 -translate-x-1/2 w-[160px] h-[105vh] transition-colors duration-700"
            style={{
              background: 'linear-gradient(to top, var(--beam-4-core) 0%, transparent 80%)',
              filter: 'blur(28px)',
              clipPath: 'polygon(42% 100%, 58% 100%, 100% 0%, 0% 0%)',
              mixBlendMode: 'screen',
            }}
          />
        </div>

        {/* Mobile Spotlight 3 */}
        <div
          className="absolute bottom-0 left-[85%] pointer-events-none animate-spotlight-sweep-mobile-3"
          style={{ transformOrigin: 'bottom center', willChange: 'transform, opacity' }}
        >
          <div
            className="absolute bottom-0 -translate-x-1/2 w-[140px] h-[100vh] transition-colors duration-700"
            style={{
              background: 'linear-gradient(to top, var(--beam-7-core) 0%, transparent 80%)',
              filter: 'blur(25px)',
              clipPath: 'polygon(42% 100%, 58% 100%, 100% 0%, 0% 0%)',
              mixBlendMode: 'screen',
            }}
          />
        </div>
      </div>
    </div>
  );
}
