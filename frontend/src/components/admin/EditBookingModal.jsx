import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Phone, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Save,
  FileText,
  Loader2,
  Trophy,
  AlertCircle
} from 'lucide-react';
import { PITCH_PRICING } from '../../constants/fields';

const EditBookingModal = ({ isOpen, onClose, booking, onUpdate }) => {
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [pitches, setPitches] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasChanged, setHasChanged] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    date: '',
    fieldType: 'Sân 5',
    pitchId: '',
    pitchName: '',
    timeSlot: '',
    deposit: 0,
    totalPrice: 0,
    status: 'pending',
    notes: ''
  });

  const [duration, setDuration] = useState('1.5h');
  const [selectedPitchId, setSelectedPitchId] = useState('');

  const timeSlots = [
    "05:00", "06:00", "07:00", "08:00", "09:00", "10:00",
    "11:00", "12:00", "13:00", "14:00", "15:00", "16:00",
    "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
  ];

  const typeMapping = {
    '5_nguoi': 'Sân 5',
    '7_nguoi': 'Sân 7',
    '11_nguoi': 'Sân 11',
    'Sân 5': 'Sân 5',
    'Sân 7': 'Sân 7',
    'Sân 11': 'Sân 11'
  };

  // 1. Fetch all fields
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/fields/admin/fields');
        const result = await response.json();
        if (response.ok) {
          setFields(result.data);
          if (booking) {
             const field = result.data.find(f => f.id === booking.field_id);
             setSelectedField(field);
          }
        }
      } catch (err) {
        console.error('Error fetching fields:', err);
      }
    };
    if (isOpen) fetchFields();
  }, [isOpen, booking]);

  // 2. Initialize form data
  useEffect(() => {
    if (booking && isOpen) {
        const start = booking.start_time.substring(0, 5);
        const end = booking.end_time.substring(0, 5);
        
        const [sH, sM] = start.split(':').map(Number);
        const [eH, eM] = end.split(':').map(Number);
        const diffMin = (eH * 60 + eM) - (sH * 60 + sM);
        const durStr = diffMin === 60 ? '1h' : diffMin === 90 ? '1.5h' : '2h';

        setFormData({
            customerName: booking.customer_name || '',
            phone: booking.customer_phone || '',
            date: booking.booking_date ? new Date(booking.booking_date).toISOString().split('T')[0] : '',
            fieldType: typeMapping[booking.pitch_type] || 'Sân 5',
            pitchId: booking.pitch_id || '',
            pitchName: booking.pitch_name || `Sân ${booking.pitch_id}`,
            timeSlot: start,
            deposit: booking.deposit_amount || 0,
            totalPrice: booking.total_price || 0,
            status: booking.status || 'pending',
            notes: booking.notes || ''
        });
        setDuration(durStr);
        setSelectedPitchId(booking.pitch_id);
        setHasChanged(false); // Crucial: Reset tracker
    }
  }, [booking, isOpen]);

  // 3. Fetch pitches and booked slots
  useEffect(() => {
    const fetchFieldDetails = async () => {
      if (!selectedField) return;
      try {
        const res = await fetch(`http://localhost:3000/api/fields/${selectedField.id}?date=${formData.date}`);
        const result = await res.json();
        if (result.data) {
          const typeLabel = formData.fieldType; 
          const filtered = result.data.pitches.filter(p => {
            const pType = p.type === '5_nguoi' ? 'Sân 5' : p.type === '7_nguoi' ? 'Sân 7' : 'Sân 11';
            return pType === typeLabel;
          });
          setPitches(filtered);
          
          const currentPitch = filtered.find(p => p.id == selectedPitchId);
          if (currentPitch) {
            setBookedSlots(currentPitch.bookedSlots || []);
          } else {
            setBookedSlots([]);
          }
        }
      } catch (err) {
        console.error('Error fetching field details:', err);
      }
    };
    if (isOpen && selectedField) fetchFieldDetails();
  }, [isOpen, selectedField, formData.date, formData.fieldType, selectedPitchId]);

  // 4. Auto-calculate price
  useEffect(() => {
    if (!isOpen || !formData.fieldType || !formData.date || !formData.timeSlot || !hasChanged) return;
    
    const category = formData.fieldType;
    const pricing = PITCH_PRICING[category];
    if (!pricing) return;

    const dayOfWeek = new Date(formData.date).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const hour = parseInt(formData.timeSlot.split(':')[0]);
    const period = hour >= 16 ? 'night' : 'day';
    
    const basePrice = isWeekend ? pricing[period].weekend : pricing[period].weekday;
    const multiplier = duration === '1h' ? 1 : duration === '1.5h' ? 1.5 : 2;
    const calculated = basePrice * multiplier;

    setFormData(prev => ({ 
        ...prev, 
        totalPrice: calculated,
        deposit: Math.floor(calculated * 0.5)
    }));
  }, [formData.fieldType, formData.date, formData.timeSlot, duration, isOpen, hasChanged]);

  const handleUpdate = async () => {
    try {
        setLoading(true);
        setError(null);

        const calculateEndTime = (start, dur) => {
            const [h, m] = start.split(':').map(Number);
            const durNum = dur === '1h' ? 1 : dur === '1.5h' ? 1.5 : 2;
            const totalMinutes = h * 60 + m + durNum * 60;
            const endH = Math.floor(totalMinutes / 60) % 24;
            const endM = totalMinutes % 60;
            return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`;
        };

        const updateData = {
            customer_name: formData.customerName,
            customer_phone: formData.phone,
            booking_date: formData.date,
            pitch_id: selectedPitchId,
            start_time: formData.timeSlot + ':00',
            end_time: calculateEndTime(formData.timeSlot, duration),
            total_price: formData.totalPrice,
            deposit_amount: formData.deposit,
            status: formData.status,
            notes: formData.notes
        };

        const response = await fetch(`http://localhost:3000/api/admin/bookings/${booking.id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(updateData)
        });

        if (response.ok) {
            onUpdate();
            onClose();
        } else {
            const res = await response.json();
            setError(res.message || 'Lỗi cập nhật dữ liệu');
        }
    } catch (error) {
        setError('Lỗi kết nối server');
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh]"
      >
        <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar border-r border-slate-100 text-left">
          <header className="mb-10 flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Chỉnh sửa đơn đặt sân</h2>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mt-1">Mã đơn: {booking.booking_code}</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all border-none cursor-pointer"><X size={20} /></button>
          </header>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold flex items-center gap-2">
               <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="space-y-8">
            <section>
              <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">Thông tin khách hàng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={16} />
                  <input type="text" placeholder="Tên khách hàng..." className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} />
                </div>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={16} />
                  <input type="text" placeholder="Số điện thoại..." className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">Thông tin sân & Thời gian</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <select className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none cursor-pointer" value={selectedField?.id || ''} onChange={(e) => { setSelectedField(fields.find(f => f.id == e.target.value)); setHasChanged(true); }}>
                  {fields.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><CalendarIcon size={18} /></div>
                    <input type="date" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" value={formData.date} onChange={(e) => { setFormData({...formData, date: e.target.value}); setHasChanged(true); }} />
                </div>
              </div>

              <div className="flex bg-slate-100 rounded-2xl p-1 mb-6">
                {['Sân 5', 'Sân 7', 'Sân 11'].map(type => (
                  <button key={type} onClick={() => { setFormData({...formData, fieldType: type}); setHasChanged(true); }} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all border-none cursor-pointer ${formData.fieldType === type ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-400 bg-transparent'}`}>{type}</button>
                ))}
              </div>

              <div className="mb-8">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 italic pl-2">Chọn sân con ({pitches.length} sân đang hoạt động)</p>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {pitches.map((p, i) => {
                        const isActive = selectedPitchId == p.id;
                        return (
                            <button key={p.id} onClick={() => { setSelectedPitchId(p.id); setFormData({...formData, pitchId: p.id, pitchName: p.name}); setHasChanged(true); }} className={`py-4 rounded-xl border-none font-black text-xs cursor-pointer transition-all ${isActive ? 'bg-[#059669] text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                                {(i + 1).toString().padStart(2, '0')}
                            </button>
                        );
                    })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 pl-2">Thời lượng</label>
                  <div className="flex gap-2">
                    {['1h', '1.5h', '2h'].map(dur => (
                        <button key={dur} onClick={() => { setDuration(dur); setHasChanged(true); }} className={`flex-1 py-4 rounded-2xl font-black text-[11px] uppercase italic border-2 transition-all cursor-pointer ${duration === dur ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-white border-slate-50 text-slate-300'}`}>{dur}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 pl-2">Chọn giờ bắt đầu</label>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-2">
                    {timeSlots.map(time => {
                        const isBooked = bookedSlots.includes(time) && time !== booking.start_time.substring(0, 5);
                        const isActive = formData.timeSlot === time;
                        return (
                            <button key={time} disabled={isBooked} onClick={() => { setFormData({...formData, timeSlot: time}); setHasChanged(true); }} className={`py-3.5 rounded-xl font-black text-[10px] border-2 transition-all cursor-pointer ${isBooked ? 'bg-slate-50 border-slate-50 text-slate-200 cursor-not-allowed opacity-30' : isActive ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-50 text-slate-400 hover:border-emerald-100'}`}>{time}</button>
                        );
                    })}
                </div>
              </div>
            </section>

            <section>
                <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">Ghi chú quản trị</h3>
                <div className="relative">
                    <FileText className="absolute left-4 top-4 text-slate-300" size={18} />
                    <textarea className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 min-h-[100px] resize-none" placeholder="Nhập ghi chú thay đổi..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
                </div>
            </section>
          </div>
        </div>

        <div className="w-full md:w-[380px] bg-slate-50 p-8 md:p-12 flex flex-col justify-between text-left">
          <div className="space-y-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic mb-10">TÓM TẮT THAY ĐỔI</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600"><MapPin size={20} /></div>
                  <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sân con</p>
                      <p className="text-sm font-black text-slate-900 uppercase italic">{formData.pitchName} ({formData.fieldType})</p>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600"><Clock size={20} /></div>
                  <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Khung giờ</p>
                      <p className="text-sm font-black text-slate-900 uppercase italic">{formData.timeSlot || '??'} - {duration}</p>
                      <p className="text-[9px] font-bold text-emerald-600">Ngày {formData.date}</p>
                  </div>
              </div>

              <div className="pt-6 border-t border-dashed border-slate-200 space-y-4">
                  <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tiền cọc (VNĐ)</span>
                      <input type="number" className="w-32 bg-white border-none rounded-lg p-2 text-right text-sm font-black text-slate-900 outline-none" value={formData.deposit} onChange={(e) => setFormData({...formData, deposit: parseInt(e.target.value) || 0})} />
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng cộng</p>
                      <input type="number" className="w-full bg-transparent border-none p-0 text-3xl font-black italic text-[#059669] tracking-tighter outline-none" value={formData.totalPrice} onChange={(e) => setFormData({...formData, totalPrice: parseInt(e.target.value) || 0})} />
                  </div>
              </div>

              <div className="pt-6 border-t border-dashed border-slate-200">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-3 pl-2 tracking-widest">Trạng thái mới</p>
                  <select className="w-full bg-white border-none rounded-2xl p-4 text-xs font-black uppercase italic text-slate-900 outline-none shadow-sm cursor-pointer" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                      <option value="pending">Chờ xác nhận</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="paid">Đã thanh toán</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                  </select>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-3">
            <button onClick={handleUpdate} disabled={loading} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/10 hover:bg-emerald-700 transition-all active:scale-95 border-none cursor-pointer flex items-center justify-center gap-2 italic">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} LƯU THAY ĐỔI
            </button>
            <button onClick={onClose} className="w-full py-5 bg-white text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-rose-500 transition-all border-none cursor-pointer italic">HỦY BỎ</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditBookingModal;
