import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PixelHeart } from './PixelIcons';

const NUM_PARTICLES = 15;

interface Particle {
  id: number;
  left: number;
  scale: number;
  duration: number;
  delay: number;
  sway: number;
}

export const AmbientBackground: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Create particles on client-side to ensure randomness matches render
    const newParticles = Array.from({ length: NUM_PARTICLES }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      scale: 0.5 + Math.random() * 0.5,
      duration: 15 + Math.random() * 15, // 15-30s duration
      delay: Math.random() * 10,
      sway: (Math.random() - 0.5) * 50, // Random sway amount
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          initial={{ 
            left: `${p.left}%`, 
            bottom: -50, 
            opacity: 0,
            rotate: 0 
          }}
          animate={{ 
            bottom: '120%', 
            opacity: [0, 0.8, 0],
            x: [0, p.sway, 0],
            rotate: [0, p.sway / 2, 0]
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            delay: p.delay,
            ease: "linear" 
          }}
        >
          <PixelHeart size={Math.max(20, Math.floor(40 * p.scale))} />
        </motion.div>
      ))}
    </div>
  );
};