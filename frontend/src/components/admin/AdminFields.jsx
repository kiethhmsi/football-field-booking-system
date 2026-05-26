import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Trash2, Plus, Clock, AlertTriangle, X, Download, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const fieldStats = [
  { label: 'Tổng số sân', value: '30' },
  { label: 'Đang hoạt động', value: '10', color: 'border-l-4 border-green-500 pl-4' },
  { label: 'Sân 7 người', value: '6' },
  { label: 'Bảo trì', value: '2' },
];

const fieldsData = [
  { 
    id: '1', 
    name: 'Sân 7 - 01', 
    type: 'SÂN 7 NGƯỜI', 
    price: '350.000đ', 
    description: 'Cỏ nhân tạo cao cấp - FIFA Pro', 
    status: 'Sẵn sàng', 
    image: 'https://picsum.photos/seed/catfield/400/300', 
    isActive: true 
  },
  { 
    id: '2', 
    name: 'Sân 5 - 02', 
    type: 'SÂN 5 NGƯỜI', 
    price: '250.000đ', 
    description: 'Sân trong nhà - Mái che hiện đại', 
    status: 'Sẵn sàng', 
    image: 'https://picsum.photos/seed/manfield/400/300', 
    isActive: true 
  },
  { 
    id: '3', 
    name: 'Sân 11 - 01', 
    type: 'SÂN 11 NGƯỜI', 
    price: '1.200.000đ', 
    description: 'Sân cỏ tự nhiên tiêu chuẩn quốc tế', 
    status: 'Đang bảo trì', 
    image: 'https://picsum.photos/seed/elitefield/400/300', 
    isActive: false 
  },
  { 
    id: '4', 
    name: 'Sân 7 - 02', 
    type: 'SÂN 7 NGƯỜI', 
    price: '380.000đ', 
    description: 'Khu vực khán đài VIP', 
    status: 'Sẵn sàng', 
    image: 'https://picsum.photos/seed/womanfield/400/300', 
    isActive: true 
  },
];

