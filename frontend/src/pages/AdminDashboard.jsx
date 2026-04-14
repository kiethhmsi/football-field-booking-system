import React from 'react';

const AdminDashboard = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'Inter, sans-serif' }}>
      
      {/* SIDEBAR BÊN TRÁI MÀU GHI ĐEN ĐẬM (Theo chuẩn UI thiết kế quản trị) */}
      <aside style={{ width: '260px', backgroundColor: '#1e293b', color: 'white', padding: '20px 0', flexShrink: 0, position: 'relative' }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #334155', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#10b981' }}>⚽ KAKAKA Admin</h2>
          <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Trung tâm Trạm quản lý Sân</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <a href="#" style={{ padding: '12px 20px', color: 'white', textDecoration: 'none', backgroundColor: '#10b981', borderLeft: '4px solid #059669', fontWeight: 600 }}>
            📊 Phân tích Doanh thu
          </a>
          <a href="#" style={{ padding: '12px 20px', color: '#cbd5e1', textDecoration: 'none', transition: 'background 0.2s' }}>
            🏟 Quản lý Sân bóng
          </a>
          <a href="#" style={{ padding: '12px 20px', color: '#cbd5e1', textDecoration: 'none', transition: 'background 0.2s' }}>
            📅 Lịch & Mã Đặt chỗ (Cọc)
          </a>
          <a href="#" style={{ padding: '12px 20px', color: '#cbd5e1', textDecoration: 'none', transition: 'background 0.2s' }}>
            👥 Khách hàng User
          </a>
          <a href="#" style={{ padding: '12px 20px', color: '#cbd5e1', textDecoration: 'none', transition: 'background 0.2s' }}>
            📰 Quản lý Blog CMS
          </a>
        </nav>

        <div style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
            <a href="/" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px' }}>◁ Trở về Hệ thống Khách hàng</a>
        </div>
      </aside>

      {/* CONTENT VÙNG KẾT QUẢ BÊN PHẢI CHUYÊN GIA DỮ LIỆU */}
      <div style={{ flexGrow: 1, padding: '30px' }}>
        
        {/* Header Control Panel */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', backgroundColor: 'white', padding: '15px 25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '24px', margin: 0, color: '#334155' }}>Báo cáo Tổng Quan Tháng 5/2026</h2>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <input type="text" placeholder="🔍 Tra cứu SDT, Mã Đơn..." style={{ padding: '10px 20px', width: '300px', border: '1px solid #cbd5e1', borderRadius: '25px', outline: 'none' }} />
            <div style={{ width: '40px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               👨‍💼
            </div>
          </div>
        </header>

        {/* 4 Thẻ Phân Tích Thông Minh */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
           <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderBottom: '3px solid #3b82f6' }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '13px', fontWeight: 600 }}>TỔNG DOANH THU ĐÃ THU</p>
              <h3 style={{ margin: '10px 0 0', fontSize: '26px', color: '#0f172a' }}>124.500.000đ</h3>
           </div>
           <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderBottom: '3px solid #10b981' }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '13px', fontWeight: 600 }}>ĐƠN ĐẶT SÂN KAKAKA</p>
              <h3 style={{ margin: '10px 0 0', fontSize: '26px', color: '#0f172a' }}>450 <span style={{fontSize:'14px', color:'#10b981'}}>↑ 12%</span></h3>
           </div>
           <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderBottom: '3px solid #f59e0b' }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '13px', fontWeight: 600 }}>CHỜ DUYỆT CHUYỂN KHOẢN</p>
              <h3 style={{ margin: '10px 0 0', fontSize: '26px', color: '#f59e0b' }}>12 Lượt</h3>
           </div>
           <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderBottom: '3px solid #ef4444' }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '13px', fontWeight: 600 }}>CỘNG LÝ / HỦY VÉ</p>
              <h3 style={{ margin: '10px 0 0', fontSize: '26px', color: '#0f172a' }}>5 Trận</h3>
           </div>
        </div>

        {/* BẢNG TẢI DỮ LIỆU (CRM TABLES) */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', color: '#334155' }}>Đơn hàng Hệ thống Backend đổ về</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#475569', fontSize: '14px', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 15px' }}>MÃ ĐƠN SQL</th>
                <th style={{ padding: '12px 15px' }}>KHÁCH HÀNG</th>
                <th style={{ padding: '12px 15px' }}>SÂN ĐẶT</th>
                <th style={{ padding: '12px 15px' }}>QUY MÔ</th>
                <th style={{ padding: '12px 15px' }}>THU TIỀN</th>
                <th style={{ padding: '12px 15px' }}>TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '14px' }}>
              <tr style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s', cursor: 'pointer' }}>
                <td style={{ padding: '15px', fontWeight: 600, color: '#3b82f6' }}>SB-2026-11234</td>
                <td style={{ padding: '15px' }}>Trần Hải Kiệt</td>
                <td style={{ padding: '15px' }}>Sân Thăng Long</td>
                <td style={{ padding: '15px' }}>Sân 7</td>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>400.000đ</td>
                <td style={{ padding: '15px' }}><span style={{ backgroundColor: '#ccfbf1', color: '#0f766e', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Đã thanh toán đủ</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s', cursor: 'pointer' }}>
                <td style={{ padding: '15px', fontWeight: 600, color: '#3b82f6' }}>SB-2026-89110</td>
                <td style={{ padding: '15px' }}>Team Lốc Xoáy</td>
                <td style={{ padding: '15px' }}>Sân Cỏ Phủi Tự Do</td>
                <td style={{ padding: '15px' }}>Sân 5</td>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>250.000đ</td>
                <td style={{ padding: '15px' }}><span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Chờ Soát Cọc</span></td>
              </tr>
              <tr style={{ transition: 'background 0.2s', cursor: 'pointer' }}>
                <td style={{ padding: '15px', fontWeight: 600, color: '#3b82f6' }}>SB-2026-00921</td>
                <td style={{ padding: '15px' }}>Nguyễn Văn A</td>
                <td style={{ padding: '15px' }}>Sân Chùa Láng</td>
                <td style={{ padding: '15px' }}>Sân 7</td>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>350.000đ</td>
                <td style={{ padding: '15px' }}><span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Hủy do cọc trễ</span></td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
