import React from 'react';
import { ArrowRight, Send } from 'lucide-react';

const KlingLogo = (
  <img 
    src="https://bochickenstore.com/storage/large/mua-tai-khoan-kling-_1730101453.jpg" 
    alt="Kling AI Logo"
    className="w-[85%] h-[85%] object-contain relative z-10 drop-shadow-[0_4px_10px_rgba(0,195,255,0.4)]"
    style={{ 
      mixBlendMode: 'screen', 
      filter: 'contrast(1.4) saturate(1.2)',
      WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 65%)',
      maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 65%)'
    }}
  />
);

const TechCube = ({ size, bgClass, glowColor, content, positionClass, delay }) => {
  return (
    <div className={`absolute ${positionClass} z-50`} style={{ width: size, height: size, perspective: '1000px' }}>
      <div 
        className="w-full h-full" 
        style={{ animation: 'float-up-down-3d 6s ease-in-out infinite', animationDelay: delay, transformStyle: 'preserve-3d' }}
      >
        <div 
          className="relative w-full h-full cursor-pointer hover-scale-3d"
          style={{ animation: 'spin-cube 15s infinite linear', transformStyle: 'preserve-3d' }}
        >
          {/* LÕI TRONG (INNER CORE) - Bịt kín tuyệt đối các khoảng hở tại các góc bo tròn */}
          {[
            { transform: `rotateY(0deg) translateZ(${size/2 - 2}px)` },
            { transform: `rotateY(90deg) translateZ(${size/2 - 2}px)` },
            { transform: `rotateY(180deg) translateZ(${size/2 - 2}px)` },
            { transform: `rotateY(-90deg) translateZ(${size/2 - 2}px)` },
            { transform: `rotateX(90deg) translateZ(${size/2 - 2}px)` },
            { transform: `rotateX(-90deg) translateZ(${size/2 - 2}px)` }
          ].map((face, index) => (
             <div 
               key={`core-${index}`} 
               className={`absolute inset-0 m-auto ${bgClass}`} 
               style={{ 
                 width: `${size - 4}px`, 
                 height: `${size - 4}px`,
                 transform: face.transform 
               }}
             />
          ))}

          {/* VỎ NGOÀI (OUTER SHELL) - Khuôn viền Neon bo tròn sắc sảo */}
          {[
            { transform: `rotateY(0deg) translateZ(${size/2}px)`, brightness: 'brightness-110' },
            { transform: `rotateY(90deg) translateZ(${size/2}px)`, brightness: 'brightness-90' },
            { transform: `rotateY(180deg) translateZ(${size/2}px)`, brightness: 'brightness-75' },
            { transform: `rotateY(-90deg) translateZ(${size/2}px)`, brightness: 'brightness-90' },
            { transform: `rotateX(90deg) translateZ(${size/2}px)`, brightness: 'brightness-110' },
            { transform: `rotateX(-90deg) translateZ(${size/2}px)`, brightness: 'brightness-50' }
          ].map((face, index) => (
             <div 
               key={`shell-${index}`} 
               className={`absolute inset-0 flex items-center justify-center ${bgClass} rounded-[12px] border-[1.5px] cube-face-sparkle ${face.brightness}`} 
               style={{ 
                 transform: face.transform, 
                 borderColor: glowColor,
                 boxShadow: `0 0 10px ${glowColor}, inset 0 0 10px ${glowColor}`
               }}
             >
               {content}
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Hero() {
  return (
    <section id="home" className="w-full grid lg:grid-cols-2 gap-8 lg:gap-0 items-center z-10 relative pb-10 -mt-0 md:-mt-2 lg:-mt-4 xl:-mt-6">

      {/* --- CỤM BÊN TRÁI: TEXT & BUTTONS --- */}
      <div className="flex flex-col gap-4 w-full z-20 justify-self-center lg:justify-self-start items-center lg:items-start text-center lg:text-left -mt-14 md:-mt-16 lg:-mt-20 xl:-mt-28 px-2 lg:px-0">

        <div className="flex flex-col items-center lg:items-start w-full">
          <p className="text-[13px] md:text-[14px] xl:text-[16px] text-transparent bg-clip-text bg-gradient-to-r from-[#e2e8f0] to-[#b8c2d1] font-medium tracking-[0.02em] mb-1 flex items-center justify-center lg:justify-start gap-2 relative z-20">
            Xin chào! Mình là <span className="animate-waving-hand inline-block origin-bottom-right drop-shadow-md">👋</span>
          </p>

          <h1 className="text-[2.8rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.2rem] xl:text-[6rem] font-black tracking-tighter whitespace-nowrap z-10 flex flex-row items-center justify-center lg:justify-start" style={{ lineHeight: '1' }}>
            <span className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)] mr-4">ĐỖ VĂN</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a85] via-[#b266ff] to-[#00c3ff] drop-shadow-[0_4px_15px_rgba(255,42,133,0.5)]">
              NĂNG
            </span>
          </h1>

          <div className="relative w-full text-center lg:text-left -mt-2 md:-mt-4 xl:-mt-6">
            <div className="relative inline-block">
              <h2 className="text-[2.5rem] sm:text-[3.2rem] md:text-[4.2rem] xl:text-[4.8rem] text-transparent bg-clip-text font-script py-2 relative z-10 tracking-[0.02em] leading-[1.3] filter drop-shadow-[0_0_15px_rgba(215,76,255,0.4)] whitespace-nowrap bg-[linear-gradient(90deg,#00c3ff,#d74cff,#ff2a85,#ffcaa6,#00c3ff,#d74cff)] bg-[length:200%_auto]" style={{ animation: 'gradient-flow 4s linear infinite' }}>
                Graphic Designer
              </h2>
              {/* Đính kim cương TRỰC TIẾP LÊN CHỮ */}
              <svg className="absolute top-[35%] left-[5%] w-4 h-4 md:w-6 md:h-6 text-white drop-shadow-[0_0_8px_#00c3ff] z-20 pointer-events-none" style={{ animation: 'star-sparkle 2s ease-in-out infinite 0s' }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0l1.5 10.5L24 12l-10.5 1.5L12 24l-1.5-10.5L0 12l10.5-1.5L12 0z" />
              </svg>
              <svg className="absolute top-[20%] left-[30%] w-5 h-5 md:w-7 md:h-7 text-white drop-shadow-[0_0_8px_#ff2a85] z-20 pointer-events-none" style={{ animation: 'star-sparkle 3s ease-in-out infinite 0.7s' }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0l1.5 10.5L24 12l-10.5 1.5L12 24l-1.5-10.5L0 12l10.5-1.5L12 0z" />
              </svg>
              <svg className="absolute top-[45%] left-[55%] w-3 h-3 md:w-4 md:h-4 text-white drop-shadow-[0_0_8px_#d74cff] z-20 pointer-events-none" style={{ animation: 'star-sparkle 2.5s ease-in-out infinite 1.2s' }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0l1.5 10.5L24 12l-10.5 1.5L12 24l-1.5-10.5L0 12l10.5-1.5L12 0z" />
              </svg>
              <svg className="absolute top-[10%] right-[10%] w-5 h-5 md:w-8 md:h-8 text-white drop-shadow-[0_0_8px_#00c3ff] z-20 pointer-events-none" style={{ animation: 'star-sparkle 3.5s ease-in-out infinite 0.3s' }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0l1.5 10.5L24 12l-10.5 1.5L12 24l-1.5-10.5L0 12l10.5-1.5L12 0z" />
              </svg>
              <svg className="absolute bottom-[20%] right-[35%] w-4 h-4 md:w-5 md:h-5 text-white drop-shadow-[0_0_8px_#ffcaa6] z-20 pointer-events-none" style={{ animation: 'star-sparkle 2s ease-in-out infinite 1.5s' }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0l1.5 10.5L24 12l-10.5 1.5L12 24l-1.5-10.5L0 12l10.5-1.5L12 0z" />
              </svg>
            </div>
          </div>
        </div>

        <p className="text-[#a0aec0] text-[14px] md:text-[15px] xl:text-[16px] leading-[1.8] max-w-[90%] md:max-w-[480px] xl:max-w-[500px] mt-1 font-normal mx-auto lg:mx-0">
          Mình chuyên thiết kế poster, banner, social media design và nhận diện thương hiệu, giúp thương hiệu của bạn nổi bật và thu hút hơn.
        </p>

        <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mt-5 w-full">
          <button 
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} 
            className="bg-gradient-to-r from-[#ff2a85] to-[#7000FF] hover:from-[#ff1475] hover:to-[#5e00db] text-white rounded-full px-7 xl:px-8 py-3 shadow-[0_10px_30px_-10px_rgba(255,42,133,0.8)] text-[11px] xl:text-[12px] font-bold uppercase tracking-widest transition-all duration-300 hover:scale-[1.03] flex items-center group"
          >
            XEM DỰ ÁN <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>

          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              window.open('https://zalo.me/0969000853', '_blank');
            }}
            className="border-[1.5px] border-white/20 hover:bg-white/5 text-white rounded-full px-7 xl:px-8 py-3 shadow-lg backdrop-blur-sm text-[11px] xl:text-[12px] font-bold uppercase tracking-widest transition-all duration-300 hover:scale-[1.03] flex items-center group"
          >
            LIÊN HỆ NGAY <Send size={14} className="ml-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-center lg:justify-start gap-3 mt-7 xl:mt-9 w-full">
          {[
            { id: 'be', icon: <span className="font-bold font-serif text-[15px]">Bē</span> },
            { id: 'ig', icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="4" ry="4" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg> },
            { id: 'dr', icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" /><path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" /><path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" /></svg> },
            { id: 'fb', icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="none"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" /></svg> },
          ].map((social) => (
            <a key={social.id} href="#" aria-label={`Social link to ${social.id}`} className="w-10 h-10 xl:w-11 xl:h-11 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(255,255,255,0.15)]">
              <span className="flex items-center justify-center">{social.icon}</span>
            </a>
          ))}
        </div>
      </div>

      {/* --- BỘ MÃ CSS DÀNH CHO HIỆU ỨNG GIÓ THỔI VÀ NHẤP NHÔ --- */}
      <style>{`
        @keyframes float-up-down-3d {
          0%, 100% { transform: translate3d(0px, 0px, 0px); }
          50% { transform: translate3d(0px, -20px, 0px); }
        }
        @keyframes flag-flutter {
          0%, 100% { transform: perspective(800px) rotateY(0deg) rotateX(0deg) skewY(0deg); }
          25% { transform: perspective(800px) rotateY(-6deg) rotateX(2deg) skewY(-1deg); }
          75% { transform: perspective(800px) rotateY(6deg) rotateX(-2deg) skewY(1deg); }
        }
        @keyframes star-sparkle {
          0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(45deg); opacity: 1; }
        }
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: -200% 50%; }
        }
        
        @keyframes custom-float-1 {
          0%, 100% { transform: translateY(0) rotate(-8deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        @keyframes custom-float-2 {
          0%, 100% { transform: translateY(0) rotate(14deg); }
          50% { transform: translateY(-15px) rotate(17deg); }
        }
        @keyframes custom-float-3 {
          0%, 100% { transform: translateY(0) rotate(-12deg); }
          50% { transform: translateY(-15px) rotate(-10deg); }
        }
        
        /* 3D CUBE ANIMATIONS */
        .hover-scale-3d {
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .hover-scale-3d:hover {
          transform: scale3d(1.15, 1.15, 1.15);
        }
        @keyframes spin-cube {
          0% { transform: rotateX(-15deg) rotateY(0deg) rotateZ(5deg); }
          100% { transform: rotateX(345deg) rotateY(720deg) rotateZ(365deg); }
        }
        
        .cube-face-sparkle {
          overflow: hidden;
        }
        .cube-face-sparkle::after {
          content: '';
          position: absolute;
          top: -50%; left: -50%; width: 200%; height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent);
          transform: rotate(45deg) translateY(-100%);
          animation: sparkle-sweep 3s infinite ease-in-out;
        }
        @keyframes sparkle-sweep {
          0% { transform: rotate(45deg) translateY(-100%); }
          30%, 100% { transform: rotate(45deg) translateY(100%); }
        }
      `}</style>

      {/* --- CỤM BÊN PHẢI: ĐỒ HOẠ TRUNG TÂM (HIỆU ỨNG POP-OUT AVATAR 3D) --- */}
      <div className="relative w-full h-[550px] lg:h-[750px] flex items-center justify-center lg:justify-end lg:pr-[6%] xl:pr-[12%] 2xl:pr-[15%] mt-8 lg:mt-0 z-0">

        {/* KHÔNG GIAN BẤT BIẾN - 500x500 */}
        <div className="relative w-[340px] h-[340px] md:w-[420px] md:h-[420px] lg:w-[500px] lg:h-[500px] scale-[1.05] md:scale-[1.1] lg:scale-[1.15] xl:scale-[1.2] origin-center lg:origin-right">

          {/* Lớp Vũ trụ tổng (Glows sau cùng) */}
          <div className="absolute top-[20%] left-[20%] w-[120%] h-[120%] rounded-full bg-gradient-to-br from-[#ff2a85]/15 via-[#7000FF]/10 to-transparent blur-[60px] z-[0] -translate-x-[20%] -translate-y-[20%]" />

          {/* Lớp z-0: Nền tối giới hạn của Vòng tròn (Thu nhỏ vào trong để bật Avatar ra ngoài) */}
          <div className="absolute inset-0 scale-[0.80] translate-y-[12%] rounded-full bg-[#050510] z-[0] shadow-[0_0_120px_rgba(255,42,133,0.15)] transition-all duration-500">
            <div className="absolute inset-0 rounded-full blur-[20px] opacity-30 bg-gradient-to-br from-[#ff2a85] via-[#b266ff] to-[#00c3ff]"></div>
          </div>

          {/* Lớp z-10: CÁC VẬT THỂ MẶT SAU NHÂN VẬT KẸP TRONG VÒNG */}

          {/* Burger - Góc Phải Trên (Thu nhỏ về 24%) */}
          <div className="absolute top-[5%] -right-[5%] w-[24%] z-10 transition-transform duration-300 hover:scale-[1.08] hover:z-50"
            style={{ animation: 'custom-float-1 7s ease-in-out infinite' }}>
            <div className="p-[2.5px] rounded-[18px] bg-gradient-to-tr from-[#ffffff] via-[#ff9a00] to-[#ffffff] shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(255,145,77,0.3)] origin-center"
              style={{ animation: 'flag-flutter 4.5s ease-in-out infinite alternate' }}>
              <div className="rounded-[15px] overflow-hidden">
                <img src="/images/poster3.png" alt="Burger Poster" className="w-full h-auto object-cover bg-[#2b1810] block" />
              </div>
            </div>
          </div>

          {/* Lập Phương 1: Ps */}
          <TechCube 
            size={40}
            positionClass="top-[18%] left-[10%]" 
            delay="0s" 
            bgClass="bg-[#020b17]" 
            glowColor="rgba(0,195,255,1)"
            content={<span className="text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,195,255,1)] font-black text-[18px] font-sans tracking-tight">Ps</span>} 
          />

          {/* Lập Phương 2: Ai - Đã kéo vào không phận an toàn để không bị vòng neon cắn mất */}
          <TechCube 
            size={36}
            positionClass="top-[45%] -left-[16%]" 
            delay="-1.5s" 
            bgClass="bg-[#170a02]" 
            glowColor="rgba(255,145,0,1)"
            content={<span className="text-[#ffaa00] drop-shadow-[0_0_8px_rgba(255,145,0,1)] font-black text-[16px] font-sans tracking-tight">Ai</span>} 
          />

          {/* Lớp z-20: BODY LAYER - Thân nhân vật fill gọn gàng bên trong Viền Neon 80% */}
          {/* SỬ DỤNG CLIP-PATH SVG ĐỂ ĐẢM BẢO CHẶN SẠCH 100% VIỀN ÁO DƯỚI BẤT CHẤP LỖI TRÌNH DUYỆT */}
          <div className="absolute inset-0 z-20 pointer-events-none transition-all duration-500"
            style={{
              clipPath: 'circle(40% at 50% 62%)'
            }}>
            <img
              src="/images/portrait.png?v=2"
              className="absolute -bottom-[8%] left-1/2 -translate-x-1/2 h-[125%] w-auto max-w-none object-contain pointer-events-none transition-all duration-500"
              style={{ filter: 'drop-shadow(0 0 6px rgba(5,5,15,0.9)) drop-shadow(0 0 2px rgba(5,5,15,0.9))' }}
            />
          </div>

          {/* Lớp z-30: VÒNG NEON VIỀN SẮC NÉT - Vẽ vòng nhẫn chụp lên cắt đôi khung hình */}
          <div className="absolute inset-0 scale-[0.80] translate-y-[12%] rounded-full border-[2.5px] border-transparent z-30 pointer-events-none mix-blend-screen transition-all duration-500"
            style={{
              background: 'linear-gradient(135deg, #ff2a85 0%, #b266ff 40%, #00c3ff 100%) border-box',
              WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude'
            }}
          />

          {/* Lớp z-40: HEAD LAYER - Phần đầu (Tóc) đâm xuyên phá vỡ vòng Neon */}
          <div className="absolute inset-0 z-40 pointer-events-none" style={{ clipPath: 'polygon(-50% -50%, 150% -50%, 150% 35%, -50% 35%)' }}>
            <img
              src="/images/portrait.png?v=2"
              className="absolute -bottom-[8%] left-1/2 -translate-x-1/2 h-[125%] w-auto max-w-none object-contain pointer-events-none transition-all duration-500"
              style={{ filter: 'drop-shadow(0 0 6px rgba(5,5,15,0.9)) drop-shadow(0 0 2px rgba(5,5,15,0.9))' }}
            />
          </div>

          {/* Lớp z-50: CÁC VẬT THỂ MẶT TIỀN (Các Poster Lơ Lửng Rìa Ngoài) */}

          {/* Flash Sale - Góc Trái Dưới (Thu nhỏ về 28%) */}
          <div className="absolute bottom-[18%] -left-[12%] w-[28%] z-50 transition-transform duration-300 hover:scale-[1.08] hover:z-[60]"
            style={{ animation: 'custom-float-2 8s ease-in-out infinite' }}>
            <div className="p-[2.5px] rounded-[18px] bg-gradient-to-tr from-[#ffffff] via-[#ff2a85] to-[#ffffff] shadow-[0_30px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(255,42,133,0.3)] origin-center"
              style={{ animation: 'flag-flutter 3.5s ease-in-out infinite alternate' }}>
              <div className="rounded-[15px] overflow-hidden">
                <img src="/images/poster1.png" alt="Flash Sale" className="w-full h-auto object-cover bg-[#0d0722] block" />
              </div>
            </div>
          </div>

          {/* Lemonade - Góc Phải Dưới (Thu nhỏ về 25%) */}
          <div className="absolute bottom-[16%] -right-[2%] w-[25%] z-50 transition-transform duration-300 hover:scale-[1.08] hover:z-[60]"
            style={{ animation: 'custom-float-3 9s ease-in-out infinite' }}>
            <div className="p-[2.5px] rounded-[18px] bg-gradient-to-tr from-[#ffffff] via-[#00c3ff] to-[#ffffff] shadow-[0_30px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(0,195,255,0.3)] origin-center"
              style={{ animation: 'flag-flutter 5s ease-in-out infinite alternate' }}>
              <div className="rounded-[15px] overflow-hidden">
                <img src="/images/poster2.png" alt="Lemonade" className="w-full h-auto object-cover bg-[#0a2e1d] block" />
              </div>
            </div>
          </div>

          {/* Lập Phương 3: Pr */}
          <TechCube 
            size={40}
            positionClass="bottom-[15%] left-[25%]" 
            delay="-3.5s" 
            bgClass="bg-[#12021a]" 
            glowColor="rgba(215,76,255,1)"
            content={<span className="text-[#e273ff] drop-shadow-[0_0_8px_rgba(215,76,255,1)] font-black text-[18px] font-sans tracking-tight">Pr</span>} 
          />

          {/* Lập Phương 4: Kling AI */}
          <TechCube 
            size={42}
            positionClass="top-[38%] right-[15%]" 
            delay="-5s" 
            bgClass="bg-[#000000]"
            glowColor="rgba(0,255,163,1)" 
            content={KlingLogo} 
          />

        </div>
      </div>
    </section>
  );
}
