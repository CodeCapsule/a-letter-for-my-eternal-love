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
  const [videos, setVideos] = useState<Photo[]>([]); // Using Photo interface: url is video source
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

  // --- Render Logic ---

  if (currentView === 'root') {
    return (
      <div className="p-4 sm:p-8 flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="text-center mb-4">
           <h2 className="font-script text-lg sm:text-2xl md:text-4xl text-white retro-text mb-3 px-4">
             Our Gallery
           </h2>
           <p className="text-love-900 font-sans text-sm sm:text-base bg-white/30 backdrop-blur-sm px-4 py-1 rounded-full border border-white/40">Select a memory type</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 w-full max-w-2xl px-4">
           {/* Photos Folder */}
           <motion.button
             whileHover={{ scale: 1.05, y: -5 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => setCurrentView('photos')}
             className="group relative bg-white/20 backdrop-blur-md border-4 border-white/50 rounded-2xl p-6 sm:p-10 flex flex-col items-center gap-4 shadow-[8px_8px_0_rgba(0,0,0,0.1)] hover:shadow-[8px_8px_0_#be123c] transition-all"
           >
              <div className="relative">
                 <PixelFolder size={64} className="text-yellow-400 drop-shadow-md sm:w-32 sm:h-32" />
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-2">
                    <PixelImage size={24} className="text-love-600 sm:w-10 sm:h-10" />
                 </div>
              </div>
              <span className="font-script text-base sm:text-xl text-white retro-text tracking-widest" style={{ textShadow: '2px 2px 0 #be123c' }}>Photos</span>
           </motion.button>

           {/* Videos Folder */}
           <motion.button
             whileHover={{ scale: 1.05, y: -5 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => setCurrentView('videos')}
             className="group relative bg-white/20 backdrop-blur-md border-4 border-white/50 rounded-2xl p-6 sm:p-10 flex flex-col items-center gap-4 shadow-[8px_8px_0_rgba(0,0,0,0.1)] hover:shadow-[8px_8px_0_#1e40af] transition-all"
           >
              <div className="relative">
                 <PixelFolder size={64} className="text-blue-400 drop-shadow-md sm:w-32 sm:h-32" />
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-2">
                    <PixelVideo size={24} className="text-white sm:w-10 sm:h-10" />
                 </div>
              </div>
              <span className="font-script text-base sm:text-xl text-white retro-text tracking-widest" style={{ textShadow: '2px 2px 0 #1e40af' }}>Videos</span>
           </motion.button>
        </div>
      </div>
    );
  }

  // --- Sub-Views (Shared Layout) ---
  const isVideoView = currentView === 'videos';
  const items = isVideoView ? videos : photos;
  const selectedIndex = isVideoView ? selectedVideoIndex : selectedPhotoIndex;
  const setSelectedIndex = isVideoView ? setSelectedVideoIndex : setSelectedPhotoIndex;
  
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) setSelectedIndex((selectedIndex + 1) % items.length);
  };
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) setSelectedIndex((selectedIndex - 1 + items.length) % items.length);
  };

  return (
    <div className="p-3 sm:p-6 md:p-10 pb-24 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-10 gap-4 pt-8 sm:pt-0">
        <div className="flex items-center gap-3 w-full sm:w-auto">
           <button 
             onClick={() => setCurrentView('root')}
             className="pixel-btn pixel-btn-white aspect-square p-2 sm:p-3"
           >
              <PixelArrowLeft size={20} />
           </button>
           <h2 className="font-script text-sm sm:text-lg md:text-3xl text-white retro-text text-left leading-tight break-words">
             {isVideoView ? 'Videos' : 'Photos'}
           </h2>
        </div>
        
        <label className="pixel-btn pixel-btn-blue text-[10px] sm:text-xs md:text-sm whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 transition-transform">
          <PixelCamera size={18} className="md:w-5 md:h-5" />
          <span>Upload New</span>
          <input 
            type="file" 
            accept={isVideoView ? "video/*" : "image/*"} 
            onChange={isVideoView ? handleVideoUpload : handleFileUpload} 
            className="hidden" 
          />
        </label>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4 bg-white/10 rounded-3xl border-2 border-white/20 backdrop-blur-sm">
           {isVideoView ? <PixelVideo size={64} className="text-love-200 mb-4 opacity-50" /> : <PixelImage size={64} className="text-love-200 mb-4 opacity-50" />}
           <p className="font-script text-white text-base sm:text-lg mb-2">The vault is empty.</p>
           <p className="font-sans text-white/80 text-sm">Tap the camera icon to start collecting moments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              layoutId={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ 
                scale: 1.05, 
                rotate: index % 2 === 0 ? 3 : -3,
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="relative group cursor-pointer"
              onClick={() => setSelectedIndex(index)}
            >
              <div className={`absolute -top-3 left-0 w-[45%] h-5 border-t-4 border-l-4 border-r-4 border-gray-900 rounded-t-lg z-0 ${index % 2 === 0 ? (isVideoView ? 'bg-blue-300' : 'bg-love-300') : (isVideoView ? 'bg-blue-400' : 'bg-love-400')}`}></div>
              
              <div className="relative z-10 bg-white p-2 border-4 border-gray-900 shadow-[6px_6px_0_rgba(0,0,0,0.15)] group-hover:shadow-[8px_8px_0_#be123c] transition-all duration-300 rounded-lg">
                  <div className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center rounded-sm">
                      {isVideoView ? (
                        <div className="w-full h-full bg-zinc-900 flex items-center justify-center relative">
                           <video src={item.url} className="w-full h-full object-cover opacity-60" />
                           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="bg-white/30 backdrop-blur-md p-3 rounded-full border-2 border-white shadow-lg">
                                <PixelVideo size={24} className="text-white" />
                              </div>
                           </div>
                        </div>
                      ) : (
                        <img 
                          src={item.url} 
                          alt={item.caption} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          loading="lazy"
                        />
                      )}
                      
                      <div className="absolute inset-0 bg-love-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 backdrop-blur-[1px]">
                          <PixelHeart size={24} className="text-love-100 mb-2 drop-shadow-md" />
                          <p className="text-white font-sans font-bold text-xs sm:text-sm text-center leading-tight drop-shadow-md line-clamp-3">
                              {item.caption}
                          </p>
                      </div>
                  </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md"
            onClick={() => setSelectedIndex(null)}
          >
            <button className="absolute top-4 right-4 z-[110] pixel-btn pixel-btn-red p-2.5 sm:p-3 aspect-square" onClick={() => setSelectedIndex(null)}>
              <PixelClose size={24} />
            </button>
            
            <button className="absolute left-4 z-[110] pixel-btn pixel-btn-gray p-3 aspect-square hidden md:flex opacity-70 hover:opacity-100" onClick={handlePrev}>
              <PixelArrowLeft size={32} />
            </button>
            
            <button className="absolute right-4 z-[110] pixel-btn pixel-btn-gray p-3 aspect-square hidden md:flex opacity-70 hover:opacity-100" onClick={handleNext}>
              <PixelArrowRight size={32} />
            </button>

            <div className="flex flex-col items-center max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <motion.div
                layoutId={items[selectedIndex].id}
                className="relative border-4 sm:border-8 border-white shadow-2xl bg-white p-1 sm:p-2 w-full max-h-[75vh] flex justify-center bg-black overflow-hidden rounded-sm"
              >
                {isVideoView ? (
                   <video 
                     src={items[selectedIndex].url} 
                     controls 
                     autoPlay 
                     className="max-h-[65vh] md:max-h-[70vh] w-full object-contain"
                   />
                ) : (
                  <img
                    src={items[selectedIndex].url}
                    alt={items[selectedIndex].caption}
                    className="max-h-[65vh] md:max-h-[70vh] object-contain"
                  />
                )}
              </motion.div>
              
              <div className="mt-4 md:mt-8 text-center w-full px-4">
                <h3 className="text-lg sm:text-xl md:text-3xl font-sans font-bold text-white mb-6 drop-shadow-lg break-words">{items[selectedIndex].caption}</h3>
                <div className="flex gap-4 md:gap-8 justify-center bg-white/10 p-4 md:p-6 rounded-3xl backdrop-blur-lg border border-white/20 shadow-xl max-w-fit mx-auto">
                   <EmojiReaction emoji="❤️" />
                   <EmojiReaction emoji="😍" />
                   <EmojiReaction emoji="✨" />
                   <EmojiReaction emoji="🔥" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};