const DeleteFieldModal = ({ field, isOpen, onClose, onConfirm }) => {
  if (!field) return null;
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`http://localhost:3000/api/fields/admin/pitches/${field.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        onConfirm();
        onClose();
      } else {
        alert('Có lỗi xảy ra khi xóa sân');
      }
    } catch (error) {
      console.error('Lỗi xóa sân:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden p-8 flex flex-col items-center text-center"
      >
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-8 mt-2 transition-transform hover:scale-105 duration-300">
          <AlertTriangle size={40} className="stroke-[1.5]" />
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase italic leading-none">Xóa sân bóng?</h2>
        
        <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8 px-4">
          Bạn có chắc chắn muốn xóa sân này? Hành động này sẽ gỡ bỏ <span className="font-black text-gray-900">{field.name}</span> khỏi hệ thống vĩnh viễn.
        </p>

        {/* Field Preview Card */}
        <div className="w-full bg-slate-50 rounded-3xl p-3 flex items-center gap-4 mb-10 text-left border border-slate-100">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-white">
            <img src={field.image} alt={field.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <p className="text-sm font-black text-gray-800 leading-none mb-1.5 uppercase italic">{field.name}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{field.type} • {field.price}</p>
          </div>
        </div>

        <div className="w-full space-y-3">
          <button 
            onClick={handleDelete}
            disabled={deleting}
            className={`w-full bg-red-600 text-white py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-lg shadow-red-900/20 hover:bg-red-700 transition-all border-none cursor-pointer ${deleting ? 'opacity-50' : ''}`}
          >
            {deleting ? 'ĐANG XÓA...' : 'XÁC NHẬN XÓA'}
          </button>
          <button 
            onClick={onClose}
            className="w-full bg-slate-100 text-slate-400 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 hover:text-slate-600 transition-all border-none cursor-pointer"
          >
            Hủy
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const NewFieldModal = ({ isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '5_nguoi',
    status: 'active',
    field_id: ''
  });
  const [fields, setFields] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
        fetch('http://localhost:3000/api/fields')
            .then(res => res.json())
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setFields(res.data);
                    setFormData(prev => ({ ...prev, field_id: res.data[0].id }));
                }
            });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.field_id) {
        alert('Vui lòng chọn cụm sân quản lý');
        return;
    }
    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:3000/api/fields/admin/pitches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        onConfirm();
        onClose();
        setFormData({ name: '', type: '5_nguoi', status: 'active', field_id: fields[0]?.id || '' });
      } else {
        alert('Có lỗi xảy ra khi thêm sân');
      }
    } catch (error) {
      console.error('Lỗi thêm sân:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9, y: 20 }} 
            className="bg-white rounded-[2.5rem] shadow-2xl flex max-w-4xl w-full h-[600px] overflow-hidden relative z-10 text-left"
          >
            {/* Sidebar (Green) */}
            <div className="w-[300px] bg-[#059669] p-12 text-white relative flex flex-col justify-between overflow-hidden text-left">
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
              <div className="space-y-6 relative z-10">
                <h3 className="text-4xl font-black leading-tight tracking-tighter uppercase italic">Khởi tạo<br/>Không gian<br/>mới</h3>
                <p className="text-emerald-100/70 text-sm leading-relaxed font-medium">Thêm sân vào hệ thống để bắt đầu nhận lịch đặt sân ngay hôm nay.</p>
              </div>
              <div className="relative z-10 opacity-10">
                <Plus size={128} strokeWidth={1} />
              </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 p-14 relative overflow-y-auto no-scrollbar text-left">
              <button 
                onClick={onClose} 
                className="absolute top-8 right-8 p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all border-none bg-transparent cursor-pointer"
              >
                <X size={24} />
              </button>

              <form onSubmit={handleSubmit} className="space-y-10 text-left">
                <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase italic">THÊM SÂN MỚI</h2>
                
                <div className="space-y-8">
                  {/* Cụm sân quản lý */}
                  <div className="space-y-3 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Thuộc Cụm sân (Field Complex)</label>
                    <div className="relative">
                        <select 
                        required
                        value={formData.field_id}
                        onChange={(e) => setFormData({ ...formData, field_id: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-700 appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500/20 outline-none"
                        >
                        {fields.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Field Name */}
                  <div className="space-y-3 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Tên sân bóng (VD: Sân 01, Sân A...)</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="VD: Sân Wembley - 01" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all" 
                    />
                  </div>

                  {/* Type and Status */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Loại sân</label>
                      <div className="relative">
                        <select 
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-700 focus:outline-none appearance-none cursor-pointer"
                        >
                          <option value="5_nguoi">Sân 5 người</option>
                          <option value="7_nguoi">Sân 7 người</option>
                          <option value="11_nguoi">Sân 11 người</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-3 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Trạng thái</label>
                      <div className="relative">
                        <select 
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-700 focus:outline-none appearance-none cursor-pointer"
                        >
                          <option value="active">Hoạt động</option>
                          <option value="maintenance">Bảo trì</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="flex items-center justify-end gap-6 pt-10">
                  <button type="button" onClick={onClose} className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors bg-transparent border-none cursor-pointer">Hủy bỏ</button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="bg-[#059669] hover:bg-[#047857] text-white font-black px-10 py-5 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-900/10 transition-all active:scale-[0.98] border-none cursor-pointer"
                  > 
                    {submitting ? 'ĐANG LƯU...' : 'Xác nhận Thêm sân'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const StatCard = ({ stat }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-card p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col text-left ${stat.color || ''}`}
  >
    <p className="text-gray-500 font-medium mb-2 text-sm">{stat.label}</p>
    <h3 className="text-3xl font-bold mb-3">{stat.value}</h3>
    {stat.trend ? (
      <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
        <span className="text-base text-green-500">↗</span>
        {stat.trend}
      </div>
    ) : stat.subValue ? (
      <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
        <Clock size={12} />
        {stat.subValue}
      </div>
    ) : null}
  </motion.div>
);

