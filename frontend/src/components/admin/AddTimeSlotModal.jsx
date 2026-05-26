import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Clock, 
  Wallet, 
  Info, 
  Plus,
  Loader2
} from 'lucide-react';

const AddTimeSlotModal = ({ isOpen, onClose, fieldId, pitchType, editingSlot, onSuccess }) => {
    const [formData, setFormData] = useState({
        start_time: '06:00',
        end_time: '08:00',
        weekday_price: '200000',
        weekend_price: '300000',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingSlot) {
            setFormData({
                start_time: editingSlot.start_time.substring(0, 5),
                end_time: editingSlot.end_time.substring(0, 5),
                weekday_price: editingSlot.weekday_price?.toString() || editingSlot.price?.toString() || '200000',
                weekend_price: editingSlot.weekend_price?.toString() || editingSlot.price?.toString() || '300000',
            });
        } else {
            setFormData({
                start_time: '06:00',
                end_time: '08:00',
                weekday_price: '200000',
                weekend_price: '300000',
            });
        }
    }, [editingSlot]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const basePayload = {
                field_id: fieldId,
                pitch_type: pitchType,
                start_time: formData.start_time,
                end_time: formData.end_time,
                is_active: 1,
                category: 'normal',
            };

            if (editingSlot) {
                // Khi sửa: cập nhật cả 2 records (weekday + weekend) dựa vào start/end time
                const res = await fetch(
                    `http://localhost:3000/api/fields/admin/time-slots/${editingSlot.id}`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({
                            ...basePayload,
                            weekday_price: parseInt(formData.weekday_price),
                            weekend_price: parseInt(formData.weekend_price),
                        })
                    }
                );
                if (!res.ok) throw new Error('Cập nhật thất bại');
            } else {
                // Khi thêm mới: tạo 2 records song song (weekday + weekend)
                const [resWeekday, resWeekend] = await Promise.all([
                    fetch('http://localhost:3000/api/fields/admin/time-slots', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({
                            ...basePayload,
                            day_type: 'weekday',
                            price: parseInt(formData.weekday_price),
                        })
                    }),
                    fetch('http://localhost:3000/api/fields/admin/time-slots', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({
                            ...basePayload,
                            day_type: 'weekend',
                            price: parseInt(formData.weekend_price),
                        })
                    })
                ]);
                if (!resWeekday.ok || !resWeekend.ok) throw new Error('Thêm thất bại');
            }

            alert(editingSlot ? 'Cập nhật thành công!' : 'Thêm khung giờ thành công!');
            onSuccess();
            onClose();
        } catch (err) {
            alert('Có lỗi xảy ra: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden p-10 text-left"
            >
                <button 
                  onClick={onClose} 
                  className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors border-none bg-transparent cursor-pointer"
                >
                    <X size={24} />
                </button>

                <div className="mb-10">
                    <h2 className="text-3xl font-black text-[#059669] mb-2 leading-none italic uppercase tracking-tighter">
                        {editingSlot ? 'Chỉnh sửa khung giờ' : 'Thêm khung giờ mới'}
                    </h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Thiết lập thời gian và giá cho {pitchType?.replace('_', ' ')}.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Thời gian */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-gray-900 tracking-wider">Giờ bắt đầu</label>
                            <div className="relative">
                                <input 
                                    type="time"
                                    value={formData.start_time}
                                    onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                                    className="w-full bg-indigo-50/50 border-none rounded-2xl p-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all"
                                    required
                                />
                                <Clock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#059669] pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-gray-900 tracking-wider">Giờ kết thúc</label>
                            <div className="relative">
                                <input 
                                    type="time"
                                    value={formData.end_time}
                                    onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                                    className="w-full bg-indigo-50/50 border-none rounded-2xl p-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all"
                                    required
                                />
                                <Clock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#059669] pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Giá */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-gray-900 tracking-wider">Giá ngày thường</label>
                            <p className="text-[10px] text-gray-400 font-bold -mt-1">Thứ 2 — Thứ 6</p>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#059669]">
                                    <Wallet size={18} />
                                </div>
                                <input 
                                    type="number"
                                    value={formData.weekday_price}
                                    onChange={(e) => setFormData({...formData, weekday_price: e.target.value})}
                                    className="w-full bg-indigo-50/50 border-none rounded-2xl p-4 pl-12 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all"
                                    placeholder="VD: 200000"
                                    required
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase tracking-tighter">đ/h</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-orange-500 tracking-wider">Giá cuối tuần</label>
                            <p className="text-[10px] text-gray-400 font-bold -mt-1">Thứ 7 — Chủ nhật</p>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
                                    <Wallet size={18} />
                                </div>
                                <input 
                                    type="number"
                                    value={formData.weekend_price}
                                    onChange={(e) => setFormData({...formData, weekend_price: e.target.value})}
                                    className="w-full bg-orange-50/50 border-none rounded-2xl p-4 pl-12 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-orange-300/30 focus:outline-none transition-all"
                                    placeholder="VD: 300000"
                                    required
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase tracking-tighter">đ/h</span>
                            </div>
                        </div>
                    </div>

                    {/* Tip box */}
                    <div className="bg-green-50/50 border border-green-100 rounded-3xl p-5 mb-10 flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-[#059669] shrink-0">
                            <Info size={16} />
                        </div>
                        <p className="text-[11px] text-gray-600 leading-relaxed font-bold uppercase tracking-tight">
                            <span className="text-[#059669]">Lưu ý:</span> Hệ thống sẽ tự động áp dụng đúng giá theo ngày trong tuần. Giá cuối tuần thường cao hơn <span className="text-orange-500">20–50%</span> so với ngày thường.
                        </p>
                    </div>

                    <div className="flex items-center justify-end gap-10">
                        <button 
                          type="button"
                          onClick={onClose} 
                          className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-700 transition-colors border-none bg-transparent cursor-pointer"
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="bg-[#059669] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-900/10 hover:bg-[#047857] transition-all flex items-center gap-2 border-none cursor-pointer disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingSlot ? 'CẬP NHẬT' : 'XÁC NHẬN THÊM')} 
                            {!loading && <Plus size={16} />}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddTimeSlotModal;
