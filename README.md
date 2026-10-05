# EnglishIngLesh

Nền tảng học tiếng Anh trực tuyến dành cho học viên tự học, tập trung vào ôn luyện ngữ pháp và từ vựng theo lộ trình từ A1 đến C1.

---

## 1. TỔNG QUAN DỰ ÁN

### 1.1. Mục tiêu

Xây dựng một nền tảng học tiếng Anh trực tuyến cho phép người dùng tự học, tự ôn luyện và theo dõi tiến độ của bản thân. Hệ thống cung cấp các công cụ học tập thông minh bao gồm làm bài tập, ôn tập flashcard, tra từ điển và theo dõi tiến độ.

### 1.2. Đối tượng sử dụng

- Học sinh, sinh viên tự ôn thi chứng chỉ B2-C1
- Người đi làm muốn cải thiện tiếng Anh
- Không nhắm đến trung tâm, chỉ tập trung vào cá nhân tự học

### 1.3. Phạm vi trình độ

- A1, A2, B1, B2, C1

### 1.4. Tính năng chính

| Nhóm tính năng | Mô tả |
|----------------|-------|
| Xác thực | Đăng ký, đăng nhập, quên mật khẩu, xác thực email |
| Học tập | Xem lý thuyết theo Unit, tra từ điển trực tiếp trong bài học |
| Luyện tập | Làm bài tập với 6 loại câu hỏi, chấm điểm tự động |
| Mini Test | Tạo bài test ngẫu nhiên từ nhiều Unit |
| Kho lỗi sai | Lưu lại câu đã làm sai, xem giải thích và ôn lại |
| Flashcard | Thêm, sửa, xóa từ vựng, ôn tập theo thuật toán spaced repetition |
| Hồ sơ cá nhân | Theo dõi điểm số, rank, streak, thống kê học tập |
| Chứng nhận | Nhận chứng nhận khi hoàn thành Unit, khóa học, streak |
| Quản trị | Admin Panel quản lý Unit, câu hỏi, người dùng |

---

## 2. KIẾN TRÚC HỆ THỐNG

### 2.1. Sơ đồ tổng quan
┌─────────────────────────────────────────────────────────────┐
│ NGƯỜI DÙNG │
│ (Trình duyệt) │
└─────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND │
│ React + Vite + Axios │
│ │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │
│ │ Pages/ │ │ Components/ │ │ Services/ │ │
│ │ Home │ │ Dictionary │ │ api.js │ │
│ │ Login │ │ Popup │ │ authService.js │ │
│ │ Register │ │ Certificate │ │ unitService.js │ │
│ │ Dashboard │ │ Badge │ │ flashcardService.js│ │
│ │ Grammar │ │ │ │ adminService.js │ │
│ │ Practice │ │ │ │ dictionaryService │ │
│ │ MiniTest │ │ │ │ profileService.js │ │
│ │ ErrorLog │ │ │ │ │ │
│ │ Flashcard │ │ │ │ │ │
│ │ Review │ │ │ │ │ │
│ │ Profile │ │ │ │ │ │
│ │ Admin │ │ │ │ │ │
│ └─────────────┘ └─────────────┘ └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
│
▼ (REST API)
┌─────────────────────────────────────────────────────────────┐
│ BACKEND │
│ Node.js + Express + JWT │
│ │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │
│ │ Controllers │ │ Models │ │ Services │ │
│ │ auth │ │ User │ │ dictionaryService │ │
│ │ unit │ │ Unit │ │ │ │
│ │ quiz │ │ Question │ │ │ │
│ │ flashcard │ │ Progress │ │ │ │
│ │ admin │ │ UserAnswer │ │ │ │
│ │ dictionary │ │ Flashcard │ │ │ │
│ │ profile │ │ Dictionary │ │ │ │
│ │ │ │ Certificate│ │ │ │
│ └─────────────┘ └─────────────┘ └─────────────────────┘ │
│ │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │
│ │ Routes │ │ Middlewares │ │ Config │ │
│ │ auth │ │ auth │ │ db.js │ │
│ │ unit │ │ isAdmin │ │ redis.js │ │
│ │ quiz │ │ │ │ email.js │ │
│ │ flashcard │ │ │ │ passport.js │ │
│ │ admin │ │ │ │ │ │
│ │ dictionary │ │ │ │ │ │
│ │ profile │ │ │ │ │ │
│ └─────────────┘ └─────────────┘ └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│ DATABASE │
│ PostgreSQL │
│ │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐ │
│ │ users │ │ units │ │questions│ │ progress │ │
│ └─────────┘ └─────────┘ └─────────┘ └─────────────┘ │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐│
│ │user_answers │ │ flashcards │ │ certificates ││
│ └─────────────┘ └─────────────┘ └─────────────────────┘│
│ ┌─────────────┐ │
│ │ dictionary │ │
│ └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
### 2.2. Luồng hoạt động
Người dùng truy cập
│
▼
Frontend (React) hiển thị giao diện
│
▼
Người dùng thao tác (đăng nhập, làm bài, xem flashcard)
│
▼
Frontend gọi API (Axios) với token JWT
│
▼
Backend (Express) xác thực token, xử lý nghiệp vụ
│
▼
Database (PostgreSQL) truy vấn dữ liệu
│
▼
Backend trả kết quả về Frontend
│
▼
Frontend hiển thị kết quả cho người dùng

