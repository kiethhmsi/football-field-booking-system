import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  ChevronDown, 
  Rocket,
  LayoutGrid,
  MessageSquare,
  AlertCircle,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CreateOpponentMatch() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state || {};
  
  const [teamName, setTeamName] = useState('');
  const [skillLevel, setSkillLevel] = useState('amateur');
  const [date, setDate] = useState(bookingData.matchDate || '');
  const [time, setTime] = useState(bookingData.startTime || '');
  const [pitchType, setPitchType] = useState(bookingData.fieldType || 'Sân 7');
  const [costType, setCostType] = useState('Chia sẻ 50-50');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    if (!bookingData.bookingId) {
      navigate('/create-match-booking');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert('Hết thời gian giữ sân. Vui lòng thực hiện lại!');
          navigate('/create-match-booking');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [bookingData.bookingId, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      }
    };
    checkLogin();
  }, [navigate]);

  const handleSubmit = async () => {
    if (!teamName) {
      setError('Vui lòng nhập tên đội bóng của bạn!');
      return;
    }
    if (!date || !time) {
      setError('Vui lòng chọn ngày và giờ thi đấu!');
      return;
    }

    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          host_team_name: teamName,
          match_type: 'find_opponent',
          title: `Kèo giao hữu`,
          field_type: pitchType,
          contact_phone: phoneNumber,
          match_date: date,
          start_time: time,
          end_time: time,
          skill_level_required: skillLevel,
          expense_sharing: costType,
          notes: message,
          status: 'open',
          booking_id: bookingData.bookingId
        })
      });

      if (response.ok) {
        alert('Đăng kèo thành công!');
        navigate('/matches');
      } else {
        const result = await response.json();
        setError(result.message || 'Có lỗi xảy ra khi đăng kèo');
      }
    } catch (err) {
      setError('Lỗi kết nối đến máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0fbff] selection:bg-emerald-100 pb-20 text-left">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-4">
          <span className="bg-emerald-500 text-white text-[10px] uppercase font-black px-3 py-1 rounded-sm tracking-widest">GIAO HỮU</span>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 items-start relative mb-20">
          <div className="flex-1">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-7xl font-black text-[#1a3a3a] leading-none mb-6 italic uppercase tracking-tighter"
            >
              Tạo kèo <span className="text-emerald-500 block md:inline">tìm đối thủ</span>
            </motion.h1>
            <p className="text-lg text-gray-500 max-w-xl mb-8 leading-relaxed font-medium">
              Bạn đang ở bước cuối cùng. Hãy điền thông tin đội bóng để các đối thủ có thể tìm thấy và thách đấu bạn ngay.
            </p>

            {/* Countdown Timer */}
            <div className="inline-flex items-center gap-4 bg-orange-50 border border-orange-100 px-6 py-4 rounded-3xl shadow-sm mb-8">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white animate-pulse">
                    <Clock size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest leading-none mb-1">Thời gian giữ sân còn lại</p>
                    <p className="text-2xl font-black text-orange-600 leading-none tabular-nums tracking-tighter italic">
                        {formatTime(timeLeft)}
                    </p>
                </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 w-full lg:max-w-[500px]"
          >
            <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1543326168-984e72355529?q=80&w=800" 
                alt="Football Match" 
                className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </motion.div>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mb-8 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <section className="bg-white/50 backdrop-blur-md p-8 md:p-14 rounded-[3.5rem] shadow-inner border border-white/50">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-1 bg-emerald-500 rounded-full"></div>
            <h2 className="text-2xl font-black text-emerald-900 uppercase tracking-tight italic">Đăng kèo thách đấu</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                   <Users className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-gray-900 uppercase tracking-tight">Thông tin đội bóng</h3>
              </div>
              
              <div className="space-y-8">
                <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100/50">
                   <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 leading-none">Sân bóng đã chọn</p>
                   <p className="text-xl font-black text-gray-900 uppercase italic leading-none">{bookingData.pitchName}</p>
                   <div className="flex gap-4 mt-3 text-[10px] font-bold text-gray-400 uppercase">
                      <span>📅 {bookingData.matchDate}</span>
                      <span>⏰ {bookingData.startTime}</span>
                      <span>⚽ {bookingData.fieldType}</span>
                   </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-400 mb-3 tracking-[0.2em]">Tên đội bóng của bạn</label>
                  <input 
                    type="text"
                    placeholder="Nhập tên đội bóng..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-gray-700 outline-none"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-400 mb-3 tracking-[0.2em]">Trình độ đội</label>
                  <div className="relative">
                    <select 
                      className="w-full appearance-none bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-gray-700 cursor-pointer outline-none"
                      value={skillLevel}
                      onChange={(e) => setSkillLevel(e.target.value)}
                    >
                      <option value="fun">Giao lưu (Vui vẻ)</option>
                      <option value="amateur">Trung bình</option>
                      <option value="semi_pro">Khá (Bán chuyên)</option>
                      <option value="pro">Mạnh (Chuyên nghiệp)</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-400 mb-3 tracking-[0.2em]">Số điện thoại liên hệ</label>
                  <input 
                    type="tel"
                    placeholder="Nhập số điện thoại..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-gray-700 outline-none"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                   <LayoutGrid className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-gray-900 uppercase tracking-tight">Chi phí & Kèo nước</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-400 mb-3 tracking-[0.2em]">Hình thức chi phí</label>
                  <div className="relative">
                    <select 
                      className="w-full appearance-none bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-emerald-500 font-bold text-gray-700 cursor-pointer outline-none"
                      value={costType}
                      onChange={(e) => setCostType(e.target.value)}
                    >
                      <option>Chia sẻ tiền sân (50-50)</option>
                      <option>Kèo bao sân (Đội nhà chi)</option>
                      <option>Thương lượng sau trận</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                   <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-gray-900 uppercase tracking-tight">Lời nhắn</h3>
              </div>
              <textarea 
                placeholder="VD: Tìm đội đá văn minh, không chơi xấu..."
                className="w-full h-[120px] bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm focus:ring-2 focus:ring-emerald-500 font-medium placeholder:text-gray-300 resize-none outline-none font-sans"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </motion.div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-10 border-t border-gray-100">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                    <Activity size={24} />
                </div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  Kèo thách đấu của bạn sẽ hiển thị ngay lập tức.
                </p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={loading}
              className={`bg-emerald-900 text-white px-12 py-5 rounded-3xl font-black text-xl flex items-center gap-4 hover:bg-black transition-all shadow-2xl shadow-emerald-200 border-none cursor-pointer group ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? 'ĐANG ĐĂNG...' : 'ĐĂNG KÈO NGAY'}
              <Rocket className="w-6 h-6 rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </motion.button>
          </div>
        </section>
      </main>
    </div>
  );
}
