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
  Activity,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CreateTeammateMatch() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state || {};
  
  const [teamName, setTeamName] = useState('');
  const [skillLevel, setSkillLevel] = useState('amateur');
  const [date, setDate] = useState(bookingData.matchDate || '');
  const [time, setTime] = useState(bookingData.startTime || '');
  const [pitchType, setPitchType] = useState(bookingData.fieldType || 'Sân 7');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  // Teammate specific states
  const [maxPlayers, setMaxPlayers] = useState(1);
  const [currentPlayers, setCurrentPlayers] = useState(0);
  const [positionsNeeded, setPositionsNeeded] = useState([]);

  const POSITIONS = ['Thủ môn', 'Hậu vệ', 'Tiền vệ', 'Tiền đạo'];

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

  const togglePosition = (pos) => {
    if (positionsNeeded.includes(pos)) {
      setPositionsNeeded(positionsNeeded.filter(p => p !== pos));
    } else {
      setPositionsNeeded([...positionsNeeded, pos]);
    }
  };

  const handleSubmit = async () => {
    if (!teamName) {
      setError('Vui lòng nhập tên đội bóng của bạn!');
      return;
    }
    if (maxPlayers <= 0) {
      setError('Số lượng người cần tuyển phải lớn hơn 0!');
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
          match_type: 'find_teammate',
          title: `Tuyển đồng đội đá bóng`,
          field_type: pitchType,
          contact_phone: phoneNumber,
          match_date: date,
          start_time: time,
          end_time: time,
          skill_level_required: skillLevel,
          notes: message,
          current_players: currentPlayers,
          max_players: maxPlayers,
          positions_needed: positionsNeeded,
          status: 'open',
          booking_id: bookingData.bookingId
        })
      });

      if (response.ok) {
        alert('Đăng kèo tuyển đồng đội thành công!');
        navigate('/teammates');
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
    <div className="min-h-screen bg-[#fdfaf5] selection:bg-amber-100 pb-20 text-left">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-4">
          <span className="bg-amber-500 text-white text-[10px] uppercase font-black px-3 py-1 rounded-sm tracking-widest">TUYỂN QUÂN</span>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 items-start relative mb-20">
          <div className="flex-1">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-7xl font-black text-[#3a2a1a] leading-none mb-6 italic uppercase tracking-tighter"
            >
              Tìm thêm <span className="text-amber-500 block md:inline">đồng đội</span>
            </motion.h1>
            <p className="text-lg text-gray-500 max-w-xl mb-8 leading-relaxed font-medium">
              Bạn đã có sân, giờ chỉ cần thêm những người anh em cùng chí hướng để trận đấu thêm phần rực lửa.
            </p>

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
            <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl shadow-amber-900/10 border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800" 
                alt="Teammates" 
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
            <div className="w-12 h-1 bg-amber-500 rounded-full"></div>
            <h2 className="text-2xl font-black text-amber-900 uppercase tracking-tight italic">Thông tin tuyển quân</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Cột trái: Thông tin sân & Đội */}
            <div className="space-y-8">
              <motion.div whileHover={{ y: -5 }} className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100/50 mb-8">
                   <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3 leading-none italic">Sân bóng đã chọn</p>
                   <p className="text-xl font-black text-gray-900 uppercase italic leading-none">{bookingData.pitchName}</p>
                   <div className="flex gap-4 mt-3 text-[10px] font-bold text-gray-400 uppercase">
                      <span>📅 {bookingData.matchDate}</span>
                      <span>⏰ {bookingData.startTime}</span>
                      <span>⚽ {bookingData.fieldType}</span>
                   </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase font-black text-gray-400 mb-3 tracking-[0.2em]">Tên đội / Tên nhóm</label>
                    <input 
                      type="text"
                      placeholder="Nhập tên đội của bạn..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-amber-500 transition-all font-bold text-gray-700 outline-none"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-black text-gray-400 mb-3 tracking-[0.2em]">Cần tuyển thêm</label>
                      <input 
                        type="number"
                        min="1"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-amber-500 font-bold text-gray-700 outline-none"
                        value={maxPlayers}
                        onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-black text-gray-400 mb-3 tracking-[0.2em]">Trình độ yêu cầu</label>
                      <div className="relative">
                        <select 
                          className="w-full appearance-none bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-amber-500 font-bold text-gray-700 cursor-pointer outline-none"
                          value={skillLevel}
                          onChange={(e) => setSkillLevel(e.target.value)}
                        >
                          <option value="fun">Giao lưu vui vẻ</option>
                          <option value="amateur">Trung bình</option>
                          <option value="semi_pro">Khá</option>
                          <option value="pro">Chuyên nghiệp</option>
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Cột phải: Vị trí & Lời nhắn */}
            <div className="space-y-8">
              <motion.div whileHover={{ y: -5 }} className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                     <LayoutGrid className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-lg text-gray-900 uppercase tracking-tight">Vị trí còn thiếu</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                   {POSITIONS.map(pos => (
                     <button
                       key={pos}
                       onClick={() => togglePosition(pos)}
                       className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between ${
                         positionsNeeded.includes(pos) 
                         ? 'bg-amber-600 text-white shadow-lg shadow-amber-100' 
                         : 'bg-slate-50 text-gray-400 border border-slate-100 hover:bg-slate-100'
                       }`}
                     >
                       {pos}
                       {positionsNeeded.includes(pos) && <CheckCircle2 size={14} />}
                     </button>
                   ))}
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                     <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-lg text-gray-900 uppercase tracking-tight">Lời nhắn & Yêu cầu</h3>
                </div>
                <textarea 
                  placeholder="VD: Cần người nhiệt tình, vui vẻ, có mặt đúng giờ..."
                  className="w-full h-[100px] bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm focus:ring-2 focus:ring-amber-500 font-medium placeholder:text-gray-300 resize-none outline-none font-sans"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </motion.div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-10 border-t border-gray-100">
            <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 shrink-0">
                    <Activity size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">Xác thực hệ thống</p>
                  <p className="text-xs text-gray-500 font-bold">Kèo của bạn sẽ được ưu tiên hiển thị vì đã có sân xác thực.</p>
                </div>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={loading}
              className={`bg-amber-900 text-white px-12 py-5 rounded-3xl font-black text-xl flex items-center gap-4 hover:bg-black transition-all shadow-2xl shadow-amber-200 border-none cursor-not-allowed group ${loading ? 'opacity-50' : 'cursor-pointer'}`}
            >
              {loading ? 'ĐANG ĐĂNG...' : 'ĐĂNG KÈO TUYỂN QUÂN'}
              <Rocket className="w-6 h-6 rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </motion.button>
          </div>
        </section>
      </main>
    </div>
  );
}
