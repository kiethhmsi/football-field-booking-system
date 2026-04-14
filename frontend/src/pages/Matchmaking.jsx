import React, { useState } from 'react';

const Matchmaking = () => {
  const [activeTab, setActiveTab] = useState('find_opponent'); // find_opponent hoặc find_teammate

  // Dữ liệu mẫu (Giả lập bài post của các Đội bóng tìm đối/tìm người theo Table Database m_open_matches)
  const matches = [
    { 
      id: 1, teamName: "FC Anh Em Bát Xát", logo: "🛡️", type: "find_opponent", 
      title: "Tìm đối mềm sân Thăng Long tối mai", time: "20:00 - 21:30 | 20/05/2026", 
      field: "Sân Thăng Long Arena (Sân 7)", 
      expenseSharing: "Chia thẳng 50/50", sideBet: "Thua trả luôn tiền nước 🥤", 
      skillLevel: "Trung bình yếu (Đá dưỡng sinh)" 
    },
    { 
      id: 2, teamName: "Mưa Tàn FC", logo: "🔥", type: "find_opponent", 
      title: "Tuyển đối cứng giao lưu cọ xát", time: "18:30 - 20:00 | 22/05/2026", 
      field: "Sân Vận Động Bách Khoa (Sân 11)", 
      expenseSharing: "Đội thua chịu 100% tiền sân 🤑", sideBet: "Không", 
      skillLevel: "Khá cứng chân (Tuyệt đối không chặt chém)" 
    },
    { 
      id: 3, teamName: "FC Độc Lập", logo: "🦅", type: "find_teammate", 
      title: "Mình có Sân rồi thiếu 1 Gôn và 1 Tiền đạo", time: "17:00 - 18:30 | Hôm nay", 
      field: "Sân Bóng Chùa Láng (Sân 7)", 
      expenseSharing: "Bạn đóng 50k / trận", sideBet: "", 
      skillLevel: "Bắt gôn cứng, ST biết chạy chỗ" 
    }
  ];

  // Lọc dữ liệu theo Tab đang chọn (Để phân luồng logic React)
  const filteredMatches = matches.filter(m => m.type === activeTab);

  return (
    <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh', padding: '40px 0' }}>
      
      {/* SECTION TÓM TẮT TRANG */}
      <div className="container" style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>Cộng Đồng <span style={{ color: 'var(--primary-color)' }}>Giao Lưu</span> Bóng Đá</h2>
        <p style={{ color: 'var(--text-muted)' }}>Tham gia cáp kèo, mở rộng mối quan hệ và cháy hết mình trên sân cỏ cùng KAKAKA.</p>
      </div>

      <div className="container">
        {/* NÚT TẠO KÈO (GÓC PHẢI DÀNH CHO ĐỘI TRƯỞNG) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
             <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 25px', borderRadius: '40px' }}>
                 <span style={{fontSize: '18px'}}>➕</span> Tạo Kèo Của Bạn
             </button>
        </div>

        {/* THANH TAB ĐIỀU HƯỚNG TÌM ĐỐI VS TÌM NGƯỜI */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', borderBottom: '2px solid var(--border-color)' }}>
          <button 
            onClick={() => setActiveTab('find_opponent')}
            style={{ 
              padding: '15px 40px', fontSize: '16px', fontWeight: 'bold', border: 'none', background: 'transparent', cursor: 'pointer',
              color: activeTab === 'find_opponent' ? 'var(--primary-color)' : 'var(--text-muted)',
              borderBottom: activeTab === 'find_opponent' ? '3px solid var(--primary-color)' : '3px solid transparent',
              transition: 'all 0.2s',
              transform: activeTab === 'find_opponent' ? 'translateY(1px)' : 'none'
            }}
          >
            ⚔️ Tìm Đối Thủ Giao Lưu
          </button>
          <button 
            onClick={() => setActiveTab('find_teammate')}
            style={{ 
              padding: '15px 40px', fontSize: '16px', fontWeight: 'bold', border: 'none', background: 'transparent', cursor: 'pointer',
              color: activeTab === 'find_teammate' ? 'var(--primary-color)' : 'var(--text-muted)',
              borderBottom: activeTab === 'find_teammate' ? '3px solid var(--primary-color)' : '3px solid transparent',
              transition: 'all 0.2s',
              transform: activeTab === 'find_teammate' ? 'translateY(1px)' : 'none'
            }}
          >
            🙋‍♂️ Tuyển Đồng Đội / Đá Phủi
          </button>
        </div>

        {/* FEED DANH SÁCH BÀI ĐĂNG (DẠNG THẺ CARD THÁC NƯỚC NHƯ FACEBOOK) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', maxWidth: '800px', margin: '0 auto' }}>
          
          {filteredMatches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-white)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
              Chưa có Kèo nào trong danh mục này. Nhấn Tạo Kèo Mới để mở bát nhé! ⚽️
            </div>
          ) : (
            filteredMatches.map(match => (
              <div key={match.id} style={{ backgroundColor: 'var(--bg-white)', borderRadius: 'var(--radius-md)', padding: '25px', boxShadow: 'var(--shadow-sm)', borderLeft: '5px solid var(--primary-color)', transition: 'transform 0.2s' }}>
                {/* 1. Header Card (Ava + Name) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '50px', height: '50px', backgroundColor: '#f0f4f8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: '1px solid var(--border-color)' }}>
                      {match.logo}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--text-main)', fontWeight: 700 }}>{match.teamName} <span style={{ color: '#1da1f2', fontSize: '14px' }}>☑️</span></h4>
                      <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>Đăng cách đây 2 giờ trước</p>
                    </div>
                  </div>
                  {/* Badge Label */}
                  <span style={{ backgroundColor: activeTab === 'find_opponent' ? '#ffefe6' : '#e6f4ea', color: activeTab === 'find_opponent' ? '#ff6b00' : 'var(--primary-color)', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                    {activeTab === 'find_opponent' ? '🔥 TÌM ĐỐI' : 'TÌM NGƯỜI'}
                  </span>
                </div>

                {/* 2. Tiêu đề và Khối Thông tin */}
                <h3 style={{ fontSize: '20px', marginBottom: '15px', lineHeight: '1.4' }}>{match.title}</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', backgroundColor: '#f9f9fb', padding: '18px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', border: '1px solid #f1f3f5' }}>
                   <div>
                       <div style={{ marginBottom: '10px', fontSize: '14px' }}><span style={{ color: 'var(--text-muted)' }}>⏰ Thời gian:</span> <strong style={{marginLeft: '5px'}}>{match.time}</strong></div>
                       <div style={{ marginBottom: '10px', fontSize: '14px' }}><span style={{ color: 'var(--text-muted)' }}>📍 Sân đấu:</span> <strong style={{marginLeft: '5px'}}>{match.field}</strong></div>
                       <div style={{ fontSize: '14px' }}><span style={{ color: 'var(--text-muted)' }}>💪 Đề xuất:</span> <span style={{ color: '#d9534f', fontWeight: 'bold', marginLeft: '5px' }}>{match.skillLevel}</span></div>
                   </div>
                   <div style={{ borderLeft: '1px dashed var(--border-color)', paddingLeft: '15px' }}>
                       <div style={{ marginBottom: '10px', fontSize: '14px' }}><span style={{ color: 'var(--text-muted)' }}>💵 Tiền sân:</span> <strong style={{color: '#ff6b00', marginLeft: '5px'}}>{match.expenseSharing}</strong></div>
                       {match.sideBet && <div style={{ fontSize: '14px' }}><span style={{ color: 'var(--text-muted)' }}>💧 Cược thêm:</span> <strong style={{marginLeft: '5px'}}>{match.sideBet}</strong></div>}
                   </div>
                </div>

                {/* 3. Footer Card Hành động */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
                   <div style={{ display: 'flex', gap: '15px', color: 'var(--text-muted)', fontSize: '14px' }}>
                     <span style={{ cursor: 'pointer' }}>👁️ 156 Lượt xem</span>
                     <span style={{ cursor: 'pointer', color: 'var(--primary-color)', fontWeight: 600 }}>🗯️ Đang có 3 Đội xin đá</span>
                   </div>
                   <button className="btn btn-primary" style={{ padding: '10px 30px', borderRadius: '8px' }}>
                     {activeTab === 'find_opponent' ? 'Gửi lời Thách Đấu ⚔️' : 'Xin tham gia nhóm 🙋‍♂️'}
                   </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Matchmaking;
