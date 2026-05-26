import React, { useState } from 'react';
import { Filter, Wifi, Car, Coffee, Info, ChevronDown, Zap, Phone, ShowerHead, GlassWater, BriefcaseMedical, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import PromotionModal from './PromotionModal';
import VIPModal from './VIPModal';

const sânTypes = ['Tất cả loại sân', 'Sân 5', 'Sân 7', 'Sân 11'];
const amenitiesList = [
  { id: 'wifi', name: 'Wifi', icon: <Wifi size={14} /> },
  { id: 'parking', name: 'Bãi xe', icon: <Car size={14} /> },
  { id: 'canteen', name: 'Căng tin', icon: <Coffee size={14} /> },
  { id: 'shower', name: 'Phòng tắm', icon: <ShowerHead size={14} /> },
  { id: 'water', name: 'Nước uống', icon: <GlassWater size={14} /> },
];

export default function Sidebar({ filters, onFilterChange }) {
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [isVipOpen, setIsVipOpen] = useState(false);

  const handleTypeChange = (type) => {
    onFilterChange({ pitchType: type });
  };

  const handlePriceChange = (e) => {
    onFilterChange({ maxPrice: parseInt(e.target.value) });
  };

  return (
    <>
      <aside className="w-full md:w-80 flex flex-col gap-8 text-left">
        {/* FILTER PANEL */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-gray-100 sticky top-28">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 text-emerald-900">
              <Filter size={20} className="text-emerald-600" />
              <h3 className="text-xl font-black italic uppercase tracking-tighter">Bộ lọc</h3>
            </div>
            <button
              onClick={() => onFilterChange({ pitchType: 'Tất cả loại sân', minPrice: 0, maxPrice: 5000000, amenities: [] })}
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-emerald-600 transition-colors bg-transparent border-none cursor-pointer"
            >
              Xóa lọc
            </button>
          </div>

          {/* Pitch Types (Synchronized with Price style) */}
          <div className="mb-10">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Loại hình sân</p>
            <div className="grid grid-cols-1 gap-2">
              {sânTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={`py-3 px-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all text-left flex items-center justify-between cursor-pointer ${filters.pitchType === type
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-white text-gray-900 border-gray-100 hover:border-emerald-500 hover:bg-emerald-50'
                    }`}
                >
                  <span className="flex items-center gap-3">
                    <LayoutGrid size={14} className={filters.pitchType === type ? 'text-white' : 'text-emerald-600'} />
                    {type}
                  </span>
                  {filters.pitchType === type && <Zap size={12} fill="white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Price Selection (Replaces Slider) */}
          <div className="mb-10">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Mức giá thuê</p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: 'Tất cả mức giá', min: 0, max: 5000000 },
                { label: 'Dưới 300.000đ', min: 0, max: 300000 },
                { label: '300.000đ - 600.000đ', min: 300000, max: 600000 },
                { label: 'Trên 600.000đ', min: 600000, max: 5000000 }
              ].map((range) => {
                const isActive = filters.minPrice === range.min && filters.maxPrice === range.max;
                return (
                  <button
                    key={range.label}
                    onClick={() => onFilterChange({ minPrice: range.min, maxPrice: range.max })}
                    className={`py-3 px-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all text-left flex items-center justify-between cursor-pointer ${isActive
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                        : 'bg-white text-gray-900 border-gray-100 hover:border-emerald-500 hover:bg-emerald-50'
                      }`}
                  >
                    {range.label}
                    {isActive && <Zap size={12} fill="white" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CARD 2: Amenities (Independent Card) */}
        <div className="bg-emerald-50/50 border border-emerald-100 p-8 rounded-[2rem] shadow-sm">
          <p className="text-[10px] font-black text-emerald-800/40 uppercase tracking-[0.2em] mb-4">Tiện ích tổ hợp</p>
          <div className="flex flex-wrap gap-2">
            {amenitiesList.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-emerald-100 shadow-sm"
                title={item.name}
              >
                <span className="text-emerald-600">{item.icon}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-900">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PROMO SIDEBAR CARD */}
        <div className="bg-emerald-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-emerald-900/20">
          <div className="relative z-10">
            <div className="bg-emerald-500 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Info size={24} />
            </div>
            <h4 className="text-2xl font-black leading-tight mb-4 italic uppercase tracking-tighter underline underline-offset-4 decoration-emerald-400">Ưu đãi Khung giờ sáng</h4>
            <p className="text-emerald-200 text-xs font-medium opacity-80 leading-relaxed mb-8">Giảm ngay 20% khi đặt sân từ 05:00 - 10:00 sáng hàng tuần.</p>
            <button
              onClick={() => setIsPromoOpen(true)}
              className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-decoration-none group-hover:gap-3 transition-all bg-transparent border-none cursor-pointer"
            >
              Chi tiết ưu đãi <ChevronDown size={14} className="-rotate-90" />
            </button>
          </div>

          {/* Abstract design elements */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-700 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-700"></div>
        </div>

        {/* VIP REGISTRATION CARD (MATCHING STYLE) */}
        <div 
          onClick={() => setIsVipOpen(true)}
          className="bg-emerald-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-emerald-900/20 cursor-pointer hover:-translate-y-1 transition-all mt-6"
        >
          <div className="relative z-10">
            <div className="bg-emerald-500 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
               <Zap size={24} fill="currentColor" />
            </div>
            <h4 className="text-2xl font-black leading-tight mb-4 italic uppercase tracking-tighter underline underline-offset-4 decoration-emerald-400">Đăng ký thành viên VIP</h4>
            <p className="text-emerald-200 text-xs font-medium opacity-80 leading-relaxed mb-8">Ưu tiên đặt sân giờ vàng, đẩy kèo ghim lên đầu bảng chỉ với 50.000đ/tháng.</p>
            <button 
              className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-decoration-none group-hover:gap-3 transition-all bg-transparent border-none cursor-pointer"
            >
               Đăng ký VIP ngay <ChevronDown size={14} className="-rotate-90" />
            </button>
          </div>
          
          {/* Abstract design elements */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-700 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-700"></div>
        </div>
      </aside>

      <PromotionModal isOpen={isPromoOpen} onClose={() => setIsPromoOpen(false)} />
      <VIPModal isOpen={isVipOpen} onClose={() => setIsVipOpen(false)} />
    </>
  );
}
