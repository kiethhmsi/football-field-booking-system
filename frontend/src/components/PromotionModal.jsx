import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Clock, Coffee, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PromotionModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row text-left"
          >
            {/* Image Section */}
            <div className="w-full md:w-5/12 h-48 md:h-auto relative overflow-hidden">
               <img 
                 src="https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=800"
                 alt="Early Bird Promotion" 
                 className="w-full h-full object-cover"
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-emerald-900/60 to-transparent" />
               <div className="absolute top-6 left-6">
                  <div className="bg-yellow-400 text-emerald-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xl">
                     Vàng (5h-10h)
                  </div>
               </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer text-gray-400"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <div className="flex items-center gap-3 text-emerald-600 mb-2">
                   <Zap size={20} className="fill-emerald-600" />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em]">Special Offer</span>
                </div>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">
                   Ưu đãi <span className="text-emerald-700">Early Bird</span>
                </h2>
                <div className="mt-4 flex items-center gap-2">
                   <div className="h-1 w-12 bg-emerald-700 rounded-full" />
                   <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Rèn luyện sức khỏe mỗi sáng</p>
                </div>
              </div>

              <div className="space-y-5 mb-10">
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                       <Clock size={20} />
                    </div>
                    <div>
                       <p className="text-xs font-black uppercase tracking-widest text-gray-800">Khung giờ sáng</p>
                       <p className="text-sm font-medium text-gray-500">Giảm <span className="text-emerald-700 font-bold">20% tổng hóa đơn</span> (05:00 - 10:00)</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                       <Coffee size={20} />
                    </div>
                    <div>
                       <p className="text-xs font-black uppercase tracking-widest text-gray-800">Quà tặng đi kèm</p>
                       <p className="text-sm font-medium text-gray-500">Tặng kèm 2 chai nước suối ướp lạnh cho mỗi trận đấu.</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                       <Sparkles size={20} />
                    </div>
                    <div>
                       <p className="text-xs font-black uppercase tracking-widest text-gray-800">Dịch vụ ưu tiên</p>
                       <p className="text-sm font-medium text-gray-500">Hỗ trợ mượn áo tập và bóng thi đấu miễn phí.</p>
                    </div>
                 </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
