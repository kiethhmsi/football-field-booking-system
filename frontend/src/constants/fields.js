// Bảng giá cố định cho toàn bộ dự án
export const PITCH_PRICING = {
  'Sân 5': {
    day: { label: '05:00 - 16:00', weekday: 180000, weekend: 200000 },
    night: { label: '16:00 - 24:00', weekday: 250000, weekend: 350000 }
  },
  'Sân 7': {
    day: { label: '05:00 - 16:00', weekday: 350000, weekend: 450000 },
    night: { label: '16:00 - 24:00', weekday: 500000, weekend: 600000 }
  },
  'Sân 11': {
    day: { label: '05:00 - 16:00', weekday: 800000, weekend: 1000000 },
    night: { label: '16:00 - 24:00', weekday: 1200000, weekend: 1500000 }
  }
};

const generatePitches = () => {
  const pitches = [];
  const types = [
    { type: '5 người', key: 'Sân 5' },
    { type: '7 người', key: 'Sân 7' },
    { type: '11 người', key: 'Sân 11' }
  ];

  let id = 1;
  types.forEach(item => {
    // Lấy giá khởi điểm (giờ sáng ngày thường) để làm giá hiển thị ở trang danh sách
    const basePrice = PITCH_PRICING[item.key].day.weekday;

    for (let i = 1; i <= 10; i++) {
      const num = i < 10 ? `0${i}` : i;
      pitches.push({
        id: id++,
        name: `Sân ${item.type.split(' ')[0]} - Sân số ${num}`,
        location: "Khu đô thị Phú Mỹ Hưng, Quận 7, TP.HCM",
        price: basePrice, 
        type: `Sân ${item.type}`,
        image: item.type.includes('5') 
          ? "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=1200"
          : item.type.includes('7')
            ? "https://images.unsplash.com/photo-1529900948632-586bc48fe710?q=80&w=1200"
            : "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200",
        rating: 5.0,
        amenities: ["wifi", "parking", "shower", "canteen"],
        phone: "0901000100"
      });
    }
  });
  return pitches;
};

export const MOCK_FIELDS = generatePitches();

export const MOCK_MATCHES = [
  {
    id: 'm1',
    teamName: 'HANOI STRIKERS FC',
    teamLogo: 'https://api.dicebear.com/7.x/identicon/svg?seed=hanoistrikers',
    skillLevel: 'Khá',
    location: 'Đội bóng uy tín (98%)',
    time: '19:30 - Chủ Nhật',
    matchDate: '24 Tháng 11, 2024',
    status: 'open',
    motto: 'Kỷ luật là sức mạnh - Chiến thắng là mục tiêu',
    winCount: 12,
    drawCount: 2,
    lossCount: 3,
    fieldFee: '600.000 VNĐ (Chia 2)',
    drinkBet: 'Đội thua mời',
    fieldSize: 'Sân 7 người',
    experience: 'Kèo 5-5-1 (Chia sân)',
    players: [
      { name: 'Minh Hiếu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=minhhieu', isCaptain: true },
      { name: 'Anh Đức', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anhduc' },
      { name: 'Quang Hải', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=quanghai' },
      { name: 'Văn Toàn', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vantoan' },
    ],
  },
  {
    id: 'm2',
    teamName: 'Mãnh Hổ FC',
    teamLogo: 'https://api.dicebear.com/7.x/identicon/svg?seed=manhho',
    skillLevel: 'Giỏi',
    location: 'Hạng nhất khu vực',
    time: 'Thứ 7, 18:00 - 19:30',
    status: 'closed',
    motto: 'Mãnh hổ ra quân - Bất phân thắng bại',
    winCount: 25,
    drawCount: 5,
    lossCount: 2,
    fieldFee: '500.000 VNĐ',
    drinkBet: 'Giao lưu trà đá',
    fieldSize: 'Sân 7 người',
    players: [
      { name: 'Sơn Tùng', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sontung', isCaptain: true },
      { name: 'Hải Đăng', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=haidang' },
    ],
  },
  {
    id: 'm3',
    teamName: 'Lão Tướng 8x',
    teamLogo: 'https://api.dicebear.com/7.x/identicon/svg?seed=laotuong',
    skillLevel: 'Trung bình',
    location: 'Thành viên 5 năm',
    time: 'Chủ nhật, 07:00 - 08:30',
    status: 'open',
    motto: 'Khỏe để xây dựng Tổ quốc',
    winCount: 8,
    drawCount: 10,
    lossCount: 15,
    fieldFee: 'Miễn phí',
    drinkBet: 'Vui vẻ là chính',
    fieldSize: 'Sân 5 người',
    players: [
      { name: 'Bác Ba', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bacba', isCaptain: true },
    ],
  },
];
