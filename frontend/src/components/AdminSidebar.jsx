import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  Clock, 
  TrendingUp, 
  Users, 
  Wrench, 
  Ticket,
  Plus, 
  LogOut,
  Home,
  LayoutGrid,
  Trophy
} from 'lucide-react';

import socket from '../utils/socket';

const AdminSidebar = ({ onNewBooking }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);
  const [maintenanceCount, setMaintenanceCount] = useState(0);

  const fetchCounts = async () => {
      try {
          const token = localStorage.getItem('token');
          // Lấy đơn đặt sân - Đếm các đơn chờ xác nhận/thanh toán
          const resBookings = await fetch('http://localhost:3000/api/admin/bookings', {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          const dataBookings = await resBookings.json();
          if (dataBookings.data) {
              const pendingStatuses = ['pending', 'pending_payment', 'pending_confirmation'];
              const count = dataBookings.data.filter(b => pendingStatuses.includes(b.status)).length;
              setPendingCount(count);
          }

          // Lấy số lượng bảo trì
          const resMain = await fetch('http://localhost:3000/api/maintenance', {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          const dataMain = await resMain.json();
          if (dataMain.data) {
              setMaintenanceCount(dataMain.data.filter(m => m.status === 'in_progress' || m.status === 'pending').length);
          }
      } catch (err) {
          console.error('Lỗi fetch counts:', err);
      }
  };

  useEffect(() => {
    fetchCounts();
    
    // Lắng nghe sự kiện real-time
    socket.on('booking_updated', () => {
      fetchCounts();
    });

    // Polling dự phòng mỗi 60s
    const interval = setInterval(fetchCounts, 60000);
    
    return () => {
      clearInterval(interval);
      socket.off('booking_updated');
    };
  }, []);

  const menuItems = [
    { icon: Home, label: 'Tổng quan', path: '/admin' },
    { icon: Calendar, label: 'Lịch đặt sân', path: '/admin/bookings', badge: pendingCount },
    { icon: LayoutGrid, label: 'Quản lý sân', path: '/admin/fields' },
    { icon: Clock, label: 'Quản lý khung giờ', path: '/admin/slots' },
    { icon: TrendingUp, label: 'Doanh thu', path: '/admin/revenue' },
    { icon: Users, label: 'Khách hàng', path: '/admin/users' },
    { icon: Trophy, label: 'Giải đấu', path: '/admin/tournaments' },
    { icon: Wrench, label: 'Bảo trì', path: '/admin/maintenance', badge: maintenanceCount },
  ];

  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-72 bg-[#0b1221] border-r border-white/5 flex flex-col h-screen sticky top-0 overflow-hidden shadow-2xl">
      <div className="p-8">
        <div className="flex items-center gap-4 mb-10">
          <img 
            src="/kasport-logo.png" 
            alt="KaSport Logo" 
            className="w-12 h-12 object-contain bg-white rounded-2xl p-1.5 shadow-lg shadow-emerald-500/10" 
          />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] leading-none">Hệ thống sân</span>
            <span className="text-xl font-black text-white tracking-tighter italic uppercase leading-none mt-1">KASPORT</span>
          </div>
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path || '/')}
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 group border-none cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white bg-transparent'
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon 
                    size={18} 
                    className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400'} 
                  />
                  <span className="font-black text-[11px] uppercase tracking-widest italic">{item.label}</span>
                </div>
                
                {item.badge > 0 && (
                  <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white shadow-lg shadow-red-500/20'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto px-8 pb-4 pt-8 space-y-3">
        <button 
          onClick={onNewBooking}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-500 transition-all border-none cursor-pointer mb-2 font-black text-[11px] uppercase tracking-widest italic shadow-lg shadow-emerald-600/10"
        >
          <Plus size={18} />
          Đặt sân mới
        </button>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all group border-none bg-transparent cursor-pointer font-black text-[11px] uppercase tracking-widest italic"
        >
          <LogOut size={18} className="text-slate-500 group-hover:text-red-400" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
