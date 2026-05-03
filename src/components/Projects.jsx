import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

const categories = ['Tất cả', 'Poster', 'Banner', 'Social Media', 'Branding', 'Thumbnail', 'Others'];

const defaultProjects = [
  { id: 'mock1', title: 'Poster Quảng Cáo Đồ Ăn', category: 'Poster Design', color: 'bg-red-900/50', image: '' },
  { id: 'mock2', title: 'Banner Khuyến Mãi', category: 'Banner Design', color: 'bg-green-900/50', image: '' },
  { id: 'mock3', title: 'Bộ Nhận Diện Thương Hiệu', category: 'Branding Design', color: 'bg-emerald-900/50', image: '' },
  { id: 'mock4', title: 'Social Post Facebook', category: 'Social Media Design', color: 'bg-blue-900/50', image: '' },
];

export default function Projects({ limit }) {
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLightboxProject, setSelectedLightboxProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllOverlay, setShowAllOverlay] = useState(false);
  const [slideDirection, setSlideDirection] = useState('none'); // 'left' | 'right' | 'none'

  // Swipe gesture state for mobile lightbox
  const touchStartX = React.useRef(0);
  const touchEndX = React.useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    const SWIPE_THRESHOLD = 50;
    if (!selectedLightboxProject?.images?.length) return;
    if (diff > SWIPE_THRESHOLD) {
      // Vuốt sang trái → ảnh tiếp theo
      setSlideDirection('right');
      setCurrentImageIndex(prev => prev === selectedLightboxProject.images.length - 1 ? 0 : prev + 1);
    } else if (diff < -SWIPE_THRESHOLD) {
      // Vuốt sang phải → ảnh trước
      setSlideDirection('left');
      setCurrentImageIndex(prev => prev === 0 ? selectedLightboxProject.images.length - 1 : prev - 1);
    }
  };

  // Preload adjacent images for instant navigation
  useEffect(() => {
    if (!selectedLightboxProject?.images?.length) return;
    const imgs = selectedLightboxProject.images;
    const toPreload = [1, 2, -1].map(offset => (currentImageIndex + offset + imgs.length) % imgs.length);
    toPreload.forEach(idx => {
      const img = new window.Image();
      img.src = imgs[idx];
    });
  }, [selectedLightboxProject, currentImageIndex]);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projs = [];
      snapshot.forEach((doc) => {
        projs.push({ id: doc.id, ...doc.data() });
      });
      setDbProjects(projs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Block body scroll when lightbox or overlay is open
  useEffect(() => {
    if (selectedLightboxProject || showAllOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedLightboxProject, showAllOverlay]);

  const displayProjects = dbProjects.length > 0 ? dbProjects : defaultProjects;

  const filteredProjects = activeTab === 'Tất cả'
    ? displayProjects
    : displayProjects.filter(p => p.category === activeTab || p.category?.replace(' Design', '') === activeTab || p.category === activeTab + ' Design');

  const finalProjects = limit ? filteredProjects.slice(0, limit) : filteredProjects;

  const renderProjectCard = (project) => (
    <div key={project.id} onClick={() => { setSelectedLightboxProject(project); setCurrentImageIndex(0); }} className="relative flex flex-col group/card cursor-pointer rounded-2xl transition-all duration-500 hover:-translate-y-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] bg-white/5 p-[2px] w-full aspect-[2/3] isolate">

      {/* Flawless True Border Beam (Offset Path) - Added overflow-hidden to child wrapper to explicitly clip bleeding webkit bugs */}
      <div className="absolute inset-0 z-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl overflow-hidden">
        <div className="absolute w-[200px] h-[200px] z-0 drop-shadow-[0_0_10px_#ff2a85]"
          style={{
            offsetPath: 'rect(0 auto auto 0 round 16px)',
            offsetAnchor: '100% 50%',
            animation: 'border-beam 6s linear infinite',
            background: 'radial-gradient(ellipse at right, #ffffff, #ff2a85 20%, transparent 80%)',
          }}
        />
      </div>

      {/* Inner Card Solid Background (Masks the center) */}
      <div className="relative flex flex-col w-full h-full bg-[#0f1118] rounded-[14px] p-1.5 z-10">
        <div className="w-full flex-1 min-h-0 rounded-xl bg-surfaceLight overflow-hidden relative border border-white/5 shadow-inner block z-10">
          {(project.images?.[0] || project.imageUrl || project.image) ? (
            <img
              src={project.images?.[0] || project.imageUrl || project.image}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover/card:scale-105 transition-transform"
              onLoad={(e) => e.target.classList.remove('opacity-0')}
            />
          ) : (
            <div className={`w-full h-full ${project.color || 'bg-slate-800'}`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 z-10" />
          {project.images?.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md z-20 backdrop-blur-sm border border-white/20">
              {project.images.length} ẢNH
            </div>
          )}
          <div className="absolute top-2 left-2 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-300 z-20">
            <div className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur-sm border border-white/20">
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-0.5" />
            </div>
          </div>
        </div>
        <div className="px-1 pt-2 pb-0.5 shrink-0 flex flex-col items-start text-left z-10 bg-[#0f1118]">
          <h3 className="font-bold text-sm text-white group-hover/card:text-primary transition-colors line-clamp-1 truncate w-full">{project.title}</h3>
          <p className="text-[10px] text-primary/80 mt-1 uppercase font-bold tracking-[0.05em] truncate w-full">{project.category || 'Portfolio'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section id="projects" className="w-full flex flex-col gap-5 md:gap-8 -mt-2 md:-mt-6">
      <style>{`
        @keyframes galleryFadeInUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes modalScaleUp {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes smoothFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .gallery-item {
          opacity: 0;
          animation: galleryFadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .modal-frame {
          animation: modalScaleUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .slide-right,
        .slide-left,
        .slide-none {
          animation: smoothFadeIn 0.4s ease-out forwards;
        }
      `}</style>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-4">
        <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-widest font-sans flex items-center gap-3">
          <span className="text-white drop-shadow-md">DỰ ÁN</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-primary drop-shadow-[0_0_15px_rgba(255,42,133,0.3)] inline-block pb-2 pt-3 -mb-2 -mt-3">NỔI BẬT</span>
        </h2>

        {limit && (
          <button onClick={() => setShowAllOverlay(true)} className="text-[11px] text-textMuted hover:text-white uppercase tracking-[0.2em] font-bold flex items-center transition-colors group">
            XEM TẤT CẢ DỰ ÁN <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3 -mt-2 md:-mt-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all ${activeTab === cat
              ? 'bg-gradient-to-r from-purple-600 to-primary text-white shadow-[0_0_20px_rgba(255,42,133,0.4)]'
              : 'bg-white/5 text-textMuted hover:text-white hover:bg-white/10 ring-1 ring-inset ring-white/5'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="relative group -mt-2 md:-mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 xl:gap-5 min-h-[300px]">
          {loading ? (
            <div className="col-span-full flex items-center justify-center text-primary h-48">
              <Loader2 className="animate-spin" size={32} />
              <span className="ml-2 font-bold uppercase tracking-wider text-sm">Đang tải dự án...</span>
            </div>
          ) : finalProjects.map((project, idx) => (
            <div key={project.id} className="transition-all duration-500 hover:scale-[1.02] gallery-item" style={{ animationDelay: `${idx * 0.08}s` }}>
              {renderProjectCard(project)}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Pop-up with Carousel navigation */}
      {selectedLightboxProject && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-12 cursor-zoom-out"
          onClick={() => setSelectedLightboxProject(null)}
        >
          <div className="absolute top-6 flex justify-between w-full px-6 pointer-events-none z-[60]">
            <div className="text-white drop-shadow-lg">
              <h3 className="font-bold text-2xl font-heading">{selectedLightboxProject.title}</h3>
              <p className="text-sm text-textMuted uppercase tracking-widest font-bold">{selectedLightboxProject.category}</p>
            </div>
            <button
              aria-label="Close Lightbox"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-xl ring-1 ring-inset ring-white/10 hover:bg-white/10 text-white pointer-events-auto hover:scale-110 transition-all shadow-xl"
              onClick={() => setSelectedLightboxProject(null)}
            >
              <span className="font-bold text-lg">X</span>
            </button>
          </div>

          <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
            {selectedLightboxProject.images?.length > 1 && (
              <button
                autoFocus
                aria-label="Previous Image"
                className="absolute left-4 md:left-12 w-12 h-12 md:w-14 md:h-14 hidden md:flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md shadow-[0_0_15px_rgba(255,42,133,0.3)] ring-1 ring-inset ring-white/10 hover:bg-black/80 hover:ring-white/20 text-white pointer-events-auto hover:scale-110 z-50 transition-all"
                onClick={(e) => { e.stopPropagation(); setSlideDirection('left'); setCurrentImageIndex(prev => prev === 0 ? selectedLightboxProject.images.length - 1 : prev - 1) }}
              >
                <ChevronLeft size={28} />
              </button>
            )}

            <img
              key={currentImageIndex}
              src={selectedLightboxProject.images?.[currentImageIndex] || selectedLightboxProject.imageUrl || selectedLightboxProject.image}
              alt="Fullscreen Preview"
              loading="eager"
              className={`max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain rounded-2xl shadow-3d pointer-events-auto cursor-default slide-${slideDirection} select-none`}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              draggable={false}
            />

            {selectedLightboxProject.images?.length > 1 && (
              <button
                aria-label="Next Image"
                className="absolute right-4 md:right-12 w-12 h-12 md:w-14 md:h-14 hidden md:flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md shadow-[0_0_15px_rgba(255,42,133,0.3)] ring-1 ring-inset ring-white/10 hover:bg-black/80 hover:ring-white/20 text-white pointer-events-auto hover:scale-110 z-50 transition-all"
                onClick={(e) => { e.stopPropagation(); setSlideDirection('right'); setCurrentImageIndex(prev => prev === selectedLightboxProject.images.length - 1 ? 0 : prev + 1) }}
              >
                <ChevronRight size={28} />
              </button>
            )}
          </div>

          {selectedLightboxProject.images?.length > 1 && (
            <div className="absolute bottom-6 flex gap-2 pointer-events-none z-50">
              {selectedLightboxProject.images.map((_, idx) => (
                <div key={idx} className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-primary scale-125' : 'bg-white/20'}`} />
              ))}
            </div>
          )}
        </div>,
        document.body
      )}

      {/* Framed All Projects Gallery */}
      {showAllOverlay && createPortal(
        <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 md:p-8 lg:p-12 animate-[fadeIn_0.5s_ease-out]">
          {/* The App Framed Modal */}
          <div className="modal-frame relative w-full h-full max-w-7xl max-h-[95vh] bg-[#0A0D14] border border-white/10 rounded-2xl md:rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col isolation-auto">
            {/* Top Sticky Navigation Bar */}
            <div className="shrink-0 w-full z-50 px-6 py-4 md:px-10 md:py-6 flex items-center justify-between border-b border-white/5 bg-[#0f1118]/80 backdrop-blur-md shadow-lg">
              <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-widest font-sans flex items-center gap-3">
                <span className="text-white drop-shadow-md">KHO</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-primary drop-shadow-[0_0_15px_rgba(255,42,133,0.3)]">CHÍNH</span>
              </h2>

              <button
                aria-label="Close Gallery"
                className="group/close w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-xl ring-1 ring-inset ring-white/10 hover:bg-primary/20 hover:ring-primary/50 text-white hover:scale-110 transition-all shadow-xl"
                onClick={() => setShowAllOverlay(false)}
              >
                <span className="font-bold text-2xl leading-none group-hover/close:rotate-90 transition-transform duration-300">×</span>
              </button>
            </div>

            {/* Modal Scrollable Content Region */}
            <div className="flex-1 w-full overflow-y-auto overflow-x-hidden custom-scrollbar bg-[#0f1118]/20">
              <div className="w-full max-w-6xl mx-auto px-4 md:px-10 py-8 flex flex-col gap-6 md:gap-8 min-h-full">
                {/* Filter Tabs in the immersive view */}
                <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                  {categories.map((cat) => (
                    <button
                      key={'modal-' + cat}
                      onClick={() => setActiveTab(cat)}
                      className={`px-4 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-bold transition-all ${activeTab === cat
                        ? 'bg-gradient-to-r from-purple-600 to-primary text-white shadow-[0_0_20px_rgba(255,42,133,0.4)]'
                        : 'bg-white/5 text-textMuted hover:text-white hover:bg-white/10 ring-1 ring-inset ring-white/5'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Grid mapping all filteredProjects */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-2 lg:mt-4 pb-20">
                  {filteredProjects.map((project, idx) => (
                    <div key={'gallery-' + project.id} className="transition-all duration-500 hover:scale-[1.02] gallery-item" style={{ animationDelay: `${idx * 0.08}s` }}>
                      {renderProjectCard(project)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
