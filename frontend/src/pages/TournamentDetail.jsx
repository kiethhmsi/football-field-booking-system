import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Calendar, MapPin, Users, ArrowRight, X, CheckCircle, Info, Zap, ChevronRight, ShieldCheck, User, Plus, CreditCard, FileDown, FileUp, Table, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TournamentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bracket'); // 'info', 'bracket', 'teams'
  const [isRegistering, setIsRegistering] = useState(false);
  const [myTeams, setMyTeams] = useState([]);
  const [showRegModal, setShowRegModal] = useState(false);
  const [showCreateTeamForm, setShowCreateTeamForm] = useState(false);
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [currentRegId, setCurrentRegId] = useState(null);
  const [newTeamData, setNewTeamData] = useState({ name: '', slogan: '', logo_url: '', skill_level: 'amateur' });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDetail();
    if (user) fetchMyTeams();
  }, [id, user]);

  const fetchDetail = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/tournaments/${id}`);
      const data = await res.json();
      if (data.success) {
        setTournament(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyTeams = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/teams/my-teams', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.data) setMyTeams(data.data);
    } catch (err) {
      console.error('Lỗi lấy đội của tôi:', err);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      const res = await fetch('http://localhost:3000/api/teams', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newTeamData)
      });
      const data = await res.json();
      if (data.teamId) {
        setShowCreateTeamForm(false);
        fetchMyTeams(); // Refresh list
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Lỗi tạo đội');
    } finally {
      setIsRegistering(false);
    }
  };

  const [regFormData, setRegFormData] = useState({
    team_name: '',
    team_logo_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${Date.now()}`,
    captain_name: user?.name || '',
    phone: '',
  });

  const [importedPlayers, setImportedPlayers] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const res = await fetch('http://localhost:3000/api/tournaments/import-players', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setImportedPlayers(data.data);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Lỗi upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadSample = () => {
    window.open('http://localhost:3000/api/tournaments/download-sample', '_blank');
  };

  const handleStartRegistration = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      const res = await fetch('http://localhost:3000/api/payos/create-payment-link', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          tournamentId: id,
          registrationData: {
            ...regFormData,
            players: importedPlayers
          }
        })
      });
      
      const data = await res.json();
      if (data.success || data.data?.checkoutUrl) {
        // Redirect to PayOS
        window.location.href = data.data.checkoutUrl;
      } else {
        alert(data.message || 'Lỗi tạo link thanh toán');
      }
    } catch (err) {
      alert('Lỗi kết nối server');
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
    </div>
  );

  if (error || !tournament) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-black italic uppercase">Lỗi dữ liệu</h2>
      <p className="text-slate-400 mt-2">{error}</p>
      <Link to="/tournaments" className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest no-underline">Quay lại</Link>
    </div>
  );

  // Helper to render Bracket
  const renderMatch = (match) => {
    const isWinnerA = match.winner_id && match.winner_id === match.team_a_id;
    const isWinnerB = match.winner_id && match.winner_id === match.team_b_id;

    return (
      <div key={match.id} className="relative w-64">
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
          <div className={`flex justify-between items-center p-3 border-b border-gray-50 ${isWinnerA ? 'bg-emerald-50' : ''}`}>
            <div className="flex items-center gap-2 truncate">
              <div className="w-5 h-5 bg-gray-100 rounded-md overflow-hidden">
                {match.team_a_logo && <img src={match.team_a_logo} className="w-full h-full object-cover" />}
              </div>
              <span className={`text-[10px] font-black uppercase italic truncate ${isWinnerA ? 'text-emerald-700' : 'text-gray-900'}`}>
                {match.team_a_name || 'TBD'}
              </span>
            </div>
            <span className="text-xs font-black text-emerald-600">{match.score_a}</span>
          </div>
          <div className={`flex justify-between items-center p-3 ${isWinnerB ? 'bg-emerald-50' : ''}`}>
            <div className="flex items-center gap-2 truncate">
              <div className="w-5 h-5 bg-gray-100 rounded-md overflow-hidden">
                {match.team_b_logo && <img src={match.team_b_logo} className="w-full h-full object-cover" />}
              </div>
              <span className={`text-[10px] font-black uppercase italic truncate ${isWinnerB ? 'text-emerald-700' : 'text-gray-900'}`}>
                {match.team_b_name || 'TBD'}
              </span>
            </div>
            <span className="text-xs font-black text-emerald-600">{match.score_b}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-left">
      {/* Banner Section */}
      <section className="relative h-[450px] overflow-hidden">
        <img src={tournament.banner_url} className="w-full h-full object-cover" alt="Banner" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
        <div className="absolute bottom-16 left-0 right-0 px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="flex-1">
              <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">{tournament.title}</h1>
              <div className="flex flex-wrap gap-6 text-white/80 font-bold text-sm">
                <span className="flex items-center gap-2"><MapPin size={18} className="text-emerald-500" /> {tournament.location}</span>
                <span className="flex items-center gap-2"><Calendar size={18} className="text-emerald-500" /> {new Date(tournament.start_date).toLocaleDateString('vi-VN')}</span>
                <span className="flex items-center gap-2"><Users size={18} className="text-emerald-500" /> {tournament.max_teams} Đội</span>
              </div>
            </div>
            <button 
              onClick={() => user ? setShowRegModal(true) : alert('Vui lòng đăng nhập')}
              className="px-12 py-5 bg-emerald-600 hover:bg-white hover:text-emerald-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl border-none cursor-pointer active:scale-95 italic"
            >
              <Zap size={20} className="inline mr-2" /> Đăng ký tham gia
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 mb-10 bg-white p-2 rounded-[2rem] shadow-sm">
            {[
              { id: 'bracket', label: 'Sơ đồ thi đấu', icon: Trophy },
              { id: 'info', label: 'Luật thi đấu', icon: Info },
              { id: 'teams', label: 'Đội tham gia', icon: Users }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-none cursor-pointer ${activeTab === tab.id ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {activeTab === 'info' && (
              <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-gray-50">
                <h3 className="text-2xl font-black italic uppercase mb-8">Quy định giải đấu</h3>
                <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-line">{tournament.rules}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  <div className="p-8 bg-slate-50 rounded-3xl"><p className="text-emerald-700 font-black text-xs uppercase mb-2">Lệ phí</p><p className="text-2xl font-black">{tournament.entry_fee}</p></div>
                  <div className="p-8 bg-emerald-50 rounded-3xl"><p className="text-emerald-700 font-black text-xs uppercase mb-2">Giải thưởng</p><p className="text-2xl font-black text-emerald-600">{tournament.prize_pool}</p></div>
                </div>
              </div>
            )}

            {activeTab === 'bracket' && (
              <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-gray-50 overflow-x-auto">
                <div className="min-w-[1000px] flex justify-between gap-10">
                   {/* Quarter-finals */}
                   <div className="flex flex-col justify-around gap-12">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-4 italic">Tứ kết</p>
                      {tournament.matches?.filter(m => m.round === 'Quarter-final').length > 0 ? (
                        tournament.matches.filter(m => m.round === 'Quarter-final').map(renderMatch)
                      ) : (
                        [1,2,3,4].map(i => (
                          <div key={i} className="relative w-64">
                            <div className="opacity-20 grayscale scale-95 origin-left bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
                              <div className="p-3 border-b border-gray-100 flex justify-between"><span className="text-[9px] font-black uppercase">Chờ cập nhật...</span><span className="text-[9px] font-black italic">--</span></div>
                              <div className="p-3 flex justify-between"><span className="text-[9px] font-black uppercase">Chờ cập nhật...</span><span className="text-[9px] font-black italic">--</span></div>
                            </div>
                            <div className="absolute right-[-40px] top-1/2 w-10 h-px bg-slate-100" />
                          </div>
                        ))
                      )}
                   </div>

                   {/* Semi-finals */}
                   <div className="flex flex-col justify-around gap-20">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-4 italic">Bán kết</p>
                      {tournament.matches?.filter(m => m.round === 'Semi-final').length > 0 ? (
                        tournament.matches.filter(m => m.round === 'Semi-final').map(renderMatch)
                      ) : (
                        [1,2].map(i => (
                          <div key={i} className="relative w-64">
                            <div className="opacity-10 grayscale scale-90 origin-left bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
                              <div className="p-3 border-b border-gray-100 flex justify-between"><span className="text-[9px] font-black">--</span></div>
                              <div className="p-3 flex justify-between"><span className="text-[9px] font-black">--</span></div>
                            </div>
                            <div className="absolute right-[-40px] top-1/2 w-10 h-px bg-slate-100" />
                          </div>
                        ))
                      )}
                   </div>

                   {/* Final */}
                   <div className="flex flex-col justify-center">
                      <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest text-center mb-4 italic">Chung kết</p>
                      {tournament.matches?.filter(m => m.round === 'Final').length > 0 ? (
                        tournament.matches.filter(m => m.round === 'Final').map(renderMatch)
                      ) : (
                        <div className="w-64 opacity-40">
                           <div className="bg-[#001a0f] border-2 border-amber-500/20 rounded-[2rem] overflow-hidden p-8 text-center space-y-4">
                              <Trophy size={32} className="text-amber-500/20 mx-auto" />
                              <p className="text-[10px] font-black text-amber-500/30 uppercase tracking-[0.3em]">Cúp vô địch</p>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'teams' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tournament.teams?.filter(t => t.status?.toLowerCase() === 'confirmed').map(team => (
                  <div key={team.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden">
                      <img src={team.logo_url || "https://api.dicebear.com/7.x/identicon/svg?seed=" + team.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black italic uppercase tracking-tighter">{team.name}</h4>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Confirmed</p>
                    </div>
                  </div>
                ))}
                {tournament.teams?.length === 0 && <p className="col-span-full text-center text-gray-400 font-bold uppercase py-20 italic">Chưa có đội nào tham gia</p>}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      <AnimatePresence>
        {showRegModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRegModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden text-left">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-1">Đăng ký giải đấu</h3>
                    <p className="text-slate-500 text-[11px] font-medium">Hoàn tất thanh toán lệ phí để chính thức tham gia.</p>
                  </div>
                  <button onClick={() => setShowRegModal(false)} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center border-none cursor-pointer hover:bg-slate-100 transition-all"><X size={20} /></button>
                </div>

                <form onSubmit={handleStartRegistration} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Tên đội bóng</label>
                      <input 
                        required 
                        className="w-full p-3.5 bg-slate-50 border-none rounded-xl font-bold focus:ring-2 ring-emerald-500/20 transition-all text-sm" 
                        placeholder="VD: FC KASPORT" 
                        value={regFormData.team_name} 
                        onChange={e => setRegFormData({...regFormData, team_name: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Số điện thoại</label>
                      <input 
                        required 
                        className="w-full p-3.5 bg-slate-50 border-none rounded-xl font-bold focus:ring-2 ring-emerald-500/20 transition-all text-sm" 
                        placeholder="VD: 090xxxxxxx" 
                        value={regFormData.phone} 
                        onChange={e => setRegFormData({...regFormData, phone: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Đội trưởng (Captain)</label>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-black">{user?.name?.charAt(0)}</div>
                      <span className="font-black text-sm">{user?.name}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Danh sách cầu thủ (Import Excel)</label>
                      <button 
                        type="button"
                        onClick={downloadSample}
                        className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 hover:underline bg-transparent border-none cursor-pointer"
                      >
                        <FileDown size={12} /> Tải file mẫu
                      </button>
                    </div>

                    {!importedPlayers.length ? (
                      <div className="relative group">
                        <input 
                          type="file" 
                          accept=".xlsx, .xls, .csv" 
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center gap-3 group-hover:border-emerald-500 group-hover:bg-emerald-50/30 transition-all">
                          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:scale-110 transition-all">
                            {isUploading ? (
                              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <FileUp size={32} />
                            )}
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-black text-slate-900 uppercase italic">Kéo thả hoặc nhấn để upload</p>
                            <p className="text-[10px] text-slate-400 font-bold mt-1">Chấp nhận .xlsx, .xls, .csv</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-emerald-600">
                            <CheckCircle2 size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Đã nhập {importedPlayers.length} cầu thủ</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setImportedPlayers([])}
                            className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline bg-transparent border-none cursor-pointer"
                          >
                            Xóa và nhập lại
                          </button>
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                          <table className="w-full text-left">
                            <thead className="sticky top-0 bg-white">
                              <tr className="border-b border-slate-50">
                                <th className="p-4 text-[9px] font-black uppercase text-slate-400">#</th>
                                <th className="p-4 text-[9px] font-black uppercase text-slate-400">Họ tên</th>
                                <th className="p-4 text-[9px] font-black uppercase text-slate-400 text-center">Số áo</th>
                                <th className="p-4 text-[9px] font-black uppercase text-slate-400">Vị trí</th>
                              </tr>
                            </thead>
                            <tbody>
                              {importedPlayers.map((p, i) => (
                                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-all">
                                  <td className="p-4 text-[10px] font-bold text-slate-400">{i + 1}</td>
                                  <td className="p-4 text-[10px] font-black text-slate-900 uppercase italic">{p.name}</td>
                                  <td className="p-4 text-center"><span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md font-black text-[10px]">{p.number}</span></td>
                                  <td className="p-4 text-[10px] font-bold text-slate-500">{p.position}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Lệ phí đăng ký</p>
                      <p className="text-2xl font-black text-emerald-600">{tournament?.entry_fee}</p>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isRegistering} 
                      className="bg-slate-900 hover:bg-black text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 border-none cursor-pointer disabled:opacity-50 transition-all"
                    >
                      {isRegistering ? (
                        <>Đang xử lý...</>
                      ) : (
                        <><CreditCard size={18} /> Thanh toán</>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                  <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center shrink-0"><Info size={16} /></div>
                  <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase">Hệ thống sẽ tự động tạo đội và ghi danh vào giải đấu sau khi bạn hoàn tất thanh toán trực tuyến.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
