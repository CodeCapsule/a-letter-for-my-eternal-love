import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROOT_FOLDER } from '../constants';
import { FolderItem } from '../types';
import { PixelFolder, PixelFile, PixelArrowLeft, PixelEnvelope, PixelClose } from './PixelIcons';

export const MessageFolder: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<FolderItem[]>([ROOT_FOLDER]);
  const [selectedFile, setSelectedFile] = useState<FolderItem | null>(null);
  
  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentFolder = currentPath[currentPath.length - 1];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (selectedFile?.name === 'For You.txt') {
      setAudioError(false);
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true))
        .catch(error => {
          setIsPlaying(false);
          if (error.name !== 'AbortError') console.log("Playback prevented");
        });
      }
    } else {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    }
  }, [selectedFile]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true))
        .catch(error => {
          if (error.name !== 'AbortError') console.error("Play failed:", error);
          setIsPlaying(false);
        });
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setAudioError(false);
    }
  };

  const handleAudioError = () => {
    setAudioError(true);
    setIsPlaying(false);
  };

  const handleEnded = () => setIsPlaying(false);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-2 sm:p-4 md:p-12 max-w-6xl mx-auto min-h-[75vh] w-full">
      <audio
        ref={audioRef}
        loop
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleAudioError}
        onEnded={handleEnded}
      >
        <source src="https://archive.org/download/01-project-romeo-ito-lamang/01%20Project%20Romeo%20-%20Ito%20Lamang.mp3" type="audio/mpeg" />
        <source src="https://archive.org/download/01-project-romeo-ito-lamang/01%20Project%20Romeo%20-%20Ito%20Lamang.ogg" type="audio/ogg" />
      </audio>

      <div className="flex items-center gap-2 sm:gap-6 mb-4 sm:mb-12 bg-white/25 backdrop-blur-lg p-3 sm:p-5 rounded-xl border-4 border-white/50 shadow-xl pt-12 sm:pt-5">
        {currentPath.length > 1 && (
          <button 
            onClick={() => setCurrentPath(currentPath.slice(0, -1))}
            className="pixel-btn pixel-btn-blue p-1.5 sm:p-4 aspect-square shadow-lg"
          >
            <PixelArrowLeft size={16} className="sm:w-6 sm:h-6" />
          </button>
        )}
        <div className="overflow-hidden">
          <h2 className="text-sm sm:text-2xl md:text-4xl font-script text-white flex items-center gap-2 sm:gap-3 drop-shadow-lg">
            <PixelFolder size={16} className="text-yellow-200 hidden sm:block md:w-10 md:h-10" />
            <span className="truncate tracking-tight uppercase">{currentFolder.name}</span>
          </h2>
          <p className="text-[8px] sm:text-xs font-mono text-white/90 mt-1 sm:mt-2 tracking-widest bg-black/20 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full w-fit">
            /{currentPath.map(f => f.name.toUpperCase()).join(' / ')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-8 md:gap-10">
        <AnimatePresence mode="popLayout">
          {currentFolder.children?.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05, y: -4, rotate: 1 }}
              className={`
                group cursor-pointer flex flex-col items-center text-center gap-2 sm:gap-5 aspect-square justify-center transition-all 
                bg-white/10 backdrop-blur-md border-2 sm:border-4 border-white/40 shadow-[4px_4px_0_rgba(0,0,0,0.1)] 
                hover:bg-white/30 hover:shadow-[6px_6px_0_#be123c] hover:border-love-300 rounded-2xl sm:rounded-[2rem] p-2 sm:p-6
              `}
              onClick={() => item.type === 'folder' ? setCurrentPath([...currentPath, item]) : setSelectedFile(item)}
            >
              <div className="relative transform group-hover:scale-110 transition-transform duration-300">
                {item.type === 'folder' ? (
                  <PixelFolder size={32} className="text-gray-900 drop-shadow-lg sm:w-20 sm:h-20" />
                ) : (
                  <PixelFile size={32} className="text-gray-900 drop-shadow-lg sm:w-20 sm:h-20" />
                )}
              </div>
              <span className="font-sans text-sm sm:text-xl md:text-3xl text-white font-bold break-words w-full px-1 leading-tight drop-shadow-md">
                {item.name}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedFile(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 bg-white border-2 sm:border-4 border-gray-900 p-2 sm:p-3 rounded-full shadow-2xl z-50">
                <PixelEnvelope size={24} className="text-love-600 sm:w-10 sm:h-10" />
              </div>
              
              <div className="bg-white w-full rounded-[1.5rem] sm:rounded-[2rem] border-4 border-gray-900 shadow-[6px_6px_0_#be123c] px-4 py-8 sm:px-8 sm:py-10 overflow-y-auto max-h-[85vh] relative z-40 flex flex-col custom-scrollbar">
                <h3 className="text-base sm:text-2xl font-script text-center mb-4 sm:mb-6 text-love-900 border-b-2 border-love-100 pb-4 mt-6 tracking-tight uppercase">
                  {selectedFile.name.replace('.txt', '')}
                </h3>
                
                <div className="bg-love-50/50 p-4 sm:p-6 border-2 border-love-100/50 text-center mb-6 relative rounded-xl shadow-inner">
                  <p className="font-sans text-sm sm:text-lg text-love-900 leading-relaxed whitespace-pre-line font-bold italic">
                    "{selectedFile.content}"
                  </p>
                </div>

                {selectedFile.name === 'For You.txt' && (
                  <div className="bg-zinc-900 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 flex flex-col items-center border-2 border-zinc-950 shadow-[0_8px_0_#0f0f12] relative w-full max-w-[280px] sm:max-w-sm mx-auto mb-4">
                    <div className="relative w-full aspect-[1.55] mb-4 select-none filter drop-shadow-xl hover:scale-[1.02] transition-transform duration-300">
                      <svg viewBox="0 0 400 260" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                          <rect x="0" y="0" width="400" height="260" rx="20" fill="#1c1c1c" />
                          <rect x="5" y="5" width="390" height="250" rx="16" fill="#262626" stroke="#111" strokeWidth="2" />
                          <g transform="translate(20, 20)">
                            <rect x="0" y="0" width="360" height="170" rx="8" fill="#eaddcf" />
                            <line x1="20" y1="30" x2="340" y2="30" stroke="#d6c0ad" strokeWidth="2" />
                            <line x1="20" y1="55" x2="340" y2="55" stroke="#d6c0ad" strokeWidth="2" />
                            <rect x="0" y="75" width="360" height="60" fill="#c26e38" />
                            <text x="25" y="45" fontFamily="monospace" fontSize="24" fontWeight="bold" fill="#333">A</text>
                            <text x="180" y="45" fontFamily="monospace" fontSize="22" textAnchor="middle" fill="#222" fontWeight="bold">Project Romeo</text>
                            <text x="180" y="70" fontFamily="monospace" fontSize="16" textAnchor="middle" fill="#444" fontWeight="bold">Ito Lamang</text>
                          </g>
                          <g transform="translate(85, 95)">
                              <rect x="0" y="0" width="230" height="70" rx="35" fill="#111" stroke="#333" strokeWidth="2" />
                              <g>
                                  <g transform="translate(60, 35)">
                                      <circle r={28} fill="#3f2e26" />
                                      <motion.g animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                                          <circle r="14" fill="#eee" />
                                          <circle r="5" fill="none" stroke="#ccc" strokeWidth="2" />
                                      </motion.g>
                                  </g>
                                  <g transform="translate(170, 35)">
                                      <circle r={20} fill="#3f2e26" />
                                      <motion.g animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                                          <circle r="14" fill="#eee" />
                                          <circle r="5" fill="none" stroke="#ccc" strokeWidth="2" />
                                      </motion.g>
                                  </g>
                              </g>
                          </g>
                          <path d="M50 260 L70 205 H330 L350 260 Z" fill="#222" />
                      </svg>
                    </div>

                    <div className="w-full text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-2">
                        {isPlaying && (
                          <div className="flex gap-1">
                              {[1,2,3].map(i => (
                                <motion.div key={i} className="w-1.5 h-1.5 bg-red-500 rounded-full" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }} />
                              ))}
                          </div>
                        )}
                        <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest font-bold">{isPlaying ? 'PLAYING TAPE' : 'TAPE PAUSED'}</span>
                      </div>

                      <div className="relative w-full h-3 bg-zinc-950 rounded-full border border-zinc-800 mb-4 overflow-hidden shadow-inner">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-orange-700 to-orange-500"
                            initial={{ width: "0%" }}
                            animate={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                            transition={{ type: "tween", ease: "linear" }}
                          />
                      </div>

                      <div className="flex items-center justify-center gap-4 sm:gap-8">
                        <button className="text-zinc-600 hover:text-white transition-colors"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M11 19V5l-9 7 9 7zm11 0V5l-9 7 9 7z"/></svg></button>
                        <button onClick={togglePlay} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-zinc-100 border-b-4 border-zinc-400 active:border-b-0 active:translate-y-1 shadow-lg flex items-center justify-center group transition-all">
                            {isPlaying ? (
                                <div className="flex gap-1">
                                  <div className="w-2 h-6 bg-zinc-800 rounded-sm"></div>
                                  <div className="w-2 h-6 bg-zinc-800 rounded-sm"></div>
                                </div>
                            ) : (
                                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[16px] border-l-zinc-800 border-b-[8px] border-b-transparent ml-1"></div>
                            )}
                        </button>
                        <button className="text-zinc-600 hover:text-white transition-colors"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M4 19V5l9 7-9 7zm11 0V5l9 7-9 7z"/></svg></button>
                      </div>

                      <div className="flex justify-between mt-3 px-2 font-mono text-zinc-400 text-[10px] font-bold">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setSelectedFile(null)}
                  className="pixel-btn pixel-btn-red w-full mt-2 text-[10px] sm:text-xs py-2 sm:py-3 border-2 shadow-md"
                >
                  <PixelClose size={16} className="mr-2" />
                  CLOSE FILE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};