import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Eye, Download, MoreVertical, X, CheckCircle2, AlertCircle, Loader2, Filter, Flag, Pencil } from 'lucide-react';
import socket from '../../utils/socket';
import EditBookingModal from './EditBookingModal';
import NewBookingModal from './NewBookingModal';

const BookingStatusBadge = ({ status }) => {
  const s = status ? status.toLowerCase() : '';
  const configs = {
    // NHÓM 1: CHỜ XỬ LÝ
    'pending': { color: 'text-amber-600 bg-amber-50 border-amber-100', label: 'Chờ xác nhận' },
    'pending_payment': { color: 'text-amber-600 bg-amber-50 border-amber-100', label: 'Chờ xác nhận' },
    'pending_confirmation': { color: 'text-amber-600 bg-amber-50 border-amber-100', label: 'Chờ xác nhận' },
    
    // NHÓM 2: ĐÃ XÁC NHẬN
    'confirmed': { color: 'text-emerald-700 bg-emerald-50 border-emerald-100', label: 'Xác nhận đơn' },
    'paid': { color: 'text-emerald-700 bg-emerald-50 border-emerald-100', label: 'Xác nhận đơn' },
    
    // NHÓM 3: HOÀN THÀNH
    'completed': { color: 'text-blue-700 bg-blue-50 border-blue-100', label: 'Hoàn thành đơn' },
    
    // NHÓM 4: ĐÃ HỦY
    'cancelled': { color: 'text-red-600 bg-red-50 border-red-100', label: 'Hủy đơn' },
  };
  const config = configs[s] || { color: 'text-gray-400 bg-gray-50 border-gray-100', label: 'Không xác định' };
  return (
    <div className={`px-2 py-1 rounded-lg border flex items-center justify-center font-black text-[9px] ${config.color} whitespace-nowrap uppercase tracking-widest`}>
      {config.label}
    </div>
  );
};

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openActionMenuId, setOpenActionMenuId] = useState(null);
    const [openCheckInMenuId, setOpenCheckInMenuId] = useState(null);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedBookingForEdit, setSelectedBookingForEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFieldId, setSelectedFieldId] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedCheckInStatus, setSelectedCheckInStatus] = useState('');
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const fetchFields = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/fields');
            const result = await response.json();
            if (response.ok) setFields(result.data);
        } catch (err) {}
    };

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const queryParams = new URLSearchParams({
                search: searchTerm,
                field_id: selectedFieldId,
                status: selectedStatus,
                check_in_status: selectedCheckInStatus,
                page: currentPage,
                limit: 10
            }).toString();
            const url = `http://localhost:3000/api/admin/bookings?${queryParams}`;
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (response.ok) {
                setBookings(result.data);
                if (result.pagination) {
                    setTotalPages(result.pagination.totalPages);
                    setTotalItems(result.pagination.total);
                }
            }
        } catch (error) {
            console.error('Lỗi lấy danh sách đơn:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFields();
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [selectedFieldId, selectedStatus, selectedCheckInStatus, currentPage]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setCurrentPage(1); 
            fetchBookings();
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    useEffect(() => {
        socket.on('booking_updated', (data) => {
            fetchBookings();
        });
        return () => {
            socket.off('booking_updated');
        };
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        if (!window.confirm(`Xác nhận chuyển đơn hàng sang trạng thái ${newStatus === 'pending' ? 'Chờ xử lý' : newStatus === 'confirmed' ? 'Đã xác nhận' : newStatus === 'completed' ? 'Hoàn thành' : 'Đã hủy'}?`)) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/admin/bookings/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                setOpenActionMenuId(null);
                fetchBookings();
            }
        } catch (error) {
            alert('Lỗi khi cập nhật trạng thái');
        }
    };

    const handleUpdateCheckIn = async (id, currentStatus) => {
        const newCheckIn = currentStatus === 'checked_in' ? 'not_checked_in' : 'checked_in';
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/admin/bookings/${id}/check-in`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ check_in_status: newCheckIn })
            });
            if (response.ok) {
                setOpenActionMenuId(null);
                setOpenCheckInMenuId(null);
                fetchBookings();
            }
        } catch (error) {
            alert('Lỗi khi cập nhật check-in');
        }
    };

    const statusActions = [
        { status: 'pending', label: 'Chờ xác nhận', color: 'text-amber-500', hover: 'hover:bg-amber-50' },
        { status: 'confirmed', label: 'Xác nhận đơn', color: 'text-emerald-700', hover: 'hover:bg-emerald-50' },
        { status: 'cancelled', label: 'Hủy đơn', color: 'text-red-600', hover: 'hover:bg-red-50' },
        { status: 'completed', label: 'Hoàn thành đơn', color: 'text-blue-700', hover: 'hover:bg-blue-50' }
    ];

    const handleExportCSV = async () => {
        try {
            const token = localStorage.getItem('token');
            const queryParams = new URLSearchParams({
                search: searchTerm,
                field_id: selectedFieldId,
                status: selectedStatus,
                check_in_status: selectedCheckInStatus,
                limit: 1000 // Lấy tối đa 1000 đơn để xuất
            }).toString();
            
            const response = await fetch(`http://localhost:3000/api/admin/bookings?${queryParams}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            
            if (!response.ok) throw new Error('Không thể lấy dữ liệu xuất');
            
            const data = result.data;
            if (data.length === 0) return alert('Không có dữ liệu để xuất');

            // Định nghĩa Header cho CSV
            const headers = ['Mã Đơn', 'Khách Hàng', 'SĐT', 'Sân Bóng', 'Ngày', 'Bắt Đầu', 'Kết Thúc', 'Tổng Tiền', 'Đã Cọc', 'Trạng Thái'];
            
            // Chuyển đổi dữ liệu sang dạng hàng CSV
            const csvRows = [
                headers.join(','), // Header row
                ...data.map(row => [
                    row.booking_code,
                    `"${row.customer_name}"`,
                    row.customer_phone,
                    `"${row.pitch_name}"`,
                    new Date(row.booking_date).toLocaleDateString('vi-VN'),
                    row.start_time.substring(0, 5),
                    row.end_time.substring(0, 5),
                    row.total_price,
                    row.deposit_amount,
                    row.status
                ].join(','))
            ];

            const csvContent = "\uFEFF" + csvRows.join('\n'); // Add BOM for Excel UTF-8 support
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `Bao_Cao_Dat_San_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            alert('Lỗi khi xuất file: ' + error.message);
        }
    };

  if (loading && bookings.length === 0) return <div className="flex items-center justify-center h-96"><Loader2 className="animate-spin text-[#059669]" /></div>;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10 pb-24 text-left px-4">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Quản lý Đơn hàng</h1>
          <p className="text-slate-500 font-medium text-sm">Theo dõi lịch sử và xác nhận các đơn đặt sân.</p>
        </div>
      </header>

      {/* Filters Enhanced */}
      <section className="flex flex-wrap gap-6">
         {/* Field Filter */}
         <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex-1 min-w-[200px]">
            <p className="text-[10px] uppercase font-black text-slate-400 mb-3 italic tracking-widest">Cụm sân</p>
            <select 
                value={selectedFieldId} 
                onChange={(e) => { setSelectedFieldId(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-50 border-none px-4 py-3 rounded-2xl text-[11px] font-black text-slate-700 appearance-none cursor-pointer outline-none ring-1 ring-slate-100 focus:ring-emerald-500 uppercase italic tracking-tighter"
            >
                <option value="">Tất cả cụm sân</option>
                {Object.entries(
                    fields.reduce((acc, pitch) => {
                        const fieldName = pitch.field_name || 'Hệ thống';
                        if (!acc[fieldName]) acc[fieldName] = [];
                        acc[fieldName].push(pitch);
                        return acc;
                    }, {})
                ).map(([fieldName, pitches]) => (
                    <optgroup key={fieldName} label={fieldName}>
                        {pitches.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </optgroup>
                ))}
            </select>
         </div>

         {/* Status Filter NEW */}
         <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex-1 min-w-[200px]">
            <p className="text-[10px] uppercase font-black text-slate-400 mb-3 italic tracking-widest">Trạng thái</p>
            <select 
                value={selectedStatus} 
                onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-50 border-none px-4 py-3 rounded-2xl text-[11px] font-black text-slate-700 appearance-none cursor-pointer outline-none ring-1 ring-slate-100 focus:ring-emerald-500 uppercase italic tracking-tighter"
            >
                <option value="">Tất cả trạng thái</option>
                <option value="pending">🟡 Chờ xác nhận</option>
                <option value="confirmed">🟢 Xác nhận đơn</option>
                <option value="completed">🔵 Hoàn thành đơn</option>
                <option value="cancelled">🔴 Hủy đơn</option>
            </select>
         </div>

         {/* Check-in Filter NEW */}
         <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex-1 min-w-[200px]">
            <p className="text-[10px] uppercase font-black text-slate-400 mb-3 italic tracking-widest">Điểm danh (Check-in)</p>
            <select 
                value={selectedCheckInStatus} 
                onChange={(e) => { setSelectedCheckInStatus(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-50 border-none px-4 py-3 rounded-2xl text-[11px] font-black text-slate-700 appearance-none cursor-pointer outline-none ring-1 ring-slate-100 focus:ring-emerald-500 uppercase italic tracking-tighter"
            >
                <option value="">Tất cả</option>
                <option value="checked_in">🟢 Đã tới sân</option>
                <option value="not_checked_in">⚪ Chưa tới sân</option>
                <option value="overdue">🔴 Quá giờ!</option>
            </select>
         </div>

         {/* Search Filter */}
         <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex-[2] min-w-[320px]">
            <p className="text-[10px] uppercase font-black text-slate-400 mb-3 italic tracking-widest">Tìm kiếm nhanh</p>
            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border-none px-12 py-3 rounded-2xl text-sm font-bold text-slate-700 outline-none ring-1 ring-slate-100 focus:ring-emerald-500" 
                    placeholder="Mã đơn, Tên khách, Số điện thoại..." 
                />
                {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 bg-transparent border-none cursor-pointer"><X size={16} /></button>}
            </div>
         </div>
      </section>

      {/* Optimized Table Container */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[750px]">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white flex-shrink-0">
             <div className="flex items-center gap-4">
                <h2 className="text-lg font-black italic uppercase tracking-tighter leading-none">Danh sách đơn hàng</h2>
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest italic">{totalItems} đơn</span>
             </div>
             <div className="flex gap-2">
                <button 
                    onClick={handleExportCSV}
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border-none bg-transparent cursor-pointer"
                    title="Xuất file báo cáo (Excel/CSV)"
                >
                    <Download size={18} />
                </button>
             </div>
          </div>

          <div className="flex-1 overflow-auto relative">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead className="sticky top-0 z-20 bg-white">
                <tr className="text-[9px] uppercase tracking-[0.2em] text-slate-300 font-black">
                  <th className="px-6 py-4 bg-white border-b border-slate-50 w-28">Mã đơn</th>
                  <th className="px-4 py-4 bg-white border-b border-slate-50 min-w-[140px]">Khách hàng</th>
                  <th className="px-4 py-4 bg-white border-b border-slate-50 min-w-[140px]">Sân bóng</th>
                  <th className="px-4 py-4 bg-white border-b border-slate-50 w-36 text-left whitespace-nowrap">Thời gian</th>
                  <th className="px-4 py-4 bg-white border-b border-slate-50 w-32 text-left whitespace-nowrap">Tổng tiền</th>
                  <th className="px-4 py-4 bg-white border-b border-slate-50 w-28 text-left whitespace-nowrap">Đã cọc</th>
                  <th className="px-4 py-4 bg-white border-b border-slate-50 w-28 text-left whitespace-nowrap">Còn lại</th>
                  <th className="px-4 py-4 bg-white border-b border-slate-50 w-32 text-left">Thanh toán</th>
                  <th className="px-4 py-4 bg-white border-b border-slate-50 text-center min-w-[180px]">Check-in</th>
                  <th className="px-4 py-4 bg-white border-b border-slate-50 text-center min-w-[150px]">Trạng thái</th>
                  <th className="px-4 py-4 bg-white border-b border-slate-50 text-center w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {bookings.length > 0 ? bookings.map((row, index) => (
                  <tr key={row.id} className="hover:bg-emerald-50/10 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-black text-emerald-800 text-[11px] uppercase tracking-tighter italic">{row.booking_code}</span>
                    </td>
                    <td className="px-4 py-4">
                       <div className="flex items-center gap-2 max-w-[180px]">
                          <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 font-black text-[9px] flex-shrink-0 flex items-center justify-center italic leading-none">
                             {row.customer_name?.charAt(0) || 'U'}
                          </div>
                          <div className="overflow-hidden">
                             <p className="text-[11px] font-black text-slate-800 uppercase italic truncate leading-none mb-0.5">{row.customer_name}</p>
                             <p className="text-[9px] text-slate-400 font-bold truncate tracking-widest leading-none">{row.customer_phone}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-4 py-4">
                        <div className="flex flex-col max-w-[160px]">
                            <span className="text-[11px] font-black text-slate-700 italic uppercase truncate leading-none">{row.pitch_name}</span>
                        </div>
                    </td>
                    <td className="px-4 py-4 text-left">
                       <div className="inline-block">
                          <p className="text-[10px] font-black text-slate-700 italic leading-none mb-0.5">{new Date(row.booking_date).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'})}</p>
                          <p className="text-[9px] text-emerald-600 font-bold uppercase whitespace-nowrap leading-none">{row.start_time.substring(0, 5)} - {row.end_time.substring(0, 5)}</p>
                       </div>
                    </td>
                    <td className="px-4 py-4 text-left">
                       <span className="text-[11px] font-black text-slate-900 italic">{Number(row.total_price).toLocaleString()}đ</span>
                    </td>
                    <td className="px-4 py-4 text-left">
                       <span className="text-[10px] font-bold text-emerald-600 italic">-{Number(row.deposit_amount || 0).toLocaleString()}đ</span>
                    </td>
                    <td className="px-4 py-4 text-left">
                       <span className="text-[11px] font-black text-red-600 italic">{Number(row.total_price - (row.deposit_amount || 0)).toLocaleString()}đ</span>
                    </td>
                    <td className="px-4 py-4 text-left">
                        <div className="flex items-center justify-start gap-1.5 min-w-fit">
                           <span className="text-sm">{(row.payment_method === 'transfer' || row.payment_method === 'online') ? '🏦' : '💵'}</span>
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter truncate leading-none">
                              {(row.payment_method === 'transfer' || row.payment_method === 'online') ? 'CHUYỂN KHOẢN' : 'TIỀN MẶT'}
                           </span>
                        </div>
                     </td>
                     <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-3">
                           <div className="flex items-center gap-3">
                              <div className={`p-1.5 rounded-full transition-all duration-500 ${row.check_in_status === 'checked_in' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-300'}`}>
                                <Flag size={14} fill={row.check_in_status === 'checked_in' ? 'currentColor' : 'none'} />
                              </div>
                              <div className="min-w-[120px]">
                               {row.check_in_status === 'checked_in' ? (
                                 <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 font-black text-[8px] uppercase tracking-widest block text-center">🟢 Đã tới sân</span>
                               ) : (
                                 (() => {
                                   const now = new Date();
                                   const bookingDate = new Date(row.booking_date);
                                   const [startH, startM] = row.start_time.split(':').map(Number);
                                   const startTime = new Date(bookingDate.setHours(startH, startM, 0));
                                   const isOverdue = now > startTime && (row.status === 'confirmed' || row.status === 'paid');
                                   return (
                                     <span className={`px-3 py-1 rounded-lg border font-black text-[8px] uppercase tracking-widest block text-center transition-all duration-300 ${isOverdue ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                       {isOverdue ? '🔴 Quá giờ!' : '⚪ Chưa tới'}
                                     </span>
                                   );
                                 })()
                               )}
                             </div>
                           </div>

                           <div className="relative">
                            <button
                              onClick={(e) => { e.stopPropagation(); setOpenCheckInMenuId(openCheckInMenuId === row.id ? null : row.id); setOpenActionMenuId(null); }}
                              className={`w-7 h-7 rounded-lg transition-all border-none cursor-pointer flex items-center justify-center ${openCheckInMenuId === row.id ? 'bg-slate-900 text-white' : 'text-slate-300 hover:text-slate-900 hover:bg-slate-50 bg-transparent'}`}
                            >
                              <MoreVertical size={12} />
                            </button>

                            <AnimatePresence>
                              {openCheckInMenuId === row.id && (
                                <motion.div initial={{ opacity: 0, y: 5, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: 0.95 }} className="absolute right-0 top-9 w-40 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 p-1.5 text-left">
                                  <button
                                    onClick={() => handleUpdateCheckIn(row.id, row.check_in_status)}
                                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border-none cursor-pointer transition-all ${
                                      row.check_in_status === 'checked_in' 
                                        ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' 
                                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                    }`}
                                  >
                                    <span>{row.check_in_status === 'checked_in' ? 'Hủy Check-in' : 'Xác nhận Đã tới'}</span>
                                    {row.check_in_status === 'checked_in' ? <CheckCircle2 size={12} /> : <Loader2 size={12} />}
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                     </td>

                      {/* CỘT TRẠNG THÁI */}
                      <td className="px-4 py-4 text-center">
                         <div className="flex justify-center">
                            <BookingStatusBadge status={row.status} />
                         </div>
                      </td>

                      {/* CỘT THAO TÁC (3 CHẤM) */}
                      <td className="px-4 py-4 text-center">
                         <div className="relative flex justify-center">
                            <button
                              onClick={(e) => { e.stopPropagation(); setOpenActionMenuId(openActionMenuId === row.id ? null : row.id); setOpenCheckInMenuId(null); }}
                              className={`w-8 h-8 rounded-xl transition-all border-none cursor-pointer flex items-center justify-center ${openActionMenuId === row.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-300 hover:text-slate-900 hover:bg-slate-50 bg-transparent'}`}
                            >
                              <MoreVertical size={14} />
                            </button>

                            <button
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setSelectedBookingForEdit(row);
                                setIsEditModalOpen(true);
                                setOpenActionMenuId(null); 
                              }}
                              className="w-8 h-8 rounded-xl transition-all border-none cursor-pointer flex items-center justify-center text-blue-400 hover:text-blue-600 hover:bg-blue-50 bg-transparent"
                              title="Chỉnh sửa chi tiết"
                            >
                              <Pencil size={14} />
                            </button>

                            <AnimatePresence>
                              {openActionMenuId === row.id && (
                                <motion.div initial={{ opacity: 0, y: 5, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: 0.95 }} className="absolute right-0 top-10 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 p-1.5 text-left">
                                  {statusActions.map((action) => (
                                    <button
                                      key={action.status}
                                      onClick={() => handleUpdateStatus(row.id, action.status)}
                                      className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border-none cursor-pointer transition-all ${
                                        row.status === action.status 
                                          ? (action.status === 'cancelled' ? 'bg-red-50 text-red-700' : action.status === 'completed' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700') 
                                          : `bg-transparent ${action.color} ${action.hover}`
                                      }`}
                                    >
                                      <span>{action.label}</span>
                                      {row.status === action.status && <CheckCircle2 size={12} />}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                      </td>
                  </tr>
                )) : (
                    <tr><td colSpan="11" className="py-20 text-center font-black text-slate-200 uppercase italic tracking-widest">Không tìm thấy đơn đặt sân nào</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION LOGIC */}
          <div className="p-4 border-t border-slate-50 bg-white flex justify-between items-center flex-shrink-0 px-8">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Trang {currentPage} / {totalPages}</span>
              <div className="flex gap-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-none italic transition-all ${currentPage === 1 ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer'}`}
                  >
                    Trước
                  </button>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-none italic transition-all ${currentPage === totalPages ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-md shadow-emerald-900/10'}`}
                  >
                    Tiếp theo
                  </button>
              </div>
          </div>
      </div>

      <NewBookingModal 
        isOpen={isNewModalOpen} 
        onClose={() => setIsNewModalOpen(false)} 
      />

      <EditBookingModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        booking={selectedBookingForEdit}
        onUpdate={() => {
          fetchBookings();
          setIsEditModalOpen(false);
        }}
      />
    </motion.div>
  );
};

export default AdminBookings;
