import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, CreditCard, CheckCircle, ChevronDown, HelpCircle, PhoneCall } from 'lucide-react';

export default function BookingGuide() {
  const [openFaq, setOpenFaq] = useState(null);

  const steps = [
    {
      icon: <Search className="text-emerald-500" size={32} />,
      title: 'TÌM SÂN PHÙ HỢP',
      desc: 'Tìm kiếm theo khu vực, thời gian rảnh, loại sân (5, 7, 11 người) và mức giá tốt nhất để chọn điểm hẹn lý tưởng.'
    },
    {
      icon: <Calendar className="text-blue-500" size={32} />,
      title: 'CHỌN KHUNG GIỜ VÀ DỊCH VỤ',
      desc: 'Lựa chọn khung giờ trống phù hợp. Đặt trước các dịch vụ đi kèm như nước uống, thuê trọng tài hoặc áo tập nếu cần.'
    },
    {
      icon: <CreditCard className="text-amber-500" size={32} />,
      title: 'XÁC NHẬN & ĐẶT CỌC',
      desc: 'Tiến hành thanh toán cọc trực tuyến an toàn qua hệ thống. Nhận ngay vé đặt sân điện tử chứa mã QR để check-in tại sân.'
    }
  ];

  const faqs = [
    {
      q: 'Tôi có thể hủy đặt sân và nhận lại tiền cọc không?',
      a: 'Hoàn toàn được! Bạn có thể hủy sân miễn phí và được hoàn trả 100% tiền cọc nếu thực hiện hủy trước giờ bóng lăn tối thiểu 4 tiếng thông qua mục "Lịch sử đặt sân" trong trang cá nhân.'
    },
    {
      q: 'Hệ thống hỗ trợ những phương thức thanh toán nào?',
      a: 'KaSport hỗ trợ đa dạng cổng thanh toán bao gồm: MoMo, VNPAY, Thẻ nội địa ATM, Thẻ tín dụng quốc tế Visa/Mastercard và Chuyển khoản ngân hàng trực tiếp bằng mã QR 24/7.'
    },
    {
      q: 'Làm thế nào để tôi check-in khi đến sân bóng?',
      a: 'Rất đơn giản, sau khi thanh toán thành công, bạn sẽ nhận được mã đặt sân trong tài khoản và email. Khi đến sân, bạn chỉ cần đưa mã đặt sân hoặc mã QR này cho ban quản lý sân để check-in và nhận sân bóng.'
    },
    {
      q: 'Mã giảm giá áp dụng như thế nào khi thanh toán?',
      a: 'Tại bước xác nhận đặt sân, bạn chỉ cần nhập mã giảm giá (voucher) còn hiệu lực vào ô "Mã giảm giá". Hệ thống sẽ tự động trừ số tiền tương ứng vào tổng số tiền thanh toán hoặc tiền cọc của bạn.'
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
            alt="Guide bg"
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
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Quy trình chuyên nghiệp</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase mb-0 leading-none"
          >
            HƯỚNG DẪN & <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">ĐẶT SÂN BÓNG</span>
          </motion.h1>
        </div>
      </section>

      {/* Visual Pipeline Steps */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-emerald-600 font-black uppercase tracking-widest text-[10px] bg-emerald-50 px-4 py-1.5 rounded-full">Chỉ với 3 bước đơn giản</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase italic tracking-tighter mt-4">
              QUY TRÌNH ĐẶT SÂN TRỰC TUYẾN
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative">
            {steps.map((st, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-300 relative group"
              >
                <div className="absolute top-8 right-8 text-[4.5rem] font-black text-slate-100 italic leading-none select-none group-hover:text-emerald-50 transition-colors">
                  0{idx + 1}
                </div>
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  {st.icon}
                </div>
                <h3 className="text-sm font-black text-gray-900 uppercase italic mb-3">
                  {st.title}
                </h3>
                <p className="text-gray-500 text-xs font-medium leading-relaxed">
                  {st.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section className="py-24 px-6 md:px-12 bg-slate-50 border-t border-b border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-black uppercase tracking-widest text-[10px]">Thắc mắc của cầu thủ</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase italic tracking-tighter mt-3">
              CÂU HỎI THƯỜNG GẶP (FAQ)
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-5 px-8 flex justify-between items-center text-left bg-transparent border-none cursor-pointer"
                  >
                    <span className="text-sm font-black text-slate-900 pr-4 uppercase italic">
                      {faq.q}
                    </span>
                    <ChevronDown 
                      size={18} 
                      className={`text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} 
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-8 pb-5 text-xs font-medium text-slate-500 leading-relaxed border-t border-slate-50 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
