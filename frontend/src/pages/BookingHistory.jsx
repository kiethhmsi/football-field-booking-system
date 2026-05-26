import React, { useState, useEffect } from 'react';
import UserSidebar from '../components/UserSidebar';
import { Link } from 'react-router-dom';
import { MoreVertical, RefreshCw, X, Star, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openActionMenuId, setOpenActionMenuId] = useState(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchHistory = async () => {
        setIsRefreshing(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/bookings/history', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const resData = await response.json();
            if (response.ok) {
                setBookings(resData.data);
            }
        } catch (error) {
            console.error("Lỗi lấy lịch sử:", error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy đơn đặt sân này không? Hành động này không thể hoàn tác.')) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/bookings/cancel/${id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                alert('Hủy đơn thành công!');
                setOpenActionMenuId(null);
                fetchHistory();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Không thể hủy đơn.');
            }
        } catch (error) {
            alert('Lỗi kết nối server.');
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!selectedBooking) return;
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/reviews', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    booking_id: selectedBooking.id,
                    rating,
                    comment
                })
            });
            const result = await response.json();
            if (response.ok) {
                alert('Cảm ơn bạn đã đánh giá!');
                setIsReviewModalOpen(false);
                setRating(5);
                setComment('');
                fetchHistory();
            } else {
                alert(result.message || 'Lỗi khi gửi đánh giá');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Lỗi kết nối hoặc Lỗi server: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getBookingStatusStyle = (status) => {
        const s = status ? status.toLowerCase() : '';
        switch (s) {
            case 'completed': return { bg: '#f0fdf4', color: '#166534', label: 'HOÀN THÀNH ĐƠN' };
            case 'confirmed': 
            case 'paid':
                return { bg: '#ecfdf5', color: '#166534', label: 'XÁC NHẬN ĐƠN' };
            case 'pending': 
            case 'pending_payment':
            case 'pending_confirmation':
            case 'awaiting_match':
                return { bg: '#fffbeb', color: '#92400e', label: 'CHỜ XÁC NHẬN' };
            case 'cancelled': return { bg: '#fef2f2', color: '#991b1b', label: 'HỦY ĐƠN' };
            default: return { bg: '#f1f5f9', color: '#64748b', label: 'ĐANG XỬ LÝ' };
        }
    };

    const getPaymentStatusStyle = (status, bookingStatus) => {
        switch (status) {
            case 'paid': return { bg: '#10b981', label: 'Đã thanh toán 100%' };
            case 'partial': return { bg: '#f59e0b', label: 'Đã cọc 50%' };
            default: 
                if (bookingStatus === 'pending' || bookingStatus === 'unconfirmed') {
                    return { bg: '#3b82f6', label: 'Đang chờ đối soát cọc' };
                }
                return { bg: '#94a3b8', label: 'Chưa thanh toán' };
        }
    };

    const getBookingNotice = (item) => {
        const status = item.status ? item.status.toLowerCase() : '';
        const paymentStatus = item.payment_status ? item.payment_status.toLowerCase() : '';

        switch (status) {
            case 'confirmed':
                return {
                    bg: '#ecfdf5',
                    border: '#bbf7d0',
                    color: '#166534',
                    title: 'Sân của bạn đã được admin xác nhận',
                    message: 'Bạn có thể đến sân đúng khung giờ đã đặt. Vui lòng giữ mã booking để đối chiếu khi cần.'
                };
            case 'cancelled':
                return {
                    bg: '#fef2f2',
                    border: '#fecaca',
                    color: '#991b1b',
                    title: 'Đơn đặt sân đã bị hủy',
                    message: 'Lịch này không còn hiệu lực. Bạn có thể đặt sân khác hoặc liên hệ HKSPORT nếu cần hỗ trợ.'
                };
            case 'completed':
                return {
                    bg: '#f0fdf4',
                    border: '#bbf7d0',
                    color: '#166534',
                    title: 'Lịch đặt sân đã hoàn thành',
                    message: 'Cảm ơn bạn đã sử dụng dịch vụ của HKSPORT. Bạn có thể để lại đánh giá về trải nghiệm của mình.'
                };
            case 'pending':
            default:
                return {
                    bg: paymentStatus === 'partial' ? '#fffbeb' : '#f8fafc',
                    border: paymentStatus === 'partial' ? '#fde68a' : '#e2e8f0',
                    color: paymentStatus === 'partial' ? '#92400e' : '#475569',
                    title: paymentStatus === 'partial' ? 'Đã ghi nhận cọc, đang chờ admin xác nhận' : 'Đơn đang chờ admin xác nhận',
                    message: 'Khi admin duyệt hoặc hủy, trạng thái tại đây sẽ được cập nhật ngay khi bạn mở lại hoặc bấm làm mới.'
                };
        }
    };

    const statusSummary = bookings.reduce((summary, item) => {
        const status = item.status ? item.status.toLowerCase() : 'unknown';
        
        // Nhóm các trạng thái "Chờ"
        if (['pending', 'pending_payment', 'pending_confirmation', 'awaiting_match'].includes(status)) {
            summary['pending'] = (summary['pending'] || 0) + 1;
        } 
        // Nhóm các trạng thái "Đã xác nhận"
        else if (['confirmed', 'paid'].includes(status)) {
            summary['confirmed'] = (summary['confirmed'] || 0) + 1;
        }
        else {
            summary[status] = (summary[status] || 0) + 1;
        }
        return summary;
    }, {});

    const toggleActionMenu = (id) => {
        setOpenActionMenuId((currentId) => currentId === id ? null : id);
    };

    return (
        <div className="container" style={{ padding: '60px 20px', display: 'flex', gap: '40px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <UserSidebar />

            <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>Lịch sử đặt sân</h1>
                        <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>Theo dõi trạng thái và quản lý danh sách đặt sân của bạn.</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={fetchHistory}
                        disabled={isRefreshing}
                        style={{ 
                            border: 'none', 
                            backgroundColor: '#0d8341', 
                            color: 'white', 
                            padding: '13px 22px', 
                            borderRadius: '16px', 
                            fontWeight: 900, 
                            fontSize: '12px', 
                            cursor: isRefreshing ? 'not-allowed' : 'pointer', 
                            boxShadow: '0 10px 24px rgba(13, 131, 65, 0.18)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                        {isRefreshing ? 'ĐANG CẬP NHẬT...' : 'LÀM MỚI TRẠNG THÁI'}
                    </motion.button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <div className="loading-spinner"></div>
                        <p style={{ fontWeight: 700, color: '#94a3b8', marginTop: '20px' }}>ĐANG TẢI DỮ LIỆU...</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div style={{ backgroundColor: 'white', padding: '100px 40px', borderRadius: '40px', textAlign: 'center', border: '2px dashed #e2e8f0' }}>
                        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🍃</div>
                        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>Lịch sử trống trải quá!</h3>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '30px' }}>Bạn chưa có đơn đặt sân nào. Hãy ra sân ngay hôm nay nhé.</p>
                        <Link to="/fields" style={{ backgroundColor: '#0d8341', color: 'white', padding: '15px 40px', borderRadius: '20px', textDecoration: 'none', fontWeight: 800, display: 'inline-block' }}>Đặt sân ngay</Link>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '22px' }}>
                            {[
                                { label: 'Chờ xác nhận', value: statusSummary.pending || 0, color: '#92400e', bg: '#fffbeb' },
                                { label: 'Xác nhận đơn', value: statusSummary.confirmed || 0, color: '#166534', bg: '#ecfdf5' },
                                { label: 'Hủy đơn', value: statusSummary.cancelled || 0, color: '#991b1b', bg: '#fef2f2' },
                                { label: 'Hoàn thành đơn', value: statusSummary.completed || 0, color: '#166534', bg: '#f0fdf4' }
                            ].map((item) => (
                                <div key={item.label} style={{ backgroundColor: item.bg, borderRadius: '20px', padding: '18px', border: '1px solid rgba(15, 23, 42, 0.06)' }}>
                                    <p style={{ margin: '0 0 8px', color: item.color, fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}>{item.label}</p>
                                    <p style={{ margin: 0, color: item.color, fontSize: '28px', fontWeight: 900 }}>{item.value}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '40px' }}>
                            {bookings.map((item) => {
                                const bStatus = getBookingStatusStyle(item.status);
                                const pStatus = getPaymentStatusStyle(item.payment_status, item.status);
                                const notice = getBookingNotice(item);
                                
                                return (
                                    <div key={item.id} style={{ backgroundColor: 'white', borderRadius: '30px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ flex: 1, minWidth: '300px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px', flexWrap: 'wrap' }}>
                                                    <span style={{ fontSize: '10px', fontWeight: 900, color: 'white', backgroundColor: '#0f172a', padding: '4px 10px', borderRadius: '8px' }}>{item.booking_code}</span>
                                                    <span style={{ backgroundColor: bStatus.bg, color: bStatus.color, padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 900 }}>{bStatus.label}</span>
                                                </div>
                                                <h3 style={{ margin: '0 0 10px 0', fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>{item.field_name} | <span style={{ color: '#0d8341' }}>{new Date(item.booking_date).toLocaleDateString('vi-VN')}</span></h3>
                                                <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#64748b', fontWeight: 600, flexWrap: 'wrap' }}>
                                                    <span>{item.start_time.substring(0, 5)} - {item.end_time.substring(0, 5)}</span>
                                                    <span style={{ color: pStatus.bg }}>{pStatus.label}</span>
                                                </div>
                                            </div>

                                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-end', position: 'relative' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    <div>
                                                        <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Tổng tiền</p>
                                                        <p style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>{item.total_price.toLocaleString()}đ</p>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <p style={{ margin: 0, fontSize: '9px', color: '#0d8341', fontWeight: 800, textTransform: 'uppercase' }}>Đã cọc</p>
                                                            <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#0d8341' }}>{Number(item.deposit_amount || 0).toLocaleString()}đ</p>
                                                        </div>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <p style={{ margin: 0, fontSize: '9px', color: '#991b1b', fontWeight: 800, textTransform: 'uppercase' }}>Còn lại</p>
                                                            <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#991b1b' }}>{(Number(item.total_price) - Number(item.deposit_amount || 0)).toLocaleString()}đ</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => toggleActionMenu(item.id)}
                                                    style={{ width: '34px', height: '34px', borderRadius: '999px', border: 'none', backgroundColor: openActionMenuId === item.id ? '#0d8341' : '#f8fafc', color: openActionMenuId === item.id ? 'white' : '#64748b', display: 'flex', alignItems: 'center', justifyCenter: 'center', cursor: 'pointer' }}
                                                >
                                                    <MoreVertical size={18} />
                                                </button>

                                                {openActionMenuId === item.id && (
                                                    <div style={{ position: 'absolute', right: 0, top: '86px', width: '220px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', boxShadow: '0 24px 60px rgba(15, 23, 42, 0.16)', padding: '8px', zIndex: 20 }}>
                                                        <button onClick={() => { fetchHistory(); setOpenActionMenuId(null); }} style={{ width: '100%', border: 'none', backgroundColor: 'transparent', color: '#334155', padding: '12px', borderRadius: '14px', fontWeight: 800, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <RefreshCw size={15} /> Làm mới trạng thái
                                                        </button>
                                                        {(item.status === 'pending' || item.status === 'confirmed') && (
                                                            <button onClick={() => handleCancel(item.id)} style={{ width: '100%', border: 'none', backgroundColor: 'transparent', color: '#991b1b', padding: '12px', borderRadius: '14px', fontWeight: 800, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                <X size={15} /> Hủy sân
                                                            </button>
                                                        )}
                                                        {item.status === 'completed' && (
                                                            <button 
                                                                onClick={() => {
                                                                    setSelectedBooking(item);
                                                                    setIsReviewModalOpen(true);
                                                                    setOpenActionMenuId(null);
                                                                }} 
                                                                style={{ width: '100%', border: 'none', backgroundColor: '#ecfdf5', color: '#0d8341', padding: '12px', borderRadius: '14px', fontWeight: 800, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                                                            >
                                                                <Star size={15} /> Đánh giá ngay
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '22px', backgroundColor: notice.bg, border: `1px solid ${notice.border}`, color: notice.color, borderRadius: '22px', padding: '18px 20px' }}>
                                            <p style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 900 }}>{notice.title}</p>
                                            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, fontWeight: 600 }}>{notice.message}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* REVIEW MODAL */}
            <AnimatePresence>
                {isReviewModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsReviewModalOpen(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)' }} />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} style={{ position: 'relative', backgroundColor: 'white', borderRadius: '40px', width: '100%', maxWidth: '450px', padding: '40px', boxShadow: '0 40px 100px rgba(0,0,0,0.1)' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ width: '80px', height: '80px', backgroundColor: '#fef3c7', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                    <Star size={40} fill="#f59e0b" color="#f59e0b" />
                                </div>
                                <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', marginBottom: '8px', textTransform: 'uppercase', fontStyle: 'italic' }}>Đánh giá trải nghiệm</h2>
                                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px', fontWeight: 600 }}>Chia sẻ cảm nhận của bạn về {selectedBooking?.field_name}</p>
                                
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '32px' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} onClick={() => setRating(star)} style={{ border: 'none', background: 'none', cursor: 'pointer', transition: 'transform 0.2s' }} className="star-btn">
                                            <Star size={36} fill={star <= rating ? "#f59e0b" : "none"} color={star <= rating ? "#f59e0b" : "#e2e8f0"} strokeWidth={3} />
                                        </button>
                                    ))}
                                </div>

                                <textarea 
                                    placeholder="Sân bóng chất lượng thế nào? Bạn có hài lòng không..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #f1f5f9', borderRadius: '24px', padding: '20px', minHeight: '120px', outline: 'none', fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '32px', transition: 'border-color 0.2s', resize: 'none' }}
                                />

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button onClick={() => setIsReviewModalOpen(false)} style={{ flex: 1, padding: '18px', borderRadius: '20px', border: '2px solid #f1f5f9', backgroundColor: 'white', color: '#64748b', fontWeight: 800, fontSize: '12px', cursor: 'pointer', textTransform: 'uppercase' }}>Để sau</button>
                                    <button 
                                        onClick={handleReviewSubmit}
                                        disabled={isSubmitting}
                                        style={{ flex: 2, padding: '18px', borderRadius: '20px', border: 'none', backgroundColor: '#0d8341', color: 'white', fontWeight: 900, fontSize: '12px', cursor: isSubmitting ? 'not-allowed' : 'pointer', textTransform: 'uppercase', boxShadow: '0 12px 30px rgba(13, 131, 65, 0.2)' }}
                                    >
                                        {isSubmitting ? 'ĐANG GỬI...' : 'GỬI ĐÁNH GIÁ'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BookingHistory;
