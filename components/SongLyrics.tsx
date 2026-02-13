import React, { useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const RAW_LYRICS = `00:00
00:01
00:02
00:03
00:04
00:05
00:06
00:07
00:08
00:09
00:10
00:11
00:12
00:13
00:14 Mahal, pangako ko sa'yo
00:17 Ang iyong tanging mananatili
00:23 At kung sakaling malumbay
00:29 Sa 'kin ay ibigay ang kalungkutan
00:36 Pasensyahan mo na kung araw ma'y 'di maialay
00:43 Pati ang buwan 'di masungkit
00:46 Bituin ay mapaparam
00:52 Ngunit pag-ibig ko sa'yo ay tunay
00:59 Araw-araw, lagi-lagi
01:03 Kita'y pagsisilbihan
01:08 Wag ka sanang mag-alinlangan
01:15 Magtiwala ka pati buhay ko
01:19 Sa'yo ay ibibigay
01:25 Mahal
01:27 Hanggang sa dulo ng buhay
01:31 Ako pa rin ang 'yong
01:34 Gagabay
01:39 Kahit humina man ang 'yong pandinig
01:45 Gabi-gabi pa rin kitang
01:49 Kakantahan
01:54 Pasensyahan mo na kung araw ma'y 'di maialay
02:00 Pati ang buwan 'di masungkit
02:04 Bituin ay mapaparam
02:10 Ngunit pag-ibig ko sa'yo ay tunay
02:16 Araw-araw, lagi-lagi
02:20 Kita'y pagsisilbihan
02:25 Wag ka sanang mag-alinlangan
02:32 Magtiwala ka pati buhay ko
02:37 Sa'yo ay ibibigay
02:42 Mahal
02:45 Ito lamang
02:48 Ang lahat
02:51 Mahal
02:54 Ito lamang
02:57 Ang lahat`;

interface LyricLine {
  time: number;
  text: string;
}

export const SyncedLyrics: React.FC<{ currentTime: number }> = ({ currentTime }) => {
  const lyrics = useMemo(() => {
    return RAW_LYRICS.split('\n').map(line => {
      // Regex to parse "MM:SS Text" or just "MM:SS"
      const match = line.match(/^(\d{2}):(\d{2})\s*(.*)$/);
      if (match) {
        const minutes = parseInt(match[1]);
        const seconds = parseInt(match[2]);
        const text = match[3] ? match[3].trim() : '';
        return {
          time: minutes * 60 + seconds,
          text: text
        };
      }
      return null;
    }).filter((l): l is LyricLine => l !== null && l.text !== ''); // Filter out empty lines
  }, []);

  // Find the index of the current active line
  // A line is active if its time is less than or equal to current time, 
  // and it's the latest one that satisfies this.
  const activeIndex = lyrics.reduce((acc, curr, index) => {
    if (curr.time <= currentTime) return index;
    return acc;
  }, -1);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active line
  useEffect(() => {
    if (scrollRef.current && activeIndex !== -1) {
      const activeElement = scrollRef.current.children[0].children[activeIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeIndex]);

  return (
    <div 
      className="h-40 md:h-56 overflow-y-auto custom-scrollbar bg-love-50/50 rounded-xl p-4 border-2 border-love-100/50 mb-6 text-center relative shadow-inner" 
      ref={scrollRef}
    >
       <div className="space-y-6 py-16">
        {lyrics.map((line, index) => {
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;
          
          return (
            <motion.div
              key={index}
              animate={{ 
                scale: isActive ? 1.15 : 1,
                opacity: isActive ? 1 : isPast ? 0.4 : 0.25,
                y: isActive ? 0 : 0,
                filter: isActive ? 'blur(0px)' : 'blur(0.5px)'
              }}
              transition={{ duration: 0.3 }}
              className={`transition-colors duration-300 ${isActive ? 'text-love-600 font-bold' : 'text-love-900'}`}
            >
              <p className="font-sans text-sm sm:text-xl md:text-2xl leading-relaxed tracking-wide">
                {line.text}
              </p>
            </motion.div>
          );
        })}
       </div>
       {/* Gradient overlays for fade effect */}
       <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#fff1f2] to-transparent pointer-events-none rounded-t-xl" />
       <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#fff1f2] to-transparent pointer-events-none rounded-b-xl" />
    </div>
  );
};
