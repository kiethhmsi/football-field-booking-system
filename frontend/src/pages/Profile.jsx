import React from 'react';
import UserSidebar from '../components/UserSidebar';

const Profile = () => {
    return (
        <div className="container" style={{ padding: '60px 20px', display: 'flex', gap: '40px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            {/* SIDEBAR */}
            <UserSidebar />

            {/* MAIN CONTENT */}
            <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>Hồ sơ cá nhân</h1>
                <p style={{ color: '#64748b', marginBottom: '40px' }}>Cập nhật thông tin chi tiết để nâng cao trải nghiệm đặt sân.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                    {/* LEFT PANEL: PERSONAL INFO */}
                    <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                            {/* AVATAR WITH CAMERA ICON */}
                            <div style={{ position: 'relative' }}>
                                <div style={{ width: '150px', height: '150px', borderRadius: '30px', overflow: 'hidden', border: '5px solid #f8fafc' }}>
                                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop" alt="profile" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                                </div>
                                <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', backgroundColor: '#10b981', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: '3px solid white', cursor: 'pointer' }}>
                                    📷
                                </div>
                            </div>

                            {/* FORM FIELDS */}
                            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ gridColumn: 'span 1' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>FULL NAME</label>
                                    <input type="text" defaultValue="Nguyễn Minh Anh" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: 'none', backgroundColor: '#f0f9ff', fontWeight: 600, color: '#0f172a', outline: 'none' }} />
                                </div>
                                <div style={{ gridColumn: 'span 1' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>PHONE NUMBER</label>
                                    <input type="text" defaultValue="0987 654 321" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: 'none', backgroundColor: '#f0f9ff', fontWeight: 600, color: '#0f172a', outline: 'none' }} />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>EMAIL</label>
                                    <input type="email" defaultValue="minhanh.sports@example.com" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: 'none', backgroundColor: '#f0f9ff', fontWeight: 600, color: '#0f172a', outline: 'none' }} />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>ADDRESS</label>
                                    <textarea rows="3" defaultValue="123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: 'none', backgroundColor: '#f0f9ff', fontWeight: 600, color: '#0f172a', outline: 'none', resize: 'none' }} />
                                </div>
                                <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                                    <button style={{ backgroundColor: '#0d8341', color: 'white', padding: '14px 30px', borderRadius: '15px', border: 'none', fontWeight: 700, cursor: 'pointer', transition: '0.3s' }}>Cập nhật thông tin</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: STATS & SECURITY */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* STATS 1 */}
                        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '30px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', marginBottom: '10px' }}>BOOKED MATCHES</p>
                                <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0d8341', margin: 0 }}>24</h2>
                            </div>
                            <div style={{ fontSize: '30px', backgroundColor: '#f0fdf4', width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚽</div>
                        </div>

                        {/* STATS 2 */}
                        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '30px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', marginBottom: '10px' }}>LOYALTY POINTS</p>
                                <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a', margin: 0 }}>1,250</h2>
                            </div>
                            <div style={{ fontSize: '30px', backgroundColor: '#eff6ff', width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⭐</div>
                        </div>

                        {/* SECURITY AREA */}
                        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '30px', border: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Bảo mật tài khoản</h3>
                                <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800 }}>VERIFIED</span>
                            </div>
                            <button style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#f8fafc', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}>
                                🔒 Thay đổi mật khẩu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
