import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronRight, Newspaper, BookOpen, Star } from 'lucide-react';

const News = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState("Tất cả");

    const categories = ["Tất cả", "Kinh nghiệm", "Tin tức hệ thống", "Sự kiện"];
    
    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3000/api/news');
                const result = await response.json();
                
                if (result.data) {
                    // Chuyển đổi dữ liệu từ API sang format của component
                    const formattedArticles = result.data.map(item => ({
                        id: item.id,
                        category: item.category || "Tin tức",
                        title: item.title,
                        excerpt: item.excerpt,
                        image: item.cover_image || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800",
                        date: new Date(item.published_at).toLocaleDateString('vi-VN'),
                        url: `/news/${item.slug}` // Đường dẫn tới trang chi tiết
                    }));
                    setArticles(formattedArticles);
                }
                setLoading(false);
            } catch (err) {
                console.error("Lỗi fetch tin tức:", err);
                setError("Không thể tải tin tức từ máy chủ. Vui lòng thử lại sau.");
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const filteredArticles = activeCategory === "Tất cả" 
        ? articles 
        : articles.filter(a => a.category === activeCategory);

    return (
        <div className="bg-white min-h-screen text-left">
            {/* Hero Header */}
            <section className="relative py-14 md:py-16 px-6 md:px-12 bg-[#001a0f] overflow-hidden text-left border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    <img 
                      src="/hero-fans.png" 
                      className="w-full h-full object-cover opacity-15"
                      alt="News bg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#001a0f] via-transparent to-[#001a0f]" />
                </div>
                
                <div className="max-w-6xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2.5 px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6 shadow-2xl"
                    >
                        <motion.img 
                            src="/kasport-logo.png" 
                            alt="KaSport Logo" 
                            className="w-5.5 h-5.5 object-contain shrink-0 rounded-md"
                            animate={{ scale: [1, 1.12, 1] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Tin tức & Kinh nghiệm bóng đá</span>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase mb-0 leading-none">
                            TIN TỨC & <br/>
                            <span className="text-emerald-600">KINH NGHIỆM</span>
                        </h1>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 md:px-12 -mt-10 mb-20 relative z-20">
                {/* CATEGORY FILTER */}
                <div className="bg-white p-2 rounded-2xl shadow-xl shadow-emerald-900/10 flex flex-wrap gap-2 border border-gray-100 mb-12">
                    {categories.map((cat) => (
                        <button 
                            key={cat} 
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all border-none cursor-pointer ${
                                activeCategory === cat 
                                ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-100' 
                                : 'bg-transparent text-gray-500 hover:text-emerald-700 hover:bg-emerald-50'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* LOADING / ERROR STATES */}
                {loading && (
                    <div className="py-32 flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Đang tải bản tin mới...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100 p-8">
                        <p className="text-red-600 font-bold mb-4">{error}</p>
                        <button onClick={() => window.location.reload()} className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition-colors border-none cursor-pointer">Thử lại</button>
                    </div>
                )}

                {/* ARTICLES GRID */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredArticles.map((article, idx) => (
                                <motion.div 
                                    key={article.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all group flex flex-col h-full"
                                >
                                    <div className="relative h-56 overflow-hidden">
                                        <img 
                                            src={article.image} 
                                            alt={article.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-md text-emerald-800 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm border border-emerald-50">
                                                {article.category}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-8 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                                            <Calendar size={12} className="text-emerald-500" />
                                            {article.date}
                                        </div>
                                        
                                        <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-emerald-700 transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3">
                                            {article.excerpt}
                                        </p>
                                        
                                        <div className="mt-auto pt-6 border-t border-gray-50">
                                            <button 
                                                onClick={() => article.url !== "#" ? window.open(article.url, '_blank') : null}
                                                className="text-emerald-700 font-bold text-xs flex items-center gap-2 hover:gap-4 transition-all bg-transparent border-none cursor-pointer"
                                            >
                                                XEM CHI TIẾT <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {!loading && filteredArticles.length === 0 && (
                    <div className="py-32 text-center">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Không tìm thấy bài viết nào phù hợp.</p>
                    </div>
                )}
            </div>

            {/* Newsletter Subscription */}
            <section className="bg-slate-50 py-20 px-6 md:px-12 border-t border-gray-100">
                <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-10 md:gap-20">
                    <div className="flex-1 space-y-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                            <Newspaper size={24} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 leading-tight">Đăng ký nhận bản tin tâm điểm</h2>
                        <p className="text-gray-500 font-medium">Chúng tôi sẽ gửi những tin tức và kỹ thuật chơi bóng hay nhất vào sáng Thứ 2 hàng tuần.</p>
                    </div>
                    
                    <div className="w-full md:w-80 space-y-3">
                        <input 
                            type="email" 
                            placeholder="Email của bạn" 
                            className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-600 transition-all font-sans" 
                        />
                        <button className="w-full bg-emerald-700 text-white py-4 rounded-2xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-100 border-none cursor-pointer">
                            ĐĂNG KÝ NGAY
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default News;
