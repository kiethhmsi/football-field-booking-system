import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Mật khẩu xác nhận không khớp');
    }

    setIsLoading(true);
    const result = await register({
      full_name: formData.full_name,
      phone_number: formData.phone_number,
      email: formData.email,
      password: formData.password
    });

    if (result.success) {
      alert('Đăng ký thành công! Hãy đăng nhập nhé.');
      navigate('/login');
    } else {
      setError(result.message || 'Đăng ký thất bại');
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

      {/* Glassmorphic Register Card */}
      <motion.div 
        initial={{ opacity: 0, y: 35, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[460px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 md:p-12 shadow-2xl relative z-10 text-white"
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
          
          <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mb-1.5">Đăng ký tài khoản</h2>
          <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Gia nhập cộng đồng KaSport Complex</p>
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

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Full Name Field */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 pl-2">Họ và tên</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <User size={16} />
              </div>
              <input 
                type="text" 
                name="full_name"
                placeholder="Nhập họ và tên" 
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/40 rounded-2xl py-3 pl-11 pr-5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
              />
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 pl-2">Số điện thoại</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Phone size={16} />
              </div>
              <input 
                type="text" 
                name="phone_number"
                placeholder="090x xxx xxx" 
                value={formData.phone_number}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/40 rounded-2xl py-3 pl-11 pr-5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 pl-2">Email (tùy chọn)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Mail size={16} />
              </div>
              <input 
                type="email" 
                name="email"
                placeholder="example@email.com" 
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/40 rounded-2xl py-3 pl-11 pr-5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 pl-2">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Lock size={16} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/40 rounded-2xl py-3 pl-11 pr-12 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
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

          {/* Confirm Password Field */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 pl-2">Xác nhận mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Lock size={16} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/40 rounded-2xl py-3 pl-11 pr-5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 mt-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-[0_10px_25px_rgba(16,185,129,0.3)] transition-all border-none cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" 
              />
            ) : (
              <>
                ĐĂNG KÝ NGAY <UserPlus size={14} />
              </>
            )}
          </button>
        </form>

        {/* Navigation Link */}
        <p className="mt-8 text-center text-xs text-slate-400 font-medium">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors decoration-none pl-1">
            Đăng nhập
          </Link>
        </p>

        <p className="text-center mt-6 text-[10px] text-slate-500 leading-normal">
          Bằng cách đăng ký, bạn đồng ý với các{' '}
          <Link to="/terms" className="text-slate-400 underline transition-colors decoration-none">Điều khoản</Link>{' '}
          và{' '}
          <Link to="/privacy" className="text-slate-400 underline transition-colors decoration-none">Chính sách bảo mật</Link>{' '}
          của KaSport Complex.
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
