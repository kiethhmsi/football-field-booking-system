import React, { useState, useEffect } from 'react';

const News = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState("Tất cả");

    const categories = ["Tất cả", "Kinh nghiệm", "Tin tức hệ thống", "Sự kiện"];
    
    // Giả lập gọi API lấy dữ liệu thực tế
    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                // SAU NÀY: Thay thế URL này bằng API thật của bạn
                // const response = await fetch('https://api.yourdomain.com/news');
                // const data = await response.json();
                
                // Giả lập độ trễ mạng
                await new Promise(resolve => setTimeout(resolve, 800));

                const mockData = [
                    {
                        id: 1,
                        category: "Sự kiện",
                        title: "FC Sao đăng quan ngôi vô địch Cúp VietFootball 2026",
                        excerpt: "Đánh bại DTS trong trận chung kết đầy kịch tính, FC Sao chính thức giành tấm vé thăng hạng lên chơi tại HPL-S13 năm tới.",
                        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800",
                        date: "14/04/2026",
                        url: "https://vietfootball.vn/news/fc-sao-vo-dich-cup-vietfootball-2026"
                    },
                    {
                        id: 2,
                        category: "Kinh nghiệm",
                        title: "Chiến thuật 2-3-1: Chìa khóa vận hành sân 7 người hiệu quả nhất",
                        excerpt: "Sơ đồ 2-3-1 giúp kiểm soát khu trung tuyến và tạo sự linh hoạt trong cả phòng ngự lẫn tấn công. Phù hợp cho đa số các đội bóng phủi hiện nay.",
                        image: "https://images.unsplash.com/photo-1510051644265-b3b6cba093d3?q=80&w=800",
                        date: "13/04/2026",
                        url: "#"
                    },
                    {
                        id: 3,
                        category: "Sự kiện",
                        title: "MNC FC lần đầu tiên lên ngôi vô địch Cúp MNC 2026",
                        excerpt: "Với chiến thắng thuyết phục 4-1 trước đội Doanh nhân Sài Gòn FC, MNC FC đã ghi tên mình vào bảng vàng danh giá của giải đấu.",
                        image: "https://images.unsplash.com/photo-1529900948632-586bc48fe710?q=80&w=800",
                        date: "12/04/2026",
                        url: "https://bongdaplus.vn/bong-da-phui/mnc-fc-vo-dich-cup-mnc-2026"
                    },
                    {
                        id: 4,
                        category: "Kinh nghiệm",
                        title: "Tư duy tiền đạo cắm sân 7: Kỹ năng làm tường và dứt điểm",
                        excerpt: "Không chỉ là ghi bàn, tiền đạo sân 7 cần biết cách tì đè, nhả bóng tuyến hai và thu hút hậu vệ đối phương tạo khoảng trống cho đồng đội.",
                        image: "https://images.unsplash.com/photo-1543326168-984e72355529?q=80&w=800",
                        date: "10/04/2026",
                        url: "#"
                    },
                    {
                        id: 5,
                        category: "Tin tức hệ thống",
                        title: "Siêu Cúp 2026: Thiên Khôi đại chiến XSKT Đắk Lắk",
                        excerpt: "Trận đấu tâm điểm của năm giữa hai thế lực bóng đá phủi đại diện cho miền Bắc và miền Tây đang thu hút sự chú ý cực lớn của người hâm mộ.",
                        image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800",
                        date: "08/04/2026",
                        url: "#"
                    },
                    {
                        id: 6,
                        category: "Sự kiện",
                        title: "Cúp ASINA 2026: Giải đấu quy tụ 512 đội bóng phong trào",
                        excerpt: "Quy mô chưa từng có trong lịch sử bóng đá phong trào Việt Nam, ASINA Cup hứa hẹn sẽ là ngày hội bóng đá lớn nhất từ trước đến nay.",
                        image: "https://images.unsplash.com/photo-1431324155629-1a6eda1eed2d?q=80&w=800",
                        date: "05/04/2026",
                        url: "#"
                    }
                ];

                setArticles(mockData);
                setLoading(false);
            } catch (err) {
                setError("Không thể tải tin tức. Vui lòng thử lại sau.");
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const filteredArticles = activeCategory === "Tất cả" 
        ? articles 
        : articles.filter(a => a.category === activeCategory);

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '60px 0' }}>
            <div className="container">
                {/* HEADER SECTION */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 style={{ fontSize: '40px', fontWeight: 800, color: '#0f172a', marginBottom: '15px' }}>Tin tức & Kinh nghiệm</h1>
                    <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
                        Cập nhật các bài báo và kỹ thuật chơi bóng đỉnh cao từ nhiều nguồn tin uy tín.
                    </p>
                </div>

                {/* CATEGORY FILTER */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '50px', flexWrap: 'wrap' }}>
                    {categories.map((cat, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setActiveCategory(cat)}
                            style={{ 
                                padding: '10px 25px', borderRadius: '30px', 
                                border: activeCategory === cat ? 'none' : '1px solid #e2e8f0', 
                                backgroundColor: activeCategory === cat ? 'var(--primary-color)' : 'white',
                                color: activeCategory === cat ? 'white' : '#64748b', 
                                fontWeight: 700, cursor: 'pointer',
                                boxShadow: activeCategory === cat ? '0 4px 12px rgba(13, 131, 65, 0.3)' : 'none',
                                transition: '0.3s'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* LOADING / ERROR STATES */}
                {loading && (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary-color)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                        <p style={{ color: '#64748b' }}>Đang tải tin tức...</p>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                )}

                {error && (
                    <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#fef2f2', borderRadius: '24px', color: '#dc2626' }}>
                        <p style={{ fontWeight: 700 }}>{error}</p>
                        <button onClick={() => window.location.reload()} style={{ marginTop: '15px', padding: '8px 20px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Thử lại</button>
                    </div>
                )}

                {/* ARTICLES GRID */}
                {!loading && !error && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
                        {filteredArticles.map((article) => (
                            <div key={article.id} style={{ 
                                backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden', 
                                boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9',
                                transition: 'transform 0.3s ease', cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            onClick={() => article.url !== "#" ? window.open(article.url, '_blank') : null}
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
                                    <span style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        Đọc tiếp tại nguồn ➔
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredArticles.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#94a3b8', padding: '50px' }}>Không có bài viết nào trong danh mục này.</p>
                )}
            </div>
        </div>
    );
};

export default News;
