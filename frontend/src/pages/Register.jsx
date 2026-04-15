import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-white)', padding: '50px 40px', borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', width: '100%', maxWidth: '450px', textAlign: 'center'
      }}>
        {/* LOGO ICON */}
        <div style={{
          width: '50px', height: '50px', backgroundColor: 'var(--primary-color)',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', color: 'white', fontSize: '24px'
        }}>
          ⚽
        </div>
        
        <h2 style={{ marginBottom: '10px' }}>Đăng ký tài khoản</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '30px' }}>
          Đăng ký ngay để trải nghiệm quy trình đặt sân chuyên nghiệp
        </p>

        <form style={{ textAlign: 'left' }} onSubmit={(e) => e.preventDefault()}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#334155' }}>Họ và tên</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#6c757d' }}>👤</span>
              <input 
                type="text" 
                placeholder="Nhập họ và tên" 
                style={{
                  width: '100%', padding: '12px 12px 12px 40px', border: '1px solid var(--border-color)',
                  borderRadius: '12px', backgroundColor: '#f9f9fb', outline: 'none', fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#334155' }}>Số điện thoại</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#6c757d' }}>📱</span>
              <input 
                type="text" 
                placeholder="090x xxx xxx" 
                style={{
                  width: '100%', padding: '12px 12px 12px 40px', border: '1px solid var(--border-color)',
                  borderRadius: '12px', backgroundColor: '#f9f9fb', outline: 'none', fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#334155' }}>Email (tùy chọn)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#6c757d' }}>✉️</span>
              <input 
                type="email" 
                placeholder="example@email.com" 
                style={{
                  width: '100%', padding: '12px 12px 12px 40px', border: '1px solid var(--border-color)',
                  borderRadius: '12px', backgroundColor: '#f9f9fb', outline: 'none', fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#334155' }}>Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#6c757d' }}>🔒</span>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                style={{
                  width: '100%', padding: '12px 44px 12px 40px', border: '1px solid var(--border-color)',
                  borderRadius: '12px', backgroundColor: '#f9f9fb', outline: 'none', fontSize: '14px'
                }}
              />
              <span 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)', color: '#6c757d', cursor: 'pointer', fontSize: '16px' }}
              >
                {showPassword ? "👁️" : "🤫"}
              </span>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '16px', borderRadius: '12px', fontWeight: 700 }}>
            Đăng ký ngay ➔
          </button>
        </form>

        <p style={{ marginTop: '25px', fontSize: '14px' }}>
          Đã có tài khoản? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>Đăng nhập</Link>
        </p>

        <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' }}>
            Bằng cách đăng ký, bạn đồng ý với <a href="#" style={{ color: '#64748b', textDecoration: 'underline' }}>điều khoản</a> và <a href="#" style={{ color: '#64748b', textDecoration: 'underline' }}>chính sách bảo mật</a> của chúng tôi
        </p>
      </div>
    </div>
  );
};

export default Register;
