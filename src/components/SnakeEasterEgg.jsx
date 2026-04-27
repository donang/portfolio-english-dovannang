import React, { useState, useEffect, useRef } from 'react';

const SnakeEasterEgg = () => {
  const [contextDialogue, setContextDialogue] = useState('Ú òa ✨ Đi vắng đội nón lá xinh hong? 🍁');
  const [isHovered, setIsHovered] = useState(false);
  const [snakeStatus, setSnakeStatus] = useState('normal'); // 'normal', 'dizzy', 'angry'
  const snakeRef = useRef(null);
  const prevSectionId = useRef(null);
  const statusRef = useRef('normal'); // Keep track inside timeout

  useEffect(() => {
    statusRef.current = snakeStatus;
  }, [snakeStatus]);

  useEffect(() => {
    // Engine ngẫu nhiên điều phối Hành động (Chạy mỗi 6.5s một lần)
    const actionInterval = setInterval(() => {
      // Bỏ qua nếu rắn đang bận diễn trò hoặc đang bị chỉ chuột
      if (statusRef.current !== 'normal' || !snakeRef.current || isHovered) return;

      const randomRoll = Math.random();

      // 1. Tỉ lệ 25%: Bị vấp ngã (Choáng + Quẹo)
      if (randomRoll < 0.25) {
          triggerCollisionSequence();
          return;
      }

      // 2. Tỉ lệ 35%: Nhìn xung quanh và bình luận về web hiện tại
      if (randomRoll >= 0.25 && randomRoll < 0.60) {
          const rect = snakeRef.current.getBoundingClientRect();
          const headX = rect.left + 50; 
          const headY = rect.top + (rect.height / 2);

          if (headX > 0 && headX < window.innerWidth) {
              const originalPointer = snakeRef.current.style.pointerEvents;
              snakeRef.current.style.pointerEvents = 'none';
              const elementUnderHead = document.elementFromPoint(headX, headY);
              snakeRef.current.style.pointerEvents = originalPointer;

              if (elementUnderHead) {
                  const section = elementUnderHead.closest('section');
                  if (section && section.id) {
                      readSectionDialogue(section.id);
                      return;
                  }
              }
          }
      }

      // 3. Tỉ lệ 40%: Đọc thoại ngẫu nhiên tán dóc
      readRandomDialogue();

    }, 6500); // 6.5 giây đổi trò 1 lần

    return () => clearInterval(actionInterval);
  }, [isHovered]);

  const readSectionDialogue = (secId) => {
    switch (secId) {
        case 'home':
          setContextDialogue('Úi da! Ai treo cái ảnh Avatar đẹp choáng váng thế này! 🤕');
          break;
        case 'projects':
          setContextDialogue('Mấy cái dự án này chất lừ! Rắn duyệt! 🚀');
          break;
        case 'skills':
          setContextDialogue('Tất cả quỳ xuống! Trình độ skill thế này thì out trình rồi! 🥶🍷');
          break;
        case 'about':
          setContextDialogue('Á à, thì ra đây là bản sơ yếu lý lịch mật! Boss cũng ra gì đấy! 🕵️‍♀️');
          break;
        case 'contact':
          setContextDialogue('Quao, để xin info tán bạn Boss cái coi, đẹp trai phết! 😘');
          break;
        default:
          readRandomDialogue();
      }
  };

  const readRandomDialogue = () => {
      const funLines = [
          'Nón lá cờ đỏ sao vàng lấp lánh hihi! ✨',
          'Sss... Trần đời chưa thấy cái Portfolio nào oách như này! 🍃',
          'Bò mỏi tay... à nhầm mỏi bụng quá! 🐍',
          'Trời hôm nay đẹp, chủ web cũng đẹp nốt! 🎶',
          'Chạy đi đâu con sâu! Nhìn cái gì mà nhìn! 👁️',
          'Lâu lâu bò ra tập thể dục cho đỡ mỏi! 🤸',
          'Chạy đi đâu cho khỏi nắng hả bạn yêu! 🍁'
      ];
      const randLine = funLines[Math.floor(Math.random() * funLines.length)];
      setContextDialogue(randLine);
  };

  const triggerTeasingSequence = () => {
      setSnakeStatus('teasing');
      
      const teasingLines = [
          'Ê nhóc tì, nhìn gì mà nhìn? Lêu lêu! 😝',
          'Đang đọc gì đấy? Dừng lại trêu miếng nè! 😜',
          'Blehh... Lêu lêu mấy đứa đang ngồi cắm màn hình! 😛',
          'Khè khè... Đứng lại chọc ngoáy mảng code một tí nào! 🤪'
      ];
      setContextDialogue(teasingLines[Math.floor(Math.random() * teasingLines.length)]);
      
      // Đứng lại trêu đúng 3 giây rồi dọt tiếp
      setTimeout(() => {
          setSnakeStatus('normal');
          setContextDialogue('Sss... Chọc xong rồi, dọt thôi! 🍃');
      }, 3000);
  };

  const triggerCollisionSequence = () => {
      setSnakeStatus('dizzy');
      setContextDialogue('Sss... Cục đá chết tiệt! Ủ uôi chóng mặt quá 😵‍💫💦');
      
      // Choáng váng 2.5s thì tỉnh
      setTimeout(() => {
          setSnakeStatus('angry');
          setContextDialogue('TỨC Á NHÁ! Bổn cung vấp trúng cục gì! Đợi lát tông sập web này!! 😤🔥');
          
          // Giận 3.5s rồi lươn lẹo dỗi tiếp tục đi
          setTimeout(() => {
              setSnakeStatus('normal');
              setContextDialogue('Hừ... thôi bỏ đi, bận đội nón lá rồi hong thèm chấp! 🍁');
          }, 4500);
      }, 2500);
  };

  // Duration biến thiên: Thường = 0.6s, Dizzy = Rất lờ đờ (6s), Tức giận = Ngoe nguẩy cực độ (0.15s)
  const tailDuration = snakeStatus === 'dizzy' ? '6s' : (snakeStatus === 'angry' ? '0.15s' : '0.6s');

  return (
    <>
      <style>{`
        @keyframes snake-serpentine-bob {
          0%, 100% { transform: translateY(-10px) rotate(4deg); }
          50% { transform: translateY(10px) rotate(-4deg); }
        }
        @keyframes snake-journey {
          0%, 75% { left: 110vw; opacity: 0; }
          76% { left: 110vw; opacity: 1; }
          95% { left: -20vw; opacity: 1; }
          96%, 100% { left: -20vw; opacity: 0; }
        }
      `}</style>
      
      {/* 
        Container chạy ngang được Pause lại bằng JS theo trạng thái.
        Khi dizzy hoặc teasing, rắn sẽ KHỰNG LẠI tại chỗ. 
      */}
      <div 
        className="fixed z-[9999] bottom-[10%] pointer-events-none drop-shadow-2xl" 
        style={{ 
            animation: 'snake-journey 40s linear infinite 5s',
            animationPlayState: (snakeStatus === 'dizzy' || snakeStatus === 'teasing') ? 'paused' : 'running'
        }}
      >
        <div 
          ref={snakeRef}
          className="pointer-events-auto cursor-help group flex items-center justify-center relative w-[180px] h-[100px]" 
          // Nếu Teasing, vẫn bobbing để nhúng nhẩy tại chỗ trêu tức
          style={{ animation: snakeStatus === 'dizzy' ? 'none' : 'snake-serpentine-bob 0.6s ease-in-out infinite' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          
          {/* FX Sparkles */}
          {(snakeStatus === 'normal' || snakeStatus === 'teasing') && (
              <>
                <div className="absolute top-2 right-6 animate-pulse text-yellow-300 text-xl drop-shadow-md">✨</div>
                <div className="absolute top-10 -left-6 animate-[bounce_1s_infinite] text-orange-400 text-sm drop-shadow-md" style={{ animationDelay: '0.2s' }}>🍁</div>
              </>
          )}
          {snakeStatus === 'dizzy' && (
              <div className="absolute -top-4 right-8 animate-spin text-blue-300 text-2xl drop-shadow-md">💫</div>
          )}
          {snakeStatus === 'angry' && (
              <div className="absolute top-2 right-8 animate-[bounce_0.2s_infinite] text-red-500 text-2xl drop-shadow-md">💢</div>
          )}

          {/* SVG Rắn Vàng Cam + Nón Lá (Căng đét) */}
          <svg width="180" height="100" viewBox="0 0 180 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_6px_10px_rgba(255,202,132,0.4)] overflow-visible">
            
            <path stroke="#FFCA84" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <animate key={`body-${snakeStatus}`} attributeName="d" 
                       values="M 150 50 Q 120 -15 90 50 T 45 50; 
                               M 150 50 Q 120 115 90 50 T 45 50; 
                               M 150 50 Q 120 -15 90 50 T 45 50" 
                       dur={tailDuration} repeatCount="indefinite" />
            </path>
            
            <path stroke="#FFA12C" strokeWidth="12" strokeLinecap="round" strokeDasharray="18 40" strokeDashoffset="5" fill="none">
              <animate key={`dots-${snakeStatus}`} attributeName="d" 
                       values="M 148 50 Q 120 -15 90 50 T 45 50; 
                               M 148 50 Q 120 115 90 50 T 45 50; 
                               M 148 50 Q 120 -15 90 50 T 45 50" 
                       dur={tailDuration} repeatCount="indefinite" />
            </path>

            <path stroke="#FFCA84" strokeWidth="12" strokeLinecap="round" fill="none">
              <animate key={`tail-${snakeStatus}`} attributeName="d" 
                       values="M 165 40 Q 155 -15 150 50; 
                               M 165 60 Q 155 115 150 50; 
                               M 165 40 Q 155 -15 150 50" 
                       dur={tailDuration} repeatCount="indefinite" />
            </path>
            
            <g transform="translate(48, 50)">
              {/* Lòng nón lá */}
              <path d="M -40, -10 Q 0, 10 40, -10 Q 0, -20 -40,-10 Z" fill="#BA2C17" />
              {/* Form đầu tròn bầu bĩnh */}
              <circle cx="0" cy="0" r="26" fill={snakeStatus === 'angry' ? '#FFA12C' : '#FFCA84'} className="transition-colors duration-300" />
              {/* Eye patch */}
              <ellipse cx="-12" cy="0" rx="14" ry="16" fill={snakeStatus === 'angry' ? '#FFCA84' : '#FFE9B8'} className="transition-colors duration-300" />
              <ellipse cx="12" cy="0" rx="14" ry="16" fill={snakeStatus === 'angry' ? '#FFCA84' : '#FFE9B8'} className="transition-colors duration-300" />
              <ellipse cx="0" cy="8" rx="12" ry="14" fill={snakeStatus === 'angry' ? '#FFCA84' : '#FFE9B8'} className="transition-colors duration-300" />
              

              {/* DYNAMIC FACE (ĐỔI CẢM XÚC THEO STATUS) */}
              {snakeStatus === 'normal' && (
                  <g id="normal-eyes">
                    <circle cx="-13" cy="2" r="8.5" fill="#000" />
                    <circle cx="-16.5" cy="-1.5" r="3.5" fill="#fff" />
                    <circle cx="-10.5" cy="5.5" r="1.5" fill="#fff" />
                    <circle cx="-8.5" cy="-0.5" r="1.2" fill="#fff" />
                    
                    <circle cx="13" cy="2" r="8.5" fill="#000" />
                    <circle cx="9.5" cy="-1.5" r="3.5" fill="#fff" />
                    <circle cx="15.5" cy="5.5" r="1.5" fill="#fff" />
                    <circle cx="17.5" cy="-0.5" r="1.2" fill="#fff" />

                    <path d="M -5, 12 C -2, 17 0, 15 0, 13 C 0, 15 2, 17 5, 12" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </g>
              )}

              {snakeStatus === 'teasing' && (
                  <g id="teasing-eyes">
                    {/* Mắt trái nháy (nhắm lại >) */}
                    <path d="M -16,4 L -10,0 L -16,-4" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    
                    {/* Mắt phải mở to */}
                    <circle cx="13" cy="2" r="8.5" fill="#000" />
                    <circle cx="9.5" cy="-1.5" r="3.5" fill="#fff" />
                    <circle cx="15.5" cy="5.5" r="1.5" fill="#fff" />
                    <circle cx="17.5" cy="-0.5" r="1.2" fill="#fff" />

                    {/* Lưỡi lè lêu lêu */}
                    <path d="M -5,10 Q 0,14 5,10" stroke="#000" strokeWidth="2.5" fill="none" />
                    <path d="M 0,13 C -3,23 3,23 0,13" fill="#fb7185" stroke="#fb7185" strokeWidth="1.5" strokeLinecap="round" />
                  </g>
              )}

              {snakeStatus === 'dizzy' && (
                  <g id="dizzy-eyes">
                    {/* Mắt X trái */}
                    <path d="M -17,-2 L -9,6 M -17,6 L -9,-2" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Mắt X phải */}
                    <path d="M 9,-2 L 17,6 M 9,6 L 17,-2" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Miệng O choáng */}
                    <circle cx="0" cy="14" r="3" fill="#000" />
                  </g>
              )}

              {snakeStatus === 'angry' && (
                  <g id="angry-eyes">
                    {/* Cặp Chân Mày Quắc Mắt */}
                    <path d="M -18,-4 L -6,3" stroke="#DC2626" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M 18,-4 L 6,3" stroke="#DC2626" strokeWidth="3.5" strokeLinecap="round" />
                    
                    <circle cx="-12" cy="4" r="5" fill="#000" />
                    <circle cx="12" cy="4" r="5" fill="#000" />
                    
                    {/* Miệng bực */}
                    <path d="M -4,16 Q 0,12 4,16" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </g>
              )}

              {/* Má hồng (đỏ bừng nếu tức) */}
              <ellipse cx="-20" cy="11" rx="5" ry="3" fill={snakeStatus === 'angry' ? '#DC2626' : '#FF9A62'} opacity={snakeStatus === 'angry' ? '1' : '0.8'} />
              <ellipse cx="20" cy="11" rx="5" ry="3" fill={snakeStatus === 'angry' ? '#DC2626' : '#FF9A62'} opacity={snakeStatus === 'angry' ? '1' : '0.8'} />
              
              {/* NÓN LÁ CAO BỒI */}
              <path d="M -40, -10 Q 0,-24 40, -10 L 0, -45 Z" fill="#E44521" />
              <path d="M 0,-45 L -20, -16" stroke="#BA2C17" strokeWidth="1.5" />
              <path d="M 0,-45 L 20, -16" stroke="#BA2C17" strokeWidth="1.5" />
              <path d="M 0,-45 L 0, -22" stroke="#BA2C17" strokeWidth="1.5" />
              
              {/* Quai Nón Buộc Nơ */}
              <path d="M -34, -8 C -40, 36 0, 42 16, 26" fill="none" stroke="#BA2C17" strokeWidth="1.5" />
              <path d="M 34, -8 C 40, 20 26, 32 16, 26" fill="none" stroke="#BA2C17" strokeWidth="1.5" />
              <path d="M 16,26 C 10,18 20,12 20,24 C 28,18 26,28 16,26" fill="none" stroke="#BA2C17" strokeWidth="1.5" />
              <path d="M 16,26 Q 12,34 9,36" fill="none" stroke="#BA2C17" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 16,26 Q 22,34 25,36" fill="none" stroke="#BA2C17" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </svg>

          {/* Bóng Khí Thoại Thông Minh */}
          <div className={`absolute -top-14 transition-all duration-300 transform bg-[#FFD28F]/95 border-2 border-[#FFA12C] text-[#C92A2A] text-[12px] font-bold tracking-wide px-4 py-2.5 rounded-2xl rounded-bl-sm whitespace-nowrap shadow-xl shadow-orange-900/40 z-[10000] drop-shadow-md ${contextDialogue.length > 30 ? '-left-10' : 'left-[50%] -translate-x-1/2'} ${isHovered || contextDialogue ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            {isHovered ? 'Ai rảnh đâu cho chọc mà trỏ vô! Kêu chủ mài ra đây tiếp chiêu! 😝' : contextDialogue}
          </div>
        </div>
      </div>
    </>
  );
};

export default SnakeEasterEgg;
