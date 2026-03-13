import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedLogo from './AnimatedLogo';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function GlassNavbar({ onSearchClick }) {
  const { t, language, changeLanguage } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  
  const navItems = [
    { path: '/', key: 'market', icon: '🏠' },
    { path: '/explore', key: 'explore', icon: '🔍' },
    { path: '/upload', key: 'upload', icon: '➕' },
    { path: '/inbox', key: 'inbox', icon: '💬' },
    { path: '/profile', key: 'profile', icon: '👤' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div className="max-w-lg mx-auto px-4 py-3 flex justify-between items-center">
        {/* Live Icon - Top Left */}
        <motion.button
          className="flex items-center gap-1 text-red-500 font-semibold text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          {t('live')}
        </motion.button>

        {/* Logo - Center */}
        <Link to="/">
          <AnimatedLogo size="small" />
        </Link>

        {/* Search Icon - Top Right */}
        <motion.button
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSearchClick}
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </motion.button>
      </div>

      {/* Bottom Navigation - TikTok Style */}
      <div className="max-w-lg mx-auto px-2 pb-2 flex justify-around items-center">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={isAuthenticated ? item.path : '/login'}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              isActive(item.path) 
                ? 'text-mitransh-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs mt-1">{t(item.key)}</span>
            {isActive(item.path) && (
              <motion.div
                className="absolute bottom-0 w-8 h-0.5 bg-mitransh-500"
                layoutId="activeNav"
              />
            )}
          </Link>
        ))}
      </div>

      {/* Language Toggle */}
      <div className="absolute top-3 right-16 flex gap-1">
        <button
          onClick={() => changeLanguage('en')}
          className={`text-xs px-2 py-1 rounded ${
            language === 'en' 
              ? 'bg-mitransh-600 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => changeLanguage('fr')}
          className={`text-xs px-2 py-1 rounded ${
            language === 'fr' 
              ? 'bg-mitransh-600 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          FR
        </button>
      </div>
    </div>
  );
}
