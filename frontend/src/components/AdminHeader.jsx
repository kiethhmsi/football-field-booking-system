import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  HelpCircle, 
  Settings, 
  Search,
  ChevronRight,
  Moon,
  Sun,
  Languages,
  CheckCircle,
  DollarSign,
  Info,
  X,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import socket from '../utils/socket';

const AdminHeader = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [lang, setLang] = useState('vi');

  // Logic Dark Mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Lấy thông báo cho Admin
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        // Lọc các thông báo liên quan đến thanh toán hoặc hệ thống cho Admin
        const adminNotifs = data.data.filter(n => ['payment', 'booking_status', 'system'].includes(n.type));
        setNotifications(adminNotifs);
        setUnreadCount(adminNotifs.filter(n => !n.is_read).length);
      }
    } catch (err) {
      console.error('Lỗi lấy thông báo admin:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    socket.on('new_notification', () => fetchNotifications());
    socket.on('notifications_updated', () => fetchNotifications());
    return () => {
      socket.off('new_notification');
      socket.off('notifications_updated');
    };
  }, []);

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3000/api/notifications/read-all', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {}
  };

  const onboardingSteps = [
    { title: '1. Tạo sân & Cụm sân', desc: 'Vào mục "Quản lý sân", nhấn nút "+" để thêm cụm sân mới và các loại sân (5, 7, 11 người).' },
    { title: '2. Quản lý khung giờ', desc: 'Thiết lập bảng giá cho các khung giờ sáng/tối và ngày thường/cuối tuần tại mục "Quản lý khung giờ".' },
    { title: '3. Xử lý đơn hàng', desc: 'Khi khách đặt sân, đơn sẽ hiện ở "Lịch đặt sân". Hãy kiểm tra tiền cọc và nhấn "Xác nhận đơn".' },
    { title: '4. Hủy đơn & Hoàn tiền', desc: 'Nếu khách yêu cầu hủy, hãy đổi trạng thái sang "Hủy đơn". Hệ thống sẽ tự động giải phóng lịch.' }
  ];

  return (
    <div className="flex justify-between items-center px-8 py-4 bg-white border-b border-slate-100">
        <div /> 

        <div className="flex items-center gap-4 relative">
            {/* --- NÚT THÔNG BÁO --- */}
            <div className="relative">
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowSettings(false); }}
                className={`p-2.5 rounded-xl transition-all relative border-none cursor-pointer ${showNotifications ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 bg-transparent'}`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-50 overflow-hidden"
                  >
                    <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 italic">Thông báo mới</h4>
                      <button onClick={markAllRead} className="text-[10px] font-black text-emerald-600 hover:text-emerald-800 bg-transparent border-none cursor-pointer uppercase">Đã đọc hết</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto p-4 space-y-3">
                      {notifications.length === 0 ? (
                        <div className="py-10 text-center text-slate-400 font-bold text-xs">Không có thông báo mới</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className={`p-4 rounded-2xl border ${n.is_read ? 'bg-white border-slate-50 opacity-60' : 'bg-emerald-50/30 border-emerald-100 shadow-sm'}`}>
                            <div className="flex gap-3">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'payment' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                {n.type === 'payment' ? <CreditCard size={14} /> : <Info size={14} />}
                              </div>
                              <div>
                                <p className="text-[11px] font-black text-slate-900 leading-tight mb-1">{n.title}</p>
                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{n.message}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* --- NÚT TRỢ GIÚP (ONBOARDING) --- */}
            <button 
              onClick={() => setShowHelp(true)}
              className="p-2.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all bg-transparent border-none cursor-pointer"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {showHelp && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden relative"
                  >
                    <button onClick={() => setShowHelp(false)} className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-red-100 hover:text-red-500 text-slate-400 rounded-full transition-all border-none cursor-pointer"><X size={20} /></button>
                    
                    <div className="p-10">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center"><HelpCircle size={28} /></div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Hướng dẫn quản trị</h3>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Dành cho người mới bắt đầu</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {onboardingSteps.map((step, idx) => (
                          <div key={idx} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:border-emerald-200 transition-all group">
                            <h5 className="text-sm font-black text-emerald-800 uppercase italic mb-1 group-hover:text-emerald-600">{step.title}</h5>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={() => setShowHelp(false)}
                        className="w-full mt-8 py-4 bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all border-none cursor-pointer"
                      >
                        Tôi đã hiểu, bắt đầu thôi!
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* --- NÚT CÀI ĐẶT (SETTINGS) --- */}
            <div className="relative">
              <button 
                onClick={() => { setShowSettings(!showSettings); setShowNotifications(false); }}
                className={`p-2.5 rounded-xl transition-all border-none cursor-pointer ${showSettings ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 bg-transparent'}`}
              >
                <Settings className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {showSettings && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-50 overflow-hidden"
                  >
                    <div className="p-6 bg-slate-50 border-b border-slate-100">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 italic">Thiết lập cá nhân</h4>
                    </div>
                    <div className="p-3 space-y-1">
                      <button 
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        className="w-full flex items-center justify-between p-4 hover:bg-emerald-50 rounded-2xl transition-all border-none bg-transparent cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          {theme === 'light' ? <Moon size={18} className="text-slate-400 group-hover:text-emerald-600" /> : <Sun size={18} className="text-emerald-500" />}
                          <span className="text-[11px] font-black text-slate-700 uppercase italic">{theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}</span>
                        </div>
                        <div className={`w-10 h-5 rounded-full relative transition-all ${theme === 'dark' ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                           <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${theme === 'dark' ? 'left-6' : 'left-1'}`} />
                        </div>
                      </button>

                      <button className="w-full flex items-center justify-between p-4 hover:bg-emerald-50 rounded-2xl transition-all border-none bg-transparent cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <Languages size={18} className="text-slate-400 group-hover:text-emerald-600" />
                          <span className="text-[11px] font-black text-slate-700 uppercase italic">Ngôn ngữ: {lang === 'vi' ? 'Việt' : 'Anh'}</span>
                        </div>
                        <ChevronRight size={14} className="text-slate-300" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200">
               <div className="text-right">
                  <p className="text-sm font-black text-slate-900 leading-none italic uppercase">Admin Manager</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Quản trị viên</p>
               </div>
               <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-100 shadow-sm cursor-pointer hover:border-emerald-500 transition-all">
                 <img 
                    src="https://picsum.photos/seed/user/100/100" 
                    alt="User" 
                    referrerPolicy="no-referrer" 
                    className="w-full h-full object-cover"
                 />
               </div>
            </div>
        </div>
    </div>
  );
};

export default AdminHeader;
