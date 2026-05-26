import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AddTimeSlotModal from './AddTimeSlotModal';
import { 
  Clock, 
  Plus, 
  ChevronRight, 
  Edit2, 
  Trash2, 
  LayoutDashboard, 
  HelpCircle,
  Loader2
} from 'lucide-react';

// --- Shared Components ---
const Toggle = ({ active, onToggle }) => (
  <button 
    type="button"
    onClick={() => onToggle()}
    className={`w-12 h-6 rounded-full p-1 transition-all duration-300 border-none cursor-pointer relative z-[30] flex items-center ${active ? 'bg-[#059669]' : 'bg-slate-300'}`}
  >
    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 transform ${active ? 'translate-x-6' : 'translate-x-0'}`}></div>
  </button>
);

const FieldCard = ({ field, active, onSelect }) => (
  <button 
    onClick={onSelect}
    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${active ? 'bg-[#059669] border-[#059669] text-white shadow-lg' : 'bg-white border-slate-100 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50'} cursor-pointer`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${active ? 'bg-white/10' : 'bg-slate-50'}`}>
        <LayoutDashboard className="w-4 h-4" />
      </div>
      <div className="text-left">
        <p className="font-bold text-sm tracking-tight">{field.name}</p>
        <p className={`text-[10px] ${active ? 'text-emerald-200 font-bold' : 'text-slate-400 uppercase'}`}>ID: {field.id}</p>
      </div>
    </div>
    {active && <ChevronRight className="w-4 h-4" />}
  </button>
);

// Gom nhóm các slot theo start_time+end_time, trả về mảng { timeKey, weekday, weekend }
const groupSlotsByTime = (slots) => {
  const map = {};
  slots.forEach(s => {
    const key = `${s.start_time.substring(0,5)}_${s.end_time.substring(0,5)}`;
    if (!map[key]) map[key] = { timeKey: key, weekday: null, weekend: null };
    if (s.day_type === 'weekday') map[key].weekday = s;
    else if (s.day_type === 'weekend') map[key].weekend = s;
  });
  return Object.values(map).sort((a, b) => {
    const aTime = (a.weekday || a.weekend)?.start_time || '';
    const bTime = (b.weekday || b.weekend)?.start_time || '';
    return aTime.localeCompare(bTime);
  });
};

const TimeSlotGroupItem = ({ group, onToggle, onDelete, onEdit }) => {
  const { weekday, weekend } = group;
  const representative = weekday || weekend;
  if (!representative) return null;

  const isActive = representative.is_active;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-100 rounded-2xl p-6 grid grid-cols-[50px_1fr_1fr_1fr_140px_80px] gap-6 items-center shadow-sm hover:shadow-md transition-all text-left"
    >
      {/* Icon */}
      <div className={`p-3 rounded-2xl flex items-center justify-center transition-colors w-12 h-12 box-border ${isActive ? 'bg-emerald-50 text-[#059669]' : 'bg-slate-50 text-slate-300'}`}>
        <Clock className="w-6 h-6" />
      </div>

      {/* Thời gian */}
      <div>
        <p className="text-xl font-black text-slate-800 tracking-tighter">
          {representative.start_time.substring(0, 5)} – {representative.end_time.substring(0, 5)}
        </p>
      </div>

      {/* Giá ngày thường */}
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ngày thường</p>
        <p className="text-xl font-black text-[#059669] tracking-tight">
          {weekday ? Number(weekday.price).toLocaleString() + 'đ' : '—'}
        </p>
      </div>

      {/* Giá cuối tuần */}
      <div>
        <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Cuối tuần</p>
        <p className="text-xl font-black text-orange-500 tracking-tight">
          {weekend ? Number(weekend.price).toLocaleString() + 'đ' : '—'}
        </p>
      </div>

      {/* Toggle */}
      <div className="flex items-center gap-3 relative z-10">
        <Toggle active={isActive} onToggle={() => {
          if (weekday) onToggle(weekday);
          if (weekend) onToggle(weekend);
        }} />
        <span className={`text-xs font-bold ${isActive ? 'text-emerald-700' : 'text-slate-400'}`}>
          {isActive ? 'Đang bật' : 'Đang tắt'}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pr-2">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onEdit(representative, weekday, weekend); }}
          className="p-2 text-slate-400 hover:text-[#059669] hover:bg-emerald-50 rounded-lg transition-all border-none bg-transparent cursor-pointer"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (weekday) onDelete(weekday.id);
            if (weekend && weekend.id !== weekday?.id) onDelete(weekend.id);
          }}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border-none bg-transparent cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

const TimeSlotItem = ({ slot, onToggle, onDelete, onEdit }) => {
  const categoryStyles = {
    'normal': 'bg-blue-50 text-blue-700 border-blue-100',
    'peak': 'bg-orange-50 text-orange-700 border-orange-100',
    'off_peak': 'bg-slate-100 text-slate-500 border-slate-200',
  };

  const categoryLabels = {
    'normal': 'Bình thường',
    'peak': 'Giờ cao điểm',
    'off_peak': 'Nghỉ trưa',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-100 rounded-2xl p-6 grid grid-cols-[50px_120px_160px_1fr_140px_80px] gap-6 items-center shadow-sm hover:shadow-md transition-all text-left"
    >
      <div className={`p-3 rounded-2xl flex items-center justify-center transition-colors w-12 h-12 box-border ${slot.is_active ? 'bg-emerald-50 text-[#059669]' : 'bg-slate-50 text-slate-300'}`}>
        <Clock className="w-6 h-6" />
      </div>
      
      <div>
        <p className="text-xl font-black text-slate-800 tracking-tighter">
          {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
        </p>
      </div>

      <div className="flex flex-col gap-1 items-start">
        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${categoryStyles[slot.category]}`}>
          {categoryLabels[slot.category]}
        </span>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight ml-1">
          {slot.day_type === 'weekday' ? 'Ngày thường' : slot.day_type === 'weekend' ? 'Cuối tuần' : 'Ngày lễ'}
        </span>
      </div>

      <div>
        <p className="text-xl font-black text-[#059669] tracking-tight">
          {Number(slot.price).toLocaleString()}đ
        </p>
      </div>

      <div className="flex items-center gap-3 relative z-10">
        <Toggle active={slot.is_active} onToggle={() => onToggle(slot)} />
        <span className={`text-xs font-bold ${slot.is_active ? 'text-emerald-700' : 'text-slate-400'}`}>
          {slot.is_active ? 'Đang bật' : 'Đang tắt'}
        </span>
      </div>

      <div className="flex items-center justify-end gap-2 pr-2">
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); onEdit(slot); }}
          className="p-2 text-slate-400 hover:text-[#059669] hover:bg-emerald-50 rounded-lg transition-all border-none bg-transparent cursor-pointer"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(slot.id); }}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border-none bg-transparent cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Pixel cố định: 36px/giờ → 19 tiếng (05:00→24:00) = 684px
