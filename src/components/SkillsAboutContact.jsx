import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Mail, Phone, MapPin, MessageCircle, Zap, User, Send, Loader2, Briefcase, Quote } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const SolarSystem3D = ({ skills }) => {
  if (!skills) return null;

  // Dữ liệu bách khoa toàn thư của 8 Hành tinh gốc (Kích thước tương đối và Số lượng Mặt trăng/Vệ tinh chính)
  const SOLAR_SYSTEM = [
    { id: 'Mercury', img: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg', moons: 0, size: 16, radiusPct: 28, speed: 2.89, zoom: 1.15, spin: 40 }, // 88 days = 0.24 Earth yrs
    { id: 'Venus', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg', moons: 0, size: 22, radiusPct: 38, speed: 7.38, zoom: 1.1, spin: -50 }, // Ngoại lệ hệ mặt trời: Kim Tinh tự quay ngược cực
    { id: 'Earth', img: 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg', moons: 1, size: 24, radiusPct: 48, speed: 12, zoom: 1.05, spin: 20 }, // 365 days = 1.00 Earth yrs (Hệ quy chiếu: 12s)
    { id: 'Mars', img: 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg', moons: 2, size: 18, radiusPct: 58, speed: 22.57, zoom: 1.1, spin: 22 }, // 687 days = 1.88 Earth yrs
    { id: 'Jupiter', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg', moons: 4, size: 40, radiusPct: 72, speed: 142.3, zoom: 1.05, spin: 10 }, // Mộc tinh tự quay cực kỳ nhanh (Ngày ~ 10h)
    { id: 'Saturn', img: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Saturn_%28planet%29_large.jpg', moons: 3, size: 36, radiusPct: 86, speed: 353.5, hasRings: true, zoom: 2.5, spin: 12 }, // 29.45 Earth yrs
    { id: 'Uranus', img: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg', moons: 2, size: 28, radiusPct: 98, speed: 1008, zoom: 1.15, spin: -30 }, // Thiên Vương Tinh lăn ngang lộn ngược cựa xoay của hệ
    { id: 'Neptune', img: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg', moons: 1, size: 28, radiusPct: 110, speed: 1977, zoom: 1.15, spin: 15 } // 164.8 Earth yrs
  ];

  return (
    <div className="relative w-full aspect-square max-w-[600px] mx-auto mt-8 overflow-visible">
      <style>{`
        @keyframes orbitSpinZ { 100% { transform: rotateZ(360deg); } }
        @keyframes orbitSpinZRev { 100% { transform: rotateZ(-360deg); } }
        
        .star-field {
           background-image: 
             radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)),
             radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)),
             radial-gradient(1.5px 1.5px at 90px 40px, #ffffff, rgba(0,0,0,0)),
             radial-gradient(1.5px 1.5px at 160px 120px, #ffffff, rgba(0,0,0,0)),
             radial-gradient(2px 2px at 200px 50px, rgba(255,255,255,0.8), rgba(0,0,0,0)),
             radial-gradient(2px 2px at 250px 150px, rgba(255,255,255,0.8), rgba(0,0,0,0));
           background-size: 300px 300px;
        }
      `}</style>
      
      {/* 2D Flat Space Plane */}
      <div className="absolute inset-0">
        
        {/* Lõi Mặt Trời Rực Lửa (Siêu Thực - Theo Mẫu) */}
        <div className="absolute top-1/2 left-1/2 w-[65px] h-[65px] md:w-[85px] md:h-[85px] rounded-full flex items-center justify-center z-10" 
             style={{ transform: 'translate(-50%, -50%)' }}>
             
           {/* Hào quang tỏa tia (Cosmic Sun Rays) - Giả lập các luồng ánh sáng bắn ra ngoài không gian */}
           <div className="absolute top-1/2 left-1/2 w-[280%] h-[280%] rounded-full opacity-50 mix-blend-screen pointer-events-none"
                style={{
                   transform: 'translate(-50%, -50%)',
                   background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,165,0,0.6) 15deg, transparent 30deg, rgba(255,235,59,0.4) 45deg, transparent 60deg, rgba(255,140,0,0.7) 75deg, transparent 100deg, rgba(255,165,0,0.5) 120deg, transparent 150deg, rgba(255,69,0,0.6) 175deg, transparent 200deg, rgba(255,235,59,0.4) 240deg, transparent 270deg, rgba(255,140,0,0.7) 300deg, transparent 330deg, rgba(255,165,0,0.6) 345deg, transparent 360deg)',
                   filter: 'blur(3px)',
                   WebkitMaskImage: 'radial-gradient(circle at center, black 20%, transparent 70%)',
                   maskImage: 'radial-gradient(circle at center, black 20%, transparent 70%)',
                }}></div>

           {/* Vầng sáng vàng lóa nhấp nháy bao quanh rìa */}
           <div className="absolute inset-[-10px] rounded-full blur-[6px]" style={{ boxShadow: '0 0 30px #ffeb3b, 0 0 60px #ff9800, 0 0 100px #ff5722', animation: 'sunPulse3D 2s infinite alternate' }}></div>

           {/* Ảnh Mặt Trời gốc (Đã được Color Grade đổi sang Vàng/Cam rực rỡ y hệt ảnh mẫu) */}
           <div className="relative w-full h-full rounded-full overflow-hidden shadow-[inset_0_0_20px_#ff9800]">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg" 
                   alt="The Sun" 
                   className="w-full h-full object-cover scale-[1.05] contrast-[1.4] saturate-[2.5] brightness-[1.2] hue-rotate-[-10deg]" />
           </div>

           <div className="w-full h-full absolute inset-0 flex items-center justify-center z-10 bg-black/10 rounded-full">
              
           </div>
        </div>

        {/* Asteroid Belt (Nằm sát trước Mộc tinh) */}
        <div className="absolute top-1/2 left-1/2 rounded-full border-[8px] border-dotted border-white/10 pointer-events-none" 
             style={{ 
                 width: '42%', 
                 height: '42%', 
                 transform: 'translate(-50%, -50%)',
                 opacity: 0.35
             }} />

        {/* Hệ thống 8 Hành Tinh (The 8 Authentic Planets) */}
        {SOLAR_SYSTEM.map((planet, i) => {
           // MỖI KỸ NĂNG CHỈ GẮN LÊN 1 HÀNH TINH (Chặn triệt để lỗi clone kỹ năng chạy rùng beng khắp hệ mặt trời)
           const s = i < skills.length ? skills[i] : null; 
           const speed = planet.speed; 
           const startDelay = -((i / SOLAR_SYSTEM.length) * speed); 
           
           return (
             <div key={`orbit-${planet.id}`} className="absolute top-1/2 left-1/2 rounded-full border border-gray-400/20 pointer-events-none z-20" 
                  style={{ 
                     width: `${planet.radiusPct}%`, 
                     height: `${planet.radiusPct}%`, 
                     marginTop: `-${planet.radiusPct / 2}%`, 
                     marginLeft: `-${planet.radiusPct / 2}%`,
                 }}>
                 {/* Quỹ Đạo Quay */}
                 <div className="w-full h-full absolute inset-0" style={{ animation: `orbitSpinZ ${speed}s linear infinite`, animationDelay: `${startDelay}s` }}>
                     
                     {/* Điểm Neo Hành Tinh */}
                     <div className="absolute top-1/2 right-0" style={{ transform: 'translate(50%, -50%)' }}>
                        
                        <div style={{ animation: `orbitSpinZRev ${speed}s linear infinite`, animationDelay: `${startDelay}s` }}>
                           
                           <div className="flex flex-col items-center justify-center group cursor-pointer pointer-events-auto relative">
                              
                              {/* --- VỆ TINH/MẶT TRĂNG CỦA HÀNH TINH (MOONS) --- */}
                              {planet.moons > 0 ? Array.from({ length: planet.moons }).map((_, mIdx) => {
                                 // Tự sinh quỹ đạo Mặt Trăng xoay quanh chính Hành Tinh này
                                 const mRadius = (planet.size / 2) + 6 + (mIdx * 3);
                                 // Giảm tốc độ Mặt Trăng siêu chậm rạp để mô phỏng sự vĩ đại của Vũ trụ, tránh cảm giác lỗi hiển thị giật Lag
                                 const mSpeed = 12 + (mIdx * 5);
                                 return (
                                   <div key={`moon-${mIdx}`} className="absolute top-1/2 left-1/2 rounded-full border border-white/10"
                                        style={{ width: `${mRadius * 2}px`, height: `${mRadius * 2}px`, transform: 'translate(-50%, -50%)' }}>
                                      <div className="w-full h-full absolute inset-0" style={{ animation: `orbitSpinZ ${mSpeed}s linear infinite` }}>
                                         <div className="absolute top-1/2 right-0 w-[4px] h-[4px] bg-slate-200 rounded-full shadow-[0_0_3px_#fff]" style={{ transform: 'translate(50%, -50%)' }} />
                                      </div>
                                   </div>
                                 )
                              }) : null}

                              {/* Hệ Vành Đai Sao Thổ (Saturn's Rings) */}
                              {planet.hasRings && (
                                <div className="absolute top-1/2 left-1/2 w-[160%] h-[160%] rounded-full border-[5px] border-double border-[#d4c0a1]/60" style={{ transform: 'translate(-50%, -50%) scaleY(0.4) rotateZ(-30deg)', pointerEvents: 'none' }}></div>
                              )}

                              {/* --- BỀ MẶT HÀNH TINH NASA CHÍNH CỐNG --- */}
                              <div className="relative flex items-center justify-center rounded-full group-hover:scale-[1.5] transition-all duration-300 z-20 shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                                   style={{ width: `${planet.size}px`, height: `${planet.size}px` }}>
                                 
                                 {/* Tách riêng Lớp hiển thị ảnh, ép Scale để Cắt sạch viền đen thô ráp của NASA */}
                                 <div className="w-full h-full rounded-full overflow-hidden absolute inset-0">
                                    <img src={planet.img} 
                                         className="w-full h-full object-cover contrast-[1.3] saturate-[1.6] brightness-125" 
                                         style={{ transform: `scale(${planet.zoom})` }} 
                                         alt={planet.id} />
                                 </div>
                                 
                                 {/* Vệ Tinh Kỹ Năng bay trên đỉnh hành tinh (Nếu có Skill) */}
                                 {s && (
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center justify-center bg-black/80 backdrop-blur-md border border-white/20 w-6 h-6 md:w-8 md:h-8 p-0.5 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)] z-30 transition-all duration-300 opacity-90 group-hover:opacity-100 group-hover:-top-10 group-hover:scale-125 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                                        {s.iconUrl ? (
                                            <img src={s.iconUrl} className="w-full h-full object-contain drop-shadow-md rounded-full" alt={s.name} />
                                        ) : (
                                            <span className="text-[10px] md:text-[11px] uppercase font-bold text-white leading-none">
                                              {(s.name || '?').substring(0, 2)}
                                            </span>
                                        )}
                                    </div>
                                 )}
                                 
                                 {/* Tên Kỹ năng khi Hover */}
                                 {s && (
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-30">
                                       <span className="text-[10px] font-bold text-white whitespace-nowrap bg-black/80 px-2 py-1 rounded border border-white/20">{s.name}</span>
                                    </div>
                                 )}
                              </div>

                           </div>
                        </div>
                     </div>

                 </div>
             </div>
           );
        })}
      </div>
    </div>
  );
};

export default function SkillsAboutContact() {
  const [skillsList, setSkillsList] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cv_skills')) || []; } 
    catch { return []; }
  });
  
  const [experienceList, setExperienceList] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cv_experience')) || []; } 
    catch { return []; }
  });
  
  const [contactInfo, setContactInfo] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cv_contact')) || { email: '', phone: '', address: '', behance: '' }; } 
    catch { return { email: '', phone: '', address: '', behance: '' }; }
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'profile', 'main'), (docSnap) => {
       if (docSnap.exists()) {
           const data = docSnap.data();
           
           setSkillsList(data.skills || []);
           localStorage.setItem('cv_skills', JSON.stringify(data.skills || []));
           
           setExperienceList(data.experience || []);
           localStorage.setItem('cv_experience', JSON.stringify(data.experience || []));
           
           setContactInfo(data.contact || { email: '', phone: '', address: '', behance: '' });
           localStorage.setItem('cv_contact', JSON.stringify(data.contact || { email: '', phone: '', address: '', behance: '' }));
       } else {
           setSkillsList([]);
           setExperienceList([]);
           setContactInfo({ email: '', phone: '', address: '', behance: '' });
       }
    });
    return () => unsub();
  }, []);

  return (
    <section className="w-full grid lg:grid-cols-3 gap-6">
      {/* Skills */}
      <div className="bg-[#0b0c10] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden" id="skills">
        <h3 className="text-[14px] font-extrabold flex items-center gap-2 font-sans tracking-widest uppercase">
          <Zap className="text-orange-500 drop-shadow-[0_0_10px_rgba(251,146,60,0.6)]" size={18} /> KỸ NĂNG CỦA MÌNH
        </h3>

        <div className="w-full flex-1 flex flex-col items-center justify-start min-h-[300px]">
           {skillsList.length > 0 ? (
              <SolarSystem3D skills={skillsList} />
           ) : (
              <p className="text-sm text-textMuted text-center border border-dashed border-white/10 rounded-xl py-6 w-full">Vui lòng nhập tối thiểu 1 kỹ năng trên Admin để kích hoạt Quỹ Đạo Đa Lớp.</p>
           )}
        </div>
      </div>

      {/* Experience (formerly About) */}
      <div className="bg-[#0b0c10] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden" id="about">
        <h3 className="text-[14px] font-extrabold flex items-center gap-2 font-sans tracking-widest uppercase">
          <Briefcase className="text-orange-500 drop-shadow-[0_0_10px_rgba(251,146,60,0.6)]" size={18} /> KINH NGHIỆM LÀM VIỆC
        </h3>

        <div className="flex flex-col gap-1 mt-2">
           {experienceList.map((exp, idx) => (
             <div key={idx} className="flex gap-4 relative">
               {/* Trace Line and Dot Container */}
               <div className="relative flex flex-col items-center shrink-0 w-3 pt-[2px]">
                 <div className={`w-3 h-3 rounded-full relative z-10 shrink-0 ${idx === 0 ? 'bg-orange-500 shadow-[0_0_8px_rgba(251,146,60,0.8)]' : 'border-[2px] border-white/30 bg-[#0b0c10]'}`} />
                 {idx !== experienceList.length - 1 && <div className="w-px h-[calc(100%+8px)] bg-white/10 absolute top-2 left-1/2 -translate-x-1/2 z-0" />}
               </div>
               
               {/* Content */}
               <div className="flex flex-col pb-7 w-full -mt-[1.5px]">
                 <span className={`text-[10px] font-bold tracking-widest uppercase mb-1 ${idx === 0 ? 'text-orange-400' : 'text-textMuted'}`}>
                   {exp.startDate ? (() => {
                      const fm = (str) => { 
                         if(!str) return ''; 
                         const [y, m] = str.split('-'); 
                         return `${m}/${y}`; 
                      };
                      const s = fm(exp.startDate);
                      const e = exp.isCurrent ? 'Hiện tại' : (exp.endDate ? fm(exp.endDate) : '?');
                      return `${s} - ${e}`;
                   })() : exp.period}
                 </span>
                 <h4 className="text-[14px] font-bold text-white mt-1 pr-4">
                    {exp.role}
                    {exp.company && <span className="text-primary/90 ml-1.5 font-semibold text-[11px] opacity-90 tracking-wide uppercase inline-block border-l border-white/20 pl-1.5 py-0.5">@ {exp.company}</span>}
                 </h4>
                 
                 {/* Xử lý gạch đầu dòng (Bullet points) tự động bóc tách từ các dấu xuống dòng \n */}
                 <div className="text-[12px] text-textMuted mt-1.5 leading-relaxed pr-2 flex flex-col gap-1.5">
                    {exp.desc && exp.desc.split('\n').map((line, i) => {
                       const cleanLine = line.replace(/^[-•*+]\s*/, '').trim(); // Xóa gạch ngang thủ công tự gõ nếu có
                       if(!cleanLine) return null;
                       return (
                          <div key={i} className="flex gap-2 items-start group/li">
                             <div className="w-1.5 h-1.5 rounded-sm bg-primary/40 group-hover/li:bg-primary group-hover/li:rotate-45 transition-all shrink-0 mt-1.5" />
                             <span className="flex-1">{cleanLine}</span>
                          </div>
                       );
                    })}
                 </div>
               </div>
             </div>
           ))}
        </div>

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex gap-3 items-start">
            <Quote className="text-primary/60 shrink-0 mt-0.5" size={18} />
            <p className="text-[13px] text-textMuted/80 italic leading-relaxed">
              "Thiết kế không chỉ là tạo ra lớp áo đẹp, mà là quá trình biến những ý tưởng phức tạp thành trải nghiệm thị giác tuyệt vời."
            </p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-[#0b0c10] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden" id="contact">
        <h3 className="text-[14px] font-extrabold flex items-center gap-2 font-sans tracking-widest uppercase">
          <Send className="text-primary drop-shadow-[0_0_10px_rgba(255,42,133,0.6)]" size={18} /> LIÊN HỆ VỚI MÌNH
        </h3>

        <div className="flex flex-col gap-5 mt-2">
          <div className="flex items-center gap-4 group">
            <div className="w-8 h-8 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center text-primary shrink-0">
              <Mail size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-textMuted">Email</p>
              <p className="text-[13px] font-semibold truncate mt-0.5 text-white/90">{contactInfo.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 group">
            <div className="w-8 h-8 rounded-full bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors flex items-center justify-center text-orange-500 shrink-0">
              <Phone size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-textMuted">Điện thoại</p>
              <p className="text-[13px] font-semibold truncate mt-0.5 text-white/90">{contactInfo.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 group">
            <div className="w-8 h-8 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors flex items-center justify-center text-purple-500 shrink-0">
              <MapPin size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-textMuted">Địa chỉ</p>
              <p className="text-[13px] font-semibold truncate mt-0.5 text-white/90">{contactInfo.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 group">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors flex items-center justify-center text-blue-500 font-bold text-xs shrink-0">
              Bē
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-textMuted">Behance</p>
              <p className="text-[13px] font-semibold truncate mt-0.5 text-white/90">{contactInfo.behance}</p>
            </div>
          </div>
        </div>
        <a 
          href={`https://zalo.me/${contactInfo.phone ? contactInfo.phone.replace(/[^0-9]/g, '') : ''}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-6 w-full py-3.5 rounded-lg bg-gradient-to-r from-orange-400 via-primary to-purple-600 font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,42,133,0.4)] hover:shadow-[0_0_30px_rgba(255,42,133,0.6)] active:scale-95 text-white text-[12px] uppercase tracking-widest"
        >
          CHAT VỚI MÌNH QUA ZALO <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" alt="Zalo" className="w-5 h-5 ml-1" />
        </a>
      </div>
    </section>
  );
}
