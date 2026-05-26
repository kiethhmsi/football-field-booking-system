import React, { useState, useEffect } from 'react';
import UserSidebar from '../components/UserSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Users, Clock, MapPin, ChevronDown, ChevronUp, Calendar, Trophy, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MyMatches = () => {
    const { user } = useAuth();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedMatch, setExpandedMatch] = useState(null);
    const [applications, setApplications] = useState({});

    useEffect(() => {
        fetchMyMatches();
    }, []);

    const fetchMyMatches = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/matches/my-matches', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (response.ok) {
                setMatches(result.data);
            }
        } catch (err) {
            console.error('Lỗi lấy kèo của tôi:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMatch = async (matchId, e) => {
        e.stopPropagation(); // Ngăn chặn sự kiện click mở rộng card
        
        if (!window.confirm('Bạn có chắc chắn muốn xóa kèo đấu này? Mọi đơn ứng tuyển liên quan cũng sẽ bị xóa.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/matches/${matchId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                alert('Đã xóa kèo thành công!');
                setMatches(matches.filter(m => m.id !== matchId));
            } else {
                const result = await response.json();
                alert(result.message || 'Lỗi khi xóa kèo');
            }
        } catch (err) {
            console.error('Lỗi xóa kèo:', err);
            alert('Không thể kết nối đến máy chủ');
        }
    };

    const fetchApplications = async (matchId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/matches/${matchId}/applications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (response.ok) {
                setApplications(prev => ({ ...prev, [matchId]: result.data }));
            }
        } catch (err) {
            console.error('Lỗi lấy đơn ứng tuyển:', err);
        }
    };

    const handleToggleExpand = (matchId) => {
        if (expandedMatch === matchId) {
            setExpandedMatch(null);
        } else {
            setExpandedMatch(matchId);
            if (!applications[matchId]) {
                fetchApplications(matchId);
            }
        }
    };

    const handleUpdateStatus = async (appId, matchId, status) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/matches/applications/${appId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                alert(`Đã ${status === 'accepted' ? 'chấp nhận' : 'từ chối'} đơn ứng tuyển!`);
                fetchApplications(matchId);
                fetchMyMatches(); // Refresh match status (it might be closed now)
            }
        } catch (err) {
            console.error('Lỗi cập nhật trạng thái:', err);
        }
    };

    return (
        <div className="container" style={{ padding: '60px 20px', display: 'flex', gap: '40px', backgroundColor: '#f8fafc', minHeight: '100vh', textAlign: 'left' }}>
            <UserSidebar />

            <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>Quản lý kèo đấu</h1>
                <p style={{ color: '#64748b', marginBottom: '40px' }}>Nơi bạn quản lý các kèo đã đăng và duyệt đối thủ muốn giao lưu.</p>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px' }}>Đang tải dữ liệu...</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {matches.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-[3rem] bg-white/50">
                                <p className="text-slate-400 font-medium mb-4">Bạn chưa có kèo đấu nào đang diễn ra.</p>
                                {/* Thông tin gỡ lỗi */}
                                <div className="text-[10px] text-slate-300 font-mono bg-slate-50 px-4 py-2 rounded-full">
                                    Debug: User ID {user?.id || 'N/A'} | Role: {user?.role || 'N/A'} | Matches: 0
                                </div>
                            </div>
                        ) : (
                            matches.map(match => (
                                <div key={match.id} style={{ backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
                                    <div style={{ padding: '25px', display: 'flex', alignItems: 'center', justifyContent: 'between', cursor: 'pointer' }} onClick={() => handleToggleExpand(match.id)}>
                                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flex: 1 }}>
                                            <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <img src={match.team_logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${match.id}`} style={{ width: '30px' }} alt="logo" />
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0, fontWeight: 800, fontSize: '16px' }}>{match.title}</h4>
                                                <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
                                                    <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Calendar size={12} /> {new Date(match.match_date).toLocaleDateString('vi-VN')}
                                                    </span>
                                                    <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Clock size={12} /> {match.start_time.substring(0, 5)}
                                                    </span>
                                                    <span style={{ fontSize: '11px', fontWeight: 700, color: match.status === 'open' ? '#10b981' : '#64748b', textTransform: 'uppercase' }}>
                                                        {match.status === 'open' ? '• Đang mở' : '• Đã chốt đối'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <button 
                                                onClick={(e) => handleDeleteMatch(match.id, e)}
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fff1f2', color: '#e11d48', border: 'none', cursor: 'pointer', transition: 'all' }}
                                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ffe4e6'}
                                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff1f2'}
                                                title="Xóa kèo đấu"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <div style={{ color: '#94a3b8' }}>
                                                {expandedMatch === match.id ? <ChevronUp /> : <ChevronDown />}
                                            </div>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {expandedMatch === match.id && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                style={{ borderTop: '1px solid #f1f5f9', backgroundColor: '#fcfdfe' }}
                                            >
                                                <div style={{ padding: '25px' }}>
                                                    <h5 style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>
                                                        Danh sách ứng tuyển ({applications[match.id]?.length || 0})
                                                    </h5>
                                                    
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                        {applications[match.id]?.length === 0 ? (
                                                            <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>Chưa có ai ứng tuyển vào kèo này.</p>
                                                        ) : (
                                                            applications[match.id]?.map(app => (
                                                                <div key={app.id} style={{ backgroundColor: 'white', padding: '15px 20px', borderRadius: '15px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                                                        <img src={app.applicant_team_logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${app.id}`} style={{ width: '35px', height: '35px', borderRadius: '8px' }} alt="app-logo" />
                                                                        <div>
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                <p style={{ margin: 0, fontWeight: 700, fontSize: '14px' }}>{app.display_team_name || app.applicant_user_name}</p>
                                                                                {app.applicant_skill_level && (
                                                                                    <span style={{ fontSize: '9px', fontWeight: 900, backgroundColor: '#f0fdf4', color: '#166534', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                                                                                        {app.applicant_skill_level}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>"{app.message}"</p>
                                                                            {app.contact_phone && (
                                                                                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#0f172a', fontWeight: 700 }}>
                                                                                    📱 SĐT: {app.contact_phone}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                                        {app.status === 'pending' ? (
                                                                            <>
                                                                                <button 
                                                                                    onClick={() => handleUpdateStatus(app.id, match.id, 'accepted')}
                                                                                    style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                                                                                >
                                                                                    Chấp nhận
                                                                                </button>
                                                                                <button 
                                                                                    onClick={() => handleUpdateStatus(app.id, match.id, 'rejected')}
                                                                                    style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: '#ef4444', color: 'white', border: 'none', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                                                                                >
                                                                                    Từ chối
                                                                                </button>
                                                                            </>
                                                                        ) : (
                                                                            <span style={{ fontSize: '12px', fontWeight: 800, color: app.status === 'accepted' ? '#10b981' : '#ef4444', textTransform: 'uppercase' }}>
                                                                                {app.status === 'accepted' ? 'Đã chấp nhận' : 'Đã từ chối'}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyMatches;
