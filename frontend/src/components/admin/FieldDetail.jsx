import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Edit3, 
  Timer, 
  CircleDot, 
  Zap, 
  Camera, 
  Droplets, 
  Plus, 
  Wrench, 
  Leaf, 
  Sun 
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const dailySlots = [
  { time: '06:00 - 07:30', status: 'Finished', customer: 'FC Lão Tướng' },
  { time: '17:00 - 18:30', status: 'Live', customer: 'Hoàng - FC Brother', field: 'Sân 7', price: '1.200.000đ' },
  { time: '18:30 - 20:00', status: 'Upcoming', customer: 'Minh Nguyễn', field: 'Sân 7', price: '1.500.000đ' },
  { time: '20:00 - 21:30', status: 'Empty' },
  { time: '21:30 - 23:00', status: 'Empty' },
];

const revenueData = [
  { name: 'W1', value: 30 },
  { name: 'W2', value: 45 },
  { name: 'W3', value: 65 },
  { name: 'W4', value: 80 },
  { name: 'W5', value: 50 },
];

// Custom SVG Bar Chart (No library required)
const CustomBarChart = ({ data }) => {
    const maxVal = Math.max(...data.map(d => d.value));
    const height = 80;
    const width = 300;
    const barWidth = 40;
    const gap = 20;

    return (
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            {data.map((item, i) => {
                const barHeight = (item.value / maxVal) * height;
                return (
                    <motion.rect
                        key={i}
                        initial={{ height: 0, y: height }}
                        animate={{ height: barHeight, y: height - barHeight }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        x={i * (barWidth + gap)}
                        width={barWidth}
                        fill="#059669"
                        rx="4"
                    />
                );
            })}
        </svg>
    );
};

const FieldDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fieldName = `Sân bóng - ${id || 'S1'}`;

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 text-left pb-20"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/admin')}
                        className="p-2 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors bg-white cursor-pointer"
                    >
                        <ChevronLeft size={20} className="text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter">{fieldName}</h1>
                    <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Đang đá
                    </span>
                </div>
                <button className="flex items-center gap-2 border border-gray-100 px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all bg-white cursor-pointer">
                    <Edit3 size={14} />
                    Chỉnh sửa thông tin sân
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Section: Field Image */}
                <div className="lg:col-span-2">
                    <div className="relative rounded-[2.5rem] overflow-hidden shadow-sm aspect-[16/10] bg-slate-100">
                        <img 
                            src="https://picsum.photos/seed/topviewgrass/1200/800" 
                            alt="Field Top View" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                           <div className="w-[80%] h-full border-x-4 border-yellow-400" />
                        </div>
                    </div>
                </div>

                {/* Right Section: Match Info & Amenities */}
                <div className="space-y-6">
                    {/* Current Match Card */}
                    <div className="bg-card border border-gray-100 rounded-[2.5rem] shadow-sm p-6">
                        <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-6">Trận đấu hiện tại</h3>
                        
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                                <Timer size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Thời gian còn lại</p>
                                <p className="text-2xl font-black text-gray-900 leading-none">24:15</p>
                            </div>
                        </div>

                        <div className="bg-indigo-50/50 rounded-2xl p-4 mb-6">
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Khách hàng</p>
                            <h4 className="font-bold text-gray-900 mb-1 leading-tight">Anh Hoàng - FC Brother</h4>
                            <p className="text-[10px] text-green-600 font-bold flex items-center gap-1 uppercase tracking-wide">
                                <CircleDot size={10} className="fill-green-600" />
                                Đã thanh toán cọc 50%
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button className="py-3 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors bg-white cursor-pointer">
                                Ghi chú sân
                            </button>
                            <button 
                                onClick={() => navigate('/admin/invoice/9021')}
                                className="py-3 bg-[#059669] text-white rounded-xl text-xs font-bold hover:bg-[#047857] transition-colors shadow-lg border-none cursor-pointer"
                            >
                                Xem hóa đơn
                            </button>
                        </div>
                    </div>

                    {/* Amenities Grid */}
                    <div className="bg-card border border-gray-100 rounded-[2.5rem] shadow-sm p-6">
                        <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-6">Tiện ích sân</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { icon: Zap, label: 'Đèn cao áp' },
                                { icon: Camera, label: 'Camera AI' },
                                { icon: Droplets, label: 'Nước uống' },
                                { icon: CircleDot, label: 'Cho thuê bóng' },
                            ].map((item) => (
                                <div key={item.label} className="bg-gray-50/50 p-4 rounded-2xl flex flex-col items-center gap-2 text-center group hover:bg-gray-100 transition-colors">
                                    <item.icon size={20} className="text-[#059669]" />
                                    <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tighter">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Schedule */}
            <section className="bg-card border border-gray-100 rounded-[2.5rem] shadow-sm p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-xl font-black italic uppercase tracking-tighter">Lịch đặt trong ngày</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hôm nay, ngày 24 tháng 05 năm 2024</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-1 text-gray-400 hover:text-gray-900 bg-transparent border-none cursor-pointer"><ChevronLeft size={20} /></button>
                        <button className="bg-gray-50 px-4 py-1.5 rounded-lg text-xs font-bold text-gray-700 border-none cursor-pointer">Hôm nay</button>
                        <button className="p-1 text-gray-400 hover:text-gray-900 bg-transparent border-none cursor-pointer"><ChevronRight size={20} /></button>
                    </div>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {dailySlots.map((slot, idx) => (
                        <div 
                            key={idx}
                            className={`min-w-[240px] p-6 rounded-3xl border transition-all ${
                                slot.status === 'Finished' ? 'bg-gray-50 border-gray-100 opacity-60' :
                                slot.status === 'Live' ? 'bg-green-50 border-green-200 ring-2 ring-green-100' :
                                slot.status === 'Upcoming' ? 'bg-indigo-50 border-indigo-100' :
                                'border-dashed border-gray-200'
                            }`}
                        >
                            <p className={`text-[10px] font-bold mb-3 uppercase tracking-widest ${slot.status === 'Live' ? 'text-green-600' : 'text-gray-400'}`}>
                                {slot.time}
                            </p>
                            {slot.customer ? (
                                <>
                                    <h4 className="font-bold text-gray-900 mb-1 text-sm">{slot.customer}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold mb-4 uppercase">{slot.field} • {slot.price}</p>
                                    {slot.status === 'Live' ? (
                                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: '60%' }}
                                                className="h-full bg-green-500" 
                                            />
                                        </div>
                                    ) : (
                                        <button className="text-[10px] font-black text-gray-900 flex items-center gap-1 uppercase hover:gap-2 transition-all bg-transparent border-none cursor-pointer">
                                            Chi tiết <ChevronRight size={12} />
                                        </button>
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-4 gap-2">
                                    <div className="w-8 h-8 rounded-full border border-green-200 border-dashed flex items-center justify-center text-green-500">
                                        <Plus size={16} />
                                    </div>
                                    <span className="text-[9px] font-black text-green-600 uppercase tracking-widest leading-none mt-1">Trống - Đặt ngay</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Revenue Stats */}
                <div className="bg-card border border-gray-100 rounded-[2.5rem] shadow-sm p-8">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-2 leading-none">Doanh thu tháng này</h3>
                            <h2 className="text-3xl font-black text-gray-900 mb-2 leading-none">24.500.000đ</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide leading-none">Đã bao gồm phí dịch vụ</p>
                        </div>
                        <span className="bg-green-50 text-green-600 text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                            +12% vs tháng trước
                        </span>
                    </div>
                    <div className="h-20">
                        <CustomBarChart data={revenueData} />
                    </div>
                </div>

                {/* Maintenance & Quality */}
                <div className="bg-card border border-gray-100 rounded-[2.5rem] shadow-sm p-8 flex flex-col justify-center">
                    <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-8 italic">Bảo trì & Chất lượng</h3>
                    
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="text-orange-500"><Wrench size={18} /></div>
                                <span className="text-xs font-bold text-gray-700">Lần bảo trì gần nhất</span>
                            </div>
                            <span className="text-xs font-black text-gray-900 uppercase">12/05/2024</span>
                        </div>

                        <div className="flex justify-between">
                            <div className="flex items-center gap-3">
                                <div className="text-green-600"><Leaf size={18} /></div>
                                <span className="text-xs font-bold text-gray-700">Tình trạng mặt cỏ</span>
                            </div>
                            <span className="text-xs font-black text-green-600 uppercase italic">Rất tốt (98%)</span>
                        </div>

                        <div className="space-y-2">
                           <div className="flex justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="text-yellow-500"><Sun size={18} /></div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Độ sáng đèn</span>
                                </div>
                                <span className="text-[10px] font-black text-gray-900">95%</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '95%' }}
                                    className="h-full bg-yellow-400" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default FieldDetail;
