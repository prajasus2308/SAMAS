import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';

interface LeverProps {
  onPull: () => void;
  disabled: boolean;
  isPulled: boolean;
}

export const Lever: React.FC<LeverProps> = ({ onPull, disabled, isPulled }) => {
  const [dragProgress, setDragProgress] = useState(0); // 0 to 1
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || disabled) return;
    const deltaY = Math.max(0, e.clientY - startYRef.current);
    const progress = Math.min(1, deltaY / 90);
    setDragProgress(progress);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (!disabled) {
      // Trigger spin whether user dragged down or clicked the knob
      onPull();
    }
    setDragProgress(0);
  };

  const activePullAmount = isPulled ? 1 : dragProgress;

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Pull Slot Machine Lever to Spin"
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onPull();
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative flex items-center justify-center w-20 h-60 sm:h-64 touch-none ${
          disabled ? 'cursor-not-allowed opacity-75' : 'cursor-grab active:cursor-grabbing'
        }`}
      >
        {/* Side Mechanical Gearbox Housing */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-28 rounded-r-xl bg-gradient-to-b from-[#9A7420] via-[#D4AF37] to-[#6B4C08] border-y-2 border-r-2 border-[#FFF1BE]/60 shadow-xl flex flex-col items-center justify-between py-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#3B0B17] border border-[#FFF1BE]/60" />
          <div className="w-3.5 h-10 rounded-full bg-[#1E060B] border border-[#D4AF37]/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#3B0B17] border border-[#FFF1BE]/60" />
        </div>

        {/* Vertical Lever Track Guide */}
        <div className="relative w-3.5 h-44 rounded-full bg-[#0E0205] border border-[#D4AF37]/45 shadow-inner flex flex-col items-center justify-center">
          {/* Metallic Shaft that foreshortens as pulled down */}
          <motion.div
            animate={{
              height: `${Math.max(24, (1 - activePullAmount * 1.45) * 85)}px`,
              y: activePullAmount * 52,
            }}
            transition={{ type: 'spring', stiffness: 360, damping: 20 }}
            className="w-3 rounded-full bg-gradient-to-r from-[#8A6415] via-[#FFF1BE] to-[#9A7420] origin-center shadow-md"
          />

          {/* Crimson & Gold Royal Knob */}
          <motion.div
            animate={{
              y: activePullAmount * 96 - 48,
              scale: activePullAmount > 0.2 ? 1.08 : 1,
            }}
            transition={{ type: 'spring', stiffness: 340, damping: 18 }}
            className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-[#D62839] via-[#8B1E2F] to-[#3B0B17] border-2 border-[#F3D078] shadow-[0_8px_20px_rgba(0,0,0,0.8),inset_0_3px_6px_rgba(255,255,255,0.45)] flex items-center justify-center group"
          >
            {/* Inner Gold Crown Ring */}
            <div className="w-5 h-5 rounded-full border border-[#F3D078]/70 bg-[#D4AF37]/20" />
          </motion.div>
        </div>
      </div>

      {/* Label under Lever */}
      <span className="mt-1 text-[11px] font-semibold tracking-wider text-[#F3D078]/85 whitespace-nowrap">
        {disabled ? 'SPINNING...' : 'PULL OR CLICK'}
      </span>
    </div>
  );
};
