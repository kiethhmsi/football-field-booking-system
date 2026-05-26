import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Bell, 
  Settings2, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft,
  Calendar,
  CheckCircle2,
  MoreVertical,
  UserSquare,
  Clock,
  Edit,
  Trash2,
  Loader2,
  X,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react';

const StaffStatCard = ({ staffCount }) => (
  <div className="flex-1 bg-[#059669] rounded-[2rem] p-8 text-white relative overflow-hidden flex items-center justify-between shadow-xl shadow-emerald-100 text-left">
    <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
    <div className="space-y-6 relative z-10">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200 italic">Tổng quan nhân sự</p>
      <div className="flex items-end gap-3">
        <span className="text-7xl font-black tracking-tighter italic">{staffCount.toString().padStart(2, '0')}</span>
        <span className="text-lg font-black text-emerald-100 pb-3 uppercase tracking-tight">Nhân viên hệ thống</span>
      </div>
      <div className="flex -space-x-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-10 h-10 rounded-full border-2 border-[#059669] overflow-hidden shadow-lg bg-emerald-100 flex items-center justify-center text-[10px] font-black text-[#059669]">
            {String.fromCharCode(64 + i)}
          </div>
        ))}
        {staffCount > 3 && <div className="w-10 h-10 rounded-full bg-emerald-600 border-2 border-[#059669] flex items-center justify-center text-[10px] font-black shadow-lg">+{staffCount - 3}</div>}
      </div>
    </div>
    <div className="bg-emerald-800/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 space-y-3 min-w-[240px] shadow-2xl">
      <p className="text-[10px] font-black text-emerald-300 uppercase tracking-[0.2em] italic">Trạng thái trực</p>
      <p className="font-black text-3xl italic tracking-tighter">Đang vận hành</p>
      <div className="h-px bg-white/10 w-full my-2"></div>
      <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-widest">Toàn bộ hệ thống ổn định</p>
    </div>
  </div>
);

const StaffStructure = ({ staffCount }) => (
  <div className="w-96 bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm space-y-8 text-left">
    <div className="space-y-1">
      <h3 className="text-sm font-black text-slate-800 tracking-[0.1em] uppercase italic">Cơ cấu nhân sự</h3>
    </div>
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span>Quản lý (Admin)</span>
          <span className="text-slate-800">01</span>
        </div>
        <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: '20%' }} className="h-full bg-[#059669]"></motion.div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span>Nhân viên sân (Staff)</span>
          <span className="text-slate-800">{staffCount.toString().padStart(2, '0')}</span>
        </div>
        <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: '80%' }} className="h-full bg-[#059669]"></motion.div>
        </div>
      </div>
    </div>
  </div>
);

