import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CalendarRange, Undo2, Ban, HeartHandshake } from 'lucide-react';

export default function Terms() {
  const sections = [
    { id: 'booking', title: '1. Quy định Đặt sân', icon: <CalendarRange size={16} /> },
    { id: 'refund', title: '2. Hoàn hủy & Đổi trả', icon: <Undo2 size={16} /> },
    { id: 'prohibited', title: '3. Hành vi Cấm đoán', icon: <Ban size={16} /> },
    { id: 'community', title: '4. Tinh thần Phủi', icon: <HeartHandshake size={16} /> }
  ];

  const [activeSec, setActiveSec] = useState('booking');

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
            alt="Terms bg"
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
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Quy tắc cộng đồng thể thao</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase mb-0 leading-none"
          >
            ĐIỀU KHOẢN & <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">DỊCH VỤ KASPORT</span>
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
            <div id="booking" className="space-y-4">
              <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">1. QUY ĐỊNH ĐẶT SÂN & CỌC GIỮ CHỖ</h2>
              <p className="text-gray-500 text-xs font-medium leading-relaxed">
                Để giữ chỗ sân thành công, người dùng cần thực hiện thanh toán tiền đặt cọc tương ứng theo yêu cầu của từng chủ sân (thường dao động từ 30% - 50% tổng chi phí thuê sân).
              </p>
              <p className="text-gray-500 text-xs font-medium leading-relaxed">
                Sau khi thanh toán cọc thành công, hệ thống sẽ khóa khung giờ đã chọn và cấp mã xác nhận. Bạn có trách nhiệm thanh toán số tiền còn lại trực tiếp tại quầy quản lý của sân bóng khi đến check-in.
              </p>
            </div>

            {/* Section 2 */}
            <div id="refund" className="space-y-4 pt-8 border-t border-slate-100">
              <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">2. CHÍNH SÁCH HOÀN HỦY & ĐỔI LỊCH</h2>
              <p className="text-gray-500 text-xs font-medium leading-relaxed">
                Chính sách hoàn tiền cọc được thiết lập công bằng cho cả người chơi lẫn chủ sân:
              </p>
              <ul className="list-disc pl-5 text-gray-500 text-xs font-medium space-y-2">
                <li>Hủy trước giờ đá <strong>từ 4 tiếng trở lên</strong>: Hoàn trả 100% tiền cọc về ví tài khoản hoặc qua hình thức thanh toán ban đầu.</li>
                <li>Hủy trước giờ đá <strong>dưới 4 tiếng</strong>: Không được hoàn trả tiền cọc nhằm đền bù chi phí giữ sân cho đối tác.</li>
                <li>Yêu cầu đổi lịch đá chỉ được chấp nhận nếu có sự đồng ý của ban quản lý sân bãi và thực hiện trước giờ đá tối thiểu 6 tiếng.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div id="prohibited" className="space-y-4 pt-8 border-t border-slate-100">
              <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">3. HÀNH VI BỊ CẤM KHI SỬ DỤNG DỊCH VỤ</h2>
              <p className="text-gray-500 text-xs font-medium leading-relaxed">
                Nhằm bảo vệ uy tín của hệ thống KaSport, các hành vi sau bị cấm tuyệt đối và sẽ bị khóa tài khoản vĩnh viễn:
              </p>
              <ul className="list-disc pl-5 text-gray-500 text-xs font-medium space-y-2">
                <li>Sử dụng các công cụ spam, tự động hóa để săn đặt sân ảo làm ảnh hưởng người chơi khác.</li>
                <li>Thực hiện hành vi lừa đảo đặt cọc ảo, quỵt nợ tiền sân sau trận đấu.</li>
                <li>Gây rối trật tự công cộng, đánh nhau hoặc vi phạm pháp luật tại khuôn viên các sân bóng đối tác của KaSport.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div id="community" className="space-y-4 pt-8 border-t border-slate-100">
              <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">4. TINH THẦN THỂ THAO FAIR-PLAY</h2>
              <p className="text-gray-500 text-xs font-medium leading-relaxed">
                KaSport hướng tới xây dựng một cộng đồng bóng đá phong trào lịch sự và văn minh. Chúng tôi khuyến khích các đội bóng luôn tôn trọng đối thủ, tôn trọng quyết định của trọng tài, nói không với lối chơi thô bạo và bạo lực sân cỏ.
              </p>
              <p className="text-gray-500 text-xs font-medium leading-relaxed">
                Hãy là một cầu thủ văn minh, một câu lạc bộ gương mẫu để cùng giữ lửa đam mê môn thể thao vua một cách lành mạnh nhất!
              </p>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
