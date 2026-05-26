import React from 'react';
import UserSidebar from '../components/UserSidebar';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Award, Calendar, Zap } from 'lucide-react';

const Profile = () => {
    const { user, isVip } = useAuth();

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Vô thời hạn';
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container" style={{ padding: '60px 20px', display: 'flex', gap: '40px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            {/* SIDEBAR */}
            <UserSidebar />

            {/* MAIN CONTENT */}
            <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>Hồ sơ cá nhân</h1>
                <p style={{ color: '#64748b', marginBottom: '40px' }}>Cập nhật thông tin chi tiết để nâng cao trải nghiệm đặt sân.</p>

                <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {/* PERSONAL INFO CARD */}
                    <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                            {/* AVATAR WITH CAMERA ICON */}
                            <div style={{ position: 'relative' }}>
                                <div style={{ 
                                    width: '150px', height: '150px', borderRadius: '30px', overflow: 'hidden', 
                                    border: isVip ? '5px solid #faea18' : '5px solid #f8fafc',
                                    boxShadow: isVip ? '0 10px 25px rgba(250,234,24,0.25)' : 'none'
                                }}>
                                    <img src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"} alt="profile" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                                </div>
                                <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', backgroundColor: '#10b981', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: '3px solid white', cursor: 'pointer' }}>
                                    📷
                                </div>
                            </div>

                            {/* FORM FIELDS */}
                            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ gridColumn: 'span 1' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>FULL NAME</label>
                                    <input type="text" readOnly defaultValue={user?.full_name || "Chưa cập nhật"} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: 'none', backgroundColor: '#f1f5f9', fontWeight: 600, color: '#64748b', outline: 'none', cursor: 'not-allowed' }} />
                                </div>
                                <div style={{ gridColumn: 'span 1' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>PHONE NUMBER</label>
                                    <input type="text" readOnly defaultValue={user?.phone_number || "Chưa cập nhật"} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: 'none', backgroundColor: '#f1f5f9', fontWeight: 600, color: '#64748b', outline: 'none', cursor: 'not-allowed' }} />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>EMAIL</label>
                                    <input type="email" readOnly defaultValue={user?.email || "Chưa cập nhật"} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: 'none', backgroundColor: '#f1f5f9', fontWeight: 600, color: '#64748b', outline: 'none', cursor: 'not-allowed' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* VIP STATUS CARD */}
                    {isVip ? (
                        <div style={{ 
                            background: 'linear-gradient(135deg, #012616 0%, #00140c 100%)', 
                            padding: '30px 40px', borderRadius: '30px', 
                            border: '1px solid rgba(250, 234, 24, 0.2)',
                            boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                            color: 'white',
                            textAlign: 'left'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                                <div>
                                    <span style={{ 
                                        display: 'inline-block', backgroundColor: '#faea18', color: '#002616', 
                                        padding: '4px 10px', borderRadius: '8px', fontSize: '10px', 
                                        fontWeight: 900, tracking: '0.15em', textTransform: 'uppercase', marginBottom: '12px'
                                    }}>⭐ THÀNH VIÊN VIP GOLD</span>
                                    <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'white', margin: '0 0 8px 0' }}>Đặc quyền đang hoạt động</h3>
                                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0, fontWeight: 500 }}>
                                        Bạn đang tận hưởng dịch vụ ưu tiên hiển thị bài đăng tìm đối, tìm đồng đội và giữ sân giờ đẹp tại KaSport Complex.
                                    </p>
                                </div>
                                <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '16px 24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Calendar size={20} className="text-[#faea18]" />
                                    <div>
                                        <p style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', margin: '0 0 2px 0', textTransform: 'uppercase', tracking: '1px' }}>HẠN SỬ DỤNG</p>
                                        <p style={{ fontSize: '13px', fontWeight: 800, color: 'white', margin: 0 }}>{formatDate(user?.vip_expire)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ 
                            backgroundColor: 'white', padding: '30px 40px', borderRadius: '30px', 
                            border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                            textAlign: 'left'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                                <div>
                                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Award size={24} className="text-amber-500" /> Nâng cấp VIP Gold
                                    </h3>
                                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0, maxWidth: '500px', fontWeight: 500, lineHeight: '1.6' }}>
                                        Đăng ký ngay hôm nay chỉ với **50.000đ / tháng** để nhận ưu tiên ghim bài ghép đối, thấy kèo mới sớm hơn 30 phút và đặt sân giờ vàng!
                                    </p>
                                </div>
                                <Link to="/vip-checkout" style={{ textDecoration: 'none' }}>
                                    <button style={{ 
                                        backgroundColor: '#10b981', color: 'white', padding: '16px 30px', 
                                        borderRadius: '16px', fontWeight: 800, fontSize: '11px', 
                                        letterSpacing: '1px', textTransform: 'uppercase', border: 'none', 
                                        cursor: 'pointer', boxShadow: '0 8px 20px rgba(16,185,129,0.2)',
                                        display: 'flex', alignItems: 'center', gap: '8px'
                                    }}>
                                        NÂNG CẤP NGAY <Zap size={14} />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
