import React, { useState } from 'react';

const Booking = () => {
  const [step, setStep] = useState(1); // 1: Chọn ngày/giờ, 2: Xác nhận & Đặt cọc
  const [selectedTime, setSelectedTime] = useState(null);

  // Dữ liệu giả lập các khung giờ
  const timeSlots = [
    { time: '17:00 - 18:30', price: '400.000đ', available: true },
    { time: '18:30 - 20:00', price: '500.000đ', available: false },
    { time: '20:00 - 21:30', price: '500.000đ', available: true },
    { time: '21:30 - 23:00', price: '300.000đ', available: true },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh', padding: '40px 0' }}>
      <div className="container" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '28px' }}>Đặt sân: <span style={{ color: 'var(--primary-color)' }}>Sân Cỏ Nhân Tạo KAKAKA</span></h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>📍 Địa chỉ: Gò Vấp, TP.HCM</p>
      </div>

      <div className="container" style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* CỘT TRÁI - NHẬP THÔNG TIN */}
        <div style={{ flexGrow: 1, backgroundColor: 'var(--bg-white)', padding: '30px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          {step === 1 ? (
            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '2px solid var(--primary-color)', display: 'inline-block', paddingBottom: '5px' }}>
                1. Chọn thời gian thi đấu
              </h3>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '10px' }}>Ngày thi đấu</label>
                <input 
                  type="date" 
                  defaultValue="2026-05-20"
                  style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none' }} 
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '10px' }}>Khung giờ trống</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                  {timeSlots.map((slot, idx) => (
                    <button 
                      key={idx}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      style={{ 
                        padding: '15px', textAlign: 'center', borderRadius: 'var(--radius-md)',
                        border: selectedTime === slot.time ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                        backgroundColor: !slot.available ? '#f5f5f5' : (selectedTime === slot.time ? '#e2f0e8' : 'white'),
                        cursor: slot.available ? 'pointer' : 'not-allowed',
                        opacity: slot.available ? 1 : 0.6
                      }}
                    >
                      <strong style={{ display: 'block', fontSize: '16px', color: selectedTime === slot.time ? 'var(--primary-color)' : 'var(--text-main)' }}>{slot.time}</strong>
                      <span style={{ fontSize: '13px', color: slot.available ? '#ff6b00' : 'var(--text-muted)' }}>
                        {slot.available ? slot.price : 'Đã có người đặt'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '10px' }}>Ghi chú gửi chủ sân (Tùy chọn)</label>
                <textarea 
                  rows="3" 
                  placeholder="Ví dụ: Cần xin mượn 2 quả bóng chuẩn..."
                  style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none', resize: 'vertical' }} 
                />
              </div>

              <div style={{ textAlign: 'right' }}>
                <button 
                  className="btn btn-primary" 
                  disabled={!selectedTime}
                  onClick={() => setStep(2)}
                  style={{ padding: '12px 30px', fontSize: '16px', opacity: selectedTime ? 1 : 0.5 }}
                >
                  Xác nhận & Thanh toán cọc ➔
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <button onClick={() => setStep(1)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '20px' }}>⬅</button>
                <h3 style={{ fontSize: '18px', borderBottom: '2px solid var(--primary-color)', display: 'inline-block', paddingBottom: '5px', margin: 0 }}>
                  2. Chuyển khoản Đặt cọc
                </h3>
              </div>

              <div style={{ backgroundColor: '#fff9e6', padding: '15px', borderRadius: 'var(--radius-sm)', border: '1px dashed #ffc107', marginBottom: '20px', fontSize: '14px' }}>
                <strong>⚠️ Lưu ý quan trọng:</strong> Hệ thống yêu cầu thanh toán cọc 30% để giữ sân cho bạn. Mọi đơn hủy sau 4 tiếng trước giờ đá sẽ không được hoàn cọc.
              </div>

              <div style={{ textAlign: 'center', padding: '30px 0', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: '#fafafa' }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR Code Bank" style={{ width: '200px', height: '200px', marginBottom: '15px' }} />
                <h4 style={{ marginBottom: '5px', fontSize: '18px' }}>NGÂN HÀNG MB BANK</h4>
                <p style={{ margin: '5px 0', color: 'var(--text-main)', fontSize: '15px' }}>Chủ TK: <strong>TRAN HAI KIET</strong></p>
                <p style={{ margin: '5px 0', color: 'var(--text-main)', fontSize: '15px' }}>Số TK: <strong>123456789</strong></p>
                <p style={{ margin: '5px 0', color: 'var(--text-muted)' }}>Nội dung CK: <strong style={{color: 'var(--primary-color)', fontSize: '18px'}}>SB202689110</strong></p>
              </div>

              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                 <button className="btn btn-primary" style={{ padding: '12px 30px', fontSize: '16px' }}>Đã chuyển khoản xong</button>
              </div>
            </div>
          )}
        </div>

        {/* CỘT PHẢI - THÔNG TIN TÓM TẮT (HÓA ĐƠN) BAN ĐẦU */}
        <aside style={{ backgroundColor: 'var(--bg-white)', padding: '25px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', width: '350px', flexShrink: 0 }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid var(--border-color)' }}>🧾 Tóm tắt thông tin</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Sân bóng</span>
            <strong style={{ textAlign: 'right' }}>Khoảng Sân 7<br/>Cỏ nhân tạo Kakaka</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Ngày đá</span>
            <strong>20/05/2026</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '14px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Thời gian</span>
            <strong style={{ color: 'var(--primary-color)' }}>{selectedTime || 'Vui lòng chọn'}</strong>
          </div>

          <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tạm tính tiền sân</span>
              <strong>{selectedTime ? '400.000đ' : '0đ'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px', color: 'green' }}>
              <span>Dịch vụ miễn phí</span>
              <strong>+ Bóng, Trà đá</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Số tiền ĐẶT CỌC (30%)</span>
              <strong style={{ color: '#d9534f', fontSize: '16px' }}>{selectedTime ? '120.000đ' : '0đ'}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9fb', padding: '15px', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontWeight: 600 }}>Tổng thanh toán</span>
            <strong style={{ fontSize: '20px', color: '#ff6b00' }}>{selectedTime ? '400.000đ' : '0đ'}</strong>
          </div>

          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" placeholder="Nhập mã ưu đãi.." style={{ flex: 1, padding: '10px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none' }} />
              <button className="btn" style={{ backgroundColor: '#222', color: 'white', padding: '10px 15px' }}>Áp dụng</button>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
};

export default Booking;
