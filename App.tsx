import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PhotoAlbum } from './components/PhotoAlbum';
import { LoveGame } from './components/LoveGame';
import { MessageFolder } from './components/MessageFolder';
import { PixelHeart, PixelFolder } from './components/PixelIcons';
import { AmbientBackground } from './components/AmbientBackground';

// Typewriter Component
const TypewriterEffect: React.FC<{ text: string }> = ({ text }) => {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplay('');
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplay(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {display}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="ml-1 inline-block w-3 h-5 md:w-4 md:h-8 align-middle bg-love-500 shadow-[1px_1px_0_#9f1239] md:shadow-[2px_2px_0_#9f1239]"
      />
    </span>
  );
};

const HomeScreen: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex flex-col items-center justify-center w-full max-w-full md:max-w-4xl mx-auto py-4 md:py-10 px-2 sm:px-4">
    <motion.div
      animate={{ 
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        duration: 2, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="mb-4 md:mb-8 filter drop-shadow-xl"
    >
      <img 
        src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Sparkling%20Heart.png" 
        alt="Sparkling Heart" 
        className="w-24 h-24 md:w-40 md:h-40 object-contain"
      />
    </motion.div>

    <div className="mb-6 md:mb-12 flex items-center justify-center w-full px-2">
      <h1 className="text-xl sm:text-2xl md:text-5xl leading-loose md:leading-tight retro-text text-center font-bold break-words w-full py-2">
        <TypewriterEffect text={`Happy Anniversary, ${name}!`} />
      </h1>
    </div>
    
    <div className="w-full max-w-2xl mb-6 md:mb-16 relative group px-2">
        <div className="absolute -top-3 left-6 md:left-8 w-16 md:w-24 h-5 md:h-8 bg-[#ef4444] border-4 border-gray-900 rounded-t-xl z-0 shadow-sm"></div>

        <div className="relative z-10 bg-[#fff7ed] border-4 border-gray-900 rounded-xl overflow-hidden shadow-[6px_6px_0_rgba(0,0,0,0.15)] text-left">
            <div className="bg-[#fbbf24] border-b-4 border-gray-900 p-2 md:p-3 flex items-center justify-between">
                <div className="flex gap-1.5 md:gap-2">
                    <div className="w-4 h-4 md:w-6 md:h-6 border-2 border-gray-900 bg-white hover:bg-gray-100 flex items-end justify-center pb-1 cursor-pointer shadow-[1px_1px_0_rgba(0,0,0,0.1)] transition-all">
                        <div className="w-2 md:w-3 h-0.5 md:h-1 bg-gray-900"></div>
                    </div>
                    <div className="w-4 h-4 md:w-6 md:h-6 border-2 border-gray-900 bg-white hover:bg-red-500 group/close flex items-center justify-center cursor-pointer relative overflow-hidden shadow-[1px_1px_0_rgba(0,0,0,0.1)] transition-all">
                        <div className="absolute w-[80%] h-0.5 md:h-1 bg-gray-900 group-hover/close:bg-white transform rotate-45 transition-colors"></div>
                        <div className="absolute w-[80%] h-0.5 md:h-1 bg-gray-900 group-hover/close:bg-white transform -rotate-45 transition-colors"></div>
                    </div>
                </div>
                 <div className="flex flex-col gap-[2px] md:gap-[3px] opacity-20">
                    <div className="w-5 md:w-8 h-0.5 bg-gray-900"></div>
                    <div className="w-5 md:w-8 h-0.5 bg-gray-900"></div>
                    <div className="w-5 md:w-8 h-0.5 bg-gray-900"></div>
                 </div>
            </div>

            <div className="p-4 sm:p-6 md:p-12 flex flex-col items-center justify-center min-h-[80px] md:min-h-[160px]">
                 <p className="text-sm sm:text-base md:text-2xl text-love-900 leading-relaxed font-bold font-sans text-center max-w-lg italic">
                    "Welcome to our memory vault. Every pixel here is a reminder of how much you mean to me."
                 </p>
            </div>
        </div>
    </div>

    <div className="flex flex-col gap-3 md:gap-6 w-full max-w-lg px-2 sm:px-4 pb-8 md:pb-16">
      {[
        { to: "/photos", label: "Memories", color: "#be123c" },
        { to: "/game", label: "Play Game", color: "#16a34a" },
        { to: "/messages", label: "Secrets", color: "#2563eb" }
      ].map((item) => (
        <Link 
          key={item.to}
          to={item.to} 
          className="group relative flex items-center gap-3 sm:gap-6 p-4 md:p-8 bg-white/15 backdrop-blur-md border-4 border-white/50 shadow-[4px_4px_0_rgba(0,0,0,0.15)] hover:shadow-[6px_6px_0_rgba(255,255,255,0.4)] hover:-translate-y-1 transition-all duration-300 rounded-2xl w-full overflow-hidden"
        >
           <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
           <div className="transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shrink-0 relative z-10">
              <PixelFolder size={32} className="md:w-16 md:h-16 w-10 h-10 drop-shadow-md" />
           </div>
           <h3 className="font-script text-sm sm:text-base md:text-2xl text-white retro-text tracking-widest text-left flex-grow relative z-10" style={{ textShadow: `2px 2px 0 ${item.color}` }}>
              {item.label}
           </h3>
        </Link>
      ))}

      {/* Bouncing Emojis */}
      <div className="flex justify-center gap-6 mt-4">
          {['🐱', '💖', '🔐', '✨'].map((emoji, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2
              }}
              className="text-3xl md:text-5xl drop-shadow-lg filter hover:brightness-110 cursor-pointer select-none"
              whileHover={{ scale: 1.2 }}
            >
              {emoji}
            </motion.div>
          ))}
      </div>
    </div>
  </div>
);

const MainLayout: React.FC<{ userName: string }> = ({ userName }) => {
  const location = useLocation();
  const showHomeButton = location.pathname !== '/';

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden">
       {showHomeButton && (
         <Link to="/" className="fixed top-2 left-2 sm:top-4 sm:left-4 z-50 pixel-btn pixel-btn-pink p-2 sm:p-3 aspect-square shadow-xl group border-2">
           <PixelHeart size={20} className="text-white group-hover:scale-125 transition-transform sm:w-8 sm:h-8" />
         </Link>
       )}

       <div className="flex-grow flex justify-center items-center p-2 sm:p-4 md:p-8">
          <main className="glass-panel w-full max-w-7xl h-auto min-h-[90vh] md:min-h-[85vh] max-h-[98vh] overflow-y-auto overflow-x-hidden flex flex-col relative custom-scrollbar">
            <AmbientBackground />
            <div className="relative z-10 flex-grow w-full flex flex-col">
              <Routes>
                <Route path="/" element={<HomeScreen name={userName} />} />
                <Route path="/photos" element={<PhotoAlbum />} />
                <Route path="/game" element={<LoveGame />} />
                <Route path="/messages" element={<MessageFolder />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
       </div>
    </div>
  );
};

const App: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem('anniversaryName');
    if (savedName) setUserName(savedName);
  }, []);

  const handleStart = (name: string) => {
    setUserName(name);
    localStorage.setItem('anniversaryName', name);
  };

  if (!userName) return <WelcomeScreen onStart={handleStart} />;

  return (
    <HashRouter>
      <MainLayout userName={userName} />
    </HashRouter>
  );
};

export default App;