import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ChevronLeft, Share2, Clock, Eye, Star } from 'lucide-react';

const NewsDetail = () => {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:3000/api/news/${slug}`);
                const result = await response.json();
                
                if (result.data) {
                    setArticle(result.data);
                } else {
                    setError("Không tìm thấy bài viết này.");
                }
                setLoading(false);
            } catch (err) {
                console.error("Lỗi fetch chi tiết tin tức:", err);
                setError("Lỗi kết nối máy chủ.");
                setLoading(false);
            }
        };
        fetchDetail();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
                <Link to="/news" className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all no-underline">
                    Quay lại danh sách tin
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-20 text-left">
            {/* Header / Breadcrumb */}
            <div className="max-w-4xl mx-auto px-6 pt-32 pb-8">
                <Link to="/news" className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-8 hover:gap-4 transition-all no-underline uppercase tracking-widest">
                    <ChevronLeft size={18} /> Quay lại tin tức
                </Link>
                
                <div className="flex items-center gap-3 mb-6">
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                        {article.category || "Tin tức"}
                    </span>
                    <span className="text-gray-300 text-xs">|</span>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                        <Calendar size={14} />
                        {new Date(article.published_at).toLocaleDateString('vi-VN')}
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-8">
                    {article.title}
                </h1>

                <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-gray-100 mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Tác giả</p>
                            <p className="text-sm font-bold text-gray-800">{article.author_name || "KASPORT Team"}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                            <Eye size={16} />
                            <span className="font-bold">{article.views_count}</span>
                        </div>
                        <button className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors bg-transparent border-none cursor-pointer">
                            <Share2 size={18} />
                            <span className="text-sm font-bold">Chia sẻ</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            <div className="max-w-5xl mx-auto px-6 mb-12">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[3rem] overflow-hidden shadow-2xl shadow-emerald-900/10"
                >
                    <img 
                        src={article.cover_image || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200"} 
                        alt={article.title}
                        className="w-full h-auto object-cover max-h-[600px]"
                    />
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-6">
                <div className="prose prose-emerald max-w-none">
                    <p className="text-xl text-gray-600 font-medium leading-relaxed italic mb-10 border-l-4 border-emerald-500 pl-6">
                        {article.excerpt}
                    </p>
                    
                    <div 
                        className="text-gray-800 text-lg leading-loose space-y-6"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>

                {/* Footer Tag / Related Info */}
                <div className="mt-20 p-10 bg-slate-50 rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-200">
                        <Star size={32} />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Bạn thấy bài viết này hữu ích?</h4>
                        <p className="text-gray-500 font-medium">Hãy chia sẻ nó với đồng đội hoặc tham gia cộng đồng KASPORT để cập nhật thêm nhiều bí quyết chơi bóng khác!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;
