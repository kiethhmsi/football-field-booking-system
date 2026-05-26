import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Home, History, Printer, Download, MapPin, Phone, Mail, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const orderCode = searchParams.get('orderCode');

    useEffect(() => {
        if (orderCode) {
            fetch(`http://localhost:3000/api/bookings/code/${orderCode}`)
                .then(res => res.json())
                .then(res => {
                    if (res.data) setBooking(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [orderCode]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 flex flex-col items-center">
            {/* INVOICE CARD */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 print:shadow-none print:border-none print:m-0 print:w-full"
                id="invoice-content"
            >
                {/* Header Success Banner (Hide when printing) */}
                <div className="bg-emerald-500 p-8 text-center text-white print:hidden">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <CheckCircle2 size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-black uppercase italic tracking-tight">Thanh toán thành công!</h1>
                    <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mt-1">Cảm ơn bạn đã tin tưởng KASPORT</p>
                </div>

                {/* Main Invoice Part */}
                <div className="p-10 md:p-12 space-y-10">
                    {/* Brand & Invoice Info */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-black text-emerald-600 italic tracking-tighter leading-none mb-2">KASPORT.</h2>
                            <div className="space-y-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <p className="flex items-center gap-2"><MapPin size={10} /> Hệ thống sân bóng cao cấp</p>
                                <p className="flex items-center gap-2"><Phone size={10} /> 0901 000 100</p>
                                <p className="flex items-center gap-2"><Mail size={10} /> contact@kasport.vn</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Mã hóa đơn</p>
                            <p className="text-xl font-black text-slate-900 uppercase italic tracking-tight">#{booking?.booking_code || orderCode}</p>
                            <p className="text-[9px] font-bold text-slate-400 mt-1">{new Date().toLocaleString('vi-VN')}</p>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-50">
                        <div>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Khách hàng</p>
                            <p className="text-sm font-black text-slate-800 uppercase italic">{booking?.customer_name || 'Khách hàng KASPORT'}</p>
                            <p className="text-xs font-bold text-slate-500 mt-1">{booking?.customer_phone}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Trạng thái</p>
                            <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                Đã xác nhận
                            </span>
                        </div>
                    </div>

                    {/* Booking Details Table */}
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Chi tiết dịch vụ</p>
                        <div className="bg-slate-50 rounded-3xl p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-black text-slate-800 uppercase italic">{booking?.pitch_name || 'Sân bóng'}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                        📅 {booking?.booking_date ? new Date(booking.booking_date).toLocaleDateString('vi-VN') : '---'} | ⏰ {booking?.start_time?.substring(0,5)} - {booking?.end_time?.substring(0,5)}
                                    </p>
                                </div>
                                <p className="text-sm font-black text-slate-900 italic">{Number(booking?.total_price || 0).toLocaleString()}đ</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="space-y-3 pt-4">
                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <span>Tổng cộng</span>
                            <span className="text-slate-900">{Number(booking?.total_price || 0).toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-emerald-600 uppercase tracking-widest">
                            <span>Đã thanh toán trực tuyến</span>
                            <span className="font-black">-{Number(booking?.deposit_amount || 0).toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-dashed border-slate-200">
                            <span className="text-sm font-black text-slate-900 uppercase italic">Còn lại phải trả</span>
                            <span className="text-3xl font-black text-red-500 italic tracking-tighter">
                                {Math.max(0, Number(booking?.total_price || 0) - Number(booking?.deposit_amount || 0)).toLocaleString()}đ
                            </span>
                        </div>
                    </div>

                    {/* Footer / QR (Print only) */}
                    <div className="hidden print:flex justify-between items-center pt-10 mt-10 border-t border-slate-100">
                        <div className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed max-w-[60%]">
                            <p>* Vui lòng mang theo hóa đơn này (hoặc ảnh chụp) khi đến sân.</p>
                            <p>* Hóa đơn được xuất tự động bởi hệ thống KASPORT.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 border border-slate-100 rounded-lg flex items-center justify-center mb-2">
                                <QrCode size={40} className="text-slate-300" />
                            </div>
                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Quét để xác thực</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ACTION BUTTONS (Hide when printing) */}
            <div className="mt-10 flex flex-wrap justify-center gap-4 print:hidden">
                <button 
                    onClick={handlePrint}
                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest italic shadow-xl hover:bg-black transition-all active:scale-95 flex items-center gap-3 border-none cursor-pointer"
                >
                    <Printer size={18} /> In hóa đơn
                </button>
                <button 
                    onClick={() => navigate('/history')}
                    className="px-8 py-4 bg-white text-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest italic shadow-lg hover:bg-emerald-50 transition-all active:scale-95 flex items-center gap-3 border border-emerald-100 cursor-pointer"
                >
                    <History size={18} /> Lịch sử đặt sân
                </button>
                <button 
                    onClick={() => navigate('/')}
                    className="px-8 py-4 bg-white text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest italic shadow-sm hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-3 border border-slate-100 cursor-pointer"
                >
                    <Home size={18} /> Trang chủ
                </button>
            </div>

            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    body { background: white !important; padding: 0 !important; }
                    .print\\:hidden { display: none !important; }
                    #invoice-content { 
                        box-shadow: none !important; 
                        border: none !important; 
                        margin: 0 !important; 
                        width: 100% !important;
                        max-width: none !important;
                    }
                }
            `}} />
        </div>
    );
};

export default PaymentSuccess;
