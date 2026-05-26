import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Clock, 
    Calendar as CalendarIcon, 
    LayoutGrid, 
    User, 
    Phone, 
    Mail, 
    Zap,
    Trophy,
    CheckCircle2,
    ShieldCheck,
    ChevronRight,
    MapPin,
    ArrowLeft
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PITCH_PRICING } from '../constants/fields';

export default function BookingView({ mode = 'booking' }) { // mode: 'booking' hoặc 'matchmaking'
    const navigate = useNavigate();
    const location = useLocation();
    const initialData = location.state || {};
    const [field, setField] = useState(null);
    const [allFields, setAllFields] = useState([]);
    const [loadingFields, setLoadingFields] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(initialData.category || ''); 
    const [view, setView] = useState('booking'); 
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    // States
    const [selectedDate, setSelectedDate] = useState(initialData.date || new Date().toISOString().split('T')[0]);
    const [duration, setDuration] = useState(initialData.duration || '1h');
    const [startTime, setStartTime] = useState(initialData.time || '');
    const [selectedPitchIndex, setSelectedPitchIndex] = useState(0);
    const [contactInfo, setContactInfo] = useState({
        fullName: '',
        phone: '',
        email: '',
        note: ''
    });

    useEffect(() => {
        if (initialData.fieldId) {
            fetch(`http://localhost:3000/api/fields/${initialData.fieldId}?date=${selectedDate}`)
                .then(res => res.json())
                .then(res => {
                    if (res.data) {
                        setField(res.data);
                        const category = initialData.category || 'Sân 7';
                        const filtered = res.data.pitches.filter(p => {
                            const pType = p.type === '5_nguoi' ? 'Sân 5' : p.type === '7_nguoi' ? 'Sân 7' : 'Sân 11';
                            return pType === category;
                        });
                        const index = filtered.findIndex(p => p.id === initialData.pitchId);
                        if (index !== -1) setSelectedPitchIndex(index);
                    }
                });
        } else {
            // Fetch tất cả các sân nếu chưa chọn sân nào
            setLoadingFields(true);
            fetch('http://localhost:3000/api/fields')
                .then(res => res.json())
                .then(res => {
                    if (res.data) setAllFields(res.data);
                    setLoadingFields(false);
                })
                .catch(() => setLoadingFields(false));
        }
    }, [initialData.fieldId, initialData.pitchId]);

    // Re-fetch field details when date changes
    useEffect(() => {
        if (field && field.id) {
            fetch(`http://localhost:3000/api/fields/${field.id}?date=${selectedDate}`)
                .then(res => res.json())
                .then(res => {
                    if (res.data) setField(res.data);
                });
        }
    }, [selectedDate]);

    const handleSelectField = (fieldId, targetPitchId = null) => {
        fetch(`http://localhost:3000/api/fields/${fieldId}?date=${selectedDate}`)
            .then(res => res.json())
            .then(res => {
                if (res.data) {
                    setField(res.data);
                    // Nếu có targetPitchId, tìm index của nó trong danh sách mới
                    if (targetPitchId) {
                        const category = selectedCategory || initialData.category || 'Sân 7';
                        const filtered = res.data.pitches.filter(p => {
                            const pType = p.type === '5_nguoi' ? 'Sân 5' : p.type === '7_nguoi' ? 'Sân 7' : 'Sân 11';
                            return pType === category;
                        });
                        const index = filtered.findIndex(p => p.id === targetPitchId);
                        if (index !== -1) setSelectedPitchIndex(index);
                    } else {
                        setSelectedPitchIndex(0);
                    }
                }
            });
    };

    const filteredPitches = useMemo(() => {
        const category = selectedCategory || initialData.category || 'Sân 7';
        
        // Nếu đã có sân được chọn trước (từ trang chi tiết sân)
        if (field && field.pitches) {
            return field.pitches.filter(p => {
                const pType = p.type === '5_nguoi' ? 'Sân 5' : p.type === '7_nguoi' ? 'Sân 7' : 'Sân 11';
                return pType === category;
            });
        }

        // Nếu đang ở chế độ tạo kèo nhanh (chưa chọn tổ hợp)
        if (mode === 'matchmaking' && allFields.length > 0) {
            return allFields.filter(p => {
                const pType = p.type === '5_nguoi' ? 'Sân 5' : p.type === '7_nguoi' ? 'Sân 7' : 'Sân 11';
                if (pType === category) {
                    // Gán thêm thông tin để hiển thị đồng nhất
                    p.facilityName = p.field_name; 
                    return true;
                }
                return false;
            });
        }

        return [{ name: initialData.pitch || 'Sân 01', type: category, id: initialData.pitchId }];
    }, [field, allFields, selectedCategory, initialData.category, initialData.pitch, initialData.pitchId, mode]);

    const displayedTimeSlots = useMemo(() => {
        const baseSlots = [
            "05:00", "06:00", "07:00", "08:00", "09:00", "10:00",
            "11:00", "12:00", "13:00", "14:00", "15:00", "16:00",
            "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
        ];
        
        const category = selectedCategory || initialData.category || 'Sân 7';
        const mappedType = category === 'Sân 5' ? '5_nguoi' : category === 'Sân 7' ? '7_nguoi' : '11_nguoi';

        if (!field || !field.timeSlots || field.timeSlots.length === 0) {
            return baseSlots;
        }

        // Lọc các mốc giờ nằm trong các khung giờ hoạt động (is_active = 1) của loại sân được chọn
        const filtered = baseSlots.filter(hour => {
            return field.timeSlots.some(slot => {
                if (slot.pitch_type !== mappedType) return false;
                const start = slot.start_time.substring(0, 5);
                const end = slot.end_time.substring(0, 5);
                return hour >= start && hour < end;
            });
        });

        return filtered;
    }, [field, selectedCategory, initialData.category]);

    // Reset startTime if it's no longer in the active displayed slots
    useEffect(() => {
        if (startTime && displayedTimeSlots.length > 0 && !displayedTimeSlots.includes(startTime)) {
            setStartTime('');
        }
    }, [displayedTimeSlots, startTime]);

    const currentPrice = useMemo(() => {
        const category = selectedCategory || initialData.category || 'Sân 7';
        const mappedType = category === 'Sân 5' ? '5_nguoi' : category === 'Sân 7' ? '7_nguoi' : '11_nguoi';

        let basePrice = 200000; // default fallback

        if (field && field.timeSlots && field.timeSlots.length > 0) {
            const hour = startTime || '05:00';
            const matchedSlot = field.timeSlots.find(slot => {
                if (slot.pitch_type !== mappedType) return false;
                const start = slot.start_time.substring(0, 5);
                const end = slot.end_time.substring(0, 5);
                return hour >= start && hour < end;
            });
            if (matchedSlot) {
                basePrice = Number(matchedSlot.price);
            } else {
                const firstSlot = field.timeSlots.find(slot => slot.pitch_type === mappedType);
                if (firstSlot) basePrice = Number(firstSlot.price);
            }
        } else {
            const pricing = PITCH_PRICING[category] || PITCH_PRICING['Sân 7'];
            const dayOfWeek = new Date(selectedDate).getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const hour = startTime ? parseInt(startTime.split(':')[0]) : 5;
            const period = hour >= 5 && hour < 10 ? 'day' : (hour >= 16 ? 'night' : 'day');
            basePrice = isWeekend ? pricing[period].weekend : pricing[period].weekday;
        }

        const hourNum = startTime ? parseInt(startTime.split(':')[0]) : 5;
        if (hourNum >= 5 && hourNum < 10) {
            basePrice = basePrice * 0.8;
        }

        const multiplier = duration === '1h' ? 1 : duration === '1.5h' ? 1.5 : 2;
        return basePrice * multiplier;
    }, [duration, selectedDate, startTime, selectedCategory, initialData.category, field]);

    // Tính số giờ khả dụng tối đa từ giờ bắt đầu đến booking kế tiếp
    const maxAvailableHours = useMemo(() => {
        if (!startTime) return 3; // Chưa chọn giờ -> không giới hạn
        const bookedSlots = filteredPitches[selectedPitchIndex]?.bookedSlots || [];
        const [startH] = startTime.split(':').map(Number);
        const startMinutes = startH * 60;

        let nextBookedMinutes = 24 * 60; // Mặc định cuối ngày
        bookedSlots.forEach(slot => {
            const [slotH] = slot.split(':').map(Number);
            const slotMinutes = slotH * 60;
            // Tìm slot bị đặt gần nhất nằm SAU giờ bắt đầu
            if (slotMinutes > startMinutes && slotMinutes < nextBookedMinutes) {
                nextBookedMinutes = slotMinutes;
            }
        });

        return (nextBookedMinutes - startMinutes) / 60;
    }, [startTime, filteredPitches, selectedPitchIndex]);

    // Tự động reset về 1h nếu thời lượng hiện tại bị overlap
    useEffect(() => {
        const durHours = duration === '1h' ? 1 : duration === '1.5h' ? 1.5 : 2;
        if (durHours > maxAvailableHours) {
            setDuration('1h');
        }
    }, [maxAvailableHours]);

    const [bookingCode, setBookingCode] = useState('');
    const [bookingId, setBookingId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('online'); // Mặc định là online/payos
    const [depositOption, setDepositOption] = useState('50'); // '50' hoặc '100'
    const handleConfirm = async () => {
        if (!startTime) return alert("Vui lòng chọn giờ bắt đầu!");
        if (!contactInfo.fullName.trim() || !contactInfo.phone.trim() || !contactInfo.email.trim()) return alert("Vui lòng điền đầy đủ thông tin!");
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        setView('checkout');
    };

    const handleFinalSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const calculateEndTime = (start, dur) => {
                const [h, m] = start.split(':').map(Number);
                const durNum = dur === '1h' ? 1 : dur === '1.5h' ? 1.5 : 2;
                const totalMinutes = h * 60 + m + durNum * 60;
                return `${String(Math.floor(totalMinutes / 60) % 24).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`;
            };

            const bookingData = {
                field_id: initialData.fieldId || field?.id,
                pitch_id: filteredPitches[selectedPitchIndex]?.id || initialData.pitchId,
                booking_date: selectedDate,
                start_time: startTime,
                end_time: calculateEndTime(startTime, duration),
                subtotal: currentPrice,
                total_price: currentPrice,
                deposit_amount: depositOption === '50' ? Math.floor(currentPrice * 0.5) : currentPrice,
                payment_method: paymentMethod,
                customer_name: contactInfo.fullName,
                customer_phone: contactInfo.phone,
                customer_email: contactInfo.email.trim(),
                note: contactInfo.note
            };

            const apiEndpoint = mode === 'matchmaking' 
                ? 'http://localhost:3000/api/bookings/create-matchmaking'
                : 'http://localhost:3000/api/bookings';

            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(bookingData)
            });

            const result = await response.json();
            if (response.ok) {
                if (mode === 'matchmaking') {
                    // Lấy loại kèo từ URL params (mặc định là opponent)
                    const searchParams = new URLSearchParams(window.location.search);
                    const matchType = searchParams.get('type') || 'opponent';
                    const targetPath = matchType === 'teammate' ? '/create-match-teammate' : '/create-match-opponent';

                    navigate(targetPath, { 
                        state: { 
                            bookingId: result.bookingId,
                            fieldId: bookingData.field_id,
                            matchDate: bookingData.booking_date,
                            startTime: bookingData.start_time,
                            endTime: bookingData.end_time,
                            pitchName: filteredPitches[selectedPitchIndex]?.name,
                            fieldType: initialData.category
                        } 
                    });
                    return;
                }
                
                setBookingCode(result.booking_code);
                const newBookingId = result.bookingId;
                setBookingId(newBookingId);

                if (paymentMethod === 'online') {
                    // --- GỌI API TẠO LINK PAYOS ---
                    const payosRes = await fetch('http://localhost:3000/api/payos/create-payment-link', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({
                            bookingId: newBookingId,
                            amountType: depositOption === '50' ? 'deposit' : 'full'
                        })
                    });
                    const payosData = await payosRes.json();
                    if (payosRes.ok && payosData.data.checkoutUrl) {
                        // Chuyển hướng sang trang thanh toán PayOS
                        window.location.href = payosData.data.checkoutUrl;
                    } else {
                        alert("Lỗi tạo link thanh toán: " + payosData.message);
                    }
                } else if (paymentMethod === 'cash') {
                    setShowSuccessModal(true);
                } else {
                    setView('success');
                }
            } else {
                alert(`${result.message}${result.error ? ': ' + result.error : ''}`);
            }
        } catch (error) {
            console.error("Lỗi đặt sân:", error);
            alert("Đã có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    // Success Modal Component
    const SuccessModal = () => (
        <AnimatePresence>
            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setShowSuccessModal(false)}
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl text-center overflow-hidden"
                    >
                        {/* Decorative Circle */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50" />
                        
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-200 ring-8 ring-emerald-50">
                                <CheckCircle2 size={48} className="text-white" />
                            </div>

                            <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tight mb-3">Đặt sân thành công!</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed mb-8 px-4">
                                Chủ sân sẽ xác nhận qua Zalo/SMS trong vài phút.
                            </p>

                            <div className="bg-emerald-50 py-4 px-6 rounded-2xl border border-emerald-100 mb-10">
                                <span className="text-lg font-black text-emerald-700 uppercase tracking-widest">{bookingCode}</span>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={() => navigate('/history')}
                                    className="w-full py-5 bg-emerald-600 text-white rounded-full font-black text-xs uppercase tracking-widest italic shadow-xl shadow-emerald-900/10 hover:bg-emerald-700 transition-all active:scale-95 border-none cursor-pointer"
                                >
                                    Xem lịch sử
                                </button>
                                <button 
                                    onClick={() => navigate('/')}
                                    className="w-full py-5 bg-white text-emerald-600 border-2 border-emerald-100 rounded-full font-black text-xs uppercase tracking-widest italic hover:bg-emerald-50 transition-all active:scale-95 cursor-pointer"
                                >
                                    Về trang chủ
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    if (view === 'checkout') {
        return (
            <div className="bg-[#f0f2f5] min-h-screen py-12 px-6 font-sans text-left">
                <div className="max-w-6xl mx-auto">
                    {/* Header with back button */}
                    <div className="flex items-center gap-4 mb-10">
                        <button onClick={() => setView('booking')} className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 text-gray-400 hover:text-emerald-600 transition-all cursor-pointer">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Xác nhận thanh toán</h1>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* LEFT: Summary & Promo */}
                        <div className="lg:w-[60%] space-y-6">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <LayoutGrid className="text-emerald-600" size={20} />
                                    <h2 className="text-lg font-black text-gray-900 uppercase italic">Tóm tắt đơn hàng</h2>
                                </div>
                                <div className="flex flex-col md:flex-row gap-6 bg-emerald-50/50 p-6 rounded-[2.5rem] border border-emerald-100/50 relative overflow-hidden group">
                                    <div className="w-full md:w-48 h-32 rounded-3xl overflow-hidden shrink-0 border-2 border-white shadow-md relative">
                                        <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Pitch" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tight leading-none">{filteredPitches[selectedPitchIndex]?.name}</h3>
                                            <span className="bg-emerald-500 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm shadow-emerald-200">Gói chuẩn</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                                            📅 {selectedDate.split('-').reverse().join('/')} | ⏰ {startTime} - {duration}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl font-black text-emerald-600 italic tracking-tighter">{currentPrice.toLocaleString()}đ</span>
                                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic bg-emerald-100/50 px-2 py-0.5 rounded-md">Giá tiêu chuẩn</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Payment Methods & Total */}
                        <div className="lg:w-[40%] space-y-6">
                            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col h-full">
                                <h2 className="text-lg font-black text-gray-900 uppercase italic mb-8 border-b border-gray-50 pb-4">Phương thức thanh toán</h2>
                                <div className="space-y-4 flex-1">
                                    <button 
                                        onClick={() => setPaymentMethod('cash')}
                                        className={`w-full p-6 rounded-3xl border-2 flex items-center justify-between transition-all cursor-pointer group ${paymentMethod === 'cash' ? 'border-emerald-600 bg-emerald-50/50 shadow-md' : 'border-gray-50 bg-white hover:border-emerald-200'}`}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${paymentMethod === 'cash' ? 'bg-rose-600 text-white rotate-6' : 'bg-rose-50 text-rose-400 group-hover:scale-110'}`}>💵</div>
                                            <div className="text-left">
                                                <p className="text-sm font-black text-gray-900 uppercase italic leading-none">Tiền mặt</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Thanh toán tại quầy</p>
                                            </div>
                                        </div>
                                        {paymentMethod === 'cash' && <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center"><CheckCircle2 size={14} className="text-white" /></div>}
                                    </button>

                                    <button 
                                        onClick={() => setPaymentMethod('online')}
                                        className={`w-full p-6 rounded-3xl border-2 flex items-center justify-between transition-all cursor-pointer group ${paymentMethod === 'online' ? 'border-emerald-600 bg-emerald-50/50 shadow-md' : 'border-gray-50 bg-white hover:border-emerald-200'}`}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${paymentMethod === 'online' ? 'bg-emerald-600 text-white rotate-6' : 'bg-emerald-50 text-emerald-400 group-hover:scale-110'}`}>🏦</div>
                                            <div className="text-left">
                                                <p className="text-sm font-black text-gray-900 uppercase italic leading-none">Chuyển khoản / QR</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Tự động xác nhận trực tuyến</p>
                                            </div>
                                        </div>
                                        {paymentMethod === 'online' && <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center"><CheckCircle2 size={14} className="text-white" /></div>}
                                    </button>

                                    {paymentMethod === 'online' && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100 flex gap-2">
                                            <button 
                                                onClick={() => setDepositOption('50')}
                                                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all border-none cursor-pointer ${depositOption === '50' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600'}`}
                                            >
                                                Cọc 50%
                                            </button>
                                            <button 
                                                onClick={() => setDepositOption('100')}
                                                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all border-none cursor-pointer ${depositOption === '100' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600'}`}
                                            >
                                                Trả đủ 100%
                                            </button>
                                        </motion.div>
                                    )}


                                </div>

                                <div className="mt-12 pt-10 border-t border-dashed border-gray-200 space-y-4">
                                    <div className="flex justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest pl-2">
                                        <span>Tạm tính</span>
                                        <span className="text-gray-900">{currentPrice.toLocaleString()}đ</span>
                                    </div>
                                    <div className="flex justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest pl-2">
                                        <span>Phí dịch vụ</span>
                                        <span className="text-emerald-600">Free</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 px-2 bg-gray-50 rounded-2xl py-4">
                                        <span className="text-sm font-black text-gray-900 uppercase italic tracking-tight">Tổng cộng</span>
                                        <span className="text-3xl font-black text-emerald-600 italic tracking-tighter leading-none">{currentPrice.toLocaleString()}đ</span>
                                    </div>
                                </div>

                                <button onClick={handleFinalSubmit} className="w-full mt-10 py-6 bg-emerald-800 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-emerald-900/40 hover:bg-black transition-all active:scale-95 border-none cursor-pointer italic flex items-center justify-center gap-3">
                                    XÁC NHẬN THANH TOÁN <ChevronRight size={18} />
                                </button>

                                {/* NÚT THANH TOÁN GIẢ LẬP (CHỈ HIỆN KHI ĐANG THANH TOÁN ONLINE VÀ ĐÃ CÓ ID) */}
                                {paymentMethod === 'online' && bookingId && (
                                    <button
                                        onClick={async () => {
                                            try {
                                                // Tính toán số tiền giả lập dựa trên lựa chọn cọc 50% hay 100%
                                                const mockAmount = depositOption === '50' ? Math.floor(currentPrice * 0.5) : currentPrice;
                                                
                                                const response = await fetch('http://localhost:3000/api/payos/webhook', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        code: "00",
                                                        desc: "success",
                                                        data: {
                                                            orderCode: Number(bookingId),
                                                            amount: mockAmount,
                                                            description: `MOCK_PAYMENT_${depositOption}_PERCENT`
                                                        },
                                                        signature: "test"
                                                    })
                                                });
                                                if (response.ok) {
                                                    alert(`✅ GIẢ LẬP THÀNH CÔNG!\n- Số tiền: ${mockAmount.toLocaleString()}đ (${depositOption}%)\n- Hãy xem Admin Dashboard tự động cập nhật!`);
                                                    navigate('/payment-success');
                                                }
                                            } catch (error) {
                                                alert("❌ Lỗi giả lập: " + error.message);
                                            }
                                        }}
                                        className="w-full mt-4 py-4 bg-emerald-50 text-emerald-700 rounded-[2rem] font-black text-[10px] uppercase tracking-widest border-2 border-dashed border-emerald-200 hover:bg-emerald-100 transition-all cursor-pointer italic"
                                    >
                                        🛠️ GIẢ LẬP THANH TOÁN {depositOption}% (TEST)
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 flex flex-wrap justify-center gap-12 border-t border-gray-200 pt-10">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"><ShieldCheck size={18} className="text-emerald-600" /></div>
                             THANH TOÁN BẢO MẬT
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"><CheckCircle2 size={18} className="text-emerald-600" /></div>
                             TIÊU CHUẨN PCI DSS
                        </div>
                    </div>
                </div>
                <SuccessModal />
            </div>
        );
    }

    if (view === 'success') {
        const qrUrl = `https://img.vietqr.io/image/MB-0346201787-compact2.png?amount=${currentPrice/2}&addInfo=${bookingCode}&accountName=HUYNH%20HAI%20KIET`;
        return (
            <div className="min-h-screen bg-[#f8f9fa] py-12 px-6 font-sans text-left relative">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-[#008A45] rounded-[2.5rem] p-10 text-white shadow-2xl">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">ĐẶT SÂN THÀNH CÔNG</p>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">THANH TOÁN ĐƠN HÀNG</h2>
                        <p className="mt-4 font-bold">MÃ ĐƠN: <span className="text-yellow-300 uppercase">{bookingCode}</span></p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 flex flex-col items-center shadow-sm">
                             <img src={qrUrl} alt="QR" className="w-64 h-64 object-contain mb-4" />
                             <p className="text-xs font-black uppercase text-emerald-600">Cọc 50%: {(currentPrice/2).toLocaleString()}đ</p>
                        </div>
                        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 text-left">
                             <h3 className="font-black text-gray-900 uppercase italic">Thông tin tài khoản</h3>
                             <div className="space-y-4 text-sm font-bold">
                                <div><p className="text-[10px] text-gray-400 font-black uppercase">Ngân hàng</p><p>MB BANK (Quân Đội)</p></div>
                                <div><p className="text-[10px] text-gray-400 font-black uppercase">Chủ tài khoản</p><p>HUYNH HAI KIET</p></div>
                                <div><p className="text-[10px] text-gray-400 font-black uppercase">Số tài khoản</p><p className="text-xl font-black text-emerald-600">0346201787</p></div>
                                <div><p className="text-[10px] text-gray-400 font-black uppercase">Nội dung</p><p className="font-black text-emerald-700 bg-emerald-50 p-3 rounded-lg uppercase">{bookingCode}</p></div>
                             </div>
                             <div className="pt-4 space-y-3">
                                <button 
                                    onClick={() => setShowSuccessModal(true)} 
                                    className="w-full py-5 bg-emerald-600 text-white rounded-full font-black text-xs uppercase tracking-widest italic cursor-pointer border-none shadow-xl shadow-emerald-900/10 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 size={18} /> Xác nhận đã chuyển khoản
                                </button>
                                <button onClick={() => navigate('/')} className="w-full py-4 bg-gray-50 text-gray-400 rounded-full font-black text-[10px] uppercase italic cursor-pointer border-none hover:bg-gray-100 transition-all text-center block no-underline">Về trang chủ</button>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f8f9fa] min-h-screen py-12 px-6 font-sans text-left">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* LEFT SIDE (2/3 width) */}
                    <div className="lg:w-2/3 space-y-6 w-full">
                        {/* 1. CHỌN SÂN & THỜI GIAN */}
                        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Chọn sân & Thời gian</h2>
                            </div>

                            {/* STEP 1: CHỌN LOẠI SÂN (Chỉ hiện khi tạo kèo và chưa có sân) */}
                            {mode === 'matchmaking' && !initialData.fieldId && (
                                <div className="space-y-8 mb-10 text-left">
                                    <div>
                                        <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] block mb-4">1. Bạn muốn đá sân mấy người?</label>
                                        <div className="flex gap-3">
                                            {['Sân 5', 'Sân 7', 'Sân 11'].map(cat => (
                                                <button 
                                                    key={cat}
                                                    onClick={() => setSelectedCategory(cat)}
                                                    className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase italic border-2 transition-all cursor-pointer ${selectedCategory === cat ? 'bg-emerald-600 border-emerald-700 text-white shadow-lg' : 'bg-white border-gray-50 text-gray-400 hover:border-emerald-100'}`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: CHỌN SÂN CỤ THỂ */}
                            <div className="mb-8 text-left">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">
                                    {mode === 'matchmaking' ? '2. Chọn sân đang trống' : 'Sân bóng đang chọn'}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {mode === 'booking' ? (
                                        <div className="col-span-full inline-flex items-center gap-3 bg-emerald-600 text-white px-6 py-4 rounded-2xl border border-emerald-700 shadow-lg w-fit">
                                            <Trophy size={18} className="text-white" />
                                            <span className="text-lg font-black uppercase italic tracking-tight">
                                                {filteredPitches[selectedPitchIndex]?.name || initialData.pitch || 'Sân bóng'}
                                            </span>
                                        </div>
                                    ) : (
                                        selectedCategory ? (
                                            filteredPitches.length > 0 ? filteredPitches.map((p, idx) => (
                                                <button 
                                                    key={p.id}
                                                    onClick={() => {
                                                        // Gọi handleSelectField để tải dữ liệu và đồng bộ Index chính xác
                                                        if (p.field_id) {
                                                            handleSelectField(p.field_id, p.id);
                                                        }
                                                    }}
                                                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col gap-1 ${selectedPitchIndex === idx ? 'border-emerald-600 bg-emerald-50 shadow-md' : 'border-gray-50 bg-white hover:border-emerald-100'}`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-black text-gray-900 uppercase italic">{p.name}</span>
                                                        <Trophy size={14} className={selectedPitchIndex === idx ? 'text-emerald-600' : 'text-gray-200'} />
                                                    </div>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{p.facilityName || 'Cơ sở'}</span>
                                                </button>
                                            )) : (
                                                <div className="col-span-full py-4 text-xs font-bold text-gray-400 italic">Hiện không có sân {selectedCategory} nào trống...</div>
                                            )
                                        ) : (
                                            <div className="col-span-full py-4 text-xs font-bold text-gray-400 italic">Vui lòng chọn loại hình sân (Bước 1)</div>
                                        )
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 pl-2">Ngày đặt sân</label>
                                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-black text-xs outline-none focus:ring-2 focus:ring-emerald-100" />
                                </div>
                                <div>
                                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 pl-2">Thời lượng</label>
                                     <div className="flex gap-2">
                                         {[{val:'1h', hours:1}, {val:'1.5h', hours:1.5}, {val:'2h', hours:2}].map(({val, hours}) => {
                                             const isOverlap = hours > maxAvailableHours;
                                             return (
                                                 <div key={val} className="flex-1 relative group">
                                                     <button
                                                         disabled={isOverlap}
                                                         onClick={() => setDuration(val)}
                                                         className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase italic border transition-all ${
                                                             isOverlap
                                                                 ? 'bg-gray-100 border-gray-100 text-gray-300 cursor-not-allowed'
                                                                 : duration === val
                                                                     ? 'bg-emerald-100 border-emerald-300 text-emerald-800 shadow-sm cursor-pointer'
                                                                     : 'bg-white border-gray-50 text-gray-400 hover:border-emerald-200 cursor-pointer'
                                                         }`}
                                                     >
                                                         {val}
                                                         {isOverlap && <span className="block text-[8px] mt-0.5 font-black text-red-300 uppercase tracking-wider">Trùng lịch</span>}
                                                     </button>
                                                     {/* Tooltip cảnh báo */}
                                                     {isOverlap && startTime && (
                                                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 bg-gray-900 text-white text-[9px] font-bold rounded-xl px-3 py-2 text-center leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                                                             ⚠️ Có lịch đặt lúc {String(Math.floor(parseInt(startTime) + maxAvailableHours)).padStart(2,'0')}:00<br/>Chỉ còn trống {maxAvailableHours}h
                                                             <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                                                         </div>
                                                     )}
                                                 </div>
                                             );
                                         })}
                                     </div>
                                 </div>
                             </div>

                             <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4 pl-2">Chọn giờ bắt đầu</label>
                                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-2">
                                    {displayedTimeSlots.map(time => {
                                        const isBooked = filteredPitches[selectedPitchIndex]?.bookedSlots?.includes(time);
                                        return (
                                            <button 
                                                key={time} 
                                                disabled={isBooked}
                                                onClick={() => setStartTime(time)} 
                                                className={`py-3.5 rounded-xl font-black text-[10px] border transition-all cursor-pointer ${
                                                    isBooked ? 'bg-gray-100 border-gray-100 text-gray-200 cursor-not-allowed' :
                                                    startTime === time ? 'bg-emerald-800 border-emerald-800 text-white shadow-md' : 'bg-white border-gray-50 text-gray-400 hover:border-emerald-300'
                                                }`}
                                            >
                                                {time}
                                            </button>
                                        );
                                     })}
                                 </div>
                             </div>
                         </div>

                        {/* 2. THÔNG TIN NGƯỜI ĐẶT */}
                        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 text-left">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Thông tin người đặt</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={16} />
                                    <input type="text" placeholder="Họ và tên *" value={contactInfo.fullName} onChange={e => setContactInfo({...contactInfo, fullName: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-emerald-100 font-bold text-xs text-gray-700" />
                                </div>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={16} />
                                    <input type="text" placeholder="Số điện thoại *" value={contactInfo.phone} onChange={e => setContactInfo({...contactInfo, phone: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-emerald-100 font-bold text-xs text-gray-700" />
                                </div>
                            </div>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={16} />
                                <input type="email" placeholder="Gmail liên hệ *" value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-emerald-100 font-bold text-xs text-gray-700" />
                            </div>
                            <textarea placeholder="Ghi chú thêm..." rows={3} value={contactInfo.note} onChange={e => setContactInfo({...contactInfo, note: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-emerald-100 font-bold text-xs text-gray-700 resize-none" />
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR (1/3 width) */}
                    <div className="lg:w-1/3 w-full space-y-6 sticky top-12">
                        <div className="bg-emerald-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Zap size={100} fill="currentColor" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-sm font-black uppercase italic tracking-widest mb-6 pb-4 border-b border-white/10">Tóm tắt đơn hàng</h3>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-white/50">
                                        <span>Sân bóng</span>
                                        <span className="text-white italic">{filteredPitches[selectedPitchIndex]?.name || 'Chưa chọn'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-white/50">
                                        <span>Thời gian</span>
                                        <span className="text-white italic">{startTime || '??'} | {selectedDate.split('-').reverse().join('/')}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-white/50">
                                        <span>Thời lượng</span>
                                        <span className="text-white italic">{duration}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Tổng thanh toán</span>
                                        <div className="flex flex-col items-end">
                                            {startTime && parseInt(startTime.split(':')[0]) < 10 && (
                                                <span className="text-[9px] font-bold text-yellow-300 uppercase tracking-widest mb-1 italic animate-pulse">
                                                    🔥 Giảm 20% Early Bird
                                                </span>
                                            )}
                                            <span className="text-2xl font-black italic tracking-tighter text-yellow-400">{currentPrice.toLocaleString()}đ</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleConfirm} className="w-full py-5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 border-none cursor-pointer flex items-center justify-center gap-2 italic">
                                    <CheckCircle2 size={18} /> ĐẶT SÂN NGAY
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm text-left">
                             <div className="flex items-center gap-3 mb-2">
                                <ShieldCheck size={20} className="text-emerald-600" />
                                <h4 className="text-xs font-black text-gray-900 uppercase italic">Hỗ trợ 24/7</h4>
                             </div>
                             <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed">Nếu gặp khó khăn trong quá trình đặt sân, vui lòng gọi Hotline: <span className="text-emerald-600">0901000100</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <SuccessModal />
        </div>
    );
}
