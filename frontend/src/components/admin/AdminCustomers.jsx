import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  RotateCcw, 
  Search, 
  Eye, 
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Loader2,
  X,
  Calendar,
  CreditCard,
  History,
  Phone,
  Mail,
  ShieldCheck,
  Crown
} from 'lucide-react';

const CustomerStatusBadge = ({ status }) => {
  const config = {
    'active': { color: 'text-green-600 bg-green-50 border-green-200', label: 'Hoạt động' },
    'on_leave': { color: 'text-amber-600 bg-amber-50 border-amber-200', label: 'Tạm nghỉ' },
  };
  const { color, label } = config[status] || config['active'];
  return (
    <div className={`inline-flex items-center justify-center min-w-[110px] px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${color} border shadow-sm whitespace-nowrap`}>
      {label}
    </div>
  );
};

const CustomerStatCard = ({ label, value, trend, badge, subValue, icon }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all text-left">
    <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 bg-emerald-50 text-[#059669] rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 border border-emerald-100">
        {icon}
      </div>
      <div className="flex flex-col items-end">
        {trend && (
          <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full mb-1">
            <ArrowUpRight size={14} />
            <span className="text-[10px] font-black">{trend}</span>
          </div>
        )}
        {badge && (
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest italic">{badge}</span>
        )}
      </div>
    </div>
    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1 italic">{label}</p>
    <div className="flex items-baseline gap-2">
      <span className="text-4xl font-black text-slate-900 tracking-tighter italic">{value}</span>
      {subValue && <span className="text-[10px] font-bold text-slate-400 italic">{subValue}</span>}
    </div>
  </div>
);

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Tất cả');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const [newCustomer, setNewCustomer] = useState({
        full_name: '',
        phone_number: '',
        email: '',
        role: 'customer'
    });

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (response.ok) {
                setCustomers(result.data);
                setFilteredCustomers(result.data);
            }
        } catch (error) {
            console.error('Lỗi lấy danh sách khách hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        let result = customers;
        if (activeTab === 'Thành viên') result = result.filter(u => u.role === 'customer');
        if (activeTab === 'VIP GOLD') result = result.filter(u => !!u.is_vip);
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(u => 
                u.full_name?.toLowerCase().includes(term) || 
                u.email?.toLowerCase().includes(term) || 
                u.phone_number?.includes(term) ||
                u.id.toString().includes(term)
            );
        }
        setFilteredCustomers(result);
    }, [searchTerm, activeTab, customers]);

    const handleViewDetails = async (id) => {
        setSelectedUser(customers.find(u => u.id === id));
        setShowDetailsModal(true);
        setDetailsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/admin/users/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (response.ok) {
                setUserDetails(result.data);
            }
        } catch (error) {
            console.error('Lỗi lấy chi tiết khách hàng:', error);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newCustomer)
            });
            if (response.ok) {
                setShowAddModal(false);
                setNewCustomer({ full_name: '', phone_number: '', email: '', role: 'customer' });
                fetchCustomers();
            } else {
                const err = await response.json();
                alert(err.message || 'Lỗi khi tạo người dùng');
            }
        } catch (error) {
            console.error('Lỗi khi thêm khách hàng:', error);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/admin/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                fetchCustomers();
            }
        } catch (error) {
            console.error('Lỗi khi xóa người dùng:', error);
        }
    };

    if (loading && customers.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-12 h-12 animate-spin text-[#059669]" />
            </div>
        );
    }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10 pb-24 relative">
      <header className="flex justify-between items-center text-left">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Quản lý Khách hàng</h1>
          <p className="text-slate-500 font-medium text-sm">Theo dõi hoạt động và lịch sử của tất cả hội viên trên hệ thống.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#059669] text-white px-8 py-4 rounded-2xl font-black text-[10px] flex items-center gap-2 shadow-xl shadow-emerald-100 hover:bg-[#047857] transition-all uppercase tracking-[0.1em] border-none cursor-pointer"
        >
          <UserPlus size={18} />
          Thêm khách hàng mới
        </button>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
        <CustomerStatCard label="Tổng số khách" value={customers.length.toLocaleString()} trend="8%" subValue="Dữ liệu thực tế" icon={<Users size={24} />} />
        <CustomerStatCard label="Thành viên VIP" value={customers.filter(u => !!u.is_vip).length} badge="Đang hoạt động" icon={<Crown size={24} />} />
        <CustomerStatCard label="Tỷ lệ quay lại" value="85%" badge="Tháng này" icon={<RotateCcw size={24} />} />
        <CustomerStatCard label="Khách hàng mới" value={customers.filter(u => new Date(u.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} badge="7 ngày qua" icon={<ArrowUpRight size={24} />} />
      </section>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col text-left">
        <div className="p-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100">
            {['Tất cả', 'Thành viên', 'VIP GOLD'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest border-none cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab
                    ? tab === 'VIP GOLD'
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-950 shadow-sm shadow-yellow-200'
                      : 'bg-white text-[#059669] shadow-sm'
                    : 'text-slate-400 hover:text-slate-600 bg-transparent'
                }`}
              >
                {tab === 'VIP GOLD' && <Crown size={11} className={activeTab === 'VIP GOLD' ? 'fill-yellow-950 text-yellow-950' : 'text-yellow-500'} />}
                {tab}
              </button>
            ))}
          </div>
          <div className="flex-1 max-w-sm flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 group focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <Search size={18} className="text-slate-400 group-focus-within:text-[#059669]" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm theo tên, email, SĐT..." className="bg-transparent text-sm font-bold text-slate-700 w-full focus:outline-none placeholder:text-slate-300" />
            {searchTerm && <button onClick={() => setSearchTerm('')} className="text-slate-300 hover:text-slate-500 border-none bg-transparent cursor-pointer"><X size={14} /></button>}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase font-black text-slate-300 tracking-[0.2em] border-b border-slate-50">
                <th className="px-10 py-6">Khách hàng</th>
                <th className="px-10 py-6">Liên hệ</th>
                <th className="px-8 py-6">Vai trò</th>
                <th className="px-8 py-6">Hết hạn VIP</th>
                <th className="px-8 py-6">Ngày tham gia</th>
                <th className="px-10 py-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCustomers.map((user) => (
                <tr key={user.id} className="hover:bg-emerald-50/20 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xs font-black text-[#059669] uppercase shadow-sm">{user.full_name?.charAt(0) || 'U'}</div>
                        {!!user.is_vip && (
                          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                            <Crown size={9} className="text-white fill-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center py-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-base font-black text-slate-800 leading-tight tracking-tight italic uppercase">{user.full_name}</p>
                          {!!user.is_vip && (
                            <span className="inline-flex items-center gap-1 text-[8px] font-black text-yellow-700 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              <Crown size={7} className="fill-yellow-600" /> VIP
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Mã khách: #{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-sm font-bold text-slate-600 tracking-wider mb-1">{user.phone_number || 'N/A'}</p>
                    <p className="text-[10px] text-slate-400 font-medium lowercase italic">{user.email}</p>
                  </td>
                  <td className="px-8 py-6">
                    {user.role === 'admin' ? (
                      <span className="inline-flex items-center justify-center min-w-[110px] text-[10px] font-black px-4 py-2 rounded-xl border italic uppercase whitespace-nowrap shadow-sm bg-purple-50 text-purple-600 border-purple-100">
                        Quản trị viên
                      </span>
                    ) : !!user.is_vip ? (
                      <span className="inline-flex items-center justify-center gap-1.5 min-w-[110px] text-[10px] font-black px-4 py-2 rounded-xl border italic uppercase whitespace-nowrap shadow-sm shadow-yellow-100 bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border-yellow-200">
                        <Crown size={10} className="fill-yellow-600 text-yellow-600" /> VIP GOLD
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center min-w-[110px] text-[10px] font-black px-4 py-2 rounded-xl border italic uppercase whitespace-nowrap shadow-sm bg-indigo-50 text-indigo-600 border-indigo-100">
                        Hội viên
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    {(() => {
                      if (!user.is_vip || !user.vip_expire) {
                        return <span className="text-xs text-slate-300 font-bold italic">—</span>;
                      }
                      const expireDate = new Date(user.vip_expire);
                      const daysLeft = Math.ceil((expireDate - new Date()) / (1000 * 60 * 60 * 24));
                      const formattedDate = expireDate.toLocaleDateString('vi-VN');
                      if (daysLeft <= 0) {
                        return (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl uppercase">
                            ⚠️ Hết hạn
                          </span>
                        );
                      }
                      if (daysLeft <= 7) {
                        return (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-black text-slate-700">{formattedDate}</span>
                            <span className="inline-flex items-center gap-1 text-[9px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg uppercase animate-pulse">
                              ⏳ Còn {daysLeft} ngày
                            </span>
                          </div>
                        );
                      }
                      return (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-black text-slate-700">{formattedDate}</span>
                          <span className="text-[9px] text-emerald-500 font-bold">Còn {daysLeft} ngày</span>
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-slate-500 italic">{new Date(user.created_at).toLocaleDateString('vi-VN')}</span>
                  </td>
                  <td className="px-10 py-6 text-right">
                     <div className="flex justify-end items-center gap-2">
                        <button onClick={() => handleViewDetails(user.id)} title="Xem chi tiết" className="p-3 text-slate-200 hover:text-[#059669] hover:bg-emerald-50 rounded-xl transition-all border-none bg-transparent cursor-pointer"><Eye size={20} /></button>
                        <button onClick={() => handleDeleteUser(user.id)} title="Xóa vĩnh viễn" className="p-3 text-slate-200 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border-none bg-transparent cursor-pointer"><Trash2 size={20} /></button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative z-10 text-left overflow-hidden">
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Thêm Hội Viên</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Tạo tài khoản mới</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors border-none cursor-pointer"><X size={20} /></button>
              </div>
              <form onSubmit={handleAddCustomer} className="space-y-6">
                <input required type="text" value={newCustomer.full_name} onChange={(e) => setNewCustomer({...newCustomer, full_name: e.target.value})} placeholder="Họ và tên" className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold text-slate-700" />
                <input required type="tel" value={newCustomer.phone_number} onChange={(e) => setNewCustomer({...newCustomer, phone_number: e.target.value})} placeholder="Số điện thoại" className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold text-slate-700" />
                <input type="email" value={newCustomer.email} onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})} placeholder="Email" className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold text-slate-700" />
                <button type="submit" className="w-full bg-[#059669] text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#047857] border-none cursor-pointer">Xác nhận thêm</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDetailsModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }} className="bg-white w-full max-w-2xl h-[90vh] rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col text-left">
                {/* Header Profile */}
                <div className="bg-[#059669] p-10 text-white relative">
                    <div className="absolute top-6 right-6">
                        <button onClick={() => setShowDetailsModal(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors border-none cursor-pointer"><X size={20} /></button>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl font-black italic">{selectedUser?.full_name?.charAt(0)}</div>
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black tracking-tighter italic uppercase">{selectedUser?.full_name}</h2>
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1 text-emerald-200 text-[10px] font-black uppercase tracking-widest"><Phone size={12} /> {selectedUser?.phone_number}</span>
                                <span className="flex items-center gap-1 text-emerald-200 text-[10px] font-black uppercase tracking-widest"><Mail size={12} /> {selectedUser?.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-10">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                            <History className="text-[#059669] mb-3" size={24} />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Tổng trận đấu</p>
                            <p className="text-2xl font-black text-slate-900 italic">{userDetails?.stats?.total_bookings || 0} trận</p>
                        </div>
                        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                            <CreditCard className="text-[#059669] mb-3" size={24} />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Tổng chi tiêu</p>
                            <p className="text-2xl font-black text-slate-900 italic">{Number(userDetails?.stats?.total_spent || 0).toLocaleString()}đ</p>
                        </div>
                        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                            <ShieldCheck className="text-[#059669] mb-3" size={24} />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Ngày tham gia</p>
                            <p className="text-xl font-black text-slate-900 italic">{new Date(selectedUser?.created_at).toLocaleDateString('vi-VN')}</p>
                        </div>
                    </div>

                    {/* Recent Bookings */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">Lịch sử đặt sân gần đây</h3>
                            <button className="text-[10px] font-black text-[#059669] uppercase tracking-widest border-none bg-transparent cursor-pointer">Xem tất cả</button>
                        </div>

                        {detailsLoading ? (
                            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#059669]" /></div>
                        ) : (
                            <div className="space-y-3">
                                {userDetails?.bookings?.length > 0 ? userDetails.bookings.map((b, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-200 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center"><Calendar size={18} className="text-slate-400 group-hover:text-[#059669]" /></div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 italic uppercase">{b.pitch_name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold">{new Date(b.booking_date).toLocaleDateString('vi-VN')} - {b.booking_code}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-[#059669]">{Number(b.total_price).toLocaleString()}đ</p>
                                            <span className="text-[8px] font-black uppercase text-slate-300 tracking-widest">{b.status}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-10 text-slate-300 italic font-bold">Chưa có lịch sử đặt sân nào</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="p-8 border-t border-slate-50 bg-slate-50/50">
                    <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all border-none cursor-pointer">Gửi thông báo ưu đãi</button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminCustomers;