const StaffActionCard = ({ title, icon, color }) => (
  <div className={`flex-1 ${color} rounded-[2.5rem] p-8 flex flex-col justify-between group cursor-pointer transition-all hover:scale-[1.02] shadow-sm border border-slate-100 text-left`}>
    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-800 shadow-sm mb-10 transition-transform group-hover:rotate-6">
      {icon}
    </div>
    <div className="space-y-4">
      <h3 className="text-xl font-black text-slate-800 tracking-tight italic uppercase leading-none">{title}</h3>
      <button className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:text-[#059669] transition-colors border-none bg-transparent italic">
        Chi tiết <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  </div>
);

const AdminStaff = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newStaff, setNewStaff] = useState({
        full_name: '',
        phone_number: '',
        email: '',
        role: 'staff',
        password: 'staff123'
    });

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/admin/staff', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (response.ok) {
                setStaff(result.data);
            }
        } catch (error) {
            console.error('Lỗi lấy danh sách nhân viên:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/admin/users', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(newStaff)
            });
            if (response.ok) {
                setShowAddModal(false);
                setNewStaff({ full_name: '', phone_number: '', email: '', role: 'staff', password: 'staff123' });
                fetchStaff();
            } else {
                const err = await response.json();
                alert(err.message || 'Lỗi khi tạo nhân viên');
            }
        } catch (error) {
            console.error('Lỗi khi thêm nhân viên:', error);
        }
    };

    const handleDeleteStaff = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn cho nhân viên này nghỉ việc?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/admin/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                fetchStaff();
            }
        } catch (error) {
            console.error('Lỗi khi xóa nhân viên:', error);
        }
    };

    if (loading && staff.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-12 h-12 animate-spin text-[#059669]" />
            </div>
        );
    }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-12 pb-24 relative"
    >
      <header className="flex justify-between items-center text-left">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Nhân sự</h2>
          <p className="text-slate-500 text-sm font-medium">Quản lý danh sách, ca trực và theo dõi trạng thái làm việc.</p>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#059669] text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-[#047857] shadow-xl shadow-emerald-100 transition-all border-none cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Thêm nhân viên mới
          </button>
        </div>
      </header>

      <section className="flex flex-wrap gap-8">
        <StaffStatCard staffCount={staff.length} />
        <StaffStructure staffCount={staff.length} />
      </section>

      <section className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm text-left">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">Danh sách nhân viên</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] text-left border-b border-slate-50 pb-6">
                <th className="pb-6">Nhân viên</th>
                <th className="pb-6">Liên hệ</th>
                <th className="pb-6">Vai trò</th>
                <th className="pb-6">Ngày bắt đầu</th>
                <th className="pb-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {staff.map((s, i) => (
                <tr key={s.id} className="group hover:bg-emerald-50/20 transition-colors">
                  <td className="py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xs font-black text-[#059669] shrink-0 uppercase shadow-sm italic">
                        {s.full_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-base text-slate-800 tracking-tight italic uppercase leading-none mb-2">{s.full_name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: STAFF_{s.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <p className="text-sm text-slate-600 font-bold tracking-wider mb-1">{s.phone_number}</p>
                    <p className="text-[10px] text-slate-400 font-medium lowercase italic">{s.email}</p>
                  </td>
                  <td className="py-6">
                    <span className="px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest italic shadow-sm border border-emerald-100 bg-emerald-50 text-[#059669]">
                      Nhân viên trực sân
                    </span>
                  </td>
                  <td className="py-6 text-xs text-slate-500 font-bold italic tracking-tighter">
                    {new Date(s.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="py-6 text-right relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(openDropdownId === s.id ? null : s.id);
                      }}
                      className={`p-3 rounded-xl transition-all border-none bg-transparent cursor-pointer ${openDropdownId === s.id ? 'text-[#059669] bg-emerald-50 opacity-100 shadow-sm' : 'text-slate-200 hover:text-[#059669] hover:bg-emerald-50 group-hover:opacity-100'}`}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    <AnimatePresence>
                      {openDropdownId === s.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute right-8 top-12 mt-1 w-56 bg-white rounded-[1.5rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 py-3 z-[100] text-left overflow-hidden"
                        >
                          <button className="w-full px-5 py-3 flex items-center gap-3 text-slate-600 hover:bg-emerald-50 hover:text-[#059669] transition-colors border-none bg-transparent cursor-pointer group/item">
                            <UserSquare className="w-4 h-4 text-slate-400 group-hover/item:text-[#059669]" />
                            <span className="text-xs font-bold uppercase tracking-widest italic">Xem hồ sơ</span>
                          </button>
                          <button className="w-full px-5 py-3 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors border-none bg-transparent cursor-pointer group/item" onClick={() => handleDeleteStaff(s.id)}>
                            <Trash2 className="w-4 h-4 text-red-400 group-hover/item:text-red-600" />
                            <span className="text-xs font-bold uppercase tracking-widest italic">Cho nghỉ việc</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </tr>
              ))}
              {staff.length === 0 && (
                  <tr>
                      <td colSpan="5" className="py-20 text-center text-slate-300 font-bold uppercase italic tracking-widest">
                          Chưa có nhân viên nào trong danh sách
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-wrap gap-8 relative items-stretch">
        <StaffActionCard title="Lịch trực tuần" icon={<Calendar className="w-7 h-7" />} color="bg-blue-50" />
        <StaffActionCard title="Chấm công" icon={<CheckCircle2 className="w-7 h-7" />} color="bg-emerald-50/50" />
        <StaffActionCard title="Thông báo nội" icon={<Bell className="w-7 h-7" />} color="bg-purple-50/50" />
      </section>

      {/* Add Staff Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative z-10 text-left overflow-hidden">
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Thêm Nhân Viên</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Tạo tài khoản nhân viên mới</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors border-none cursor-pointer"><X size={20} /></button>
              </div>
              <form onSubmit={handleAddStaff} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Họ và tên</label>
                  <input required type="text" value={newStaff.full_name} onChange={(e) => setNewStaff({...newStaff, full_name: e.target.value})} placeholder="Nguyễn Văn A" className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold text-slate-700" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Số điện thoại</label>
                    <input required type="tel" value={newStaff.phone_number} onChange={(e) => setNewStaff({...newStaff, phone_number: e.target.value})} placeholder="09xx xxx xxx" className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold text-slate-700" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Email</label>
                    <input type="email" value={newStaff.email} onChange={(e) => setNewStaff({...newStaff, email: e.target.value})} placeholder="staff@gmail.com" className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold text-slate-700" />
                </div>
                <button type="submit" className="w-full bg-[#059669] text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#047857] border-none cursor-pointer">Xác nhận thêm</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminStaff;
