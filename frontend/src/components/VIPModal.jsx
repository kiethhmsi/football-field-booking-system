import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Zap, ShieldAlert, Sparkles, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const VIPModal = ({ isOpen, onClose }) => {
  const { user, isVip } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgradeClick = () => {
    onClose();
    if (!user) {
      navigate('/login');
    } else {
      navigate('/vip-checkout');
    }
  };

  const benefits = [
    {
      title: "⚽ Đặt Sân Bóng Đá",
      details: ["Giữ chỗ nhanh hơn", "Ưu tiên booking khung giờ vàng (17:30 - 20:30)", "Tự động nhận thông báo đẩy sớm khi có sân trống do hủy kèo"]
    },
    {
      title: "🤝 Kết Nối Ghép Kèo",
      details: ["Thấy bài đăng tìm đối thủ/đồng đội mới sớm hơn 30 phút", "Bài đăng của bạn được tự động ghim nổi bật lên top danh sách", "Tăng 80% cơ hội khớp kèo ghép nhanh chóng"]
    },
    {
      title: "👥 Nhận Diện Thương Hiệu",
      details: ["Đặc quyền gắn Huy hiệu VIP Gold lấp lánh cạnh Avatar", "Hồ sơ cá nhân nổi bật trên hệ thống tìm đối thủ/đồng đội", "Bộ lọc tìm kiếm ưu tiên hiển thị hồ sơ VIP"]
    },
    {
      title: "🔔 Thông Báo Đẩy Realtime",
      details: ["Thông báo kết nối tức thì qua Web Socket", "Ưu tiên thông báo khi có đội bóng lớn muốn thách đấu", "Bộ phận hỗ trợ CSKH trực tuyến VIP 24/7"]
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 overflow-y-auto">
        {/* Dark blurred background overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative w-full max-w-xl bg-gradient-to-b from-[#012616] to-[#00140c] rounded-[3rem] shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-emerald-500/20 overflow-hidden text-white my-8 max-h-[90vh] flex flex-col"
        >
          {/* Top Golden Light Flare */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#faea18]/10 rounded-full blur-[60px] pointer-events-none" />

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border-none cursor-pointer z-20"
          >
            <X size={20} />
          </button>

          {/* Scrollable Content Body */}
          <div className="p-8 md:p-10 overflow-y-auto flex-1 select-none text-left">
            {/* Crown Shield Header */}
            <div className="flex flex-col items-center mb-8 text-center">
              <motion.div 
                animate={{ rotateY: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
                className="w-16 h-16 bg-gradient-to-tr from-[#faea18] to-amber-500 text-slate-900 rounded-3xl flex items-center justify-center shadow-[0_10px_30px_rgba(250,234,24,0.3)] mb-4"
              >
                <Award size={36} className="text-[#002616]" />
              </motion.div>
              
              <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Đặc Quyền Thành Viên VIP</h3>
              <p className="text-[10px] text-[#f5b800] font-black uppercase tracking-widest flex items-center gap-1.5 justify-center">
                <Sparkles size={12} /> HỖ TRỢ TRẢI NGHIỆM BÓNG ĐÁ ĐỈNH CAO <Sparkles size={12} />
              </p>
            </div>

            {/* Current VIP Status Warning */}
            {isVip && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold p-4 rounded-2xl mb-6 text-center">
                🎉 Bạn đang là thành viên VIP. Bạn có thể mua thêm để gia hạn gói cước!
              </div>
            )}

            {/* Benefits List */}
            <div className="space-y-6 mb-8">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-emerald-500/20 transition-all duration-300">
                  <h4 className="text-xs font-black text-[#f5b800] uppercase tracking-wider mb-3 pl-1">{benefit.title}</h4>
                  <ul className="space-y-2 p-0 list-none text-xs text-slate-300 font-medium">
                    {benefit.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2.5 leading-relaxed">
                        <CheckCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Subscription Box */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-emerald-950/40 border border-emerald-500/20 rounded-[2rem] p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full" />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Gói cước đề cử</p>
              <h4 className="text-xl font-black text-white italic uppercase tracking-wider mb-2">VIP MONTHLY PACKAGE</h4>
              
              <div className="flex items-baseline justify-center gap-1.5 mb-4">
                <span className="text-3xl font-black text-[#f5b800] italic tracking-tighter">50.000đ</span>
                <span className="text-xs text-slate-400 font-bold">/ 30 ngày sử dụng</span>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleUpgradeClick}
                className="w-full py-4 bg-gradient-to-r from-[#faea18] to-amber-500 hover:from-[#ffee38] hover:to-amber-400 text-[#002616] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-[0_10px_30px_rgba(250,234,24,0.3)] transition-all border-none cursor-pointer flex items-center justify-center gap-2"
              >
                NÂNG CẤP NGAY <Zap size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VIPModal;
