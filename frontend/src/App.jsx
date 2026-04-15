import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './index.css';

import Login from './pages/Login';
import Fields from './pages/Fields';
import Booking from './pages/Booking';
import Matchmaking from './pages/Matchmaking';
import AdminDashboard from './pages/AdminDashboard';

import Home from './pages/Home';

// Tách riêng cục AppContent để có thể dùng được Hook useLocation() điều khiển ẩn hiện Layout
const AppContent = () => {
    const location = useLocation();
    
    // Nếu link bắt đầu bằng /admin thì Giao diện chỉ hiện Sidebar Admin thôi (Giống Shopee Kênh Người Bán)
    const isAdminMode = location.pathname.startsWith('/admin');

    return (
        <div className="app-wrapper" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* HEADER THEO CHUẨN DESIGN CỦA KHÁCH HÀNG */}
        {!isAdminMode && (
            <header style={{ backgroundColor: 'var(--bg-white)', padding: '15px 0', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100 }}>
                <div className="container d-flex justify-between align-center">
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h2 style={{ color: 'var(--text-main)', fontSize: '20px', margin: 0, fontWeight: 800 }}>Sân bóng đá <span style={{ color: 'var(--primary-color)' }}>KAKAKA</span></h2>
                    </Link>
                    
                    <nav style={{ display: 'flex', gap: '24px', fontSize: '15px' }}>
                        <Link to="/" style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 600 }}>Trang chủ</Link>
                        <Link to="/fields" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontWeight: 500 }}>Tìm sân</Link>
                        <Link to="/matches" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontWeight: 500 }}>Tìm kèo</Link>
                        <Link to="/news" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontWeight: 500 }}>Tin tức</Link>
                    </nav>
                    
                    <div className="d-flex gap-1 align-center">
                        <Link to="/login" style={{ fontSize: '14px', textDecoration: 'none', color: '#0f172a', fontWeight: 600, padding: '8px 12px' }}>➜ Đăng nhập</Link>
                        <Link to="/register" style={{ fontSize: '14px', textDecoration: 'none', color: '#0f172a', fontWeight: 600, padding: '8px 12px' }}>Đăng ký</Link>
                        <Link to="/fields" className="btn btn-primary" style={{padding: '10px 20px', fontSize: '14px', fontWeight: 600, borderRadius: '20px', textDecoration: 'none', marginLeft: '10px'}}>Đặt sân ngay</Link>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '15px', paddingLeft: '15px', borderLeft: '1px solid #e2e8f0' }}>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>User</p>
                              <p style={{ margin: 0, fontSize: '10px', color: '#64748b' }}>Người dùng</p>
                            </div>
                            <div style={{ width: '35px', height: '35px', backgroundColor: '#fb923c', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 0 1px #e2e8f0' }}></div>
                        </div>
                    </div>
                </div>
            </header>
        )}

        {/* MAIN CONTENT VÙNG GIỮA CHỊU TRÁCH NHIỆM CHỨA COMPONENT KHÁC NHAU */}
        <main style={{ minHeight: isAdminMode ? '100vh' : 'auto' }}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<div className="container" style={{padding:'60px'}}><h2 style={{textAlign:'center'}}>Tính năng Đăng Ký đang chờ...</h2></div>} />
                <Route path="/fields" element={<Fields />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/matches" element={<Matchmaking />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
            </Routes>
        </main>

        {/* FOOTER KHỔNG LỒ MÀU ĐEN THEO THIẾT KẾ MỚI */}
        {!isAdminMode && (
            <footer style={{ backgroundColor: '#111827', padding: '60px 0 40px 0', color: 'white' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', gap: '40px', borderBottom: '1px solid #374151', paddingBottom: '40px', marginBottom: '30px' }}>
                    
                    {/* Cột 1 */}
                    <div style={{ flex: 2 }}>
                        <h2 style={{ color: 'var(--primary-color)', margin: '0 0 15px 0', fontSize: '20px', fontWeight: 800 }}>Sân bóng đá KAKAKA</h2>
                        <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.6', maxWidth: '300px' }}>
                            Nền tảng đặt sân thể thao trực tuyến hàng đầu Việt Nam. Nhanh chóng, dễ dàng và cực tiện lợi!
                        </p>
                    </div>

                    {/* Cột 2 */}
                    <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: 'white' }}>Khám phá</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                            <li><Link to="/fields" style={{ color: '#9ca3af', textDecoration: 'none' }}>Tìm sân</Link></li>
                            <li><Link to="/booking" style={{ color: '#9ca3af', textDecoration: 'none' }}>Đặt sân bóng đá</Link></li>
                        </ul>
                    </div>

                    {/* Cột 3 */}
                    <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: 'white' }}>Hỗ trợ</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                            <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Hướng dẫn đặt sân</a></li>
                            <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Câu hỏi thường gặp</a></li>
                            <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Liên hệ</a></li>
                            <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Chính sách bảo mật</a></li>
                            <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Điều khoản sử dụng</a></li>
                        </ul>
                    </div>

                    {/* Cột 4 */}
                    <div style={{ flex: 1.5 }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: 'white' }}>Đăng ký nhận ưu đãi</h4>
                        <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '15px' }}>Nhận ngay voucher giảm 20% cho lần đặt sân đầu tiên</p>
                        <div style={{ display: 'flex' }}>
                            <input type="email" placeholder="Email của bạn" style={{ flex: 1, padding: '12px 15px', border: 'none', backgroundColor: '#1f2937', color: 'white', borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px', outline: 'none', fontSize: '14px' }} />
                            <button style={{ backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', padding: '0 20px', borderTopRightRadius: '6px', borderBottomRightRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Gửi ➔</button>
                        </div>
                        <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '20px', marginBottom: '5px' }}>HOTLINE HỖ TRỢ 24/7</p>
                        <h4 style={{ color: 'var(--primary-color)', margin: 0, fontSize: '20px', fontWeight: 800 }}>0123456789</h4>
                    </div>

                </div>
                
                <div className="container" style={{ textAlign: 'left', color: '#9ca3af', fontSize: '13px' }}>
                    © 2026 KAKAKA. All rights reserved.
                </div>
            </footer>
        )}
      </div>
    );
};

function App() {
  return (
    <Router>
        <AppContent />
    </Router>
  );
}

export default App;
