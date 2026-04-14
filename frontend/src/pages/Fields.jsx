import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Fields = () => {
  // Dữ liệu Sân bóng mẫu (Mock data dựa vào database chúng ta đã thiết kế)
  const [fields] = useState([
    { id: 1, name: "Thăng Long Arena", type: "Sân 7", address: "Quận Cầu Giấy, Hà Nội", price: "400.000đ", image: "https://via.placeholder.com/400x200/0d8341/ffffff?text=San+Bong+A" },
    { id: 2, name: "Sân Bóng Chùa Láng", type: "Sân 5", address: "Đống Đa, Hà Nội", price: "250.000đ", image: "https://via.placeholder.com/400x200/0a6632/ffffff?text=San+Bong+B" },
    { id: 3, name: "Sân Cỏ Nhân Tạo KAKAKA", type: "Sân 7", address: "Gò Vấp, TP.HCM", price: "350.000đ", image: "https://via.placeholder.com/400x200/12b85a/ffffff?text=San+Bong+C" },
    { id: 4, name: "Sân Vận Động Bách Khoa", type: "Sân 11", address: "Hai Bà Trưng, Hà Nội", price: "1.200.000đ", image: "https://via.placeholder.com/400x200/0d8341/ffffff?text=San+Bong+D" },
  ]);

  return (
    <div style={{ backgroundColor: 'var(--bg-light)', padding: '40px 0' }}>
      
      {/* SECTION GIỚI THIỆU */}
      <div className="container" style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>Khám phá Sân bóng <span style={{ color: 'var(--primary-color)' }}>cực VIP</span></h2>
        <p style={{ color: 'var(--text-muted)' }}>Tìm kiếm và lên lịch đặt các sân bóng chất lượng cao quanh khu vực của bạn.</p>
      </div>

      <div className="container" style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* CỘT BỘ LỌC TÌM KIẾM BÊN TRÁI */}
        <aside style={{ backgroundColor: 'var(--bg-white)', padding: '20px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', width: '280px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
            <span style={{ fontSize: '18px' }}>⚙️</span>
            <h3 style={{ fontSize: '16px', margin: 0 }}>Bộ lọc tìm kiếm</h3>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#555' }}>Trình độ đề xuất</h4>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', cursor: 'pointer', fontSize: '14px' }}>
              <input type="checkbox" style={{ accentColor: 'var(--primary-color)' }} /> Giỏi (Chuyên nghiệp)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', cursor: 'pointer', fontSize: '14px' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary-color)' }} /> Khá (Bán chuyên)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', cursor: 'pointer', fontSize: '14px' }}>
              <input type="checkbox" style={{ accentColor: 'var(--primary-color)' }} /> Trung bình (Phong trào)
            </label>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#555' }}>Khung thời gian</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button style={{ padding: '8px', border: 'none', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--primary-color)', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>Sáng</button>
              <button style={{ padding: '8px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-white)', cursor: 'pointer', fontSize: '13px' }}>Trưa</button>
              <button style={{ padding: '8px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', backgroundColor: '#e2f0e8', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '13px' }}>Chiều</button>
              <button style={{ padding: '8px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', backgroundColor: '#e2f0e8', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '13px' }}>Tối</button>
            </div>
          </div>

          <button className="btn" style={{ width: '100%', backgroundColor: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
            Xóa tất cả bộ lọc
          </button>
          
          {/* Banner phụ */}
          <div style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
             <h4 style={{marginBottom: '5px', fontSize: '16px'}}>Đăng ký thành viên VIP</h4>
             <p style={{fontSize: '12px', opacity: 0.9}}>Nhận thông báo sân giờ vàng và mã giảm giá rẻ nhất!</p>
          </div>
        </aside>

        {/* LƯỚI GRID DANH SÁCH SÂN (CỘT PHẢI) */}
        <div style={{ flexGrow: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Đang hiển thị <strong>{fields.length}</strong> sân phù hợp</p>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              SẮP XẾP: <strong style={{ color: 'var(--primary-color)', cursor: 'pointer', marginLeft: '5px' }}>Gần nhất ⌄</strong>
            </div>
          </div>

          {/* Thiết kế Layout 2 Cột */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {fields.map(field => (
              <div key={field.id} style={{ backgroundColor: 'var(--bg-white)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                {/* Ảnh cover */}
                <div style={{ height: '200px', width: '100%', position: 'relative' }}>
                  <img src={field.image} alt={field.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'var(--primary-color)', color: 'white', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>KHUYẾN MÃI</span>
                </div>
                
                {/* Body Thẻ */}
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '18px', margin: 0, fontWeight: 700 }}>{field.name}</h3>
                    <span style={{ backgroundColor: '#e2f0e8', color: 'var(--primary-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{field.type}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '25px' }}>
                    📍 {field.address}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border-color)', paddingTop: '15px' }}>
                    <div>
                      <p style={{ fontSize: '16px', fontWeight: 900, color: '#f36f21', margin: 0 }}>{field.price}<span style={{fontSize:'12px', color:'var(--text-muted)', fontWeight:'normal'}}>/giờ</span></p>
                    </div>
                    {/* Nút bấm nhảy link sang Trang Đặt Sân Từng bước */}
                    <Link to="/booking" className="btn btn-primary" style={{ padding: '10px 24px', textDecoration: 'none', borderRadius: '20px' }}>
                      Đặt ngay
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Phân trang (Pagination) chuẩn UX */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
            <button style={{ width:'35px', height:'35px', border:'1px solid var(--border-color)', backgroundColor:'var(--bg-white)', borderRadius:'var(--radius-sm)', cursor:'pointer' }}>&lt;</button>
            <button style={{ width:'35px', height:'35px', border:'none', backgroundColor:'var(--primary-color)', color:'white', borderRadius:'var(--radius-sm)', fontWeight:'bold', cursor:'pointer' }}>1</button>
            <button style={{ width:'35px', height:'35px', border:'1px solid var(--border-color)', backgroundColor:'var(--bg-white)', borderRadius:'var(--radius-sm)', cursor:'pointer' }}>2</button>
            <button style={{ width:'35px', height:'35px', border:'1px solid var(--border-color)', backgroundColor:'var(--bg-white)', borderRadius:'var(--radius-sm)', cursor:'pointer' }}>3</button>
            <button style={{ width:'35px', height:'35px', border:'1px solid var(--border-color)', backgroundColor:'var(--bg-white)', borderRadius:'var(--radius-sm)', cursor:'pointer' }}>&gt;</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Fields;
