import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-white/10 mt-6 md:mt-8 py-8 relative">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center justify-between gap-4">

        <p className="text-sm text-textMuted">
          © 2024 Do Van Nang. All Rights Reserved.
        </p>

        <button
          onClick={scrollToTop}
          className="absolute left-1/2 -top-6 -translate-x-1/2 btn-icon w-12 h-12 bg-[#121212]/60 backdrop-blur-md text-primary border border-primary hover:bg-primary hover:text-white shadow-[0_0_20px_rgba(255,42,133,0.5)] hover:scale-110 transition-all rounded-full flex items-center justify-center cursor-pointer"
        >
          <ArrowUp size={24} />
        </button>

        <p className="text-sm text-textMuted">
          Designed and developed with <span className="text-red-500">❤️</span> by Do Van Nang
        </p>

      </div>
    </footer>
  );
}
