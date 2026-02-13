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
        setDisplay(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className="inline-block">
      {display}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="ml-1 inline-block w-3 h-6 md:w-5 md:h-10 align-middle bg-love-500 shadow-[2px_2px_0_#9f1239]"
      />
    </span>
  );
};

const HomeScreen: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex flex-col items-center justify-center w-full max-w-full md:max-w-4xl mx-auto py-8 md:py-16 px-4">
    {/* Main Animated Heart Icon */}
    <motion.div
      animate={{ 
        scale: [1, 1.2, 1],
        y: [0, -10, 0]
      }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="mb-8 md:mb-12 filter drop-shadow-[4px_4px_0_rgba(0,0,0,0.2)]"
    >
      <PixelHeart size={140} className="w-24 h-24 md:w-48 md:h-48" />
    </motion.div>

    {/* Anniversary Message */}
    <div className="mb-10 md:mb-16 flex items-center justify-center w-full px-2">
      <h1 className="text-xl sm:text-2xl md:text-5xl leading-tight retro-text text-center font-bold break-words w-full py-4 min-h-[4em] md:min-h-[3em]">
        <TypewriterEffect text={`Happy Anniversary, ${name}!`} />
      </h1>
    </div>
    
    {/* Information Window */}
    <div className="w-full max-w-2xl mb-8 md:mb-20 relative group px-2">
        <div className="absolute -top-3 left-6 md:left-8 w-16 md:w-24 h-5 md:h-8 bg-[#ef4444] border-4 border-gray-900 rounded-t-xl z-0 shadow-sm"></div>

        <div className="relative z-10 bg-[#fff7ed] border-4 border-gray-900 rounded-xl overflow-hidden shadow-[8px_8px_0_rgba(0,0,0,0.2)] text-left">
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

            <div className="p-6 sm:p-8 md:p-14 flex flex-col items-center justify-center min-h-[100px] md:min-h-[180px]">
                 <p className="text-base sm:text-lg md:text-3xl text-love-900 leading-relaxed font-bold font-sans text-center max-w-lg italic">
                    "Welcome to our memory vault. Every pixel here is a reminder of how much you mean to me."
                 </p>
            </div>
        </div>
    </div>

    {/* Menu Navigation */}
    <div className="flex flex-col gap-4 md:gap-8 w-full max-w-lg px-2 sm:px-4 pb-12 md:pb-24">
      {[
        { to: "/photos", label: "Memories", color: "#be123c" },
        { to: "/game", label: "Play Game", color: "#16a34a" },
        { to: "/messages", label: "Secrets", color: "#2563eb" }
      ].map((item) => (
        <Link 
          key={item.to}
          to={item.to} 
          className="group relative flex items-center gap-4 sm:gap-8 p-6 md:p-10 bg-white/15 backdrop-blur-md border-4 border-white/50 shadow-[6px_6px_0_rgba(0,0,0,0.2)] hover:shadow-[10px_10px_0_rgba(255,255,255,0.4)] hover:-translate-y-2 transition-all duration-300 rounded-3xl w-full overflow-hidden"
        >
           <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
           <div className="transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shrink-0 relative z-10">
              <PixelFolder size={40} className="md:w-20 md:h-20 w-12 h-12 drop-shadow-md" />
           </div>
           <h3 className="font-script text-sm sm:text-lg md:text-3xl text-white retro-text tracking-widest text-left flex-grow relative z-10" style={{ textShadow: `3px 3px 0 ${item.color}` }}>
              {item.label}
           </h3>
        </Link>
      ))}

      {/* Floating Reactions */}
      <div className="flex justify-center gap-8 mt-6">
          {['🐱', '💖', '🔐', '✨'].map((emoji, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
              className="text-4xl md:text-6xl drop-shadow-lg filter hover:brightness-110 cursor-pointer select-none"
              whileHover={{ scale: 1.3, rotate: 10 }}
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
         <Link to="/" className="fixed top-4 left-4 sm:top-8 sm:left-8 z-50 pixel-btn pixel-btn-pink p-3 sm:p-5 aspect-square shadow-2xl group border-2">
           <PixelHeart size={24} className="text-white group-hover:scale-125 transition-transform sm:w-10 sm:h-10" />
         </Link>
       )}

       <div className="flex-grow flex justify-center items-center p-4 sm:p-6 md:p-12">
          <main className="glass-panel w-full max-w-7xl h-auto min-h-[92vh] md:min-h-[88vh] max-h-[98vh] overflow-y-auto overflow-x-hidden flex flex-col relative custom-scrollbar">
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