import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Tự động kiểm tra Token và lấy thông tin User khi khởi chạy
    useEffect(() => {
        if (token) {
            fetchUserProfile(token);
        } else {
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    const fetchUserProfile = async (authToken) => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            const data = await response.json();
            
            if (response.ok) {
                setUser(data.user);
            } else {
                logout();
            }
        } catch (err) {
            console.error('Lỗi lấy thông tin người dùng:', err);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (phone_number, password) => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone_number, password })
            });
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
                setUser(data.user);
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message || 'Sai tài khoản hoặc mật khẩu' };
            }
        } catch (err) {
            return { success: false, message: 'Không thể kết nối tới máy chủ. Hãy kiểm tra Backend!' };
        }
    };

    const register = async (userData) => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            
            if (response.ok) {
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message || 'Đăng ký thất bại' };
            }
        } catch (err) {
            return { success: false, message: 'Lỗi kết nối máy chủ' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        // Không dùng window.location.href để tránh reload trang đột ngột
    };

    const upgradeToVIP = async () => {
        try {
            if (!token) return { success: false, message: 'Vui lòng đăng nhập để nâng cấp VIP' };
            const response = await fetch('http://localhost:3000/api/auth/upgrade-vip', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setUser(data.user);
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message || 'Lỗi nâng cấp VIP' };
            }
        } catch (err) {
            return { success: false, message: 'Lỗi kết nối máy chủ' };
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            loading, 
            login, 
            register, 
            logout,
            upgradeToVIP,
            isVip: user?.is_vip === 1 || user?.role === 'admin',
            isAdmin: user?.role === 'admin',
            isFieldOwner: user?.role === 'field_owner' || user?.role === 'admin'
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