---

## 3. CÔNG NGHỆ SỬ DỤNG

### 3.1. Backend

| Thành phần | Công nghệ | Mục đích |
|------------|-----------|----------|
| Runtime | Node.js | Môi trường chạy JavaScript |
| Framework | Express | Xây dựng API |
| Database | PostgreSQL | Lưu trữ dữ liệu |
| ORM | Sequelize | Tương tác với database |
| Xác thực | JWT | Tạo và xác thực token |
| Mã hóa | bcryptjs | Mã hóa mật khẩu |
| Email | Resend | Gửi email |
| Bảo mật | Helmet, CORS | Bảo vệ HTTP headers, CORS |
| Log | Morgan | Ghi log request |

### 3.2. Frontend

| Thành phần | Công nghệ | Mục đích |
|------------|-----------|----------|
| Framework | React | Xây dựng giao diện |
| Build tool | Vite | Build và dev server |
| Routing | React Router | Điều hướng |
| HTTP Client | Axios | Gọi API |
| State | React Hooks | Quản lý trạng thái |

### 3.3. Dịch vụ bên thứ ba

| Dịch vụ | Mục đích |
|---------|----------|
| Resend | Gửi email xác thực, quên mật khẩu |
| Free Dictionary API | Tra từ Anh-Anh |
| Datamuse API | Tra từ đồng nghĩa |
| Google Translate API | Tra từ Anh-Việt |

---

## 4. CẤU TRÚC THƯ MỤC
E-project/
│
├── backend/
│ ├── config/
│ │ ├── db.js
│ │ ├── redis.js
│ │ ├── email.js
│ │ └── passport.js
│ │
│ ├── src/
│ │ ├── controllers/
│ │ │ ├── authController.js
│ │ │ ├── unitController.js
│ │ │ ├── quizController.js
│ │ │ ├── flashcardController.js
│ │ │ ├── adminController.js
│ │ │ ├── dictionaryController.js
│ │ │ └── profileController.js
│ │ │
│ │ ├── models/
│ │ │ ├── User.js
│ │ │ ├── Unit.js
│ │ │ ├── Question.js
│ │ │ ├── Progress.js
│ │ │ ├── UserAnswer.js
│ │ │ ├── Flashcard.js
│ │ │ ├── Dictionary.js
│ │ │ ├── Certificate.js
│ │ │ └── index.js
│ │ │
│ │ ├── routes/
│ │ │ ├── authRoutes.js
│ │ │ ├── unitRoutes.js
│ │ │ ├── quizRoutes.js
│ │ │ ├── flashcardRoutes.js
│ │ │ ├── adminRoutes.js
│ │ │ ├── dictionaryRoutes.js
│ │ │ └── profileRoutes.js
│ │ │
│ │ ├── middlewares/
│ │ │ └── authMiddleware.js
│ │ │
│ │ └── services/
│ │ └── dictionaryService.js
│ │
│ ├── .env
│ ├── app.js
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── DictionaryPopup.jsx
│ │ │ └── CertificateBadge.jsx
│ │ │
│ │ ├── pages/
│ │ │ ├── Home.jsx
│ │ │ ├── Login.jsx
│ │ │ ├── Register.jsx
│ │ │ ├── Dashboard.jsx
│ │ │ ├── GrammarSection.jsx
│ │ │ ├── PracticeZone.jsx
│ │ │ ├── MiniTest.jsx
│ │ │ ├── ErrorLog.jsx
│ │ │ ├── FlashcardPage.jsx
│ │ │ ├── ReviewPage.jsx
│ │ │ ├── ProfilePage.jsx
│ │ │ ├── ResetPassword.jsx
│ │ │ └── Admin/
│ │ │ ├── AdminDashboard.jsx
│ │ │ ├── ManageUnits.jsx
│ │ │ ├── ManageQuestions.jsx
│ │ │ └── ManageUsers.jsx
│ │ │
│ │ ├── services/
│ │ │ ├── api.js
│ │ │ ├── authService.js
│ │ │ ├── unitService.js
│ │ │ ├── flashcardService.js
│ │ │ ├── adminService.js
│ │ │ ├── dictionaryService.js
│ │ │ └── profileService.js
│ │ │
│ │ ├── App.jsx
│ │ └── main.jsx
│ │
│ ├── index.html
│ ├── package.json
│ └── vite.config.js
│
├── data_migration/
│ ├── raw_data/
│ │ └── demo.json
│ └── importToDB.js
│
├── PROJECT_SNAPSHOT.md
└── README.md
---

