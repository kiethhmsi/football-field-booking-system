import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import Login from './pages/Login';
import Fields from './pages/Fields';
import Booking from './pages/Booking';
import Matchmaking from './pages/Matchmaking';

// Tạm thời tạo Trang Chủ mẫu trống để chèn code vào sau
const Home = () => (
  <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
    <h1 style={{fontSize: '36px'}}>Chào mừng đến với hệ thống Sân bóng <span style={{color: 'var(--primary-color)'}}>KAKAKA</span></h1>
    <p style={{marginTop: '20px', color: 'var(--text-muted)'}}>Nền tảng đặt sân và kết nối đam mê bóng đá số 1 Việt Nam.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        {/* HEADER */}
        <header style={{ backgroundColor: 'var(--bg-white)', padding: '15px 0', borderBottom: '1px solid var(--border-color)' }}>
            <div className="container d-flex justify-between align-center">
                <h2 style={{ color: 'var(--text-main)', fontSize: '24px', margin: 0 }}>Sân bóng đá <span style={{ color: 'var(--primary-color)' }}>KAKAKA</span></h2>
                <nav className="d-flex gap-2">
                    <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>Trang chủ</Link>
                    <Link to="/fields" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>Tìm sân</Link>
                    <Link to="/matches" style={{ textDecoration: 'none', color: 'var(--primary-color)', fontWeight: 700 }}>Cáp kèo (Hot) 🔥</Link>
                    <Link to="/news" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>Tin tức</Link>
                </nav>
                <div className="d-flex gap-1">
                    <Link to="/login" className="btn btn-outline" style={{padding: '8px 16px', fontSize: '14px', textDecoration: 'none'}}>Đăng nhập</Link>
                    <Link to="/fields" className="btn btn-primary" style={{padding: '8px 16px', fontSize: '14px', textDecoration: 'none'}}>Đặt sân ngay</Link>
                </div>
            </div>
        </header>

        {/* MAIN CONTENT (THAY ĐỔI THEO URL ROUTER) */}
        <main style={{ minHeight: '75vh' }}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<div className="container" style={{padding:'60px'}}><h2 style={{textAlign:'center'}}>Tính năng Đăng Ký đang được phát triển...</h2></div>} />
                <Route path="/fields" element={<Fields />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/matches" element={<Matchmaking />} />
            </Routes>
        </main>

        {/* FOOTER */}
        <footer style={{ backgroundColor: '#eef3f7', padding: '40px 0', marginTop: '40px' }}>
            <div className="container d-flex justify-between">
                <div>
                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>Arena Reserve</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '300px' }}>Nền tảng đặt sân dễ dàng, tìm đồng đội nhanh chóng.</p>
                </div>
                <div className="d-flex gap-2" style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    <p>© 2026 Arena Reserve. All rights reserved.</p>
                </div>
            </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
