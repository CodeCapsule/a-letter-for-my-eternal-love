import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PixelHeart, PixelLock, PixelUnlock } from './PixelIcons';

interface WelcomeScreenProps {
  onStart: (name: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [inputName, setInputName] = useState('');

  // Authentication check: Case-insensitive match for "ricamae"
  const isUnlocked = inputName.trim().toLowerCase() === 'ricamae';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUnlocked) {
      // Standardize the name capitalization for the app
      onStart('Ricamae');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass-panel p-4 md:p-16 flex flex-col items-center w-full max-w-2xl text-center">
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)] mb-4 md:mb-8"
        >
          {isUnlocked ? (
            <motion.div
              initial={{ scale: 0.8, rotate: 10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] bg-white/20">
                <img 
                  src="https://media.tenor.com/ivKWdfdbV3EAAAAj/goma-goma-cat.gif" 
                  alt="Unlocked" 
                  className="w-32 h-32 md:w-56 md:h-56 object-cover" 
                />
              </div>
              <div className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 bg-green-500 text-white p-1.5 md:p-2 rounded-full border-4 border-gray-900 shadow-sm -rotate-12 z-10">
                <PixelUnlock size={20} className="md:w-6 md:h-6" />
              </div>
            </motion.div>
          ) : (
             <div className="relative group">
               <div className="rounded-2xl overflow-hidden border-4 border-white shadow-[0_4px_0_rgba(0,0,0,0.2)] bg-white/20">
                  <img 
                    src="https://media.tenor.com/mfmIXiRnJOkAAAAi/peach-and-goma-peach-goma.gif" 
                    alt="Locked" 
                    className="w-32 h-32 md:w-56 md:h-56 object-cover" 
                  />
               </div>
               <div className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 bg-white text-love-600 p-1.5 md:p-2 rounded-full border-4 border-gray-900 shadow-sm rotate-12 z-10">
                 <PixelLock size={20} className="md:w-6 md:h-6" />
               </div>
             </div>
          )}
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-3xl mb-4 md:mb-6 leading-relaxed retro-text"
        >
          For my <br/>
          <span className="text-love-500 inline-block my-1 md:my-2" style={{ 
            textShadow: '-2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 2px 2px 0 #fff, 4px 4px 0 #e11d48' 
          }}>Important Person</span> 
          <br/>to my Life
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col items-center justify-center gap-3 mb-4 md:mb-6 text-white/90 font-sans text-xs md:text-base tracking-wide drop-shadow-sm font-bold bg-black/20 px-4 py-3 md:px-6 md:py-4 rounded-2xl text-center max-w-lg mx-auto border-2 border-white/20"
        >
          <span className="leading-relaxed">Please enter your name to unlock the button and start your love journey</span>
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="mt-1"
          >
             <PixelHeart size={40} />
          </motion.div>
        </motion.div>

        <motion.p
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.4 }}
           className="text-white/90 text-sm md:text-2xl mb-6 md:mb-8 tracking-wide font-sans drop-shadow-sm font-bold"
        >
          {isUnlocked ? "PLAYER FOUND! PRESS START 💖" : "AUTHENTICATION REQUIRED"}
        </motion.p>

        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 md:gap-6 w-full"
        >
          <div className="relative group">
            <input
              type="text"
              placeholder="ENTER NAME"
              className={`px-3 md:px-6 py-2 md:py-4 rounded-xl border-4 ${
                isUnlocked 
                  ? 'border-love-400 bg-love-900/40 text-white' 
                  : 'border-white/50 bg-black/20 text-white'
              } focus:outline-none text-center text-lg md:text-2xl placeholder-white/60 shadow-inner w-full uppercase tracking-widest font-sans transition-all duration-300 font-bold`}
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              required
            />
            <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none transition-opacity duration-300">
               {isUnlocked ? <PixelUnlock size={20} className="md:w-8 md:h-8" /> : null}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!isUnlocked}
            className={`pixel-btn ${isUnlocked ? 'pixel-btn-pink' : ''} w-full text-sm md:text-xl`}
          >
            {isUnlocked ? (
              <>
                <PixelHeart size={16} className="text-white group-hover:animate-pulse md:w-5 md:h-5" />
                START GAME
                <PixelHeart size={16} className="text-white group-hover:animate-pulse md:w-5 md:h-5" />
              </>
            ) : (
              <span>LOCKED</span>
            )}
          </button>
        </motion.form>
      </div>
    </div>
  );
};