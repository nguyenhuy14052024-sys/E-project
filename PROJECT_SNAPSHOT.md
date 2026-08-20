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