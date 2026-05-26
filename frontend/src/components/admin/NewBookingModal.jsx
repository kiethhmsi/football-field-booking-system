import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Phone, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Search
} from 'lucide-react';

const NewBookingModal = ({ isOpen, onClose }) => {
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    fieldType: 'Sân 5',
    pitchId: '01',
    timeSlot: '',
    deposit: '500.000',
    notes: ''
  });

  // Fetch Fields on Mount
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/fields/admin/fields');
        const result = await response.json();
        if (response.ok && result.data.length > 0) {
          setFields(result.data);
          setSelectedField(result.data[0]); // Default to first complex
        }
      } catch (err) {}
    };
    if (isOpen) fetchFields();
  }, [isOpen]);

  // Fetch Availability when dependencies change
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedField) return;
      setLoadingSlots(true);
      try {
        const queryParams = new URLSearchParams({
            field_id: selectedField.id,
            date: formData.date,
            pitch_type: formData.fieldType
        }).toString();
        
        const response = await fetch(`http://localhost:3000/api/fields/admin/availability?${queryParams}`);
        const result = await response.json();
        if (response.ok) {
            // Map backend data to UI format
            const mappedSlots = result.data.map(slot => ({
                time: `${slot.start_time.substring(0, 5)} - ${slot.end_time.substring(0, 5)}`,
                price: `${Number(slot.price)/1000}k`,
                status: slot.status,
                raw: slot
            }));
            setTimeSlots(mappedSlots);
        }
      } catch (err) {
        console.error("Lỗi lấy khung giờ:", err);
      } finally {
        setLoadingSlots(false);
      }
    };

    if (isOpen && selectedField) fetchAvailability();
  }, [isOpen, selectedField, formData.date, formData.fieldType, formData.pitchId]);

  const fieldTypes = ['Sân 5', 'Sân 7', 'Sân 11'];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConfirm = () => {
    if (!formData.customerName || !formData.phone) {
      alert('Vui lòng nhập đầy đủ tên và số điện thoại khách hàng!');
      return;
    }
    if (!formData.timeSlot) {
      alert('Vui lòng chọn khung giờ đặt sân!');
      return;
    }

    setIsSubmitting(true);
    
    // Giả lập logic xử lý
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh]"
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col lg:flex-row w-full"
            >
              {/* Left Side: Form */}
              <div className="flex-1 p-8 lg:p-10 overflow-y-auto no-scrollbar border-r border-gray-100 text-left">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter leading-none">Đặt sân mới</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">Hệ thống quản lý sân bóng KaSport</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-transparent border-none cursor-pointer"
                  >
                    <X size={24} className="text-gray-400" />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Complex Section */}
                  <section>
                    <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">CHỌN CỤM SÂN</h3>
                    <select 
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none cursor-pointer"
                      value={selectedField?.id || ''}
                      onChange={(e) => {
                        const field = fields.find(f => f.id == e.target.value);
                        setSelectedField(field);
                      }}
                    >
                      {fields.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </section>

                  {/* Customer Section */}
                  <section>
                    <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">1. THÔNG TIN KHÁCH HÀNG</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <User size={18} />
                        </div>
                        <input 
                          type="text" 
                          placeholder="Tên khách hàng..."
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                          value={formData.customerName}
                          onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <Phone size={18} />
                        </div>
                        <input 
                          type="text" 
                          placeholder="Số điện thoại..."
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                  </section>

                  {/* Field & Date Section */}
                  <section>
                    <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">2. THỜI GIAN & LOẠI SÂN</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <CalendarIcon size={18} />
                        </div>
                        <input 
                          type="date" 
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                        />
                      </div>
                      <div className="flex bg-gray-50 rounded-2xl p-1">
                        {fieldTypes.map(type => (
                          <button
                            key={type}
                            onClick={() => setFormData({...formData, fieldType: type})}
                            className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all border-none cursor-pointer
                              ${formData.fieldType === type ? 'bg-white shadow-sm text-emerald-700' : 'text-gray-400 bg-transparent'}
                            `}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pitch Selection Grid */}
                    <div className="mb-6">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 italic">Chọn sân con (Danh sách 10 sân)</p>
                      <div className="grid grid-cols-5 gap-2">
                        {[...Array(10)].map((_, i) => {
                            const pId = (i + 1).toString().padStart(2, '0');
                            const isActive = formData.pitchId === pId;
                            return (
                                <button
                                    key={pId}
                                    onClick={() => setFormData({...formData, pitchId: pId})}
                                    className={`py-3 rounded-xl border-none font-black text-xs cursor-pointer transition-all
                                        ${isActive ? 'bg-[#059669] text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}
                                    `}
                                >
                                    {pId}
                                </button>
                            );
                        })}
                      </div>
                    </div>

                    {/* Time Slots Grid */}
                    <div className="relative min-h-[100px]">
                      {loadingSlots ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                          <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                        </div>
                      ) : timeSlots.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {timeSlots.map((slot, idx) => (
                            <button
                              key={idx}
                              disabled={slot.status === 'booked'}
                              onClick={() => {
                                setFormData({...formData, timeSlot: slot.time});
                                setSelectedSlot(slot);
                              }}
                              className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-1 cursor-pointer
                                ${slot.status === 'booked' ? 'bg-gray-50 border-gray-100 opacity-40 cursor-not-allowed' : 
                                  formData.timeSlot === slot.time ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-100 hover:border-emerald-200 bg-white'}
                              `}
                            >
                              <span className="text-[10px] font-black">{slot.time}</span>
                              <span className="text-[10px] font-bold text-gray-400">{slot.price}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 bg-gray-50 rounded-3xl">
                           <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Không có khung giờ nào khả dụng</p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Note Section */}
                  <section>
                    <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">GHI CHÚ (TÙY CHỌN)</h3>
                    <textarea 
                      placeholder="Ví dụ: Cần mượn thêm 2 set áo bít, lấy thêm 1 thùng nước..."
                      className="w-full p-6 bg-gray-50 border-none rounded-3xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 transition-all outline-none min-h-[100px]"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                  </section>
                </div>
              </div>

              {/* Right Side: Summary */}
              <div className="w-full lg:w-80 bg-slate-50 p-8 lg:p-10 flex flex-col text-left">
                <div className="flex-1">
                  <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-10 italic">TÓM TẮT ĐƠN HÀNG</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600 shrink-0">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Vị trí sân</p>
                        <p className="text-sm font-black text-gray-900 uppercase italic tracking-tight">{formData.fieldType} - SÂN {formData.pitchId}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600 shrink-0">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Thời gian</p>
                        <p className="text-sm font-black text-gray-900 uppercase italic tracking-tight">
                          {formData.timeSlot || 'Chưa chọn'}
                          <br />
                          <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Ngày {formData.date}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-dashed border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Tiền sân</span>
                      <span className="text-sm font-black text-gray-900">{selectedSlot ? Number(selectedSlot.raw.price).toLocaleString('vi-VN') + 'đ' : '0đ'}</span>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Cọc trước (50%)</span>
                      <span className="text-sm font-black text-emerald-600">{selectedSlot ? (Number(selectedSlot.raw.price) / 2).toLocaleString('vi-VN') + 'đ' : '0đ'}</span>
                    </div>
 
                    <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-900/20">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Tổng thanh toán</p>
                      <p className="text-3xl font-black italic tracking-tighter">{selectedSlot ? Number(selectedSlot.raw.price).toLocaleString('vi-VN') + 'đ' : '0đ'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 space-y-3">
                  <button 
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                    className={`w-full bg-[#059669] text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#047857] transition-all shadow-lg active:scale-[0.98] border-none cursor-pointer flex items-center justify-center gap-2
                      ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Đang xử lý...
                      </>
                    ) : 'Xác nhận & In hóa đơn'}
                  </button>
                  <button 
                    onClick={onClose}
                    className="w-full bg-white text-gray-400 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:text-gray-600 transition-all border-none cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full p-12 flex flex-col items-center text-center space-y-8"
            >
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-emerald-600 mb-4 ring-8 ring-green-50/50">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <CheckCircle2 size={64} />
                </motion.div>
              </div>

              <div>
                <h2 className="text-3xl font-black text-gray-900 italic uppercase tracking-tighter mb-2">Đặt sân thành công!</h2>
                <p className="text-sm font-medium text-gray-400">Yêu cầu đặt sân của khách hàng <span className="text-emerald-600 font-bold">{formData.customerName}</span> đã được ghi nhận tại KaSport.</p>
              </div>

              <div className="w-full max-w-sm bg-gray-50 rounded-3xl p-8 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-400 uppercase">Mã đơn hàng</span>
                  <span className="font-black text-gray-900">#BK-9021-88</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-400 uppercase">Khung giờ</span>
                  <span className="font-black text-gray-900 italic uppercase">{formData.timeSlot}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-400 uppercase">Trạng thái</span>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-black text-[10px] uppercase">Đã xác nhận</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md pt-4">
                <button 
                  onClick={() => {
                    setIsSuccess(false);
                    setFormData({
                        ...formData,
                        customerName: '',
                        phone: '',
                        timeSlot: ''
                    });
                  }}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all border-none cursor-pointer"
                >
                  Tiếp tục đặt sân
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 py-4 bg-[#059669] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:bg-[#047857] transition-all border-none cursor-pointer"
                >
                  Về Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default NewBookingModal;
