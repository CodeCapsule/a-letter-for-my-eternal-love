import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Image, Gamepad2, FolderHeart } from 'lucide-react';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <Heart size={20} />, label: 'Home' },
    { path: '/photos', icon: <Image size={20} />, label: 'Photos' },
    { path: '/game', icon: <Gamepad2 size={20} />, label: 'Game' },
    { path: '/messages', icon: <FolderHeart size={20} />, label: 'Messages' },
  ];

  return (
    <>
      {/* Desktop Top Nav */}
      <nav className="hidden md:flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <Link to="/" className="font-script text-3xl text-love-600">Valentine</Link>
        <div className="flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                location.pathname === item.path
                  ? 'bg-love-100 text-love-700 font-semibold'
                  : 'text-gray-600 hover:bg-love-50 hover:text-love-600'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-love-100 z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                location.pathname === item.path
                  ? 'text-love-600'
                  : 'text-gray-400 hover:text-love-400'
              }`}
            >
              <div className={location.pathname === item.path ? 'transform scale-110' : ''}>
                {item.icon}
              </div>
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};