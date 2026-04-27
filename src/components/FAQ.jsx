import React, { useState, useEffect } from 'react';
import { MessageSquareText, Plus } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const [faqs, setFaqs] = useState([]);

  const defaultFaqs = [
    {
      q: "Thiết kế một dự án Nhận Diện Thương Hiệu mất bao lâu?",
      a: "Tùy thuộc vào quy mô, trung bình một dự án Branding từ bước Research, Phác thảo Concept đến Final Design cần khoảng 2-3 tuần. Tuy nhiên với các ấn phẩm lẻ (Banner, Packaging, Poster), mình sẽ bàn giao cực mượt trong 3-5 ngày, cam kết tuân thủ chặt chẽ Timeline đã chốt."
    },
    {
      q: "Khách hàng sẽ nhận được định dạng File nào khi nghiệm thu?",
      a: "Bạn sẽ nhận được trọn bộ Package Bàn Giao chuẩn mực nhất: File Graphic gốc chất lượng cao (.AI, .PSD), file in ấn (.PDF) chuẩn thiết lập hệ màu CMYK, và các File tối ưu hiển thị Digital (.PNG/.JPG). Toàn bộ File Layer đều được quản lý khoa học, cực kỳ thuận tiện cho bạn tái sử dụng."
    },
    {
      q: "Chính sách hỗ trợ chỉnh sửa (Revisions) như thế nào?",
      a: "Mình cực kỳ xem trọng sự hoàn hảo của sản phẩm cuối, nên mỗi ấn phẩm thiết kế luôn tặng kèm 2-3 vòng chỉnh sửa (Feedback Revisions) hoàn toàn miễn phí. Đôi bên sẽ cùng nhau tinh chỉnh Màu sắc, Typography và bố cục cho tới khi Visual thực sự đáp ứng đúng nhu cầu của bạn."
    },
    {
      q: "Chi phí thiết kế được tính toán và báo giá ra sao?",
      a: "Mình không dùng một mức giá cào bằng. Mọi báo giá đều được minh bạch hóa theo hình thức Trọn gói (Lump Sum) dựa trên Scope of Work chi tiết (độ phức tạp của Concept, số lượng ấn phẩm). Đảm bảo 100% không phát sinh bất kỳ khoản phụ phí vô lý nào nếu yêu cầu cốt lõi ngay từ đầu không thay đổi."
    }
  ];

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'profile', 'main'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().faqs && docSnap.data().faqs.length > 0) {
        setFaqs(docSnap.data().faqs);
      } else {
        setFaqs(defaultFaqs);
      }
    });

    return () => unsub();
  }, []);

  return (
    <section className="w-full relative py-20 md:py-32 border-t border-white/5 bg-[#050508]" id="faq">
      {/* Lưới Ambient Light tản nhiệt nhẹ nhàng */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_top_right,_rgba(255,42,133,0.04)_0%,_rgba(0,0,0,0)_60%)] pointer-events-none -z-10"></div>
      
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-16 lg:gap-24 items-start">
          
          {/* CỘT TRÁI: Dính (Sticky) Mô Tả Cực Nghệ */}
          <div className="flex flex-col lg:sticky lg:top-40 h-max z-20">
             <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 flex items-center justify-center text-primary backdrop-blur-md shadow-[0_0_20px_rgba(255,42,133,0.2)]">
                 <MessageSquareText size={22} />
               </div>
               <span className="text-xs font-black tracking-[0.3em] uppercase text-textMuted pt-1">
                 Consulting & Support
               </span>
             </div>
             
             <h2 className="text-[3.5rem] md:text-[5rem] lg:text-[4.5rem] font-black text-white font-sans tracking-tighter leading-[0.95] mb-8">
               Got<br />
               Questions?<br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-purple-500 italic block mt-2 drop-shadow-md">
                 I've got answers.
               </span>
             </h2>
             
             <p className="text-textMuted text-[15px] leading-[1.8] font-sans max-w-sm pl-4 border-l-2 border-white/10">
               Dưới đây là cẩm nang giải đáp cực kỳ nhanh gọn cho các thắc mắc cốt lõi nhất về quy trình làm việc, báo giá và chính sách hỗ trợ thiết kế. 
             </p>
          </div>

          {/* CỘT PHẢI: Khối List Câu Hỏi Editorial Magazine */}
          <div className="flex flex-col gap-6 relative z-10 w-full mt-4 lg:mt-0">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className={`group relative transition-all duration-[600ms] ease-out rounded-2xl overflow-hidden ${
                    isOpen 
                      ? 'bg-[#0f111a]/80 shadow-[0_20px_40px_-15px_rgba(255,42,133,0.15)] ring-1 ring-primary/30 my-2 scale-[1.01]' 
                      : 'bg-white/[0.02] hover:bg-white/[0.04] ring-1 ring-white/5 hover:ring-white/15 hover:-translate-y-1'
                  } backdrop-blur-xl`}
                >
                  {/* Vệt Highlight ngầm chạy ngang trên cùng thẻ khi active */}
                  {isOpen && <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"></div>}

                  <button 
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="w-full text-left px-6 py-6 md:px-10 md:py-8 flex items-center justify-between focus:outline-none cursor-pointer relative z-10"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-6 md:gap-8 pr-6">
                      {/* Đánh Số Khổng Lồ Mờ ảo */}
                      <span className={`text-4xl md:text-5xl font-black italic transition-colors duration-500 select-none ${isOpen ? 'text-primary' : 'text-white/10 group-hover:text-white/20'}`}>
                        0{index + 1}
                      </span>
                      
                      <h3 className={`text-base md:text-[1.1rem] font-bold font-sans tracking-tight transition-all duration-300 ${isOpen ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                        {faq.q}
                      </h3>
                    </div>

                    {/* Nút Xoay Plus / Close */}
                    <div className={`shrink-0 w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 ${
                      isOpen 
                        ? 'border-primary bg-primary/10 text-primary rotate-[135deg] shadow-[0_0_20px_rgba(255,42,133,0.3)]' 
                        : 'border-white/10 bg-[#050508] text-white/40 group-hover:border-white/30 group-hover:text-white'
                    }`}>
                      <Plus size={24} strokeWidth={isOpen ? 3 : 2} />
                    </div>
                  </button>
                  
                  {/* Nội dung xổ xuống */}
                  <div 
                    className={`px-6 md:px-10 ml-[4.5rem] md:ml-[6.5rem] transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden ${
                      isOpen ? 'max-h-[400px] opacity-100 pb-8 md:pb-10 translate-y-0' : 'max-h-0 opacity-0 pb-0 translate-y-4'
                    }`}
                  >
                    <p className="text-textMuted text-[14px] md:text-[15px] leading-[1.85] font-sans relative">
                      {/* Dấu chấm nháy Deco */}
                      <span className="absolute -left-5 top-2.5 w-1.5 h-1.5 bg-primary/60 rounded-full"></span>
                      {faq.a}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
