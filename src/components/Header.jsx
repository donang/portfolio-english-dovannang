import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

const Header = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const sections = ['home', 'projects', 'skills', 'about', 'contact'];
    
    // IntersectionObserver is lightweight and zero-lag compared to window.onScroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, {
      rootMargin: '-20% 0px -80% 0px',
      threshold: 0
    });

    sections.forEach(section => {
      const el = document.getElementById(section);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
      // observer handles the active state automatically
    } else {
      window.location.href = `/#${targetId}`;
    }
  };

  const getLinkClass = (sectionId) => {
    const isActive = activeSection === sectionId;
    return `transition-all text-sm font-semibold relative py-2 ${
      isActive ? "" : "text-textMuted hover:text-white"
    }`;
  };

  const getTextStyle = (sectionId) => {
    return activeSection === sectionId ? "bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400" : "";
  };

  const activeIndicator = (isActive) => isActive ? (
    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(255,42,133,0.8)]" />
  ) : null;

  return (
    <header className="relative w-full flex justify-center z-[100] transition-all pt-2 md:sticky md:top-0 md:w-full px-4 md:px-12">
      {/* Trong suốt hoàn toàn theo yêu cầu */}
      
      <div className="w-full max-w-[1440px] py-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative z-10">
        <div className="flex items-center justify-start w-full md:w-auto gap-3 shrink-0">
          {/* AI Generated Pure Logo N */}
          <div className="flex items-center justify-center shrink-0 pr-1 group cursor-pointer">
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-[10px] md:rounded-xl overflow-hidden shadow-[0_2px_15px_rgba(255,42,133,0.3)] group-hover:shadow-[0_4px_20px_rgba(255,42,133,0.6)] group-hover:scale-105 transition-all duration-300 border border-white/10 flex items-center justify-center">
              <img src="/logo_n.png" alt="Đỗ Văn Năng Logo" className="w-full h-full object-cover scale-[1.15]" />
            </div>
          </div>
          
          {/* Tên & Vị trí */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1.5 -mb-0.5">
                <span className="text-[18px] md:text-[22px] font-bold tracking-tight font-sans text-white leading-tight">
                   Đỗ Văn
                </span>
                <span className="text-[18px] md:text-[22px] font-bold tracking-tight font-sans bg-clip-text text-transparent bg-gradient-to-br from-purple-400 to-primary leading-tight pr-1 py-1">
                   Năng
                </span>
            </div>
            <span className="text-[8px] md:text-[9.5px] text-textMuted uppercase tracking-[0.25em] font-bold leading-none lg:-mt-0.5">
              Graphic Designer
            </span>
          </div>
        </div>

      <nav className="flex items-center flex-nowrap gap-6 md:gap-10 text-[13px] md:text-sm overflow-x-auto w-full md:w-auto pb-2 md:pb-0 px-2 md:px-0 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
        <a href="#home" onClick={(e) => handleClick(e, 'home')} className={`whitespace-nowrap shrink-0 ${getLinkClass('home')}`}>
          <span className={getTextStyle('home')}>Trang chủ</span>
          {activeIndicator(activeSection === 'home')}
        </a>

        <a href="#projects" onClick={(e) => handleClick(e, 'projects')} className={`whitespace-nowrap shrink-0 ${getLinkClass('projects')}`}>
          <span className={getTextStyle('projects')}>Dự án</span>
          {activeIndicator(activeSection === 'projects')}
        </a>

        <a href="#skills" onClick={(e) => handleClick(e, 'skills')} className={`whitespace-nowrap shrink-0 ${getLinkClass('skills')}`}>
          <span className={getTextStyle('skills')}>Kỹ năng</span>
          {activeIndicator(activeSection === 'skills')}
        </a>

        <a href="#about" onClick={(e) => handleClick(e, 'about')} className={`whitespace-nowrap shrink-0 ${getLinkClass('about')}`}>
          <span className={getTextStyle('about')}>Về mình</span>
          {activeIndicator(activeSection === 'about')}
        </a>

        <a href="#contact" onClick={(e) => handleClick(e, 'contact')} className={`whitespace-nowrap shrink-0 ${getLinkClass('contact')}`}>
          <span className={getTextStyle('contact')}>Liên hệ</span>
          {activeIndicator(activeSection === 'contact')}
        </a>
      </nav>

      <div className="hidden md:flex justify-end w-auto min-w-[200px]">
        <button className="flex items-center text-white rounded-xl text-[11px] font-semibold px-6 py-2.5 transition-all shadow-[0_0_20px_rgba(112,0,255,0.15)] border border-purple-500/50 hover:bg-white/5">
          TẢI CV <Download size={14} className="ml-2 opacity-80" />
        </button>
      </div>
      </div>
    </header>
  );
};

export default Header;
