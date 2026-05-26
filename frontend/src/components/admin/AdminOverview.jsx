import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, 
  Calendar, 
  Wallet, 
  TrendingUp, 
  HelpCircle, 
  MoreVertical,
  Eye,
  X,
  FileText,
  MessageCircle,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import socket from '../../utils/socket';

// --- Mock Data ---
const branchStats = [
  { label: 'Tổng số sân', value: '30 Sân', icon: <LayoutGrid size={20} />, badge: 'Hệ thống' },
  { label: 'Tổng đơn đặt hôm nay', value: '48 Lượt', icon: <Calendar size={20} />, badge: '+12%' },
  { label: 'Doanh thu hôm nay', value: '14.5M', icon: <Wallet size={20} />, badge: 'VNĐ' },
];

const revenueStats = {
  total: '342.8M',
  month: 'Tháng 10',
};

const revenueDistribution = [
  { name: 'Sân 5 (Mini)', value: 154.3, percentage: '45%', color: '#059669' },
  { name: 'Sân 7 (Trung)', value: 120.0, percentage: '35%', color: '#10B981' },
  { name: 'Sân 11 (Lớn)', value: 68.5, percentage: '20%', color: '#94A3B8' },
];

const recentBookings = [
  { id: '1', fieldName: 'Sân 7 - Cụm A1', customerName: 'Nguyễn Văn An', time: '17:30 - 19:00', status: 'confirmed' },
  { id: '2', fieldName: 'Sân 5 - Cụm B2', customerName: 'Trần Minh Tâm', time: '18:00 - 19:30', status: 'pending' },
  { id: '3', fieldName: 'Sân 7 - Cụm A3', customerName: 'Lê Thị Hoa', time: '19:00 - 20:30', status: 'confirmed' },
  { id: '4', fieldName: 'Sân 11 - Sân Chính', customerName: 'CLB Hải Đăng', time: '20:00 - 22:00', status: 'cancelled' },
];

const fieldStatusGrid = [
  { id: 'S1', occupied: true }, { id: 'S2', occupied: true }, { id: 'S3', occupied: false },
  { id: 'S4', occupied: true }, { id: 'S5', occupied: true }, { id: 'S6', occupied: false },
  { id: 'S7', occupied: true }, { id: 'S8', occupied: false }, { id: 'S9', occupied: true },
];

// --- Sub-components ---

// Custom SVG Pie Chart Component (No library required)
const CustomPieChart = () => {
    // Basic ring chart using stroke-dasharray
    const size = 200;
    const center = size / 2;
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    
    // Calculate off-sets for each segment
    let currentOffset = 0;
    
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90 drop-shadow-sm">
            {revenueDistribution.map((item, index) => {
                const percentage = parseFloat(item.percentage) / 100;
                const dashArray = `${percentage * circumference} ${circumference}`;
                const offset = currentOffset;
                currentOffset += percentage * circumference;
                
                return (
                    <motion.circle
                        key={index}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: -offset }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.2 }}
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="transparent"
                        stroke={item.color}
                        strokeWidth="24"
                        strokeDasharray={dashArray}
                        strokeLinecap="round"
                    />
                );
            })}
        </svg>
    );
};

const StatCard = ({ stat }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col text-left"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 bg-green-50 text-[#059669] rounded-lg flex items-center justify-center">
          {stat.icon}
      </div>
      {stat.badge && (
          <span className="bg-green-50 text-[#059669] text-[10px] font-bold px-2 py-1 rounded-md uppercase">
              {stat.badge}
          </span>
      )}
    </div>
    <p className="text-gray-400 font-black mb-1 text-[10px] uppercase tracking-[0.2em]">{stat.label}</p>
    <div className="flex items-end gap-1">
      <h3 className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter leading-none">{stat.value.split(' ')[0]}</h3>
      <span className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-widest leading-none">{stat.value.split(' ')[1] || ''}</span>
    </div>
  </motion.div>
);

const RevenueHighlightCard = () => (
    <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-green-900 text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden flex flex-col h-full min-h-[160px] text-left"
    >
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
        <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <TrendingUp size={20} />
            </div>
            <span className="bg-white/10 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                {revenueStats.month}
            </span>
        </div>
        <p className="text-green-200/80 font-black text-[10px] uppercase tracking-[0.2em] mb-2 leading-none">Doanh thu tháng này</p>
        <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none">{revenueStats.total}</h3>
    </motion.div>
);

