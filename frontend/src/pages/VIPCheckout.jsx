import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ArrowRight, ShieldCheck, CheckCircle2, Clock, Landmark, AlertCircle, Copy, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const VIPCheckout = () => {
  const { user, token, upgradeToVIP } = useAuth();
  const navigate = useNavigate();

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(4);

  // Generate mock details
  const transactionId = `KSP-VIP-${Math.floor(100000 + Math.random() * 900000)}`;
  const amount = "50.000";
  const bankName = "MB Bank (Ngân hàng Quân Đội)";
  const accountNumber = "0346201787";
  const accountName = "CONG TY TNHH KASPORT COMPLEX";
  const transferContent = `KASPORT VIP ${user?.phone_number || '0346201787'}`;

  // QR Code generator URL (VietQR standard mock matching VietQR and PayOS look)
  const qrUrl = `https://img.vietqr.io/image/MB-${accountNumber}-compact2.png?amount=50000&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(accountName)}`;

  useEffect(() => {
    // Redirect if not logged in
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    let interval;
    if (paymentSuccess && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (paymentSuccess && secondsLeft === 0) {
      navigate('/');
    }
    return () => clearInterval(interval);
  }, [paymentSuccess, secondsLeft, navigate]);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirmPayment = async () => {
    try {
      setLoading(true);
      // Gọi API nâng cấp VIP trên backend thực tế (lưu MySQL)
      const res = await upgradeToVIP();
      if (res.success) {
        setPaymentSuccess(true);
      } else {
        alert(res.message || "Giao dịch lỗi, vui lòng thử lại!");
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi kết nối hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] text-gray-900 flex items-center justify-center p-6 relative overflow-hidden select-none">
        {/* Glow Particles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 blur-[150px] rounded-full" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white border border-gray-100 p-10 rounded-[3rem] text-center relative z-10 shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-tr from-[#10b981] to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_10px_35px_rgba(16,185,129,0.2)]"
          >
            <CheckCircle2 size={44} className="text-white" />
          </motion.div>

          <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4 text-emerald-600">Nâng Cấp Thành Công!</h2>
          <p className="text-gray-600 font-medium text-sm leading-relaxed mb-8">
            Chúc mừng <span className="text-gray-900 font-black">{user?.full_name}</span> đã chính thức kích hoạt đặc quyền thành viên <span className="text-emerald-600 font-black">VIP GOLD</span> của KaSport Complex!
          </p>

          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-xs text-emerald-800 font-black uppercase tracking-widest mb-8 leading-relaxed">
            Huy hiệu VIP đã được hiển thị trên avatar của bạn.<br/>Các đặc quyền ưu tiên bài đăng đã kích hoạt!
          </div>

          <p className="text-xs text-gray-400 font-semibold mb-2">Đang chuyển bạn về Trang chủ...</p>
          <div className="text-lg font-black text-emerald-600">{secondsLeft}s</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-900 py-20 px-6 md:px-12 relative overflow-hidden select-none">
      {/* Background spotlights */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px] mb-3 flex items-center justify-center gap-1.5">
            <CreditCard size={14} /> CỔNG THANH TOÁN PAYOS HỖ TRỢ KASPORT
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter italic uppercase text-gray-950">Thanh Toán Nâng Cấp VIP</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: QR Scan Card */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 text-center flex flex-col items-center justify-center h-full shadow-[0_15px_50px_-15px_rgba(0,0,0,0.05)] relative group transition-all duration-300">
              
              {/* Scan Banner */}
              <div className="absolute top-4 left-4 bg-emerald-600 text-white text-[8px] font-black uppercase px-2.5 py-1 rounded-full tracking-widest">
                PayOS LIVE
              </div>

              {/* QR Code image */}
              <div className="bg-white p-4 rounded-3xl mb-6 shadow-2xl relative w-48 h-48 flex items-center justify-center overflow-hidden border-2 border-emerald-500/10">
                <img src={qrUrl} alt="VietQR PayOS" className="w-full h-full object-contain" />
              </div>

              <h4 className="text-sm font-black uppercase tracking-wider mb-2 text-gray-900">Quét Mã QR Chuyển Khoản</h4>
              <p className="text-[10px] text-gray-500 font-medium leading-relaxed max-w-[200px]">
                Sử dụng app ngân hàng hoặc ví điện tử (MoMo, ZaloPay, ...) quét mã để thanh toán tự động.
              </p>

              {/* Status pulsing bar */}
              <div className="mt-6 flex items-center gap-2 bg-amber-50 border border-amber-200/60 px-4 py-2 rounded-xl text-[9px] font-black text-amber-700 uppercase tracking-widest animate-pulse shrink-0">
                <Clock size={12} /> Đang chờ chuyển khoản...
              </div>
            </div>
          </div>

          {/* Right Column: Transaction Invoice details */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 flex-1 flex flex-col justify-between shadow-[0_15px_50px_-15px_rgba(0,0,0,0.05)] relative transition-all duration-300">
              
              <div>
                <h3 className="text-xl font-black italic uppercase tracking-tighter text-emerald-800 mb-6 flex items-center gap-2 pl-1">
                  <Landmark size={18} /> Thông Tin Đơn Hàng & Chuyển Khoản
                </h3>

                {/* Detail rows */}
                <div className="space-y-4 mb-8 text-left">
                  {/* Row 1: Gói VIP */}
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 text-xs text-left">
                    <span className="text-gray-500 font-bold">Gói dịch vụ</span>
                    <span className="font-black text-gray-900 uppercase tracking-wider">VIP Monthly (30 ngày)</span>
                  </div>

                  {/* Row 2: Số tiền */}
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 text-xs text-left">
                    <span className="text-gray-500 font-bold">Số tiền chuyển</span>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-emerald-600 text-lg italic tracking-tighter">{amount} đ</span>
                      <button 
                        onClick={() => handleCopy("50000", "amount")}
                        className="p-1 rounded bg-gray-50 hover:bg-gray-100 border border-gray-200 cursor-pointer text-gray-400 hover:text-gray-600"
                      >
                        {copiedField === 'amount' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>

                  {/* Row 3: Ngân hàng */}
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 text-xs text-left">
                    <span className="text-gray-500 font-bold">Ngân hàng</span>
                    <span className="font-black text-gray-900">{bankName}</span>
                  </div>

                  {/* Row 4: Số TK */}
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 text-xs text-left">
                    <span className="text-gray-500 font-bold">Số tài khoản</span>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-gray-900 tracking-widest">{accountNumber}</span>
                      <button 
                        onClick={() => handleCopy(accountNumber, "accountNumber")}
                        className="p-1 rounded bg-gray-50 hover:bg-gray-100 border border-gray-200 cursor-pointer text-gray-400 hover:text-gray-600"
                      >
                        {copiedField === 'accountNumber' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>

                  {/* Row 5: Chủ tài khoản */}
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 text-xs text-left">
                    <span className="text-gray-500 font-bold">Chủ tài khoản</span>
                    <span className="font-black text-gray-900">{accountName}</span>
                  </div>

                  {/* Row 6: Nội dung chuyển khoản */}
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 text-xs text-left">
                    <span className="text-gray-500 font-bold">Nội dung chuyển khoản</span>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded border border-emerald-100 tracking-wide text-xs">{transferContent}</span>
                      <button 
                        onClick={() => handleCopy(transferContent, "transferContent")}
                        className="p-1 rounded bg-gray-50 hover:bg-gray-100 border border-gray-200 cursor-pointer text-gray-400 hover:text-gray-600"
                      >
                        {copiedField === 'transferContent' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Important notice */}
                <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200/60 rounded-2xl p-4 text-[10px] text-amber-800 font-medium leading-relaxed mb-6 text-left">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>Chú ý: Bạn vui lòng chuyển khoản đúng số tiền **50.000đ** và nội dung chuyển khoản chính xác để hệ thống PayOS kích hoạt VIP tự động.</span>
                </div>
              </div>

              {/* Bypass action button */}
              <button
                onClick={handleConfirmPayment}
                disabled={loading}
                className="w-full py-4.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-[0_10px_25px_rgba(16,185,129,0.3)] transition-all border-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN ĐÃ THANH TOÁN (DEMO BYPASS)"} <ArrowRight size={14} />
              </button>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default VIPCheckout;
