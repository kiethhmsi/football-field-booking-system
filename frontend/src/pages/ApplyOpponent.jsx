import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Users, 
  Trophy, 
  Send, 
  ChevronDown,
  Info,
  AlertCircle
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ApplyOpponent() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Data State
  const [match, setMatch] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [skillLevel, setSkillLevel] = useState("amateur");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        // Fetch Match Info
        const matchRes = await fetch(`http://localhost:3000/api/matches/${id}`);
        const matchData = await matchRes.json();
        if (matchRes.ok) setMatch(matchData.data);
      } catch (err) {
        console.error('Lỗi lấy dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!teamName) {
      setError('Vui lòng nhập tên đội bóng của bạn!');
      return;
    }
    if (!contactPhone) {
      setError('Vui lòng nhập số điện thoại liên hệ!');
      return;
    }

    setSubmitting(true);
    setError("");

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/matches/${id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          applicant_team_name: teamName,
          applicant_skill_level: skillLevel,
          contact_phone: contactPhone,
          message: message
        })
      });

      if (response.ok) {
        alert("Cảm ơn đội bạn đã gửi lời ứng tuyển thách đấu! Đội trưởng sẽ liên hệ với bạn sớm.");
        navigate('/matches');
      } else {
        const result = await response.json();
        setError(result.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Lỗi kết nối');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen font-black italic uppercase text-emerald-800">Đang tải thông tin kèo...</div>;
  if (!match) return <div className="p-20 text-center font-black">KHÔNG TÌM THẤY KÈO ĐẤU</div>;

  return (
    <div className="min-h-screen bg-[#f0fbff] selection:bg-emerald-100 pb-20 text-left">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Back Link */}
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-emerald-600 text-xs font-black uppercase tracking-widest mb-10 transition-colors border-none bg-transparent cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </motion.button>

        {error && (
          <div className="max-w-4xl mx-auto mb-8 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Hero Section */}
        <section className="mb-14">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-[#1a3a3a] mb-4 italic uppercase tracking-tighter leading-none"
          >
            Ứng tuyển <span className="text-emerald-500">giao lưu</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 font-medium max-w-2xl"
          >
            Gửi lời mời thách đấu tới đối thủ của bạn. Kết nối và cùng tạo nên những trận đấu bùng nổ.
          </motion.p>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - Match Info (Sticky) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-12 xl:col-span-4"
          >
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-900/5 border border-slate-100 flex flex-col sticky top-28">
              <div className="relative aspect-[16/10]">
                <img 
                  src={match.team_logo || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800"}
                  alt="Stadium" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-emerald-600/90 backdrop-blur-md text-[10px] font-black text-white px-4 py-1.5 rounded-full uppercase tracking-widest">
                    {match.status === 'open' ? 'Đang chờ đối trọng' : 'Đã chốt kèo'}
                  </span>
                </div>
              </div>

              <div className="p-10">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Lời mời từ</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-10 italic uppercase tracking-tighter">{match.team_name}</h3>
                
                <div className="space-y-8">
                  <div className="flex items-center gap-5">
                    <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trình độ yêu cầu</p>
                      <p className="text-sm font-black text-slate-800 tracking-tight uppercase">{match.skill_level_required}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Thời gian dự kiến</p>
                      <p className="text-sm font-black text-slate-800 tracking-tight italic">
                        {new Date(match.match_date).toLocaleDateString('vi-VN')} | {match.start_time.substring(0, 5)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Địa điểm</p>
                      <p className="text-sm font-black text-slate-800 tracking-tight">{match.field_name || 'Tự chọn sân'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-12 xl:col-span-8"
          >
            <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-emerald-900/5 border border-slate-100">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-1.5 h-10 bg-emerald-500 rounded-full"></div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Thông tin ứng tuyển</h2>
              </div>
              
              <form onSubmit={handleFormSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Team Name Input */}
                  <div className="space-y-4">
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      TÊN ĐỘI CỦA BẠN
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <Users className="h-6 w-6 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="VD: FC Bất Bại..."
                        className="block w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all text-sm font-bold font-sans outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-4">
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      SỐ ĐIỆN THOẠI LIÊN HỆ
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <div className="h-6 w-6 text-slate-300 group-focus-within:text-emerald-500 transition-colors flex items-center justify-center">
                           <span style={{ fontSize: '18px' }}>📱</span>
                        </div>
                      </div>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="VD: 0987xxxxxx..."
                        className="block w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all text-sm font-bold font-sans outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Skill Level Selection */}
                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    TRÌNH ĐỘ ĐỘI
                  </label>
                  <div className="relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Trophy className="h-6 w-6 text-slate-300" />
                    </div>
                    <select
                      value={skillLevel}
                      onChange={(e) => setSkillLevel(e.target.value)}
                      className="block w-full pl-16 pr-14 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] text-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all text-sm font-bold appearance-none cursor-pointer font-sans outline-none"
                      required
                    >
                      <option value="fun">Giao lưu (Vui vẻ)</option>
                      <option value="amateur">Trung bình</option>
                      <option value="semi_pro">Khá (Bán chuyên)</option>
                      <option value="pro">Mạnh (Chuyên nghiệp)</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronDown className="h-6 w-6 text-slate-400 font-bold" />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Lời nhắn thách đấu / Ghi chú
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="VD: Đội mình đá văn minh, muốn giao lưu học hỏi..."
                    className="block w-full p-8 bg-slate-50 border-2 border-transparent rounded-[2.5rem] text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all text-sm font-medium resize-none shadow-inner font-sans outline-none"
                    required
                  />
                </div>

                {/* Info Note */}
                <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 flex items-start gap-4">
                     <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                     <p className="text-xs text-emerald-800/70 font-medium leading-relaxed">
                        Lời ứng tuyển của bạn sẽ được gửi tới đội trưởng của **{match.team_name}**. Họ sẽ liên hệ trực tiếp với bạn ngay khi phản hồi.
                     </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitting}
                    className={`flex-grow bg-emerald-800 text-white px-10 py-6 rounded-[2rem] font-black text-lg flex items-center justify-center hover:bg-black transition-all shadow-xl shadow-emerald-200 border-none cursor-pointer ${submitting ? 'opacity-50' : ''}`}
                  >
                    {submitting ? 'ĐANG GỬI...' : 'GỬI LỜI ỨNG TUYỂN'}
                    <Send className="w-6 h-6 ml-4 rotate-45" />
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="sm:w-1/3 bg-slate-100 text-slate-600 px-8 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-colors border-none cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