const getPitchStyle = (id, name, pitchType = '5') => {
  const numMatch = name?.match(/\d+/);
  const index = numMatch ? parseInt(numMatch[0], 10) : (parseInt(id, 10) || 1);
  const grassPattern = index % 4;
  
  let playerCount = 5;
  if (pitchType.includes('7')) {
    playerCount = 7;
  } else if (pitchType.includes('11')) {
    playerCount = 11;
  }
  
  const jerseyThemes = [
    { a: '#ea580c', b: '#2563eb' }, // Orange vs Blue
    { a: '#db2777', b: '#9333ea' }, // Pink vs Purple
    { a: '#eab308', b: '#1e293b' }, // Yellow vs Dark Blue
    { a: '#ffffff', b: '#dc2626' }, // White vs Red
  ];
  const jerseys = jerseyThemes[index % jerseyThemes.length];

  const teamA = [];
  const teamB = [];

  // Goalkeepers
  teamA.push({ x: 38, y: 120 });
  teamB.push({ x: 362, y: 120 });

  if (playerCount === 5) {
    const variations = [
      {
        a: [{x: 95, y: 75}, {x: 95, y: 165}, {x: 145, y: 120}, {x: 180, y: 120}],
        b: [{x: 305, y: 75}, {x: 305, y: 165}, {x: 255, y: 120}, {x: 220, y: 120}]
      },
      {
        a: [{x: 95, y: 120}, {x: 140, y: 75}, {x: 140, y: 165}, {x: 185, y: 120}],
        b: [{x: 305, y: 120}, {x: 260, y: 75}, {x: 260, y: 165}, {x: 215, y: 120}]
      },
      {
        a: [{x: 95, y: 80}, {x: 95, y: 160}, {x: 160, y: 80}, {x: 160, y: 160}],
        b: [{x: 305, y: 80}, {x: 305, y: 160}, {x: 240, y: 80}, {x: 240, y: 160}]
      }
    ];
    const chosen = variations[index % variations.length];
    teamA.push(...chosen.a);
    teamB.push(...chosen.b);
  } else if (playerCount === 7) {
    const variations = [
      {
        a: [{x: 80, y: 60}, {x: 80, y: 120}, {x: 80, y: 180}, {x: 140, y: 80}, {x: 140, y: 160}, {x: 180, y: 120}],
        b: [{x: 320, y: 60}, {x: 320, y: 120}, {x: 320, y: 180}, {x: 260, y: 80}, {x: 260, y: 160}, {x: 220, y: 120}]
      },
      {
        a: [{x: 85, y: 80}, {x: 85, y: 160}, {x: 135, y: 60}, {x: 135, y: 120}, {x: 135, y: 180}, {x: 180, y: 120}],
        b: [{x: 315, y: 80}, {x: 315, y: 160}, {x: 265, y: 60}, {x: 265, y: 120}, {x: 265, y: 180}, {x: 220, y: 120}]
      },
      {
        a: [{x: 80, y: 60}, {x: 80, y: 120}, {x: 80, y: 180}, {x: 135, y: 120}, {x: 175, y: 80}, {x: 175, y: 160}],
        b: [{x: 320, y: 60}, {x: 320, y: 120}, {x: 320, y: 180}, {x: 265, y: 120}, {x: 225, y: 80}, {x: 225, y: 160}]
      }
    ];
    const chosen = variations[index % variations.length];
    teamA.push(...chosen.a);
    teamB.push(...chosen.b);
  } else {
    const variations = [
      {
        a: [{x: 75, y: 50}, {x: 75, y: 95}, {x: 75, y: 145}, {x: 75, y: 190}, {x: 130, y: 50}, {x: 130, y: 95}, {x: 130, y: 145}, {x: 130, y: 190}, {x: 175, y: 90}, {x: 175, y: 150}],
        b: [{x: 325, y: 50}, {x: 325, y: 95}, {x: 325, y: 145}, {x: 325, y: 190}, {x: 270, y: 50}, {x: 270, y: 95}, {x: 270, y: 145}, {x: 270, y: 190}, {x: 225, y: 90}, {x: 225, y: 150}]
      },
      {
        a: [{x: 75, y: 50}, {x: 75, y: 95}, {x: 75, y: 145}, {x: 75, y: 190}, {x: 130, y: 70}, {x: 130, y: 120}, {x: 130, y: 170}, {x: 180, y: 60}, {x: 185, y: 120}, {x: 180, y: 180}],
        b: [{x: 325, y: 50}, {x: 325, y: 95}, {x: 325, y: 145}, {x: 325, y: 190}, {x: 270, y: 70}, {x: 270, y: 120}, {x: 270, y: 170}, {x: 220, y: 60}, {x: 215, y: 120}, {x: 220, y: 180}]
      },
      {
        a: [{x: 75, y: 70}, {x: 75, y: 120}, {x: 75, y: 170}, {x: 125, y: 45}, {x: 125, y: 80}, {x: 125, y: 120}, {x: 125, y: 160}, {x: 125, y: 195}, {x: 175, y: 90}, {x: 175, y: 150}],
        b: [{x: 325, y: 70}, {x: 325, y: 120}, {x: 325, y: 170}, {x: 275, y: 45}, {x: 275, y: 80}, {x: 275, y: 120}, {x: 275, y: 160}, {x: 275, y: 195}, {x: 225, y: 90}, {x: 225, y: 150}]
      }
    ];
    const chosen = variations[index % variations.length];
    teamA.push(...chosen.a);
    teamB.push(...chosen.b);
  }

  const ballPos = { x: 200, y: 120 };

  return { grassPattern, ballPos, teamA, teamB, jerseys, index };
};

