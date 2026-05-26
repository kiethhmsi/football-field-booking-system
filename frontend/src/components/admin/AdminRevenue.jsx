import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Download, 
  Calendar, 
  Search,
  LayoutDashboard,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
  Percent,
  CalendarDays,
  ShieldCheck,
  Flame,
  Award
} from 'lucide-react';

// --- COMPONENT: CARD TỔNG QUAN DÒNG TIỀN (CASHFLOW BANNER) ---
const CashflowBalanceBanner = ({ projected, received, ratio }) => {
  const formatMoney = (val) => Number(val || 0).toLocaleString() + 'đ';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-slate-900 via-[#047857] to-[#059669] text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden text-left border border-white/5 group"
    >
      {/* Decorative Blur Backgrounds */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute left-1/3 -bottom-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center divide-y lg:divide-y-0 lg:divide-x divide-white/10">
        
        {/* BLOCK 1: DỰ KIẾN DOANH THU */}
        <div className="space-y-3 pb-6 lg:pb-0">
          <div className="flex items-center gap-2 text-yellow-400">
            <TrendingUp size={16} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.22em] italic">Tổng Dự Kiến Doanh Thu</span>
          </div>
          <h2 className="text-5xl font-black tracking-tighter italic leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-yellow-200">
            {formatMoney(projected)}
          </h2>
        </div>

        {/* BLOCK 2: ĐÃ THU THỰC TẾ (CÓ THỂ HOÀN LẠI) */}
        <div className="space-y-3 pt-6 lg:pt-0 lg:pl-10 pb-6 lg:pb-0">
          <div className="flex items-center gap-2 text-emerald-400">
            <DollarSign size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.22em] italic">Đã Thu Thực Tế</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter italic leading-none text-emerald-300">
            {formatMoney(received)}
          </h2>
        </div>

        {/* BLOCK 3: TỶ LỆ (%) */}
        <div className="space-y-4 pt-6 lg:pt-0 lg:pl-10 flex flex-col justify-center">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-300 font-black uppercase tracking-[0.22em] italic">Tỷ lệ thực thu</span>
            <span className="text-2xl font-black text-yellow-400 italic tracking-tight">{ratio}%</span>
          </div>
          
          {/* Custom Sleek Progress Bar */}
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${ratio}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-emerald-400 to-yellow-400 rounded-full"
            />
          </div>
          <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
            <span>Dòng tiền trống</span>
            <span>Đã nắm chắc</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

// --- COMPONENT: CARD KPI ĐƠN LẺ ---
const StatKpiCard = ({ label, value, subText, variant = 'white' }) => (
  <div className={`p-8 rounded-[2.2rem] border transition-all duration-300 text-left relative overflow-hidden group ${
    variant === 'dark' 
      ? 'bg-slate-900 border-slate-800 text-white shadow-xl shadow-slate-900/10' 
      : 'bg-white border-slate-100 text-slate-900 shadow-lg shadow-slate-100/50 hover:shadow-xl'
  }`}>
    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity" />
    <span className={`text-[9px] font-black uppercase tracking-[0.22em] italic block mb-3 ${variant === 'dark' ? 'text-emerald-400' : 'text-slate-400'}`}>
      {label}
    </span>
    <h4 className="text-3xl font-black tracking-tighter italic leading-none mb-2 uppercase">
      {value}
    </h4>
    <p className={`text-[10px] font-bold ${variant === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
      {subText}
    </p>
  </div>
);

// --- COMPONENT: BIỂU ĐỒ DONUT TRÒN VẼ BẰNG SVG ---
const ModernDonutChart = ({ percentage, label, subLabel }) => {
  const radius = 80;
  const stroke = 16;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center text-center w-full min-w-[240px]">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-6">{label}</span>
      <div className="relative flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
          {/* Background circle */}
          <circle
            stroke="#f1f5f9"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <motion.circle
            stroke="#059669"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center leading-none">
          <span className="text-4xl font-black text-slate-800 italic tracking-tight">{percentage}%</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Đạt được</span>
        </div>
      </div>
      <p className="text-[10px] font-black text-[#059669] uppercase tracking-widest italic mt-6">{subLabel}</p>
    </div>
  );
};

// --- COMPONENT: BIỂU ĐỒ CỘT ĐỨNG DỌC SVG CHO 12 THÁNG (SIÊU GỌN & ĐỐI XỨNG) ---
const MonthlyColumnChart = ({ data, title, subtitle }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  
  const width = 500;
  const height = 240;
  const padding = 30;
  const chartHeight = height - padding * 2;
  const chartWidth = width - padding * 2;
  const barWidth = (chartWidth / data.length) - 6;

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex-1 text-left min-w-[320px]">
      <div className="mb-6">
        <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tight">{title}</h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{subtitle}</p>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f1f5f9" strokeDasharray="4" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#f1f5f9" strokeDasharray="4" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Bars */}
          {data.map((item, i) => {
            const barHeight = (item.value / maxVal) * chartHeight;
            const x = padding + i * (chartWidth / data.length) + 3;
            const y = height - padding - barHeight;

            return (
              <g key={i} className="group cursor-pointer">
                {/* Background overlay for hover */}
                <rect 
                  x={x - 2} 
                  y={padding} 
                  width={barWidth + 4} 
                  height={chartHeight} 
                  fill="transparent" 
                  className="group-hover:fill-slate-50/50 transition-colors"
                />
                
                {/* Main bar */}
                <motion.rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="2"
                  fill="#059669"
                  className="group-hover:fill-emerald-500 transition-colors"
                  initial={{ scaleY: 0, y: height - padding }}
                  animate={{ scaleY: 1, y }}
                  style={{ transformOrigin: `bottom` }}
                  transition={{ duration: 0.8, delay: i * 0.04 }}
                />

                {/* Tooltip value */}
                <text 
                  x={x + barWidth / 2} 
                  y={y - 12} 
                  textAnchor="middle" 
                  className="text-[11px] font-black fill-[#059669] hidden group-hover:block"
                >
                  {Number(item.value || 0).toLocaleString()}đ
                </text>

                {/* Month label */}
                <text 
                  x={x + barWidth / 2} 
                  y={height - 8} 
                  textAnchor="middle" 
                  className="text-[10px] font-black fill-slate-300"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

// --- COMPONENT: BIỂU ĐỒ CỘT BAR CHART SÂN BÓNG ---
const PitchBarChart = ({ data, title, subtitle }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex-1 text-left">
      <div className="mb-8">
        <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tight">{title}</h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{subtitle}</p>
      </div>
      
      <div className="space-y-4">
        {data.map((item, index) => {
          const pct = (item.value / maxVal) * 100;
          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-black uppercase">
                <span className="text-slate-600 italic">{item.label}</span>
                <span className="text-[#059669]">{Number(item.value).toLocaleString()} {item.unit || 'đ'}</span>
              </div>
              <div className="w-full h-4 bg-slate-50 rounded-lg overflow-hidden border border-slate-100/50">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`h-full rounded-lg ${
                    index === 0 ? 'bg-[#059669]' : index === 1 ? 'bg-emerald-500' : 'bg-emerald-300'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- COMPONENT: BIỂU ĐỒ ĐƯỜNG SVG (LINE CHART) CHO TẦNG 2 ---
const MonthlyLineChart = ({ data, title, subtitle }) => {
  const maxVal = Math.max(...data.map(d => d.value), 5); // Tối thiểu 5 đơn để scale trục đứng đẹp
  
  // Vẽ đường path SVG
  const width = 500;
  const height = 240;
  const padding = 30;
  
  const points = useMemo(() => {
    if (data.length === 0) return [];
    return data.map((item, i) => {
      const x = padding + (i * (width - padding * 2)) / (data.length - 1 || 1);
      const y = height - padding - (item.value / maxVal) * (height - padding * 2);
      return { x, y, ...item };
    });
  }, [data, maxVal]);

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex-1 text-left min-w-[320px]">
      <div className="mb-6">
        <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tight">{title}</h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{subtitle}</p>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f1f5f9" strokeDasharray="4" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#f1f5f9" strokeDasharray="4" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Core path */}
          {points.length > 0 && (
            <motion.path
              d={pathD}
              fill="none"
              stroke="#059669"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
            />
          )}

          {/* Dots and Labels */}
          {points.map((p, i) => (
            <g key={i} className="group cursor-pointer">
              <circle cx={p.x} cy={p.y} r="6" fill="#ffffff" stroke="#059669" strokeWidth="3" />
              <text x={p.x} y={p.y - 12} textAnchor="middle" className="text-[11px] font-black fill-[#059669] hidden group-hover:block">
                {p.value} đơn
              </text>
              <text x={p.x} y={height - 8} textAnchor="middle" className="text-[10px] font-black fill-slate-300">
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const AdminRevenue = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  
  // Bộ lọc tầng 1 (Thời gian báo cáo)
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Bộ lọc tầng 2 (Nhóm sân)
  const [selectedPitchGroup, setSelectedPitchGroup] = useState('Sân 5');

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Tính ngày bắt đầu và ngày kết thúc của tháng đã chọn
      const start = new Date(selectedYear, selectedMonth - 1, 1).toISOString().split('T')[0];
      const end = new Date(selectedYear, selectedMonth, 0).toISOString().split('T')[0];
      
      const response = await fetch(`http://localhost:3000/api/stats/revenue?startDate=${start}&endDate=${end}`);
      const result = await response.json();
      if (result.success) setStats(result.data);
    } catch (error) {
      console.error('Lỗi lấy thống kê doanh thu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [selectedMonth, selectedYear]);

  // --- MOCK/DỮ LIỆU PHÂN CHIA THEO NHÓM SÂN (Cho biểu đồ) ---
  const revenueByGroupData = useMemo(() => {
    if (!stats?.fieldRanking) return [];
    
    const groups = { 'Sân 5': 0, 'Sân 7': 0, 'Sân 11': 0 };
    stats.fieldRanking.forEach(row => {
      const typeLabel = row.pitch_type === '5_nguoi' ? 'Sân 5' : row.pitch_type === '7_nguoi' ? 'Sân 7' : 'Sân 11';
      if (groups[typeLabel] !== undefined) {
        groups[typeLabel] += Number(row.revenue);
      }
    });

    return Object.keys(groups).map(k => ({ label: k, value: groups[k] }));
  }, [stats]);

  const bookingByGroupData = useMemo(() => {
    if (!stats?.fieldRanking) return [];
    
    const groups = { 'Sân 5': 0, 'Sân 7': 0, 'Sân 11': 0 };
    stats.fieldRanking.forEach(row => {
      const typeLabel = row.pitch_type === '5_nguoi' ? 'Sân 5' : row.pitch_type === '7_nguoi' ? 'Sân 7' : 'Sân 11';
      if (groups[typeLabel] !== undefined) {
        groups[typeLabel] += row.total_bookings;
      }
    });

    return Object.keys(groups).map(k => ({ label: k, value: groups[k], unit: 'đơn' }));
  }, [stats]);

  // Dữ liệu 12 tháng gần nhất từ DB cho nhóm sân đã lọc ở tầng 2
  const groupDetailMonthly = useMemo(() => {
    const dbData = stats?.charts?.pitchTypeMonthly || [];
    const mappedType = selectedPitchGroup === 'Sân 5' ? '5_nguoi' : selectedPitchGroup === 'Sân 7' ? '7_nguoi' : '11_nguoi';
    
    const months = Array.from({length: 12}, (_, i) => i + 1);
    
    // Doanh thu từng tháng của loại sân được chọn
    const barData = months.map(m => {
      const found = dbData.find(d => d.month === m && d.pitch_type === mappedType);
      return {
        label: `T${String(m).padStart(2, '0')}`,
        value: found ? Number(found.revenue) : 0
      };
    });

    // Lượt đơn đặt sân từng tháng của loại sân được chọn
    const lineData = months.map(m => {
      const found = dbData.find(d => d.month === m && d.pitch_type === mappedType);
      return {
        label: `T${String(m).padStart(2, '0')}`,
        value: found ? Number(found.total_bookings) : 0
      };
    });

    return { bar: barData, line: lineData };
  }, [stats, selectedPitchGroup]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50/50">
        <Loader2 className="animate-spin text-[#059669] w-12 h-12" />
      </div>
    );
  }

  const m = stats?.metrics || {};
  const projectedRevenue = Number(m.projected_revenue || 0);
  const receivedRevenue = Number(m.received_revenue || 0);
  const ratio = projectedRevenue > 0 ? Math.round((receivedRevenue / projectedRevenue) * 100) : 0;
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-24 text-left px-2">
      
      {/* HEADER SECTION WITH FILTER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Quản Lý Doanh Thu</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Dashboard tài chính và dòng tiền tối tân hệ thống KaSport</p>
        </div>
        
        {/* TẦNG 1 FILTER */}
        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Tháng BC:</span>
            <select 
              value={selectedMonth} 
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="bg-slate-50 border-none px-4 py-2.5 rounded-xl text-xs font-black text-slate-700 outline-none cursor-pointer hover:bg-slate-100 transition-all"
            >
              {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>Tháng {month}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Năm:</span>
            <select 
              value={selectedYear} 
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="bg-slate-50 border-none px-4 py-2.5 rounded-xl text-xs font-black text-slate-700 outline-none cursor-pointer hover:bg-slate-100 transition-all"
            >
              {[2026, 2025, 2024].map(year => (
                <option key={year} value={year}>Năm {year}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* --- TẦNG 1: TỔNG QUAN TÀI CHÍNH TOÀN HỆ THỐNG --- */}
      
      {/* 1. THẺ CÂN ĐỐI DÒNG TIỀN (CASHFLOW BANNER) */}
      <CashflowBalanceBanner 
        projected={projectedRevenue}
        received={receivedRevenue}
        ratio={ratio}
      />

      {/* 2. HÀNG KHỐI KPI NẰM NGANG CÂN ĐỐI TUYỆT ĐỐI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatKpiCard 
          label="🏆 Tổng Doanh Thu Toàn Thời Gian" 
          value={Number(m.all_time_revenue || 0).toLocaleString() + 'đ'} 
          subText="Tổng dòng tiền thu được từ trước đến nay" 
          variant="dark"
        />
        <StatKpiCard 
          label="💵 Doanh Thu Tháng Này" 
          value={Number(m.month_revenue || 0).toLocaleString() + 'đ'} 
          subText="Chỉ tính các đơn đã hoàn tất"
        />
        <StatKpiCard 
          label="⚽ Tổng Lượt Đặt Toàn Thời Gian" 
          value={`${Number(m.all_time_bookings || 0).toLocaleString()} lượt`} 
          subText="Tổng số đơn đặt từ lúc sân đi vào vận hành"
        />
        <StatKpiCard 
          label="📈 Đơn Đặt Sân Tháng Này" 
          value={`${Number(m.period_bookings || 0).toLocaleString()} đơn`} 
          subText="Số đơn đặt sân thực tế phát sinh trong tháng"
        />
      </div>

      {/* 3. KHU VỰC BIỂU ĐỒ ĐỐI XỨNG 2 CỘT CÂN ĐỐI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* A. BIỂU ĐỒ DOANH THU NHÓM SÂN */}
        <div className="lg:col-span-1">
          <PitchBarChart 
            title="Doanh Thu Theo Nhóm Sân" 
            subtitle="Đóng góp tài chính của từng nhóm"
            data={revenueByGroupData}
          />
        </div>

        {/* B. BIỂU ĐỒ ĐƠN ĐẶT NHÓM SÂN */}
        <div className="lg:col-span-1">
          <PitchBarChart 
            title="Đơn Đặt Theo Nhóm Sân" 
            subtitle="Tần suất hoạt động của từng nhóm"
            data={bookingByGroupData}
          />
        </div>

      </div>

      {/* --- TẦNG 2: PHÂN TÍCH CHUYÊN SÂU THEO NHÓM SÂN --- */}
      <section className="bg-slate-50 p-8 rounded-[3.5rem] border border-slate-100 space-y-8 mt-10">
        
        {/* TẦNG 2 FILTER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#059669] rounded-full"></div>
            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Chi Tiết Từng Nhóm Hàng</h3>
          </div>
          
          <div className="flex gap-2 p-1 bg-white rounded-2xl shadow-sm border border-slate-100">
            {['Sân 5', 'Sân 7', 'Sân 11'].map(group => (
              <button 
                key={group}
                onClick={() => setSelectedPitchGroup(group)}
                className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase border-none cursor-pointer transition-all ${
                  selectedPitchGroup === group 
                    ? 'bg-[#059669] text-white shadow-md shadow-emerald-950/20' 
                    : 'bg-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* TẦNG 2 CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* A. DOANH THU 12 THÁNG GẦN NHẤT (ĐÃ CHUYỂN THÀNH CỘT ĐỨNG SVG SIÊU GỌN) */}
          <div className="lg:col-span-5 flex flex-col">
            <MonthlyColumnChart 
              title={`Doanh Thu ${selectedPitchGroup}`}
              subtitle="Biến động tài chính 12 tháng gần nhất"
              data={groupDetailMonthly.bar}
            />
          </div>

          {/* B. TĂNG TRƯỞNG DOANH THU TỪNG THÁNG */}
          <div className="lg:col-span-5 flex flex-col">
            <MonthlyLineChart 
              title="Tần suất đặt sân"
              subtitle="Lượng đơn đặt sân thành công theo tháng"
              data={groupDetailMonthly.line}
            />
          </div>

          {/* C. TỶ LỆ ĐÓNG GÓP DOANH THU */}
          <div className="lg:col-span-2 flex flex-col">
            <ModernDonutChart 
              percentage={selectedPitchGroup === 'Sân 5' ? 22 : selectedPitchGroup === 'Sân 7' ? 48 : 30}
              label={`Tỷ trọng doanh thu ${selectedPitchGroup}`}
              subLabel="Tỷ trọng đóng góp vào tổng dòng tiền"
            />
          </div>
        </div>

      </section>

      {/* --- CHI TIẾT ĐÓNG GÓP THEO SÂN CON (FIELD RANKING TABLE) --- */}
      <section className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div className="space-y-1">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Xếp Hạng Đóng Góp Doanh Thu</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Hiệu suất kinh doanh chi tiết từng sân bóng con</p>
          </div>
          <button className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-slate-100 hover:bg-slate-50 transition-all cursor-pointer">
            <Download size={16} /> Xuất Báo Cáo
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase font-black text-slate-300 tracking-[0.2em] border-b border-slate-50">
                <th className="px-10 py-6">Tên sân bóng</th>
                <th className="px-6 py-6">Loại sân</th>
                <th className="px-6 py-6 text-center">Tổng đơn</th>
                <th className="px-6 py-6 text-right">Doanh thu đạt được</th>
                <th className="px-10 py-6 text-right">Tỉ lệ đóng góp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats?.fieldRanking?.map((row, i) => {
                const percentage = m.completed_revenue > 0 ? Math.round((row.revenue / m.completed_revenue) * 100) : 0;
                return (
                  <tr key={i} className="group hover:bg-emerald-50/20 transition-all">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-black text-slate-100 tracking-tighter">0{i+1}</span>
                        <div>
                           <p className="text-base font-black text-slate-800 uppercase italic tracking-tighter leading-none mb-1">{row.pitch_name}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase">{row.field_complex}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                       <span className="text-[10px] font-black text-slate-400 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full uppercase tracking-widest">
                         {row.pitch_type === '5_nguoi' ? 'Sân 5' : row.pitch_type === '7_nguoi' ? 'Sân 7' : 'Sân 11'}
                       </span>
                    </td>
                    <td className="px-6 py-8 text-center font-black text-slate-700">{row.total_bookings} đơn</td>
                    <td className="px-6 py-8 text-right font-black text-[#059669] text-lg italic tracking-tighter">{Number(row.revenue || 0).toLocaleString()}đ</td>
                    <td className="px-10 py-8">
                        <div className="flex flex-col items-end gap-2">
                           <span className="text-[11px] font-black text-slate-900">{percentage}%</span>
                           <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                className="h-full bg-[#059669] rounded-full"
                              />
                           </div>
                        </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

    </motion.div>
  );
};

export default AdminRevenue;
