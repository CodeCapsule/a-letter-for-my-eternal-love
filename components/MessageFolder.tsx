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
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentFolder = currentPath[currentPath.length - 1];

  // Effect to handle file opening/closing and autoplay
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (selectedFile?.name === 'For You.txt') {
      // We do NOT call audio.play() here automatically because the IFRAME 
      // is set to autoplay. This prevents double-audio.
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
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
        playPromise
          .then(() => setIsPlaying(true))
          .catch(error => {
            console.error("Play interaction failed:", error.message);
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
      setIsAudioLoading(false);
    }
  };

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
        crossOrigin="anonymous"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={() => { setIsAudioLoading(false); setAudioError(false); }}
        onWaiting={() => setIsAudioLoading(true)}
        onPlaying={() => setIsAudioLoading(false)}
        onError={() => setAudioError(true)}
        onEnded={() => setIsPlaying(false)}
      >
        <source src="https://archive.org/download/01-project-romeo-ito-lamang/01%20Project%20Romeo%20-%20Ito%20Lamang.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Navigation Header */}
      <div className="flex items-center gap-3 sm:gap-6 mb-6 sm:mb-12 bg-white/25 backdrop-blur-lg p-3 sm:p-5 rounded-2xl border-4 border-white/50 shadow-xl pt-16 sm:pt-5">
        {currentPath.length > 1 && (
          <button 
            onClick={() => setCurrentPath(currentPath.slice(0, -1))}
            className="pixel-btn pixel-btn-blue p-2 sm:p-4 aspect-square shadow-lg"
          >
            <PixelArrowLeft size={18} className="sm:w-6 sm:h-6" />
          </button>
        )}
        <div className="overflow-hidden flex-grow">
          <h2 className="text-sm sm:text-2xl md:text-4xl font-script text-white flex items-center gap-2 sm:gap-3 drop-shadow-lg">
            <PixelFolder size={20} className="text-yellow-200 hidden sm:block md:w-10 md:h-10" />
            <span className="truncate tracking-tight uppercase">{currentFolder.name}</span>
          </h2>
          <p className="text-[9px] sm:text-xs font-mono text-white/90 mt-1 sm:mt-2 tracking-widest bg-black/20 px-3 py-1 rounded-full w-fit">
            /{currentPath.map(f => f.name.toUpperCase()).join(' / ')}
          </p>
        </div>
      </div>

      {/* Folder Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-10 md:gap-12">
        <AnimatePresence mode="popLayout">
          {currentFolder.children?.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.08, y: -8, rotate: index % 2 === 0 ? 1 : -1 }}
              className={`
                group cursor-pointer flex flex-col items-center text-center gap-3 sm:gap-6 aspect-square justify-center transition-all 
                bg-white/10 backdrop-blur-xl border-4 border-white/40 shadow-[8px_8px_0_rgba(0,0,0,0.1)] 
                hover:bg-white/30 hover:shadow-[10px_10px_0_#be123c] hover:border-love-300 rounded-[2rem] p-4 sm:p-8
              `}
              onClick={() => item.type === 'folder' ? setCurrentPath([...currentPath, item]) : setSelectedFile(item)}
            >
              <div className="relative transform group-hover:scale-125 transition-transform duration-500">
                {item.type === 'folder' ? (
                  <PixelFolder size={40} className="text-gray-900 drop-shadow-xl sm:w-24 sm:h-24" />
                ) : (
                  <PixelFile size={40} className="text-gray-900 drop-shadow-xl sm:w-24 sm:h-24" />
                )}
              </div>
              <span className="font-sans text-xs sm:text-2xl md:text-3xl text-white font-bold break-words w-full px-2 leading-tight drop-shadow-xl">
                {item.name}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* File Lightbox */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedFile(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg md:max-w-2xl flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -top-10 sm:-top-12 left-1/2 transform -translate-x-1/2 bg-white border-4 border-gray-900 p-3 sm:p-4 rounded-full shadow-2xl z-50">
                <PixelEnvelope size={24} className="text-love-600 sm:w-12 sm:h-12" />
              </div>
              
              <div className="bg-white w-full rounded-[2.5rem] border-4 border-gray-900 shadow-[10px_10px_0_#be123c] px-4 py-10 sm:px-10 sm:py-14 overflow-y-auto max-h-[90vh] relative z-40 flex flex-col custom-scrollbar">
                <h3 className="text-lg sm:text-2xl md:text-3xl font-script text-center mb-6 text-love-900 border-b-2 border-love-100 pb-6 mt-8 tracking-tight uppercase">
                  {selectedFile.name.replace('.txt', '')}
                </h3>
                
                {selectedFile.name === 'For You.txt' && (
                   <div className="w-full mb-6 flex flex-col gap-6">
                      {/* Video Player Frame with Autoplay Enabled - Fixed Height 50px */}
                      <div className="relative w-full h-[50px] bg-black border-4 border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
                         <iframe 
                           src="https://drive.google.com/file/d/1fu7IGTPjAA2lcoLhF53uIobRJ2lSH9aF/preview?autoplay=1" 
                           className="absolute inset-0 w-full h-full" 
                           allow="autoplay; encrypted-media; fullscreen"
                           title="Memory Video"
                         />
                         {/* Retro TV scanlines overlay */}
                         <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
                      </div>
                   </div>
                )}

                {selectedFile.name !== 'For You.txt' && (
                  <div className="bg-love-50/50 p-6 sm:p-10 border-4 border-love-100/30 text-center mb-8 relative rounded-3xl shadow-inner">
                    <p className="font-sans text-base sm:text-xl md:text-2xl text-love-900 leading-relaxed whitespace-pre-line font-bold italic">
                      "{selectedFile.content}"
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setSelectedFile(null)}
                  className="pixel-btn pixel-btn-red w-full mt-2 text-[12px] py-5 border-4 shadow-xl font-bold uppercase tracking-widest"
                >
                  <PixelClose size={20} className="mr-3" />
                  Eject Memory
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