const PX_PER_HOUR = 36;
const CALENDAR_START_HOUR = 5;
const CALENDAR_END_HOUR = 24;
const CALENDAR_HEIGHT = (CALENDAR_END_HOUR - CALENDAR_START_HOUR) * PX_PER_HOUR; // 684px

const WeeklyCalendar = ({ timeSlots, bookings = [], selectedField, pitchType }) => {
  const [currentWeek, setCurrentWeek] = useState([]);

  useEffect(() => {
    const today = new Date();
    const week = [];
    const first = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1);
    for (let i = 0; i < 7; i++) {
      const day = new Date(today.getFullYear(), today.getMonth(), first + i);
      const year = day.getFullYear();
      const month = String(day.getMonth() + 1).padStart(2, '0');
      const dateVal = String(day.getDate()).padStart(2, '0');
      week.push({
        name: day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        date: day.getDate().toString(),
        fullDate: `${year}-${month}-${dateVal}`,
        isWeekend: day.getDay() === 0 || day.getDay() === 6
      });
    }
    setCurrentWeek(week);
  }, []);

  const weekdaySlots = timeSlots.filter(s => s.day_type === 'weekday' && s.is_active);
  const weekendSlots = timeSlots.filter(s => s.day_type === 'weekend' && s.is_active);

  // Trục giờ: mỗi tiếng từ 05:00 → 24:00
  const displayHours = Array.from({ length: 20 }, (_, i) => i + 5); // [5,6,7,...,24]

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm text-left">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 text-lg italic uppercase tracking-tighter">Lịch khung giờ mẫu trong tuần</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hiển thị các khung giờ đang hoạt động (Active) & Trạng thái đặt sân thực tế</p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#059669] rounded-lg shadow-sm"></div>
            <span>Khung giờ Hoạt động</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-rose-600 rounded-lg shadow-[0_0_8px_rgba(225,29,72,0.3)] animate-pulse"></div>
            <span className="text-rose-600 font-extrabold">Đã Được Đặt Sân</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[56px_1fr] gap-2">
        {/* Trục thời gian — dùng absolute pixel để khớp chính xác với các block */}
        <div className="relative" style={{ height: `${CALENDAR_HEIGHT + 96}px` }}>
          <div className="absolute top-24 left-0 right-0">
            {displayHours.map(h => (
              <div
                key={h}
                className="absolute w-full flex items-center"
                style={{ top: `${(h - CALENDAR_START_HOUR) * PX_PER_HOUR}px` }}
              >
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter leading-none">
                  {String(h === 24 ? '00' : h).padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lưới 7 ngày */}
        <div className="grid grid-cols-7 gap-2">
          {currentWeek.map((day) => {
            const daySlots = day.isWeekend ? weekendSlots : weekdaySlots;
            return (
              <div key={day.fullDate}>
                {/* Header ngày */}
                <div className="text-center h-24 flex flex-col items-center justify-center border-b border-slate-50 mb-0">
                  <p className={`text-[10px] font-black mb-0.5 ${day.isWeekend ? 'text-orange-400' : 'text-slate-300'}`}>{day.name}</p>
                  <p className={`text-2xl font-black ${day.isWeekend ? 'text-orange-500' : 'text-slate-800'}`}>{day.date}</p>
                </div>

                {/* Vùng chứa block khung giờ — chiều cao khớp đúng 684px */}
                <div
                  className="relative bg-slate-50/30 rounded-xl border border-dashed border-slate-100"
                  style={{ height: `${CALENDAR_HEIGHT}px` }}
                >
                  {/* Đường kẻ ngang tham chiếu mỗi 2h */}
                  {displayHours.map(h => (
                    <div
                      key={h}
                      className="absolute left-0 right-0 border-t border-slate-100/60"
                      style={{ top: `${(h - CALENDAR_START_HOUR) * PX_PER_HOUR}px` }}
                    />
                  ))}

                  {daySlots.map(slot => {
                    const startH = parseInt(slot.start_time.split(':')[0]);
                    const startM = parseInt(slot.start_time.split(':')[1] || '0');
                    const endH   = parseInt(slot.end_time.split(':')[0]);
                    const endM   = parseInt(slot.end_time.split(':')[1] || '0');

                    // Pixel tuyệt đối: 36px/giờ
                    const topPx    = (startH - CALENDAR_START_HOUR) * PX_PER_HOUR + startM * (PX_PER_HOUR / 60);
                    const heightPx = (endH * 60 + endM - (startH * 60 + startM)) * (PX_PER_HOUR / 60);

                    const matchedBooking = bookings.find(b => {
                      if (b.status === 'cancelled') return false;
                      if (Number(b.field_id) !== Number(selectedField?.id)) return false;
                      if (b.pitch_type !== pitchType) return false;
                      const bDate = b.booking_date ? b.booking_date.split('T')[0] : '';
                      if (bDate !== day.fullDate) return false;
                      return b.start_time.substring(0, 5) === slot.start_time.substring(0, 5);
                    });

                    return (
                      <div
                        key={slot.id}
                        className={`absolute left-1 right-1 rounded-lg flex flex-col justify-center items-center overflow-hidden border transition-all hover:brightness-110 cursor-default ${
                          matchedBooking
                            ? 'bg-gradient-to-br from-rose-500 to-rose-700 border-rose-400 text-white shadow-[0_4px_12px_rgba(225,29,72,0.3)]'
                            : 'bg-[#059669] border-emerald-600 text-white shadow-sm'
                        }`}
                        style={{
                          top: `${topPx}px`,
                          height: `${Math.max(heightPx - 4, 20)}px`,
                        }}
                      >
                        <span className="text-[8px] font-black leading-tight opacity-80">
                          {slot.start_time.substring(0, 5)}–{slot.end_time.substring(0, 5) === '24:00' ? '24:00' : slot.end_time.substring(0, 5)}
                        </span>
                        {heightPx > 40 && (
                          <span className="text-[10px] font-black tracking-tight mt-0.5 truncate w-full text-center px-1">
                            {matchedBooking
                              ? (matchedBooking.team_name || matchedBooking.customer_name || 'Đã đặt')
                              : `${(slot.price / 1000).toLocaleString()}k`}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AdminTimeSlots = () => {
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddTimeSlotModalOpen, setIsAddTimeSlotModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [pitchType, setPitchType] = useState('5_nguoi'); // Default to Sân 5

  useEffect(() => {
    fetchFields();
    fetchBookings();
  }, []);

  useEffect(() => {
    if (selectedField) {
      fetchTimeSlots(selectedField.id, pitchType);
      fetchBookings();
    }
  }, [selectedField, pitchType]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/bookings/admin/all?limit=1000', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (response.ok) {
        setBookings(result.data || []);
      }
    } catch (err) {
      console.error('Không thể tải danh sách đặt sân', err);
    }
  };

  const fetchFields = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/fields/admin/fields');
      const result = await response.json();
      if (response.ok) {
        setFields(result.data);
        if (result.data.length > 0) setSelectedField(result.data[0]);
      }
    } catch (err) {
      console.error('Không thể tải danh sách sân');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeSlots = async (fieldId, type) => {
    try {
      const response = await fetch(`http://localhost:3000/api/fields/admin/time-slots/${fieldId}?pitchType=${type}`);
      const result = await response.json();
      if (response.ok) {
        setTimeSlots(result.data);
      }
    } catch (err) {
      console.error('Không thể tải khung giờ');
    }
  };

  const handleToggleStatus = async (slot) => {
    try {
      const token = localStorage.getItem('token');
      const currentStatus = Number(slot.is_active);
      const newStatus = currentStatus === 1 ? 0 : 1;

      const response = await fetch(`http://localhost:3000/api/fields/admin/time-slots/${slot.id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_active: newStatus })
      });
      if (response.ok) {
        // Cập nhật state local ngay lập tức để người dùng thấy thay đổi
        setTimeSlots(prev => prev.map(s => s.id === slot.id ? { ...s, is_active: newStatus } : s));
      } else {
        alert('Có lỗi xảy ra khi cập nhật trạng thái');
      }
    } catch (err) {
      alert('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleDeleteSlot = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa khung giờ này?')) return;
    try {
      const response = await fetch(`http://localhost:3000/api/fields/admin/time-slots/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert('Xóa khung giờ thành công!');
        fetchTimeSlots(selectedField.id, pitchType);
      }
    } catch (err) {
      alert('Lỗi khi xóa khung giờ');
    }
  };

  const handleEditSlot = (slot) => {
    setEditingSlot(slot);
    setIsAddTimeSlotModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#059669]" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-12 pb-24"
    >
      <header className="flex justify-between items-end pb-4 border-b border-gray-100">
        <div className="space-y-1 text-left">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Quản lý khung giờ</h2>
          <p className="text-slate-500 text-sm font-medium">Cấu hình thời gian hoạt động và giá linh hoạt cho từng sân.</p>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => {
              setEditingSlot(null);
              setIsAddTimeSlotModalOpen(true);
            }}
            className="bg-[#059669] hover:bg-[#047857] text-white font-black px-6 py-4 rounded-2xl flex items-center gap-2 transition-all shadow-lg active:scale-[0.98] text-sm uppercase tracking-wider border-none cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm khung giờ mới</span>
          </button>
        </div>
      </header>

      <div className="space-y-10">
        {/* Main Content */}
        <div className="space-y-10">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm relative overflow-hidden text-left">
            <div className="flex justify-between items-start mb-10">
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter max-w-sm leading-tight text-balance uppercase italic">
                  Cấu hình bảng giá: {selectedField?.name || 'KaSport Complex'}
                </h3>
                <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm"></div>
                    <span className="text-slate-400 font-black">Ngày thường (Thứ 2 - Thứ 6)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full shadow-sm"></div>
                    <span className="text-slate-400 font-black">Cuối tuần (Thứ 7 - Chủ nhật)</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-1.5 rounded-2xl flex gap-1 border border-slate-100 relative z-30">
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setPitchType('5_nguoi'); }}
                  className={`px-6 py-2.5 font-bold text-[10px] rounded-xl shadow-sm uppercase tracking-widest border-none cursor-pointer transition-all relative z-10 ${pitchType === '5_nguoi' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-400 bg-transparent'}`}
                >
                  Sân 5
                </button>
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setPitchType('7_nguoi'); }}
                  className={`px-6 py-2.5 font-bold text-[10px] rounded-xl uppercase tracking-widest border-none cursor-pointer transition-all relative z-10 ${pitchType === '7_nguoi' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-400 bg-transparent'}`}
                >
                  Sân 7
                </button>
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setPitchType('11_nguoi'); }}
                  className={`px-6 py-2.5 font-bold text-[10px] rounded-xl uppercase tracking-widest border-none cursor-pointer transition-all relative z-10 ${pitchType === '11_nguoi' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-400 bg-transparent'}`}
                >
                  Sân 11
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-[50px_1fr_1fr_1fr_140px_80px] gap-6 px-6 text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">
                <div></div>
                <div>Khung giờ</div>
                <div>Giá ngày thường</div>
                <div>Giá cuối tuần</div>
                <div>Trạng thái</div>
                <div className="text-right pr-2">Thao tác</div>
              </div>
              {timeSlots.length > 0 ? (
                groupSlotsByTime(timeSlots).map(group => (
                  <TimeSlotGroupItem
                    key={group.timeKey}
                    group={group}
                    onToggle={handleToggleStatus}
                    onDelete={handleDeleteSlot}
                    onEdit={(rep, wd, we) => {
                      setEditingSlot({ ...rep, weekday_price: wd?.price, weekend_price: we?.price });
                      setIsAddTimeSlotModalOpen(true);
                    }}
                  />
                ))
              ) : (
                <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                  <Clock className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Chưa có khung giờ nào được thiết lập</p>
                </div>
              )}
            </div>
          </div>

          <WeeklyCalendar timeSlots={timeSlots} bookings={bookings} selectedField={selectedField} pitchType={pitchType} />
        </div>
      </div>

      <AnimatePresence>
        {isAddTimeSlotModalOpen && (
          <AddTimeSlotModal 
            isOpen={isAddTimeSlotModalOpen} 
            onClose={() => {
              setIsAddTimeSlotModalOpen(false);
              setEditingSlot(null);
            }} 
            fieldId={selectedField?.id}
            pitchType={pitchType}
            editingSlot={editingSlot}
            onSuccess={() => fetchTimeSlots(selectedField.id, pitchType)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminTimeSlots;
