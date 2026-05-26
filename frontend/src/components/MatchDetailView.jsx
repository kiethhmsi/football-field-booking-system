import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Droplets, 
  Plus, 
  CheckCircle2, 
  Home, 
  Swords, 
  MapPin, 
  Clock, 
  MessageCircle,
  Phone,
  ShieldCheck,
  AlertCircle,
  Trophy,
  Activity,
  UserCheck,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MatchDetailView({ match }) {
  const [isApplied, setIsApplied] = useState(false);
  const navigate = useNavigate();

  if (!match) return <div className="py-20 text-center font-black italic uppercase tracking-widest text-slate-400">Không tìm thấy thông tin kèo đấu.</div>;

  const isOpponentMatch = match.match_type === 'find_opponent';
  
  // Trạng thái kèo
  const getStatusInfo = (status) => {
    switch (status) {
      case 'open': return { label: 'Đang tuyển', color: 'bg-emerald-500', text: 'text-white' };
      case 'matched': return { label: 'Đã đủ quân', color: 'bg-blue-500', text: 'text-white' };
      case 'confirmed': return { label: 'Xác nhận', color: 'bg-amber-500', text: 'text-white' };
      case 'completed': return { label: 'Hoàn thành', color: 'bg-slate-500', text: 'text-white' };
      default: return { label: 'Đang tìm', color: 'bg-emerald-500', text: 'text-white' };
    }
  };

  const statusInfo = getStatusInfo(match.status);
  const currentCount = match.current_players + (match.accepted_count || 0);
  const progress = (currentCount / match.max_players) * 100;

  // --- 🤝 RENDER GIAO DIỆN TÌM ĐỒNG ĐỘI ---
  const renderTeammateView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* CỘT TRÁI: THÔNG TIN CHI TIẾT TUYỂN DỤNG */}
      <div className="lg:col-span-2 space-y-8 text-left">
        
        {/* 🏷️ THÔNG TIN ĐỘI & TRẬN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-8 italic flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" /> Thông tin đội
              </h3>
              <div className="space-y-6 relative z-10">
                 <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phong cách</span>
                    <span className="text-sm font-black text-slate-900 italic uppercase">Đá vui vẻ</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trình độ</span>
                    <span className="text-sm font-black text-emerald-600 italic uppercase">{match.skillLevel}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Độ tuổi</span>
                    <span className="text-sm font-black text-slate-900 italic uppercase">18 - 35 tuổi</span>
                 </div>
              </div>
           </section>

           <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-8 italic flex items-center gap-2">
                <Calendar size={14} className="text-emerald-500" /> Thông tin trận
              </h3>
              <div className="space-y-6 relative z-10">
                 <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sân thi đấu</span>
                    <span className="text-sm font-black text-slate-900 italic uppercase">{match.field_type || 'Sân 5'}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Giờ bóng lăn</span>
                    <span className="text-sm font-black text-[#059669] italic uppercase">{match.time} - {match.end_time?.substring(0, 5) || 'Kết thúc'}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày</span>
                    <span className="text-sm font-black text-slate-900 italic uppercase">{match.matchDate}</span>
                 </div>
              </div>
           </section>
        </div>

        {/* 📊 PROGRESS BAR TUYỂN QUÂN */}
        <section className="bg-[#0F172A] p-10 rounded-[3rem] text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-10"><Users size={150} /></div>
           <div className="relative z-10">
              <div className="flex justify-between items-end mb-8">
                 <div className="space-y-1">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-emerald-400">Tiến độ tuyển quân</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Đang cần thêm: <span className="text-white">{match.max_players - currentCount} cầu thủ</span></p>
                 </div>
                 <span className="text-3xl font-black italic text-white">{currentCount}/{match.max_players}</span>
              </div>
              
              <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden mb-12 border border-slate-700 shadow-inner">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${progress}%` }}
                   className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                 />
              </div>

              <div className="flex flex-wrap gap-8 items-center">
                 {match.players?.map((player, i) => (
                    <div key={i} className="flex flex-col items-center gap-3 group">
                       <div className="relative">
                          <div className="w-16 h-16 rounded-full border-2 border-emerald-500 p-1 bg-slate-800 transition-transform group-hover:scale-110">
                             <img src={player.avatar} alt={player.name} className="w-full h-full object-cover rounded-full" />
                          </div>
                          {player.isCaptain && (
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-zinc-900 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Captain</div>
                          )}
                       </div>
                       <span className="text-xs font-black italic uppercase text-slate-400">{player.name}</span>
                    </div>
                 ))}
                 {Array.from({ length: Math.max(0, match.max_players - currentCount) }).slice(0, 3).map((_, i) => (
                    <div key={`empty-${i}`} className="flex flex-col items-center gap-3 opacity-20">
                       <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-500 flex items-center justify-center"><Plus size={20} className="text-slate-500" /></div>
                       <span className="text-[10px] font-black uppercase text-slate-500 italic">Trống</span>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* 📋 MÔ TẢ ĐỘI */}
        <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
           <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-6 italic">📋 Mô tả đội & Trận đấu</h3>
           <p className="text-lg font-medium text-slate-700 leading-relaxed italic font-sans">
              "{match.experience || 'Đội đá vui vẻ, ưu tiên đúng giờ và tinh thần thể thao cao. Rất hân hạnh được kết nối cùng các hảo thủ!'}"
           </p>
        </section>
      </div>

      {/* CỘT PHẢI: CHI PHÍ & VỊ TRÍ */}
      <div className="space-y-8 text-left">
        {/* 💰 CHI PHÍ MỖI NGƯỜI */}
        <section className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-200 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12 group-hover:rotate-45 transition-transform"><DollarSign size={80} /></div>
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 opacity-60 italic">Chi phí mỗi người</h3>
           <div className="space-y-2 relative z-10">
              <p className="text-4xl font-black italic tracking-tighter">
                {match.fieldPrice ? Math.round(match.fieldPrice / match.max_players).toLocaleString() + 'đ' : 'Giao lưu'}
              </p>
              <p className="text-[10px] font-black uppercase opacity-60">Dự kiến chia đều / {match.max_players} người</p>
           </div>
        </section>

        {/* ⚽ VỊ TRÍ CẦN TUYỂN */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-8 italic flex items-center gap-2">
             <Activity size={14} className="text-emerald-500" /> Vị trí cần tuyển
           </h3>
           <div className="flex flex-wrap gap-3">
              {(match.positionsNeeded?.length > 0 ? match.positionsNeeded : ['Thủ môn', 'Hậu vệ', 'Tiền đạo']).map((pos, i) => (
                <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest italic flex items-center gap-2">
                   <Zap size={10} className="text-amber-500" /> {pos}
                </span>
              ))}
           </div>
        </section>

        {/* 🔥 NÚT HÀNH ĐỘNG */}
        <div className="space-y-3">
           <button 
              onClick={() => navigate(`/apply/teammate/${match.id}`)}
              className="w-full py-6 rounded-2xl font-black italic uppercase tracking-[0.2em] transition-all shadow-xl border-none cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 flex items-center justify-center gap-3 text-sm"
           >
              <UserCheck size={20} /> THAM GIA NGAY
           </button>
        </div>
      </div>
    </div>
  );

  // --- ⚔️ RENDER GIAO DIỆN TÌM ĐỐI THỦ (OLD VIEW UPDATED) ---
  const renderOpponentView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* CỘT TRÁI: CHI TIẾT KÈO ĐẤU */}
      <div className="lg:col-span-2 space-y-8 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-8 italic flex items-center gap-2"><Trophy size={14} className="text-emerald-500" /> Thông tin kèo</h3>
              <div className="space-y-6">
                 <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loại kèo</span>
                    <span className="text-sm font-black text-slate-900 italic uppercase">{match.side_bet || 'Giao lưu'}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trình độ</span>
                    <span className="text-sm font-black text-emerald-600 italic uppercase">{match.skillLevel}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số người</span>
                    <span className="text-sm font-black text-slate-900 italic uppercase">{match.field_type || 'Sân 7'}</span>
                 </div>
                 <div className="pt-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Mô tả</p>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed font-sans italic">{match.experience || 'Đá vui vẻ, không toxic, nâng cao sức khỏe.'}</p>
                 </div>
              </div>
           </section>

           <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-8 italic flex items-center gap-2"><MapPin size={14} className="text-emerald-500" /> Thông tin sân</h3>
              <div className="space-y-6">
                 <div className="flex flex-col gap-1 border-b border-slate-50 pb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sân thi đấu</span>
                    <span className="text-sm font-black text-slate-900 italic uppercase">{match.field_name || 'Đang cập nhật'}</span>
                 </div>
                 <div className="flex flex-col gap-1 border-b border-slate-50 pb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Địa điểm</span>
                    <span className="text-sm font-black text-slate-600 italic uppercase leading-tight">{match.field_address || 'KaSport Complex'}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày</span>
                    <span className="text-sm font-black text-slate-900 italic uppercase">{match.matchDate}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Giờ</span>
                    <span className="text-sm font-black text-[#059669] italic uppercase flex items-center gap-2"><Clock size={14} /> {match.time} - {match.end_time?.substring(0, 5) || 'Kết thúc'}</span>
                 </div>
              </div>
           </section>
        </div>

        {/* 👥 ĐỘI HÌNH THAM CHIẾN */}
        <section className="bg-[#0F172A] p-10 rounded-[3rem] text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-10"><Users size={150} /></div>
           <div className="relative z-10">
              <div className="flex justify-between items-end mb-10">
                 <div className="space-y-1">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">Đội hình tham chiến</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Danh sách hảo thủ đăng ký</p>
                 </div>
                 <div className="bg-emerald-500/20 px-4 py-2 rounded-xl border border-emerald-500/30">
                    <span className="text-lg font-black italic text-emerald-400">{currentCount}/{match.max_players}</span>
                    <span className="text-[10px] font-black text-emerald-200 ml-2 uppercase">Cầu thủ</span>
                 </div>
              </div>
              <div className="flex flex-wrap gap-8 items-center">
                 {match.players?.map((player, i) => (
                    <div key={i} className="flex flex-col items-center gap-3 group">
                       <div className="relative">
                          <div className="w-16 h-16 rounded-full border-2 border-emerald-500 p-1 bg-slate-800 transition-transform group-hover:scale-110">
                             <img src={player.avatar} alt={player.name} className="w-full h-full object-cover rounded-full" />
                          </div>
                          {player.isCaptain && (<div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-zinc-900 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Captain</div>)}
                       </div>
                       <span className="text-xs font-black italic uppercase text-slate-400 group-hover:text-white transition-colors">{player.name}</span>
                    </div>
                 ))}
              </div>
           </div>
        </section>
      </div>

      {/* CỘT PHẢI: ACTIONS & COSTS */}
      <div className="space-y-8 text-left">
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30">
           <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-8 italic flex items-center gap-2"><DollarSign size={14} className="text-emerald-500" /> Chi phí trận đấu</h3>
           <div className="space-y-6">
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng tiền sân</span>
                 <span className="text-3xl font-black text-slate-900 italic">{match.fieldPrice ? Number(match.fieldPrice).toLocaleString() + 'đ' : '---'}</span>
              </div>
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest italic">Mỗi đội đóng dự kiến</span>
                    <span className="text-2xl font-black text-[#059669] italic">{match.fieldPrice ? (Number(match.fieldPrice) / 2).toLocaleString() + 'đ' : 'Giao lưu'}</span>
                 </div>
              </div>
           </div>
        </section>

        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-6 italic flex items-center gap-2"><Activity size={14} className="text-emerald-500" /> Yêu cầu đối thủ</h3>
           <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm font-bold text-slate-600 italic uppercase tracking-tight"><CheckCircle2 size={16} className="text-emerald-500" /> Đá Fairplay, Không Toxic</li>
              <li className="flex items-center gap-3 text-sm font-bold text-slate-600 italic uppercase tracking-tight"><CheckCircle2 size={16} className="text-emerald-500" /> Đúng giờ (Có mặt trước 15p)</li>
              <li className="flex items-center gap-3 text-sm font-bold text-slate-600 italic uppercase tracking-tight"><CheckCircle2 size={16} className="text-emerald-500" /> Trang phục bóng đá chỉnh tề</li>
              <li className="flex items-center gap-3 text-sm font-bold text-slate-600 italic uppercase tracking-tight"><AlertCircle size={16} className="text-amber-500" /> Mang áo tối màu (Xanh/Đen)</li>
           </ul>
        </section>

        <div className="space-y-3">
           <button onClick={() => navigate(`/apply/opponent/${match.id}`)} className="w-full py-6 rounded-2xl font-black italic uppercase tracking-widest transition-all shadow-xl border-none cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 flex items-center justify-center gap-3"><Swords size={20} /> ỨNG TUYỂN</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-24">
      <div className="max-w-6xl mx-auto px-4 md:px-12 pt-10 text-left">
        {/* HEADER SECTION (SHARED) */}
        <div className="flex flex-col lg:flex-row gap-8 items-start mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
            <div className="flex items-center gap-3 mb-4">
               <span className={`${statusInfo.color} ${statusInfo.text} text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest italic shadow-lg shadow-emerald-900/10`}>{statusInfo.label}</span>
               <span className="bg-white text-slate-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest italic border border-slate-100 shadow-sm">ID: #{match.id}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase text-slate-900 leading-[0.9] mb-4">{match.teamName}</h1>
            <p className="text-slate-400 font-bold italic uppercase tracking-widest text-sm flex items-center gap-2">
               {isOpponentMatch ? <Swords size={16} className="text-emerald-500" /> : <UserCheck size={16} className="text-emerald-500" />}
               {isOpponentMatch ? 'Kèo thách đấu giao hữu' : 'Kèo tìm đồng đội gia nhập'}
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative">
              <img src={match.teamLogo} alt={match.teamName} className="w-32 h-32 md:w-40 md:h-40 object-contain relative z-10" />
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none -translate-y-1/2 translate-x-1/4">
                 <h2 className="text-[10rem] font-black italic tracking-tighter uppercase leading-none select-none">{isOpponentMatch ? 'TEAM' : 'JOIN'}</h2>
              </div>
          </motion.div>
        </div>

        {/* CONTENT SECTION (DYNAMIC) */}
        {isOpponentMatch ? renderOpponentView() : renderTeammateView()}
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {isApplied && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsApplied(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white rounded-[3rem] p-12 max-w-sm w-full relative z-10 shadow-2xl flex flex-col items-center text-center border border-slate-100">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-8"><CheckCircle2 size={64} strokeWidth={3} /></div>
              <h3 className="text-3xl font-black text-slate-900 mb-3 italic uppercase tracking-tighter leading-none text-left">Gửi yêu cầu thành công!</h3>
              <p className="text-sm text-slate-400 font-bold leading-relaxed mb-10 px-4 text-left">Lời mời {isOpponentMatch ? 'thách đấu' : 'gia nhập'} của bạn đã được gửi tới Captain **{match.teamName}**. Vui lòng đợi phản hồi qua thông báo.</p>
              <button onClick={() => navigate(isOpponentMatch ? '/matches' : '/teammates')} className="w-full py-4 rounded-xl bg-[#059669] text-white font-black italic uppercase tracking-widest hover:bg-[#047857] transition-all border-none cursor-pointer shadow-lg shadow-emerald-900/20">{isOpponentMatch ? 'Tìm đối thủ khác' : 'Tìm đồng đội khác'}</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
