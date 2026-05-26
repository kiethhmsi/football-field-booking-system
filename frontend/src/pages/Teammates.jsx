import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import MatchCard from '../components/MatchCard';
import MatchSidebar from '../components/MatchSidebar';
import Pagination from '../components/Pagination';

export default function Teammates() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    skill_level: '',
    field_type: ''
  });

  useEffect(() => {
    fetchMatches();
  }, [filters]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        match_type: 'find_teammate',
        ...filters
      }).toString();

      const headers = {};
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:3000/api/matches?${queryParams}`, { headers });
      const result = await response.json();
      if (response.ok) {
        setMatches(result.data);
      }
    } catch (error) {
      console.error('Lỗi lấy danh sách kèo tìm người:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ skill_level: '', field_type: '' });
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen font-black italic uppercase tracking-widest text-emerald-800">Đang tìm đồng đội...</div>;
  }

  return (
    <div className="bg-white min-h-screen text-left">
      {/* Hero Section */}
      <section className="bg-emerald-50/30 pt-16 pb-12 px-6 md:px-12 border-b border-gray-100">
        <div className="max-w-6xl mx-auto text-left">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-gray-900 mb-4 uppercase italic tracking-tighter"
          >
            Tìm <span className="text-emerald-600 underline decoration-emerald-200 underline-offset-8">đồng đội</span> học hỏi
          </motion.h2>
          <p className="max-w-2xl text-gray-500 font-medium leading-relaxed font-sans">
            Đừng để thiếu người làm gián đoạn cuộc vui. Tìm kiếm những mảnh ghép còn thiếu cho đội hình của bạn ngay hôm nay.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row gap-12 pt-8">
             {/* Sidebar for Teammates */}
             <div className="flex-shrink-0 hidden md:block">
                <MatchSidebar 
                  filters={filters} 
                  onFilterChange={handleFilterChange} 
                  onReset={handleResetFilters} 
                />
             </div>
             
             {/* Content */}
             <div className="flex-1">
                 <div className="flex flex-col md:flex-row gap-10 items-center justify-between mb-10 text-left">
                    <div className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] text-left">
                      ĐANG HIỂN THỊ <span className="text-emerald-700 font-black">{matches.length} KÈO TÌM NGƯỜI</span> PHÙ HỢP
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sắp xếp:</span>
                     <button className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl text-emerald-700 font-bold text-xs border border-gray-100 cursor-pointer">
                       Gần nhất <ChevronDown size={14} />
                     </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                  {/* Teammate Cards */}
                  {matches.map((match) => (
                    <MatchCard key={match.id} match={{
                      ...match,
                      teamName: match.team_name || 'Đội chưa đặt tên',
                      teamLogo: match.team_logo || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + match.id,
                      skillLevel: match.skill_level_required === 'fun' ? 'Giao lưu' : (match.skill_level_required === 'amateur' ? 'Trung bình' : (match.skill_level_required === 'semi_pro' ? 'Khá' : 'Giỏi')),
                      location: match.field_name || 'Tự chọn sân',
                      time: `${new Date(match.match_date).toLocaleDateString('vi-VN')} | ${match.start_time?.substring(0, 5)} - ${match.end_time?.substring(0, 5)}`
                    }} type="teammate" />
                  ))}

                  {/* Create Teammate Match CTA Tile */}
                  <div className="bg-emerald-800 rounded-[2.5rem] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden group shadow-xl shadow-emerald-100 min-h-[350px] text-left">
                    <div className="relative z-10">
                      <h3 className="text-3xl font-black mb-4 max-w-[250px] italic uppercase tracking-tighter leading-none">Đang thiếu người cho trận tới?</h3>
                      <p className="text-emerald-100/60 text-sm leading-relaxed mb-8 max-w-[300px] font-medium font-sans">
                        Chỉ mất 1 phút để đăng tin tìm đồng đội và kết nối với hàng ngàn hảo thủ trong khu vực.
                      </p>
                    </div>
                    
                    <Link to="/create-match-booking?type=teammate" className="relative z-10 w-fit text-decoration-none">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-emerald-800 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-50 transition-all border-none cursor-pointer shadow-lg shadow-black/10"
                      >
                        Tìm người ngay <UserPlus size={16} />
                      </motion.button>
                    </Link>

                    {/* Background design */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-700 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 group-hover:scale-125 transition-transform duration-700"></div>
                    <div className="absolute bottom-10 -right-10 w-48 h-48 bg-emerald-600/20 rotate-45 rounded-3xl"></div>
                  </div>
                </div>

                <Pagination />
             </div>
        </div>
      </div>
    </div>
  );
}
