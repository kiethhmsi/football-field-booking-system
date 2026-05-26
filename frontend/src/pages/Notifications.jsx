import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Clock, Info, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const loadAndMark = async () => {
            const data = await fetchNotifications();
            if (data && data.length > 0) {
                // Đánh dấu tất cả là đã đọc trên server
                await markAllAsRead(data);
            }
        };
        loadAndMark();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setNotifications(data.data);
                return data.data;
            }
        } catch (err) {
            console.error('Lỗi lấy thông báo:', err);
        } finally {
            setLoading(false);
        }
        return null;
    };

    const markAsRead = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const markAllAsRead = async (currentNotifs) => {
        try {
            const response = await fetch('http://localhost:3000/api/notifications/read-all', {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                // Cập nhật state dựa trên danh sách hiện tại thay vì state cũ
                const target = currentNotifs || notifications;
                setNotifications(target.map(n => ({ ...n, is_read: 1 })));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'match_accepted': return <CheckCircle className="text-emerald-500" size={24} />;
            case 'match_rejected': return <XCircle className="text-rose-500" size={24} />;
            case 'new_application': return <Bell className="text-blue-500" size={24} />;
            case 'booking_status': return <Info className="text-emerald-600" size={24} />;
            default: return <Info className="text-slate-400" size={24} />;
        }
    };

    if (loading) return <div className="p-20 text-center font-black uppercase italic text-emerald-800">Đang nạp thông báo...</div>;

    return (
        <div className="bg-[#f8fafc] min-h-screen py-12 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Thông báo</h2>
                        <p className="text-slate-500 font-medium">Cập nhật những tin tức mới nhất về các kèo đấu của bạn.</p>
                    </div>
                    {notifications.some(n => !n.is_read) && (
                        <button 
                            onClick={markAllAsRead}
                            className="flex items-center gap-2 bg-white text-emerald-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm hover:bg-emerald-50 transition-all border border-emerald-100 cursor-pointer"
                        >
                            <Check size={16} /> Đánh dấu đã đọc hết
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    <AnimatePresence>
                        {notifications.length === 0 ? (
                            <div className="bg-white rounded-[2rem] p-12 text-center border-2 border-dashed border-slate-100">
                                <Bell className="mx-auto text-slate-200 mb-4" size={48} />
                                <p className="text-slate-400 font-bold">Bạn không có thông báo nào.</p>
                            </div>
                        ) : (
                            notifications.map((notif, index) => (
                                <motion.div
                                    key={notif.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`relative bg-white rounded-3xl p-6 shadow-sm border-l-8 transition-all hover:shadow-md cursor-pointer ${notif.is_read ? 'border-slate-200 opacity-70' : 'border-emerald-500 shadow-emerald-100'}`}
                                    onClick={() => !notif.is_read && markAsRead(notif.id)}
                                >
                                    <div className="flex gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${notif.is_read ? 'bg-slate-50' : 'bg-emerald-50'}`}>
                                            {getIcon(notif.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className={`font-black uppercase text-sm ${notif.is_read ? 'text-slate-600' : 'text-slate-900'}`}>{notif.title}</h4>
                                                <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                    <Clock size={12} className="mr-1" />
                                                    {new Date(notif.created_at).toLocaleDateString('vi-VN')}
                                                </div>
                                            </div>
                                            <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                                {notif.message}
                                            </p>
                                        </div>
                                        {!notif.is_read && (
                                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
