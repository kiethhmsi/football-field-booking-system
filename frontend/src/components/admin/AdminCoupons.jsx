import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket, 
  Plus, 
  Trash2, 
  X, 
  Calendar, 
  Percent, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  MoreVertical,
  Loader2
} from 'lucide-react';

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discount_type: 'percent',
        discount_value: '',
        max_discount: '',
        expiry_date: ''
    });

    const fetchCoupons = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/coupons', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (response.ok) setCoupons(result.data);
        } catch (error) {
            console.error('Lỗi lấy mã giảm giá:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newCoupon)
            });
            if (response.ok) {
                setShowAddModal(false);
                fetchCoupons();
                setNewCoupon({ code: '', discount_type: 'percent', discount_value: '', max_discount: '', expiry_date: '' });
            }
        } catch (error) {
            console.error('Lỗi tạo mã giảm giá:', error);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/coupons/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ is_active: !currentStatus })
            });
            if (response.ok) fetchCoupons();
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa mã giảm giá này?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/coupons/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) fetchCoupons();
        } catch (error) {
            console.error('Lỗi xóa mã giảm giá:', error);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="animate-spin text-[#059669]" /></div>;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10 pb-24 text-left">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Mã giảm giá</h1>
          <p className="text-slate-500 font-medium text-sm">Quản lý các chương trình khuyến mãi và mã giảm giá của hệ thống.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#059669] text-white px-8 py-4 rounded-2xl font-black text-[10px] flex items-center gap-2 shadow-xl shadow-emerald-100 hover:bg-[#047857] transition-all uppercase tracking-[0.1em] border-none cursor-pointer"
        >
          <Plus size={18} />
          Tạo mã mới
        </button>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2">Đang hoạt động</p>
            <h3 className="text-4xl font-black italic text-slate-900">{coupons.filter(c => c.is_active).length}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2">Đã hết hạn/Khóa</p>
            <h3 className="text-4xl font-black italic text-slate-900">{coupons.filter(c => !c.is_active).length}</h3>
        </div>
        <div className="bg-emerald-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl">
            <div className="absolute right-[-20px] top-[-20px] opacity-10"><Ticket size={120} /></div>
            <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest italic mb-2">Tổng số mã</p>
            <h3 className="text-4xl font-black italic">{coupons.length}</h3>
        </div>
      </section>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase font-black text-slate-300 tracking-[0.2em] border-b border-slate-50">
              <th className="px-10 py-6">Mã CODE</th>
              <th className="px-8 py-6">Loại giảm</th>
              <th className="px-8 py-6">Giá trị</th>
              <th className="px-8 py-6">Ngày hết hạn</th>
              <th className="px-8 py-6 text-center">Trạng thái</th>
              <th className="px-10 py-6 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-emerald-50/20 transition-colors group">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#059669]"><Ticket size={18} /></div>
                    <span className="text-base font-black text-emerald-700 tracking-widest italic">{coupon.code}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {coupon.discount_type === 'percent' ? 'Theo Phần trăm' : 'Số tiền cố định'}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <p className="text-sm font-black text-slate-800">
                    {coupon.discount_type === 'percent' ? `${coupon.discount_value}%` : `${coupon.discount_value.toLocaleString()}đ`}
                  </p>
                  {coupon.max_discount && <p className="text-[9px] text-slate-400 font-bold uppercase italic">Tối đa {coupon.max_discount.toLocaleString()}đ</p>}
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-2 text-slate-500 font-bold text-xs italic">
                      <Clock size={14} />
                      {new Date(coupon.expiry_date).toLocaleDateString('vi-VN')}
                   </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex justify-center">
                    <button 
                      onClick={() => handleToggleStatus(coupon.id, coupon.is_active)}
                      className={`w-10 h-5 rounded-full relative transition-all border-none cursor-pointer ${coupon.is_active ? 'bg-emerald-500' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${coupon.is_active ? 'left-[22px]' : 'left-0.5'}`} />
                    </button>
                  </div>
                </td>
                <td className="px-10 py-6 text-right">
                   <button onClick={() => handleDelete(coupon.id)} className="p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border-none bg-transparent cursor-pointer"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative z-10 text-left">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Mã giảm giá mới</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Tạo chương trình khuyến mãi mới</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 border-none cursor-pointer"><X size={20} /></button>
              </div>

              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Mã Code (VD: SUMMER20)</label>
                  <input required type="text" value={newCoupon.code} onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} placeholder="VD: NHAPMOI" className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold text-slate-700 uppercase tracking-widest" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Loại giảm giá</label>
                    <select value={newCoupon.discount_type} onChange={(e) => setNewCoupon({...newCoupon, discount_type: e.target.value})} className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold text-slate-700 cursor-pointer appearance-none">
                      <option value="percent">Phần trăm (%)</option>
                      <option value="fixed_amount">Số tiền cố định (đ)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Giá trị giảm</label>
                    <input required type="number" value={newCoupon.discount_value} onChange={(e) => setNewCoupon({...newCoupon, discount_value: e.target.value})} placeholder="VD: 10 hoặc 50000" className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold text-slate-700" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Giảm tối đa (đ)</label>
                    <input type="number" value={newCoupon.max_discount} onChange={(e) => setNewCoupon({...newCoupon, max_discount: e.target.value})} placeholder="Để trống nếu không giới hạn" className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold text-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Ngày hết hạn</label>
                    <input required type="date" value={newCoupon.expiry_date} onChange={(e) => setNewCoupon({...newCoupon, expiry_date: e.target.value})} className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold text-slate-700" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#059669] text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#047857] border-none cursor-pointer mt-4">Kích hoạt mã khuyến mãi</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminCoupons;
