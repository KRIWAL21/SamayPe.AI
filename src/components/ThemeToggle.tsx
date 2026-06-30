'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('samaype_theme');
    if (savedTheme === 'light') {
      setIsLight(true);
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      setIsLight(false);
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      setIsLight(false);
      localStorage.setItem('samaype_theme', 'dark');
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      setIsLight(true);
      localStorage.setItem('samaype_theme', 'light');
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-3 rounded-xl glass-panel border border-purple-500/30 hover:border-cyan-400/50 flex items-center space-x-2 text-xs font-mono font-bold uppercase transition-all cursor-pointer shadow-md"
      title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {isLight ? (
        <>
          <Moon className="w-4 h-4 text-purple-600 animate-pulse" />
          <span className="text-gray-800">Dark</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4 text-yellow-400 animate-spin-slow" />
          <span className="text-gray-200">Light</span>
        </>
      )}
    </motion.button>
  );
}
