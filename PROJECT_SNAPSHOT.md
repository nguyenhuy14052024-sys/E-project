# DỰ ÁN E-LEARNING B2-C1 - TRẠNG THÁI HIỆN TẠI
*Cập nhật lần cuối: 09/10/2026*

## 1. CÔNG NGHỆ
- Backend: Node.js + Express + PostgreSQL + Sequelize
- Frontend: React + Vite + React Router + Axios
- Auth: JWT
- Email: Resend API
- Cache: Redis (tạm tắt)

## 2. TÍNH NĂNG ĐÃ HOÀN THÀNH
- Auth: Đăng ký, đăng nhập, JWT
- Quên mật khẩu + Reset password qua email (Resend)
- Xác thực email (API đã có)
- Unit: Xem danh sách, chi tiết theo trình độ (A1-C1)
- Quiz: 6 loại câu hỏi, random, hoán vị, lọc theo loại
- Mini Test: Random từ nhiều Unit
- Error Log: Xem và ôn lại câu sai
- Flashcard: CRUD + Spaced Repetition (SM-2)
- Review: Trang ôn tập flashcard đến hạn + Ôn lại tất cả
- Admin Panel: CRUD Unit, Question, User
- Dictionary: Tra từ (Hybrid fallback 3 API) - trong Grammar + Practice
- Profile: Hồ sơ cá nhân, Rank, Streak, Điểm số
- Certificate: Kho chứng nhận
- Tự động hóa: Cộng điểm, cấp chứng nhận, cập nhật Streak
- Thông báo chứng nhận: Popup + Confetti khi nhận chứng nhận mới

## 3. GIAO DIỆN ĐÃ NÂNG CẤP
- Dashboard
- Profile
- Flashcard
- Review
- Home
- Login
- CertificateBadge
- PracticeZone

## 4. GIAO DIỆN CHƯA NÂNG CẤP
- Register
- GrammarSection
- MiniTest
- ErrorLog
- ResetPassword
- Admin (4 trang)

## 5. TÍNH NĂNG CHƯA LÀM
- Đăng nhập Google (Passport)
- Hoàn thiện xác thực email khi đăng ký
- Bài test sau mỗi trình độ (Level Test)
- Chứng nhận bài test (80% Giỏi, 90% Xuất sắc, dưới 60% Cố gắng hơn)
- Nút báo cáo lỗi
- Premium / Thanh toán
- Deploy lên VPS
- Soạn nội dung thật A1-C1
- UI/UX hoàn thiện cho các trang còn lại

## 6. CẤU TRÚC CHÍNH
- backend/config/ (db, redis, email, passport)
- backend/src/controllers/ (auth, unit, quiz, flashcard, admin, dictionary, profile)
- backend/src/models/ (User, Unit, Question, Progress, UserAnswer, Flashcard, Dictionary, Certificate)
- backend/src/routes/ (auth, unit, quiz, flashcard, admin, dictionary, profile)
- backend/src/middlewares/ (authMiddleware, isAdmin)
- backend/src/services/ (dictionaryService)
- frontend/src/pages/ (10 trang + 4 trang Admin + Profile + ResetPassword)
- frontend/src/services/ (api, auth, unit, flashcard, admin, dictionary, profile)
- frontend/src/components/ (DictionaryPopup, CertificateBadge, CertificateNotification)
- data_migration/raw_data/demo.json

## 7. API HIỆN CÓ
- POST /api/auth/register, /login
- GET /api/auth/profile
- POST /api/auth/forgot-password
- POST /api/auth/reset-password/:token
- GET /api/auth/verify-email/:token
- GET /api/units?level=B2, /api/units/:id
- GET /api/quizzes/:unitId?type=
- POST /api/quizzes/submit, /api/quizzes/generate
- GET /api/quizzes/errors
- POST /api/flashcards
- GET /api/flashcards, /api/flashcards/:id, /api/flashcards/due, /api/flashcards/all
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

## 8. CÁCH CHẠY
- Backend: cd backend && node app.js
- Frontend: cd frontend && npm run dev
- Đăng nhập: test@gmail.com / 123456 (admin)

## 9. VIỆC CẦN LÀM TIẾP
- [ ] Nâng cấp giao diện các trang còn lại
- [ ] Đăng nhập Google
- [ ] Bài test sau mỗi trình độ
- [ ] Chứng nhận bài test
- [ ] Soạn nội dung thật A1-C1
- [ ] Premium / Thanh toán
- [ ] Deploy