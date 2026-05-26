import { MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function MatchCard({ match, type = 'opponent' }) {
  const getSkillBadgeColor = (level) => {
    switch (level) {
      case 'Giỏi': return 'bg-blue-100 text-blue-600';
      case 'Khá': return 'bg-emerald-100 text-emerald-600';
      case 'Trung bình': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const applyPath = type === 'teammate' ? `/apply/teammate/${match.id}` : `/apply/opponent/${match.id}`;
  const isVip = match.creator_is_vip === 1 || match.creator_is_vip === true;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-6 rounded-[2rem] flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 text-left border ${
        isVip 
          ? 'border-amber-400/80 shadow-[0_10px_40px_-15px_rgba(245,184,0,0.18)] hover:shadow-[0_20px_50px_-10px_rgba(245,184,0,0.28)] bg-gradient-to-tr from-amber-50/10 via-white to-white' 
          : 'border-gray-100/50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.15)] bg-white'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border ${isVip ? 'border-amber-300 bg-amber-50' : 'border-gray-100 bg-slate-100'}`}>
            <img src={match.teamLogo} alt={match.teamName} className="w-8 h-8 opacity-80" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
              {match.teamName}
              {isVip && <span className="bg-[#faea18] text-[#002616] px-1 py-0.5 rounded text-[8px] font-black tracking-widest uppercase">VIP</span>}
            </h3>
            <div className="flex items-center gap-1.5 text-gray-400 text-[10px] mt-1">
              <MapPin size={10} />
              <span>{match.location || 'KaSport Complex'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1.5">
          {isVip && (
            <span className="text-[8px] uppercase font-black px-2 py-0.5 rounded bg-[#faea18] text-[#002616] tracking-wider shadow-sm select-none animate-pulse shrink-0">
              ⚡ Ưu tiên hiển thị
            </span>
          )}
          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${getSkillBadgeColor(match.skillLevel)}`}>
            {match.skillLevel}
          </span>
          <span className="text-[10px] uppercase font-black px-2 py-1 rounded bg-slate-800 text-white shadow-sm shadow-black/10">
            {match.pitch_name || match.field_type || 'Sân 5'}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 py-1 border-t border-b border-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <Clock size={14} className="text-emerald-500" />
            <span className="text-xs font-medium">{match.time}</span>
          </div>
          {match.contact_phone && (
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-lg text-[10px]">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
               {match.contact_phone}
            </div>
          )}
        </div>

        {type === 'teammate' && (
          <div className="mt-1">
            <div className="flex justify-between items-center mb-1.5">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tiến độ tuyển quân</span>
               <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full italic">
                 {match.current_players + (match.accepted_count || 0)}/{match.max_players}
               </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${Math.min(100, ((match.current_players + (match.accepted_count || 0)) / match.max_players) * 100)}%` }}
                 className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
               />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Link to={type === 'teammate' ? `/teammates/${match.id}` : `/matches/${match.id}`} className="flex-1 py-3 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs hover:bg-emerald-100 transition-colors border border-emerald-100 cursor-pointer text-center text-decoration-none shadow-sm hover:shadow-md">
          Chi tiết
        </Link>
        {match.status === 'open' ? (
          <Link to={applyPath} className="flex-1 text-decoration-none">
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-[0_5px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.4)] transition-all border-none cursor-pointer"
            >
              Ứng tuyển
            </motion.button>
          </Link>
        ) : (
          <button className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-400 font-bold text-xs cursor-not-allowed bg-gray-50">
            Đã có đối
          </button>
        )}
      </div>
    </motion.div>
  );
}

