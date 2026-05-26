import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Clock, 
    Phone, 
    ChevronRight,
    LayoutGrid,
    MessageCircle,
    Calendar as CalendarIcon,
    ShieldCheck,
    ArrowLeft,
    CheckCircle2,
    Zap,
    MapPin,
    User
} from 'lucide-react';
import { PITCH_PRICING } from '../constants/fields';

const FieldDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [field, setField] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedCategory, setSelectedCategory] = useState(location.state?.category || 'Sân 7');

    useEffect(() => {
        const fetchFieldDetail = async () => {
            setLoading(true);
            try {
                // Gửi kèm ngày để lấy bookedSlots chính xác
                const response = await fetch(`http://localhost:3000/api/fields/${id}?date=${selectedDate}`);
                const result = await response.json();
                if (result.data) {
                    const fieldData = result.data;
                    setField(fieldData);
                    
                    if (!location.state?.category) {
                        const searchString = `${fieldData.name} ${fieldData.field_name}`.toUpperCase();
                        if (searchString.includes('11')) setSelectedCategory('Sân 11');
                        else if (searchString.includes('7')) setSelectedCategory('Sân 7');
                        else if (searchString.includes('5')) setSelectedCategory('Sân 5');
                    }
                }
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết sân:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFieldDetail();
    }, [id, selectedDate]);

    const handleBooking = () => {
        // Chuyển sang trang booking với dữ liệu sân hiện tại
        navigate('/booking', { 
            state: { 
                fieldId: field?.id,
                date: selectedDate,
                category: selectedCategory,
                pitch: field?.selectedPitchName || field?.name
            }
        });
    };

    if (loading && !field) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white italic font-black uppercase text-xs tracking-widest text-emerald-800">
                Đang tải dữ liệu thực tế...
            </div>
        );
    }

    if (!field) {
        return (
            <div className="p-20 text-center space-y-4">
                <div className="text-4xl font-black text-red-500 uppercase tracking-tighter italic">Lỗi kết nối</div>
                <button onClick={() => navigate('/fields')} className="bg-[#059669] text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest border-none cursor-pointer">
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#f8f9fa] min-h-screen pb-20 font-sans text-left">
            {/* BREADCRUMB */}
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center gap-2 text-[11px] font-medium text-gray-400 uppercase tracking-widest">
                    <span className="hover:text-emerald-600 cursor-pointer" onClick={() => navigate('/')}>Trang chủ</span>
                    <ChevronRight size={10} />
                    <span className="hover:text-emerald-600 cursor-pointer" onClick={() => navigate('/fields')}>Tìm sân</span>
                    <ChevronRight size={10} />
                    <span className="text-gray-600 font-bold">{field.name}</span>
                </div>
            </div>

            {/* IMAGES */}
            <section className="max-w-7xl mx-auto px-6 mb-8">
                <div className="grid grid-cols-12 gap-4 h-[350px]">
                    <div className="col-span-8 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                        <img src={field.image || "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=2000"} alt="Main" className="w-full h-full object-cover" />
                    </div>
                    <div className="col-span-4 flex flex-col gap-4">
                        <div className="h-full rounded-2xl overflow-hidden border border-gray-100 relative group cursor-pointer bg-emerald-900">
                             <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white z-10 text-center p-6">
                                <LayoutGrid size={32} className="mb-4 opacity-50" />
                                <span className="font-black uppercase tracking-widest text-xs italic">
                                    Thư viện ảnh sân bóng
                                </span>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 grid grid-cols-12 gap-8">
                <div className="col-span-8 space-y-8">
                    {/* INFO CARD */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm relative">
                        <div className="flex items-center gap-3 mb-4">
                             <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-lg flex items-center gap-2 border border-emerald-100 font-black text-[11px] uppercase italic tracking-wider">
                                 <Zap size={14} fill="currentColor" />
                                 {field.selectedPitchName || field.name}
                             </div>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight uppercase italic">{field.name}</h1>
                        <p className="text-gray-500 text-sm flex items-center gap-2 mb-10 font-bold">
                           <MapPin size={18} className="text-emerald-500" /> {field.address}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-gray-50">
                            {[
                                { icon: <Clock size={18} />, label: "Giờ mở cửa", val: "05:00 - 24:00" },
                                { icon: <Phone size={18} />, label: "Hotline", val: field.hotline || "0901000100" },
                                { icon: <Zap size={18} />, label: "Loại sân", val: selectedCategory },
                                { icon: <CheckCircle2 size={18} />, label: "Trạng thái", val: "Đang hoạt động", active: true }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="w-10 h-10 bg-gray-50 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">{item.icon}</div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                                    <p className={`text-[11px] font-black uppercase ${item.active ? 'text-emerald-600' : 'text-gray-900'}`}>{item.val}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12">
                            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest italic mb-6 flex items-center gap-2">
                                <div className="w-1.5 h-4 bg-emerald-600 rounded-full"></div> Cơ sở vật chất
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {field.amenities && field.amenities.length > 0 ? field.amenities.map((a, i) => (
                                    <div key={i} className="bg-gray-50 p-4 rounded-xl border border-transparent hover:border-emerald-100 transition-all text-center">
                                        <p className="text-[10px] font-black text-gray-700 uppercase tracking-tight">{a.name}</p>
                                    </div>
                                )) : (
                                    ["Cỏ nhân tạo đạt chuẩn", "Đèn LED siêu sáng", "Bóng thi đấu", "Lưới bao sân"].map((text, i) => (
                                        <div key={i} className="bg-gray-50 p-4 rounded-xl border border-transparent text-center">
                                            <p className="text-[10px] font-black text-gray-700 uppercase tracking-tight">{text}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* PRICE TABLE */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-emerald-600 px-8 py-5 flex justify-between items-center">
                            <h2 className="text-white text-[10px] font-black uppercase tracking-[0.2em] italic">Bảng giá chi tiết ({selectedCategory})</h2>
                            <span className="text-emerald-200 text-[9px] font-bold uppercase tracking-widest">Cập nhật 2026</span>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-[9px] font-black uppercase text-gray-400">
                                <tr>
                                    <th className="py-4 px-8">Khung giờ hoạt động</th>
                                    <th className="py-4 px-8 text-center">Giá ngày thường</th>
                                    <th className="py-4 px-8 text-center">Giá cuối tuần</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {PITCH_PRICING[selectedCategory] && [PITCH_PRICING[selectedCategory].day, PITCH_PRICING[selectedCategory].night].map((item, i) => (
                                    <tr key={i} className="hover:bg-emerald-50/20 transition-all">
                                        <td className="py-6 px-8 font-black text-xs text-gray-800 uppercase italic leading-none">{item.label}</td>
                                        <td className="py-6 px-8 text-center text-emerald-700 font-black text-sm italic">{(item.weekday).toLocaleString()}đ/h</td>
                                        <td className="py-6 px-8 text-center text-emerald-700 font-black text-sm italic">{(item.weekend).toLocaleString()}đ/h</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ALL PITCHES STATUS CALENDAR */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-12">
                        <div className="flex items-center justify-between border-b border-gray-50 pb-8">
                            <div>
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight italic mb-2">Lịch trống hôm nay</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trạng thái đặt sân thực tế theo thời gian thực</p>
                            </div>
                            <div className="flex gap-6 text-[9px] font-black uppercase tracking-widest">
                                <span className="flex items-center gap-2"><div className="w-3.5 h-3.5 border-2 border-gray-100 rounded"></div> <span className="text-gray-400">Trống</span></span>
                                <span className="flex items-center gap-2"><div className="w-3.5 h-3.5 bg-emerald-500 rounded-md shadow-sm shadow-emerald-200"></div> <span className="text-emerald-600">Đã đặt</span></span>
                            </div>
                        </div>

                        <div className="space-y-16">
                            {(field.pitches || []).filter(p => p.id == id).map((p, pIdx) => (
                                <div key={pIdx} className="space-y-6">
                                    <div className="flex items-center justify-between px-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
                                            <h3 className="text-sm font-black text-gray-800 uppercase italic tracking-tight">{p.name}</h3>
                                        </div>
                                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100">
                                            {p.type.replace('_nguoi', ' người')}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 md:grid-cols-7 lg:grid-cols-10 gap-2.5">
                                        {Array.from({length: 20}, (_, i) => {
                                            const time = `${(i+5).toString().padStart(2, '0')}:00`;
                                            
                                            // Chỉ hiển thị nếu giờ này nằm trong khung giờ đang hoạt động (is_active = 1) của loại sân này
                                            let isActive = true;
                                            if (field.timeSlots && field.timeSlots.length > 0) {
                                                isActive = field.timeSlots.some(slot => {
                                                    if (slot.pitch_type !== p.type) return false;
                                                    const start = slot.start_time.substring(0, 5);
                                                    const end = slot.end_time.substring(0, 5);
                                                    return time >= start && time < end;
                                                });
                                            }
                                            if (!isActive) return null;

                                            const isBooked = p.bookedSlots?.includes(time);
                                            return (
                                                <div 
                                                    key={i}
                                                    className={`py-3.5 rounded-xl text-[10px] font-black text-center transition-all border ${
                                                        isBooked 
                                                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100 scale-100' 
                                                        : 'bg-white border-gray-100 text-gray-300'
                                                    } cursor-default select-none`}
                                                >
                                                    {time}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SIDEBAR */}
                <div className="col-span-4 space-y-6">
                    <div className="bg-[#111827] p-10 rounded-[3rem] shadow-2xl sticky top-24 overflow-hidden border border-gray-800">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                             <Zap size={120} className="text-white" fill="currentColor" />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="mb-12">
                                <p className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.4em] mb-4">Hệ thống KaSport</p>
                                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">Đặt sân ngay</h2>
                                <div className="w-12 h-1.5 bg-emerald-500 mt-6 rounded-full"></div>
                            </div>

                            <div className="space-y-6 mb-12">
                                <p className="text-gray-400 text-xs font-bold leading-relaxed">
                                    Vui lòng nhấn nút bên dưới để tiến hành điền thông tin và hoàn tất thủ tục đặt sân bóng.
                                </p>
                            </div>

                            <button 
                                onClick={handleBooking}
                                className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-emerald-900/40 border-none cursor-pointer flex items-center justify-center gap-3 active:scale-95 italic mb-4"
                            >
                                <CalendarIcon size={18} /> ĐẶT SÂN RIÊNG
                            </button>

                            <button 
                                onClick={() => navigate('/create-match-booking', { state: { fieldId: field?.id, date: selectedDate, category: selectedCategory, pitch: field?.name } })}
                                className="w-full py-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-orange-900/20 border-none cursor-pointer flex items-center justify-center gap-3 active:scale-95 italic"
                            >
                                <Zap size={18} /> TẠO KÈO NGAY
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FieldDetail;
