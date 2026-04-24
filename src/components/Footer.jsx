import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-white/10 mt-12 py-8 relative">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center justify-between gap-4">

        <p className="text-sm text-textMuted">
          © 2024 Năng Đỗ. All Rights Reserved.
        </p>

        <button
          onClick={scrollToTop}
          className="absolute left-1/2 -top-6 -translate-x-1/2 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-primary border border-primary/30 hover:bg-primary hover:text-white transition-all shadow-[0_0_15px_rgba(255,42,133,0.3)]"
        >
          <ArrowUp size={20} />
        </button>

        <p className="text-sm text-textMuted">
          Thiết kế và phát triển với <span className="text-red-500">❤️</span> bởi Năng Đỗ
        </p>

      </div>
    </footer>
  );
}
