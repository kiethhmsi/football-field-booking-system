import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, History, LogOut, ChevronDown, LayoutDashboard, LogIn, UserPlus, Bell, Trophy } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import socket from '../utils/socket';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, isAdmin, token, isVip } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchUnread = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        const unread = data.data.filter(n => !n.is_read).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Lỗi lấy thông báo:', err);
    }
  };

  // Lấy số lượng thông báo ban đầu
  useEffect(() => {
    if (token) {
      fetchUnread();
    }
  }, [token]);

  // Lắng nghe Socket.io cho thông báo mới và cập nhật trạng thái đã đọc
  useEffect(() => {
    if (user) {
      socket.on('new_notification', (data) => {
        if (data.user_id === user.id) {
          fetchUnread();
        }
      });

      socket.on('notifications_updated', (data) => {
        if (data.user_id === user.id) {
          fetchUnread();
        }
      });

      return () => {
        socket.off('new_notification');
        socket.off('notifications_updated');
      };
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className={`px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100/50 py-2 md:py-2.5' : 'bg-white border-b border-transparent py-3 md:py-3.5'}`}>
      <div className="flex items-center gap-8">
        <Link to="/" className="text-decoration-none flex items-center gap-2.5 group">
          <motion.img 
            src="/kasport-logo.png" 
            alt="KaSport Logo" 
            className="w-9 h-9 object-contain shrink-0 rounded-xl shadow-[0_4px_12px_rgba(16,185,129,0.15)] group-hover:scale-110 group-hover:shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all duration-300"
          />
          <h1 className="text-2xl font-black text-emerald-800 tracking-tighter italic uppercase leading-none transition-colors group-hover:text-emerald-500">
            KaSport
          </h1>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {/* ... nav links ... */}
          <NavLink to="/" end className={({ isActive }) => isActive ? "text-emerald-800 font-black border-b-2 border-emerald-800 pb-1 text-decoration-none uppercase tracking-[0.2em] text-[10px]" : "text-gray-400 hover:text-emerald-800 font-black transition-colors text-decoration-none uppercase tracking-[0.2em] text-[10px]"}>Trang chủ</NavLink>
          <NavLink to="/fields" className={({ isActive }) => isActive ? "text-emerald-800 font-black border-b-2 border-emerald-800 pb-1 text-decoration-none uppercase tracking-[0.2em] text-[10px]" : "text-gray-400 hover:text-emerald-800 font-black transition-colors text-decoration-none uppercase tracking-[0.2em] text-[10px]"}>Tìm sân</NavLink>
          <NavLink to="/matches" className={({ isActive }) => isActive ? "text-emerald-800 font-black border-b-2 border-emerald-800 pb-1 text-decoration-none uppercase tracking-[0.2em] text-[10px]" : "text-gray-400 hover:text-emerald-800 font-black transition-colors text-decoration-none uppercase tracking-[0.2em] text-[10px]"}>Tìm đối thủ</NavLink>
          <NavLink to="/teammates" className={({ isActive }) => isActive ? "text-emerald-800 font-black border-b-2 border-emerald-800 pb-1 text-decoration-none uppercase tracking-[0.2em] text-[10px]" : "text-gray-400 hover:text-emerald-800 font-black transition-colors text-decoration-none uppercase tracking-[0.2em] text-[10px]"}>Tìm đồng đội</NavLink>
          <NavLink to="/tournaments" className={({ isActive }) => isActive ? "text-emerald-800 font-black border-b-2 border-emerald-800 pb-1 text-decoration-none uppercase tracking-[0.2em] text-[10px]" : "text-gray-400 hover:text-emerald-800 font-black transition-colors text-decoration-none uppercase tracking-[0.2em] text-[10px]"}>Giải đấu</NavLink>
          <NavLink to="/news" className={({ isActive }) => isActive ? "text-emerald-800 font-black border-b-2 border-emerald-800 pb-1 text-decoration-none uppercase tracking-[0.2em] text-[10px]" : "text-gray-400 hover:text-emerald-800 font-black transition-colors text-decoration-none uppercase tracking-[0.2em] text-[10px]"}>Tin tức</NavLink>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link to="/fields" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black transition-all hidden sm:block text-decoration-none text-xs uppercase tracking-widest border-none shadow-[0_5px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.5)]">
            Đặt sân ngay
          </Link>
        </motion.div>
        
        {user ? (
          <div className="flex items-center gap-4">
            {/* Nút Chuông Thông Báo */}
            <Link to="/notifications" className="relative p-2 text-slate-400 hover:text-emerald-600 transition-colors">
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 pl-6 border-l border-gray-100 bg-transparent border-none cursor-pointer focus:outline-none group select-none"
              >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900 leading-none group-hover:text-emerald-600 transition-colors uppercase">{user.full_name}</p>
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter flex items-center gap-1.5 justify-end mt-1">
                  {isVip && <span className="bg-[#faea18] text-[#002616] px-1 py-0.5 rounded text-[8px] font-black tracking-widest uppercase shadow-sm">VIP</span>}
                  {user.role === 'admin' ? 'Quản trị viên' : user.role === 'field_owner' ? 'Chủ sân' : 'Thành viên'}
                </p>
              </div>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${isVip ? 'ring-2 ring-[#faea18] bg-amber-50 shadow-inner' : 'bg-slate-100 hover:bg-emerald-50'} ${isMenuOpen ? 'bg-emerald-100 ring-4 ring-emerald-50' : ''}`}>
                 <User size={22} className={isMenuOpen ? 'text-emerald-700' : isVip ? 'text-amber-600' : 'text-slate-400'} />
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <div className="absolute right-0 mt-4 z-50">
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="w-72 bg-[#f0fbff] rounded-[2rem] shadow-2xl shadow-emerald-900/10 border-l-[6px] border-emerald-900 overflow-hidden py-6"
                  >
                    <div className="px-8 mb-6 select-none">
                      <h4 className="text-xl font-black text-slate-900 italic uppercase flex items-center gap-1.5">{user.full_name}</h4>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">
                        {user.role === 'admin' ? 'Quyền tối cao' : isVip ? '⭐ THÀNH VIÊN VIP GOLD' : 'Thành viên KASPORT'}
                      </p>
                    </div>

                    <div className="space-y-1.5 px-4">
                      {isAdmin && (
                        <button 
                          onClick={() => { navigate('/admin'); setIsMenuOpen(false); }}
                          className="w-full flex items-center px-5 py-4 rounded-2xl bg-emerald-800 text-white font-black text-sm shadow-md border-none cursor-pointer hover:bg-black active:scale-95 transition-all mb-2"
                        >
                          <LayoutDashboard className="w-5 h-5 mr-4 text-white" />
                          QUẢN TRỊ HỆ THỐNG
                        </button>
                      )}

                      <button 
                        onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}
                        className="w-full flex items-center px-5 py-4 rounded-2xl bg-transparent text-slate-500 font-bold text-sm border-none cursor-pointer hover:bg-emerald-100 hover:text-emerald-800 group active:scale-95 transition-all"
                      >
                        <User className="w-5 h-5 mr-4 text-slate-400 group-hover:text-emerald-600" />
                        Hồ sơ cá nhân
                      </button>

                      <button 
                        onClick={() => { navigate('/history'); setIsMenuOpen(false); }}
                        className="w-full flex items-center px-5 py-4 text-slate-500 font-bold text-sm hover:bg-emerald-100 hover:text-emerald-800 active:scale-95 transition-all group bg-transparent border-none cursor-pointer rounded-2xl"
                      >
                        <History className="w-5 h-5 mr-4 text-slate-400 group-hover:text-emerald-600" />
                        Lịch sử đặt sân
                      </button>

                      <button 
                        onClick={() => { navigate('/my-matches'); setIsMenuOpen(false); }}
                        className="w-full flex items-center px-5 py-4 text-slate-500 font-bold text-sm hover:bg-emerald-100 hover:text-emerald-800 active:scale-95 transition-all group bg-transparent border-none cursor-pointer rounded-2xl"
                      >
                        <Trophy className="w-5 h-5 mr-4 text-slate-400 group-hover:text-emerald-600" />
                        Quản lý kèo đấu
                      </button>

                      <div className="mx-4 my-2 border-t border-slate-200/40" />

                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center px-5 py-4 text-rose-600 font-black text-sm hover:bg-rose-100 active:scale-95 transition-all bg-transparent border-none cursor-pointer rounded-2xl"
                      >
                        <LogOut className="w-5 h-5 mr-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-xs font-black text-emerald-800 uppercase tracking-widest text-decoration-none hover:bg-emerald-50 rounded-xl transition-all">
              <LogIn size={16} />
              Đăng nhập
            </Link>
            <Link to="/register" className="flex items-center gap-2 px-4 py-2 text-xs font-black bg-emerald-100 text-emerald-800 uppercase tracking-widest text-decoration-none rounded-xl hover:bg-emerald-200 transition-all">
              <UserPlus size={16} />
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
