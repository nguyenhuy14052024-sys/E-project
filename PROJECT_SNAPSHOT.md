# DỰ ÁN E-LEARNING B2-C1 - TRẠNG THÁI HIỆN TẠI
*Cập nhật lần cuối: 19/10/2026*

## 1. CÔNG NGHỆ
- Backend: Node.js + Express + PostgreSQL + Sequelize
- Frontend: React + Vite + React Router + Axios
- Auth: JWT
- Email: Resend API
- Editor: React Quill (Rich Text Editor)
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
- **Certificate: Kho chứng nhận (Đã chống cấp trùng, không có 2 chứng nhận giống nhau)**
- Tự động hóa: Cộng điểm, cấp chứng nhận, cập nhật Streak
- Thông báo chứng nhận: Popup + Confetti khi nhận chứng nhận mới
- Form soạn nội dung mới: chia trường (level, unit, tên, mô tả, độ khó, ghi chú, các phần)
- Rich Text Editor: hỗ trợ in đậm, in nghiêng, gạch chân, màu, highlight
- Giao diện bài học theo tone màu trình độ (A1-C1)
- Độ khó thể hiện qua màu nền (Dễ, Trung bình, Nâng cao)
- Ghi chú mềm mại, không "công nghiệp"
- Trang Điều khoản sử dụng (Terms)
- Trang Chính sách bảo mật (Privacy)
- Trang Quên mật khẩu (ForgotPassword)
- **Level Test: Làm bài test trình độ theo chuẩn (Reading, Writing, Phonetics)**
- **Level Test: Chia nhóm câu hỏi (PHONETICS, MULTIPLE CHOICE, READING, WRITING)**
- **Level Test: Đồng hồ đếm ngược + tự động nộp bài khi hết giờ**
- **Level Test: Bài đọc (ReadingPassage) đính kèm câu hỏi**
- **Level Test: Câu hỏi của bài đọc nhập ngay trong form tạo passage (tích hợp)**
- **Level Test: Hỗ trợ 3 loại câu hỏi chính (Trắc nghiệm A/B/C/D, True/False/Not Given, Viết-nhập nội dung)**
- **Level Test: Form động — tự đổi input theo loại câu hỏi (A/B/C/D dropdown/radio/input text)**
- **Level Test: Admin có thể tự do đặt tên Section và đổi thứ tự câu hỏi (nút lên/xuống)**
- **Level Test: Sửa câu hỏi ngay tại chỗ (Inline Editing) không bị trượt trang**
- **Level Test: Admin quản lý bài test + câu hỏi + bài đọc (hỗ trợ Link ảnh, Độ rộng ảnh, Nguồn)**
- **Level Test: Chứng nhận theo điểm (≥90% Xuất sắc, ≥80% Giỏi)**
- **Level Test: Lịch sử làm bài (LevelTestAttempt)**
- **Level Test: Hiển thị kết quả chi tiết từng câu (đúng/sai + giải thích)**
- **Level Test: Cho phép nộp bài trống (tính 0 điểm) — có popup xác nhận**
- **Level Test: Hiển thị passage phía trên câu hỏi liên kết khi làm bài**
- **Level Test: Định dạng văn bản (gạch chân âm tiết) cho câu hỏi Phát âm / Trọng âm**
- **Profile: Biểu đồ tiến độ theo trình độ (VD: Đã hoàn thành 3/12 bài)**
- Biểu tượng con mắt ẩn/hiện mật khẩu
- Thanh đo độ mạnh mật khẩu
- Ô tích Đồng ý Điều khoản
- Admin cố định (tạo qua script createAdmin.js)
- Xóa nút Đổi Role khỏi giao diện Admin
- **Sửa lỗi tràn giao diện trên mobile cho tất cả các trang**

## 3. GIAO DIỆN ĐÃ NÂNG CẤP VÀ RESPONSIVE
- Home
- Login
- Register
- ForgotPassword
- ResetPassword
- Terms
- Privacy
- Dashboard
- GrammarSection
- PracticeZone
- MiniTest
- ErrorLog
- FlashcardPage
- ReviewPage
- ProfilePage
- LevelTest
- LevelTestList
- AdminDashboard
- ManageUnits
- ManageQuestions
- ManageUsers
- ManageLevelTests
- ManageLevelTestQuestions

## 4. GIAO DIỆN CHƯA NÂNG CẤP
- (Tất cả đã nâng cấp và responsive)

## 5. TÍNH NĂNG CHƯA LÀM (SẮP TỚI)
- **Form phỏng vấn người dùng (Onboarding Survey):** Mascot dễ thương, hỏi mục tiêu, trình độ, khó khăn để Admin khai thác dữ liệu.
- **Upload ảnh từ máy tính:** Hiện tại mới chỉ hỗ trợ dán link ảnh (URL).
- Đăng nhập Google (Passport)
- Hoàn thiện xác thực email khi đăng ký
- Nút báo cáo lỗi
- Premium / Thanh toán
- Deploy lên VPS
- Soạn nội dung thật A1-C1
- Loading component (icon nhảy) — tạm skip
- Từ điển: nghĩa Anh-Việt, phiên âm, audio
- Xử lý Token hết hạn (Axios Interceptor bắt lỗi 401 -> tự động đăng xuất)
- Tăng thời hạn JWT (7d lên 30d) để giảm việc user phải đăng nhập lại

