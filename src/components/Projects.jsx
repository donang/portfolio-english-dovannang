import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const categories = ['Tất cả', 'Poster', 'Banner', 'Social Media', 'Branding', 'Thumbnail', 'Others'];

const projects = [
  { id: 1, title: 'Poster Quảng Cáo Đồ Ăn', category: 'Poster Design', color: 'bg-red-900/50', image: '' },
  { id: 2, title: 'Banner Khuyến Mãi', category: 'Banner Design', color: 'bg-green-900/50', image: '' },
  { id: 3, title: 'Bộ Nhận Diện Thương Hiệu', category: 'Branding Design', color: 'bg-emerald-900/50', image: '' },
  { id: 4, title: 'Social Post Facebook', category: 'Social Media Design', color: 'bg-blue-900/50', image: '' },
  { id: 5, title: 'Thumbnail YouTube', category: 'Thumbnail Design', color: 'bg-slate-800', image: '' },
];

export default function Projects() {
  const [activeTab, setActiveTab] = useState('Tất cả');

  return (
    <section id="projects" className="w-full flex flex-col gap-6 mt-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <h2 className="text-3xl font-bold uppercase tracking-wide">
          Dự Án <span className="text-secondary">Nổi Bật</span>
        </h2>
        <a href="#" className="flex items-center gap-2 text-sm text-textMuted hover:text-white transition-colors">
          XEM TẤT CẢ DỰ ÁN <ArrowRight size={16} />
        </a>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === cat 
                ? 'bg-secondary text-white' 
                : 'glass-panel text-textMuted hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="relative group">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 xl:gap-6">
          {projects.map((project) => (
            <div key={project.id} className="flex flex-col gap-3 group/card cursor-pointer glass-panel-hover p-3 rounded-2xl border border-white/5 bg-surfaceLight/50">
              <div className={`w-full aspect-[3/4] rounded-xl ${project.color} overflow-hidden relative border border-white/10 shadow-inner`}>
                 {project.image && <img src={project.image} alt={project.title} className="w-full h-full object-cover" />}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 z-10" />
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 bg-black/40 backdrop-blur-sm transition-all duration-300 z-20">
                    <div className="w-12 h-12 bg-primary/80 rounded-full flex items-center justify-center shadow-glow text-white transform scale-50 group-hover/card:scale-100 transition-transform duration-300">
                      <div className="w-0 h-0 border-t-6 border-t-transparent border-l-10 border-l-white border-b-6 border-b-transparent ml-1" />
                    </div>
                 </div>
              </div>
              <div className="px-1 pb-1">
                <h3 className="font-semibold text-sm group-hover/card:text-primary transition-colors">{project.title}</h3>
                <p className="text-xs text-accent mt-1 uppercase font-bold tracking-wider">{project.category}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation Arrows (Visible on hover usually, but keeping static for now) */}
        <button className="absolute left-[-20px] top-1/3 -translate-y-1/2 w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 hidden lg:flex">
          <ChevronLeft size={20} />
        </button>
        <button className="absolute right-[-20px] top-1/3 -translate-y-1/2 w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 hidden lg:flex">
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
