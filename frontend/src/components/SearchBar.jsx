import React from 'react';
import { Search, MapPin, Calendar, ChevronDown, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchBar() {
  return (
    <section className="bg-gradient-to-b from-blue-50/50 to-white py-14 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Tìm sân bóng</h2>
        
        <div className="bg-white p-2 rounded-2xl shadow-xl shadow-gray-200/50 flex flex-col md:flex-row items-stretch gap-2">
          {/* Tên sân/Khu vực */}
          <div className="flex-1 flex items-center px-4 py-3 border-r border-gray-100 last:border-0 border-b md:border-b-0">
            <Search className="text-gray-400 mr-3" size={20} />
            <input 
              type="text" 
              placeholder="Tên sân/Khu vực" 
              className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400 font-medium"
            />
          </div>

          {/* Chọn loại sân */}
          <div className="flex-1 flex items-center px-4 py-3 border-r border-gray-100 last:border-0 cursor-pointer group border-b md:border-b-0">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mr-3 group-hover:bg-emerald-50 transition-colors">
              <span className="text-gray-400 text-xs font-bold group-hover:text-emerald-600">⚽</span>
            </div>
            <div className="flex-1">
              <p className="text-gray-700 font-medium text-sm">Chọn loại sân</p>
            </div>
            <ChevronDown className="text-gray-400" size={18} /> 
          </div>

          {/* Ngày & giờ */}
          <div className="flex-1 flex items-center px-4 py-3 border-r border-gray-100 last:border-0 cursor-pointer group">
            <Calendar className="text-gray-400 mr-3 group-hover:text-emerald-600 transition-colors" size={20} />
            <div className="flex-1">
              <p className="text-gray-700 font-medium text-sm">Ngày & giờ</p>
            </div>
            <ChevronDown className="text-gray-400" size={18} />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-emerald-800 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-900 transition-colors whitespace-nowrap"
          >
            Tìm ngay <ArrowRight size={20} />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
