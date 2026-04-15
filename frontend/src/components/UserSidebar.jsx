import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const UserSidebar = () => {
    const activeStyle = {
        backgroundColor: 'white',
        color: 'var(--primary-color)',
        fontWeight: 800,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
    };

    const normalStyle = {
        color: '#64748b',
        fontWeight: 600
    };

    return (
        <div style={{
            width: '280px',
            backgroundColor: '#f0f9ff',
            borderRadius: '24px',
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            height: 'fit-content'
        }}>
            {/* USER INFO */}
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: '80px', height: '80px', backgroundColor: '#fb923c',
                    borderRadius: '50%', margin: '0 auto 15px', border: '4px solid white',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)', overflow: 'hidden'
                }}>
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 5px 0' }}>User Profile</h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Thành viên KaSport</p>
            </div>

            {/* NAVIGATION */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <NavLink 
                    to="/profile" 
                    style={({ isActive }) => ({
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '15px 20px',
                        textDecoration: 'none', borderRadius: '15px', fontSize: '15px',
                        transition: '0.3s',
                        ...(isActive ? activeStyle : normalStyle)
                    })}
                >
                    <span style={{fontSize: '20px'}}>👤</span> Hồ sơ cá nhân
                </NavLink>
                <NavLink 
                    to="/history" 
                    style={({ isActive }) => ({
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '15px 20px',
                        textDecoration: 'none', borderRadius: '15px', fontSize: '15px',
                        transition: '0.3s',
                        ...(isActive ? activeStyle : normalStyle)
                    })}
                >
                    <span style={{fontSize: '20px'}}>🕒</span> Lịch sử đặt sân
                </NavLink>
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #e0f2fe' }}>
                <Link to="/login" style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '15px 20px',
                    textDecoration: 'none', color: '#64748b', fontSize: '15px', fontWeight: 600
                }}>
                    <span style={{fontSize: '20px'}}>📤</span> Đăng xuất
                </Link>
            </div>
        </div>
    );
};

export default UserSidebar;
