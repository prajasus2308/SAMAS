import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ParticleExplosionProps {
  active: boolean;
  triggerKey: string | number;
}

interface BurstParticle {
  id: number;
  targetX: number;
  targetY: number;
  rotation: number;
  scale: number;
  delay: number;
  duration: number;
  shape: 'star' | 'diamond' | 'coin' | 'spark';
  color: string;
}

const GOLD_PALETTE = ['#FFF6D6', '#F3D078', '#D4AF37', '#FFB703', '#FFE07D'];

export const ParticleExplosion: React.FC<ParticleExplosionProps> = ({
  active,
  triggerKey,
}) => {
  // Pre-compute 36 radial explosion particles with varied trajectories and shapes
  const particles = useMemo<BurstParticle[]>(() => {
    const shapes: BurstParticle['shape'][] = ['star', 'diamond', 'coin', 'spark'];
    return Array.from({ length: 36 }).map((_, idx) => {
      const angle = (idx / 36) * Math.PI * 2 + (idx % 3) * 0.14;
      const distance = 90 + (idx % 5) * 48;
      const targetX = Math.cos(angle) * distance * 1.35;
      // Bias slightly upward then arc outward
      const targetY = Math.sin(angle) * distance - 24;
      return {
        id: idx,
        targetX,
        targetY,
        rotation: (idx % 2 === 0 ? 1 : -1) * (180 + (idx % 4) * 90),
        scale: 0.75 + (idx % 4) * 0.25,
        delay: (idx % 5) * 0.025,
        duration: 0.85 + (idx % 4) * 0.15,
        shape: shapes[idx % shapes.length],
        color: GOLD_PALETTE[idx % GOLD_PALETTE.length],
      };
    });
  }, [triggerKey]);

  return (
    <AnimatePresence>
      {active && (
        <div
          key={triggerKey}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-visible flex items-center justify-center z-30"
        >
          {/* Central Golden Shockwave Ring */}
          <motion.div
            initial={{ scale: 0.2, opacity: 0.85 }}
            animate={{ scale: 2.3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-40 h-40 rounded-full border-2 border-[#F3D078] shadow-[0_0_40px_#D4AF37]"
          />

          {/* 36 Radial Gold & Crimson Sparks, Coins, and Stars */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
              animate={{
                x: p.targetX,
                y: p.targetY,
                scale: [0, p.scale, p.scale * 0.6, 0],
                rotate: p.rotation,
                opacity: [1, 1, 0.85, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute"
            >
              {p.shape === 'star' && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={p.color}
                  className="drop-shadow-[0_0_8px_rgba(243,208,120,0.9)]"
                >
                  <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
                </svg>
              )}
              {p.shape === 'diamond' && (
                <div
                  style={{ backgroundColor: p.color }}
                  className="w-3 h-3 rotate-45 shadow-[0_0_8px_#F3D078]"
                />
              )}
              {p.shape === 'coin' && (
                <div
                  style={{ borderColor: p.color }}
                  className="w-3.5 h-3.5 rounded-full bg-[#D4AF37] border-2 shadow-[0_0_10px_#F3D078]"
                />
              )}
              {p.shape === 'spark' && (
                <div
                  style={{ backgroundColor: p.color }}
                  className="w-2 h-2 rounded-full shadow-[0_0_6px_#FFF6D6]"
                />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};
