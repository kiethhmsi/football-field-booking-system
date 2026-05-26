import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Plus, Users, Calendar, MapPin, Search, Edit3, Trash2, CheckCircle, XCircle, Zap, ArrowRight, Settings, CreditCard, MoreVertical } from 'lucide-react';

export default function AdminTournaments() {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [activeTab, setActiveTab] = useState('list'); // 'list', 'edit', 'manage'
    const [registrations, setRegistrations] = useState([]);
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/tournaments');
            const result = await response.json();
            if (result.success) setTournaments(result.data);
        } catch (error) {
            console.error('Lỗi fetch tournaments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleManage = async (tourney) => {
        setSelectedTournament(tourney);
        setActiveTab('manage');
        fetchDetails(tourney.id);
    };

    const fetchDetails = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/tournaments/${id}`);
            const result = await response.json();
            if (result.success) {
                setRegistrations(result.data.teams || []);
                setMatches(result.data.matches || []);
            }
        } catch (error) {
            console.error('Lỗi fetch details:', error);
        }
    };

    const handleUpdateRegistration = async (regId, status) => {
        try {
            const response = await fetch(`http://localhost:3000/api/tournaments/registrations/${regId}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status })
            });
            if (response.ok) fetchDetails(selectedTournament.id);
        } catch (error) {
            console.error('Lỗi update registration:', error);
        }
    };

    const handleGenerateBracket = async () => {
        if (!window.confirm('Hệ thống sẽ tự động bắt cặp các đội đã duyệt. Tiếp tục?')) return;
        try {
            const response = await fetch(`http://localhost:3000/api/tournaments/${selectedTournament.id}/generate-bracket`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const result = await response.json();
            if (result.success) fetchDetails(selectedTournament.id);
            else alert(result.message);
        } catch (error) {
            console.error('Lỗi generate bracket:', error);
        }
    };

    const handleUpdateScore = async (matchId, scoreA, scoreB, isFinished) => {
        try {
            const response = await fetch(`http://localhost:3000/api/tournaments/matches/${matchId}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ 
                    score_a: scoreA, 
                    score_b: scoreB, 
                    status: isFinished ? 'finished' : 'scheduled' 
                })
            });
            if (response.ok) fetchDetails(selectedTournament.id);
        } catch (error) {
            console.error('Lỗi update score:', error);
        }
    };

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTourney, setNewTourney] = useState({
        title: '', banner_url: '', location: '', start_date: '', max_teams: 8, prize_pool: '', entry_fee: '', rules: ''
    });

    const handleCreateTournament = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/tournaments', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newTourney)
            });
            if (response.ok) {
                setShowCreateModal(false);
                fetchTournaments();
            }
        } catch (error) {
            console.error('Lỗi tạo giải:', error);
        }
    };

    const handleDeleteTournament = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa giải đấu này? Thao tác này sẽ xóa tất cả các trận đấu và thông tin đăng ký liên quan.')) return;
        try {
            const response = await fetch(`http://localhost:3000/api/tournaments/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const result = await response.json();
            if (response.ok && result.success) {
                alert('Đã xóa giải đấu thành công!');
                fetchTournaments();
            } else {
                alert(result.message || 'Lỗi khi xóa giải đấu');
            }
        } catch (error) {
            console.error('Lỗi xóa giải:', error);
            alert('Lỗi server khi xóa giải đấu');
        }
    };

    const [allRegistrations, setAllRegistrations] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);

    useEffect(() => {
        if (selectedTournament) fetchAllRegistrations();
    }, [selectedTournament]);

    const fetchAllRegistrations = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/tournaments/${selectedTournament.id}/all-registrations`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (data.success) setAllRegistrations(data.data);
        } catch (err) { console.error(err); }
    };

    const handleManualConfirm = async (regId) => {
        if (!window.confirm('Xác nhận đã nhận tiền và cho phép đội này tham gia giải?')) return;
        try {
            const res = await fetch(`http://localhost:3000/api/tournaments/registrations/${regId}/manual-confirm`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                fetchAllRegistrations();
                fetchRegistrations(); // Refetch confirmed teams
                setOpenMenuId(null);
                alert('Xác nhận thành công!');
            }
        } catch (err) { alert('Lỗi xác nhận'); }
    };

    const handleCancelRegistration = async (regId) => {
        if (!window.confirm('Bạn có chắc muốn hủy đơn đăng ký này?')) return;
        try {
            const res = await fetch(`http://localhost:3000/api/tournaments/registrations/${regId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                fetchAllRegistrations();
                setOpenMenuId(null);
            }
        } catch (err) { alert('Lỗi xóa đơn'); }
    };

    if (activeTab === 'manage' && selectedTournament) {
        return (
            <div className="space-y-6" onClick={() => setOpenMenuId(null)}>
                <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setActiveTab('list')} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-emerald-600 transition-all border-none cursor-pointer">
                            <ArrowRight size={18} className="rotate-180" />
                        </button>
                        <div>
                            <h2 className="text-xl font-black italic uppercase tracking-tighter text-gray-900">{selectedTournament.title}</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trạng thái: <span className="text-emerald-600">{selectedTournament.status}</span></p>
                        </div>
                    </div>
                    {selectedTournament.status === 'registration' && (
                        registrations.filter(r => r.status === 'confirmed').length >= selectedTournament.max_teams ? (
                            <button 
                                onClick={handleGenerateBracket}
                                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100 flex items-center gap-2 border-none cursor-pointer"
                            >
                                <Zap size={14} /> Xếp lịch thi đấu
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-100">
                                <Users size={14} />
                                <span className="text-[9px] font-black uppercase tracking-widest">
                                    Chờ đủ đội ({registrations.filter(r => r.status === 'confirmed').length}/{selectedTournament.max_teams})
                                </span>
                            </div>
                        )
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 1. Lịch sử thanh toán PayOS (Mới) */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-black italic uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-2">
                            <CreditCard size={18} className="text-emerald-500" /> Tiến độ thanh toán
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50">
                                        <th className="pb-4 text-[10px] font-black uppercase text-gray-400">Đội bóng</th>
                                        <th className="pb-4 text-[10px] font-black uppercase text-gray-400 text-center">Trạng thái</th>
                                        <th className="pb-4 text-[10px] font-black uppercase text-gray-400 text-right">Lệ phí</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allRegistrations.map(reg => (
                                        <tr key={reg.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all group">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden"><img src={reg.team_logo_url} className="w-full h-full object-cover" /></div>
                                                    <div>
                                                        <span className="text-xs font-black uppercase tracking-tighter block">{reg.team_name}</span>
                                                        <span className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">{reg.captain_name} - {reg.phone}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 text-center relative">
                                                <div className="flex items-center justify-center gap-4">
                                                    <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                                                        reg.payment_status === 'paid' ? 'bg-emerald-500 text-white' : 
                                                        reg.payment_status === 'failed' ? 'bg-rose-500 text-white' : 
                                                        'bg-amber-500 text-white'
                                                    }`}>
                                                        {reg.payment_status === 'paid' ? 'Đã thanh toán' : reg.payment_status === 'failed' ? 'Thanh toán lỗi' : 'Chờ xử lý'}
                                                    </span>
                                                    
                                                    <div className="relative">
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === reg.id ? null : reg.id); }}
                                                            className="w-8 h-8 bg-gray-50 text-gray-400 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-all border-none cursor-pointer"
                                                        >
                                                            <MoreVertical size={14} />
                                                        </button>

                                                        {openMenuId === reg.id && (
                                                            <motion.div 
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="absolute right-0 top-10 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[110] overflow-hidden p-2"
                                                            >
                                                                <button onClick={() => handleManualConfirm(reg.id)} className="w-full text-left p-3 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-all border-none bg-transparent cursor-pointer flex items-center justify-between group">
                                                                    <span className="text-[10px] font-black uppercase tracking-widest">Xác nhận đơn</span>
                                                                    <CheckCircle size={14} />
                                                                </button>
                                                                <button onClick={() => handleCancelRegistration(reg.id)} className="w-full text-left p-3 hover:bg-rose-50 text-rose-600 rounded-xl transition-all border-none bg-transparent cursor-pointer flex items-center justify-between group">
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">Hủy đơn</span>
                                                                    <XCircle size={14} />
                                                                </button>
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 text-right">
                                                <span className="text-xs font-black text-gray-900">{Number(reg.amount).toLocaleString()}đ</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 2. Đội đã vào giải */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-black italic uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-2">
                            <Users size={18} className="text-emerald-500" /> Đội đã vào giải ({registrations.length})
                        </h3>
                        <div className="space-y-4">
                            {registrations.map(reg => (
                                <div key={reg.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent">
                                    <div className="w-10 h-10 bg-white rounded-xl overflow-hidden border border-gray-100">
                                        <img src={reg.logo_url} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase italic tracking-tighter text-gray-900">{reg.name}</p>
                                        <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Đã xác nhận</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Quản lý tỉ số */}
                    <div className="lg:col-span-3 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mt-6">
                        <h3 className="text-sm font-black italic uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-2">
                            <Calendar size={18} className="text-emerald-500" /> Quản lý tỉ số & Sơ đồ
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {matches.filter(m => m.team_a_id && m.team_b_id).map(match => (
                                <div key={match.id} className="p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-emerald-100 transition-all space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md">{match.round}</span>
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${match.status === 'finished' ? 'text-gray-400' : 'text-orange-500'}`}>{match.status === 'finished' ? 'Đã kết thúc' : 'Đang diễn ra'}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-6">
                                        <div className="flex-1 text-right">
                                            <p className="text-[10px] font-black uppercase italic tracking-tighter text-gray-900">{match.team_a_name}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="number" 
                                                className="w-10 h-10 bg-white border border-gray-200 rounded-lg text-center font-black text-sm text-emerald-600"
                                                defaultValue={match.score_a}
                                                onBlur={(e) => handleUpdateScore(match.id, parseInt(e.target.value), match.score_b, false)}
                                                disabled={match.status === 'finished'}
                                            />
                                            <span className="text-gray-300">-</span>
                                            <input 
                                                type="number" 
                                                className="w-10 h-10 bg-white border border-gray-200 rounded-lg text-center font-black text-sm text-emerald-600"
                                                defaultValue={match.score_b}
                                                onBlur={(e) => handleUpdateScore(match.id, match.score_a, parseInt(e.target.value), false)}
                                                disabled={match.status === 'finished'}
                                            />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-[10px] font-black uppercase italic tracking-tighter text-gray-900">{match.team_b_name}</p>
                                        </div>
                                    </div>
                                    {match.status !== 'finished' && (
                                        <button 
                                            onClick={() => handleUpdateScore(match.id, match.score_a, match.score_b, true)}
                                            className="w-full py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all border-none cursor-pointer"
                                        >
                                            Kết thúc trận đấu
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Quản lý giải đấu</h2>
                    <p className="text-slate-400 text-[10px] font-black mt-2 uppercase tracking-[0.2em]">Khởi tạo và vận hành các giải đấu chuyên nghiệp</p>
                </div>
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg shadow-emerald-900/10 border-none cursor-pointer active:scale-95 italic"
                >
                    <Plus size={18} /> Tạo giải đấu mới
                </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {loading ? (
                    [1,2,3].map(i => (
                        <div key={i} className="bg-white h-64 rounded-[2.5rem] border border-gray-100 animate-pulse"></div>
                    ))
                ) : tournaments.map(tourney => (
                    <motion.div 
                        key={tourney.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
                    >
                        <div className="h-32 bg-slate-100 relative">
                            <img src={tourney.banner_url} alt="Banner" className="w-full h-full object-cover" />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100">
                                {tourney.status}
                            </div>
                        </div>
                        <div className="p-8 text-left">
                            <h3 className="text-xl font-black italic uppercase tracking-tighter text-gray-900 mb-4">{tourney.title}</h3>
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <MapPin size={14} className="text-emerald-500" />
                                    <span className="text-[11px] font-bold">{tourney.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Users size={14} className="text-emerald-500" />
                                    <span className="text-[11px] font-bold">{tourney.current_teams}/{tourney.max_teams} Đội</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Calendar size={14} className="text-emerald-500" />
                                    <span className="text-[11px] font-bold">{new Date(tourney.start_date).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleManage(tourney)} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all border-none cursor-pointer shadow-lg shadow-emerald-100 flex items-center justify-center gap-2">
                                    <Settings size={14} /> Quản lý
                                </button>
                                <button onClick={() => handleDeleteTournament(tourney.id)} className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all border-none cursor-pointer">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreateModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden text-left">
                            <form onSubmit={handleCreateTournament} className="p-10 space-y-6">
                                <h3 className="text-2xl font-black italic uppercase mb-2">Tạo giải đấu mới</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Tên giải đấu</label>
                                        <input required className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold" value={newTourney.title} onChange={e => setNewTourney({...newTourney, title: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Ngày bắt đầu</label>
                                        <input type="date" required className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold" value={newTourney.start_date} onChange={e => setNewTourney({...newTourney, start_date: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Số đội tối đa</label>
                                        <input type="number" required className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold" value={newTourney.max_teams} onChange={e => setNewTourney({...newTourney, max_teams: e.target.value})} />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Địa điểm</label>
                                        <input required className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold" value={newTourney.location} onChange={e => setNewTourney({...newTourney, location: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Giải thưởng</label>
                                        <input className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold" value={newTourney.prize_pool} onChange={e => setNewTourney({...newTourney, prize_pool: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Lệ phí</label>
                                        <input className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold" value={newTourney.entry_fee} onChange={e => setNewTourney({...newTourney, entry_fee: e.target.value})} />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Link Banner</label>
                                        <input className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold" value={newTourney.banner_url} onChange={e => setNewTourney({...newTourney, banner_url: e.target.value})} />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Luật thi đấu</label>
                                        <textarea rows={4} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold" value={newTourney.rules} onChange={e => setNewTourney({...newTourney, rules: e.target.value})} />
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 border-none cursor-pointer">Khởi tạo ngay</button>
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="px-8 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest border-none cursor-pointer">Hủy</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
