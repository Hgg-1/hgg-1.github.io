'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-white/90 backdrop-blur-md shadow-lg border-b border-primary/20"></div>
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center relative">
        <Link href="/" 
          className="group flex items-center space-x-2"
          onMouseEnter={() => setHoveredItem('home')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="h-12 w-12 relative overflow-hidden animate-bounce">
            <div className="absolute inset-0 bg-primary rounded-full shadow-inner"></div>
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">作</div>
          </div>
          <div className="relative">
            <span className="text-2xl font-bold text-dark tracking-widest font-cute">Collection of Works</span>
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 ${
              hoveredItem === 'home' ? 'w-full' : 'w-0'
            }`}></span>
          </div>
        </Link>
        
        <div className="flex items-center space-x-8">
          <Link 
            href="/portfolio" 
            className="relative text-lg text-dark hover:text-primary transition-colors"
            onMouseEnter={() => setHoveredItem('portfolio')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span>作品展示</span>
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 ${
              hoveredItem === 'portfolio' ? 'w-full' : 'w-0'
            }`}></span>
          </Link>
          
          <Link 
            href="/contact" 
            className="relative text-lg text-dark hover:text-primary transition-colors"
            onMouseEnter={() => setHoveredItem('contact')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span>联系我</span>
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 ${
              hoveredItem === 'contact' ? 'w-full' : 'w-0'
            }`}></span>
          </Link>
        </div>
      </nav>
    </header>
  );
} 