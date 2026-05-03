import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Projects from '../components/Projects';
import SkillsAboutContact from '../components/SkillsAboutContact';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

export default function PortfolioView() {
  return (
    <div className="min-h-screen bg-[#050508] relative overflow-clip font-sans text-textMain leading-relaxed selection:bg-primary/30">
      {/* Premium Artisan Background Effects */}
      <style>{`
        @keyframes grid-pan {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(80px, 80px, 0); }
        }
        .animated-grid {
          position: fixed;
          top: -80px;
          left: -80px;
          right: -80px;
          bottom: -80px;
          z-index: 0;
          pointer-events: none;
          background-size: 80px 80px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          mask-image: radial-gradient(ellipse at top center, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 80%);
          animation: grid-pan 15s linear infinite;
          will-change: transform;
        }

        @keyframes meteor-shower {
          0% { transform: translate3d(0, 0, 0) rotate(145deg) scaleX(1); opacity: 0; }
          3% { opacity: 1; }
          12% { opacity: 1; }
          25% { transform: translate3d(-1500px, 1000px, 0) rotate(145deg) scaleX(0.1); opacity: 0; }
          100% { transform: translate3d(-1500px, 1000px, 0) rotate(145deg) scaleX(0); opacity: 0; }
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
          will-change: transform, opacity;
        }
        .meteor-1 { top: -10%; left: 50%; animation: meteor-shower 10s linear infinite 2s; }
        .meteor-2 { top: 10%; left: 100%; animation: meteor-shower 15s linear infinite 5s; width: 200px; filter: drop-shadow(0 0 15px #00c3ff); }
        .meteor-3 { top: -20%; left: 80%; animation: meteor-shower 12s linear infinite 9s; filter: drop-shadow(0 0 10px #7000FF); }
        .meteor-4 { top: 30%; left: 110%; animation: meteor-shower 18s linear infinite 14s; width: 180px; filter: drop-shadow(0 0 12px #ff9a00); }
        .meteor-5 { top: -5%; left: 120%; animation: meteor-shower 9s linear infinite 4s; width: 250px; }

        /* Mobile Optimization: Stop heavy animations to prevent phone overheating */
        @media (max-width: 768px) {
          .meteor {
            display: none !important;
            animation: none !important;
          }
          .animated-grid {
            animation: none !important;
            opacity: 0.7;
          }
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
      
      <Header />
      <div className="w-full flex justify-center relative z-10 px-4 md:px-12">
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
