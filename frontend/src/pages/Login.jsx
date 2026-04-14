import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{
        backgroundColor: 'var(--bg-white)', padding: '40px', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)', width: '100%', maxWidth: '400px', textAlign: 'center'
      }}>
        {/* LOGO ICON */}
        <div style={{
          width: '50px', height: '50px', backgroundColor: 'var(--primary-color)',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', color: 'white', fontSize: '24px'
        }}>
          ⚽
        </div>
        
        <h2 style={{ marginBottom: '10px' }}>Đăng nhập</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '30px' }}>
          Đăng nhập để đặt sân nhanh hơn và xem lịch sử
        </p>

        <form style={{ textAlign: 'left' }} onSubmit={(e) => e.preventDefault()}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Số điện thoại</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#6c757d' }}>📱</span>
              <input 
                type="text" 
                placeholder="090 1234 567" 
                style={{
                  width: '100%', padding: '12px 12px 12px 40px', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)', backgroundColor: '#f9f9fb', outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#6c757d' }}>🔒</span>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                style={{
                  width: '100%', padding: '12px 40px 12px 40px', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)', backgroundColor: '#f9f9fb', outline: 'none'
                }}
              />
              <span 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)', color: '#6c757d', cursor: 'pointer', fontSize: '18px' }}
              >
                {showPassword ? "🙂" : "😎"}
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: '25px', fontSize: '14px' }}>
            <a href="#" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>Quên mật khẩu?</a>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '16px' }}>
            Đăng nhập ➔
          </button>
        </form>

        <p style={{ marginTop: '25px', fontSize: '14px' }}>
          Chưa có tài khoản? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
