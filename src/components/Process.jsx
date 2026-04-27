import React from 'react';
import { Lightbulb, PenTool, LayoutTemplate, Rocket } from 'lucide-react';

export default function Process() {
  const steps = [
    {
      id: "01",
      icon: <Lightbulb size={32} className="text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.6)]" />,
      title: "Discovery & Setup",
      desc: "Phân tích yêu cầu, thấu hiểu tầm nhìn của brand và chắt lọc những Insight đắt giá nhất.",
      color: "from-orange-400/20 to-transparent",
      borderColor: "group-hover:border-orange-400/50",
      shadow: "group-hover:shadow-[0_0_40px_rgba(251,146,60,0.2)]"
    },
    {
      id: "02",
      icon: <PenTool size={32} className="text-primary drop-shadow-[0_0_10px_rgba(255,42,133,0.6)]" />,
      title: "Concept & Sketch",
      desc: "Phác thảo cấu trúc, lên khung xương UX và tìm kiếm các layout Visual Design đột phá.",
      color: "from-primary/20 to-transparent",
      borderColor: "group-hover:border-primary/50",
      shadow: "group-hover:shadow-[0_0_40px_rgba(255,42,133,0.2)]"
    },
    {
      id: "03",
      icon: <LayoutTemplate size={32} className="text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.6)]" />,
      title: "Hi-Fi Production",
      desc: "Đắp thịt lên xương. Dựng 3D, phối màu, typography và tạo ra sản phẩm thị giác sắc nét.",
      color: "from-purple-400/20 to-transparent",
      borderColor: "group-hover:border-purple-400/50",
      shadow: "group-hover:shadow-[0_0_40px_rgba(192,132,252,0.2)]"
    },
    {
      id: "04",
      icon: <Rocket size={32} className="text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]" />,
      title: "Launch & Delivery",
      desc: "Hiệu chỉnh Final, tối ưu file gốc (source files) và đóng gói bàn giao mượt mà nhất.",
      color: "from-blue-400/20 to-transparent",
      borderColor: "group-hover:border-blue-400/50",
      shadow: "group-hover:shadow-[0_0_40px_rgba(96,165,250,0.2)]"
    }
  ];

  return (
    <section className="w-full relative py-12 md:py-20 mt-8 mb-16" id="process">
      
      {/* Vệt lưới mờ chạy đằng sau background */}
      <div className="absolute top-0 w-full h-[50%] bg-gradient-to-b from-primary/5 to-transparent -z-10 blur-3xl pointer-events-none"></div>

      <div className="flex flex-col items-center mb-14 text-center px-4">
        <h3 className="text-xs font-black tracking-[0.4em] uppercase text-textMuted mb-3 flex items-center gap-2">
           <span className="w-6 h-[1px] bg-white/20"></span> HOW I WORK <span className="w-6 h-[1px] bg-white/20"></span>
        </h3>
        <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-md tracking-tight">Quy Trình <span className="heading-gradient">Sáng Tạo</span></h2>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Thanh bar chạy ngang nối liền 4 step ở Desktop */}
        <div className="hidden lg:block absolute top-[64px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 w-full">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className={`glass-panel p-8 rounded-3xl relative overflow-hidden group transition-all duration-[600ms] ease-out hover:-translate-y-3 hover:scale-[1.02] border border-white/5 ${step.borderColor} ${step.shadow} cursor-default`}
            >
              {/* Nền phản quang tự sáng bừng lên khi Hover theo tone màu */}
              <div className={`absolute inset-0 bg-gradient-to-b ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}></div>
              
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="w-[72px] h-[72px] rounded-2xl bg-[#0b0c10]/80 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                  {step.icon}
                </div>
                <span className="text-5xl font-black text-white/5 group-hover:text-white/20 group-hover:-translate-y-2 transition-all duration-500 select-none">
                  {step.id}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4 relative z-10">{step.title}</h3>
              <p className="text-[13px] text-textMuted leading-relaxed relative z-10 group-hover:text-white/90 transition-colors duration-500">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
