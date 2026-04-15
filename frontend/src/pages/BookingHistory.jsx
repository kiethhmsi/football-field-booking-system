import React, { useState } from 'react';
import UserSidebar from '../components/UserSidebar';
import { Link } from 'react-router-dom';

const BookingHistory = () => {
    const [bookings] = useState([
        { id: 'SB-2026-69723', field: 'Sân 7 - A1', date: '20/05/2024', time: '18:00 - 19:30', price: '650.000 VNĐ', status: 'completed' },
        { id: 'SB-2026-70142', field: 'Sân 5 - B3', date: '25/05/2024', time: '19:30 - 20:30', price: '450.000 VNĐ', status: 'confirmed' },
        { id: 'SB-2026-68211', field: 'Sân 11 - Pro Max', date: '15/05/2024', time: '06:00 - 08:00', price: '1.200.000 VNĐ', status: 'cancelled' }
    ]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed': return { bg: '#dcfce7', color: '#166534', label: 'ĐÃ HOÀN THÀNH' };
            case 'confirmed': return { bg: '#e0f2fe', color: '#0369a1', label: 'ĐÃ XÁC NHẬN' };
            case 'cancelled': return { bg: '#fee2e2', color: '#991b1b', label: 'ĐÃ HỦY' };
            default: return { bg: '#f1f5f9', color: '#64748b', label: 'CHỜ XỬ LÝ' };
        }
    };

    return (
        <div className="container" style={{ padding: '60px 20px', display: 'flex', gap: '40px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            {/* SIDEBAR */}
            <UserSidebar />

            {/* MAIN CONTENT */}
            <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', marginBottom: '40px' }}>Lịch sử đặt sân</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
                    {bookings.map((item, idx) => {
                        const status = getStatusStyle(item.status);
                        return (
                            <div key={idx} style={{ backgroundColor: 'white', borderRadius: '25px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', position: 'relative', overflow: 'hidden' }}>
                                {/* SIDE ACCENT */}
                                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: item.status === 'completed' ? '#10b981' : item.status === 'confirmed' ? '#0369a1' : '#ef4444' }}></div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>MÃ ĐƠN: {item.id}</p>
                                        <h3 style={{ margin: '5px 0', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{item.field}</h3>
                                    </div>
                                    <span style={{ backgroundColor: status.bg, color: status.color, padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 800 }}>{status.label}</span>
                                </div>

                                <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#64748b', marginBottom: '25px' }}>
                                    <span>📅 {item.date}</span>
                                    <span>🕒 {item.time}</span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>THÀNH TIỀN</p>
                                        <p style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#10b981' }}>{item.price}</p>
                                    </div>
                                    
                                    {item.status === 'cancelled' ? (
                                        <button style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            Đặt lại 🔄
                                        </button>
                                    ) : item.status === 'completed' ? (
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginBottom: '5px' }}>ĐÁNH GIÁ SÂN</p>
                                            <div style={{ color: '#fbbf24', fontSize: '16px' }}>⭐⭐⭐⭐⭐</div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* BOTTOM BANNER */}
                <div style={{ backgroundColor: '#f0fdf4', border: '2px dashed #bbf7d0', borderRadius: '30px', padding: '40px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#064e3b', marginBottom: '10px' }}>Bạn muốn ra sân hôm nay?</h3>
                    <p style={{ color: '#065f46', fontSize: '14px', marginBottom: '25px' }}>Tìm ngay sân trống và bắt đầu trận cầu của bạn cùng đồng đội.</p>
                    <Link to="/fields" className="btn btn-primary" style={{ padding: '15px 40px', borderRadius: '25px', display: 'inline-block', textDecoration: 'none' }}>Đặt sân ngay</Link>
                </div>
            </div>
        </div>
    );
};

export default BookingHistory;
