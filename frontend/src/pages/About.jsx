import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Trophy, Award, Heart, Sparkles } from 'lucide-react';

export default function About() {
  const values = [
    { 
      icon: <Users className="text-emerald-500" size={28} />, 
      title: 'KẾT NỐI CỘNG ĐỒNG', 
      desc: 'Mang những người có cùng niềm đam mê bóng đá xích lại gần nhau, tạo sân chơi giao lưu văn minh và lành mạnh.' 
    },
    { 
      icon: <Shield className="text-blue-500" size={28} />, 
      title: 'MINH BẠCH & AN TOÀN', 
      desc: 'Mọi giao dịch cọc sân và đặt lịch đều được mã hóa, bảo mật tối đa, mang lại sự tin cậy tuyệt đối cho khách hàng.' 
    },
    { 
      icon: <Trophy className="text-amber-500" size={28} />, 
      title: 'ĐẲNG CẤP CHUYÊN NGHIỆP', 
      desc: 'Liên tục cập nhật công nghệ mới nhằm tối ưu hóa trải nghiệm tìm sân, ghép đội, và tổ chức giải đấu chuyên nghiệp.' 
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-left">
      {/* Premium Hero Header */}
      <section className="relative py-14 md:py-16 px-6 md:px-12 bg-[#001a0f] overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-fans.png" 
            className="w-full h-full object-cover opacity-15"
            alt="About us bg"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001a0f] via-transparent to-[#001a0f]" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6 shadow-2xl"
          >
            <motion.img 
              src="/kasport-logo.png" 
              alt="KaSport Logo" 
              className="w-5.5 h-5.5 object-contain shrink-0 rounded-md"
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Chúng tôi là ai?</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase mb-0 leading-none"
          >
            VỀ CHÚNG TÔI & <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">KASPORT</span>
          </motion.h1>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <span className="text-emerald-600 font-black uppercase tracking-widest text-[10px] bg-emerald-50 px-4 py-1.5 rounded-full">Sứ mệnh số hóa thể thao</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase italic tracking-tighter leading-tight">
              KẾT NỐI ĐAM MÊ <br/>BẰNG <span className="text-emerald-600">SỨC MẠNH CÔNG NGHỆ</span>
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed text-sm">
              KaSport ra đời từ tình yêu cháy bỏng với trái bóng tròn sân phủi và sự trăn trở trước những khó khăn của cầu thủ phong trào khi tìm sân trống, ghép đội hay tìm đối thủ tương xứng.
            </p>
            <p className="text-gray-500 font-medium leading-relaxed text-sm">
              Chúng tôi tự hào xây dựng một hệ sinh thái thể thao trực tuyến thông minh hàng đầu Việt Nam. Nơi bạn chỉ cần vài cú click để hoàn tất đặt sân, giữ chỗ an toàn, tìm đối giao lưu tức thì và tận hưởng trọn vẹn từng trận đấu thăng hoa.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-emerald-500/10 blur-[60px] rounded-full -z-10" />
            <div className="bg-[#001a0f] p-10 rounded-[3rem] border border-emerald-950 text-white relative overflow-hidden shadow-2xl">
              <img 
                src="/hero-fans.png" 
                className="absolute inset-0 w-full h-full object-cover opacity-10" 
                alt="Fans" 
              />
              <div className="relative z-10 space-y-8">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-emerald-400">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-wider">Cột mốc ấn tượng</h4>
                    <p className="text-[10px] text-emerald-300 font-bold uppercase">Cập nhật tháng 05/2026</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-4xl font-black italic tracking-tighter text-emerald-400">99%</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-normal mt-1">Khách hàng <br/>quay lại đặt sân</p>
                  </div>
                  <div>
                    <h3 className="text-4xl font-black italic tracking-tighter text-emerald-400">50k+</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-normal mt-1">Trận đấu <br/>kết nối thành công</p>
                  </div>
                  <div>
                    <h3 className="text-4xl font-black italic tracking-tighter text-emerald-400">200+</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-normal mt-1">Sân bóng đối tác <br/>trên toàn quốc</p>
                  </div>
                  <div>
                    <h3 className="text-4xl font-black italic tracking-tighter text-emerald-400">24/7</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-normal mt-1">Hỗ trợ chăm sóc <br/>tức thì qua AI chatbot</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 px-6 md:px-12 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px]">Phương châm hoạt động</span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase italic tracking-tighter mt-3 mb-16">
            GIÁ TRỊ CỐT LÕI TẠI <span className="text-emerald-600">KASPORT</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((val, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 text-left group"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm">
                  {val.icon}
                </div>
                <h3 className="text-base font-black text-gray-900 uppercase italic mb-3 group-hover:text-emerald-600 transition-colors">
                  {val.title}
                </h3>
                <p className="text-gray-500 text-xs font-medium leading-relaxed">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
