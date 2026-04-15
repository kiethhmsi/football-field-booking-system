import React from 'react';
import { useParams, Link } from 'react-router-dom';

const FieldDetail = () => {
    const { id } = useParams();
    
    // Giả lập dữ liệu sân
    const fieldData = {
        name: "Sân bóng đá KaSport - Sân 7 A1",
        image: "https://images.unsplash.com/photo-1529900948632-586bc48fe710?q=80&w=1200",
        price: "600k - 800k / trận",
        description: "Sân bóng cỏ nhân tạo chất lượng cao, hệ thống đèn chiếu sáng hiện đại, đạt tiêu chuẩn quốc tế.",
        amenities: ["Wifi miễn phí", "Nước uống tận nơi", "Gửi xe miễn phí", "Phòng thay đồ", "Căng tin"],
        timeSlots: [
            { time: "05:00 - 06:30", price: "400.000đ", status: "Available" },
            { time: "06:30 - 08:00", price: "500.000đ", status: "Booked" },
            { time: "16:00 - 17:30", price: "600.000đ", status: "Available" },
            { time: "17:30 - 19:00", price: "800.000đ", status: "Available" },
            { time: "19:00 - 20:30", price: "800.000đ", status: "Booked" },
            { time: "20:30 - 22:00", price: "700.000đ", status: "Available" },
        ]
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 0' }}>
            <div className="container">
                <nav style={{ marginBottom: '20px', fontSize: '14px' }}>
                    <Link to="/fields" style={{ color: '#64748b', textDecoration: 'none' }}>Tìm sân</Link>
                    <span style={{ margin: '0 10px', color: '#cbd5e1' }}>/</span>
                    <span style={{ color: '#0f172a', fontWeight: 600 }}>Chi tiết sân</span>
                </nav>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
                    {/* LEFT CONTENT */}
                    <div>
                        <div style={{ 
                            width: '100%', height: '450px', borderRadius: '24px', 
                            backgroundImage: `url(${fieldData.image})`, backgroundSize: 'cover', 
                            backgroundPosition: 'center', marginBottom: '30px'
                        }}></div>
                        
                        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '15px' }}>{fieldData.name}</h1>
                            <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '30px' }}>{fieldData.description}</p>
                            
                            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '15px' }}>Tiện ích</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {fieldData.amenities.map((item, idx) => (
                                    <span key={idx} style={{ 
                                        backgroundColor: '#f1f5f9', padding: '8px 16px', 
                                        borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: '#475569'
                                    }}>
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CONTENT: BOOKING WIDGET */}
                    <div>
                        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', position: 'sticky', top: '100px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '25px', display: 'flex', justifyContent: 'space-between' }}>
                                Lịch trống <span>📅</span>
                            </h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {fieldData.timeSlots.map((slot, idx) => (
                                    <div key={idx} style={{ 
                                        padding: '15px', borderRadius: '16px', border: slot.status === 'Available' ? '2px solid #f1f5f9' : '1px solid #fee2e2',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        backgroundColor: slot.status === 'Available' ? 'white' : '#fef2f2',
                                        opacity: slot.status === 'Available' ? 1 : 0.6
                                    }}>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 700, fontSize: '14px' }}>{slot.time}</p>
                                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--primary-color)', fontWeight: 700 }}>{slot.price}</p>
                                        </div>
                                        {slot.status === 'Available' ? (
                                            <Link to="/booking" style={{ 
                                                backgroundColor: 'var(--primary-color)', color: 'white', 
                                                padding: '8px 15px', borderRadius: '10px', textDecoration: 'none', 
                                                fontSize: '13px', fontWeight: 700 
                                            }}>Chọn ➜</Link>
                                        ) : (
                                            <span style={{ fontSize: '13px', color: '#991b1b', fontWeight: 700 }}>Đã đặt</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '16px', textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: '14px', color: '#166534', fontWeight: 600 }}>Tư vấn nhanh? Gọi ngay</p>
                                <h2 style={{ margin: '5px 0', color: 'var(--primary-color)', fontWeight: 800 }}>0987.654.321</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FieldDetail;
