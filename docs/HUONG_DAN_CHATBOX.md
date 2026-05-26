# 🤖 HƯỚNG DẪN VẬN HÀNH & SỬ DỤNG KASPORT AI CHATBOX

Chào mừng bạn đến với tài liệu hướng dẫn vận hành hệ thống trợ lý ảo **KASPORT AI**. Đây là hệ thống chatbox thông minh thế hệ mới, tích hợp sâu giữa cơ sở dữ liệu (MySQL) của sân bóng và trí tuệ nhân tạo Google Gemini 3.1 mới nhất.

---

## ⚙️ I. CƠ CHẾ VẬN HÀNH (Backend & Logic)

Chatbox hoạt động theo một quy trình khép kín tự động từ giao diện người dùng đến database và máy chủ AI của Google theo các bước sau:

1. **Khách hàng gửi câu hỏi:** Người dùng nhập tin nhắn vào ô chat.
2. **Frontend thu thập ngữ cảnh:** File `AIChatBot.jsx` gom tin nhắn mới kèm tối đa 6 tin nhắn lịch sử trò chuyện gần nhất và gửi POST request lên `/api/ai/chat`.
3. **Backend truy vấn MySQL:** File `aiController.js` chạy câu lệnh SQL để truy xuất tên sân bóng đang hoạt động (`fields`), các loại sân (`pitches`) và giá thuê tối thiểu thực tế (`time_slots`).
4. **Bảo vệ chống sập (Null-Safe):** Nếu sân bóng nào chưa được thiết lập giá (trả về `null`), Backend tự động chuyển đổi thành chữ `"chưa cập nhật"` để tránh gây crash máy chủ.
5. **Thiết lập System Instruction:** Backend cấu hình chỉ dẫn hệ thống bắt buộc cho Gemini (đóng vai trợ lý KASPORT, xưng em, gọi Anh/Chị, ưu tiên trả lời theo dữ liệu sân bóng cung cấp).
6. **Làm sạch lịch sử cuộc gọi:** Tự động lọc và sắp xếp lịch sử chat để đảm bảo tuân thủ cấu trúc của Google API (đan xen tuần tự `user -> model -> user -> model...` và luôn bắt đầu bằng `user`).
7. **Gọi API bằng Cơ chế Fallback:** Ưu tiên gọi model **Gemini 3.1 Flash-Lite** có định mức miễn phí lớn và tốc độ nhanh nhất. Nếu có sự cố quota hoặc kết nối, tự động chuyển hướng gọi các model dự phòng là **Gemini 2.5 Flash** hoặc **Gemini 2.0 Flash**.
8. **Định dạng hiển thị ở Frontend:** Frontend nhận phản hồi, tự động chuyển đổi định dạng in đậm `**chữ in đậm**` và chuyển các dòng bắt đầu bằng ký tự `-` hoặc `*` thành các thẻ bullet points `<li>` dạng tròn tuyệt đẹp.

---

## 💬 II. HƯỚNG DẪN SỬ DỤNG CHATBOT (Dành cho Khách hàng & Admin)

### 1. Sử dụng tính năng "Câu hỏi gợi ý nhanh" (FAQ Quick Replies)
Khi khách hàng vừa mở Chatbox lên lần đầu, AI sẽ hiển thị **4 nút gợi ý nhanh** ở dưới cùng:
*   **Đặt sân như thế nào?** (AI sẽ hướng dẫn từng bước click đặt sân trực tuyến).
*   **Bảng giá đặt sân bóng?** (AI sẽ đọc thẳng giá tiền thực tế của các sân từ database ra).
*   **Chính sách hủy đặt sân?** (Hướng dẫn về thời gian hủy sân hợp lệ).
*   **Hotline hỗ trợ trực tiếp?** (Cung cấp số tổng đài hỗ trợ 1900 6789).

👉 Khách hàng chỉ cần click vào một nút bất kỳ, AI sẽ trả lời ngay lập tức.

### 2. Chat tự do theo ngữ cảnh (Context-Aware Chatting)
Do AI đã có bộ nhớ lưu trữ lịch sử chat, khách hàng có thể trò chuyện liên tục giống như đang nói chuyện với nhân viên thật:
*   **Câu 1:** *"Sân KASPORT có những loại sân nào hả em?"*
    *   *AI trả lời:* *"Sân KASPORT hiện có Sân cỏ nhân tạo 5 người và Sân cỏ nhân tạo 7 người..."*
*   **Câu 2:** *"Giá của loại thứ hai là bao nhiêu?"*
    *   *AI trả lời:* *(Hiểu ngay "loại thứ hai" là Sân 7 người) -> "Dạ, Sân 7 người có giá từ 350.000đ/giờ ạ..."*

### 3. Tương tác trực tiếp trên giao diện
Dưới chân Chatbox luôn có nút liên kết nhanh:
*   **Nút "Đặt sân ngay" (màu xanh lá):** Khách hàng click vào đây sẽ được chuyển ngay đến giao diện tìm kiếm và chọn sân trống một cách nhanh chóng.
*   **Nút Thu nhỏ/Mở rộng:** Nằm ở thanh tiêu đề giúp khách hàng thu nhỏ Chatbox xuống góc màn hình khi cần xem thông tin giải đấu hoặc tin tức khác mà không làm mất lịch sử trò chuyện.

---

> 💡 **MẸO DÀNH CHO ADMIN:**
> Khi bạn thêm mới một sân bóng trong trang quản trị Admin hoặc điều chỉnh giá vé của một khung giờ, bộ não của **KASPORT AI** sẽ **tự động cập nhật thông tin mới ngay lập tức** mà bạn không cần phải cấu hình lại hay viết lại mã nguồn cho Chatbot!
