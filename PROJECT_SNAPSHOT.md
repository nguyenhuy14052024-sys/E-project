# DỰ ÁN E-LEARNING B2-C1 - TRẠNG THÁI HIỆN TẠI
*Cập nhật lần cuối: 01/10/2026*

## 1. CÔNG NGHỆ
- Backend: Node.js + Express + PostgreSQL + Sequelize
- Frontend: React + Vite + React Router + Axios
- Auth: JWT
- Cache: Redis (tạm tắt)

## 2. TÍNH NĂNG ĐÃ HOÀN THÀNH
- Auth: Đăng ký, đăng nhập, JWT
- Unit: Xem danh sách, chi tiết theo trình độ (A1-C1)
- Quiz: 6 loại câu hỏi, random, hoán vị, lọc theo loại
- Mini Test: Random từ nhiều Unit
- Error Log: Xem và ôn lại câu sai
- Flashcard: CRUD + Spaced Repetition (SM-2)
- Review: Trang ôn tập flashcard đến hạn
- Admin Panel: CRUD Unit, Question, User
- Dictionary: Tra từ (Hybrid fallback 3 API)
- **Profile: Hồ sơ cá nhân, Rank, Streak, Điểm số (MỚI)**
- **Certificate: Kho chứng nhận (MỚI)**

## 3. TÍNH NĂNG CHƯA LÀM
- Tự động cấp chứng nhận
- Tự động cộng điểm
- Tự động cập nhật Streak
- Quên mật khẩu + Xác thực email
- Đăng nhập Google
- Premium / Thanh toán
- Deploy lên VPS

## 4. CẤU TRÚC CHÍNH
- backend/src/controllers/ (auth, unit, quiz, flashcard, admin, dictionary, profile)
- backend/src/models/ (User, Unit, Question, Progress, UserAnswer, Flashcard, Dictionary, Certificate)
- backend/src/routes/ (auth, unit, quiz, flashcard, admin, dictionary, profile)
- backend/src/middlewares/ (authMiddleware, isAdmin)
- backend/src/services/ (dictionaryService)
- frontend/src/pages/ (10 trang + 4 trang Admin + Profile)
- frontend/src/services/ (api, auth, unit, flashcard, admin, dictionary, profile)
- frontend/src/components/ (DictionaryPopup, CertificateBadge)
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
- GET /api/admin/units, POST /api/admin/units, PUT /api/admin/units/:id, DELETE /api/admin/units/:id
- GET /api/admin/units/:unitId/questions, POST /api/admin/questions, PUT /api/admin/questions/:id, DELETE /api/admin/questions/:id
- GET /api/admin/users, PUT /api/admin/users/:id
- GET /api/dictionary/:word
- GET /api/profile
- GET /api/profile/certificates
- POST /api/profile/certificates

## 6. CÁCH CHẠY
- Backend: cd backend && node app.js
- Frontend: cd frontend && npm run dev
- Đăng nhập: test@gmail.com / 123456 (admin)

## 7. VIỆC CẦN LÀM TIẾP
- [ ] Tự động cấp chứng nhận
- [ ] Tự động cộng điểm
- [ ] Tự động cập nhật Streak
- [ ] Soạn nội dung thật A1-C1
- [ ] UI/UX + Deploy
- [ ] Premium / Thanh toán