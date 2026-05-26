import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import FieldCard from '../components/FieldCard';
import Pagination from '../components/Pagination';
import MapComponent from '../components/MapComponent';
import MapSection from '../components/MapSection';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, List as ListIcon, Filter } from 'lucide-react';

export default function Fields() {
  const location = useLocation();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  
  // Khởi tạo filter từ state nếu có (truyền từ trang chủ)
  const [filters, setFilters] = useState({
    pitchType: location.state?.searchData?.type || 'Tất cả loại sân',
    minPrice: 0,
    maxPrice: 5000000,
    amenities: [],
    search: location.state?.searchData?.search || ''
  });

  // Cập nhật filter nếu location state thay đổi (ví dụ bấm tìm lại từ trang chủ)
  useEffect(() => {
    if (location.state?.searchData) {
      setFilters(prev => ({
        ...prev,
        pitchType: location.state.searchData.type || 'Tất cả loại sân',
        search: location.state.searchData.search || ''
      }));
    }
  }, [location.state]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- GỌI API LẤY DỮ LIỆU THẬT ---
  useEffect(() => {
    const fetchFields = async () => {
      setLoading(true);
      try {
        const typeMapping = {
          'Sân 5': '5_nguoi',
          'Sân 7': '7_nguoi',
          'Sân 11': '11_nguoi'
        };
        const typeParam = typeMapping[filters.pitchType] || '';
        const response = await fetch(`http://localhost:3000/api/fields?search=${filters.search || ''}&type=${typeParam}`);
        const result = await response.json();
        if (result.data) {
          setFields(result.data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sân:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, [filters.pitchType, filters.search]); // Gọi lại API khi đổi loại sân hoặc tìm kiếm

  const filteredFields = useMemo(() => {
    return fields.filter(field => {
      const price = field.base_price || 0;
      const matchPrice = price >= filters.minPrice && price <= filters.maxPrice;
      
      // Filter by amenities (Local filter for now)
      const matchAmenities = filters.amenities.length === 0 || 
        filters.amenities.every(a => (field.amenities || []).includes(a));

      return matchPrice && matchAmenities;
    });
  }, [fields, filters.minPrice, filters.maxPrice, filters.amenities]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredFields.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredFields.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredFields, currentPage]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden text-left">
      <main>
        {/* Hero Section - Synchronized with Matchmaking page */}
        <section className="bg-emerald-50/30 pt-16 pb-12 px-6 md:px-12 border-b border-gray-100">
          <div className="max-w-6xl mx-auto text-left">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-black text-gray-900 mb-4 uppercase italic tracking-tighter"
            >
              Hệ thống <span className="text-emerald-600 underline decoration-emerald-200 underline-offset-8">sân bóng</span> KASPORT
            </motion.h2>
            <p className="max-w-2xl text-gray-500 font-medium leading-relaxed font-sans">
              Trải nghiệm mặt sân cỏ nhân tạo đạt tiêu chuẩn quốc tế với hệ thống đèn chiếu sáng và tiện ích đỉnh cao cùng KaSport Complex.
            </p>
          </div>
        </section>


        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar */}
            <div className="flex-shrink-0">
              <Sidebar onFilterChange={handleFilterChange} filters={filters} />
            </div>

            {/* Results */}
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between mb-10">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">Kết quả tìm kiếm</h2>
                    <p className="text-gray-400 text-[10px] font-black mt-2 uppercase tracking-[0.2em] leading-none">Tìm thấy <span className="text-emerald-700">{filteredFields.length} sân bóng</span> phù hợp yêu cầu</p>
                </motion.div>

                <div className="flex bg-slate-100 p-1 rounded-2xl">
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-none cursor-pointer ${viewMode === 'list' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 bg-transparent'}`}
                  >
                    <ListIcon size={14} /> Danh sách
                  </button>
                  <button 
                    onClick={() => setViewMode('map')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-none cursor-pointer ${viewMode === 'map' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 bg-transparent'}`}
                  >
                    <Map size={14} /> Bản đồ
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-8 min-h-[400px]">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-20"
                    >
                      <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Đang tải dữ liệu sân bóng...</p>
                    </motion.div>
                  ) : viewMode === 'map' ? (
                    <motion.div
                      key="map-view"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="h-[600px] w-full"
                    >
                      <MapComponent 
                        className="h-full"
                        points={filteredFields.map(f => ({
                          lat: f.latitude,
                          lng: f.longitude,
                          popupContent: `
                            <div style="padding: 10px; width: 180px;">
                              <img src="${f.image}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 10px; margin-bottom: 8px;" />
                              <h4 style="margin: 0; font-size: 14px; font-weight: 900; text-transform: uppercase;">${f.name}</h4>
                              <p style="margin: 4px 0; font-size: 10px; color: #64748b;">${f.address}</p>
                              <p style="margin: 8px 0 0; font-size: 12px; font-weight: 800; color: #059669;">Từ ${new Intl.NumberFormat('vi-VN').format(f.base_price)}đ</p>
                              <a href="/fields/${f.id}" style="display: block; margin-top: 10px; background: #10b981; color: white; text-align: center; padding: 6px; border-radius: 8px; text-decoration: none; font-size: 10px; font-weight: 900; text-transform: uppercase;">Đặt ngay</a>
                            </div>
                          `
                        }))}
                      />
                    </motion.div>
                  ) : currentItems.length > 0 ? (
                    <div className="flex flex-col gap-8">
                      {currentItems.map((field, index) => (
                        <FieldCard key={field.id} field={field} index={index} />
                      ))}
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200"
                    >
                       <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
                          <Filter size={40} />
                       </div>
                       <h3 className="text-xl font-bold text-gray-400 italic uppercase tracking-tighter">Không tìm thấy sân phù hợp</h3>
                       <p className="text-gray-400 text-sm mt-2">Thử thay đổi bộ lọc để tìm thấy nhiều lựa chọn hơn bạn nhé!</p>
                       <button 
                         onClick={() => setFilters({ pitchType: 'Tất cả loại sân', minPrice: 0, maxPrice: 5000000, amenities: [], search: '' })}
                         className="mt-6 text-emerald-600 font-bold uppercase text-[10px] tracking-widest border-b-2 border-emerald-600 pb-1"
                       >
                          Đặt lại bộ lọc
                       </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>

        </div>
      </div>
        
      {/* Map System Section - Right before Footer */}
        <MapSection />
      </main>
    </div>
  );
}

