# ⚽ KASPORT - HỆ THỐNG ĐẶT SÂN BÓNG ĐÁ TRỰC TUYẾN CHUYÊN NGHIỆP

> KASPORT là nền tảng quản lý và đặt sân bóng trực tuyến toàn diện, được thiết kế để kết nối người chơi bóng đá phong trào với các chủ sân bóng. Dự án sở hữu giao diện người dùng tối giản, hiện đại theo phong cách thể thao mạnh mẽ, tích hợp trí tuệ nhân tạo (Gemini AI Chatbot), đồng bộ hóa lịch đặt động theo thời gian thực và hệ thống thanh toán trực tuyến PayOS tiên tiến.

---

## 🚀 Tính Năng Nổi Bật

### 👤 Dành Cho Khách Hàng (User Interface)
*   **Tìm Sân Động:** Tìm kiếm sân bóng xung quanh bạn qua GPS/Tọa độ địa lý trên Bản đồ.
*   **Đặt Sân Theo Thời Gian Thực:** Chọn sân (Sân 5, Sân 7, Sân 11), chọn ngày và khung giờ hoạt động thực tế động được đồng bộ trực tiếp từ Admin Dashboard.
*   **Thanh Toán Trực Tuyến:** Tích hợp cổng thanh toán trực tuyến **PayOS** bảo mật bằng QR Code, cập nhật trạng thái đơn đặt tức thì.
*   **Tạo Kèo & Giao Lưu (Matchmaking):** Tạo kèo đấu tìm đối thủ, tìm đồng đội với tiến trình tuyển thành viên động, phân vị trí rõ ràng.
*   **Hỗ Trợ Thông Minh (AI Assistant):** Tích hợp Gemini AI chatbot tư vấn sân bóng, luật thi đấu, chiến thuật bóng đá thông minh.

### 🛡️ Dành Cho Quản Trị Viên (Admin Dashboard)
*   **Thống Kê Trực Quan:** Biểu đồ doanh thu thực tế/dự kiến, thống kê tỷ lệ lấp đầy sân và phân bổ doanh thu theo loại hình sân đấu dưới dạng custom biểu đồ sắc nét.
*   **Quản Lý Khung Giờ (Time Slots):** Linh hoạt thêm, sửa, bật/tắt trạng thái hoạt động (`is_active`) của các khung giờ. Thay đổi giá tự động giữa các ngày trong tuần và cuối tuần.
*   **Quản Lý Trạng Thái Đơn Đặt:** Thay đổi trạng thái đặt sân (Chờ xác nhận, Xác nhận đơn, Hủy đơn, Hoàn thành đơn) với phản hồi thời gian thực qua WebSockets (Socket.io).
*   **Hệ Thống Giải Đấu (Tournaments):** Tạo giải đấu, xếp lịch thi đấu tự động và cập nhật kết quả từng vòng.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

### Frontend (Client)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361dafb)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

### Backend & Database (Server)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361dafb)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-grey?style=for-the-badge&logo=google-gemini&logoColor=blue)

---

## 📂 Cấu Trúc Dự Án (Project Structure)

```
football-booking-website/  (Root)
│
├── config/              # Cấu hình kết nối cơ sở dữ liệu MySQL
├── controllers/         # Bộ điều hướng xử lý logic nghiệp vụ chính (Backend)
├── routes/              # Định tuyến danh sách API Endpoints
├── middlewares/         # Middleware bảo mật JWT, phân quyền tài khoản
├── database/            # Kịch bản SQL và cấu trúc dữ liệu migrations
├── utils/               # Các dịch vụ bổ trợ (Gửi mail Nodemailer, PayOS client)
├── frontend/            # Giao diện người dùng (React, Tailwind CSS, Vite)
│   ├── src/
│   │   ├── components/  # Các Component dùng chung (BookingView, AI Chatbox, Admin)
│   │   └── pages/       # Các trang chính (Home, FieldDetail, Tournaments, Admin)
│   └── public/          # Thư mục tài nguyên ảnh tĩnh (hero, vector illustration)
├── screenshots/         # Hình ảnh chụp màn hình demo chức năng
├── docs/                # Sơ đồ cơ sở dữ liệu và tài liệu kỹ thuật
├── server.js            # Entry Point chính của Express backend server
├── .gitignore           # Danh sách các tệp tin loại trừ khi đẩy lên Git
└── README.md            # Tài liệu dự án
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Cấu hình Cơ sở dữ liệu (Database)
*   Cài đặt MySQL trên máy cá nhân hoặc máy chủ.
*   Tạo một cơ sở dữ liệu mới (ví dụ: `kasport_db`).
*   Import tệp schema SQL từ thư mục `database/` vào database vừa tạo.

### 2. Cấu hình Biến môi trường (Environment Variables)
Tạo tệp `.env` tại thư mục gốc của dự án (Root) và điền đầy đủ các thông tin:

```env
PORT=3000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=kasport_db
JWT_SECRET=your_jwt_secret_key

# Cổng thanh toán PayOS
PAYOS_CLIENT_ID=your_payos_client_id
PAYOS_API_KEY=your_payos_api_key
PAYOS_CHECKSUM_KEY=your_payos_checksum_key

# Trí tuệ nhân tạo Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Gửi email tự động
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Khởi chạy Backend Server
Mở terminal tại thư mục gốc (Root):
```bash
# Cài đặt thư viện backend
npm install

# Khởi chạy server ở chế độ phát triển (Hot-reload)
npm run dev
```

### 4. Khởi chạy Frontend React (Client)
Mở một cửa sổ terminal mới và di chuyển vào thư mục `frontend`:
```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt thư viện frontend
npm install

# Khởi chạy giao diện người dùng
npm run dev
```
Giao diện sẽ chạy tại cổng mặc định `http://localhost:5173`. Giao diện admin có sẵn tại `http://localhost:5173/admin`.

---

## 🌿 Quy Trình Nhánh Git & Commit Tiêu Chuẩn

Dự án này tuân thủ quy trình Git chuyên nghiệp với hai nhánh chính:
*   `main`: Nhánh chạy ổn định nhất.
*   `develop`: Nhánh gom các tính năng mới để kiểm thử trước khi đưa lên `main`.

### Cú pháp thông điệp Commit tiêu chuẩn (Conventional Commits):
*   `feat: <nội dung>`: Khi thêm một chức năng mới (Ví dụ: `feat: tích hợp thanh toán PayOS`)
*   `fix: <nội dung>`: Khi sửa một lỗi hệ thống (Ví dụ: `fix: sửa lỗi đồng bộ khung giờ sân 5`)
*   `style: <nội dung>`: Cải tiến về mặt giao diện, CSS (Ví dụ: `style: phủ tràn viền khung ảnh cơ sở vật chất`)
*   `docs: <nội dung>`: Cập nhật tài liệu, file README (Ví dụ: `docs: bổ sung hướng dẫn chạy project`)

---

## 🌟 Đóng Góp Phát Triển
Dự án được xây dựng và duy trì bởi thành viên **KaSport Team**. Chúc các bạn có những giây phút trải nghiệm thể thao tuyệt vời nhất!
