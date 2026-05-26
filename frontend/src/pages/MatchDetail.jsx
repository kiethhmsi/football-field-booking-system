import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MatchDetailView from '../components/MatchDetailView';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const MatchDetail = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Đang lấy chi tiết kèo ID:', matchId);
      const response = await fetch(`http://localhost:3000/api/matches/${matchId}`);
      const result = await response.json();
      
      if (response.ok && result.data) {
        const m = result.data;
        // Normalize data for MatchDetailView
        setMatch({
          ...m,
          teamName: m.team_name || m.host_team_name || 'Đội bóng ẩn danh',
          teamLogo: m.team_logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${m.id || matchId}`,
          skillLevel: m.skill_level_required === 'fun' ? 'Giao lưu' : (m.skill_level_required === 'amateur' ? 'Trung bình' : (m.skill_level_required === 'semi_pro' ? 'Khá' : 'Giỏi')),
          time: m.start_time?.substring(0, 5) || '--:--',
          matchDate: m.match_date ? new Date(m.match_date).toLocaleDateString('vi-VN') : 'Đang cập nhật',
          fieldSize: m.field_type ? (m.field_type.includes('Sân') ? m.field_type : `Sân ${m.field_type}`) : 'Sân 7',
          field_type: m.field_type,
          fieldPrice: m.field_price || 0,
          positionsNeeded: (() => {
            if (!m.positions_needed) return [];
            if (typeof m.positions_needed !== 'string') return m.positions_needed;
            try {
              return JSON.parse(m.positions_needed);
            } catch (e) {
              return [m.positions_needed]; // Trả về mảng chứa chuỗi nếu không phải JSON
            }
          })(),
          experience: m.notes || 'Không có ghi chú',
          fieldFee: m.expense_sharing || 'Thỏa thuận',
          drinkBet: m.side_bet || 'Giao lưu',
          // Mock players since we don't have a team members API yet
          players: [
            { name: 'Đội trưởng', avatar: m.team_logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${m.id || matchId}`, isCaptain: true }
          ]
        });
      } else {
        setError(result.message || 'Không tìm thấy kèo đấu này trên hệ thống.');
      }
    } catch (err) {
      console.error('Lỗi lấy chi tiết kèo:', err);
      setError(`Lỗi kết nối: ${err.message}. Vui lòng kiểm tra Backend (Port 3000) đang chạy.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchDetail();
  }, [matchId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="font-black italic uppercase text-emerald-800 tracking-widest animate-pulse">Đang tải chi tiết kèo...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 max-w-md w-full text-center">
         <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-6">
            <RefreshCw size={40} />
         </div>
         <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 mb-2">Rất tiếc!</h2>
         <p className="text-slate-400 font-medium mb-8 leading-relaxed">{error}</p>
         <div className="flex flex-col gap-3">
            <button 
              onClick={fetchMatchDetail}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black italic uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 border-none cursor-pointer"
            >
              Thử tải lại
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="w-full py-4 bg-white text-slate-400 rounded-2xl font-black italic uppercase tracking-widest hover:bg-slate-50 transition-all border border-slate-100 cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} /> Quay lại
            </button>
         </div>
      </div>
    </div>
  );

  return (
    <div>
      <MatchDetailView match={match} />
    </div>
  );
};

export default MatchDetail;
