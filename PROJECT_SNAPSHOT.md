# DỰ ÁN E-LEARNING B2-C1 - TRẠNG THÁI HIỆN TẠI

## 1. CÔNG NGHỆ SỬ DỤNG
- Backend: Node.js + Express + PostgreSQL
- Frontend: React + Vite
- Auth: JWT
- ORM: Sequelize
- Cache: Redis (tạm thời tắt)

## 2. TÍNH NĂNG ĐÃ HOÀN THÀNH
- [x] Đăng ký / Đăng nhập (JWT)
- [x] Xem danh sách Unit (theo level B2/C1)
- [x] Lọc câu hỏi theo loại (multiple_choice, gap_filling...)
- [x] Random & hoán vị câu hỏi
- [x] Làm bài quiz, chấm điểm tự động
- [x] Mini Test (random từ nhiều Unit)
- [x] Kho lỗi sai (Error Log)
- [x] Flashcard (CRUD)
- [x] Spaced Repetition (SM-2 algorithm)

## 3. TÍNH NĂNG CHƯA LÀM
- [ ] Admin Panel (quản lý Unit, câu hỏi trên web)
- [ ] Premium / Thanh toán (VNPay/MoMo)
- [ ] Deploy lên VPS
- [ ] Soạn nội dung thật (A1-C1)

## 4. CẤU TRÚC THƯ MỤC CHÍNH
- backend/src/controllers/ (auth, unit, quiz, flashcard)
- backend/src/models/ (User, Unit, Question, Progress, UserAnswer, Flashcard)
- backend/src/routes/ (auth, unit, quiz, flashcard)
- frontend/src/pages/ (Home, Login, Register, Dashboard, Grammar, Practice, MiniTest, ErrorLog, Flashcard, Review)
- frontend/src/services/ (api, auth, unit, flashcard)
- data_migration/raw_data/demo.json

## 5. API HIỆN CÓ
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile
- GET /api/units?level=B2
- GET /api/units/:id
- GET /api/quizzes/:unitId?type=multiple_choice
- POST /api/quizzes/submit
- POST /api/quizzes/generate (Mini Test)
- GET /api/quizzes/errors (Error Log)
- POST /api/flashcards
- GET /api/flashcards
- GET /api/flashcards/:id
- PUT /api/flashcards/:id
- DELETE /api/flashcards/:id
- GET /api/flashcards/due
- POST /api/flashcards/:id/review

## 6. BIẾN MÔI TRƯỜNG (.env)
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=english_db
DB_USER=postgres
DB_PASSWORD=123456
JWT_SECRET=english_b2_c1_secret_key_2026_secure
REDIS_URL=redis://localhost:6379

## 7. VIỆC CẦN LÀM TIẾP THEO
- [ ] Soạn nội dung (lý thuyết, câu hỏi) cho 24 Unit B2-C1
- [ ] Import dữ liệu vào database
- [ ] Chỉnh sửa giao diện (UI/UX)
- [ ] Deploy lên VPS

## 8. CÁCH CHẠY DỰ ÁN
- Backend: cd backend && node app.js
- Frontend: cd frontend && npm run dev
- Đăng nhập test: test@gmail.com / 123456

## cap nhat 15-9-26

# DỰ ÁN E-LEARNING B2-C1 - TRẠNG THÁI HIỆN TẠI
*Cập nhật lần cuối: 15/09/2026*

## 1. CÔNG NGHỆ
- Backend: Node.js + Express + PostgreSQL + Sequelize
- Frontend: React + Vite + React Router + Axios
- Auth: JWT
- Cache: Redis (tạm tắt)

## 2. TÍNH NĂNG ĐÃ HOÀN THÀNH
- Auth: Đăng ký, đăng nhập, JWT
- Unit: Xem danh sách, chi tiết theo trình độ
- Quiz: 6 loại câu hỏi, random, hoán vị, lọc theo loại
- Mini Test: Random từ nhiều Unit
- Error Log: Xem và ôn lại câu sai
- Flashcard: CRUD + Spaced Repetition (SM-2)
- Review: Trang ôn tập flashcard đến hạn
- **Admin Panel: CRUD Unit, Question, User (MỚI)**

## 3. TÍNH NĂNG CHƯA LÀM
- Premium / Thanh toán VNPay/MoMo
- Deploy lên VPS
- Soạn nội dung thật (A1-C1)
- UI/UX hoàn thiện

## 4. CẤU TRÚC CHÍNH
- backend/src/controllers/ (auth, unit, quiz, flashcard, admin)
- backend/src/models/ (User, Unit, Question, Progress, UserAnswer, Flashcard)
- backend/src/routes/ (auth, unit, quiz, flashcard, admin)
- backend/src/middlewares/ (authMiddleware, isAdmin)
- frontend/src/pages/ (10 trang + 4 trang Admin)
- frontend/src/services/ (api, auth, unit, flashcard, admin)
- data_migration/raw_data/demo.json

## 5. API HIỆN CÓ
- POST /api/auth/register, /login
- GET /api/auth/profile
- GET /api/units?level=B2, /api/units/:id
- GET /api/quizzes/:unitId?type=
- POST /api/quizzes/submit, /api/quizzes/generate
- GET /api/quizzes/errors
- POST /api/flashcards
- GET /api/flashcards, /api/flashcards/:id, /api/flashcards/due
- PUT /api/flashcards/:id
- DELETE /api/flashcards/:id
- POST /api/flashcards/:id/review
- **GET /api/admin/units, POST /api/admin/units, PUT /api/admin/units/:id, DELETE /api/admin/units/:id**
- **GET /api/admin/units/:unitId/questions, POST /api/admin/questions, PUT /api/admin/questions/:id, DELETE /api/admin/questions/:id**
- **GET /api/admin/users, PUT /api/admin/users/:id**

## 6. CÁCH CHẠY
- Backend: cd backend && node app.js
- Frontend: cd frontend && npm run dev
- Đăng nhập: test@gmail.com / 123456 (đã là admin)

## 7. VIỆC CẦN LÀM TIẾP
- [ ] Soạn nội dung thật cho B2-C1 qua Admin Panel
- [ ] UI/UX + Deploy
- [ ] Premium / Thanh toán