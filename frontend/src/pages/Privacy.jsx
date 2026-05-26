import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, Lock, FileText, UserCheck } from 'lucide-react';

export default function Privacy() {
  const sections = [
    { id: 'collect', title: '1. Thu Thập Thông Tin', icon: <Eye size={16} /> },
    { id: 'usage', title: '2. Sử Dụng Thông Tin', icon: <FileText size={16} /> },
    { id: 'security', title: '3. Bảo Mật Dữ Liệu', icon: <Lock size={16} /> },
    { id: 'sharing', title: '4. Chia Sẻ Bên Thứ Ba', icon: <UserCheck size={16} /> }
  ];

  const [activeSec, setActiveSec] = useState('collect');

  const scrollToSec = (id) => {
    setActiveSec(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-left">
      {/* Premium Hero Header */}
      <section className="relative py-14 md:py-16 px-6 md:px-12 bg-[#001a0f] overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-fans.png" 
            className="w-full h-full object-cover opacity-15"
            alt="Privacy bg"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001a0f] via-transparent to-[#001a0f]" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6 shadow-2xl"
          >
            <ShieldCheck className="text-emerald-400 shrink-0" size={16} />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Cam kết bảo mật tuyệt đối</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase mb-0 leading-none"
          >
            CHÍNH SÁCH & <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">QUYỀN RIÊNG TƯ</span>
          </motion.h1>
        </div>
      </section>

      {/* Two Column Legal Content */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column - Side Menu */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 italic">DANH MỤC ĐIỀU KHOẢN</h3>
              <div className="flex flex-col gap-3">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSec(sec.id)}
                    className={`w-full py-3.5 px-5 rounded-2xl font-black text-[10px] uppercase tracking-wider transition-all flex items-center gap-3 border-none cursor-pointer text-left ${activeSec === sec.id ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-slate-500 hover:text-emerald-600'}`}
                  >
                    {sec.icon} {sec.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Policy Text */}
          <div className="lg:col-span-8 space-y-12 pr-4">
            
            {/* Section 1 */}
            <div id="collect" className="space-y-4">
              <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">1. THU THẬP THÔNG TIN CÁ NHÂN</h2>
              <p className="text-gray-500 text-xs font-medium leading-relaxed">
                Khi sử dụng dịch vụ của KaSport, chúng tôi tiến hành thu thập các thông tin cá nhân cần thiết để cung cấp dịch vụ đặt sân tốt nhất bao gồm: Số điện thoại (sử dụng làm tài khoản đăng nhập), địa chỉ Email (để gửi vé điện tử và hóa đơn), và Họ tên người dùng.
              </p>
              <p className="text-gray-500 text-xs font-medium leading-relaxed">
                Chúng tôi không bao giờ lưu trữ bất kỳ thông tin nhạy cảm nào liên quan đến thông tin thẻ tín dụng, tài khoản ngân hàng của bạn. Toàn bộ quá trình giao dịch đều được xử lý và mã hóa bảo mật thông qua các đối tác cổng thanh toán được Ngân hàng Nhà nước cấp phép.
              </p>
            </div>

            {/* Section 2 */}
            <div id="usage" className="space-y-4 pt-8 border-t border-slate-100">
              <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">2. MỤC ĐÍCH SỬ DỤNG THÔNG TIN</h2>
              <p className="text-gray-500 text-xs font-medium leading-relaxed">
                Các thông tin của người dùng được sử dụng chủ yếu cho các mục đích sau:
              </p>
              <ul className="list-disc pl-5 text-gray-500 text-xs font-medium space-y-2">
                <li>Xác thực lịch đặt sân và gửi thông tin xác nhận tự động qua email hoặc số điện thoại.</li>
                <li>Hỗ trợ ghép đội, tìm đối thủ xung quanh chính xác thông qua hệ thống định vị địa lý.</li>
                <li>Giải quyết khiếu nại, hỗ trợ khách hàng và tối ưu hóa hệ thống chatbot AI trả lời tự động.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div id="security" className="space-y-4 pt-8 border-t border-slate-100">
              <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">3. BIỆN PHÁP BẢO MẬT DỮ LIỆU</h2>
              <p className="text-gray-500 text-xs font-medium leading-relaxed">
                Dữ liệu cá nhân của bạn được lưu trữ trên hệ thống máy chủ đám mây có độ bảo mật cao, được bảo vệ bởi tường lửa và các giao thức kiểm soát truy cập nghiêm ngặt.
              </p>
              <p className="text-gray-500 text-xs font-medium leading-relaxed">
                Mọi thông tin truyền tải giữa thiết bị của bạn và hệ thống của chúng tôi đều được mã hóa bằng công nghệ mã hóa SSL/TLS 256-bit chuẩn công nghiệp, ngăn chặn hoàn toàn mọi hành vi nghe lén hoặc đánh cắp dữ liệu.
              </p>
            </div>

            {/* Section 4 */}
            <div id="sharing" className="space-y-4 pt-8 border-t border-slate-100">
              <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">4. CHIA SẺ VỚI BÊN THỨ BA</h2>
              <p className="text-gray-500 text-xs font-medium leading-relaxed">
                KaSport cam kết bảo mật tuyệt đối dữ liệu người dùng. Chúng tôi cam đoan không bao giờ chia sẻ, bán, hoặc cho thuê thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích thương mại hoặc quảng cáo.
              </p>
              <p className="text-gray-500 text-xs font-medium leading-relaxed">
                Thông tin đặt sân (Họ tên, SĐT) chỉ được chia sẻ cho chủ sân bóng mà bạn đã đăng ký đặt sân để phục vụ cho mục đích check-in, đón tiếp và đối chiếu lịch khi ra sân.
              </p>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