## 5. CƠ SỞ DỮ LIỆU

### 5.1. Sơ đồ quan hệ
users (1) ──────< progress >────── (1) units
│ │
│ │
│ │
├──────< user_answers >────── (1) questions
│ │
│ │
├──────< flashcards >───────── (1) units
│
├──────< certificates >─────── (1) units
│
└──────< dictionary (độc lập)

### 5.2. Mô tả các bảng

| Bảng | Mô tả |
|------|-------|
| users | Lưu thông tin người dùng |
| units | Lưu thông tin bài học |
| questions | Lưu câu hỏi |
| progress | Lưu tiến độ học tập |
| user_answers | Lưu lịch sử làm bài |
| flashcards | Lưu từ vựng cá nhân |
| dictionary | Lưu từ điển (cache) |
| certificates | Lưu chứng nhận |

---

## 6. API ENDPOINTS

### 6.1. Xác thực

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/auth/register | Đăng ký |
| POST | /api/auth/login | Đăng nhập |
| GET | /api/auth/profile | Lấy thông tin cá nhân |
| POST | /api/auth/forgot-password | Yêu cầu đặt lại mật khẩu |
| POST | /api/auth/reset-password/:token | Đặt lại mật khẩu |
| GET | /api/auth/verify-email/:token | Xác thực email |

### 6.2. Bài học

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/units?level=B2 | Lấy danh sách Unit theo trình độ |
| GET | /api/units/:id | Lấy chi tiết Unit |

### 6.3. Bài tập

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/quizzes/:unitId?type= | Lấy câu hỏi của Unit |
| POST | /api/quizzes/submit | Nộp bài, chấm điểm |
| POST | /api/quizzes/generate | Tạo Mini Test |
| GET | /api/quizzes/errors | Lấy danh sách câu sai |

### 6.4. Flashcard

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/flashcards | Thêm flashcard |
| GET | /api/flashcards | Lấy danh sách flashcard |
| GET | /api/flashcards/:id | Lấy chi tiết flashcard |
| PUT | /api/flashcards/:id | Cập nhật flashcard |
| DELETE | /api/flashcards/:id | Xóa flashcard |
| GET | /api/flashcards/due | Lấy flashcard đến hạn ôn |
| POST | /api/flashcards/:id/review | Ôn tập flashcard |

### 6.5. Hồ sơ cá nhân

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/profile | Lấy thông tin hồ sơ |
| GET | /api/profile/certificates | Lấy danh sách chứng nhận |
| POST | /api/profile/certificates | Tạo chứng nhận |

### 6.6. Từ điển

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/dictionary/:word | Tra từ |

### 6.7. Quản trị

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/admin/units | Lấy danh sách Unit |
| POST | /api/admin/units | Thêm Unit |
| PUT | /api/admin/units/:id | Cập nhật Unit |
| DELETE | /api/admin/units/:id | Xóa Unit |
| GET | /api/admin/units/:unitId/questions | Lấy câu hỏi của Unit |
| POST | /api/admin/questions | Thêm câu hỏi |
| PUT | /api/admin/questions/:id | Cập nhật câu hỏi |
| DELETE | /api/admin/questions/:id | Xóa câu hỏi |
| GET | /api/admin/users | Lấy danh sách người dùng |
| PUT | /api/admin/users/:id | Cập nhật người dùng |

---

## 7. HƯỚNG DẪN CÀI ĐẶT

### 7.1. Yêu cầu hệ thống

| Thành phần | Phiên bản |
|------------|-----------|
| Node.js | 18 trở lên |
| PostgreSQL | 15 trở lên |
| Redis | 6 trở lên (tùy chọn) |
| Git | 2.0 trở lên |

### 7.2. Cài đặt Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env từ mẫu
cp .env.example .env

# Chỉnh sửa .env với thông tin của bạn
# Bao gồm: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET, RESEND_API_KEY

# Chạy migration (tạo bảng)
node syncDB.js

# Import dữ liệu mẫu
node importData.js

# Chạy server
node app.js

-----------------------------------------
Server chạy tại http://localhost:5000
-----------------------------------------
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Chạy dev server
npm run dev
------------------------------------------
Frontend chạy tại http://localhost:5173
------------------------------------------

