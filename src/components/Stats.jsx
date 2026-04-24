import React from 'react';
import { Star, LayoutGrid, Smile, Trophy } from 'lucide-react';

export default function Stats() {
  const stats = [
    { icon: <Star className="text-yellow-500" size={32} />, value: '2+', label: 'Năm kinh nghiệm' },
    { icon: <LayoutGrid className="text-primary" size={32} />, value: '120+', label: 'Dự án hoàn thành' },
    { icon: <Smile className="text-orange-500" size={32} />, value: '80+', label: 'Khách hàng hài lòng' },
    { icon: <Trophy className="text-purple-500" size={32} />, value: '10+', label: 'Giải thưởng đạt được' },
  ];

  return (
    <section className="w-full">
      <div className="glass-panel border-white/5 rounded-2xl p-8 flex flex-wrap gap-8 justify-between items-center bg-gradient-to-r from-surfaceLight to-surface/40">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="flex items-center justify-center">
              {stat.icon}
            </div>
            <div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-textMuted">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
