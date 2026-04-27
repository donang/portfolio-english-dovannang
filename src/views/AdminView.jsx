import React, { useState, useEffect } from 'react';
import { Upload, Lock, AlertCircle, CheckCircle2, Image as ImageIcon, Trash2, LayoutDashboard, Settings as SettingsIcon, LogOut, BarChart3, FolderHeart, ImageIcon as MImageIcon, ChevronDown, User, PlusCircle, Save, Briefcase, Calendar, MessageCircle } from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, getDocs, updateDoc, where, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function AdminView() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [projects, setProjects] = useState([]);

  const [projectTitle, setProjectTitle] = useState('');
  const [projectCategory, setProjectCategory] = useState('Poster');
  const uploadCategories = ['Poster', 'Banner', 'Social Media', 'Branding', 'Thumbnail', 'Others'];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Custom Modal State
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'alert', onConfirm: null });
  const [editingProject, setEditingProject] = useState(null);

  // Tab State
  const [activeTab, setActiveTab] = useState('portfolio'); // 'portfolio' | 'profile'
  const [activeProfileTab, setActiveProfileTab] = useState('experience');
  const [activeFilter, setActiveFilter] = useState('All');
  
  const [profileData, setProfileData] = useState({
    experience: [],
    contact: { email: '', phone: '', address: '', behance: '' },
    skills: [],
    stats: { years: '2+', projects: '120+', clients: '80+', awards: '10+' },
    faqs: []
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const showAlert = (title, message) => setModal({ isOpen: true, title, message, type: 'alert', onConfirm: null });
  const showConfirm = (title, message, onConfirm) => setModal({ isOpen: true, title, message, type: 'confirm', onConfirm });

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
    if (!isAuthenticated) return;
    
    // Listen to Projects
    const qProjects = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubProjects = onSnapshot(qProjects, (snapshot) => {
      const projs = [];
      snapshot.forEach((dt) => {
        projs.push({ id: dt.id, ...dt.data() });
      });
      setProjects(projs);
    });

    // Listen to Profile
    const unsubProfile = onSnapshot(doc(db, 'profile', 'main'), (docSnap) => {
        if (docSnap.exists()) {
            const dbData = docSnap.data();
            if (!dbData.faqs || dbData.faqs.length === 0) {
               dbData.faqs = defaultFaqs;
            }
            setProfileData(dbData);
        }
    });

    return () => { unsubProjects(); unsubProfile(); };
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === '123456') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Mã PIN không chính xác!');
    }
  };

  const compressImage = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
          const img = new window.Image();
          img.src = event.target.result;
          img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 1200;
              const MAX_HEIGHT = 1200;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                  if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
              } else {
                  if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
              }
              
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', 0.8));
          };
          img.onerror = () => reject('Không thể đọc file ảnh');
      };
      reader.onerror = () => reject('Lỗi đọc file từ đĩa');
  });

  const handleAddImagesToProject = async (e, project) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;
  
      setUploading(true);
      setProgress(5);
  
      try {
          const compressedBase64Array = [];
          for (let i = 0; i < files.length; i++) {
              const base64 = await compressImage(files[i]);
              compressedBase64Array.push(base64);
              setProgress(5 + Math.round(((i + 1) / files.length) * 60));
          }
  
          setProgress(80);
  
          let oldImages = [];
          if (project.images && Array.isArray(project.images)) {
              oldImages = project.images;
          } else if (project.imageUrl) {
              oldImages = [project.imageUrl];
          }
  
          const newlyMergedImages = [...oldImages, ...compressedBase64Array];
  
          await updateDoc(doc(db, 'projects', project.id), {
              images: newlyMergedImages
          });
          
          setEditingProject({ ...project, images: newlyMergedImages });
  
          setProgress(100);
          setTimeout(() => setUploading(false), 500);
      } catch (err) {
          console.error(err);
          showAlert('Lỗi', 'Không thể tải thêm ảnh lên: ' + err);
          setUploading(false);
          setProgress(0);
      }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setProgress(5);

    try {
        const compressedBase64Array = [];
        for (let i = 0; i < files.length; i++) {
            const base64 = await compressImage(files[i]);
            compressedBase64Array.push(base64);
            setProgress(5 + Math.round(((i + 1) / files.length) * 60));
        }

        setProgress(75);

        const projectTitleTerm = projectTitle || 'Không tên';

        // Kiểm tra xem đã có dự án nào trùng Tên chưa
        const qSearch = query(collection(db, 'projects'), where('title', '==', projectTitleTerm));
        const querySnapshot = await getDocs(qSearch);

        if (!querySnapshot.empty) {
            // Đã tồn tại -> Lấy ra và gộp thêm ảnh vào mảng cũ
            const existingDoc = querySnapshot.docs[0];
            const existingData = existingDoc.data();
            
            // Xử lý fallback cho những dự án cũ chỉ có 1 `imageUrl` thay vì mảng `images`
            let oldImages = [];
            if (existingData.images && Array.isArray(existingData.images)) {
                oldImages = existingData.images;
            } else if (existingData.imageUrl) {
                oldImages = [existingData.imageUrl];
            }
            
            const newlyMergedImages = [...oldImages, ...compressedBase64Array];
            
            await updateDoc(doc(db, 'projects', existingDoc.id), {
                images: newlyMergedImages,
                // Có thể cập nhật lại thời gian sửa: updatedAt: new Date().getTime()
            });
        } else {
            // Không tồn tại -> Tạo dự án mới hoàn toàn
            await addDoc(collection(db, 'projects'), {
                title: projectTitleTerm,
                category: projectCategory,
                images: compressedBase64Array,
                createdAt: new Date().getTime()
            });
        }

        setProgress(100);
        setTimeout(() => {
            setUploading(false);
            setProjectTitle('');
        }, 500);
    } catch (err) {
        console.error(err);
        showAlert('Lỗi Tải Lên', 'Hãy chắc chắn bạn đã tạo Firestore Database và cấp quyền phân hệ Database. Chi tiết: ' + err);
        setUploading(false);
        setProgress(0);
    }
  };

  const handleDelete = (id) => {
    showConfirm('Xác nhận xóa dự án', 'Bạn có chắc chắn muốn xóa toàn bộ dự án này cùng tất cả ảnh trong đó không? Hành động này không thể hoàn tác.', async () => {
      await deleteDoc(doc(db, 'projects', id));
      if (editingProject && editingProject.id === id) setEditingProject(null);
    });
  };

  const handleRemoveSingleImage = async (project, imageIndexToRemove) => {
    if (!project.images || project.images.length <= 1) {
       showConfirm('Xóa ảnh cuối cùng', 'Đây là bức ảnh cuối cùng của dự án. Nếu xóa, toàn bộ bìa dự án này sẽ biến mất. Bạn vẫn muốn tiếp tục?', async () => {
           await deleteDoc(doc(db, 'projects', project.id));
           setEditingProject(null);
       });
       return;
    }

    showConfirm('Gỡ 1 tấm ảnh', 'Bạn xác nhận xóa tấm ảnh này khỏi album chứ?', async () => {
        const newImages = project.images.filter((_, idx) => idx !== imageIndexToRemove);
        
        await updateDoc(doc(db, 'projects', project.id), {
            images: newImages
        });
        
        // Cập nhật lại UI trong modal
        setEditingProject({ ...project, images: newImages });
    });
  };

  const handleSaveProfile = async () => {
     setSavingProfile(true);
     try {
        await setDoc(doc(db, 'profile', 'main'), profileData);
        showAlert('Thành Công', 'Hồ sơ cá nhân và kỹ năng đã được cập nhật thành công!');
     } catch (e) {
        showAlert('Lỗi', 'Không thể lưu hồ sơ: ' + e);
     }
     setSavingProfile(false);
  };

  const filterCategoriesMenu = ['All', ...new Set(projects.map(p => p.category))];
  const filteredProjects = activeFilter === 'All' ? projects : projects.filter(p => p.category === activeFilter);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090909] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
        
        <div className="glass-panel p-10 rounded-3xl w-full max-w-md z-10 flex flex-col gap-6 shadow-2xl border border-white/10 backdrop-blur-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
          
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10 shadow-glow relative">
              <div className="absolute inset-0 rounded-full border border-primary/50 animate-[spin-slow_4s_linear_infinite]" />
              <Lock className="text-primary" size={32} />
            </div>
            <h1 className="text-3xl font-bold font-heading">Đỗ Văn Năng</h1>
            <p className="text-secondary text-xs uppercase tracking-[0.3em] font-bold mb-2">Graphic Designer</p>
            <p className="text-textMuted text-center text-sm font-medium">Vui lòng nhập Password để mở khóa hệ thống.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5 mt-4">
            <div>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Nhập mã PIN..."
                className="w-full bg-surfaceLight border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 text-center text-xl tracking-widest font-bold"
              />
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm justify-center">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <button type="submit" className="w-full bg-gradient-primary shine-effect font-bold text-white py-3 rounded-xl hover:scale-[1.02] transition-transform">
              ĐĂNG NHẬP
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Analytics
  const totalProjects = projects.length;
  const totalImages = projects.reduce((acc, p) => acc + (p.images?.length || 1), 0);
  const activeCategories = new Set(projects.map(p => p.category)).size;

  return (
    <div className="min-h-screen bg-[#070709] text-white flex overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30vw] h-[30vw] bg-secondary/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col z-20 hidden md:flex">
        <div className="p-8 pb-4">
          <h1 className="text-2xl font-bold font-heading leading-tight">Đỗ Văn<br/><span className="text-primary">Năng</span></h1>
          <p className="text-[10px] text-textMuted uppercase tracking-widest mt-2 font-bold">Admin System</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          <button 
             onClick={() => setActiveTab('portfolio')}
             className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'portfolio' ? 'bg-white/10 text-white shadow-glow border border-white/5' : 'text-textMuted hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutDashboard size={18} /> Kho Tác Phẩm
          </button>
          <button 
             onClick={() => setActiveTab('profile')}
             className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'profile' ? 'bg-white/10 text-white shadow-glow border border-white/5' : 'text-textMuted hover:bg-white/5 hover:text-white'}`}
          >
            <User size={18} /> Hồ Sơ Cá Nhân
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-textMuted hover:text-red-400 hover:bg-red-500/10 w-full font-medium transition-colors">
            <LogOut size={18} /> Đăng Xuất
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 h-screen overflow-y-auto relative z-10 custom-scrollbar">
        <div className="p-6 md:p-10 lg:p-12 max-w-6xl mx-auto flex flex-col gap-8">
          
          {/* Header Mobile / Title */}
          <header className="flex items-center justify-between md:hidden pb-4 border-b border-white/10">
            <div>
              <h1 className="text-xl font-bold font-heading">Đỗ Văn Năng</h1>
              <p className="text-xs text-primary uppercase tracking-widest font-bold">Admin Menu</p>
            </div>
            <button onClick={() => setIsAuthenticated(false)} className="p-2 rounded-lg bg-white/5 text-textMuted hover:text-white">
              <LogOut size={20} />
            </button>
          </header>

          {activeTab === 'portfolio' ? (
            <>
              {/* Analytics Widgets */}
              {/* Analytics Ribbon Bar */}
              <section className="glass-panel px-6 py-4 rounded-full border border-white/5 flex flex-wrap md:flex-nowrap items-center justify-between gap-6 shadow-xl">
                 <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                      <FolderHeart className="text-primary" size={18} />
                    </div>
                    <div>
                       <p className="text-[10px] text-primary/80 uppercase tracking-widest font-bold">Tổng Dự Án</p>
                       <h3 className="text-2xl font-black font-heading tracking-tight text-white leading-none mt-1">{totalProjects}</h3>
                    </div>
                 </div>
                 
                 <div className="hidden md:block w-px h-10 bg-white/10"></div>
                 
                 <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/30">
                      <MImageIcon className="text-secondary" size={18} />
                    </div>
                    <div>
                       <p className="text-[10px] text-secondary/80 uppercase tracking-widest font-bold">Dung Lượng</p>
                       <h3 className="text-2xl font-black font-heading tracking-tight text-white leading-none mt-1">{totalImages} <span className="text-xs font-bold text-white/40">Ảnh</span></h3>
                    </div>
                 </div>
                 
                 <div className="hidden md:block w-px h-10 bg-white/10"></div>
                 
                 <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30">
                      <BarChart3 className="text-accent" size={18} />
                    </div>
                    <div>
                       <p className="text-[10px] text-accent/80 uppercase tracking-widest font-bold">Danh Mục</p>
                       <h3 className="text-2xl font-black font-heading tracking-tight text-white leading-none mt-1">{activeCategories}</h3>
                    </div>
                 </div>
              </section>

              {/* Main Content Grid: 1 col for Upload, 2 cols for Gallery */}
              <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start mt-6">
                 {/* Upload Module */}
                 <section className="lg:col-span-1 lg:sticky lg:top-8 flex flex-col gap-6 z-10 pt-2 lg:pr-4">
                 
                 <div className="flex items-center gap-3">
                    <Upload className="text-primary" size={24} />
                    <h2 className="text-2xl font-bold font-heading tracking-tight">Trạm Tải Lên</h2>
                 </div>
                 
                 <div className="flex flex-col gap-6 mt-2">
                   <div className="flex flex-col gap-2 relative">
                     <label className="text-[10px] text-primary/70 uppercase font-bold tracking-[0.15em] pl-2">Tên Dự Án (Title)</label>
                     <input 
                       type="text" 
                       value={projectTitle}
                       onChange={(e) => setProjectTitle(e.target.value)}
                       placeholder="VD: Poster Quảng cáo Tết 2026..." 
                       className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-primary/50 text-white placeholder-white/20 transition-all focus:bg-black/60 shadow-inner text-base font-semibold"
                       disabled={uploading}
                     />
                     <div className="absolute bottom-5 right-5 pointer-events-none opacity-20"><SettingsIcon size={18}/></div>
                   </div>
                   <div className="flex flex-col gap-2 relative">
                     <label className="text-[10px] text-secondary/70 uppercase font-bold tracking-[0.15em] pl-2">Hạng Mục (Category)</label>
                     <div 
                       className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-4 cursor-pointer text-white flex justify-between items-center transition-all shadow-inner hover:bg-black/60 focus:border-secondary/50"
                       onClick={() => !uploading && setIsDropdownOpen(!isDropdownOpen)}
                     >
                       <span className="font-semibold text-base">{projectCategory}</span>
                       <ChevronDown className={`transition-transform duration-300 text-secondary ${isDropdownOpen ? 'rotate-180' : ''}`} size={18} />
                     </div>
                     
                     {isDropdownOpen && !uploading && (
                       <div className="absolute top-[85px] left-0 w-full bg-[#111111]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 z-[60] shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-[zoom-in_0.2s_ease-out_forwards]">
                         {uploadCategories.map(cat => (
                           <div 
                             key={cat} 
                             className={`px-4 py-3 rounded-xl cursor-pointer font-bold transition-all flex items-center gap-2 ${projectCategory === cat ? 'bg-secondary/20 text-secondary' : 'text-textMuted hover:bg-white/10 hover:text-white'}`}
                             onClick={() => { setProjectCategory(cat); setIsDropdownOpen(false); }}
                           >
                             {projectCategory === cat && <CheckCircle2 size={16} />}
                             {cat}
                           </div>
                         ))}
                       </div>
                     )}
                   </div>
                 </div>

                 <label className={`w-full mt-2 h-56 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all cursor-pointer relative overflow-hidden bg-black/20 backdrop-blur-sm ${uploading ? 'border-primary/30' : 'border-white/10 hover:border-primary/60 hover:bg-white/5'}`}>
                   <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileUpload} disabled={uploading} />
                   
                   {uploading ? (
                     <div className="flex flex-col items-center gap-5 z-10">
                       <div className="relative flex items-center justify-center">
                         <div className="w-20 h-20 rounded-full border-4 border-white/5 border-t-primary animate-spin"></div>
                         <div className="absolute font-bold text-primary">{progress}%</div>
                       </div>
                       <p className="font-bold text-lg text-white">Đang xử lý Base64 & Tải lên...</p>
                     </div>
                   ) : (
                     <>
                       <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/10 shadow-glow hover:scale-110 transition-transform duration-500">
                          <Upload className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" size={32} />
                       </div>
                       <div className="text-center">
                          <p className="font-bold text-lg mb-1 tracking-tight">Kéo thả ảnh vào khu vực này</p>
                          <p className="text-textMuted text-[12px] font-semibold">Hỗ trợ tải lên nhiều file cùng lúc (JPG, PNG, WebP)</p>
                       </div>
                     </>
                   )}
                   {uploading && (
                     <div className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-primary to-secondary transition-all duration-300 shadow-[0_0_15px_rgba(255,42,133,0.8)]" style={{ width: `${progress}%` }} />
                   )}
                 </label>
              </section>

              {/* Gallery View */}
              <section className="lg:col-span-2 pb-12 w-full min-w-0">
               <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-black font-heading tracking-tight">Thư Viện Đã Tải Lên</h2>
                  <span className="px-4 py-1.5 rounded-full bg-white/5 text-[11px] font-black uppercase tracking-widest text-textMuted border border-white/10">{filteredProjects.length} tác phẩm</span>
               </div>
               
               {/* Filters */}
               <div className="flex gap-2 overflow-x-auto pb-4 mb-2 custom-scrollbar">
                  {filterCategoriesMenu.map(cat => (
                     <button 
                        key={cat}
                        onClick={() => setActiveFilter(cat)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${activeFilter === cat ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(255,42,133,0.3)]' : 'bg-transparent border-white/10 text-textMuted hover:border-white/30 hover:text-white'}`}
                     >
                        {cat} {cat !== 'All' && <span className="opacity-50 ml-1">({projects.filter(p => p.category === cat).length})</span>}
                     </button>
                  ))}
               </div>
               
               <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8 mt-4">
                 {filteredProjects.map((proj) => (
                   <div 
                      key={proj.id} 
                      className="group/item flex flex-col gap-3 relative cursor-pointer"
                      onClick={() => setEditingProject(proj)}
                   >
                     {/* Image Frame (Unboxed) */}
                     <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.5)] bg-black/40 border border-white/5 group-hover/item:border-white/20 transition-all group-hover/item:-translate-y-1">
                        <img src={proj.images?.[0] || proj.imageUrl} alt={proj.title} className="w-full h-full object-cover opacity-90 group-hover/item:opacity-100 group-hover/item:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                          <span className="px-4 py-2 bg-black/70 backdrop-blur-md text-white font-bold rounded-full border border-white/20 text-xs">
                             Click sửa / xóa ảnh
                          </span>
                        </div>
                        
                        {/* Delete Button Corner */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover/item:opacity-100 transition-opacity z-20">
                           <button 
                              onClick={(e) => { e.stopPropagation(); handleDelete(proj.id); }} 
                              className="w-10 h-10 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-500 hover:scale-110 transition-all shadow-md backdrop-blur"
                              title="Xóa bộ ảnh"
                           >
                             <Trash2 size={16} />
                           </button>
                        </div>
                        
                        {/* Image Count Badge */}
                        {(proj.images?.length > 1) && (
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-full z-10 border border-white/10 flex items-center gap-1.5 shadow-lg">
                            <MImageIcon size={12}/> {proj.images.length} Ảnh
                          </div>
                        )}
                     </div>
                     
                     {/* Separate Text Content */}
                     <div className="flex flex-col px-1">
                        <h3 className="text-base lg:text-lg font-bold text-white/90 group-hover/item:text-primary transition-colors line-clamp-1">{proj.title}</h3>
                        <span className="text-[11px] uppercase tracking-widest font-black text-textMuted mt-1">{proj.category}</span>
                     </div>
                   </div>
                 ))}
                 
                 {filteredProjects.length === 0 && (
                   <div className="col-span-full h-48 flex flex-col items-center justify-center text-textMuted border-2 border-dashed border-white/5 rounded-2xl bg-white/5">
                     <ImageIcon size={40} className="opacity-40 mb-3" />
                     <p className="font-bold">Không có hình ảnh cho mục này</p>
                   </div>
                  )}
               </div>
              </section>
             </div>
            </>
          ) : (
            /* Profile Management Tab */
            <div className="flex flex-col gap-6 pb-12">
               <div className="flex items-center justify-between">
                 <div>
                   <h2 className="text-2xl font-bold font-heading">Quản Lý Hồ Sơ Thuê (Profile)</h2>
                   <p className="text-textMuted text-sm mt-1">Cập nhật ngay vào trực tiếp giới thiệu trang chủ Portfolio.</p>
                 </div>
                 <button onClick={handleSaveProfile} disabled={savingProfile} className="px-6 py-3 rounded-xl font-bold bg-primary hover:bg-primary/80 transition-colors shadow-glow text-white flex items-center gap-2">
                   <Save size={18} /> {savingProfile ? 'ĐANG LƯU...' : 'LƯU HỒ SƠ'}
                 </button>
               </div>
               
               {/* Horizontal Sub-Tabs */}
               <div className="flex gap-2 overflow-x-auto pb-0 border-b border-white/10 custom-scrollbar mb-2">
                  <button onClick={() => setActiveProfileTab('experience')} className={`px-5 py-3 rounded-t-xl font-bold text-sm transition-all whitespace-nowrap ${activeProfileTab === 'experience' ? 'bg-primary/10 text-primary border-b-[3px] border-primary' : 'text-textMuted hover:bg-white/5 hover:text-white'}`}>Kinh Nghiệm</button>
                  <button onClick={() => setActiveProfileTab('skills')} className={`px-5 py-3 rounded-t-xl font-bold text-sm transition-all whitespace-nowrap ${activeProfileTab === 'skills' ? 'bg-primary/10 text-primary border-b-[3px] border-primary' : 'text-textMuted hover:bg-white/5 hover:text-white'}`}>Kỹ Năng Đồ Họa</button>
                  <button onClick={() => setActiveProfileTab('contact')} className={`px-5 py-3 rounded-t-xl font-bold text-sm transition-all whitespace-nowrap ${activeProfileTab === 'contact' ? 'bg-primary/10 text-primary border-b-[3px] border-primary' : 'text-textMuted hover:bg-white/5 hover:text-white'}`}>Liên Hệ</button>
                  <button onClick={() => setActiveProfileTab('stats')} className={`px-5 py-3 rounded-t-xl font-bold text-sm transition-all whitespace-nowrap ${activeProfileTab === 'stats' ? 'bg-primary/10 text-primary border-b-[3px] border-primary' : 'text-textMuted hover:bg-white/5 hover:text-white'}`}>Chỉ Số Của Bạn</button>
                  <button onClick={() => setActiveProfileTab('faq')} className={`px-5 py-3 rounded-t-xl font-bold text-sm transition-all whitespace-nowrap ${activeProfileTab === 'faq' ? 'bg-primary/10 text-primary border-b-[3px] border-primary' : 'text-textMuted hover:bg-white/5 hover:text-white'}`}>Hỏi Đáp (FAQ)</button>
               </div>

               {/* Experience Sec */}
               {activeProfileTab === 'experience' && (
               <section className="glass-panel p-6 lg:p-8 rounded-2xl border border-white/5 flex flex-col gap-6 relative animate-[fade-in_0.3s_ease-out_forwards]">
                 <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold font-heading flex items-center gap-2"><Briefcase size={20} className="text-primary"/> Kinh Nghiệm Làm Việc</h3>
                    <button 
                       onClick={() => setProfileData({...profileData, experience: [...(profileData.experience || []), {startDate: '2024-01', endDate: '', isCurrent: true, role: 'Vị trí mới', desc: 'Mô tả công việc'}]})}
                       className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2 text-sm hover:bg-white/10"
                    >
                      <PlusCircle size={16}/> Thêm Kinh Nghiệm
                    </button>
                 </div>
                 
                 <div className="flex flex-col gap-4 mt-2">
                   {!(profileData.experience && profileData.experience.length > 0) ? (
                      <p className="text-center text-textMuted py-4 border border-dashed border-white/10 rounded-xl">Chưa cấu hình mốc kinh nghiệm, hãy bấm nút Thêm!</p>
                   ) : profileData.experience.map((exp, idx) => (
                     <div key={idx} className="flex flex-col gap-3 bg-black/30 p-4 rounded-2xl border border-white/5 relative group/exp hover:border-white/20 transition-all">
                        <div className="flex justify-between gap-4">
                           <div className="flex flex-col gap-1 w-[45%]">
                             <div className="flex items-center justify-between">
                               <label className="text-[10px] text-textMuted uppercase">Thời gian</label>
                               <label className="flex items-center gap-1.5 cursor-pointer group">
                                  <input 
                                    type="checkbox" 
                                    checked={exp.isCurrent || false} 
                                    onChange={(e) => {
                                      const arr = [...profileData.experience]; 
                                      arr[idx].isCurrent = e.target.checked; 
                                      if (e.target.checked) arr[idx].endDate = '';
                                      setProfileData({...profileData, experience: arr});
                                    }} 
                                    className="accent-primary w-3 h-3" 
                                  /> 
                                  <span className="text-[10px] text-textMuted group-hover:text-white transition-colors">Đến hiện tại</span>
                               </label>
                             </div>
                             <div className="flex items-center gap-2 mt-0.5">
                               <input 
                                  type="date"
                                  value={exp.startDate || ''} 
                                  onChange={(e) => {
                                    const arr = [...profileData.experience]; arr[idx].startDate = e.target.value; setProfileData({...profileData, experience: arr});
                                  }} 
                                  style={{ colorScheme: 'dark' }}
                                  className="bg-black/50 border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white focus:border-primary flex-1 min-w-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100" 
                               />
                               <span className="text-textMuted text-xs font-bold">-</span>
                               {exp.isCurrent ? (
                                  <div className="bg-black/30 border border-white/5 rounded-lg px-2 py-1.5 text-xs text-primary flex-1 text-center font-bold overflow-hidden text-ellipsis whitespace-nowrap pt-[7px]">Hiện tại</div>
                               ) : (
                                 <input 
                                    type="date"
                                    value={exp.endDate || ''} 
                                    onChange={(e) => {
                                      const arr = [...profileData.experience]; arr[idx].endDate = e.target.value; setProfileData({...profileData, experience: arr});
                                    }} 
                                    style={{ colorScheme: 'dark' }}
                                    className="bg-black/50 border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white focus:border-primary flex-1 min-w-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100" 
                                 />
                               )}
                             </div>
                           </div>
                           <div className="flex flex-col gap-3 flex-1">
                             <div className="flex flex-col gap-1">
                               <label className="text-[10px] text-textMuted uppercase">Chức danh / Vị trí</label>
                               <input 
                                  value={exp.role || ''} 
                                  onChange={(e) => {
                                    const arr = [...profileData.experience]; arr[idx].role = e.target.value; setProfileData({...profileData, experience: arr});
                                  }} 
                                  placeholder="VD: Senior Graphic Designer"
                                  className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary w-full" 
                               />
                             </div>
                             <div className="flex flex-col gap-1">
                               <label className="text-[10px] text-textMuted uppercase">Tên Công Ty / Tổ Chức</label>
                               <input 
                                  value={exp.company || ''} 
                                  onChange={(e) => {
                                    const arr = [...profileData.experience]; arr[idx].company = e.target.value; setProfileData({...profileData, experience: arr});
                                  }} 
                                  placeholder="VD: Google, Upwork, Freelance..."
                                  className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary w-full" 
                               />
                             </div>
                           </div>
                        </div>
                        <div className="flex flex-col gap-1 w-full relative">
                           <label className="text-[10px] text-textMuted uppercase">Mô tả công việc</label>
<div className="flex flex-col gap-2 mt-2">
   {(exp.desc || '').split('\n').map((line, lineIdx) => {
     const rawText = line.replace(/^[\-\•\*W+]\s*/, '');
     return (
     <div key={lineIdx} className="flex gap-2 items-start group/inp">
        <div className="w-1.5 h-1.5 rounded-sm bg-primary/40 group-focus-within/inp:bg-primary group-focus-within/inp:rotate-45 transition-all shrink-0 mt-2.5" />
        <input value={rawText} onChange={(e) => { const arr = [...profileData.experience]; const lines = (exp.desc || '').split('\n'); lines[lineIdx] = e.target.value; arr[idx].desc = lines.join('\n'); setProfileData({...profileData, experience: arr}); }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); const arr = [...profileData.experience]; const lines = (exp.desc || '').split('\n'); lines.splice(lineIdx + 1, 0, ''); arr[idx].desc = lines.join('\n'); setProfileData({...profileData, experience: arr}); } else if (e.key === 'Backspace' && rawText === '' && (exp.desc || '').split('\n').length > 1) { e.preventDefault(); const arr = [...profileData.experience]; const lines = (exp.desc || '').split('\n'); lines.splice(lineIdx, 1); arr[idx].desc = lines.join('\n'); setProfileData({...profileData, experience: arr}); } }} placeholder="Gõ chi tiết công việc..." className="bg-black/50 border border-white/10 text-white focus:border-primary px-3 py-1.5 rounded-md text-sm w-full outline-none" />
        <button onClick={() => { const arr = [...profileData.experience]; const lines = (exp.desc || '').split('\n'); lines.splice(lineIdx, 1); if(lines.length === 0) lines.push(''); arr[idx].desc = lines.join('\n'); setProfileData({...profileData, experience: arr}); }} className="text-white/20 hover:text-red-500 mt-1.5 px-1 pb-1">
          <Trash2 size={13} />
        </button>
     </div>
   )})}
 <button onClick={() => { const arr = [...profileData.experience]; const lines = (exp.desc || '').split('\n'); lines.push(''); arr[idx].desc = lines.join('\n'); setProfileData({...profileData, experience: arr}); }} className="text-[10px] text-primary/80 hover:text-primary flex items-center gap-1 mt-1 w-fit uppercase tracking-widest font-bold font-sans">
    <PlusCircle size={12} /> Thêm Ý Mới
 </button>
</div>
                        </div>
                        <button 
                           onClick={() => {
                             const arr = profileData.experience.filter((_, i) => i !== idx);
                             setProfileData({...profileData, experience: arr});
                           }}
                           className="absolute right-4 top-4 w-8 h-8 rounded bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white"
                        >
                           <Trash2 size={14}/>
                        </button>
                     </div>
                   ))}
                 </div>
               </section>
               )}

               {/* Contact Sec */}
               {activeProfileTab === 'contact' && (
               <section className="glass-panel p-6 lg:p-8 rounded-2xl border border-white/5 flex flex-col gap-6 relative animate-[fade-in_0.3s_ease-out_forwards]">
                 <h3 className="text-lg font-bold font-heading flex items-center gap-2"><LayoutDashboard size={20} className="text-accent"/> Liên Hệ & Networking</h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="flex flex-col gap-2">
                     <label className="text-xs text-textMuted uppercase font-bold tracking-widest pl-1">Email</label>
                     <input value={profileData.contact.email} onChange={(e) => setProfileData({...profileData, contact: {...profileData.contact, email: e.target.value}})} placeholder="abc@gmail.com" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent/50 text-white" />
                   </div>
                   <div className="flex flex-col gap-2">
                     <label className="text-xs text-textMuted uppercase font-bold tracking-widest pl-1">Số điện thoại</label>
                     <input value={profileData.contact.phone} onChange={(e) => setProfileData({...profileData, contact: {...profileData.contact, phone: e.target.value}})} placeholder="0123 456 789" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent/50 text-white" />
                   </div>
                   <div className="flex flex-col gap-2">
                     <label className="text-xs text-textMuted uppercase font-bold tracking-widest pl-1">Địa chỉ (Vị trí)</label>
                     <input value={profileData.contact.address} onChange={(e) => setProfileData({...profileData, contact: {...profileData.contact, address: e.target.value}})} placeholder="Hà Nội, VN" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent/50 text-white" />
                   </div>
                   <div className="flex flex-col gap-2">
                     <label className="text-xs text-textMuted uppercase font-bold tracking-widest pl-1">Link mạng xã hội (Behance / FB)</label>
                     <input value={profileData.contact.behance} onChange={(e) => setProfileData({...profileData, contact: {...profileData.contact, behance: e.target.value}})} placeholder="behance.net/..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent/50 text-white" />
                   </div>
                </div>
               </section>
               )}

               {/* Stats Sec */}
               {activeProfileTab === 'stats' && (
               <section className="glass-panel p-6 lg:p-8 rounded-2xl border border-white/5 flex flex-col gap-6 relative animate-[fade-in_0.3s_ease-out_forwards]">
                 <h3 className="text-lg font-bold font-heading flex items-center gap-2"><BarChart3 size={20} className="text-secondary"/> Chỉ Số Hoạt Động (Stats)</h3>
                 
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="flex flex-col gap-2">
                     <label className="text-xs text-textMuted uppercase font-bold pl-1">Năm Kinh Nghiệm</label>
                     <input value={profileData.stats?.years || '2+'} onChange={(e) => setProfileData({...profileData, stats: {...profileData.stats, years: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-secondary/50 text-white font-bold" />
                   </div>
                   <div className="flex flex-col gap-2">
                     <label className="text-xs text-textMuted uppercase font-bold pl-1">Dự Án Hoàn Thành</label>
                     <input value={profileData.stats?.projects || '120+'} onChange={(e) => setProfileData({...profileData, stats: {...profileData.stats, projects: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-secondary/50 text-white font-bold" />
                   </div>
                   <div className="flex flex-col gap-2">
                     <label className="text-xs text-textMuted uppercase font-bold pl-1">KH Hài Lòng</label>
                     <input value={profileData.stats?.clients || '80+'} onChange={(e) => setProfileData({...profileData, stats: {...profileData.stats, clients: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-secondary/50 text-white font-bold" />
                   </div>
                   <div className="flex flex-col gap-2">
                     <label className="text-xs text-textMuted uppercase font-bold pl-1">Giải Thưởng</label>
                     <input value={profileData.stats?.awards || '10+'} onChange={(e) => setProfileData({...profileData, stats: {...profileData.stats, awards: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-secondary/50 text-white font-bold" />
                   </div>
                 </div>
               </section>
               )}

               {/* Skills Sec */}
               {activeProfileTab === 'skills' && (
               <section className="glass-panel p-6 lg:p-8 rounded-2xl border border-white/5 flex flex-col gap-6 relative animate-[fade-in_0.3s_ease-out_forwards]">
                 <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold font-heading flex items-center gap-2"><FolderHeart size={20} className="text-primary"/> Danh Sách Kỹ Năng Đồ Họa</h3>
                    <button 
                       onClick={() => setProfileData({...profileData, skills: [...profileData.skills, {name: 'Skill mới', iconUrl: '', percentage: '80%', color: '#ffffff'}]})}
                       className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2 text-sm hover:bg-white/10"
                    >
                      <PlusCircle size={16}/> Thêm Kỹ Năng
                    </button>
                 </div>
                 
                 <div className="flex flex-col gap-4">
                   {profileData.skills.length === 0 ? (
                      <p className="text-center text-textMuted py-8 border border-dashed border-white/10 rounded-xl">Chưa cấu hình kỹ năng nào, hãy bấm nút Thêm!</p>
                   ) : profileData.skills.map((s, idx) => (
                     <div key={idx} className="flex flex-wrap md:flex-nowrap items-center gap-3 bg-black/30 p-4 rounded-2xl border border-white/5 relative group/skillrow hover:border-white/20 transition-all">
                        
                        <div className="flex flex-col gap-1 w-full md:w-1/4">
                          <label className="text-[10px] text-textMuted uppercase">Tên Phầm Mềm</label>
                          <input 
                             value={s.name} 
                             onChange={(e) => {
                               const arr = [...profileData.skills]; arr[idx].name = e.target.value; setProfileData({...profileData, skills: arr});
                             }} 
                             className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary" 
                          />
                        </div>
                        <div className="flex flex-col gap-1 w-full md:w-1/3">
                          <label className="text-[10px] text-textMuted uppercase">Link Ảnh Icon (URL)</label>
                          <div className="flex gap-2">
                             {s.iconUrl && <img src={s.iconUrl} className="w-9 h-9 rounded object-cover shadow bg-white border border-white/20" alt="Ico" />}
                             <input 
                                value={s.iconUrl} 
                                placeholder="https://...png"
                                onChange={(e) => {
                                  const arr = [...profileData.skills]; arr[idx].iconUrl = e.target.value; setProfileData({...profileData, skills: arr});
                                }} 
                                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary" 
                             />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 w-20">
                          <label className="text-[10px] text-textMuted uppercase">% Mức Độ</label>
                          <input 
                             value={s.percentage} 
                             placeholder="90%"
                             onChange={(e) => {
                               const arr = [...profileData.skills]; arr[idx].percentage = e.target.value; setProfileData({...profileData, skills: arr});
                             }} 
                             className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white text-center focus:border-primary" 
                          />
                        </div>
                        <div className="flex flex-col gap-1 w-24">
                          <label className="text-[10px] text-textMuted uppercase">Mã Màu sắc</label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="color" 
                              value={s.color} 
                              onChange={(e) => {
                                const arr = [...profileData.skills]; arr[idx].color = e.target.value; setProfileData({...profileData, skills: arr});
                              }}
                              className="w-8 h-8 rounded shrink-0 border-0 bg-transparent cursor-pointer"
                            />
                            <span className="text-xs text-textMuted">{s.color}</span>
                          </div>
                        </div>
                        
                        <button 
                           onClick={() => {
                             const arr = profileData.skills.filter((_, i) => i !== idx);
                             setProfileData({...profileData, skills: arr});
                           }}
                           className="md:absolute right-4 top-1/2 md:-translate-y-1/2 w-8 h-8 rounded bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white"
                        >
                           <Trash2 size={14}/>
                        </button>
                     </div>
                   ))}
                 </div>
               </section>
               )}

               {/* FAQs Sec */}
               {activeProfileTab === 'faq' && (
               <section className="glass-panel p-6 lg:p-8 rounded-2xl border border-white/5 flex flex-col gap-6 relative animate-[fade-in_0.3s_ease-out_forwards]">
                 <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary"><MessageCircle size={16}/></div> 
                       Quản lý Hỏi Đáp (FAQ)
                    </h3>
                    <button 
                       onClick={() => setProfileData({...profileData, faqs: [...(profileData.faqs || []), {q: 'Câu hỏi mới?', a: 'Nhập câu trả lời chi tiết ở đây.'}]})}
                       className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2 text-sm hover:bg-white/10"
                    >
                      <PlusCircle size={16}/> Thêm Câu Hỏi
                    </button>
                 </div>
                 
                 <div className="flex flex-col gap-4">
                   {!(profileData.faqs && profileData.faqs.length > 0) ? (
                      <p className="text-center text-textMuted py-8 border border-dashed border-white/10 rounded-xl">Chưa cấu hình câu hỏi nào. Dữ liệu gốc sẽ tự động được sử dụng nếu bạn để trống.</p>
                   ) : profileData.faqs.map((f, idx) => (
                     <div key={idx} className="flex flex-col gap-3 bg-black/30 p-5 rounded-2xl border border-white/5 relative group/faq hover:border-white/20 transition-all">
                        
                        <div className="flex flex-col gap-1 w-full md:w-[90%]">
                          <label className="text-[10px] text-textMuted uppercase font-bold tracking-widest pl-1">Câu Hỏi (Q)</label>
                          <input 
                             value={f.q} 
                             onChange={(e) => {
                               const arr = [...profileData.faqs]; arr[idx].q = e.target.value; setProfileData({...profileData, faqs: arr});
                             }} 
                             className="bg-[#0b0c10] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-primary font-bold outline-none" 
                          />
                        </div>
                        <div className="flex flex-col gap-1 w-full md:w-[90%]">
                          <label className="text-[10px] text-textMuted uppercase font-bold tracking-widest pl-1">Câu Trả Lời (A)</label>
                          <textarea 
                             rows="3"
                             value={f.a} 
                             onChange={(e) => {
                               const arr = [...profileData.faqs]; arr[idx].a = e.target.value; setProfileData({...profileData, faqs: arr});
                             }} 
                             className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-textMuted focus:border-primary focus:text-white outline-none resize-y" 
                          />
                        </div>
                        
                        {/* Delete Button */}
                        <button 
                           onClick={() => {
                             const arr = profileData.faqs.filter((_, i) => i !== idx);
                             setProfileData({...profileData, faqs: arr});
                           }}
                           className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all opacity-100 md:opacity-0 group-hover/faq:opacity-100"
                           title="Xóa câu hỏi này"
                        >
                           <Trash2 size={16}/>
                        </button>
                     </div>
                   ))}
                 </div>
               </section>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Custom Global Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[120] bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
           <div className="bg-[#121212] border border-white/10 p-6 rounded-2xl shadow-2xl shadow-primary/20 max-w-sm w-full animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 mb-4">
                 {modal.type === 'confirm' ? <AlertCircle className="text-orange-500" size={28} /> : <AlertCircle className="text-red-500" size={28} />}
                 <h3 className="text-xl font-bold font-heading">{modal.title}</h3>
              </div>
              <p className="text-textMuted mb-8 text-sm leading-relaxed">{modal.message}</p>
              
              <div className="flex justify-end gap-3 font-medium">
                 {modal.type === 'confirm' && (
                   <button onClick={() => setModal({ ...modal, isOpen: false })} className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                     Hủy
                   </button>
                 )}
                 <button 
                   onClick={() => {
                     const cb = modal.onConfirm;
                     setModal({ ...modal, isOpen: false });
                     if (cb) cb();
                   }} 
                   className={`px-5 py-2 rounded-xl text-white font-bold transition-all shadow-glow hover:scale-[1.03] ${modal.type === 'confirm' ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/80'}`}
                 >
                   {modal.type === 'confirm' ? 'XÁC NHẬN' : 'Đã Rõ'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Edit Project Images Modal */}
      {editingProject && (
        <div 
           className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-12 cursor-zoom-out"
           onClick={() => setEditingProject(null)}
        >
           <div 
             className="bg-[#0f0f11] border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col animate-[zoom-in_0.2s_ease-out_forwards] relative overflow-hidden cursor-default"
             onClick={(e) => e.stopPropagation()}
           >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                 <div>
                   <h2 className="text-2xl font-bold font-heading flex flex-wrap gap-2 items-center">
                     {editingProject.title} 
                     <span className="px-3 py-1 bg-white/10 text-white text-xs uppercase rounded-full border border-white/10 font-bold">{editingProject.images?.length || 1} ẢNH</span>
                   </h2>
                   <p className="text-primary text-sm uppercase tracking-widest font-bold mt-1">{editingProject.category}</p>
                 </div>
                 <button onClick={() => setEditingProject(null)} className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/20 hover:scale-110 flex items-center justify-center transition-all">
                   <span className="font-bold text-xl pointer-events-none">X</span>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                 {/* Card to upload more images */}
                 <div className="relative w-full aspect-[3/4]">
                   <label className={`absolute inset-0 group/addcard rounded-2xl overflow-hidden border-2 border-dashed border-white/20 hover:border-primary/50 transition-all bg-white/5 shadow-xl flex flex-col items-center justify-center cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => handleAddImagesToProject(e, editingProject)} disabled={uploading} />
                      {uploading ? (
                         <div className="flex flex-col items-center gap-2">
                           <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-primary animate-[spin_1s_linear_infinite]"></div>
                           <span className="text-primary font-bold">{progress}%</span>
                         </div>
                      ) : (
                         <div className="flex flex-col items-center gap-2 opacity-60 group-hover/addcard:opacity-100 transition-opacity">
                           <PlusCircle size={32} />
                           <span className="font-bold text-sm">Thêm Ảnh</span>
                         </div>
                      )}
                   </label>
                 </div>

                 {editingProject.images?.map((imgStr, idx) => (
                    <div key={idx} className="relative group/editcard rounded-2xl overflow-hidden aspect-[3/4] border border-white/5 hover:border-primary/50 transition-all bg-black/40 shadow-xl">
                       <img src={imgStr} className="w-full h-full object-cover group-hover/editcard:opacity-50 transition-opacity duration-300" />
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/editcard:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                          <button 
                             onClick={(e) => { e.stopPropagation(); handleRemoveSingleImage(editingProject, idx); }}
                             className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all shadow-glow"
                             title="Xóa tấm ảnh này"
                          >
                            <Trash2 size={24} />
                          </button>
                          <span className="font-bold text-white text-sm">Xóa tấm này</span>
                       </div>
                       <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/80 flex items-center justify-center text-white font-bold border border-white/20 text-xs">
                         {idx + 1}
                       </div>
                    </div>
                 ))}

                 {(!editingProject.images || editingProject.images.length === 0) && (
                    <div className="relative group/editcard rounded-2xl overflow-hidden aspect-[3/4] border border-white/5 hover:border-primary/50 transition-all bg-black/40 shadow-xl">
                       <img src={editingProject.imageUrl} className="w-full h-full object-cover group-hover/editcard:opacity-50 transition-opacity duration-300" />
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/editcard:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                          <button 
                             onClick={(e) => { e.stopPropagation(); handleRemoveSingleImage(editingProject, 0); }}
                             className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all shadow-glow"
                             title="Xóa tấm ảnh này"
                          >
                            <Trash2 size={24} />
                          </button>
                          <span className="font-bold text-white text-sm">Xóa dự án</span>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
