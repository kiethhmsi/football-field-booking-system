import React, { useState } from 'react';
import { 
  Users, 
  Video, 
  Camera, 
  MessageCircle, 
  Send, 
  Phone, 
  Mail, 
  MapPin,
  ArrowRight,
  X,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

import MapComponent from './MapComponent';

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState(null);

  const officeLocation = { lat: 10.803523, lng: 106.697525, address: '91/46 Lê Văn Duyệt, phường 26, Bình Thạnh' };

  const handleSubscribe = () => {
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      setSubscribeStatus('success');
      setTimeout(() => setSubscribeStatus(null), 3000);
    }, 1500);
  };

  const handleContactClick = (type, value) => {
    if (type === 'phone') window.location.href = `tel:${value.replace(/\D/g, '')}`;
    if (type === 'email') window.location.href = `mailto:${value}`;
    if (type === 'address') setActiveModal('location');
  };

  const modals = {
    'about': {
      title: 'Về KaSport Complex',
      icon: <Zap className="text-amber-500" size={32} />,
      content: 'KaSport là hệ thống quản lý và đặt sân bóng đá hàng đầu, giúp kết nối cộng đồng yêu bóng đá qua công nghệ. Chúng tôi cung cấp giải pháp đặt sân nhanh chóng, tìm đối thủ ghép đội và quản lý sân bóng chuyên nghiệp.'
    },
    'location': {
      title: 'Vị trí sân bóng',
      icon: <MapPin className="text-purple-500" size={32} />,
      content: (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-500">{officeLocation.address}</p>
          <MapComponent 
            points={[{ lat: officeLocation.lat, lng: officeLocation.lng, popupContent: officeLocation.address }]} 
            center={[officeLocation.lat, officeLocation.lng]}
            zoom={16}
            className="h-64"
          />
          <button 
            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeLocation.address)}`, '_blank')}
            className="w-full py-3 bg-emerald-50 text-emerald-700 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-100 transition-all border-none cursor-pointer mt-2"
          >
            Mở trong Google Maps
          </button>
        </div>
      )
    },
    'guide': {
      title: 'Hướng dẫn đặt sân',
      icon: <HelpCircle className="text-emerald-500" size={32} />,
      content: (
        <div className="space-y-4 text-left">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">1</div>
            <p className="text-sm font-medium">Chọn sân và khung giờ phù hợp trên hệ thống.</p>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">2</div>
            <p className="text-sm font-medium">Thanh toán đặt cọc trực tuyến hoặc chuyển khoản.</p>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">3</div>
            <p className="text-sm font-medium">Nhận mã đặt sân và ra sân đúng giờ đã hẹn.</p>
          </div>
        </div>
      )
    },
    'news': {
      title: 'Tin tức & Sự kiện',
      icon: <Zap className="text-blue-500" size={32} />,
      content: (
        <div className="space-y-4 text-left">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-l-4 border-blue-500">
            <h4 className="text-xs font-black uppercase text-blue-600 mb-1">Tin nóng</h4>
            <p className="text-sm font-bold text-slate-900 dark:text-white">Giải KaSport Championship 2026 chính thức nhận đơn đăng ký!</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-l-4 border-emerald-500">
            <h4 className="text-xs font-black uppercase text-emerald-600 mb-1">Khuyến mãi</h4>
            <p className="text-sm font-bold text-slate-900 dark:text-white">Giảm 30% giá sân khung giờ sáng sớm (5:00 - 8:00).</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-l-4 border-amber-500">
            <h4 className="text-xs font-black uppercase text-amber-600 mb-1">Mẹo hay</h4>
            <p className="text-sm font-bold text-slate-900 dark:text-white">Cách khởi động đúng cách để tránh chấn thương dây chằng.</p>
          </div>
        </div>
      )
    },
    'career': {
      title: 'Cơ hội nghề nghiệp',
      icon: <HelpCircle className="text-purple-500" size={32} />,
      content: (
        <div className="space-y-4 text-left">
          <p className="text-sm text-slate-500 mb-4 font-medium">Hãy gia nhập đội ngũ KaSport Complex để cùng xây dựng cộng đồng bóng đá văn minh.</p>
          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl flex justify-between items-center group hover:bg-emerald-50 transition-all">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">Trọng tài (Freelance)</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Ưu tiên có kinh nghiệm</p>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-600" />
            </div>
            <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl flex justify-between items-center group hover:bg-emerald-50 transition-all">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">Content Creator (TikTok)</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Lương thưởng hấp dẫn</p>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-600" />
            </div>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-4 italic">Gửi CV về: support@kasport.com</p>
        </div>
      )
    }
  };

  const FacebookIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );

  const YoutubeIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
    </svg>
  );

  const InstagramIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );

  const ZaloIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <path d="M9.5 9h5l-5 6h5" strokeWidth="3" />
    </svg>
  );

  return (
    <footer className="bg-[#002616] pt-24 pb-12 px-6 md:px-12 border-t border-emerald-950 transition-colors duration-300 relative overflow-hidden text-white">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-3xl font-black text-white mb-8 tracking-tighter italic uppercase"
            >
              KaSport<span className="text-emerald-400">.</span>
            </motion.h2>
            <p className="text-emerald-100/70 text-sm leading-relaxed mb-8 max-w-sm font-medium">
              Nền tảng quản lý và đặt sân bóng đá công nghệ cao hàng đầu Việt Nam. Mang lại trải nghiệm thể thao chuyên nghiệp và tiện lợi nhất cho cộng đồng yêu bóng đá.
            </p>
             <div className="flex gap-4">
               {[
                 { icon: FacebookIcon, bgClass: 'bg-blue-950/40 text-blue-400 hover:bg-blue-600 hover:text-white', glow: 'hover:shadow-blue-500/30', url: 'https://www.facebook.com' },
                 { icon: YoutubeIcon, bgClass: 'bg-red-950/40 text-red-400 hover:bg-red-600 hover:text-white', glow: 'hover:shadow-red-500/30', url: 'https://www.youtube.com' },
                 { icon: InstagramIcon, bgClass: 'bg-pink-950/40 text-pink-400 hover:bg-pink-600 hover:text-white', glow: 'hover:shadow-pink-500/30', url: 'https://www.instagram.com' },
                 { icon: ZaloIcon, bgClass: 'bg-sky-950/40 text-sky-400 hover:bg-sky-600 hover:text-white', glow: 'hover:shadow-sky-500/30', url: 'https://zalo.me/0346201787' }
               ].map((social, idx) => (
                 <motion.a
                   key={idx}
                   href={social.url}
                   target="_blank"
                   rel="noopener noreferrer"
                   whileHover={{ y: -8, scale: 1.1 }}
                   className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-sm ${social.bgClass} ${social.glow} cursor-pointer`}
                 >
                   <social.icon size={20} />
                 </motion.a>
               ))}
             </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="font-black text-white mb-8 uppercase text-xs tracking-[0.2em] italic border-l-4 border-emerald-500 pl-4">Khám phá</h3>
            <ul className="flex flex-col gap-5 text-sm p-0 list-none font-bold">
              {[
                { label: 'Về chúng tôi', path: '/about' },
                { label: 'Hướng dẫn đặt sân', path: '/booking-guide' },
                { label: 'Tin tức & Sự kiện', path: '/news' },
                { label: 'Tuyển dụng', path: '/careers' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.path}
                    className="text-emerald-100/70 hover:text-emerald-400 transition-all text-decoration-none flex items-center group font-bold"
                  >
                    <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all text-emerald-400" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h3 className="font-black text-white mb-8 uppercase text-xs tracking-[0.2em] italic border-l-4 border-emerald-500 pl-4">Liên hệ hỗ trợ</h3>
            <div className="space-y-6">
              <motion.div 
                whileHover={{ x: 5 }}
                onClick={() => handleContactClick('phone', '0346.201.787')}
                className="flex gap-4 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-950/40 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-emerald-400/60 font-black uppercase tracking-widest mb-1">Hotline 24/7</p>
                  <p className="text-sm font-black text-white tracking-tight group-hover:text-emerald-400">0346.201.787</p>
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ x: 5 }}
                onClick={() => handleContactClick('email', 'support@kasport.com')}
                className="flex gap-4 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-950/40 text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-blue-400/60 font-black uppercase tracking-widest mb-1">Email liên hệ</p>
                  <p className="text-sm font-black text-white tracking-tight group-hover:text-blue-400">support@kasport.com</p>
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ x: 5 }}
                onClick={() => handleContactClick('address', '91/46 Lê Văn Duyệt, phường 26, Bình Thạnh')}
                className="flex gap-4 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-950/40 text-purple-400 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-purple-400/60 font-black uppercase tracking-widest mb-1">Văn phòng chính</p>
                  <p className="text-sm font-black text-white tracking-tight group-hover:text-purple-600">91/46 Lê Văn Duyệt, Bình Thạnh</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h3 className="font-black text-white mb-8 uppercase text-xs tracking-[0.2em] italic border-l-4 border-emerald-500 pl-4">Đăng ký nhận tin</h3>
            <p className="text-emerald-100/70 text-xs font-medium mb-6 leading-relaxed">
              Nhận thông báo về các kèo đấu mới và mã giảm giá sân bóng hàng tuần.
            </p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Nhập email của bạn..." 
                className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/30 rounded-2xl py-4 pl-6 pr-14 text-xs font-bold focus:ring-4 focus:ring-emerald-500/10 transition-all text-white outline-none placeholder-emerald-100/30"
              />
              <button 
                onClick={handleSubscribe}
                disabled={isSubscribing}
                className="absolute right-2 top-2 bottom-2 w-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-500 transition-all border-none cursor-pointer disabled:opacity-50"
              >
                {isSubscribing ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
            <AnimatePresence>
              {subscribeStatus === 'success' && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] text-emerald-400 font-black mt-3 uppercase tracking-widest flex items-center gap-1"
                >
                  <CheckCircle size={12} /> Đăng ký thành công! Đã gửi mã quà tặng.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center gap-6">
          <p className="text-emerald-100/40 text-[11px] font-bold uppercase tracking-[0.15em] text-center">
            © {new Date().getFullYear()} KaSport Complex. Built with <span className="text-rose-500 animate-pulse">❤️</span> for Football.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-emerald-100/50 hover:text-emerald-400 text-[10px] font-black uppercase tracking-widest text-decoration-none transition-colors">Quyền riêng tư</Link>
            <Link to="/terms" className="text-emerald-100/50 hover:text-emerald-400 text-[10px] font-black uppercase tracking-widest text-decoration-none transition-colors">Điều khoản</Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
            >
              <div className="p-10 text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  {modals[activeModal]?.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-4">
                  {modals[activeModal]?.title}
                </h3>
                <div className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {modals[activeModal]?.content}
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="mt-8 px-8 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-600 hover:text-white transition-all border-none cursor-pointer"
                >
                  Đóng lại
                </button>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-rose-500 transition-all bg-transparent border-none cursor-pointer"
              >
                <X size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