## 6. CẤU TRÚC CHÍNH
- backend/config/ (db, redis, email, passport)
- backend/scripts/ (createAdmin.js)
- backend/src/controllers/ (auth, unit, quiz, flashcard, admin, dictionary, profile, levelTest)
- backend/src/models/ (User, Unit, Question, Progress, UserAnswer, Flashcard, Dictionary, Certificate, LevelTest, LevelTestQuestion, LevelTestAttempt, ReadingPassage)
- backend/src/routes/ (auth, unit, quiz, flashcard, admin, dictionary, profile, levelTest)
- backend/src/middlewares/ (authMiddleware, isAdmin)
- backend/src/services/ (dictionaryService)
- frontend/src/pages/ (16 trang + 6 trang Admin)
- frontend/src/services/ (api, auth, unit, flashcard, admin, dictionary, profile, levelTest)
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
- GET /api/profile (Đã trả về thêm `totalUnitsInLevel`, `completedUnitsInLevel`)
- GET /api/profile/certificates
- POST /api/profile/certificates
- GET /api/level-tests (admin)
- POST /api/level-tests (admin)
- GET /api/level-tests/:id (admin)
- PUT /api/level-tests/:id (admin)
- DELETE /api/level-tests/:id (admin)
- GET /api/level-tests/:testId/questions (admin)
- POST /api/level-tests/questions (admin)
- PUT /api/level-tests/questions/:id (admin)
- DELETE /api/level-tests/questions/:id (admin)
- POST /api/level-tests/passages (admin) — nhận `questions` array, tự tạo câu hỏi kèm
- PUT /api/level-tests/passages/:id (admin) — xóa câu hỏi cũ + tạo lại nếu có `questions`
- DELETE /api/level-tests/passages/:id (admin)
- GET /api/level-tests/take/:id (user)
- POST /api/level-tests/submit (user) — cho phép nộp trống, tính 0 điểm
- GET /api/level-tests/my-attempts (user)
- GET /api/level-tests/attempts/:id (user)

## 8. CÁCH CHẠY
- Backend: cd backend && node app.js
- Frontend: cd frontend && npm run dev
- Tạo admin: cd backend && node scripts/createAdmin.js

## 9. GHI CHÚ KỸ THUẬT — LEVEL TEST & PROFILE

### 9.1. Ba loại câu hỏi chính
| Loại | question_group | Input | Đáp án |
|------|----------------|-------|--------|
| Trắc nghiệm | reading_comprehension, cloze_test, sentence_completion, synonym_antonym, communication, error_identification, pronunciation, word_stress | 4 ô A/B/C/D (Hỗ trợ gạch chân) | Dropdown A/B/C/D |
| True/False | true_false | Radio 3 lựa chọn cố định | Dropdown True/False/Not Given |
| Viết/nhập | sentence_transformation, sentence_combination | Input text (có Tiền tố/Hậu tố) | Input text |

### 9.2. Tạo passage kèm câu hỏi
- Form Admin: Section "Câu hỏi cho bài đọc này" (hỗ trợ Link ảnh, Độ rộng, Nguồn).
- Backend: `createPassage` nhận `questions[]` → tạo passage → loop tạo `LevelTestQuestion` với `passage_id` → cập nhật `total_questions`.
- Câu hỏi render trong `LevelTest.jsx` theo nhóm, passage hiển thị 1 lần duy nhất phía trên câu hỏi đầu tiên thuộc passage đó.

### 9.3. Section và Thứ tự (Admin)
- Admin có thể tự do nhập tên Section (VD: SECTION A: PHONETICS).
- Admin có thể dùng nút ↑ ↓ để đổi thứ tự câu hỏi trực tiếp trên giao diện (tự động lưu vào DB).
- Nút "Sửa" mở form ngay tại chỗ, không bị trượt trang.

### 9.4. Nộp bài trống
- Backend `submitTest`: bỏ check `answers.length === 0`, dùng `safeAnswers = Array.isArray(answers) ? answers : []`
- Frontend `handleSubmit`: thêm `window.confirm` cảnh báo nếu `answerList.length === 0`
- Kết quả: user được phép nộp trống, tính 0 điểm.

### 9.5. Chống trùng chứng nhận
- Hàm `issueCertificate` trong `profileController.js`: Kiểm tra `user_id`, `type`, `title` trước khi tạo mới. Nếu đã tồn tại, trả về `null`.

### 9.6. Biểu đồ tiến độ
- Backend: Tính toán `totalUnitsInLevel` và `completedUnitsInLevel` dựa vào `book_level` của user.
- Frontend: Hiển thị thanh Progress Bar trong `ProfilePage.jsx`.

## 5. TÍNH NĂNG CHƯA LÀM (Dự kiến làm sau Demo NCKHKT)
- **Hộp thư Góp ý (Feedback Box):** Nút Floating góc phải màn hình. Lưu vào DB. Admin xem trong Admin Panel. (Dùng để thu thập dữ liệu người dùng).
- **Chế độ Thư giãn (Micro-game):** Game "Rắn ăn táo" (HTML5 Canvas) hiển thị 30s ở trang Kết quả bài học. Ứng dụng Gamification và nguyên lý nghỉ ngơi của não bộ.