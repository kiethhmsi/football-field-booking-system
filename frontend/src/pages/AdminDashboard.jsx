import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminOverview from '../components/admin/AdminOverview';
import AdminBookings from '../components/admin/AdminBookings';
import AdminFields from '../components/admin/AdminFields';
import AdminMaintenance from '../components/admin/AdminMaintenance';
import AdminTimeSlots from '../components/admin/AdminTimeSlots';
import AdminRevenue from '../components/admin/AdminRevenue';
import AdminCustomers from '../components/admin/AdminCustomers';
import AdminCoupons from '../components/admin/AdminCoupons';
import AdminStaff from '../components/admin/AdminStaff';
import FieldDetail from '../components/admin/FieldDetail';
import EditField from '../components/admin/EditField';
import AdminInvoice from '../components/admin/AdminInvoice';
import AdminTournaments from '../components/admin/AdminTournaments';
import NewBookingModal from '../components/admin/NewBookingModal';
import { LayoutGrid } from 'lucide-react';

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // Mapping URL path to view names
  const viewMapping = {
    '/admin': 'Tổng quan',
    '/admin/bookings': 'Lịch đặt sân',
    '/admin/fields': 'Quản lý sân',
    '/admin/maintenance': 'Bảo trì',
    '/admin/coupons': 'Khuyến mãi',
    '/admin/slots': 'Quản lý khung giờ',
    '/admin/revenue': 'Doanh thu',
    '/admin/users': 'Khách hàng',
    '/admin/staff': 'Nhân viên',
    '/admin/invoice': 'Hóa đơn',
    '/admin/tournaments': 'Giải đấu',
  };

  const activeViewName = viewMapping[location.pathname] || 'Tổng quan';

  const handleViewChange = (viewName) => {
    const path = Object.keys(viewMapping).find(key => viewMapping[key] === viewName);
    if (path) {
      navigate(path);
    }
  };

  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);

  const renderContent = useMemo(() => {
    // Check for dynamic routes
    if (location.pathname.startsWith('/admin/field/edit/')) {
        return <EditField />;
    }
    if (location.pathname.startsWith('/admin/field/')) {
        return <FieldDetail />;
    }
    if (location.pathname.startsWith('/admin/invoice/')) {
        return <AdminInvoice />;
    }

    switch (location.pathname) {
      case '/admin':
        return <AdminOverview />;
      case '/admin/bookings':
        return <AdminBookings />;
      case '/admin/fields':
        return <AdminFields />;
      case '/admin/maintenance':
        return <AdminMaintenance />;
      case '/admin/slots':
        return <AdminTimeSlots />;
      case '/admin/revenue':
        return <AdminRevenue />;
      case '/admin/users':
        return <AdminCustomers />;
      case '/admin/staff':
        return <AdminStaff />;
      case '/admin/coupons':
        return <AdminCoupons />;
      case '/admin/tournaments':
        return <AdminTournaments />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <LayoutGrid size={32} />
            </div>
            <h3 className="font-bold text-lg text-gray-600 mb-1 italic uppercase tracking-widest">Tính năng đang phát triển</h3>
            <p className="text-sm">Trang {activeViewName} sẽ sớm được cập nhật dữ liệu thực tế.</p>
          </div>
        );
    }
  }, [location.pathname, activeViewName]);

  return (
    <div className="flex min-h-screen bg-brand-bg">
      {/* Sidebar */}
      <AdminSidebar 
        activeView={activeViewName} 
        onViewChange={handleViewChange} 
        onNewBooking={() => setIsNewBookingModalOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <AdminHeader activeView={activeViewName} />
        
        <main className="flex-1 overflow-y-auto bg-brand-bg px-8 py-8 no-scrollbar scroll-smooth">
          {renderContent}
        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isNewBookingModalOpen && (
          <NewBookingModal 
            isOpen={isNewBookingModalOpen} 
            onClose={() => setIsNewBookingModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
