import React from 'react';
import { Link } from 'react-router-dom';

const News = () => {
    const categories = ["Tất cả", "Kinh nghiệm", "Tin tức hệ thống", "Sự kiện"];
    
    const articles = [
        {
            id: 1,
            category: "Sự kiện",
            title: "FC Sao đăng quan ngôi vô địch Cúp VietFootball 2026",
            excerpt: "Đánh bại DTS trong trận chung kết đầy kịch tính, FC Sao chính thức giành tấm vé thăng hạng lên chơi tại HPL-S13 năm tới.",
            image: "https://giaminhmedia.vn/wp-content/uploads/2026/04/vpl-s6.jpg",
            date: "14/04/2026"
        },
        {
            id: 2,
            category: "Kinh nghiệm",
            title: "Chiến thuật 2-3-1: Chìa khóa vận hành sân 7 người hiệu quả nhất",
            excerpt: "Sơ đồ 2-3-1 giúp kiểm soát khu trung tuyến và tạo sự linh hoạt trong cả phòng ngự lẫn tấn công. Phù hợp cho đa số các đội bóng phủi hiện nay.",
            image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800",
            date: "13/04/2026"
        },
        {
            id: 3,
            category: "Sự kiện",
            title: "MNC FC lần đầu tiên lên ngôi vô địch Cúp MNC 2026",
            excerpt: "Với chiến thắng thuyết phục 4-1 trước đội Doanh nhân Sài Gòn FC, MNC FC đã ghi tên mình vào bảng vàng danh giá của giải đấu.",
            image: "https://images.unsplash.com/photo-1529900948632-586bc48fe710?q=80&w=800",
            date: "12/04/2026"
        },
        {
            id: 4,
            category: "Kinh nghiệm",
            title: "Tư duy tiền đạo cắm sân 7: Kỹ năng làm tường và dứt điểm",
            excerpt: "Không chỉ là ghi bàn, tiền đạo sân 7 cần biết cách tì đè, nhả bóng tuyến hai và thu hút hậu vệ đối phương tạo khoảng trống cho đồng đội.",
            image: "https://images.unsplash.com/photo-1543326168-984e72355529?q=80&w=800",
            date: "10/04/2026"
        },
        {
            id: 5,
            category: "Tin tức hệ thống",
            title: "Siêu Cúp 2026: Thiên Khôi đại chiến XSKT Đắk Lắk",
            excerpt: "Trận đấu tâm điểm của năm giữa hai thế lực bóng đá phủi đại diện cho miền Bắc và miền Tây đang thu hút sự chú ý cực lớn của người hâm mộ.",
            image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800",
            date: "08/04/2026"
        },
        {
            id: 6,
            category: "Sự kiện",
            title: "Cúp ASINA 2026: Giải đấu quy tụ 512 đội bóng phong trào",
            excerpt: "Quy mô chưa từng có trong lịch sử bóng đá phong trào Việt Nam, ASINA Cup hứa hẹn sẽ là ngày hội bóng đá lớn nhất từ trước đến nay.",
            image: "https://images.unsplash.com/photo-1510051644265-b3b6cba093d3?q=80&w=800",
            date: "05/04/2026"
        }
    ];

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '60px 0' }}>
            <div className="container">
                {/* HEADER SECTION */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 style={{ fontSize: '40px', fontWeight: 800, color: '#0f172a', marginBottom: '15px' }}>Tin tức & Kinh nghiệm</h1>
                    <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
                        Cập nhật những tin tức mới nhất về hệ thống sân cỏ và các bí kíp chơi bóng đỉnh cao từ KaSport.
                    </p>
                </div>

                {/* CATEGORY FILTER */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '50px', flexWrap: 'wrap' }}>
                    {categories.map((cat, idx) => (
                        <button key={idx} style={{ 
                            padding: '10px 25px', borderRadius: '30px', border: idx === 0 ? 'none' : '1px solid #e2e8f0', 
                            backgroundColor: idx === 0 ? 'var(--primary-color)' : 'white',
                            color: idx === 0 ? 'white' : '#64748b', fontWeight: 600, cursor: 'pointer',
                            boxShadow: idx === 0 ? '0 4px 12px rgba(13, 131, 65, 0.3)' : 'none',
                            transition: '0.3s'
                        }}>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* ARTICLES GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
                    {articles.map((article) => (
                        <div key={article.id} style={{ 
                            backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden', 
                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9',
                            transition: 'transform 0.3s ease', cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ width: '100%', height: '220px', overflow: 'hidden' }}>
                                <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ padding: '25px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <span style={{ backgroundColor: '#f0fdf4', color: 'var(--primary-color)', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800 }}>
                                        {article.category.toUpperCase()}
                                    </span>
                                    <span style={{ color: '#94a3b8', fontSize: '12px' }}>{article.date}</span>
                                </div>
                                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '12px', lineHeight: '1.4' }}>{article.title}</h3>
                                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {article.excerpt}
                                </p>
                                <Link to={`/news/${article.id}`} style={{ color: 'var(--primary-color)', fontWeight: 700, textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    Xem thêm ➔
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* PAGINATION (PLACEHOLDER) */}
                <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button style={{ width: '40px', height: '40px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 700 }}>1</button>
                    <button style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#64748b', fontWeight: 700 }}>2</button>
                    <button style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#64748b', fontWeight: 700 }}>3</button>
                    <button style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#64748b', fontWeight: 700 }}>➔</button>
                </div>
            </div>
        </div>
    );
};

export default News;
