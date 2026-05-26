import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronDown, 
  Plus, 
  Wifi, 
  ParkingCircle, 
  Bath, 
  BarChart3, 
  Star, 
  Image as ImageIcon 
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const EditField = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/admin/fields');
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-left pb-20"
        >
            {/* Header */}
            <div className="flex flex-col gap-2 mb-8">
                <button 
                    onClick={handleBack}
                    className="flex items-center gap-2 text-[11px] font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-wider bg-transparent border-none cursor-pointer"
                >
                    <ChevronLeft size={14} />
                    Quay lại danh sách sân
                </button>
                <div className="flex flex-col">
                    <h1 className="text-3xl font-black text-gray-900 italic uppercase tracking-tighter">Chỉnh sửa sân bóng</h1>
                    <p className="text-xs text-gray-400 font-medium">Cập nhật thông tin chi tiết cho sân bóng {id || 'Sân A1'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Section: Form */}
                <div className="lg:col-span-2 bg-[#f8fafc] border border-gray-100 rounded-[2.5rem] p-8 space-y-8">
                    <div className="space-y-6">
                        {/* Tên sân */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-gray-900 tracking-wider">Tên sân</label>
                            <input 
                                type="text"
                                defaultValue={`Sân bóng SK - ${id || 'A1'}`}
                                className="w-full bg-white border-none rounded-2xl p-4 text-sm font-bold text-gray-700 shadow-sm focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all"
                            />
                        </div>

                        {/* Loại sân & Giá */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-gray-900 tracking-wider">Loại sân</label>
                                <div className="relative">
                                    <select className="w-full bg-white appearance-none border-none rounded-2xl p-4 text-sm font-bold text-gray-700 shadow-sm focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all pr-10">
                                        <option>Sân 7 người</option>
                                        <option>Sân 5 người</option>
                                        <option>Sân 11 người</option>
                                    </select>
                                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-gray-900 tracking-wider">Giá/giờ (VNĐ)</label>
                                <input 
                                    type="text"
                                    defaultValue="350.000"
                                    className="w-full bg-white border-none rounded-2xl p-4 text-sm font-bold text-gray-700 shadow-sm focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Mô tả */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-gray-900 tracking-wider">Mô tả</label>
                            <textarea 
                                rows={5}
                                defaultValue="Sân cỏ nhân tạo chất lượng cao"
                                className="w-full bg-white border-none rounded-2xl p-4 text-sm font-medium text-gray-600 shadow-sm focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all resize-none leading-relaxed"
                            />
                        </div>

                        {/* Tiện ích */}
                        <div className="space-y-4">
                            <label className="text-[11px] font-black uppercase text-gray-900 tracking-wider">Tiện ích đi kèm</label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { icon: Wifi, label: 'Wifi', color: 'bg-green-100 text-green-700' },
                                    { icon: ParkingCircle, label: 'Gửi xe', color: 'bg-green-100 text-green-700' },
                                    { icon: Bath, label: 'Tắm rửa', color: 'bg-green-100 text-green-700' },
                                ].map((item) => (
                                    <button key={item.label} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold ${item.color} shadow-sm border-none cursor-pointer`}>
                                        <item.icon size={12} />
                                        {item.label}
                                    </button>
                                ))}
                                <button className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold bg-white border border-dashed border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all shadow-sm cursor-pointer">
                                    <Plus size={12} />
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                        <button 
                            onClick={handleBack}
                            className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-300 transition-colors border-none cursor-pointer"
                        >
                            Hủy bỏ
                        </button>
                        <button className="flex-[2] bg-[#059669] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-900/20 hover:bg-[#047857] transition-colors border-none cursor-pointer">
                            Lưu thay đổi
                        </button>
                    </div>
                </div>

                {/* Right Section: Media & Quick Stats */}
                <div className="space-y-6">
                    {/* Media Card */}
                    <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm p-4">
                        <div className="relative rounded-3xl overflow-hidden aspect-video mb-4 group cursor-pointer bg-slate-100">
                            <img 
                                src="https://picsum.photos/seed/editfieldmain/600/400" 
                                alt="Main Pitch" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-[#059669] text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                    Ảnh chính
                                </span>
                            </div>
                        </div>
                        <h3 className="text-[10px] font-black uppercase text-gray-900 tracking-wider ml-2 mb-4">Hình ảnh khác</h3>
                        <div className="grid grid-cols-3 gap-2 px-2 pb-2">
                            <img src="https://picsum.photos/seed/pit1/150/150" className="rounded-xl w-full aspect-square object-cover" alt="Pitch" referrerPolicy="no-referrer" />
                            <img src="https://picsum.photos/seed/pit2/150/150" className="rounded-xl w-full aspect-square object-cover" alt="Pitch" referrerPolicy="no-referrer" />
                            <div className="w-full aspect-square rounded-xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300 hover:border-gray-400 hover:text-gray-500 transition-all cursor-pointer bg-gray-50/30">
                                <ImageIcon size={16} />
                                <span className="text-[8px] font-bold mt-1 uppercase">Thêm</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Card */}
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-[2.5rem] p-8 space-y-6">
                        <div className="flex items-center gap-3 text-indigo-700">
                           <BarChart3 size={18} />
                           <h3 className="text-[11px] font-black uppercase tracking-wider">Thống kê sân</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Giờ đặt tuần này</span>
                                <span className="text-xs font-black text-green-700">42h</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Doanh thu dự kiến</span>
                                <span className="text-xs font-black text-green-700 text-right">14.7M</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Đánh giá</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-black text-gray-900">4.8</span>
                                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default EditField;
