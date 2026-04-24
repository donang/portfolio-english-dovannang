import React from 'react';
import { ArrowRight, Send } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="w-full grid lg:grid-cols-2 gap-12 items-center z-10 relative mt-8 pt-8">
      {/* Left Content */}
      <div className="flex flex-col gap-6 lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl justify-self-center lg:justify-self-start">
        <div className="space-y-2">
          <p className="text-lg text-textMuted font-medium">Xin chào! Mình là 👋</p>
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight">
            NĂNG <span className="text-primary">ĐỖ</span>
          </h1>
          <h2 className="text-5xl md:text-6xl text-gradient font-script mt-2 pb-2">
            Graphic Designer
          </h2>
        </div>
        
        <p className="text-textMuted text-lg leading-relaxed max-w-md mt-4">
          Mình chuyên thiết kế poster, banner, social media design và nhận diện thương hiệu, giúp thương hiệu của bạn nổi bật và thu hút hơn.
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-6">
          <button className="bg-gradient-primary px-8 py-3.5 rounded-full font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
            XEM DỰ ÁN <ArrowRight size={18} />
          </button>
          <button className="px-8 py-3.5 rounded-full border border-white/20 glass-panel glass-panel-hover font-semibold flex items-center gap-2">
            LIÊN HỆ NGAY <Send size={18} />
          </button>
        </div>

        <div className="flex items-center gap-4 mt-8">
          {[
            { id: 'be', icon: <span className="font-bold font-serif text-xl">Bē</span> },
            { id: 'ig', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
            { id: 'dr', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"/><path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"/><path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"/></svg> },
            { id: 'fb', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
          ].map((social) => (
            <a key={social.id} href="#" className="w-12 h-12 rounded-full glass-panel glass-panel-hover flex items-center justify-center border border-white/10 shadow-glow text-white transition-all group hover:bg-white/5">
               <span className="group-hover:scale-110 transition-transform flex items-center justify-center">{social.icon}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Right Image Composition */}
      <div className="relative h-[450px] w-full flex items-center justify-center">
        {/* Glow behind portrait */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-primary/20 blur-[80px] z-0" />
        
        {/* 3D Orbit Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] orbit-ring border-t-primary border-r-transparent border-b-secondary border-l-transparent z-0 opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] orbit-ring border-t-secondary border-r-transparent border-b-primary border-l-transparent z-0 opacity-30" style={{ animationDirection: 'reverse', animationDuration: '10s' }} />
        
        {/* Placeholder for the portrait */}
        <div className="absolute bottom-0 z-10 w-full h-[80%] flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop" 
              alt="Portrait" 
              className="h-full object-contain filter drop-shadow-2xl"
              style={{ maskImage: 'linear-gradient(to top, transparent, black 10%)', WebkitMaskImage: 'linear-gradient(to top, transparent, black 10%)' }}
            />
        </div>

        {/* Floating Elements (Placeholders) */}
        <div className="absolute top-[20%] left-[10%] w-32 h-48 bg-surface rounded-xl border border-white/10 shadow-2xl rotate-[-15deg] z-20 flex flex-col overflow-hidden">
             <div className="bg-primary/20 flex-1 flex items-center justify-center text-xs font-bold text-primary p-2 text-center">FLASH SALE 70% OFF</div>
        </div>
        <div className="absolute top-[10%] right-[10%] w-36 h-44 bg-surface rounded-xl border border-white/10 shadow-2xl rotate-[10deg] z-0 flex flex-col overflow-hidden">
            <div className="bg-orange-500/20 flex-1 flex items-center justify-center text-xs font-bold text-orange-500 p-2 text-center">BURGER Delicious</div>
        </div>
        <div className="absolute bottom-[20%] right-[5%] w-40 h-56 bg-surface rounded-xl border border-white/10 shadow-2xl rotate-[5deg] z-20 flex flex-col overflow-hidden">
            <div className="bg-yellow-500/20 flex-1 flex items-center justify-center text-xs font-bold text-yellow-500 p-2 text-center">LEMONADE</div>
        </div>

        {/* Software Icons */}
        <div className="absolute top-[10%] left-[30%] w-12 h-12 bg-[#001E36] rounded-xl flex items-center justify-center font-bold text-xl shadow-[0_0_30px_rgba(49,168,255,0.3)] z-20 animate-float-medium text-[#31A8FF] border border-[#31A8FF]/30">Ps</div>
        <div className="absolute top-[30%] left-[20%] w-10 h-10 bg-[#331E00] rounded-lg flex items-center justify-center font-bold text-lg shadow-[0_0_30px_rgba(255,154,0,0.3)] z-20 animate-float-slow text-[#FF9A00] border border-[#FF9A00]/30">Ai</div>
        <div className="absolute bottom-[30%] left-[45%] w-14 h-14 bg-[#1E0036] rounded-2xl flex items-center justify-center font-bold text-2xl shadow-[0_0_40px_rgba(153,153,255,0.3)] z-20 animate-float-fast text-[#9999FF] border border-[#9999FF]/30">Ae</div>
      </div>
    </section>
  );
}
