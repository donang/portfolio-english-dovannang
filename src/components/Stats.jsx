import React, { useState, useEffect } from 'react';
import { Star, LayoutGrid, ThumbsUp, Users } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function Stats() {
  const defaultStats = {
    years: '3+', projects: '150+', clients: '30+', awards: '12+'
  };

  const [statsData, setStatsData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cv_stats')) || defaultStats; } 
    catch { return defaultStats; }
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'profile', 'main'), (docSnap) => {
       if (docSnap.exists() && docSnap.data().stats) {
           const newStats = docSnap.data().stats;
           setStatsData(newStats);
           localStorage.setItem('cv_stats', JSON.stringify(newStats));
       } else {
           setStatsData(defaultStats);
           localStorage.setItem('cv_stats', JSON.stringify(defaultStats));
       }
    });
    return () => unsub();
  }, []);

  const statsRender = [
    { icon: <Star className="text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.6)]" size={26} />, value: statsData.years, label: 'Năm kinh nghiệm' },
    { icon: <LayoutGrid className="text-primary drop-shadow-[0_0_10px_rgba(255,42,133,0.6)]" size={26} />, value: statsData.projects, label: 'Dự án hoàn thành' },
    { icon: <Users className="text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]" size={26} />, value: statsData.clients, label: 'Khách hàng' },
    { icon: <ThumbsUp className="text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.6)]" size={26} />, value: statsData.awards, label: 'Đánh giá 5 sao' },
  ];

  return (
    <section className="w-full relative z-30 -mt-16 md:-mt-10 lg:-mt-16 xl:-mt-20 max-w-5xl mx-auto px-4 lg:px-0">
      <div className="bg-[#0b0c10] border border-white/5 rounded-2xl px-4 md:px-12 py-5 md:py-8 grid grid-cols-2 md:flex md:flex-row gap-y-5 gap-x-1 md:gap-8 justify-between items-center shadow-2xl">
        {statsRender.map((stat, index) => (
          <div key={index} className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto md:border-r border-white/5 last:border-0 md:pr-10 last:pr-0 justify-center text-center md:text-left">
            <div className="flex items-center justify-center p-0 transition-transform hover:scale-110">
              {stat.icon}
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-extrabold font-sans text-white leading-none">{stat.value}</div>
              <div className="text-[9px] md:text-[10px] text-textMuted font-medium pt-1 uppercase tracking-widest">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
