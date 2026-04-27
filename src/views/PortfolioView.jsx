import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Projects from '../components/Projects';
import SkillsAboutContact from '../components/SkillsAboutContact';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import SnakeEasterEgg from '../components/SnakeEasterEgg';

export default function PortfolioView() {
  return (
    <div className="min-h-screen bg-[#050508] relative overflow-clip font-sans text-textMain leading-relaxed selection:bg-primary/30">
      {/* Premium Artisan Background Effects */}
      <style>{`
        @keyframes grid-pan {
          0% { background-position: 0% 0%; }
          100% { background-position: 80px 80px; }
        }
        .animated-grid {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-size: 80px 80px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          mask-image: radial-gradient(ellipse at top center, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 80%);
          animation: grid-pan 15s linear infinite;
        }

        @keyframes meteor-shower {
          0% { transform: translate(0, 0) rotate(145deg) scaleX(1); opacity: 0; }
          3% { opacity: 1; }
          12% { opacity: 1; }
          25% { transform: translate(-1500px, 1000px) rotate(145deg) scaleX(0.1); opacity: 0; }
          100% { transform: translate(-1500px, 1000px) rotate(145deg) scaleX(0); opacity: 0; }
        }
        .meteor {
          position: fixed;
          width: 300px;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,1));
          filter: drop-shadow(0 0 10px #ff2a85) drop-shadow(0 0 20px #00c3ff);
          opacity: 0;
          pointer-events: none;
          z-index: 0;
        }
        .meteor-1 { top: -10%; left: 50%; animation: meteor-shower 10s linear infinite 2s; }
        .meteor-2 { top: 10%; left: 100%; animation: meteor-shower 15s linear infinite 5s; width: 200px; filter: drop-shadow(0 0 15px #00c3ff); }
        .meteor-3 { top: -20%; left: 80%; animation: meteor-shower 12s linear infinite 9s; filter: drop-shadow(0 0 10px #7000FF); }
        .meteor-4 { top: 30%; left: 110%; animation: meteor-shower 18s linear infinite 14s; width: 180px; filter: drop-shadow(0 0 12px #ff9a00); }
        .meteor-5 { top: -5%; left: 120%; animation: meteor-shower 9s linear infinite 4s; width: 250px; }
        
        @keyframes snake-serpentine-bob {
          0%, 100% { transform: translateY(-5px) rotate(2deg); }
          50% { transform: translateY(5px) rotate(-2deg); }
        }
        @keyframes snake-journey {
          0%, 75% { left: 110vw; opacity: 0; }
          76% { left: 110vw; opacity: 1; }
          95% { left: -20vw; opacity: 1; }
          96%, 100% { left: -20vw; opacity: 0; }
        }
        
        .space-core {
          position: fixed;
          top: -20%;
          left: 10%;
          width: 80vw;
          height: 80vw;
          max-width: 800px;
          max-height: 800px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,42,133,0.12) 0%, rgba(0,0,0,0) 65%);
          pointer-events: none;
          mix-blend-screen: screen;
        }
      `}</style>
      
      {/* Lõi Không Gian Đen Than */}
      <div className="fixed inset-0 z-0 bg-[#06040A]"></div>
      
      {/* Vầng Giao Thoa Mờ Tâm Trái */}
      <div className="space-core"></div>
      <div className="space-core !top-[40%] !left-[auto] !right-[-20%] !bg-[radial-gradient(circle,_rgba(112,0,255,0.08)_0%,_rgba(0,0,0,0)_60%)]"></div>

      {/* Lưới Điện Tử Cyber Grid Pan */}
      <div className="animated-grid"></div>

      {/* Mưa Sao Băng (Meteors) Điểm Khuyết Chân Trời */}
      <div className="meteor meteor-1"></div>
      <div className="meteor meteor-2"></div>
      <div className="meteor meteor-3"></div>
      <div className="meteor meteor-4"></div>
      <div className="meteor meteor-5"></div>

      {/* Component Easter Egg Rắn Tương Tác Vật Lý */}
      <SnakeEasterEgg />
      
      <Header />
      <div className="w-full flex justify-center relative z-10 px-6 md:px-12">
        <main className="w-full max-w-[1440px] flex flex-col gap-8 md:gap-12 py-4 md:py-8">
          <Hero />
          <Stats />
          <Projects limit={12} />
          <SkillsAboutContact />
          {/* FAQ */}
          <FAQ />
        </main>
      </div>
      <Footer />
    </div>
  );
}
