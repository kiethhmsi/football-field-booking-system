import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const hoverStyles = `
    .category-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      position: relative;
      overflow: hidden;
      display: block;
      border-radius: 16px;
      height: 250px;
      text-decoration: none;
      background-color: #000;
    }
    .category-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.15);
    }
    .category-card .card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
      opacity: 0.8;
    }
    .category-card:hover .card-img {
      transform: scale(1.1);
      opacity: 0.6;
    }
    .category-card .card-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50%;
      padding: 30px 20px;
      background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%);
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
    }
    .category-card .view-more {
      opacity: 0;
      transform: translateY(15px);
      transition: all 0.3s ease;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-color);
      margin-top: 5px;
    }
    .category-card:hover .view-more {
      opacity: 1;
      transform: translateY(0);
    }
  `;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <style>{hoverStyles}</style>
      {/* 1. HERO SECTION */}
      <section style={{ 
        position: 'relative', 
        backgroundImage: 'linear-gradient(rgba(0,40,20,0.3), rgba(0,20,10,0.4)), url("/hero-banner.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '120px 0 160px',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '20px', lineHeight: '1.2' }}>
            Đặt sân thể thao<br/>nhanh - dễ - tiện
          </h1>
          <p style={{ fontSize: '16px', color: '#e2e8f0', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px', lineHeight: '1.5' }}>
            Tìm và đặt sân bóng đá ngay trong vài giây. Xem giá thực, lịch trống theo thời gian thực.
          </p>
          <Link to="/fields" className="btn" style={{ 
            backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.5)', color: 'white', 
            padding: '12px 30px', borderRadius: '30px', fontSize: '15px', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s'
          }}>
            <span style={{ fontSize: '16px' }}>🔍</span> Tìm sân ngay
          </Link>
        </div>

        {/* SEARCH BAR WIDGET (Overlapping bottom) */}
        <div style={{
          position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'white', padding: '12px 15px', borderRadius: '50px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)', display: 'flex', gap: '15px', alignItems: 'center',
          width: '90%', maxWidth: '800px', color: '#333', zIndex: 10
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '15px', padding: '5px 20px', borderRight: '1px solid #e2e8f0' }}>
            <span style={{color: 'var(--primary-color)', fontSize: '20px'}}>🏟️</span>
            <div style={{ textAlign: 'left', width: '100%' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>LOẠI SÂN</div>
              <select style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', fontWeight: 600, padding: '5px 0 0 0', cursor: 'pointer', backgroundColor: 'transparent', color: '#0f172a' }}>
                <option>Tất cả loại sân</option>
                <option>Sân 5 người</option>
                <option>Sân 7 người</option>
                <option>Sân 11 người</option>
              </select>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '15px', padding: '5px 20px' }}>
            <span style={{color: 'var(--primary-color)', fontSize: '20px'}}>📅</span>
            <div style={{ textAlign: 'left', width: '100%' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>NGÀY ĐÁ & GIỜ</div>
              <input type="text" placeholder="Hôm nay, 17:30" style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', fontWeight: 600, padding: '5px 0 0 0', color: '#0f172a' }} />
            </div>
          </div>
          <Link to="/fields" className="btn btn-primary" style={{ padding: '16px 40px', borderRadius: '40px', fontWeight: 700, fontSize: '15px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span style={{fontSize:'16px'}}>🔍</span> Tìm ngay
          </Link>
        </div>
      </section>

      {/* 2. DANH MỤC LOẠI SÂN */}
      <section style={{ padding: '100px 0 60px', backgroundColor: '#fafbfc' }}>
        <div className="container">
          <p style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary-color)', margin: '0 0 5px 0', letterSpacing: '1px' }}>DANH MỤC</p>
          <h2 style={{ fontSize: '28px', marginBottom: '30px', fontWeight: 800, color: '#0f172a' }}>Loại sân</h2>
          
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
            {[
              { type: 'Sân 5', label: 'Sân 5 người', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop' },
              { type: 'Sân 7', label: 'Sân 7 người', img: 'https://images.unsplash.com/photo-1620122303020-87ec826cf70d?q=80&w=600&auto=format&fit=crop' },
              { type: 'Sân 11', label: 'Sân 11 người', img: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=600&auto=format&fit=crop' }
            ].map((item, idx) => (
              <Link to="/fields" state={{ filterType: item.type }} key={idx} style={{ flex: 1, minWidth: '220px' }} className="category-card">
                <img src={item.img} alt={item.label} className="card-img" />
                <div className="card-overlay">
                  <span style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.5px' }}>{item.label}</span>
                  <span className="view-more">Xem ngay ➔</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. QUY TRÌNH BA BƯỚC MÀU ĐEN */}
      <section style={{ backgroundColor: '#111827', padding: '80px 0', color: 'white', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary-color)', margin: '0 0 10px 0', letterSpacing: '1px' }}>QUY TRÌNH</p>
          <h2 style={{ fontSize: '32px', marginBottom: '15px', fontWeight: 800 }}>Đặt sân trong 3 bước đơn giản</h2>
          <p style={{ color: '#9ca3af', marginBottom: '50px', fontSize: '15px' }}>Nhanh chóng, dễ dàng, không cần lằng nhằng phức tạp</p>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            {/* Đường gạch ngang nối 3 bước (Đóng vai trò nét gạch nền) */}
            <div style={{ position: 'absolute', top: '35px', left: '15%', right: '15%', height: '1px', backgroundColor: '#374151', zIndex: 0 }}></div>
            
            <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, backgroundColor: '#111827', padding: '0 20px' }}>
              <div style={{ width: '70px', height: '70px', border: '2px solid var(--primary-color)', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: 'var(--primary-color)', backgroundColor: '#111827' }}>1</div>
              <p style={{ fontWeight: 600, fontSize: '16px' }}>Tìm sân</p>
            </div>
            <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, backgroundColor: '#111827', padding: '0 20px' }}>
              <div style={{ width: '70px', height: '70px', border: '2px solid var(--primary-color)', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: 'var(--primary-color)', backgroundColor: '#111827' }}>2</div>
              <p style={{ fontWeight: 600, fontSize: '16px' }}>Chọn ngày & tự do</p>
            </div>
            <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, backgroundColor: '#111827', padding: '0 20px' }}>
              <div style={{ width: '70px', height: '70px', border: '2px solid var(--primary-color)', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: 'var(--primary-color)', backgroundColor: '#111827' }}>3</div>
              <p style={{ fontWeight: 600, fontSize: '16px' }}>Xác nhận & đá ngay</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KHUYẾN MÃI & NHẬN XÉT */}
      <section style={{ padding: '80px 0', backgroundColor: '#fafbfc' }}>
        <div className="container" style={{ display: 'flex', gap: '30px' }}>
          
          <div style={{ flex: 2, backgroundColor: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Khuyến mãi lần đầu<br/>đặt sân</h2>
            <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '15px', maxWidth: '350px' }}>Áp dụng mã giảm giá 20% cho lần đặt sân đầu tiên hoặc thành viên mới.</p>
            <div>
               <Link to="/register" className="btn btn-primary" style={{ padding: '12px 30px', borderRadius: '30px', fontWeight: 600, textDecoration: 'none' }}>Nhận mã ngay</Link>
            </div>
          </div>
          
          <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', backgroundColor: '#f0fdf4', padding: '10px 20px', borderRadius: '30px', width: 'max-content' }}>
              <div style={{ width: '20px', height: '20px', border: '2px solid #16a34a', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>✓</div>
              <h3 style={{ fontSize: '14px', margin: 0, color: '#15803d', fontWeight: 700 }}>Đánh giá của khách hàng</h3>
            </div>
            
            <p style={{ fontSize: '15px', color: '#475569', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '20px' }}>
              "Nền tảng đặt sân xịn xò nhất mình từng dùng! Chọn giờ phát một, cọc minh bạch, ra sân quét mã là vào đá. 10 điểm uy tín."
            </p>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '50%' }}></div>
                <div>
                   <h4 style={{ margin: 0, fontSize: '14px', color: '#0f172a' }}>Nguyễn Văn Phủi</h4>
                   <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Chủ tịch FC Bát Xát</p>
                </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. GIGI PHÁP CÔNG NGHỆ BANNER XANH LÁ CÂY ĐẬM */}
      <section style={{ padding: '0 0 80px 0', backgroundColor: '#fafbfc' }}>
        <div className="container">
          <div style={{ backgroundColor: 'var(--primary-color)', borderRadius: '16px', padding: '50px 60px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 20px 40px rgba(13, 131, 65, 0.2)' }}>
            
            <div>
              <span style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '6px 18px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, display: 'inline-block', marginBottom: '20px', letterSpacing: '0.5px' }}>
                GIẢI PHÁP CÔNG NGHỆ
              </span>
              <h2 style={{ fontSize: '36px', margin: '0 0 30px 0', fontWeight: 800 }}>Sân Bóng Đá Chuyên Nghiệp</h2>
              <button style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: 'white', padding: '12px 25px', borderRadius: '30px', display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600, transition: 'background 0.3s' }}
                 onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)' }}
                 onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                📞 <span style={{fontSize: '16px'}}>0123 456 789</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ border: '2px solid rgba(255,255,255,0.5)', borderRadius: '50%', width:'24px', height:'24px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight: 'bold' }}>✓</span>
                <span style={{ fontSize: '15px', fontWeight: 500 }}>Quản lý đặt sân 24/7 - Không trùng lịch</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ border: '2px solid rgba(255,255,255,0.5)', borderRadius: '50%', width:'24px', height:'24px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight: 'bold' }}>✓</span>
                <span style={{ fontSize: '15px', fontWeight: 500 }}>Báo cáo doanh thu chi tiết trực quan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ border: '2px solid rgba(255,255,255,0.5)', borderRadius: '50%', width:'24px', height:'24px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight: 'bold' }}>✓</span>
                <span style={{ fontSize: '15px', fontWeight: 500 }}>Thông báo email cập nhật cho người dùng</span>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
