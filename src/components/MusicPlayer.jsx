import React, { useState, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Disc3, MoveHorizontal } from 'lucide-react';

export default function InteractiveShowcase() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef(null);

  // Ảnh Album Cover Hãy Trao Cho Anh
  const albumArt = "https://upload.wikimedia.org/wikipedia/vi/a/a2/H%C3%A3y_trao_cho_anh_%28S%C6%A1n_T%C3%B9ng_M-TP_song%29.jpg"; 

  // Ảnh Before / After demo
  const imgBefore = "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop"; // Wireframe/Sketch
  const imgAfter = "https://images.unsplash.com/photo-1547028298-0c6feaf67664?q=80&w=800&auto=format&fit=crop"; // Final UI Render

  const handleSliderChange = (e) => {
    setSliderPos(e.target.value);
  };

  return (
    <section className="w-full relative py-12 md:py-16 mt-4 mb-8" id="interactive-showcase">
      
      {/* Vệt ánh sáng phía sau */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-[radial-gradient(circle_at_center,_rgba(255,42,133,0.1)_0%,_rgba(0,0,0,0)_60%)] -z-10 blur-2xl pointer-events-none"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl mx-auto px-4 md:px-0">
        
        {/* ================= COLUMN 1: MUSIC PLAYER ================= */}
        <div className="glass-panel w-full bg-[#0b0c10]/60 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-8 border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group h-full min-h-[400px]">
          
          {/* Glow chạy viền tàng hình */}
          <div className={`absolute -inset-[100%] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#ff2a85_100%)] opacity-10 -z-10 transition-all duration-1000 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}></div>

          {/* Khối Đĩa Than (Vinyl) */}
          <div className="relative w-40 h-40 md:w-48 md:h-48 shrink-0">
            <div 
              className="w-full h-full rounded-full bg-[#0a0a0a] shadow-[0_10px_30px_rgba(0,0,0,1)] border border-white/10 flex items-center justify-center relative overflow-hidden z-10"
              style={{ 
                 animation: isPlaying ? 'spin 10s linear infinite' : 'none',
                 background: 'repeating-radial-gradient( circle at center, #111, #111 2px, #000 3px, #000 4px )'
              }}
            >
              <div className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.02)_40%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.02)_60%)] pointer-events-none"></div>

              {/* Album Cover Ở Tâm */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-[3px] border-[#050505] overflow-hidden relative z-20">
                 <img src={albumArt} alt="Album Art" className="w-full h-full object-cover scale-110" />
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#111] rounded-full border border-[#0a0a0a] shadow-inner"></div>
              </div>
            </div>
            
            {/* Kim chỉ đĩa (Stylus Tonal Arm) */}
            <div 
               className="absolute top-[-10px] right-[-10px] w-3 h-28 md:h-32 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full origin-top transform z-30 transition-all duration-700 border border-white/30"
               style={{ transform: isPlaying ? 'rotate(25deg)' : 'rotate(0deg)' }}
            >
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-7 bg-black rounded-sm border border-white/20"></div>
            </div>
          </div>

          {/* Nội dung Trình phát nhạc */}
          <div className="flex-1 flex flex-col w-full text-center items-center z-20">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-widest border border-primary/20 flex gap-2 items-center">
                 <Disc3 size={12} className={isPlaying ? "animate-spin" : ""} /> M-TP Entertainment
              </span>
              <div className="flex items-end gap-[3px] h-3">
                 <div className={`w-1 bg-orange-400 rounded-full ${isPlaying ? 'eq-bar-1' : 'h-[2px]'}`} />
                 <div className={`w-1 bg-primary rounded-full ${isPlaying ? 'eq-bar-2' : 'h-[2px]'}`} />
                 <div className={`w-1 bg-purple-400 rounded-full ${isPlaying ? 'eq-bar-3' : 'h-[2px]'}`} />
                 <div className={`w-1 bg-orange-400 rounded-full ${isPlaying ? 'eq-bar-4' : 'h-[2px]'}`} />
              </div>
            </div>

            <h3 className="text-xl md:text-2xl font-extrabold text-white mt-1 mb-1 drop-shadow-md tracking-tight">
              Hãy Trao Cho Anh
            </h3>
            <p className="text-xs md:text-sm text-textMuted font-medium mb-6">
              Sơn Tùng M-TP ft. Snoop Dogg
            </p>

            <div className="w-full max-w-[250px] mb-6 group/seeker cursor-pointer">
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
                 <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 via-primary to-purple-500 rounded-full w-[35%] group-hover/seeker:bg-primary transition-colors"></div>
              </div>
              <div className="flex justify-between text-[10px] text-textMuted mt-1.5 font-mono">
                 <span>1:25</span>
                 <span>4:05</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6">
              <button className="text-white/40 hover:text-white transition-all hover:-translate-x-1"><SkipBack size={24} fill="currentColor" /></button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
              </button>
              <button className="text-white/40 hover:text-white transition-all hover:translate-x-1"><SkipForward size={24} fill="currentColor" /></button>
            </div>
          </div>
        </div>

        {/* ================= COLUMN 2: BEFORE / AFTER SLIDER ================= */}
        <div className="glass-panel w-full bg-[#0b0c10]/60 rounded-[2.5rem] p-4 md:p-6 flex flex-col items-center justify-center gap-6 border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden min-h-[400px]">
          
          <div className="w-full text-center">
            <h3 className="text-lg md:text-xl font-bold text-white tracking-wide">
              Từ Phác Thảo <span className="text-primary mx-2">→</span> Hoàn Thiện
            </h3>
            <p className="text-xs text-textMuted mt-1 mb-2">Kéo thanh trượt để so sánh bản nháp và thực tế</p>
          </div>

          <div 
            className="relative w-full h-[300px] md:h-[100%] rounded-[1.5rem] overflow-hidden select-none touch-none bg-black/50 border border-white/10"
            ref={sliderRef}
          >
            {/* Ảnh After (Dưới cùng - Rendered) */}
            <img 
              src={imgAfter} 
              alt="Final Render" 
              className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
              draggable="false"
            />
            <span className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md pointer-events-none z-10">
               Design
            </span>

            {/* Ảnh Before (Phủ lên trên - Cắt bởi clipPath) */}
            <div 
              className="absolute inset-0 h-full overflow-hidden pointer-events-none border-r-2 border-white/80 shadow-[2px_0_10px_rgba(0,0,0,0.5)]"
              style={{ width: `${sliderPos}%` }}
            >
              <img 
                src={imgBefore} 
                alt="Sketch Wireframe" 
                className="absolute inset-0 w-full h-full object-cover min-w-[200vw] lg:min-w-[800px]" 
                style={{ width: '100%', maxWidth: 'none' }} // Trick to keep img from squishing
                draggable="false"
              />
              <span className="absolute bottom-4 left-4 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md z-10 w-max">
                 Sketch
              </span>
            </div>

            {/* Slider Nút kéo */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderPos}
              onChange={handleSliderChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />

            {/* Icon Handle (Được đẩy theo %) */}
            <div 
               className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white text-black rounded-full shadow-[0_0_15px_rgba(255,42,133,0.5)] border-2 border-primary/20 flex items-center justify-center pointer-events-none z-30 transition-transform hover:scale-110"
               style={{ left: `${sliderPos}%` }}
            >
               <MoveHorizontal size={20} />
            </div>

          </div>

        </div>

      </div>
      
      {/* Khai báo animation local cho EQ */}
      <style>{`
        @keyframes eq {
          0% { height: 2px; }
          100% { height: 12px; }
        }
        .eq-bar-1 { animation: eq 0.6s ease-in-out infinite alternate; }
        .eq-bar-2 { animation: eq 0.4s ease-in-out infinite alternate-reverse; }
        .eq-bar-3 { animation: eq 0.7s ease-in-out infinite alternate; }
        .eq-bar-4 { animation: eq 0.5s ease-in-out infinite alternate-reverse; }
      `}</style>
    </section>
  );
}
