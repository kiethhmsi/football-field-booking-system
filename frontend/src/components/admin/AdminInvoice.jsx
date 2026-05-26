import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  UserSquare2, 
  Leaf, 
  Receipt 
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const AdminInvoice = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const invoiceId = id || "#HD-9021";

    const paymentItems = [
        { name: 'Thuê sân (1.5 giờ)', sub: 'Khung giờ cao điểm', qty: 1, price: '900.000đ', total: '900.000đ' },
        { name: 'Nước suối Aquafina', sub: 'Chai 500ml', qty: 24, price: '10.000đ', total: '240.000đ' },
        { name: 'Thuê áo bít', sub: 'Set 14 áo', qty: 1, price: '60.000đ', total: '60.000đ' },
        { name: 'Giảm giá thành viên', sub: 'Mã: STADIUMVIP', qty: '-', price: '-0%', total: '0đ', isDiscount: true },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pb-12 text-left"
        >
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[#059669] hover:underline text-xs font-bold transition-all group bg-transparent border-none cursor-pointer"
            >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Quay lại
            </button>

            {/* Banner Header */}
            <div className="bg-[#059669] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-xl shadow-green-900/10">
                {/* Decorative Icon Background */}
                <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                    <Receipt size={200} className="stroke-[1]" />
                </div>

                <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-4">MÃ GIAO DỊCH: 902188</p>
                    <h2 className="text-4xl font-black mb-6 leading-tight italic uppercase tracking-tighter">Chi tiết Hóa đơn {invoiceId}</h2>
                    
                    <div className="flex flex-wrap items-center gap-10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                <Calendar size={16} />
                            </div>
                            <span className="text-sm font-bold text-white/90 tracking-wide uppercase">Ngày 24/05/2024</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                <Clock size={16} />
                            </div>
                            <span className="text-sm font-bold text-white/90 tracking-wide uppercase">17:00 - 18:30 (1.5 giờ)</span>
                        </div>
                        
                        <div className="ml-auto">
                            <div className="bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full flex items-center gap-2 border border-white/20">
                                <CheckCircle2 size={20} className="text-white" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Đã thanh toán 100%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Customer Info Card */}
                    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                                <UserSquare2 size={20} />
                            </div>
                            <h3 className="font-bold text-gray-900 italic uppercase">Khách hàng</h3>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1.5">Họ và tên</p>
                                <p className="text-lg font-black text-gray-900 leading-none italic uppercase">Nguyễn Thành Trung</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1.5">Số điện thoại</p>
                                <p className="text-md font-bold text-gray-700 tracking-wide">090 1234 567</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1.5">Email</p>
                                <p className="text-sm font-medium text-gray-500">trung.nt@example.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Field Info Card */}
                    <div className="bg-indigo-50/40 border border-indigo-100/50 rounded-[2.5rem] p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                <Leaf size={20} />
                            </div>
                            <h3 className="font-bold text-indigo-900 italic uppercase">Thông tin sân</h3>
                        </div>
                        
                        <div className="flex items-center gap-4 bg-white/60 rounded-3xl p-4 border border-white">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-400">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900 italic uppercase leading-tight">Sân 7 - Cụm A1</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mặt cỏ nhân tạo FIFA</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Payment Details Card */}
                    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm">
                        <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-100">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center">
                                <Receipt size={20} />
                            </div>
                            <h3 className="font-bold text-gray-900 italic uppercase">Chi tiết thanh toán</h3>
                        </div>

                        <div className="overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-50">
                                        <th className="py-4">Hạng mục</th>
                                        <th className="py-4 text-center">SL</th>
                                        <th className="py-4 text-right">Đơn giá</th>
                                        <th className="py-4 text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {paymentItems.map((item, idx) => (
                                        <tr key={idx} className="group">
                                            <td className="py-6">
                                                <p className={`text-sm font-bold ${item.isDiscount ? 'text-green-700' : 'text-gray-800'} leading-none mb-1.5`}>{item.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">{item.sub}</p>
                                            </td>
                                            <td className="py-6 text-center text-sm font-bold text-gray-600">{item.qty}</td>
                                            <td className="py-6 text-right text-sm font-bold text-gray-900">{item.price}</td>
                                            <td className={`py-6 text-right text-sm font-black ${item.isDiscount ? 'text-green-600' : 'text-gray-900'}`}>{item.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            <div className="mt-10 pt-8 border-t border-dashed border-gray-100 space-y-4">
                                <div className="flex justify-between items-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                                    <span>Tạm tính</span>
                                    <span className="text-gray-600">1.200.000đ</span>
                                </div>
                                <div className="flex justify-between items-center bg-gray-50/50 rounded-[2rem] p-6 border border-gray-100">
                                    <span className="text-xs font-black uppercase text-gray-900 tracking-[0.2em] italic">TỔNG CỘNG</span>
                                    <span className="text-2xl font-black text-[#059669] tracking-tighter">1.200.000đ</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment History Card */}
                    <div className="bg-gray-50/80 border border-gray-100 rounded-[2.5rem] p-8">
                        <h3 className="text-[10px] font-black uppercase text-green-700 tracking-[0.3em] mb-8">LỊCH SỬ THANH TOÁN</h3>
                        <div className="space-y-6">
                            {[
                                { title: 'Thanh toán cọc 50%', details: '20/05/2024 - Chuyển khoản ngân hàng (600.000đ)', active: true },
                                { title: 'Thanh toán hoàn tất', details: '24/05/2024 - Tiền mặt tại quầy (600.000đ)', active: true }
                            ].map((step, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="mt-1">
                                        <div className={`w-2.5 h-2.5 rounded-full ${step.active ? 'bg-green-600 shadow-md shadow-green-600/30' : 'bg-gray-300'}`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 leading-none mb-1.5 uppercase tracking-tight">{step.title}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide leading-relaxed">{step.details}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminInvoice;
