import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, Lock, AlertCircle, CheckCircle2, Image as ImageIcon, Trash2, LayoutDashboard, Settings as SettingsIcon, LogOut, BarChart3, FolderHeart, ImageIcon as MImageIcon, ChevronDown, ChevronLeft, ChevronRight, User, PlusCircle, Save, Briefcase, Calendar, MessageCircle, ArrowLeft, ArrowRight, Star, GripVertical } from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, getDocs, updateDoc, where, setDoc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from '../firebase';

export default function AdminView() {
  useEffect(() => {
    document.title = 'Sửa CV';
    const link = document.querySelector("link[rel~='icon']");
    const oldHref = link?.href;
    if (link) link.href = import.meta.env.BASE_URL + 'favicon-admin.svg?v=2';
    return () => {
      document.title = 'Portfolio Do Van Nang';
      if (link) link.href = import.meta.env.BASE_URL + 'favicon-cv.svg?v=2';
    };
  }, []);
  const [pin, setPin] = useState('');
  const [username, setUsername] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Firebase Auth: tự động kiểm tra session đăng nhập
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setAuthLoading(false);
    });
    return () => unsubAuth();
  }, []);
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
  const [selectedImageIndexes, setSelectedImageIndexes] = useState([]);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [selectedMoveTarget, setSelectedMoveTarget] = useState(null);

  // Drag-and-drop state for image reordering
  const dragIdxRef = useRef(null);
  const dragOverIdxRef = useRef(null);
  const [dragActiveIdx, setDragActiveIdx] = useState(null);
  const [dropTargetIdx, setDropTargetIdx] = useState(null);

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

  // Toast notification for success messages
  const [toast, setToast] = useState({ show: false, title: '', message: '' });
  const toastTimerRef = useRef(null);

  const showAlert = (title, message) => {
    const isSuccess = /thành công/i.test(title);
    if (isSuccess) {
      // Show toast instead of modal for success
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      setToast({ show: true, title, message });
      toastTimerRef.current = setTimeout(() => setToast({ show: false, title: '', message: '' }), 3500);
    } else {
      setModal({ isOpen: true, title, message, type: 'alert', onConfirm: null });
    }
  };
  const showConfirm = (title, message, onConfirm) => setModal({ isOpen: true, title, message, type: 'confirm', onConfirm });

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
    if (!isAuthenticated) return;
    
    const qProjects = query(collection(db, 'projects_en'), orderBy('createdAt', 'desc'));
    const unsubProjects = onSnapshot(qProjects, (snapshot) => {
      const projs = [];
      snapshot.forEach((dt) => {
        projs.push({ id: dt.id, ...dt.data() });
      });
      setProjects(projs);
    });

    const unsubProfile = onSnapshot(doc(db, 'profile', 'english'), (docSnap) => {
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, username, pin);
      // onAuthStateChanged sẽ tự set isAuthenticated = true
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Tài khoản hoặc mật khẩu không chính xác!');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email không hợp lệ!');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Quá nhiều lần thử. Vui lòng đợi vài phút!');
      } else {
        setError('Lỗi đăng nhập: ' + err.message);
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // Upload ảnh GỐC lên ImgBB (không nén qua canvas để giữ chất lượng 100%)
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  const uploadToImgBB = async (file) => {
      const formData = new FormData();
      formData.append('key', IMGBB_API_KEY);
      formData.append('image', file);
      const res = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'ImgBB upload failed');
      return json.data.url || json.data.display_url;
  };

  // Giữ lại hàm compressImage cho trường hợp cần (file quá lớn > 10MB)
  const compressImage = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
          const img = new window.Image();
          img.src = event.target.result;
          img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              canvas.toBlob((blob) => {
                  resolve(new File([blob], file.name, { type: 'image/jpeg' }));
              }, 'image/jpeg', 0.92);
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
          const uploadedUrls = [];
          for (let i = 0; i < files.length; i++) {
              // Upload file gốc trực tiếp, chỉ nén nếu file > 10MB
              const fileToUpload = files[i].size > 10 * 1024 * 1024 ? await compressImage(files[i]) : files[i];
              const url = await uploadToImgBB(fileToUpload);
              uploadedUrls.push(url);
              setProgress(5 + Math.round(((i + 1) / files.length) * 85));
          }
  
          let oldImages = [];
          if (project.images && Array.isArray(project.images)) {
              oldImages = project.images;
          } else if (project.imageUrl) {
              oldImages = [project.imageUrl];
          }
  
          const newlyMergedImages = [...oldImages, ...uploadedUrls];
          await updateDoc(doc(db, 'projects_en', project.id), { images: newlyMergedImages });
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
        let uploadedUrls = [];
        const BATCH_SIZE = 3; // Tải song song 3 ảnh cùng lúc
        
        for (let i = 0; i < files.length; i += BATCH_SIZE) {
            const batchFiles = files.slice(i, i + BATCH_SIZE);
            const batchPromises = batchFiles.map(async (file) => {
                const fileToUpload = file.size > 10 * 1024 * 1024 ? await compressImage(file) : file;
                return await uploadToImgBB(fileToUpload);
            });
            
            const batchUrls = await Promise.all(batchPromises);
            uploadedUrls = uploadedUrls.concat(batchUrls);
            
            // Cập nhật thanh tiến trình
            const currentCount = Math.min(i + BATCH_SIZE, files.length);
            setProgress(5 + Math.round((currentCount / files.length) * 80));
        }

        setProgress(90);

        const projectTitleTerm = projectTitle || 'Không tên';
        const qSearch = query(collection(db, 'projects_en'), where('title', '==', projectTitleTerm));
        const querySnapshot = await getDocs(qSearch);

        let projectToEdit = null;

        if (!querySnapshot.empty) {
            const existingDoc = querySnapshot.docs[0];
            const existingData = existingDoc.data();
            let oldImages = [];
            if (existingData.images && Array.isArray(existingData.images)) {
                oldImages = existingData.images;
            } else if (existingData.imageUrl) {
                oldImages = [existingData.imageUrl];
            }
            const newlyMergedImages = [...oldImages, ...uploadedUrls];
            await updateDoc(doc(db, 'projects_en', existingDoc.id), { images: newlyMergedImages });
            projectToEdit = { id: existingDoc.id, ...existingData, images: newlyMergedImages };
        } else {
            const newProjectData = {
                title: projectTitleTerm,
                category: projectCategory,
                images: uploadedUrls,
                createdAt: new Date().getTime()
            };
            const newDocRef = await addDoc(collection(db, 'projects_en'), newProjectData);
            projectToEdit = { id: newDocRef.id, ...newProjectData };
        }

        setProgress(100);
        setTimeout(() => {
            setUploading(false);
            setProjectTitle('');
            if (projectToEdit) {
                setEditingProject(projectToEdit);
            }
        }, 500);
    } catch (err) {
        console.error(err);
        showAlert('Lỗi Tải Lên', 'Không thể tải lên. Chi tiết: ' + err);
        setUploading(false);
        setProgress(0);
    }
  };

  const handleDelete = (id) => {
    showConfirm('Xác nhận xóa dự án', 'Bạn có chắc chắn muốn xóa toàn bộ dự án này cùng tất cả ảnh trong đó không? Hành động này không thể hoàn tác.', async () => {
      await deleteDoc(doc(db, 'projects_en', id));
      if (editingProject && editingProject.id === id) setEditingProject(null);
    });
  };

  const handleRemoveSingleImage = async (project, imageIndexToRemove) => {
    if (!project.images || project.images.length <= 1) {
       showConfirm('Xóa ảnh cuối cùng', 'Đây là bức ảnh cuối cùng của dự án. Nếu xóa, toàn bộ bìa dự án này sẽ biến mất. Bạn vẫn muốn tiếp tục?', async () => {
           await deleteDoc(doc(db, 'projects_en', project.id));
           setEditingProject(null);
       });
       return;
    }

    showConfirm('Gỡ 1 tấm ảnh', 'Bạn xác nhận xóa tấm ảnh này khỏi album chứ?', async () => {
        const newImages = project.images.filter((_, idx) => idx !== imageIndexToRemove);
        await updateDoc(doc(db, 'projects_en', project.id), { images: newImages });
        setEditingProject({ ...project, images: newImages });
        setSelectedImageIndexes(prev => prev.filter(idx => idx !== imageIndexToRemove).map(idx => idx > imageIndexToRemove ? idx - 1 : idx));
    });
  };

  const handleToggleSelectImage = (idx) => {
    if (selectedImageIndexes.includes(idx)) {
      setSelectedImageIndexes(selectedImageIndexes.filter(i => i !== idx));
    } else {
      setSelectedImageIndexes([...selectedImageIndexes, idx]);
    }
  };

  const handleMoveSelectedImages = async (targetProjectId) => {
    if (selectedImageIndexes.length === 0 || !targetProjectId) return;
    try {
      const urlsToMove = selectedImageIndexes.map(idx => editingProject.images[idx]);
      const newCurrentImages = editingProject.images.filter((_, idx) => !selectedImageIndexes.includes(idx));
      
      const targetProject = projects.find(p => p.id === targetProjectId);
      const newTargetImages = [...(targetProject.images || []), ...urlsToMove];
      
      await updateDoc(doc(db, 'projects_en', targetProjectId), { images: newTargetImages });
      
      if (newCurrentImages.length === 0) {
         await deleteDoc(doc(db, 'projects_en', editingProject.id));
         setEditingProject(null);
      } else {
         await updateDoc(doc(db, 'projects_en', editingProject.id), { images: newCurrentImages });
         setEditingProject({ ...editingProject, images: newCurrentImages });
      }
      
      setSelectedImageIndexes([]);
      setShowMoveModal(false);
      showAlert('Thành công', `Đã chuyển ${urlsToMove.length} ảnh sang dự án khác.`);
    } catch (err) {
      console.error(err);
      showAlert('Lỗi', 'Không thể chuyển ảnh: ' + err);
    }
  };

  const handleSaveProfile = async () => {
     setSavingProfile(true);
     try {
        await setDoc(doc(db, 'profile', 'english'), profileData);
        showAlert('Thành Công', 'Hồ sơ cá nhân và kỹ năng đã được cập nhật thành công!');
     } catch (e) {
        showAlert('Lỗi', 'Không thể lưu hồ sơ: ' + e);
     }
     setSavingProfile(false);
  };


  // Drag-and-drop: reorder images in array and save to Firestore
  const handleDragStart = useCallback((idx) => {
    dragIdxRef.current = idx;
    setDragActiveIdx(idx);
  }, []);

  const handleDragOver = useCallback((e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    dragOverIdxRef.current = idx;
    setDropTargetIdx(idx);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragActiveIdx(null);
    setDropTargetIdx(null);
    dragIdxRef.current = null;
    dragOverIdxRef.current = null;
  }, []);

  const handleDropImage = useCallback(async (e) => {
    e.preventDefault();
    const fromIdx = dragIdxRef.current;
    const toIdx = dragOverIdxRef.current;
    setDragActiveIdx(null);
    setDropTargetIdx(null);
    dragIdxRef.current = null;
    dragOverIdxRef.current = null;

    if (fromIdx === null || toIdx === null || fromIdx === toIdx || !editingProject) return;

    const newImages = [...editingProject.images];
    const [moved] = newImages.splice(fromIdx, 1);
    newImages.splice(toIdx, 0, moved);
    setEditingProject({ ...editingProject, images: newImages });
    await updateDoc(doc(db, 'projects_en', editingProject.id), { images: newImages });
  }, [editingProject]);

  const filterCategoriesMenu = ['All', ...new Set(projects.map(p => p.category))];
  const filteredProjects = activeFilter === 'All' ? projects : projects.filter(p => p.category === activeFilter);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 relative font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-[#0a0a0a] to-[#0a0a0a]"></div>
        
        <div className="relative w-full max-w-sm">
          <div className="bg-[#111] p-8 md:p-10 rounded-[24px] w-full z-10 flex flex-col gap-8 border border-white/5 shadow-2xl">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Lock className="text-white/80" size={24} />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-white uppercase">PORTFOLIO DO VAN NANG</h1>
                <p className="text-white/40 text-sm mt-1">Vui lòng đăng nhập để tiếp tục</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold pl-1">Email</label>
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập email"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-3.5 outline-none focus:border-white/30 text-sm font-medium text-white transition-all focus:bg-black/80"
                  autoComplete="email"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold pl-1">Mật khẩu</label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-3.5 outline-none focus:border-white/30 text-sm font-medium text-white transition-all focus:bg-black/80"
                  autoComplete="current-password"
                />
              </div>
              
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm justify-center bg-red-500/10 py-2.5 px-4 rounded-lg border border-red-500/20">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <button type="submit" className="w-full mt-2 bg-white text-black font-semibold text-sm py-3.5 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all">
                Đăng Nhập
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Analytics
  const totalProjects = projects.length;
  const totalImages = projects.reduce((acc, p) => acc + (p.images?.length || 1), 0);
  const activeCategories = new Set(projects.map(p => p.category)).size;

  return (
    <div className="min-h-screen bg-[#000] text-[#ededed] flex flex-col overflow-hidden relative font-sans selection:bg-white/20">
      
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none"></div>

      {/* Top Navigation Bar (Sleek, Modern) */}
      <nav className="fixed top-0 left-0 w-full h-16 border-b border-white/5 bg-black/50 backdrop-blur-2xl z-50 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)] shrink-0">
             <Star className="text-black" size={16} fill="currentColor"/>
           </div>
           <span className="font-semibold text-sm tracking-tight hidden sm:block">Workspace</span>
        </div>
        
        {/* Center Pill Navigation */}
        <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-xl absolute left-1/2 -translate-x-1/2">
           <button 
              onClick={() => setActiveTab('portfolio')} 
              className={`px-4 md:px-6 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'portfolio' ? 'bg-white text-black shadow-lg' : 'text-white/50 hover:text-white'}`}
           >
             <LayoutDashboard size={14} className="shrink-0" /> <span className="hidden sm:inline">Kho Tác Phẩm</span>
           </button>
           <button 
              onClick={() => setActiveTab('profile')} 
              className={`px-4 md:px-6 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'profile' ? 'bg-white text-black shadow-lg' : 'text-white/50 hover:text-white'}`}
           >
             <User size={14} className="shrink-0" /> <span className="hidden sm:inline">Hồ Sơ Năng Lực</span>
           </button>
        </div>
        
        <button onClick={handleLogout} className="text-white/40 hover:text-red-400 text-xs md:text-sm font-semibold flex items-center gap-2 transition-colors px-2 md:px-3 py-1.5 rounded-lg hover:bg-red-500/10">
          <span className="hidden sm:inline">Đăng Xuất</span> <LogOut size={16} className="shrink-0" />
        </button>
      </nav>

      {/* Main Content Workspace */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 w-full h-screen pt-24 pb-12 custom-scrollbar">
        <div className="px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto flex flex-col gap-8 md:gap-10">

          {activeTab === 'portfolio' ? (
            <>
              {/* Dashboard Overview */}
              <div className="flex flex-col gap-8 items-start mb-2 md:mb-4">
                <div className="flex flex-col gap-3 max-w-2xl">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white break-words">
                    Overview.
                  </h1>
                  <p className="text-white/40 text-sm md:text-base font-medium leading-relaxed">
                    System is running stably. Your portfolio is managed and optimized across all displays.
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-3 md:gap-6 w-full">
                  <div className="flex flex-col gap-2 bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-white/5 rounded-[1.5rem] p-4 md:p-6 shadow-xl relative overflow-hidden group">
                     <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
                     <span className="text-[9px] md:text-xs uppercase tracking-widest text-white/50 font-bold flex flex-col md:flex-row md:items-center gap-1.5 md:gap-2 relative z-10"><FolderHeart size={14} className="text-blue-400 shrink-0"/> <span className="truncate">Tác Phẩm</span></span>
                     <span className="text-3xl md:text-5xl font-bold tracking-tighter text-white relative z-10 mt-1">{totalProjects}</span>
                  </div>
                  
                  <div className="flex flex-col gap-2 bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-white/5 rounded-[1.5rem] p-4 md:p-6 shadow-xl relative overflow-hidden group">
                     <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-500"></div>
                     <span className="text-[9px] md:text-xs uppercase tracking-widest text-white/50 font-bold flex flex-col md:flex-row md:items-center gap-1.5 md:gap-2 relative z-10"><MImageIcon size={14} className="text-purple-400 shrink-0"/> <span className="truncate">Hình Ảnh</span></span>
                     <span className="text-3xl md:text-5xl font-bold tracking-tighter text-white relative z-10 mt-1">{totalImages}</span>
                  </div>
                  
                  <div className="flex flex-col gap-2 bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-white/5 rounded-[1.5rem] p-4 md:p-6 shadow-xl relative overflow-hidden group">
                     <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all duration-500"></div>
                     <span className="text-[9px] md:text-xs uppercase tracking-widest text-white/50 font-bold flex flex-col md:flex-row md:items-center gap-1.5 md:gap-2 relative z-10"><BarChart3 size={14} className="text-green-400 shrink-0"/> <span className="truncate">Hạng Mục</span></span>
                     <span className="text-3xl md:text-5xl font-bold tracking-tighter text-white relative z-10 mt-1">{activeCategories}</span>
                  </div>
                </div>
              </div>

              {/* Main Content: Horizontal Upload Bar & Full Width Gallery */}
              <div className="flex flex-col gap-8 w-full mt-2">
                 
                 {/* Horizontal Upload Bar */}
                 <section className="w-full flex flex-col lg:flex-row items-center gap-6 p-4 md:p-6 rounded-[2rem] bg-gradient-to-r from-[#111] to-[#0a0a0a] border border-white/5 shadow-2xl relative overflow-visible">
                   
                   {/* Studio Badge */}
                   <div className="flex items-center gap-3 w-full lg:w-auto min-w-[200px]">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.4)] shrink-0">
                        <Star className="text-black" fill="currentColor" size={20} />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">Stitch Studio</span>
                         <h2 className="text-xl font-bold tracking-tight text-white leading-none mt-1">Khởi Tạo Mới</h2>
                      </div>
                   </div>
                   
                   {/* Inputs */}
                   <div className="flex-1 flex flex-col lg:flex-row gap-4 w-full relative z-10">
                     <div className="flex-1">
                       <input 
                         type="text" 
                         value={projectTitle}
                         onChange={(e) => setProjectTitle(e.target.value)}
                         placeholder="Nhập tên tác phẩm..." 
                         className="w-full bg-transparent border-b-2 border-white/10 px-2 py-3 outline-none focus:border-white text-white placeholder-white/30 transition-all text-sm md:text-base font-semibold"
                         disabled={uploading}
                       />
                     </div>
                     
                     <div className="lg:w-[250px] w-full relative">
                       <div 
                         className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-5 py-3.5 cursor-pointer text-white flex justify-between items-center transition-all hover:bg-[#222]"
                         onClick={() => !uploading && setIsDropdownOpen(!isDropdownOpen)}
                       >
                         <span className="font-semibold text-sm">{projectCategory}</span>
                         <ChevronDown className={`transition-transform duration-300 text-white/50 ${isDropdownOpen ? 'rotate-180' : ''}`} size={16} />
                       </div>
                       
                       {isDropdownOpen && !uploading && (
                         <div className="absolute top-[60px] left-0 w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-2 z-[60] shadow-2xl animate-[zoom-in_0.1s_ease-out_forwards]">
                           {uploadCategories.map(cat => (
                             <div 
                               key={cat} 
                               className={`px-4 py-3 rounded-lg cursor-pointer font-medium text-sm transition-all flex items-center gap-3 ${projectCategory === cat ? 'bg-white text-black' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
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

                   {/* Dropzone / Upload Button */}
                   <label className={`lg:w-[250px] w-full h-14 border border-dashed rounded-xl flex items-center justify-center transition-all cursor-pointer relative overflow-hidden bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/40 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                     <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileUpload} disabled={uploading} />
                     
                     {uploading ? (
                       <div className="flex items-center justify-center gap-3 z-10 w-full px-4">
                         <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                         <span className="font-bold text-xs text-white">{progress}% Đang Tải...</span>
                         <div className="absolute bottom-0 left-0 h-1 bg-white transition-all duration-300" style={{ width: `${progress}%` }} />
                       </div>
                     ) : (
                       <div className="flex items-center gap-2">
                          <PlusCircle className="text-white" size={18} />
                          <span className="font-bold text-xs uppercase tracking-widest text-white">Chọn Ảnh</span>
                       </div>
                     )}
                   </label>
                 </section>

                 {/* Gallery View (Full Width Masonry) */}
                 <section className="w-full pb-12">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 mt-2">
                      <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-bold tracking-tight text-white">Thư Viện</h2>
                        <span className="px-4 py-1.5 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white border border-white/10 shadow-inner">{filteredProjects.length} Tác Phẩm</span>
                      </div>
                      
                      {/* Filters */}
                      <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
                         {filterCategoriesMenu.map(cat => (
                            <button 
                               key={cat}
                               onClick={() => setActiveFilter(cat)}
                               className={`px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-2 ${activeFilter === cat ? 'bg-white border-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-[#1a1a1a] border-white/5 text-white/50 hover:bg-[#222] hover:text-white'}`}
                            >
                               {cat}
                               {cat !== 'All' && (
                                 <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeFilter === cat ? 'bg-black/10' : 'bg-white/10'}`}>
                                   {projects.filter(p => p.category === cat).length}
                                 </span>
                               )}
                            </button>
                         ))}
                      </div>
                   </div>
                   
                   {/* Masonry Layout */}
                   <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                     {filteredProjects.map((proj) => (
                       <div 
                          key={proj.id} 
                          className="group/item relative cursor-pointer break-inside-avoid"
                          onClick={() => setEditingProject(proj)}
                       >
                         <div className="w-full rounded-3xl overflow-hidden relative bg-[#111] border border-white/5 group-hover/item:border-white/30 transition-all duration-500 shadow-xl group-hover/item:shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
                            <img src={proj.images?.[0] || proj.imageUrl} alt={proj.title} className="w-full object-cover opacity-80 group-hover/item:opacity-100 group-hover/item:scale-105 transition-transform duration-700 ease-out" />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4 md:p-5 opacity-100 transition-all duration-300 group-hover/item:from-black">
                              <h3 className="text-base font-bold text-white leading-tight mb-1 drop-shadow-md">{proj.title}</h3>
                              <span className="text-[10px] uppercase tracking-widest font-bold text-white/80 drop-shadow-md">{proj.category}</span>
                            </div>
                            
                            {/* Delete Button Corner */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 z-20">
                               <button 
                                  onClick={(e) => { e.stopPropagation(); handleDelete(proj.id); }} 
                                  className="w-10 h-10 rounded-2xl bg-red-500/90 backdrop-blur-md text-white flex items-center justify-center hover:bg-red-500 transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                                  title="Xóa bộ ảnh"
                               >
                                 <Trash2 size={16} />
                               </button>
                            </div>
                            
                            {/* Image Count Badge */}
                            {(proj.images?.length > 1) && (
                              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xl text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-xl z-10 border border-white/10 flex items-center gap-1.5 shadow-sm">
                                <MImageIcon size={14}/> {proj.images.length}
                              </div>
                            )}
                         </div>
                       </div>
                     ))}
                   </div>
                   
                   {filteredProjects.length === 0 && (
                     <div className="w-full h-80 flex flex-col items-center justify-center text-white/40 border-2 border-dashed border-white/10 rounded-[2rem] bg-[#111]">
                       <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-5 border border-white/5">
                          <ImageIcon size={28} className="opacity-40" />
                       </div>
                       <p className="font-bold text-sm uppercase tracking-widest">Empty Archive</p>
                     </div>
                   )}
                 </section>
              </div>
            </>
          ) : (
            /* Profile Management Tab */
            <div className="flex flex-col gap-8 pb-12 mt-4">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                 <div className="flex flex-col gap-3">
                   <div className="flex items-center gap-3 mb-1">
                      <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[9px] text-green-400 tracking-widest uppercase font-bold flex items-center gap-1.5 w-fit">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div> ĐÃ KẾT NỐI (LIVE SYNC)
                      </span>
                   </div>
                   <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-white">
                     Hồ Sơ Năng Lực.
                   </h2>
                   <p className="text-white/40 text-sm md:text-base font-medium max-w-xl leading-relaxed">Manage your professional experience, technical skills, and key statistics. All changes sync seamlessly to your live portfolio.</p>
                 </div>
                 <button onClick={handleSaveProfile} disabled={savingProfile} className={`w-full md:w-auto px-8 py-4 rounded-2xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 text-xs shadow-2xl ${savingProfile ? 'bg-[#1a1a1a] text-white/50 cursor-not-allowed border border-white/10' : 'bg-white text-black hover:bg-white/90 active:scale-[0.98]'}`}>
                   {savingProfile ? (
                      <><div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div> ĐANG LƯU...</>
                   ) : (
                      <><Save size={18} /> CẬP NHẬT HỒ SƠ</>
                   )}
                 </button>
               </div>
               
               {/* Horizontal Sub-Tabs (Clean text-based) */}
               <div className="flex gap-8 overflow-x-auto pb-2 custom-scrollbar-hide border-b border-white/5">
                  <button onClick={() => setActiveProfileTab('experience')} className={`shrink-0 pb-4 text-sm font-semibold uppercase tracking-widest transition-all border-b-2 ${activeProfileTab === 'experience' ? 'border-white text-white' : 'border-transparent text-white/40 hover:text-white/80'}`}>Kinh Nghiệm</button>
                  <button onClick={() => setActiveProfileTab('skills')} className={`shrink-0 pb-4 text-sm font-semibold uppercase tracking-widest transition-all border-b-2 ${activeProfileTab === 'skills' ? 'border-white text-white' : 'border-transparent text-white/40 hover:text-white/80'}`}>Kỹ Năng Phần Mềm</button>
                  <button onClick={() => setActiveProfileTab('contact')} className={`shrink-0 pb-4 text-sm font-semibold uppercase tracking-widest transition-all border-b-2 ${activeProfileTab === 'contact' ? 'border-white text-white' : 'border-transparent text-white/40 hover:text-white/80'}`}>Liên Hệ</button>
                  <button onClick={() => setActiveProfileTab('stats')} className={`shrink-0 pb-4 text-sm font-semibold uppercase tracking-widest transition-all border-b-2 ${activeProfileTab === 'stats' ? 'border-white text-white' : 'border-transparent text-white/40 hover:text-white/80'}`}>Chỉ Số Nổi Bật</button>
                  <button onClick={() => setActiveProfileTab('faq')} className={`shrink-0 pb-4 text-sm font-semibold uppercase tracking-widest transition-all border-b-2 ${activeProfileTab === 'faq' ? 'border-white text-white' : 'border-transparent text-white/40 hover:text-white/80'}`}>Câu Hỏi (FAQ)</button>
               </div>
               
               {/* Experience Sec */}
               {activeProfileTab === 'experience' && (
               <section className="bg-[#111] p-6 lg:p-8 rounded-3xl border border-white/5 shadow-sm flex flex-col gap-6 relative animate-[fade-in_0.3s_ease-out_forwards]">
                 <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2"><Briefcase size={20} className="text-white/80"/> Kinh Nghiệm Làm Việc</h3>
                    <button 
                       onClick={() => setProfileData({...profileData, experience: [...(profileData.experience || []), {startDate: '2024-01', endDate: '', isCurrent: true, role: 'New Role', desc: 'Job Description'}]})}
                       className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-widest hover:bg-white/10 shadow-sm"
                    >
                      <PlusCircle size={16}/> Thêm Kinh Nghiệm
                    </button>
                 </div>
                 
                 <div className="flex flex-col gap-4">
                    {!(profileData.experience && profileData.experience.length > 0) ? (
                       <p className="text-center text-white/40 py-6 border border-dashed border-white/10 rounded-2xl">No experience configured yet, click Add!</p>
                    ) : profileData.experience.map((exp, idx) => (
                      <div key={idx} className="flex flex-col gap-3 bg-[#1a1a1a] p-5 md:p-6 rounded-2xl border border-white/5 relative group/exp hover:border-white/20 transition-all shadow-sm mt-4 md:mt-0">
                        {/* Mobile Header with Trash */}
                        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-2 md:hidden">
                            <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Mốc Kinh Nghiệm {idx + 1}</span>
                            <button 
                               onClick={() => {
                                 const arr = profileData.experience.filter((_, i) => i !== idx);
                                 setProfileData({...profileData, experience: arr});
                               }}
                               className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                            >
                               <Trash2 size={14}/>
                            </button>
                         </div>

                        <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-6">
                           <div className="flex flex-col gap-1 w-full md:w-[45%]">
                             <div className="flex items-center justify-between">
                               <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Thời gian</label>
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
                                    className="accent-white w-3 h-3" 
                                  /> 
                                  <span className="text-[10px] text-white/50 group-hover:text-white transition-colors tracking-widest uppercase font-semibold">Đến hiện tại</span>
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
                                  className="bg-[#111] border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white focus:border-white/30 flex-1 min-w-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 outline-none" 
                               />
                               <span className="text-white/40 text-xs font-bold">-</span>
                               {exp.isCurrent ? (
                                  <div className="bg-[#111] border border-white/5 rounded-lg px-2 py-1.5 text-[11px] text-white flex-1 text-center font-semibold overflow-hidden text-ellipsis whitespace-nowrap pt-[7px]">Hiện tại</div>
                               ) : (
                                 <input 
                                    type="date"
                                    value={exp.endDate || ''} 
                                    onChange={(e) => {
                                      const arr = [...profileData.experience]; arr[idx].endDate = e.target.value; setProfileData({...profileData, experience: arr});
                                    }} 
                                    style={{ colorScheme: 'dark' }}
                                    className="bg-[#111] border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white focus:border-white/30 flex-1 min-w-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 outline-none" 
                                 />
                               )}
                             </div>
                           </div>
                           <div className="flex flex-col gap-3 flex-1 w-full">
                             <div className="flex flex-col gap-1 w-full">
                               <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Chức danh / Vị trí</label>
                               <input 
                                  value={exp.role || ''} 
                                  onChange={(e) => {
                                    const arr = [...profileData.experience]; arr[idx].role = e.target.value; setProfileData({...profileData, experience: arr});
                                  }} 
                                  placeholder="e.g. Senior Graphic Designer"
                                  className="bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-white/30 w-full outline-none focus:bg-[#1a1a1a] transition-all" 
                               />
                             </div>
                             <div className="flex flex-col gap-1 w-full">
                               <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Tên Công Ty / Tổ Chức</label>
                               <input 
                                  value={exp.company || ''} 
                                  onChange={(e) => {
                                    const arr = [...profileData.experience]; arr[idx].company = e.target.value; setProfileData({...profileData, experience: arr});
                                  }} 
                                  placeholder="e.g. Google, Upwork, Freelance..."
                                  className="bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-white/30 w-full outline-none focus:bg-[#1a1a1a] transition-all" 
                               />
                             </div>
                           </div>
                        </div>
                        <div className="flex flex-col gap-1 w-full relative">
                           <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Mô tả công việc</label>
                           <div className="flex flex-col gap-2 mt-2">
                              {(exp.desc || '').split('\n').map((line, lineIdx) => {
                                const rawText = line.replace(/^[\-\•\*W+]\s*/, '');
                                return (
                                <div key={lineIdx} className="flex gap-2 items-start group/inp">
                                   <div className="w-1.5 h-1.5 rounded-sm bg-white/20 group-focus-within/inp:bg-white group-focus-within/inp:rotate-45 transition-all shrink-0 mt-2.5" />
                                   <textarea rows="2" value={rawText} onChange={(e) => { const arr = [...profileData.experience]; const lines = (exp.desc || '').split('\n'); lines[lineIdx] = e.target.value; arr[idx].desc = lines.join('\n'); setProfileData({...profileData, experience: arr}); }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); const arr = [...profileData.experience]; const lines = (exp.desc || '').split('\n'); lines.splice(lineIdx + 1, 0, ''); arr[idx].desc = lines.join('\n'); setProfileData({...profileData, experience: arr}); } else if (e.key === 'Backspace' && rawText === '' && (exp.desc || '').split('\n').length > 1) { e.preventDefault(); const arr = [...profileData.experience]; const lines = (exp.desc || '').split('\n'); lines.splice(lineIdx, 1); arr[idx].desc = lines.join('\n'); setProfileData({...profileData, experience: arr}); } }} placeholder="Type job details... (Shift+Enter for new line)" className="bg-[#111] border border-white/10 text-white focus:border-white/30 px-4 py-2.5 rounded-xl text-sm w-full outline-none focus:bg-[#1a1a1a] transition-all resize-y" />
                                   <button onClick={() => { const arr = [...profileData.experience]; const lines = (exp.desc || '').split('\n'); lines.splice(lineIdx, 1); if(lines.length === 0) lines.push(''); arr[idx].desc = lines.join('\n'); setProfileData({...profileData, experience: arr}); }} className="text-white/20 hover:text-red-500 mt-1.5 px-1 pb-1">
                                     <Trash2 size={14} />
                                   </button>
                                </div>
                              )})}
                            <button onClick={() => { const arr = [...profileData.experience]; const lines = (exp.desc || '').split('\n'); lines.push(''); arr[idx].desc = lines.join('\n'); setProfileData({...profileData, experience: arr}); }} className="text-[10px] text-white/50 hover:text-white flex items-center gap-1 mt-1 w-fit uppercase tracking-widest font-semibold font-sans">
                               <PlusCircle size={12} /> Thêm Ý Mới
                            </button>
                           </div>
                        </div>
                        <button 
                           onClick={() => {
                             const arr = profileData.experience.filter((_, i) => i !== idx);
                             setProfileData({...profileData, experience: arr});
                           }}
                           className="hidden md:flex absolute right-4 top-4 w-8 h-8 rounded-lg bg-red-500/10 text-red-400 items-center justify-center hover:bg-red-500 hover:text-white transition-all"
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
               <section className="bg-[#111] p-6 lg:p-8 rounded-3xl border border-white/5 shadow-sm flex flex-col gap-6 relative animate-[fade-in_0.3s_ease-out_forwards]">
                 <h3 className="text-lg font-semibold flex items-center gap-2"><LayoutDashboard size={20} className="text-white/80"/> Liên Hệ & Networking</h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="flex flex-col gap-2">
                     <label className="text-[10px] text-white/50 uppercase font-semibold tracking-widest pl-1">Email</label>
                     <input value={profileData.contact.email} onChange={(e) => setProfileData({...profileData, contact: {...profileData.contact, email: e.target.value}})} placeholder="abc@gmail.com" className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-white/30 text-white transition-all" />
                   </div>
                   <div className="flex flex-col gap-2">
                     <label className="text-[10px] text-white/50 uppercase font-semibold tracking-widest pl-1">Số điện thoại</label>
                     <input value={profileData.contact.phone} onChange={(e) => setProfileData({...profileData, contact: {...profileData.contact, phone: e.target.value}})} placeholder="0123 456 789" className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-white/30 text-white transition-all" />
                   </div>
                   <div className="flex flex-col gap-2">
                     <label className="text-[10px] text-white/50 uppercase font-semibold tracking-widest pl-1">Địa chỉ (Vị trí)</label>
                     <input value={profileData.contact.address} onChange={(e) => setProfileData({...profileData, contact: {...profileData.contact, address: e.target.value}})} placeholder="Hà Nội, VN" className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-white/30 text-white transition-all" />
                   </div>
                   <div className="flex flex-col gap-2">
                     <label className="text-[10px] text-white/50 uppercase font-semibold tracking-widest pl-1">Link mạng xã hội (Behance / FB)</label>
                     <input value={profileData.contact.behance} onChange={(e) => setProfileData({...profileData, contact: {...profileData.contact, behance: e.target.value}})} placeholder="behance.net/..." className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-white/30 text-white transition-all" />
                   </div>
                </div>
               </section>
               )}

               {/* Stats Sec */}
               {activeProfileTab === 'stats' && (
               <section className="bg-[#111] p-6 lg:p-8 rounded-3xl border border-white/5 shadow-sm flex flex-col gap-6 relative animate-[fade-in_0.3s_ease-out_forwards]">
                 <h3 className="text-lg font-semibold flex items-center gap-2"><BarChart3 size={20} className="text-white/80"/> Chỉ Số Hoạt Động (Stats)</h3>
                 
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="flex flex-col gap-2">
                     <label className="text-[10px] text-white/50 uppercase font-semibold tracking-widest pl-1">Năm Kinh Nghiệm</label>
                     <input value={profileData.stats?.years || '2+'} onChange={(e) => setProfileData({...profileData, stats: {...profileData.stats, years: e.target.value}})} className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-white/30 text-white font-medium transition-all" />
                   </div>
                   <div className="flex flex-col gap-2">
                     <label className="text-[10px] text-white/50 uppercase font-semibold tracking-widest pl-1">Dự Án Hoàn Thành</label>
                     <input value={profileData.stats?.projects || '120+'} onChange={(e) => setProfileData({...profileData, stats: {...profileData.stats, projects: e.target.value}})} className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-white/30 text-white font-medium transition-all" />
                   </div>
                   <div className="flex flex-col gap-2">
                     <label className="text-[10px] text-white/50 uppercase font-semibold tracking-widest pl-1">KH Hài Lòng</label>
                     <input value={profileData.stats?.clients || '80+'} onChange={(e) => setProfileData({...profileData, stats: {...profileData.stats, clients: e.target.value}})} className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-white/30 text-white font-medium transition-all" />
                   </div>
                   <div className="flex flex-col gap-2">
                     <label className="text-[10px] text-white/50 uppercase font-semibold tracking-widest pl-1">Giải Thưởng</label>
                     <input value={profileData.stats?.awards || '10+'} onChange={(e) => setProfileData({...profileData, stats: {...profileData.stats, awards: e.target.value}})} className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-white/30 text-white font-medium transition-all" />
                   </div>
                 </div>
               </section>
               )}

               {/* Skills Sec */}
               {activeProfileTab === 'skills' && (
               <section className="bg-[#111] p-6 lg:p-8 rounded-3xl border border-white/5 shadow-sm flex flex-col gap-6 relative animate-[fade-in_0.3s_ease-out_forwards]">
                 <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2"><FolderHeart size={20} className="text-white/80"/> Danh Sách Kỹ Năng Đồ Họa</h3>
                    <button 
                       onClick={() => setProfileData({...profileData, skills: [...profileData.skills, {name: 'Skill mới', iconUrl: '', percentage: '80%', color: '#ffffff'}]})}
                       className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-widest hover:bg-white/10 shadow-sm"
                    >
                      <PlusCircle size={16}/> Thêm Kỹ Năng
                    </button>
                 </div>
                 
                 <div className="flex flex-col gap-4">
                   {profileData.skills.length === 0 ? (
                      <p className="text-center text-white/40 py-8 border border-dashed border-white/10 rounded-2xl">Chưa cấu hình kỹ năng nào, hãy bấm nút Thêm!</p>
                   ) : profileData.skills.map((s, idx) => (
                     <div key={idx} className="flex flex-col md:flex-row md:flex-nowrap md:items-center gap-3 bg-[#1a1a1a] p-4 md:pr-14 rounded-2xl border border-white/5 relative group/skillrow hover:border-white/20 transition-all shadow-sm">
                        
                        {/* Mobile Header with Trash */}
                        <div className="flex items-center justify-between border-b border-white/5 pb-3 md:hidden w-full">
                            <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Kỹ Năng {idx + 1}</span>
                            <button 
                               onClick={() => {
                                 const arr = profileData.skills.filter((_, i) => i !== idx);
                                 setProfileData({...profileData, skills: arr});
                               }}
                               className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                            >
                               <Trash2 size={14}/>
                            </button>
                         </div>

                        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full">
                          <div className="flex flex-col gap-1 w-full md:w-1/3 shrink-0">
                            <label className="text-[10px] text-white/50 uppercase font-semibold tracking-widest pl-1">Tên Phầm Mềm</label>
                            <input 
                               value={s.name} 
                               onChange={(e) => {
                                 const arr = [...profileData.skills]; arr[idx].name = e.target.value; setProfileData({...profileData, skills: arr});
                               }} 
                               className="bg-[#111] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-white/30 outline-none transition-all" 
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full flex-1">
                            <label className="text-[10px] text-white/50 uppercase font-semibold tracking-widest pl-1">Link Ảnh Icon (URL)</label>
                            <div className="flex gap-2">
                               {s.iconUrl && <img src={s.iconUrl} className="w-10 h-10 rounded-xl object-cover shadow-sm bg-white border border-white/10" alt="Ico" />}
                               <input 
                                  value={s.iconUrl} 
                                  placeholder="https://...png"
                                  onChange={(e) => {
                                    const arr = [...profileData.skills]; arr[idx].iconUrl = e.target.value; setProfileData({...profileData, skills: arr});
                                  }} 
                                  className="flex-1 bg-[#111] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-white/30 outline-none transition-all" 
                               />
                            </div>
                          </div>
                        </div>
                        
                        <button 
                           onClick={() => {
                             const arr = profileData.skills.filter((_, i) => i !== idx);
                             setProfileData({...profileData, skills: arr});
                           }}
                           className="hidden md:flex md:absolute right-4 top-1/2 md:-translate-y-1/2 w-8 h-8 rounded-lg bg-red-500/10 text-red-400 items-center justify-center hover:bg-red-500 hover:text-white transition-all"
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
               <section className="bg-[#111] p-6 lg:p-8 rounded-3xl border border-white/5 shadow-sm flex flex-col gap-6 relative animate-[fade-in_0.3s_ease-out_forwards]">
                 <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                       <MessageCircle size={20} className="text-white/80"/> Quản lý Hỏi Đáp (FAQ)
                    </h3>
                    <button 
                       onClick={() => setProfileData({...profileData, faqs: [...(profileData.faqs || []), {q: 'Câu hỏi mới?', a: 'Nhập câu trả lời chi tiết ở đây.'}]})}
                       className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-widest hover:bg-white/10 shadow-sm"
                    >
                      <PlusCircle size={16}/> Thêm Câu Hỏi
                    </button>
                 </div>
                 
                 <div className="flex flex-col gap-4">
                   {!(profileData.faqs && profileData.faqs.length > 0) ? (
                      <p className="text-center text-white/40 py-8 border border-dashed border-white/10 rounded-2xl">Chưa cấu hình câu hỏi nào. Dữ liệu gốc sẽ tự động được sử dụng nếu bạn để trống.</p>
                   ) : profileData.faqs.map((f, idx) => (
                     <div key={idx} className="flex flex-col gap-3 bg-[#1a1a1a] p-5 rounded-2xl border border-white/5 relative group/faq hover:border-white/20 transition-all shadow-sm">
                        
                        <div className="flex flex-col gap-1 w-full md:w-[90%]">
                          <label className="text-[10px] text-white/50 uppercase font-semibold tracking-widest pl-1">Câu Hỏi (Q)</label>
                          <input 
                             value={f.q} 
                             onChange={(e) => {
                               const arr = [...profileData.faqs]; arr[idx].q = e.target.value; setProfileData({...profileData, faqs: arr});
                             }} 
                             className="bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-white/30 font-medium outline-none transition-all" 
                          />
                        </div>
                        <div className="flex flex-col gap-1 w-full md:w-[90%]">
                          <label className="text-[10px] text-white/50 uppercase font-semibold tracking-widest pl-1">Câu Trả Lời (A)</label>
                          <textarea 
                             rows="3"
                             value={f.a} 
                             onChange={(e) => {
                               const arr = [...profileData.faqs]; arr[idx].a = e.target.value; setProfileData({...profileData, faqs: arr});
                             }} 
                             className="bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-sm text-white/70 focus:border-white/30 focus:text-white outline-none resize-y transition-all" 
                          />
                        </div>
                        
                        {/* Delete Button */}
                        <div className="flex justify-end md:contents mt-2 md:mt-0">
                           <button 
                              onClick={() => {
                                const arr = profileData.faqs.filter((_, i) => i !== idx);
                                setProfileData({...profileData, faqs: arr});
                              }}
                              className="md:absolute right-4 top-1/2 md:-translate-y-1/2 w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all opacity-100 md:opacity-0 group-hover/faq:opacity-100"
                              title="Xóa câu hỏi này"
                           >
                              <Trash2 size={16}/>
                           </button>
                        </div>
                     </div>
                   ))}
                 </div>
               </section>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Custom Global Modal (for errors & confirms only) */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
           <div className="bg-[#111] border border-white/5 p-8 rounded-[2rem] shadow-2xl max-w-sm w-full animate-[zoom-in_0.2s_ease-out_forwards] relative overflow-hidden">
              <div className="flex items-center gap-4 mb-4">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center border shrink-0 ${
                   modal.type === 'confirm' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 
                   'bg-red-500/10 border-red-500/20 text-red-500'
                 }`}>
                   <AlertCircle size={24} />
                 </div>
                 <h3 className="text-xl font-bold tracking-tight">{modal.title}</h3>
              </div>
              <p className="text-white/70 mb-8 text-sm leading-relaxed font-medium">{modal.message}</p>
              
              <div className="flex justify-end gap-3 font-bold">
                 {modal.type === 'confirm' && (
                   <button onClick={() => setModal({ ...modal, isOpen: false })} className="px-6 py-3 rounded-xl bg-[#1a1a1a] hover:bg-white/10 transition-colors border border-white/5 uppercase tracking-widest text-xs">
                     Hủy
                   </button>
                 )}
                 <button 
                   onClick={() => {
                     const cb = modal.onConfirm;
                     setModal({ ...modal, isOpen: false });
                     if (cb) cb();
                   }} 
                   className={`px-6 py-3 rounded-xl uppercase tracking-widest text-xs transition-all hover:scale-[1.03] ${
                     modal.type === 'confirm' ? 'bg-red-600 hover:bg-red-500 text-white' : 
                     'bg-white text-black hover:bg-white/90'
                   }`}
                 >
                   {modal.type === 'confirm' ? 'XÁC NHẬN' : 'Đã Rõ'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Success Toast Notification */}
      <div className={`fixed top-20 right-4 md:right-8 z-[200] transition-all duration-500 ease-out ${
        toast.show ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0 pointer-events-none'
      }`}>
        <div className="bg-[#111] border border-green-500/30 rounded-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(34,197,94,0.15)] max-w-sm w-[340px] relative overflow-hidden">
          {/* Green glow */}
          <div className="absolute -top-10 -left-10 w-28 h-28 bg-green-500/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-start gap-3.5 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-green-500/15 border border-green-500/30 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(34,197,94,0.3)]">
              <CheckCircle2 size={20} className="text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white tracking-tight">{toast.title}</h4>
              <p className="text-white/50 text-xs mt-1 leading-relaxed">{toast.message}</p>
            </div>
            <button 
              onClick={() => setToast({ show: false, title: '', message: '' })}
              className="text-white/30 hover:text-white text-lg leading-none mt-0.5 shrink-0 transition-colors"
            >
              ×
            </button>
          </div>
          
          {/* Auto-dismiss progress bar */}
          {toast.show && (
            <div className="absolute bottom-0 left-0 h-0.5 bg-green-500/50 rounded-full animate-[shrink_3.5s_linear_forwards]" style={{ width: '100%' }} />
          )}
        </div>
      </div>

      {/* Edit Project Images Modal */}
      {editingProject && (
        <div 
           className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8 cursor-zoom-out"
           onClick={() => setEditingProject(null)}
        >
           <div 
             className="bg-[#111] border border-white/5 p-6 md:p-8 rounded-[2rem] shadow-2xl max-w-[95vw] xl:max-w-[1400px] w-full max-h-[90vh] flex flex-col animate-[zoom-in_0.2s_ease-out_forwards] relative overflow-hidden cursor-default"
             onClick={(e) => e.stopPropagation()}
           >
              
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                 <div className="flex-1 pr-4">
                   <div className="flex flex-col md:flex-row md:items-center gap-3">
                     <input 
                        type="text" 
                        value={editingProject.title} 
                        onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                        onBlur={async (e) => {
                           const val = e.target.value.trim();
                           if (val) {
                             await updateDoc(doc(db, 'projects_en', editingProject.id), { title: val });
                           }
                        }}
                        className="text-2xl md:text-3xl font-bold bg-transparent outline-none border-b-2 border-transparent hover:border-white/20 focus:border-white/50 transition-colors w-full max-w-[500px] pb-1"
                        title="Nhấn để sửa tên dự án"
                     />
                     <span className="px-3 py-1.5 bg-white/5 text-white/80 text-[10px] uppercase tracking-widest rounded-xl border border-white/5 w-fit shrink-0 whitespace-nowrap">{editingProject.images?.length || 1} ẢNH</span>
                   </div>
                   <div className="flex items-center gap-2 mt-2">
                     <select
                        value={editingProject.category || ''}
                        onChange={async (e) => {
                           const newCat = e.target.value;
                           setEditingProject({...editingProject, category: newCat});
                           await updateDoc(doc(db, 'projects_en', editingProject.id), { category: newCat });
                        }}
                        className="text-white/50 text-[10px] md:text-xs uppercase tracking-[0.3em] font-semibold bg-transparent outline-none cursor-pointer border-b border-transparent hover:border-white/20 focus:border-white/50 transition-colors appearance-none pb-0.5"
                        title="Nhấn để sửa danh mục"
                     >
                        {uploadCategories.map(cat => (
                           <option key={cat} value={cat} className="bg-[#1a1a1a] text-white tracking-normal normal-case font-sans">
                              {cat}
                           </option>
                        ))}
                     </select>
                     <div className="pointer-events-none text-white/30 text-xs">▼</div>
                   </div>
                 </div>
                 <div className="flex items-center gap-2 md:gap-3">
                   {selectedImageIndexes.length > 0 && (
                     <button onClick={() => setShowMoveModal(true)} className="px-3 md:px-5 h-10 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:shadow-[0_0_25px_rgba(56,189,248,0.6)] hover:-translate-y-0.5 font-bold text-[10px] md:text-sm transition-all duration-300 flex items-center gap-1.5 md:gap-2 border border-white/20">
                       <FolderHeart size={16} className="animate-bounce md:w-[18px] md:h-[18px]" />
                       <span className="whitespace-nowrap uppercase tracking-wider">Chuyển {selectedImageIndexes.length}</span>
                     </button>
                   )}
                   <button onClick={() => { setEditingProject(null); setSelectedImageIndexes([]); setShowMoveModal(false); }} className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-white/50 hover:text-white hover:scale-105 shrink-0">
                     <span className="font-bold text-lg md:text-xl pointer-events-none">X</span>
                   </button>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {/* Card to upload more images */}
                  <div className="relative w-full h-48 md:h-56 lg:h-64">
                    <label className={`absolute inset-0 group/addcard rounded-2xl overflow-hidden border border-dashed border-white/10 hover:border-white/30 transition-all bg-[#1a1a1a] hover:bg-[#222] flex flex-col items-center justify-center cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                       <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => handleAddImagesToProject(e, editingProject)} disabled={uploading} />
                       {uploading ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-[spin_1s_linear_infinite]"></div>
                            <span className="text-white font-bold text-sm">{progress}%</span>
                          </div>
                       ) : (
                          <div className="flex flex-col items-center gap-2 opacity-60 group-hover/addcard:opacity-100 transition-opacity">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                              <PlusCircle size={24} />
                            </div>
                            <span className="font-bold text-[10px] uppercase tracking-widest text-white">Thêm Ảnh</span>
                          </div>
                       )}
                    </label>
                  </div>

                  {editingProject.images?.map((imgStr, idx) => (
                     <div 
                        key={idx} 
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.effectAllowed = 'move';
                          e.dataTransfer.setData('text/plain', idx);
                          handleDragStart(idx);
                        }}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDrop={handleDropImage}
                        onDragEnd={handleDragEnd}
                        className={`relative group/editcard rounded-3xl overflow-hidden h-48 md:h-56 lg:h-64 border transition-all duration-300 flex items-center justify-center cursor-grab active:cursor-grabbing
                          ${dragActiveIdx === idx ? 'opacity-40 scale-95 border-dashed border-white/30' : ''}
                          ${dropTargetIdx === idx && dragActiveIdx !== null && dragActiveIdx !== idx ? 'border-white/60 bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.15)] scale-[1.03]' : ''}
                          ${selectedImageIndexes.includes(idx) ? 'bg-[#0a1526] border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)] ring-2 ring-blue-500/50 scale-[0.97]' : 'bg-[#1a1a1a] border-white/5 hover:border-white/20'}
                        `}
                     >
                        <img src={imgStr} draggable={false} className={`w-full h-full object-contain p-2 transition-all duration-500 pointer-events-none ${selectedImageIndexes.includes(idx) ? 'scale-90 opacity-80' : 'group-hover/editcard:scale-105'}`} />
                        
                        {/* Beautiful Checkbox UI */}
                        <div 
                          onClick={(e) => { e.stopPropagation(); handleToggleSelectImage(idx); }}
                          onMouseDown={(e) => e.stopPropagation()}
                          draggable={false}
                          className={`absolute top-2 left-2 md:top-4 md:left-4 w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 z-20 ${selectedImageIndexes.includes(idx) ? 'bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.6)] scale-110 border border-white/30' : 'bg-black/30 border md:border-2 border-white/20 hover:bg-black/60 hover:border-white/50 hover:scale-105 backdrop-blur-md'}`}
                          title="Chọn để di chuyển"
                        >
                          <CheckCircle2 size={16} strokeWidth={selectedImageIndexes.includes(idx) ? 2.5 : 2} className={`${selectedImageIndexes.includes(idx) ? 'text-white' : 'text-transparent'} md:w-5 md:h-5`} />
                        </div>

                        {/* Overlay with controls */}
                        <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 pointer-events-none ${selectedImageIndexes.includes(idx) ? 'opacity-100' : 'opacity-0 group-hover/editcard:opacity-100'}`}>

                          {/* Drag handle indicator */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 backdrop-blur-sm">
                            <GripVertical size={14} className="text-white/70 rotate-90" />
                            <span className="text-[9px] uppercase tracking-widest font-bold text-white/60">Kéo thả</span>
                          </div>
                        </div>

                        {/* Delete button - always interactive */}
                        <button 
                           onClick={(e) => { e.stopPropagation(); handleRemoveSingleImage(editingProject, idx); }}
                           onMouseDown={(e) => e.stopPropagation()}
                           draggable={false}
                           className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-red-500/90 text-white flex items-center justify-center hover:bg-red-600 transition-all border border-red-500/20 z-20 opacity-0 group-hover/editcard:opacity-100"
                           title="Xóa ảnh"
                        >
                          <Trash2 size={16} />
                        </button>
                        
                        {/* Position badge */}
                        <div className="absolute bottom-3 right-3 w-8 h-8 rounded-xl bg-black/60 flex items-center justify-center text-white font-bold text-[10px] border border-white/10 pointer-events-none opacity-0 group-hover/editcard:opacity-100">
                          {idx + 1}
                        </div>

                        {/* Drop target indicator line */}
                        {dropTargetIdx === idx && dragActiveIdx !== null && dragActiveIdx !== idx && (
                          <div className="absolute inset-y-2 left-0 w-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] z-30" />
                        )}
                     </div>
                  ))}

                 {(!editingProject.images || editingProject.images.length === 0) && (
                    <div className="relative group/editcard rounded-2xl overflow-hidden h-48 md:h-56 lg:h-64 border border-white/5 transition-all bg-[#1a1a1a] flex items-center justify-center">
                       <img src={editingProject.imageUrl} className="w-full h-full object-contain p-2" />
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/editcard:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                          <button 
                             onClick={(e) => { e.stopPropagation(); handleRemoveSingleImage(editingProject, 0); }}
                             className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all"
                             title="Xóa tấm ảnh này"
                          >
                            <Trash2 size={28} />
                          </button>
                          <span className="font-bold tracking-widest uppercase text-white text-[10px]">Xóa Toàn Bộ Tác Phẩm</span>
                       </div>
                    </div>
                 )}
              </div>
            </div>

            {/* Move Images Modal */}
            {showMoveModal && (
              <div 
                className="absolute inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 rounded-[2rem]"
                onClick={() => { setShowMoveModal(false); setSelectedMoveTarget(null); }}
              >
                 <div 
                   className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl flex flex-col max-h-[80%]"
                   onClick={(e) => e.stopPropagation()}
                 >
                    <div className="flex items-center gap-3 mb-2 text-blue-400">
                      <FolderHeart size={24} />
                      <h3 className="text-xl md:text-2xl font-bold text-white">Chuyển ảnh sang dự án khác</h3>
                    </div>
                    <p className="text-white/50 mb-6 text-sm">Bạn đang chọn {selectedImageIndexes.length} ảnh. Hãy chọn dự án đích rồi bấm <strong className="text-white">Xác Nhận</strong>:</p>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 mb-6 pr-2">
                       {projects.filter(p => p.id !== editingProject.id).map(p => (
                         <button 
                           key={p.id} 
                           onClick={() => setSelectedMoveTarget(p.id)}
                           className={`w-full text-left px-5 py-4 rounded-2xl border transition-all group flex items-center gap-4 ${
                             selectedMoveTarget === p.id 
                               ? 'bg-blue-500/20 border-blue-500/60 ring-2 ring-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                               : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                           }`}
                         >
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                             selectedMoveTarget === p.id 
                               ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                               : 'bg-white/5 text-white/30 border border-white/10'
                           }`}>
                             <CheckCircle2 size={18} className={selectedMoveTarget === p.id ? 'opacity-100' : 'opacity-0'} />
                             {selectedMoveTarget !== p.id && <FolderHeart size={16} />}
                           </div>
                           <div className="flex flex-col min-w-0">
                             <span className={`font-semibold text-lg truncate transition-colors ${selectedMoveTarget === p.id ? 'text-blue-400' : 'text-white group-hover:text-white'}`}>{p.title || 'Không tên'}</span>
                             <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-semibold mt-0.5">{p.category} • {p.images?.length || 0} ẢNH</span>
                           </div>
                         </button>
                       ))}
                       {projects.filter(p => p.id !== editingProject.id).length === 0 && (
                         <div className="text-center py-10 bg-white/5 rounded-2xl border border-dashed border-white/10">
                           <p className="text-white/40 text-sm">Không có dự án nào khác để chuyển đến.</p>
                         </div>
                       )}
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                      <button 
                        onClick={() => { setShowMoveModal(false); setSelectedMoveTarget(null); }} 
                        className="px-6 py-3 rounded-xl bg-white/10 text-white/80 font-semibold hover:bg-white/20 hover:text-white transition-colors text-xs uppercase tracking-widest"
                      >
                        Hủy
                      </button>
                      <button 
                        onClick={() => {
                          if (selectedMoveTarget) {
                            handleMoveSelectedImages(selectedMoveTarget);
                            setSelectedMoveTarget(null);
                          }
                        }} 
                        disabled={!selectedMoveTarget}
                        className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                          selectedMoveTarget 
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:scale-[1.02] active:scale-[0.98]' 
                            : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                        }`}
                      >
                        <CheckCircle2 size={16} />
                        Xác Nhận Chuyển
                      </button>
                    </div>
                 </div>
              </div>
            )}
         </div>
      )}
    </div>
  );
}
