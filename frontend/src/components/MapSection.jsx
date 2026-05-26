import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import MapComponent from './MapComponent';

const MapSection = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/fields');
        const result = await response.json();
        if (result.data) {
          setFields(result.data);
        }
      } catch (error) {
        console.error('Lỗi lấy tọa độ sân:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFields();
  }, []);

  return (
    <section className="py-24 px-6 md:px-12 bg-slate-50 dark:bg-[#0b1221] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="w-10 h-1 bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">Hệ thống bản đồ</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic"
            >
              Vị trí <span className="text-emerald-600">Hệ thống sân</span> KASPORT
            </motion.h2>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-emerald-500/5 border border-slate-100 dark:border-slate-700"
          >
            <Navigation className="text-emerald-500 animate-pulse" size={20} />
            <div>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none">Trạng thái</p>
              <p className="text-xs font-black text-slate-900 dark:text-white mt-1 uppercase italic">Thời gian thực</p>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="relative group"
        >
          {/* Map Overlay Info */}
          <div className="absolute top-6 left-6 z-[100] hidden md:block">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white/20 max-w-[240px]">
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase italic mb-4">Hướng dẫn</h4>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 border-2 border-white shadow-lg"><MapPin size={12} className="text-white" /></div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Bấm vào từng Marker để xem nhanh thông tin và giá sân.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center shrink-0 border-2 border-slate-500"><Navigation size={12} className="text-white dark:text-black" /></div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Sử dụng nút "Đặt ngay" để chuyển đến trang chi tiết.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[500px] md:h-[650px] w-full rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800">
            {loading ? (
              <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                 <div className="flex flex-col items-center">
                   <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mb-4" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang khởi tạo bản đồ...</span>
                 </div>
              </div>
            ) : (
              <MapComponent 
                className="h-full w-full"
                points={fields.map(f => ({
                  lat: f.latitude,
                  lng: f.longitude,
                  popupContent: `
                    <div style="padding: 15px; width: 220px; font-family: 'Inter', sans-serif;">
                      <img src="${f.image}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 15px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
                      <div style="margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
                        <span style="background: #ecfdf5; color: #059669; padding: 2px 8px; border-radius: 6px; font-size: 8px; font-weight: 900; text-transform: uppercase;">Sân bóng cỏ nhân tạo</span>
                      </div>
                      <h4 style="margin: 0; font-size: 16px; font-weight: 900; text-transform: uppercase; font-style: italic; color: #1e293b;">${f.name}</h4>
                      <p style="margin: 6px 0; font-size: 11px; color: #64748b; font-weight: 500; line-height: 1.4;">${f.address}</p>
                      <div style="margin-top: 10px; border-top: 1px dashed #e2e8f0; padding-top: 10px; display: flex; justify-between; align-items: center;">
                        <span style="font-size: 14px; font-weight: 900; color: #059669;">${new Intl.NumberFormat('vi-VN').format(f.base_price)}đ/h</span>
                        <a href="/fields/${f.id}" style="margin-left: auto; background: #000; color: #fff; padding: 6px 12px; border-radius: 10px; text-decoration: none; font-size: 10px; font-weight: 900; text-transform: uppercase;">Đặt ngay</a>
                      </div>
                    </div>
                  `
                }))}
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MapSection;
