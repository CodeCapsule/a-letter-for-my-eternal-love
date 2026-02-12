import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmojiReactionProps {
  emoji: string;
  label?: string;
}

export const EmojiReaction: React.FC<EmojiReactionProps> = ({ emoji, label }) => {
  const [count, setCount] = useState(0);
  const [showPop, setShowPop] = useState(false);

  const handleClick = () => {
    setCount((prev) => prev + 1);
    setShowPop(true);
    setTimeout(() => setShowPop(false), 500);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <button
          onClick={handleClick}
          className="text-4xl hover:scale-110 transition-transform duration-200 active:scale-95 focus:outline-none"
          aria-label={`React with ${label || emoji}`}
        >
          {emoji}
        </button>
        <AnimatePresence>
          {showPop && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -40, scale: 1.5 }}
              exit={{ opacity: 0, y: -60 }}
              transition={{ duration: 0.5 }}
              className="absolute top-0 left-0 w-full text-center pointer-events-none text-4xl"
            >
              {emoji}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {count > 0 && (
        <span className="text-xs font-bold text-love-600 mt-1">{count}</span>
      )}
    </div>
  );
};