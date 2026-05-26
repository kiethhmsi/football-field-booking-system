import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Timer, 
  MoreVertical, 
  Trash2, 
  Loader2, 
  X,
  Settings,
  HelpCircle,
  LayoutDashboard,
  DollarSign,
  Info
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const config = {
    'completed': { color: 'text-green-600 bg-green-50 border-green-200', label: 'Hoàn thành', icon: <CheckCircle2 size={12} /> },
    'pending': { color: 'text-amber-600 bg-amber-50 border-amber-200', label: 'Sắp tới', icon: <Calendar size={12} /> },
    'in_progress': { color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'Đang thực hiện', icon: <Timer size={12} /> },
    'cancelled': { color: 'text-slate-400 bg-slate-50 border-slate-200', label: 'Đã hủy', icon: <X size={12} /> },
  };
  const { color, label, icon } = config[status] || config['pending'];
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${color} border shadow-sm whitespace-nowrap`}>
      {icon}
      {label}
    </div>
  );
};

const MaintenanceStatCard = ({ label, value, trend, badge, subValue, icon }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all text-left flex-1 min-w-[240px]">
    <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 bg-emerald-50 text-[#059669] rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 border border-emerald-100">
        {icon}
      </div>
      {badge && <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest italic">{badge}</span>}
    </div>
    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1 italic">{label}</p>
    <div className="flex items-baseline gap-2">
      <span className="text-4xl font-black text-slate-900 tracking-tighter italic">{value}</span>
      {subValue && <span className="text-[10px] font-bold text-slate-400 italic">{subValue}</span>}
    </div>
  </div>
);

const AdminMaintenance = () => {
    const [records, setRecords] = useState([]);
    const [pitches, setPitches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newRecord, setNewRecord] = useState({
        pitch_id: '',
        maintenance_type: 'Vệ sinh cỏ',
        description: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        cost: 0
    });

    const fetchMaintenance = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/maintenance', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (response.ok) setRecords(result.data);
        } catch (error) {
            console.error('Lỗi lấy lịch bảo trì:', error);
        }
    };

    const fetchPitches = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/admin/bookings', { // Reusing bookings to get pitches list
                 headers: { 'Authorization': `Bearer ${token}` }
            });
            // Actually should have a better endpoint for pitches, but let's see.
            // I'll use the unique pitches from bookings or just hardcode some for now if needed.
            // Wait, I can use /api/fields and get pitches.
            const resFields = await fetch('http://localhost:3000/api/fields');
            const result = await resFields.json();
            if (resFields.ok) {
                const allPitches = [];
                result.data.forEach(f => {
                    // This is a bit complex since fields might not have pitches directly in the list
                });
                // I'll just use a mock pitch list if I can't find a quick way.
                // Let's check AdminFields.jsx
            }
        } catch (err) {}
    };

    useEffect(() => {
        fetchMaintenance();
        setLoading(false);
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/maintenance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newRecord)
            });
            if (response.ok) {
                setShowAddModal(false);
                fetchMaintenance();
            }
        } catch (error) {
            console.error('Lỗi tạo lịch bảo trì:', error);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/maintenance/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ 
                    status, 
                    end_date: status === 'completed' ? new Date().toISOString().split('T')[0] : null 
                })
            });
            if (response.ok) fetchMaintenance();
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa lịch bảo trì này?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/maintenance/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) fetchMaintenance();
        } catch (error) {
            console.error('Lỗi xóa lịch bảo trì:', error);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="animate-spin text-[#059669]" /></div>;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10 pb-24 text-left">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Bảo trì hệ thống</h1>
          <p className="text-slate-500 font-medium text-sm">Theo dõi và lên lịch bảo trì định kỳ cho các sân cỏ và trang thiết bị.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#059669] text-white px-8 py-4 rounded-2xl font-black text-[10px] flex items-center gap-2 shadow-xl shadow-emerald-100 hover:bg-[#047857] transition-all uppercase tracking-[0.1em] border-none cursor-pointer"
        >
          <Plus size={18} />
          Lên lịch bảo trì
        </button>
      </header>

      {/* Stats Grid */}
      <section className="flex flex-wrap gap-8">
        <MaintenanceStatCard label="Tổng lượt bảo trì" value={records.length} badge="Hệ thống" icon={<Settings size={24} />} />
        <MaintenanceStatCard label="Đang thực hiện" value={records.filter(r => r.status === 'in_progress').length} badge="Hiện tại" icon={<Timer size={24} />} />
        <MaintenanceStatCard label="Tổng chi phí" value={`${records.reduce((acc, r) => acc + (r.cost || 0), 0).toLocaleString()}đ`} badge="Năm nay" icon={<DollarSign size={24} />} />
      </section>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">Bảng kế hoạch bảo trì</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase font-black text-slate-300 tracking-[0.2em] border-b border-slate-50">
                <th className="px-10 py-6">Sân bóng</th>
                <th className="px-8 py-6">Ngày dự kiến</th>
                <th className="px-8 py-6">Loại bảo trì</th>
                <th className="px-8 py-6">Chi phí</th>
                <th className="px-8 py-6">Trạng thái</th>
                <th className="px-10 py-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.length > 0 ? records.map((record) => (
                <tr key={record.id} className="hover:bg-emerald-50/20 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#059669]"><Wrench size={20} /></div>
                      <div>
                        <p className="text-base font-black text-slate-800 italic uppercase leading-none mb-1">{record.pitch_name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{record.field_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-600 italic">{new Date(record.start_date).toLocaleDateString('vi-VN')}</p>
                    {record.end_date && <p className="text-[10px] text-green-500 font-bold italic">Xong: {new Date(record.end_date).toLocaleDateString('vi-VN')}</p>}
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] px-3 py-1 bg-slate-100 text-slate-600 rounded-lg font-black uppercase tracking-widest">{record.maintenance_type}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-700">{Number(record.cost).toLocaleString()}đ</p>
                  </td>
                  <td className="px-8 py-6">
                    <StatusBadge status={record.status} />
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-2">
                        {record.status === 'pending' && (
                            <button onClick={() => handleUpdateStatus(record.id, 'in_progress')} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-all border-none bg-transparent cursor-pointer" title="Bắt đầu làm"><Timer size={18} /></button>
                        )}
                        {record.status === 'in_progress' && (
                            <button onClick={() => handleUpdateStatus(record.id, 'completed')} className="p-2 text-green-400 hover:bg-green-50 rounded-lg transition-all border-none bg-transparent cursor-pointer" title="Hoàn thành"><CheckCircle2 size={18} /></button>
                        )}
                        <button onClick={() => handleDelete(record.id)} className="p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border-none bg-transparent cursor-pointer" title="Xóa"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                  <tr>
                      <td colSpan="6" className="py-20 text-center text-slate-300 font-bold uppercase italic tracking-widest">Chưa có lịch bảo trì nào được ghi nhận</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32"></div>
              <HelpCircle className="text-emerald-400 w-12 h-12" />
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Mẹo bảo trì sân cỏ</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">Đừng quên chải cỏ định kỳ ít nhất 2 tuần một lần để sợi cỏ luôn đứng thẳng và hạt cao su được dàn đều. Việc này giúp tăng tuổi thọ sân thêm 2-3 năm.</p>
          </div>
          <div className="bg-emerald-50 p-10 rounded-[2.5rem] border border-emerald-100 space-y-6">
              <Info className="text-[#059669] w-12 h-12" />
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-[#059669]">Lưu ý an toàn</h3>
              <p className="text-emerald-700/70 text-sm leading-relaxed font-medium">Trong quá trình bảo trì hệ thống điện và đèn chiếu sáng, hãy đảm bảo đã ngắt nguồn điện tổng để tránh rủi ro cho đội ngũ kỹ thuật.</p>
          </div>
      </div>

      {/* Add Maintenance Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative z-10 text-left overflow-hidden">
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Lên lịch bảo trì</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Đảm bảo chất lượng sân tốt nhất</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors border-none cursor-pointer"><X size={20} /></button>
              </div>
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Sân bóng (ID)</label>
                  <input required type="number" value={newRecord.pitch_id} onChange={(e) => setNewRecord({...newRecord, pitch_id: e.target.value})} placeholder="Ví dụ: 1" className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold text-slate-700" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Loại bảo trì</label>
                    <select value={newRecord.maintenance_type} onChange={(e) => setNewRecord({...newRecord, maintenance_type: e.target.value})} className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold text-slate-700 cursor-pointer appearance-none">
                        <option value="Vệ sinh cỏ">Vệ sinh cỏ</option>
                        <option value="Thay đèn">Thay đèn</option>
                        <option value="Sửa lưới">Sửa lưới</option>
                        <option value="Hạt cao su">Bổ sung hạt cao su</option>
                        <option value="Khác">Khác</option>
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Ngày bắt đầu</label>
                        <input required type="date" value={newRecord.start_date} onChange={(e) => setNewRecord({...newRecord, start_date: e.target.value})} className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold text-slate-700" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Chi phí (đ)</label>
                        <input required type="number" value={newRecord.cost} onChange={(e) => setNewRecord({...newRecord, cost: e.target.value})} className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold text-slate-700" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Mô tả chi tiết</label>
                    <textarea rows="3" value={newRecord.description} onChange={(e) => setNewRecord({...newRecord, description: e.target.value})} placeholder="Ghi chú các hạng mục cần sửa chữa..." className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-[#059669] text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#047857] border-none cursor-pointer">Xác nhận lên lịch</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminMaintenance;
