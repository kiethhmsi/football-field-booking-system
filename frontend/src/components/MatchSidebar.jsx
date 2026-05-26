import React, { useState } from 'react';
import { Filter, Trash2, Zap, ChevronDown } from 'lucide-react';
import VIPModal from './VIPModal';

const skillOptions = [
  { label: 'Giỏi (Bán chuyên)', value: 'pro' },
  { label: 'Khá', value: 'semi_pro' },
  { label: 'Trung bình', value: 'amateur' },
  { label: 'Giao lưu', value: 'fun' },
];

export default function MatchSidebar({ filters, onFilterChange, onReset }) {
  const [isVipOpen, setIsVipOpen] = useState(false);

  const handleSkillChange = (value) => {
    onFilterChange('skill_level', filters.skill_level === value ? '' : value);
  };

  const handleFieldTypeChange = (value) => {
    onFilterChange('field_type', filters.field_type === value ? '' : value);
  };

  return (
    <>
      <aside className="w-full md:w-72 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-left">
          <div className="flex items-center gap-2 mb-6 text-gray-900 border-b border-gray-50 pb-4">
            <Filter size={18} className="text-emerald-600" />
            <h3 className="font-bold">Bộ lọc tìm kiếm</h3>
          </div>
          
          {/* Trình độ */}
          <div className="mb-8">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Trình độ</p>
            <div className="flex flex-col gap-3">
              {skillOptions.map((skill) => (
                <label key={skill.value} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={filters.skill_level === skill.value}
                    onChange={() => handleSkillChange(skill.value)}
                    className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 transition-all cursor-pointer"
                  />
                  <span className={`text-sm font-medium transition-colors ${filters.skill_level === skill.value ? 'text-emerald-700' : 'text-gray-600 group-hover:text-emerald-700'}`}>
                    {skill.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Loại sân */}
          <div className="mb-10">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Loại sân</p>
            <div className="grid grid-cols-2 gap-2">
              {['Sân 5', 'Sân 7', 'Sân 11'].map((type) => (
                <button 
                  key={type}
                  onClick={() => handleFieldTypeChange(type)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${filters.field_type === type ? 'bg-emerald-600 text-white shadow-md' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Action */}
          <button 
            onClick={onReset}
            className="w-full py-3 border border-emerald-600 text-emerald-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors text-xs bg-white cursor-pointer"
          >
            <Trash2 size={16} /> Xóa tất cả bộ lọc
          </button>
        </div>

        {/* VIP REGISTRATION CARD (MATCHING STYLE) */}
        <div 
          onClick={() => setIsVipOpen(true)}
          className="bg-emerald-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-emerald-900/20 cursor-pointer hover:-translate-y-1 transition-all text-left"
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

      <VIPModal isOpen={isVipOpen} onClose={() => setIsVipOpen(false)} />
    </>
  );
}
