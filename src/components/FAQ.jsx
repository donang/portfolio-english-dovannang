import React, { useState, useEffect } from 'react';
import { MessageSquareText, Plus } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const [faqs, setFaqs] = useState([]);

  const defaultFaqs = [
    {
      q: "How long does a Brand Identity project take?",
      a: "Depending on the scale, a Branding project typically takes 2-3 weeks from Research and Concept Sketching to Final Design. For individual items (Banners, Packaging, Posters), I can deliver them smoothly within 3-5 days, strictly adhering to the agreed timeline."
    },
    {
      q: "What file formats will I receive upon handover?",
      a: "You will receive a standard Handover Package: High-quality original Graphic files (.AI, .PSD), print-ready files (.PDF) configured in CMYK, and optimized files for Digital display (.PNG/.JPG). All layers are scientifically managed for your ultimate convenience."
    },
    {
      q: "What is the revision support policy?",
      a: "I highly value the perfection of the final product, so each design includes 2-3 rounds of free feedback revisions. We will collaboratively refine Colors, Typography, and Layout until the Visual truly meets your needs."
    },
    {
      q: "How are design costs calculated and quoted?",
      a: "I don't use a one-size-fits-all price. All quotes are transparently provided as a Lump Sum based on a detailed Scope of Work (concept complexity, number of items). I guarantee 100% no hidden fees if the core requirements remain unchanged."
    }
  ];

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'profile', 'english'), (docSnap) => {
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
               Below is a quick guide addressing the most essential questions regarding workflow, pricing, and design support policies. 
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
                    className="w-full text-left px-4 py-6 md:px-10 md:py-8 flex items-center justify-between focus:outline-none cursor-pointer relative z-10"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4 md:gap-8 pr-2 md:pr-6">
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
                    className={`px-4 md:px-10 ml-[4.5rem] md:ml-[6.5rem] transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden ${
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
