import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Phone, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(phone, password);
    
    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center py-16 px-6 bg-[#00140c] overflow-hidden select-none font-sans text-left">
      {/* Stadium Vector Illustration Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-fans.png" 
          className="w-full h-full object-cover opacity-15"
          alt="Stadium Vector Illustration Background"
        />
        {/* Dark radial glow blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#00140c] via-transparent to-[#00140c]" />
      </div>

      {/* Ambient Stadium Spotlights */}
      <div className="absolute top-10 left-1/4 w-[35rem] h-[35rem] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[30rem] h-[30rem] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Glassmorphic Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 35, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[430px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 md:p-12 shadow-2xl relative z-10 text-white"
      >
        {/* Breathing Logo Icon */}
        <div className="flex flex-col items-center mb-8 text-center">
          <motion.div 
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center shadow-lg p-2.5 mb-4"
          >
            <img src="/kasport-logo.png" alt="KaSport" className="w-full h-full object-contain" />
          </motion.div>
          
          <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mb-1.5">Đăng nhập KaSport</h2>
          <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Hệ thống đặt sân bóng đá công nghệ cao</p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs font-bold p-4 rounded-2xl mb-6 flex items-center gap-3"
          >
            <AlertCircle size={16} className="text-red-400 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Phone Field */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-2">Số điện thoại</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Phone size={16} />
              </div>
              <input 
                type="text" 
                placeholder="Nhập số điện thoại" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/40 rounded-2xl py-3.5 pl-11 pr-5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-2">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Lock size={16} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/40 rounded-2xl py-3.5 pl-11 pr-12 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end text-xs mb-2">
            <Link to="#" className="text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider text-[10px] transition-colors decoration-none">Quên mật khẩu?</Link>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-[0_10px_25px_rgba(16,185,129,0.3)] transition-all border-none cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" 
              />
            ) : (
              <>
                ĐĂNG NHẬP <LogIn size={14} />
              </>
            )}
          </button>
        </form>

        {/* Navigation Link */}
        <p className="mt-8 text-center text-xs text-slate-400 font-medium">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors decoration-none pl-1">
            Đăng ký ngay
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
