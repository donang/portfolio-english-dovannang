import React, { useEffect } from 'react';
import Header from '../components/Header';
import Projects from '../components/Projects';
import Footer from '../components/Footer';

export default function AllProjectsView() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#050508] relative overflow-clip font-sans text-textMain leading-relaxed selection:bg-primary/30">
      {/* Performant Liquid Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      <div className="fixed top-[-20%] right-[-10%] w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[radial-gradient(circle,_rgba(255,42,133,0.15)_0%,_rgba(0,0,0,0)_60%)] rounded-full animate-float-slow pointer-events-none" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-[radial-gradient(circle,_rgba(138,43,226,0.15)_0%,_rgba(0,0,0,0)_60%)] rounded-full animate-float-medium pointer-events-none" />

      {/* Subtle Pattern Overlay instead of heavy SVG Noise */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] bg-repeat" />

      <Header />
      <div className="w-full flex justify-center mt-20 md:mt-24 relative z-10">
        <main className="w-full max-w-[1440px] px-6 md:px-12 flex flex-col gap-12 py-4 mb-20">
          <div className="flex flex-col gap-4 text-center items-center justify-center pt-8 pb-4">
            <h1 className="text-4xl md:text-5xl font-bold font-heading uppercase tracking-widest text-gradient shine-effect">
              Toàn Bộ Tác Phẩm
            </h1>
            <p className="text-textMuted max-w-2xl">
              Khám phá toàn bộ kho lưu trữ các dự án thiết kế sáng tạo của tôi. Mọi ý tưởng đều bắt đầu từ một điểm chạm nhỏ.
            </p>
          </div>
          <Projects limit={undefined} />
        </main>
      </div>
      <Footer />
    </div>
  );
}
