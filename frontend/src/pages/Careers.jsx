import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Send, CheckCircle, Sparkles, SendHorizontal } from 'lucide-react';

export default function Careers() {
  const [formData, setFormData] = useState({ name: '', email: '', position: '', github: '', cvLink: '', intro: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const jobs = [
    {
      title: 'NHÂN VIÊN BẢO VỆ KHO THIẾT BỊ',
      type: 'Full-time / Xoay ca',
      location: 'Bình Thạnh, TP. HCM',
      salary: '7 - 10 Triệu',
      desc: 'Chịu trách nhiệm bảo an, trông coi và kiểm soát xuất nhập kho dụng cụ thể thao, áo đấu và trang thiết bị sân bóng của KaSport Complex. Đảm bảo an ninh trật tự khu vực kho bãi.'
    },
    {
      title: 'CHUYÊN VIÊN VẬN HÀNH CỘNG ĐỒNG SÂN PHỦI',
      type: 'Full-time',
      location: 'Bình Thạnh, TP. HCM',
      salary: '10 - 15 Triệu',
      desc: 'Quản lý, xây dựng và kết nối các hội nhóm bóng đá phong trào. Hỗ trợ giải đấu KaSport Championship và điều phối các kèo đấu đối tác.'
    },
    {
      title: 'CONTENT CREATOR / TIKTOK HOST (THỂ THAO)',
      type: 'Part-time / Freelance',
      location: 'Linh hoạt',
      salary: 'Thỏa thuận theo dự án',
      desc: 'Sáng tạo các nội dung video ngắn hài hước, phân tích chiến thuật hoặc phỏng vấn cầu thủ sau trận đấu để quảng bá ứng dụng KaSport trên TikTok/Reels.'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', position: '', github: '', cvLink: '', intro: '' });
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-left">
      {/* Premium Hero Header */}
      <section className="relative py-14 md:py-16 px-6 md:px-12 bg-[#001a0f] overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-fans.png" 
            className="w-full h-full object-cover opacity-15"
            alt="Careers bg"
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
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Gia nhập đội ngũ</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase mb-0 leading-none"
          >
            CƠ HỘI NGHỀ & <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">NGHIỆP KASPORT</span>
          </motion.h1>
        </div>
      </section>

      {/* Active Jobs Section */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Job Postings */}
          <div className="space-y-8">
            <div>
              <span className="text-emerald-600 font-black uppercase tracking-widest text-[10px] bg-emerald-50 px-4 py-1.5 rounded-full">Đang mở tuyển dụng</span>
              <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter mt-4 mb-3">
                CÁC VỊ TRÍ ĐANG MỞ
              </h2>
              <p className="text-gray-500 font-medium text-xs">Hãy chọn vị trí phù hợp với năng lực và gửi đơn ứng tuyển cho chúng tôi ngay hôm nay.</p>
            </div>

            <div className="space-y-6">
              {jobs.map((job, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all duration-300 group"
                >
                  <h3 className="text-sm font-black text-gray-900 uppercase italic mb-4 group-hover:text-emerald-600 transition-colors">
                    {job.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-4 text-[10px] text-slate-400 font-bold uppercase mb-6">
                    <span className="flex items-center gap-1.5"><Briefcase size={12} className="text-emerald-500" /> {job.type}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={12} className="text-blue-500" /> {job.location}</span>
                    <span className="flex items-center gap-1.5"><DollarSign size={12} className="text-amber-500" /> {job.salary}</span>
                  </div>

                  <p className="text-gray-500 text-xs font-medium leading-relaxed">
                    {job.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Apply Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 relative shadow-md"
          >
            <div className="mb-8">
              <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tight mb-2">ỨNG TUYỂN NHANH</h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Mất chưa đầy 1 phút để ứng tuyển vị trí mơ ước</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-2">Họ & tên</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-white border border-transparent focus:border-emerald-500/30 rounded-2xl py-3.5 px-5 text-xs font-bold focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-2">Email liên hệ</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nguyenvana@gmail.com"
                    className="w-full bg-white border border-transparent focus:border-emerald-500/30 rounded-2xl py-3.5 px-5 text-xs font-bold focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-2">Vị trí muốn ứng tuyển</label>
                <select
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full bg-white border border-transparent focus:border-emerald-500/30 rounded-2xl py-3.5 px-5 text-xs font-bold focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="" disabled>-- Vui lòng chọn vị trí --</option>
                  <option value="Warehouse Security">Nhân viên bảo vệ kho thiết bị</option>
                  <option value="Community Operations">Chuyên viên vận hành cộng đồng sân phủi</option>
                  <option value="Content Creator">Content Creator / TikTok Host</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-2">Liên kết CV (Drive / Dropbox)</label>
                <input
                  type="url"
                  required
                  value={formData.cvLink}
                  onChange={(e) => setFormData({ ...formData, cvLink: e.target.value })}
                  placeholder="https://drive.google.com/file/d/your-cv-link"
                  className="w-full bg-white border border-transparent focus:border-emerald-500/30 rounded-2xl py-3.5 px-5 text-xs font-bold focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-2">Lời giới thiệu ngắn gọn</label>
                <textarea
                  rows={4}
                  value={formData.intro}
                  onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                  placeholder="Chia sẻ lý do bạn muốn đồng hành cùng cộng đồng KaSport..."
                  className="w-full bg-white border border-transparent focus:border-emerald-500/30 rounded-2xl py-3.5 px-5 text-xs font-bold focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-[0_10px_25px_rgba(16,185,129,0.3)] transition-all border-none cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    GỬI HỒ SƠ ỨNG TUYỂN <SendHorizontal size={14} />
                  </>
                )}
              </button>
            </form>

            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 font-bold text-xs text-center flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} /> ỨNG TUYỂN THÀNH CÔNG! Đã nhận thông tin CV của bạn.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