const StatusBadge = ({ status }) => {
    const s = status ? status.toLowerCase() : '';
    const configs = {
        'confirmed': { color: 'text-green-600 bg-green-50', label: 'XÁC NHẬN ĐƠN' },
        'pending': { color: 'text-orange-600 bg-orange-50', label: 'CHỜ XÁC NHẬN' },
        'pending_payment': { color: 'text-orange-600 bg-orange-50', label: 'CHỜ XÁC NHẬN' },
        'pending_confirmation': { color: 'text-orange-600 bg-orange-50', label: 'CHỜ XÁC NHẬN' },
        'cancelled': { color: 'text-red-600 bg-red-50', label: 'HỦY ĐƠN' },
        'paid': { color: 'text-green-600 bg-green-50', label: 'XÁC NHẬN ĐƠN' },
        'completed': { color: 'text-emerald-700 bg-emerald-50', label: 'HOÀN THÀNH ĐƠN' },
    };
    const config = configs[s] || { color: 'text-gray-500 bg-gray-50', label: status?.toUpperCase() };
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${config.color}`}>
            {config.label}
        </span>
    );
};
const BookingStatusPopover = ({ currentStatus, onStatusChange, onClose }) => {
    const statusActions = [
        { status: 'pending', label: 'Chờ xác nhận', color: 'text-orange-600', bg: 'bg-orange-50' },
        { status: 'confirmed', label: 'Xác nhận đơn', color: 'text-green-600', bg: 'bg-green-50' },
        { status: 'cancelled', label: 'Hủy đơn', color: 'text-red-600', bg: 'bg-red-50' },
        { status: 'completed', label: 'Hoàn thành đơn', color: 'text-blue-600', bg: 'bg-blue-50' },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden p-2 text-left"
        >
            <div className="space-y-1">
                <button 
                    onClick={onClose}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all border-none bg-transparent cursor-pointer"
                >
                    <Eye size={14} /> Chi tiết
                </button>
                <div className="h-px bg-gray-50 mx-2 my-1" />
                {statusActions.map((action) => (
                    <button 
                        key={action.status}
                        onClick={() => { onStatusChange(action.status); onClose(); }}
                        className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-none cursor-pointer ${
                            currentStatus === action.status 
                                ? (action.status === 'cancelled' ? 'bg-red-600 text-white' : 'bg-slate-900 text-white') 
                                : `bg-transparent ${action.color} hover:${action.bg}`
                        }`}
                    >
                        <span>{action.label}</span>
                        {currentStatus === action.status && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

const AdminOverview = () => {
  const navigate = useNavigate();
  const [openPopoverId, setOpenPopoverId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    overview: { today_bookings: 0, today_revenue: 0, total_pitches: 0, month_revenue: 0 },
    distribution: [],
    recentBookings: []
  });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/admin/stats/overview', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Lỗi lấy thống kê:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // --- REALTIME LISTEN ---
  useEffect(() => {
    socket.on('booking_updated', (data) => {
        console.log('📢 Realtime stats update received:', data);
        fetchStats(); // Tải lại thống kê khi có thay đổi
    });

    return () => {
        socket.off('booking_updated');
    };
  }, []);

  const togglePopover = (id) => {
    setOpenPopoverId(openPopoverId === id ? null : id);
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#059669]"></div>
        </div>
    );
  }

  // --- Dynamic Mappings ---
  const dynamicBranchStats = [
    { label: 'Tổng số sân', value: `${stats?.overview?.total_pitches || 0} Sân`, icon: <LayoutGrid size={20} />, badge: 'Hệ thống' },
    { label: 'Đơn đặt hôm nay', value: `${stats?.overview?.today_bookings || 0} Lượt`, icon: <Calendar size={20} />, badge: 'Hôm nay' },
    { label: 'Doanh thu hôm nay', value: `${((stats?.overview?.today_revenue || 0)/1000000).toFixed(1)}M`, icon: <Wallet size={20} />, badge: 'VNĐ' },
  ];

  const dynamicRevenueStats = {
    projected: `${((stats?.overview?.month_projected_revenue || 0)/1000000).toFixed(1)}M`,
    actual: `${((stats?.overview?.month_actual_revenue || 0)/1000000).toFixed(1)}M`,
    month: `Tháng ${new Date().getMonth() + 1}`,
  };

  const dynamicDistribution = (stats?.distribution || []).map((item, idx) => {
    const colors = ['#059669', '#10B981', '#94A3B8'];
    const total = (stats?.distribution || []).reduce((acc, curr) => acc + parseFloat(curr?.value || 0), 0);
    const percentage = total > 0 ? ((parseFloat(item?.value || 0) / total) * 100).toFixed(0) : 0;
    const labels = { '5_nguoi': 'Sân 5 (Mini)', '7_nguoi': 'Sân 7 (Trung)', '11_nguoi': 'Sân 11 (Lớn)' };
    return {
        name: labels[item?.name] || item?.name || 'Khác',
        value: (parseFloat(item?.value || 0)/1000000).toFixed(1),
        percentage: `${percentage}%`,
        color: colors[idx % colors.length]
    };
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <header className="text-left">
        <h1 className="text-4xl font-black text-gray-900 mb-2 italic uppercase tracking-tighter leading-none">Tổng quan chi nhánh</h1>
        <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">Chào buổi sáng, quản trị viên. Dưới đây là hiệu suất sân bóng hôm nay.</p>
      </header>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 text-left">
          {dynamicBranchStats.map((stat, idx) => (
              <StatCard key={idx} stat={stat} />
          ))}
          
          {/* Projected Revenue Card */}
          <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm relative overflow-hidden flex flex-col h-full min-h-[160px] text-left"
          >
              <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <TrendingUp size={20} />
                  </div>
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {dynamicRevenueStats.month}
                  </span>
              </div>
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2 leading-none">💸 Doanh thu dự kiến</p>
              <div className="flex items-end gap-1">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none text-slate-900">{dynamicRevenueStats.projected.split(' ')[0]}</h3>
                <span className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest leading-none">VNĐ</span>
              </div>
          </motion.div>

          {/* Actual Revenue Card */}
          <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#059669] text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden flex flex-col h-full min-h-[160px] text-left"
          >
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
              <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <Wallet size={20} />
                  </div>
                  <span className="bg-white/10 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {dynamicRevenueStats.month}
                  </span>
              </div>
              <p className="text-green-200/80 font-black text-[10px] uppercase tracking-[0.2em] mb-2 leading-none">💵 Doanh thu thực tế</p>
              <div className="flex items-end gap-1">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">{dynamicRevenueStats.actual.split(' ')[0]}</h3>
                <span className="text-[10px] font-black text-green-200/50 mb-1 uppercase tracking-widest leading-none">VNĐ</span>
              </div>
          </motion.div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 content-start text-left">
          <div className="lg:col-span-2 space-y-8">
              <section className="bg-card border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
                  <div className="p-8 flex justify-between items-center">
                      <h2 className="text-xl font-black italic uppercase tracking-tighter">Lịch đặt sân gần đây</h2>
                      <button onClick={() => navigate('/admin/bookings')} className="text-[#059669] text-xs font-black hover:underline bg-transparent border-none cursor-pointer uppercase tracking-widest">Xem tất cả</button>
                  </div>
                  <div className="overflow-x-auto">
                      <table className="w-full text-left">
                          <thead className="bg-gray-50/50">
                              <tr className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] border-b border-gray-100">
                                  <th className="px-8 py-5">Tên sân</th>
                                  <th className="px-8 py-5">Khách hàng</th>
                                  <th className="px-8 py-5">Thời gian</th>
                                  <th className="px-8 py-5">Trạng thái</th>
                                  <th className="px-8 py-5"></th>
                                </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                              {(stats?.recentBookings || []).map((booking) => (
                                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                                      <td className="px-8 py-5 text-left">
                                          <p className="text-sm font-bold text-gray-800">{booking.pitchName}</p>
                                      </td>
                                      <td className="px-8 py-5 text-left">
                                          <p className="text-sm font-bold text-gray-700">{booking.customerName}</p>
                                      </td>
                                      <td className="px-8 py-5 text-left">
                                          <p className="text-xs font-bold text-gray-600">{booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)}</p>
                                      </td>
                                      <td className="px-8 py-5 text-left text-xs font-bold">
                                          <StatusBadge status={booking.status} />
                                      </td>
                                      <td className="px-8 py-5 relative text-right">
                                          <button 
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  togglePopover(booking.id);
                                               }}
                                              className={`p-1 transition-colors rounded-full border-none cursor-pointer ${openPopoverId === booking.id ? 'bg-[#059669] text-white shadow-lg' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100 bg-transparent'}`}
                                          >
                                              <MoreVertical size={16} />
                                          </button>
                                          <AnimatePresence>
                                              {openPopoverId === booking.id && (
                                                  <BookingStatusPopover 
                                                      currentStatus={booking.status} 
                                                      onStatusChange={async (status) => {
                                                          try {
                                                              const token = localStorage.getItem('token');
                                                              const response = await fetch(`http://localhost:3000/api/admin/bookings/${booking.id}/status`, {
                                                                  method: 'PATCH',
                                                                  headers: {
                                                                      'Content-Type': 'application/json',
                                                                      'Authorization': `Bearer ${token}`
                                                                  },
                                                                  body: JSON.stringify({ status })
                                                              });
                                                              if (response.ok) {
                                                                  fetchStats();
                                                              } else {
                                                                  alert('Cập nhật trạng thái thất bại');
                                                              }
                                                          } catch (error) {
                                                              console.error('Lỗi cập nhật:', error);
                                                          }
                                                      }}
                                                      onClose={() => setOpenPopoverId(null)}
                                                  />
                                              )}
                                          </AnimatePresence>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </section>

              <section className="bg-card border border-gray-100 rounded-[2.5rem] shadow-sm p-10">
                  <div className="flex justify-between items-center mb-10">
                      <h2 className="text-xl font-black italic uppercase tracking-tighter leading-none">Phân bổ doanh thu</h2>
                      <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-[0.3em]">
                          <HelpCircle size={14} />
                          DỮ LIỆU THẬT ({dynamicRevenueStats.month})
                      </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-16">
                      <div className="w-56 h-56 relative flex items-center justify-center">
                          <svg width={200} height={200} viewBox="0 0 200 200" className="transform -rotate-90 drop-shadow-sm">
                              {dynamicDistribution.map((item, index, arr) => {
                                  const radius = 80;
                                  const circum = 2 * Math.PI * radius;
                                  let offset = 0;
                                  for (let i = 0; i < index; i++) {
                                      offset += (parseFloat(arr[i].percentage) / 100) * circum;
                                  }
                                  const dash = (parseFloat(item.percentage) / 100) * circum;
                                  return (
                                      <motion.circle
                                          key={index}
                                          initial={{ strokeDashoffset: circum }}
                                          animate={{ strokeDashoffset: -offset }}
                                          transition={{ duration: 1, delay: index * 0.1 }}
                                          cx={100} cy={100} r={radius} fill="transparent"
                                          stroke={item.color} strokeWidth="24"
                                          strokeDasharray={`${dash} ${circum}`}
                                          strokeLinecap="round"
                                      />
                                  );
                              })}
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Tổng cộng</p>
                              <p className="text-2xl font-black text-gray-900 tracking-tighter">{dynamicRevenueStats.total}</p>
                          </div>
                      </div>

                      <div className="flex-1 w-full space-y-6">
                          {dynamicDistribution.map((item) => (
                              <div key={item.name} className="flex items-center gap-5">
                                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                  <div className="flex-1">
                                      <p className="text-xs font-black text-gray-900 uppercase italic tracking-tight">{item.name}</p>
                                  </div>
                                  <div className="text-right">
                                      <p className="text-sm font-black text-emerald-800 italic uppercase tracking-tighter leading-none mb-1">{item.value}M</p>
                                      <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{item.percentage} tổng thu</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </section>
          </div>

          <div className="space-y-6 flex flex-col h-full">
              <section className="bg-card border border-gray-100 rounded-[2.5rem] shadow-sm p-8">
                  <div className="flex justify-between items-center mb-8">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Trạng thái sân hiện tại</h4>
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-700" />
                      <span className="text-xs font-bold text-gray-700">Sân đang hoạt động</span>
                      <span className="ml-auto text-sm font-black text-[#059669]">{stats.overview.today_bookings}/30</span>
                  </div>
                  <div className="h-2 w-full bg-gray-50 rounded-full mb-8 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(stats.overview.today_bookings/30)*100}%` }}
                        className="h-full bg-green-700" 
                      />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                      {[1,2,3,4,5,6,7,8,9].map((id) => (
                          <div 
                              key={id}
                              className={`aspect-square rounded-2xl border flex items-center justify-center text-[10px] font-black transition-all cursor-pointer hover:scale-105 ${id <= stats.overview.today_bookings ? 'bg-green-100 border-green-200 text-green-700 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-300'}`}
                          >
                              S{id}
                          </div>
                      ))}
                  </div>
              </section>

              <div className="relative rounded-[2.5rem] overflow-hidden flex-1 min-h-[220px] group cursor-pointer shadow-sm border border-slate-100">
                  <img src="/football-facility.png" alt="Maintenance" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <h4 className="text-white font-black text-lg mb-1.5 italic uppercase tracking-tight">Cơ sở vật chất</h4>
                      <p className="text-white/80 text-xs font-medium leading-relaxed">Hệ thống sân bãi đang ở trạng thái tốt nhất để phục vụ khách hàng.</p>
                  </div>
              </div>
          </div>
      </div>
    </motion.div>
  );
};

export default AdminOverview;
