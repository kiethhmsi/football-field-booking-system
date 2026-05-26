import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Calendar, MapPin, Users, ArrowRight, Star, Clock, Zap, Filter, Search, Edit3, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/tournaments');
        if (!res.ok) throw new Error('Không thể kết nối đến máy chủ');
        const data = await res.json();
        if (data.success) {
          setTournaments(data.data);
        } else {
          throw new Error(data.message || 'Lỗi server');
        }
      } catch (err) {
        console.error('Lỗi lấy danh sách giải đấu:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="py-40 text-center">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase italic">Lỗi kết nối hệ thống</h2>
          <p className="text-slate-500 mt-2 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all border-none cursor-pointer"
          >
            Thử lại ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-left">
      <main>
        {/* Hero Section */}
        <section className="relative py-14 md:py-16 px-6 md:px-12 bg-[#001a0f] overflow-hidden text-left border-b border-white/5">
          <div className="absolute inset-0 z-0">
             <img 
               src="/hero-fans.png" 
               className="w-full h-full object-cover opacity-15"
               alt="Tournament bg"
             />
             <div className="absolute inset-0 bg-gradient-to-r from-[#001a0f] via-transparent to-[#001a0f]" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
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
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Hệ thống giải đấu chuyên nghiệp</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-white leading-none uppercase italic tracking-tighter mb-0"
            >
              KASPORT <br/>
              <span className="text-emerald-600">CHAMPIONSHIP</span>
            </motion.h1>
          </div>
        </section>
 
        {/* Registration Steps Section */}
        <section className="relative z-20 -mt-10 px-6 md:px-12">
           <div className="max-w-7xl mx-auto bg-white rounded-[3rem] shadow-2xl shadow-emerald-900/10 border border-slate-100 p-2 md:p-4 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                 {[
                   { icon: Search, title: 'Tìm giải đấu', desc: 'Lựa chọn giải đấu phù hợp với trình độ đội bóng của bạn.', color: 'emerald' },
                   { icon: Edit3, title: 'Nhập thông tin', desc: 'Cung cấp tên đội, logo và danh sách thành viên tham gia.', color: 'blue' },
                   { icon: CreditCard, title: 'Thanh toán', desc: 'Hoàn tất lệ phí trực tuyến để giữ chỗ chính thức.', color: 'amber' },
                   { icon: Trophy, title: 'Tham gia', desc: 'Hệ thống tự động xếp lịch và bắt đầu thi đấu ngay.', color: 'rose' }
                 ].map((step, idx) => (
                   <motion.div 
                     key={idx}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ delay: idx * 0.1 }}
                     viewport={{ once: true }}
                     className={`relative p-8 group hover:bg-slate-50 transition-all duration-500 ${idx !== 3 ? 'md:border-r border-slate-100' : ''}`}
                   >
                     <div className={`w-14 h-14 rounded-2xl bg-${step.color}-50 text-${step.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm`}>
                        <step.icon size={24} />
                     </div>
                     <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Bước 0{idx + 1}</span>
                        <div className="h-px flex-1 bg-slate-100" />
                     </div>
                     <h3 className="text-sm font-black text-slate-900 uppercase italic tracking-tighter mb-2 group-hover:text-emerald-600 transition-colors">{step.title}</h3>
                     <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* Main Content */}
        <section className="py-32 px-6 md:px-12 text-left">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-16">
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Giải đấu <span className="text-emerald-600">Đang mở đăng ký</span></h2>
                <p className="text-slate-400 text-[10px] font-black mt-2 uppercase tracking-[0.2em]">Hãy nhanh chân đăng ký để giữ chỗ cho đội của bạn</p>
              </div>
              <div className="hidden md:flex gap-4">
                 <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                   <Zap size={14} className="text-amber-500" />
                   <span className="text-[10px] font-black text-slate-600 uppercase">Ưu tiên đội hoạt động tích cực</span>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <AnimatePresence>
                {loading ? (
                   [1,2].map(i => (
                     <div key={i} className="h-96 bg-slate-50 animate-pulse rounded-[3rem]" />
                   ))
                ) : tournaments.length === 0 ? (
                  <div className="col-span-full py-32 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <Trophy size={48} className="text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Hiện chưa có giải đấu nào khả dụng</p>
                  </div>
                ) : (
                  tournaments.map((tournament, idx) => (
                    <motion.div 
                      key={tournament.id}
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="group relative bg-white rounded-[3.5rem] overflow-hidden border border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={tournament.banner_url || 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=1000'} 
                          alt={tournament.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <div className="absolute top-8 left-8 flex gap-3">
                           <span className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl text-[10px] font-black text-slate-900 uppercase tracking-widest">
                             {tournament.max_teams} Đội
                           </span>
                           <span className="bg-emerald-500 px-5 py-2 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-emerald-500/30">
                             {tournament.status === 'registration' ? 'Mở đăng ký' : 'Đang thi đấu'}
                           </span>
                        </div>
                        <div className="absolute bottom-8 left-8 right-8">
                           <div className="flex items-center gap-2 text-emerald-400 mb-2 font-black italic text-sm">
                             <Trophy size={16} /> GIẢI THƯỞNG: {tournament.prize_pool}
                           </div>
                           <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-tight">{tournament.title}</h3>
                        </div>
                      </div>

                      <div className="p-10">
                        <div className="grid grid-cols-2 gap-8 mb-10">
                           <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all"><Calendar size={18} /></div>
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Khởi tranh</p>
                                <p className="text-sm font-black text-slate-900">{new Date(tournament.start_date).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'})}</p>
                              </div>
                           </div>
                           <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all"><MapPin size={18} /></div>
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Địa điểm</p>
                                <p className="text-sm font-black text-slate-900 truncate max-w-[150px]">{tournament.location}</p>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                           <div className="flex items-center gap-2">
                              <div className="flex -space-x-3">
                                {[1,2,3].map(i => (
                                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                     <img src={`https://picsum.photos/seed/${tournament.id + i}/50/50`} alt="team" />
                                  </div>
                                ))}
                              </div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">+{tournament.current_teams} Đội đã tham gia</p>
                           </div>
                           <Link 
                            to={`/tournaments/${tournament.id}`}
                            className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 shadow-xl shadow-slate-900/10 transition-all flex items-center gap-2 no-underline"
                           >
                             Chi tiết giải <ArrowRight size={14} />
                           </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