const JerseyIcon = ({ color }) => (
  <g>
    <path 
      d="M -6,-4 L -4,-4 L -3,-2 L 3,-2 L 4,-4 L 6,-4 L 5,1 L 3,1 L 3,6 L -3,6 L -3,1 L -5,1 Z" 
      fill={color} 
      stroke="#ffffff" 
      strokeWidth="0.8" 
    />
    <path d="M -1.5,-2 A 1.5,1.5 0 0,0 1.5,-2" stroke="#ffffff" strokeWidth="0.8" fill="none" />
  </g>
);

const Pitch5VectorSVG = ({ field }) => {
  const { grassPattern, ballPos, teamA, teamB, jerseys, index } = getPitchStyle(field.id, field.name, '5');
  const displayNum = index < 10 ? `0${index}` : index;
  
  return (
    <svg viewBox="0 0 400 240" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`pitch5Grad-${field.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="50%" stopColor="#047857" />
          <stop offset="100%" stopColor="#065f46" />
        </linearGradient>
        <filter id={`glow-${field.id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id={`lineGrad-${field.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
        </linearGradient>
      </defs>
      
      <rect width="400" height="240" fill={`url(#pitch5Grad-${field.id})`} />
      
      <g opacity="0.15">
        <circle cx="200" cy="120" r="180" fill="none" stroke="#ffffff" strokeWidth="30" />
        <circle cx="200" cy="120" r="100" fill="none" stroke="#ffffff" strokeWidth="25" />
      </g>
      
      <text x="310" y="80" fill="rgba(255,255,255,0.06)" fontSize="72" fontWeight="900" fontStyle="italic" fontFamily="sans-serif">
        {displayNum}
      </text>
      
      <rect x="20" y="15" width="360" height="210" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" rx="4" />
      <line x1="200" y1="15" x2="200" y2="225" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <circle cx="200" cy="120" r="35" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <circle cx="200" cy="120" r="3" fill="#ffffff" />
      
      <path d="M 20 70 L 60 70 A 50 50 0 0 1 60 170 L 20 170" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <circle cx="50" cy="120" r="2.5" fill="#ffffff" />
      <rect x="10" y="95" width="10" height="50" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      
      <path d="M 380 70 L 340 70 A 50 50 0 0 0 340 170 L 380 170" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <circle cx="350" cy="120" r="2.5" fill="#ffffff" />
      <rect x="380" y="95" width="10" height="50" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      
      <path d="M 30 15 A 10 10 0 0 1 20 25" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <path d="M 20 215 A 10 10 0 0 1 30 225" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <path d="M 370 225 A 10 10 0 0 1 380 215" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <path d="M 380 25 A 10 10 0 0 1 370 15" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      
      {teamA.map((p, idx) => (
        <g key={`ta-${idx}`} transform={`translate(${p.x}, ${p.y})`}>
          <JerseyIcon color={jerseys.a} />
        </g>
      ))}
      
      {teamB.map((p, idx) => (
        <g key={`tb-${idx}`} transform={`translate(${p.x}, ${p.y})`}>
          <JerseyIcon color={jerseys.b} />
        </g>
      ))}
      
      <circle cx={ballPos.x} cy={ballPos.y} r="6" fill="#ffffff" filter={`url(#glow-${field.id})`} />
      <circle cx={ballPos.x} cy={ballPos.y} r="4" fill="#0f172a" />
      <circle cx={ballPos.x} cy={ballPos.y} r="2" fill="#ffffff" />
    </svg>
  );
};

const Pitch7VectorSVG = ({ field }) => {
  const { grassPattern, ballPos, teamA, teamB, jerseys, index } = getPitchStyle(field.id, field.name, '7');
  const displayNum = index < 10 ? `0${index}` : index;
  
  return (
    <svg viewBox="0 0 400 240" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`pitch7Grad-${field.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#047857" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <filter id={`glow-${field.id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id={`lineGrad-${field.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
        </linearGradient>
      </defs>
      
      <rect width="400" height="240" fill={`url(#pitch7Grad-${field.id})`} />
      
      {grassPattern === 0 && (
        <g opacity="0.15">
          <rect x="0" width="40" height="240" fill="#ffffff" />
          <rect x="80" width="40" height="240" fill="#ffffff" />
          <rect x="160" width="40" height="240" fill="#ffffff" />
          <rect x="240" width="40" height="240" fill="#ffffff" />
          <rect x="320" width="40" height="240" fill="#ffffff" />
        </g>
      )}
      {grassPattern === 1 && (
        <g opacity="0.12">
          <rect x="0" y="0" width="80" height="80" fill="#ffffff" />
          <rect x="160" y="0" width="80" height="80" fill="#ffffff" />
          <rect x="320" y="0" width="80" height="80" fill="#ffffff" />
          <rect x="80" y="80" width="80" height="80" fill="#ffffff" />
          <rect x="240" y="80" width="80" height="80" fill="#ffffff" />
          <rect x="0" y="160" width="80" height="80" fill="#ffffff" />
          <rect x="160" y="160" width="80" height="80" fill="#ffffff" />
          <rect x="320" y="160" width="80" height="80" fill="#ffffff" />
        </g>
      )}
      {grassPattern === 2 && (
        <g opacity="0.12">
          <rect x="0" y="0" width="400" height="30" fill="#ffffff" />
          <rect x="0" y="60" width="400" height="30" fill="#ffffff" />
          <rect x="0" y="120" width="400" height="30" fill="#ffffff" />
          <rect x="0" y="180" width="400" height="30" fill="#ffffff" />
        </g>
      )}
      {grassPattern === 3 && (
        <g opacity="0.12">
          <circle cx="200" cy="120" r="180" fill="none" stroke="#ffffff" strokeWidth="30" />
          <circle cx="200" cy="120" r="100" fill="none" stroke="#ffffff" strokeWidth="25" />
        </g>
      )}
      
      <text x="310" y="80" fill="rgba(255,255,255,0.06)" fontSize="72" fontWeight="900" fontStyle="italic" fontFamily="sans-serif">
        {displayNum}
      </text>
      
      <rect x="20" y="15" width="360" height="210" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" rx="4" />
      <line x1="200" y1="15" x2="200" y2="225" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <circle cx="200" cy="120" r="35" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <circle cx="200" cy="120" r="3" fill="#ffffff" />
      
      <rect x="20" y="55" width="55" height="130" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <rect x="20" y="80" width="22" height="80" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <circle cx="60" cy="120" r="2.5" fill="#ffffff" />
      <rect x="10" y="90" width="10" height="60" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      
      <rect x="325" y="55" width="55" height="130" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <rect x="358" y="80" width="22" height="80" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <circle cx="340" cy="120" r="2.5" fill="#ffffff" />
      <rect x="380" y="90" width="10" height="60" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      
      <path d="M 30 15 A 10 10 0 0 1 20 25" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <path d="M 20 215 A 10 10 0 0 1 30 225" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <path d="M 370 225 A 10 10 0 0 1 380 215" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <path d="M 380 25 A 10 10 0 0 1 370 15" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      
      {teamA.map((p, idx) => (
        <g key={`ta-${idx}`} transform={`translate(${p.x}, ${p.y})`}>
          <JerseyIcon color={jerseys.a} />
        </g>
      ))}
      
      {teamB.map((p, idx) => (
        <g key={`tb-${idx}`} transform={`translate(${p.x}, ${p.y})`}>
          <JerseyIcon color={jerseys.b} />
        </g>
      ))}
      
      {/* Ball */}
      <circle cx={ballPos.x} cy={ballPos.y} r="6" fill="#ffffff" filter={`url(#glow-${field.id})`} />
      <circle cx={ballPos.x} cy={ballPos.y} r="4" fill="#0f172a" />
      <circle cx={ballPos.x} cy={ballPos.y} r="2" fill="#ffffff" />
    </svg>
  );
};

const Pitch11VectorSVG = ({ field }) => {
  const { grassPattern, ballPos, teamA, teamB, jerseys, index } = getPitchStyle(field.id, field.name, '11');
  const displayNum = index < 10 ? `0${index}` : index;
  
  return (
    <svg viewBox="0 0 400 240" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`pitch11Grad-${field.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="40%" stopColor="#065f46" />
          <stop offset="100%" stopColor="#022c22" />
        </linearGradient>
        <filter id={`glow-${field.id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id={`lineGrad-${field.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
        </linearGradient>
      </defs>
      
      <rect width="400" height="240" fill={`url(#pitch11Grad-${field.id})`} />
      
      {/* Dynamic Grass / Diagonal layout */}
      {grassPattern === 0 && (
        <g opacity="0.08">
          <polygon points="0,0 80,0 0,80" fill="#ffffff" />
          <polygon points="120,0 240,0 0,240 0,160" fill="#ffffff" />
          <polygon points="280,0 400,0 400,80 160,240 80,240" fill="#ffffff" />
          <polygon points="400,160 400,240 320,240" fill="#ffffff" />
        </g>
      )}
      {grassPattern === 1 && (
        <g opacity="0.12">
          <rect x="0" y="0" width="80" height="80" fill="#ffffff" />
          <rect x="160" y="0" width="80" height="80" fill="#ffffff" />
          <rect x="320" y="0" width="80" height="80" fill="#ffffff" />
          <rect x="80" y="80" width="80" height="80" fill="#ffffff" />
          <rect x="240" y="80" width="80" height="80" fill="#ffffff" />
          <rect x="0" y="160" width="80" height="80" fill="#ffffff" />
          <rect x="160" y="160" width="80" height="80" fill="#ffffff" />
          <rect x="320" y="160" width="80" height="80" fill="#ffffff" />
        </g>
      )}
      {grassPattern === 2 && (
        <g opacity="0.15">
          <rect y="0" width="400" height="40" fill="#ffffff" />
          <rect y="80" width="400" height="40" fill="#ffffff" />
          <rect y="160" width="400" height="40" fill="#ffffff" />
        </g>
      )}
      {grassPattern === 3 && (
        <g opacity="0.12">
          <circle cx="200" cy="120" r="180" fill="none" stroke="#ffffff" strokeWidth="30" />
          <circle cx="200" cy="120" r="100" fill="none" stroke="#ffffff" strokeWidth="25" />
        </g>
      )}
      
      {/* Giant Translucent Number Badge */}
      <text x="310" y="80" fill="rgba(255,255,255,0.06)" fontSize="72" fontWeight="900" fontStyle="italic" fontFamily="sans-serif">
        {displayNum}
      </text>
      
      <rect x="8" y="7" width="384" height="226" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" rx="20" />
      <rect x="12" y="10" width="376" height="220" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" rx="16" />
      
      <rect x="25" y="20" width="350" height="200" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" rx="2" />
      <line x1="200" y1="20" x2="200" y2="220" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <circle cx="200" cy="120" r="35" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <circle cx="200" cy="120" r="3" fill="#ffffff" />
      
      <path d="M 90 90 A 30 30 0 0 1 90 150" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <rect x="25" y="55" width="65" height="130" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <rect x="25" y="85" width="22" height="70" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <circle cx="65" cy="120" r="2.5" fill="#ffffff" />
      <rect x="15" y="92" width="10" height="56" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      
      <path d="M 310 90 A 30 30 0 0 0 310 150" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <rect x="310" y="55" width="65" height="130" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <rect x="353" y="85" width="22" height="70" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <circle cx="335" cy="120" r="2.5" fill="#ffffff" />
      <rect x="375" y="92" width="10" height="56" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      
      <path d="M 33 20 A 8 8 0 0 1 25 28" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <path d="M 25 212 A 8 8 0 0 1 33 220" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <path d="M 367 220 A 8 8 0 0 1 375 212" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <path d="M 375 28 A 8 8 0 0 1 367 20" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      
      {teamA.map((p, idx) => (
        <g key={`ta-${idx}`} transform={`translate(${p.x}, ${p.y})`}>
          <JerseyIcon color={jerseys.a} />
        </g>
      ))}
      
      {teamB.map((p, idx) => (
        <g key={`tb-${idx}`} transform={`translate(${p.x}, ${p.y})`}>
          <JerseyIcon color={jerseys.b} />
        </g>
      ))}
      
      {/* Ball */}
      <circle cx={ballPos.x} cy={ballPos.y} r="6" fill="#ffffff" filter={`url(#glow-${field.id})`} />
      <circle cx={ballPos.x} cy={ballPos.y} r="4" fill="#0f172a" />
      <circle cx={ballPos.x} cy={ballPos.y} r="2" fill="#ffffff" />
    </svg>
  );
};

const FieldCard = ({ field, onDelete, onStatusChange }) => {
  const navigate = useNavigate();
  const statusColors = {
    'Sẵn sàng': 'text-green-500',
    'Tạm ngưng': 'text-red-500',
    'Đang bảo trì': 'text-gray-400'
  };

  const handleToggle = async () => {
    const newStatus = field.isActive ? 'maintenance' : 'active';
    try {
      const response = await fetch(`http://localhost:3000/api/fields/admin/pitches/${field.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        onStatusChange();
      }
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all h-full flex flex-col text-left"
    >
      <div className="relative h-48 overflow-hidden bg-emerald-950 flex items-center justify-center">
        {field.type === 'SÂN 5 NGƯỜI' ? (
          <Pitch5VectorSVG field={field} />
        ) : field.type === 'SÂN 7 NGƯỜI' ? (
          <Pitch7VectorSVG field={field} />
        ) : field.type === 'SÂN 11 NGƯỜI' ? (
          <Pitch11VectorSVG field={field} />
        ) : (
          <img 
            src={field.image} 
            alt={field.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold px-3 py-1 rounded-full text-gray-700">
            {field.type}
          </span>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/field/edit/${field.id}`);
            }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:bg-white transition-colors border-none cursor-pointer"
          >
            <Edit3 size={16} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(field);
            }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-white transition-colors border-none cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
        {!field.isActive && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-900 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg">
              Đang bảo trì
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-gray-900">{field.name}</h4>
          <div className="text-right">
            <p className="text-[#059669] font-black leading-none">{field.price}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Mỗi giờ</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 font-medium mb-6">{field.description}</p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold ${field.isActive ? 'text-green-500' : 'text-gray-400'}`}>
              {field.isActive ? 'Sẵn sàng' : 'Bảo trì'}
            </span>
          </div>
          <button 
            onClick={handleToggle}
            className={`w-10 h-5 rounded-full relative transition-colors border-none cursor-pointer ${field.isActive ? 'bg-[#059669]' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${field.isActive ? 'left-[22px]' : 'left-0.5'}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const AdminFields = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fieldToDelete, setFieldToDelete] = useState(null);
  const [isNewFieldModalOpen, setIsNewFieldModalOpen] = useState(false);

  const fetchFields = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/fields/admin/pitches');
      const result = await response.json();
      if (response.ok) {
        // Sắp xếp sân theo thứ tự: Sân 5 -> Sân 7 -> Sân 11 và theo Tên (01 -> 10)
        const typeOrder = { '5_nguoi': 1, '7_nguoi': 2, '11_nguoi': 3 };
        const sortedData = result.data.sort((a, b) => {
          if (typeOrder[a.type] !== typeOrder[b.type]) {
            return typeOrder[a.type] - typeOrder[b.type];
          }
          return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
        });
        setFields(sortedData);
      }
    } catch (error) {
      console.error('Lỗi lấy danh sách sân:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const handleDeleteClick = (field) => {
    setFieldToDelete(field);
  };

  if (loading) {
      return (
          <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#059669]"></div>
          </div>
      );
  }

  // --- Dynamic Stats ---
  const dynamicFieldStats = [
    { label: 'Tổng số sân', value: fields.length.toString() },
    { label: 'Sân 5 người', value: fields.filter(f => f.type === '5_nguoi').length.toString() },
    { label: 'Sân 7 người', value: fields.filter(f => f.type === '7_nguoi').length.toString() },
    { label: 'Sân 11 người', value: fields.filter(f => f.type === '11_nguoi').length.toString() },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="mb-8 text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Quản lý Sân bóng</h1>
        <p className="text-gray-500 font-medium text-sm">Danh sách chi tiết 30 sân con đang hoạt động tại HKSPORT Premium Complex.</p>
      </header>

      {/* Specs Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-left">
        {dynamicFieldStats.map((stat, idx) => (
          <StatCard key={idx} stat={stat} />
        ))}
      </section>

      {/* Fields Grid (Show all pitches with type-specific images) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 text-left">
        {fields.map((field) => {
          // Xác định ảnh dựa trên loại sân (Cập nhật theo ảnh thực tế người dùng gửi)
          let pitchImage = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800';
          if (field.type === '5_nguoi') pitchImage = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop'; // Ảnh có khán đài
          if (field.type === '7_nguoi') pitchImage = 'https://images.unsplash.com/photo-1431324155629-1a6eda1fed2d?q=80&w=800&auto=format&fit=crop'; // Ảnh Aerial (từ trên cao)
          if (field.type === '11_nguoi') pitchImage = 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800&auto=format&fit=crop'; // Ảnh sân lớn có tòa nhà mài vòm

          return (
            <FieldCard 
              key={field.id} 
              field={{
                  ...field,
                  name: field.name,
                  type: field.type === '5_nguoi' ? 'SÂN 5 NGƯỜI' : field.type === '7_nguoi' ? 'SÂN 7 NGƯỜI' : 'SÂN 11 NGƯỜI',
                  price: field.base_price ? `${Number(field.base_price).toLocaleString()}đ` : 'Chưa có giá',
                  description: field.type === '5_nguoi' ? 'Sân cỏ nhân tạo chất lượng cao' : field.type === '7_nguoi' ? 'Sân tiêu chuẩn chuyên nghiệp' : 'Sân vận động cỏ tự nhiên chuẩn quốc tế',
                  isActive: field.status === 'active',
                  image: pitchImage
              }} 
              onDelete={handleDeleteClick} 
              onStatusChange={fetchFields}
            />
          );
        })}
        
        {/* Add New Field Shadow Card */}
        <button 
          onClick={() => setIsNewFieldModalOpen(true)}
          className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center group hover:bg-gray-100 hover:border-gray-300 transition-all min-h-[300px] border-none cursor-pointer"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#059669] shadow-sm mb-4 group-hover:scale-110 transition-transform">
            <Plus size={24} />
          </div>
          <h4 className="font-bold text-gray-900 mb-2 uppercase italic tracking-tight">Thêm sân mới</h4>
          <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-[180px]">
            Mở rộng quy mô bằng cách thêm sân con mới vào tổ hợp.
          </p>
        </button>
      </div>

      {/* Detailed List Table */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left mb-10">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold">Danh sách chi tiết {fields.length} sân</h2>
          <span className="text-[10px] font-black text-[#059669] bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest italic">Dữ liệu thực tế</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-gray-400 font-bold border-b border-gray-50">
                <th className="px-6 py-6 font-bold">STT / Tên sân</th>
                <th className="px-6 py-6 font-bold">Loại sân</th>
                <th className="px-6 py-6 font-bold">Giá cơ bản / Giờ</th>
                <th className="px-6 py-6 text-center font-bold">Trạng thái</th>
                <th className="px-6 py-6 text-center font-bold">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {fields.map((field, index) => (
                <tr key={field.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-[#059669] font-black text-xs border border-emerald-100">
                        {index + 1}
                      </div>
                      <span className="font-bold text-sm text-gray-800">{field.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-left">
                    {field.type === '5_nguoi' ? 'Sân 5 người' : field.type === '7_nguoi' ? 'Sân 7 người' : 'Sân 11 người'}
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-[#059669] text-left">
                    {field.base_price ? `${Number(field.base_price).toLocaleString()}đ` : 'Chưa có giá'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                       <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${field.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                          {field.status === 'active' ? 'Đang hoạt động' : 'Đang bảo trì'}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-3">
                      <button 
                        onClick={() => navigate(`/admin/field/edit/${field.id}`)}
                        className="text-gray-400 hover:text-emerald-600 transition-colors bg-transparent border-none cursor-pointer"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick({
                            ...field,
                            image: `https://picsum.photos/seed/pitch-${field.id}/400/300`,
                            price: field.base_price ? `${Number(field.base_price).toLocaleString()}đ` : '---'
                        })}
                        className="text-gray-300 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AnimatePresence>
        {fieldToDelete && (
          <DeleteFieldModal 
            field={fieldToDelete} 
            isOpen={!!fieldToDelete} 
            onClose={() => setFieldToDelete(null)} 
            onConfirm={fetchFields}
          />
        )}
      </AnimatePresence>

      <NewFieldModal 
        isOpen={isNewFieldModalOpen} 
        onClose={() => setIsNewFieldModalOpen(false)} 
        onConfirm={fetchFields}
      />
    </motion.div>
  );
};

export default AdminFields;
