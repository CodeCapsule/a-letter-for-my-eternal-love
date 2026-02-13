import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INITIAL_PHOTOS } from '../constants';
import { Photo } from '../types';
import { EmojiReaction } from './EmojiReaction';
import { PixelCamera, PixelClose, PixelArrowLeft, PixelArrowRight, PixelHeart, PixelFolder, PixelVideo, PixelImage } from './PixelIcons';

type ViewState = 'root' | 'photos' | 'videos';

export const PhotoAlbum: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('root');
  
  // Photos State
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Videos State
  const [videos, setVideos] = useState<Photo[]>([]);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);

  // --- Handlers ---

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto: Photo = {
          id: Date.now().toString(),
          url: reader.result as string,
          caption: "My memory ❤️",
          isUserUploaded: true,
        };
        setPhotos([newPhoto, ...photos]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newVideo: Photo = {
        id: Date.now().toString(),
        url: url,
        caption: "My video memory 🎥",
        isUserUploaded: true,
      };
      setVideos([newVideo, ...videos]);
    }
  };

  // --- Sub-Views (Shared Layout) ---
  const isVideoView = currentView === 'videos';
  const items = isVideoView ? videos : photos;
  const selectedIndex = isVideoView ? selectedVideoIndex : selectedPhotoIndex;
  const setSelectedIndex = isVideoView ? setSelectedVideoIndex : setSelectedPhotoIndex;
  
  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) setSelectedIndex((selectedIndex + 1) % items.length);
  };
  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) setSelectedIndex((selectedIndex - 1 + items.length) % items.length);
  };

  if (currentView === 'root') {
    return (
      <div className="p-4 sm:p-8 flex flex-col items-center justify-center min-h-[65vh] gap-8">
        <div className="text-center max-w-lg mb-4">
           <motion.h2 
             initial={{ y: -20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="font-script text-lg sm:text-2xl md:text-4xl text-white retro-text mb-4 px-2"
           >
             MEMORY VAULT
           </motion.h2>
           <p className="text-love-900 font-sans text-xs sm:text-sm md:text-base bg-white/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/50 inline-block font-bold">
             Select a collection to explore
           </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 w-full max-w-4xl px-4">
           {/* Photos Folder */}
           <motion.button
             whileHover={{ scale: 1.05, y: -8 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => setCurrentView('photos')}
             className="group relative bg-white/20 backdrop-blur-xl border-4 border-white/60 rounded-[2.5rem] p-8 md:p-12 flex flex-col items-center gap-6 shadow-[10px_10px_0_rgba(0,0,0,0.15)] hover:shadow-[12px_12px_0_#be123c] transition-all"
           >
              <div className="relative">
                 <PixelFolder size={80} className="text-yellow-400 drop-shadow-xl sm:w-32 sm:h-32 md:w-40 md:h-40" />
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-4">
                    <PixelImage size={24} className="text-love-600 sm:w-10 sm:h-10 animate-pulse" />
                 </div>
              </div>
              <span className="font-script text-xs sm:text-lg md:text-2xl text-white retro-text tracking-widest" style={{ textShadow: '2px 2px 0 #be123c' }}>PHOTO ALBUM</span>
           </motion.button>

           {/* Videos Folder */}
           <motion.button
             whileHover={{ scale: 1.05, y: -8 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => setCurrentView('videos')}
             className="group relative bg-white/20 backdrop-blur-xl border-4 border-white/60 rounded-[2.5rem] p-8 md:p-12 flex flex-col items-center gap-6 shadow-[10px_10px_0_rgba(0,0,0,0.15)] hover:shadow-[12px_12px_0_#1e40af] transition-all"
           >
              <div className="relative">
                 <PixelFolder size={80} className="text-blue-400 drop-shadow-xl sm:w-32 sm:h-32 md:w-40 md:h-40" />
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-4">
                    <PixelVideo size={24} className="text-white sm:w-10 sm:h-10 animate-pulse" />
                 </div>
              </div>
              <span className="font-script text-xs sm:text-lg md:text-2xl text-white retro-text tracking-widest" style={{ textShadow: '2px 2px 0 #1e40af' }}>VIDEO CLIPS</span>
           </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-12 pb-24 max-w-7xl mx-auto w-full">
      {/* Responsive Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 md:mb-12 gap-6 pt-16 sm:pt-0">
        <div className="flex items-center gap-4 w-full sm:w-auto">
           <button 
             onClick={() => setCurrentView('root')}
             className="pixel-btn pixel-btn-white aspect-square p-2.5 sm:p-4 group shadow-lg"
           >
              <PixelArrowLeft size={20} className="sm:w-6 sm:h-6 group-hover:-translate-x-1 transition-transform" />
           </button>
           <div className="flex flex-col">
              <h2 className="font-script text-xs sm:text-lg md:text-3xl text-white retro-text text-left leading-tight break-words uppercase">
                {isVideoView ? 'VIDEOS' : 'PHOTOS'}
              </h2>
              <span className="text-[9px] sm:text-xs font-bold text-love-900 bg-white/40 px-3 py-0.5 rounded-full w-fit border border-white/20 mt-1 uppercase">
                {items.length} Memories
              </span>
           </div>
        </div>
        
        <label className="pixel-btn pixel-btn-blue text-[9px] sm:text-xs md:text-sm whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 transition-all w-full sm:w-auto justify-center flex items-center gap-3">
          <PixelCamera size={18} className="md:w-6 md:h-6" />
          <span>Upload Memory</span>
          <input 
            type="file" 
            accept={isVideoView ? "video/*" : "image/*"} 
            onChange={isVideoView ? handleVideoUpload : handleFileUpload} 
            className="hidden" 
          />
        </label>
      </div>

      {items.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center min-h-[40vh] text-center px-6 py-12 bg-white/10 rounded-[2.5rem] border-4 border-white/30 backdrop-blur-md shadow-inner"
        >
           <div className="bg-white/20 p-6 rounded-full mb-6 border-2 border-white/40">
              {isVideoView ? <PixelVideo size={48} className="text-white opacity-60" /> : <PixelImage size={48} className="text-white opacity-60" />}
           </div>
           <p className="font-script text-white text-sm sm:text-xl mb-3">FOLDER IS EMPTY</p>
           <p className="font-sans text-white/70 text-xs sm:text-sm max-w-xs font-bold">Add some {isVideoView ? 'videos' : 'photos'} to fill this vault with love! ✨</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 md:gap-10">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              layoutId={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ 
                scale: 1.05, 
                rotate: index % 2 === 0 ? 1.5 : -1.5,
                y: -10,
              }}
              className="relative group cursor-pointer"
              onClick={() => setSelectedIndex(index)}
            >
              {/* Retro Tab */}
              <div className={`absolute -top-3 left-0 w-[60%] h-6 border-t-4 border-l-4 border-r-4 border-gray-900 rounded-t-xl z-0 ${index % 2 === 0 ? (isVideoView ? 'bg-blue-400' : 'bg-love-400') : (isVideoView ? 'bg-blue-500' : 'bg-love-500')}`}></div>
              
              <div className="relative z-10 bg-white p-2 sm:p-3 border-4 border-gray-900 shadow-[8px_8px_0_rgba(0,0,0,0.15)] group-hover:shadow-[12px_12px_0_#be123c] transition-all duration-300 rounded-2xl overflow-hidden">
                  <div className="relative aspect-square overflow-hidden bg-zinc-900 flex items-center justify-center rounded-xl">
                      {isVideoView ? (
                        <div className="w-full h-full relative group/vid">
                           <video src={item.url} className="w-full h-full object-cover opacity-80 group-hover/vid:opacity-100 transition-opacity" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-white/30 backdrop-blur-md p-3 rounded-full border-2 border-white/60 shadow-xl group-hover:scale-110 transition-transform">
                                <PixelVideo size={20} className="text-white" />
                              </div>
                           </div>
                        </div>
                      ) : (
                        <img 
                          src={item.url} 
                          alt={item.caption} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          loading="lazy"
                        />
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-love-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-4">
                          <PixelHeart size={20} className="text-white mb-2 drop-shadow-lg" />
                          <p className="text-white font-sans font-bold text-[9px] sm:text-xs text-center leading-tight line-clamp-2">
                              {item.caption}
                          </p>
                      </div>
                  </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Optimized Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-zinc-950/95 flex items-center justify-center p-4 backdrop-blur-xl"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Nav Arrows - Desktop Only */}
            <button className="absolute left-4 sm:left-8 z-[210] pixel-btn pixel-btn-gray p-4 sm:p-6 rounded-2xl border-4 hidden md:flex hover:scale-110 active:scale-95" onClick={handlePrev}>
              <PixelArrowLeft size={32} />
            </button>
            <button className="absolute right-4 sm:right-8 z-[210] pixel-btn pixel-btn-gray p-4 sm:p-6 rounded-2xl border-4 hidden md:flex hover:scale-110 active:scale-95" onClick={handleNext}>
              <PixelArrowRight size={32} />
            </button>

            <div className="flex flex-col items-center max-w-5xl w-full h-full justify-center p-2 sm:p-8" onClick={(e) => e.stopPropagation()}>
              <div className="absolute top-4 right-4 z-[210]">
                 <button 
                  className="pixel-btn pixel-btn-red p-3 sm:p-4 rounded-xl border-4 shadow-xl"
                  onClick={() => setSelectedIndex(null)}
                >
                  <PixelClose size={20} className="sm:w-8 sm:h-8" />
                </button>
              </div>

              <motion.div
                layoutId={items[selectedIndex].id}
                className="relative border-4 sm:border-8 border-white shadow-2xl bg-zinc-900 w-full max-h-[65vh] flex justify-center overflow-hidden rounded-2xl"
              >
                {isVideoView ? (
                   <video src={items[selectedIndex].url} controls autoPlay className="max-h-[65vh] w-full object-contain" />
                ) : (
                  <img src={items[selectedIndex].url} alt={items[selectedIndex].caption} className="max-h-[65vh] w-full object-contain" />
                )}
              </motion.div>
              
              <div className="mt-6 sm:mt-8 text-center w-full px-4">
                <h3 className="text-sm sm:text-2xl font-sans font-bold text-white mb-6 drop-shadow-xl line-clamp-2">
                  {items[selectedIndex].caption}
                </h3>
                
                <div className="flex gap-4 sm:gap-10 justify-center bg-white/10 p-4 sm:p-6 rounded-3xl backdrop-blur-2xl border-2 border-white/20 shadow-xl max-w-fit mx-auto">
                   <EmojiReaction emoji="❤️" />
                   <EmojiReaction emoji="✨" />
                   <EmojiReaction emoji="😭" />
                </div>
              </div>

              {/* Mobile Swipe Simulation Navigation */}
              <div className="flex gap-8 mt-8 md:hidden">
                <button className="pixel-btn pixel-btn-gray p-4 rounded-xl border-2" onClick={handlePrev}>
                  <PixelArrowLeft size={20} />
                </button>
                <button className="pixel-btn pixel-btn-gray p-4 rounded-xl border-2" onClick={handleNext}>
                  <PixelArrowRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};