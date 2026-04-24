import React from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export default function Testimonial() {
  return (
    <section className="w-full glass-panel rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 border-white/5 relative overflow-hidden mt-6 mb-12">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px]" />

      <Quote className="text-primary/40 shrink-0" size={64} />

      <div className="flex-1">
        <p className="text-lg md:text-xl font-medium leading-relaxed mb-6">
          "Năng Đỗ là một designer rất chuyên nghiệp và sáng tạo. Sản phẩm luôn vượt mong đợi và đúng deadline!"
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
                alt="Minh Anh"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold">Minh Anh</h4>
              <p className="text-sm text-textMuted">CEO tại Foodie Việt Nam</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