7.4. Tài khoản test
Vai trò	Email	Mật khẩu
Admin	test@gmail.com	123456
8. BIẾN MÔI TRƯỜNG
8.1. Backend (.env)
Biến	Mô tả	Bắt buộc
PORT	Cổng chạy server	Có
DB_HOST	Host database	Có
DB_PORT	Cổng database	Có
DB_NAME	Tên database	Có
DB_USER	Tên đăng nhập database	Có
DB_PASSWORD	Mật khẩu database	Có
JWT_SECRET	Khóa bí mật cho JWT	Có
REDIS_URL	URL kết nối Redis	Không
FRONTEND_URL	URL frontend	Có
RESEND_API_KEY	API key của Resend	Có
GOOGLE_CLIENT_ID	Client ID của Google	Không
GOOGLE_CLIENT_SECRET	Client Secret của Google	Không
8.2. Frontend (.env)
Biến	Mô tả	Bắt buộc
VITE_API_URL	URL của backend	Có

*CHẠY DỰ ÁN:

# Terminal 1: Backend
cd backend
node app.js

# Terminal 2: Frontend
cd frontend
npm run dev

9.2. Import dữ liệu mới
bash
# Chỉnh sửa file data_migration/raw_data/demo.json
# Sau đó chạy:
cd backend
node importData.js
9.3. Backup database
bash
"C:\Program Files\PostgreSQL\16\bin\pg_dump" -U postgres -d english_db > backup_english_db.sql
9.4. Khôi phục database
bash
"C:\Program Files\PostgreSQL\16\bin\psql" -U postgres -d english_db < backup_english_db.sql
9.5. Tạo tài khoản Admin
sql
UPDATE users SET role = 'admin' WHERE username = 'test';
9.6. Thêm trình độ mới vào ENUM
sql
ALTER TYPE enum_units_book_level ADD VALUE IF NOT EXISTS 'A1';
ALTER TYPE enum_units_book_level ADD VALUE IF NOT EXISTS 'A2';
ALTER TYPE enum_units_book_level ADD VALUE IF NOT EXISTS 'B1';
9.7. Commit và Push lên GitHub
bash
git add .
git commit -m "Mô tả thay đổi"
git push origin main
9.8. Tạo branch backup
bash
git branch backup-ten-branch
git push origin backup-ten-branch

10. HƯỚNG PHÁT TRIỂN
10.1. Tính năng sắp triển khai
Tính năng	Mô tả	Ưu tiên
Đăng nhập Google	OAuth 2.0	Cao
Xác thực email khi đăng ký	Gửi email xác nhận	Trung bình
Nút báo cáo lỗi	User báo cáo câu hỏi sai	Trung bình
Premium / Thanh toán	Tích hợp VNPay/MoMo	Sau
UI/UX hoàn thiện	Làm đẹp giao diện	Trung bình
Deploy lên VPS	Đưa web ra internet	Cao
10.2. Thuật toán nâng cao
Thuật toán	Mô tả	Giai đoạn
SM-2	Spaced Repetition hiện tại	Đã triển khai
FSRS	Free Spaced Repetition Scheduler	Sau khi có user
HLR	Half-Life Regression	Sau khi có doanh thu
CPF	Concept-Driven Personalized Forgetting	Nghiên cứu
10.3. Mở rộng
Hạng mục	Mô tả
Thêm trình độ	A1, A2, B1 (đã hỗ trợ)
Thêm loại câu hỏi	Listening, Speaking
Luyện nghe	Audio + bài tập nghe
Luyện nói	Ghi âm + chấm phát âm
AI Chatbot	Hỏi đáp ngữ pháp, từ vựng
Chấm bài viết	AI chấm writing
11. GHI CHÚ
11.1. Lưu ý khi phát triển
Luôn commit code lên GitHub sau mỗi tính năng hoàn thành

Tạo branch backup trước khi thử nghiệm thuật toán mới

Backup database định kỳ

Không commit file .env lên GitHub

Kiểm tra log backend khi gặp lỗi

11.2. Xử lý sự cố thường gặp
Lỗi	Nguyên nhân	Cách xử lý
401 Unauthorized	Token hết hạn	Đăng nhập lại
403 Forbidden	Không có quyền	Kiểm tra role
404 Not Found	Route không tồn tại	Kiểm tra route
500 Internal Server Error	Lỗi backend	Xem log backend
Token không hợp lệ	JWT_SECRET sai	Kiểm tra .env
Email không gửi được	RESEND_API_KEY sai	Kiểm tra .env
11.3. Liên hệ
GitHub: nguyenhuy14052024-sys/E-project

Email: nguyenhuy14052024@gmail.com

12. GIẤY PHÉP
Dự án này được phát triển cho mục đích học tập và phi lợi nhuận. Mọi đóng góp đều được hoan nghênh.