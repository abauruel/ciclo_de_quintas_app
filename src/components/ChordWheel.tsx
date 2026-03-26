import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { CIRCLE_OF_FIFTHS } from '../constants';

interface ChordWheelProps {
  onSelectKey: (index: number) => void;
  selectedIndex: number;
}

export const ChordWheel: React.FC<ChordWheelProps> = ({ onSelectKey, selectedIndex }) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startAngle = useRef(0);
  const currentRotation = useRef(0);

  // Sync rotation with selectedIndex
  useEffect(() => {
    const targetRotation = -selectedIndex * 30;
    setRotation(targetRotation);
    currentRotation.current = targetRotation;
  }, [selectedIndex]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!wheelRef.current) return;
    isDragging.current = true;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    startAngle.current = angle - currentRotation.current;
    wheelRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !wheelRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    const newRotation = angle - startAngle.current;
    setRotation(newRotation);
    currentRotation.current = newRotation;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    // Snap to nearest 30 degrees
    const snappedRotation = Math.round(currentRotation.current / 30) * 30;
    setRotation(snappedRotation);
    currentRotation.current = snappedRotation;
    
    // Calculate index from rotation
    // -30 deg = index 1, -60 deg = index 2...
    let index = Math.round(-snappedRotation / 30) % 12;
    if (index < 0) index += 12;
    onSelectKey(index);
  };

  return (
    <div className="relative w-full max-w-[400px] aspect-square mx-auto flex items-center justify-center p-4">
      {/* Outer Glow */}
      <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-3xl" />

      {/* Background Glow */}
      <div className="absolute inset-0 rounded-full bg-blue-500/5 blur-3xl" />

      {/* The Wheel */}
      <motion.div
        ref={wheelRef}
        className="relative w-full h-full rounded-full border-8 border-[#1a1a1a] bg-[#0a0a0a] wheel-shadow cursor-grab active:cursor-grabbing touch-none select-none z-0"
        animate={{ rotate: rotation }}
        transition={isDragging.current ? { type: 'just' } : { type: 'spring', stiffness: 100, damping: 20 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {CIRCLE_OF_FIFTHS.map((note, i) => {
          const angle = i * 30;
          const minorNote = CIRCLE_OF_FIFTHS[(i + 3) % 12];
          
          // Highlight logic based on position relative to selectedIndex
          const isAtRootPos = i === selectedIndex;
          const isAtNeighborPos = i === (selectedIndex - 1 + 12) % 12 || i === (selectedIndex + 1) % 12;

          return (
            <React.Fragment key={`group-${note}`}>
              {/* Diminished Note (Outer Ring) */}
              <div
                className="absolute inset-0 flex items-start justify-center -pt-8"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <motion.div
                  animate={{ rotate: -angle - rotation, scale: isAtRootPos ? 1.2 : 1 }}
                  transition={isDragging.current ? { type: 'just' } : { type: 'spring', stiffness: 100, damping: 20 }}
                  className="w-10 h-10 flex items-center justify-center transition-colors duration-300"
                >
                  <span className={`text-sm font-bold ${isAtRootPos ? 'text-red-400' : 'text-white/20'}`}>
                    {CIRCLE_OF_FIFTHS[(i + 5) % 12]}°
                  </span>
                </motion.div>
              </div>

              {/* Minor Note (Middle Ring) */}
              <div
                className="absolute inset-0 flex items-start justify-center pt-10"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <motion.div
                  animate={{ rotate: -angle - rotation, scale: isAtRootPos ? 1.2 : isAtNeighborPos ? 1.1 : 1 }}
                  transition={isDragging.current ? { type: 'just' } : { type: 'spring', stiffness: 100, damping: 20 }}
                  className="w-10 h-10 flex items-center justify-center transition-colors duration-300"
                >
                  <span className={`text-sm font-medium ${isAtRootPos ? 'text-blue-300' : isAtNeighborPos ? 'text-white/70' : 'text-white/10'}`}>
                    {minorNote}m
                  </span>
                </motion.div>
              </div>

              {/* Major Note (Inner Ring) */}
              <div
                className="absolute inset-0 flex items-start justify-center pt-20"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <motion.div
                  animate={{ rotate: -angle - rotation, scale: isAtRootPos ? 1.2 : isAtNeighborPos ? 1.1 : 1 }}
                  transition={isDragging.current ? { type: 'just' } : { type: 'spring', stiffness: 100, damping: 20 }}
                  className="w-12 h-12 flex items-center justify-center transition-colors duration-300"
                >
                  <span className={`text-1xl font-bold tracking-tighter ${isAtRootPos ? 'text-blue-400' : isAtNeighborPos ? 'text-white/90' : 'text-white/20'}`}>
                    {note}
                  </span>
                </motion.div>
              </div>
            </React.Fragment>
          );
        })}

        {/* Inner Circle Decorations */}
        <div className="absolute inset-[35%] rounded-full border border-white/5 bg-gradient-to-br from-white/5 to-transparent" />
        <div className="absolute inset-[45%] rounded-full border border-white/10 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        </div>
      </motion.div>

      {/* Selection Indicator (Fixed at Top) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-1 h-8 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)] z-30" />

      {/* Mask Overlay (Unified Window) - Fixed at Top, Above the Wheel */}
      <div className="absolute inset-4 pointer-events-none z-20 rounded-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100">
            <defs>
              <filter id="window-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            
            {/* 
              The Mask:
              - Covers the whole area (M -10 -10 H 110 V 110 H -10 Z)
              - Cuts out the "Window" shape using evenodd fill rule
            */}
            <path
              d="
                M -10 -10 H 110 V 110 H -10 Z
                M 50 50
                L 75.5 24.5 
                A 36 36 0 0 0 59.3 15.2 
                L 62.4 3.6 
                A 48 48 0 0 0 37.6 3.6 
                L 40.7 15.2 
                A 36 36 0 0 0 24.5 24.5 
                Z
              "
              fill="rgba(0, 0, 0, 0.7)"
              fillRule="evenodd"
              className="transition-all duration-500"
            />

            {/* Window Border and Glow */}
            <path
              d="
                M 50 50
                L 75.5 24.5 
                A 36 36 0 0 0 59.3 15.2 
                L 62.4 3.6 
                A 48 48 0 0 0 37.6 3.6 
                L 40.7 15.2 
                A 36 36 0 0 0 24.5 24.5 
                Z
              "
              fill="none"
              stroke="rgba(59, 130, 246, 0.4)"
              strokeWidth="0.6"
              filter="url(#window-glow)"
            />
            
            {/* Decorative Arc Dividers inside the window */}
            // <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            // <circle cx="50" cy="50" r="24" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
};
