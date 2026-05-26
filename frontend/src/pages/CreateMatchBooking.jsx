import React from 'react';
import BookingView from '../components/BookingView';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap } from 'lucide-react';

const CreateMatchBooking = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <span className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest italic">Bước 1</span>
               <div className="h-px w-12 bg-gray-200"></div>
               <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest italic">Chọn sân & Giữ chỗ</span>
            </div>
            <h1 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
              Đặt sân <span className="text-emerald-600">tạo kèo</span>
            </h1>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 max-w-sm">
             <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                <ShieldCheck size={24} />
             </div>
             <p className="text-[10px] font-bold text-gray-500 uppercase leading-relaxed">
                Hệ thống sẽ giữ sân cho bạn trong <span className="text-emerald-600 font-black">10 phút</span> để hoàn tất thông tin kèo đấu.
             </p>
          </div>
        </div>
      </div>

      <BookingView mode="matchmaking" />
      
      <div className="max-w-7xl mx-auto px-6 pb-20 mt-12 text-left">
          <div className="bg-[#111827] p-10 rounded-[3rem] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Zap size={120} fill="currentColor" />
              </div>
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div>
                      <h4 className="text-emerald-500 font-black uppercase text-[10px] tracking-widest mb-4">Tại sao cần đặt sân trước?</h4>
                      <p className="text-gray-400 text-xs font-medium leading-relaxed">
                          Việc đặt sân trước giúp đảm bảo kèo đấu của bạn là "kèo thật", tránh tình trạng tìm được đối thủ nhưng không có sân để đá.
                      </p>
                  </div>
                  <div>
                      <h4 className="text-emerald-500 font-black uppercase text-[10px] tracking-widest mb-4">Quyền lợi của bạn</h4>
                      <p className="text-gray-400 text-xs font-medium leading-relaxed">
                          Kèo có sân thật sẽ được gắn Badge xác thực và ưu tiên hiển thị lên đầu danh sách tìm kiếm để dễ dàng tìm thấy đối thủ hơn.
                      </p>
                  </div>
                  <div>
                      <h4 className="text-emerald-500 font-black uppercase text-[10px] tracking-widest mb-4">Cơ chế giữ chỗ</h4>
                      <p className="text-gray-400 text-xs font-medium leading-relaxed">
                          Sân sẽ được giữ tạm thời. Nếu bạn không hoàn tất đăng kèo trong 10 phút, hệ thống sẽ tự động nhả sân cho người khác.
                      </p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default CreateMatchBooking;
