import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  Plus, 
  Minus, 
  ChevronDown, 
  Rocket,
  LayoutGrid,
  Trophy,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function CreateMatch() {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [skillLevel, setSkillLevel] = useState('Vui vẻ');
  const [currentPlayers, setCurrentPlayers] = useState(5); // Mặc định đã có 5 người
  const [needToFind, setNeedToFind] = useState(2); // Mặc định cần tìm thêm 2 người
  const [positions, setPositions] = useState(['Tiền đạo']);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [pitchType, setPitchType] = useState('Sân 7');
  const [costType, setCostType] = useState('Chia đều');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const togglePosition = (pos) => {
    if (positions.includes(pos)) {
      setPositions(positions.filter(p => p !== pos));
    } else {
      setPositions([...positions, pos]);
    }
  };

  const handleSubmit = async () => {
    if (!teamName) {
      setError('Vui lòng nhập tên đội bóng!');
      return;
    }
    if (!date || !time) {
      setError('Vui lòng chọn ngày và giờ!');
      return;
    }
    if (!phoneNumber) {
      setError('Vui lòng nhập số điện thoại liên hệ!');
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
          title: `Tìm đồng đội đá ${pitchType}`,
          field_type: pitchType,
          contact_phone: phoneNumber,
          match_date: date,
          start_time: time,
          end_time: time,
          skill_level_required: skillLevel === 'Vui vẻ' ? 'fun' : (skillLevel === 'Bán chuyên' ? 'semi_pro' : 'pro'),
          positions_needed: positions,
          expense_sharing: costType,
          current_players: currentPlayers,
          max_players: currentPlayers + needToFind,
          status: 'open'
        })
      });

      if (response.ok) {
        alert('Đăng kèo tìm đồng đội thành công!');
        navigate('/teammates');
      } else {
        const result = await response.json();
        setError(result.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0fbff] selection:bg-emerald-100 pb-20 text-left">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {error && (
          <div className="max-w-4xl mx-auto mb-8 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
            <Activity size={20} />
            {error}
          </div>
        )}
        {/* Title Section */}
        <div className="mb-4">
          <span className="bg-emerald-500 text-white text-[10px] uppercase font-black px-3 py-1 rounded-sm tracking-widest">THÁCH ĐẤU</span>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 items-start relative mb-20">
          <div className="flex-1">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-7xl font-black text-[#1a3a3a] leading-none mb-6 italic italic uppercase tracking-tighter"
            >
              Tạo kèo <span className="text-emerald-500 block md:inline">tìm đồng đội</span>
            </motion.h1>
            <p className="text-lg text-gray-500 max-w-xl mb-8 leading-relaxed font-medium">
              Tìm kiếm đối trọng xứng tầm cho đội bóng của bạn. Kết nối, lên lịch và sẵn sàng bùng nổ trên sân cỏ ngay hôm nay.
            </p>
            
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img 
                    key={i}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} 
                    alt="User" 
                    className="w-12 h-12 rounded-full border-4 border-white object-cover shadow-sm bg-blue-50"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-400 font-bold uppercase tracking-tight">
                + 1.200 đội bóng đang chờ đối thủ
              </span>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 w-full lg:max-w-[500px]"
          >
            <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800" 
                alt="Football Stadium" 
                className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-6 h-6 text-emerald-400" />
                  <span className="font-black text-xl italic uppercase tracking-tighter">Hàng ngàn trận đấu mỗi tuần</span>
                </div>
                <p className="text-sm text-white/60 font-medium">Tham gia cộng đồng bóng đá lớn nhất khu vực</p>
              </div>
            </div>
          </motion.div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-100/30 blur-[120px] -z-10 rounded-full"></div>
        </div>

        {/* Form Sections */}
        <section className="bg-white/50 backdrop-blur-md p-8 md:p-14 rounded-[3.5rem] shadow-inner border border-white/50">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-1 bg-emerald-500 rounded-full"></div>
            <h2 className="text-2xl font-black text-emerald-900 uppercase tracking-tight italic">Thiết lập kèo đấu mới</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Card 1: Team & Match Info */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                   <Users className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-gray-900 uppercase tracking-tight">Thông tin đội bóng</h3>
              </div>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-400 mb-3 tracking-[0.2em]">Tên đội nhóm</label>
                  <input 
                    type="text" 
                    placeholder="VD: FC Meo Meo, ..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all font-medium placeholder:text-gray-300"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-400 mb-3 tracking-[0.2em]">Trình độ yêu cầu</label>
                  <div className="relative">
                    <select 
                      className="w-full appearance-none bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-gray-700 cursor-pointer"
                      value={skillLevel}
                      onChange={(e) => setSkillLevel(e.target.value)}
                    >
                      <option>Vui vẻ</option>
                      <option>Bán chuyên</option>
                      <option>Chuyên nghiệp</option>
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

            {/* Card 2: Quantity & Position */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                   <Activity className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-gray-900 uppercase tracking-tight">Số lượng & Vị trí</h3>
              </div>

              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] uppercase font-black text-gray-400 mb-4 tracking-[0.2em]">Số cầu thủ hiện có</label>
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={() => setCurrentPlayers(Math.max(0, currentPlayers - 1))}
                        className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full hover:bg-emerald-100 transition-colors border-none cursor-pointer"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="text-2xl font-black text-slate-800 min-w-[30px] text-center">{currentPlayers}</span>
                      <button 
                        onClick={() => setCurrentPlayers(currentPlayers + 1)}
                        className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full hover:bg-emerald-100 transition-colors border-none cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black text-gray-400 mb-4 tracking-[0.2em]">Số người cần tuyển thêm</label>
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={() => setNeedToFind(Math.max(1, needToFind - 1))}
                        className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full hover:bg-emerald-100 transition-colors border-none cursor-pointer"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="text-2xl font-black text-emerald-600 min-w-[30px] text-center">{needToFind}</span>
                      <button 
                        onClick={() => setNeedToFind(needToFind + 1)}
                        className="w-10 h-10 flex items-center justify-center bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100 border-none cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-400 mb-4 tracking-[0.2em]">Vị trí đang trống</label>
                  <div className="flex flex-wrap gap-2">
                    {['Tiền đạo', 'Tiền vệ', 'Hậu vệ', 'Thủ môn'].map((pos) => (
                      <button 
                        key={pos}
                        onClick={() => togglePosition(pos)}
                        className={`px-6 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          positions.includes(pos) 
                            ? 'bg-emerald-600 border-emerald-600 text-white' 
                            : 'bg-white border-slate-100 text-gray-500 hover:border-emerald-300'
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Time */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                   <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-gray-900 uppercase tracking-tight">Thời gian & Lịch</h3>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-400 mb-3 tracking-[0.2em]">Ngày thi đấu dự kiến</label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all uppercase font-bold text-gray-700 font-sans"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-400 mb-3 tracking-[0.2em]">Giờ bắt đầu</label>
                  <input 
                    type="time" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-gray-700 font-sans"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
            </motion.div>

            {/* Card 4: Pitch & Cost */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                   <LayoutGrid className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-gray-900 uppercase tracking-tight">Quy mô & Tài chính</h3>
              </div>

              <div className="space-y-10">
                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-400 mb-4 tracking-[0.2em]">Loại hình thi đấu</label>
                  <div className="flex gap-3">
                    {['Sân 5', 'Sân 7', 'Sân 11'].map((type) => (
                      <button 
                        key={type}
                        onClick={() => setPitchType(type)}
                        className={`flex-1 py-3.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                          pitchType === type 
                            ? 'bg-emerald-800 border-emerald-800 text-white shadow-md shadow-emerald-100' 
                            : 'bg-white border-slate-100 text-gray-400 hover:border-emerald-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-400 mb-3 tracking-[0.2em]">Hình thức chia tiền sân</label>
                  <div className="relative">
                    <select 
                      className="w-full appearance-none bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all font-black text-gray-700 cursor-pointer"
                      value={costType}
                      onChange={(e) => setCostType(e.target.value)}
                    >
                      <option>Chia đều</option>
                      <option>Chốt kèo (Đội chủ bao)</option>
                      <option>Thương lượng sau</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Submit Action */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-10 border-t border-gray-100">
            <div className="flex items-center gap-4 max-w-sm">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                    <Activity size={24} />
                </div>
                <p className="text-xs text-gray-400 font-bold uppercase leading-relaxed tracking-wider">
                  Kèo của bạn sẽ được hiển thị công khai trên bảng "Tìm Đồng Đội" sau khi được duyệt.
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
