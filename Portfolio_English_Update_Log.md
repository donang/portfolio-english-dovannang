# Nhật Ký Phát Triển & Bản Địa Hóa (Localization) - Portfolio English

**Dự án:** Portfolio Đỗ Văn Năng (Phiên bản Tiếng Anh - Độc lập)
**Thư mục:** `Portfolio-English`
**Ngày thực hiện:** 09/05/2026 (Theo giờ hệ thống)

Dưới đây là chi tiết toàn bộ các hạng mục công việc đã thực hiện để chuyển đổi từ bản Tiếng Việt sang bản Tiếng Anh chuyên ngành Graphic Design.

---

## 1. Dịch thuật & Tối ưu Giao diện tĩnh (Static UI)
Toàn bộ các component cốt lõi trong hệ thống đã được dịch thuật và tinh chỉnh lại bằng Tiếng Anh chuyên ngành (Graphic Design):

- **`Header.jsx`**: 
  - Dịch các menu điều hướng: *Home, Projects, Skills, About Me, Contact*.
  - Đổi trạng thái nút tải CV thành: *DOWNLOAD CV*, *EXPORTING PDF...*
- **`Hero.jsx`**: 
  - Lời chào: *Hello! I'm*.
  - Cập nhật tiểu sử chuyên nghiệp: *"I specialize in crafting posters, banners, social media designs, and brand identities, helping your brand stand out and leave a lasting impression."*
  - Các nút CTA: *VIEW PROJECTS*, *CONTACT ME*.
- **`Stats.jsx`**: 
  - Cập nhật các danh mục thống kê: *Years Experience, Completed Projects, Happy Clients, 5-Star Reviews*.
- **`Projects.jsx`**: 
  - Dịch danh mục lọc: *All, Poster, Banner, Social Media, Branding, Thumbnail, Others*.
  - Tiêu đề khu vực: *FEATURED PROJECTS*.
  - Giao diện Lightbox/Gallery: Cập nhật chữ *Loading projects...*, nút *VIEW ALL PROJECTS*, và *MAIN GALLERY*.
- **`SkillsAboutContact.jsx`**: 
  - Dịch các tiêu đề nhóm: *MY SKILLS, WORK EXPERIENCE, CONTACT ME*.
  - Đổi logic ngày tháng: Thay thế chữ "Hiện tại" thành *Present*.
  - Cập nhật trích dẫn triết lý thiết kế (Bio): *"Design is not just making things look beautiful; it's the process of turning complex ideas into incredible visual experiences."*
  - Dịch các nhãn thông tin liên hệ: *Email, Phone, Address, Behance* và nút *CHAT WITH ME VIA ZALO*.
- **`FAQ.jsx`**: 
  - Dịch mặc định 4 câu hỏi thường gặp (Q&A) về quy trình làm việc, thiết kế, báo giá (Lump Sum), và hỗ trợ Feedback (Revisions) theo chuẩn quốc tế.
  - Dịch đoạn văn mô tả cột bên trái.
- **`Footer.jsx`**: 
  - Dịch dòng bản quyền: *Designed and developed with ❤️ by Đỗ Văn Năng*.
- **`AllProjectsView.jsx`**:
  - Dịch tiêu đề: *All Projects*.
  - Dịch mô tả phụ: *Explore the entire archive of my creative design projects. Every great idea starts with a simple touch.*
- **`index.html`**:
  - Đổi thẻ `<title>` trang web thành: *Portfolio Do Van Nang*.

---

## 2. Phân Tách Database Firebase Độc Lập (Quan Trọng Nhất)
Do lúc đầu thư mục `Portfolio-English` vẫn dùng chung nguồn Database với bản tiếng Việt (khiến cho tên dự án và kinh nghiệm làm việc hiển thị tiếng Việt), hệ thống cơ sở dữ liệu đã được **tách biệt hoàn toàn**.

- **Quản lý Dự án (Projects):**
  - Thay đổi đường dẫn Database từ `collection(db, 'projects')` thành `collection(db, 'projects_en')`.
  - Áp dụng trên cả giao diện người dùng (`Projects.jsx`) và Trang Quản trị (`AdminView.jsx`).
- **Quản lý Hồ sơ & Kinh nghiệm (Profile):**
  - Thay đổi đường dẫn Database từ `doc(db, 'profile', 'main')` thành `doc(db, 'profile', 'english')`.
  - Áp dụng trên `SkillsAboutContact.jsx`, `FAQ.jsx`, và trang `AdminView.jsx`.

**Kết quả của việc phân tách:**
- Trang web Tiếng Anh giờ đây hoàn toàn độc lập về mặt dữ liệu.
- Người dùng có thể đăng nhập vào trang Admin riêng (`http://localhost:5173/#/admin` tại thư mục Portfolio-English) để quản lý, đăng tải và chỉnh sửa nội dung Tiếng Anh mà không làm thay đổi hay ghi đè lên dữ liệu của trang Portfolio Tiếng Việt.

---
*Tài liệu này được tạo tự động để lưu trữ tiến trình cập nhật hệ thống.*
