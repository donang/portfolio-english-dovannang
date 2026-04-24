import React from 'react';
import { Download } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-4 px-6 md:px-12 flex justify-center z-50 sticky top-0 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="w-full max-w-[1440px] flex items-center justify-between">
        <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight">
          Năng Đỗ
        </span>
        <span className="text-xs text-textMuted uppercase tracking-widest mt-[-2px]">
          Graphic Designer
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        <a href="#home" className="text-primary relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-primary after:rounded-full">Trang chủ</a>
        <a href="#projects" className="text-textMuted hover:text-white transition-colors">Dự án</a>
        <a href="#skills" className="text-textMuted hover:text-white transition-colors">Kỹ năng</a>
        <a href="#about" className="text-textMuted hover:text-white transition-colors">Về mình</a>
        <a href="#contact" className="text-textMuted hover:text-white transition-colors">Liên hệ</a>
      </nav>

      <button className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 hover:border-white/30 transition-all glass-panel text-sm font-medium">
        TẢI CV <Download size={16} />
      </button>
      </div>
    </header>
  );
};

export default Header;
