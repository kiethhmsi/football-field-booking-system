const db = require('../config/db');

// --- 1. LẤY THỐNG KÊ TỔNG QUAN (DASHBOARD) ---
exports.getOverviewStats = async (req, res) => {
    try {
        const [userCount] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "customer"');
        const [pitchCount] = await db.query('SELECT COUNT(*) as count FROM pitches');
        const [bookingCount] = await db.query('SELECT COUNT(*) as count FROM bookings');

        // Thống kê nhanh hôm nay
        const [todayStats] = await db.execute(`
            SELECT 
                IFNULL(SUM(total_price), 0) as revenue,
                COUNT(*) as total_bookings,
                COUNT(CASE WHEN status IN ('paid', 'completed') THEN 1 END) as paid_bookings,
                COUNT(CASE WHEN status NOT IN ('paid', 'completed', 'cancelled') THEN 1 END) as unpaid_bookings
            FROM bookings 
            WHERE DATE(created_at) = CURDATE()
        `);

        res.json({
            success: true,
            data: {
                totalUsers: userCount[0].count, 
                totalFields: pitchCount[0].count,
                totalBookings: bookingCount[0].count,
                today: todayStats[0]
            }
        });
    } catch (error) {
        console.error('Lỗi lấy thống kê:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// --- 2. LẤY THỐNG KÊ DOANH THU CHI TIẾT ---
exports.getRevenueStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let dateCondition = "";
        const params = [];

        if (startDate && endDate) {
            dateCondition = " AND b.booking_date BETWEEN ? AND ?";
            params.push(startDate, endDate);
        }

        // A. CÁC CHỈ SỐ DOANH THU CHÍNH (Đã tích hợp thêm thống kê Lũy Kế lịch sử thực tế)
        const [revenueMetrics] = await db.execute(`
            SELECT 
                -- 1. Doanh thu hoàn tất (Paid hoặc Completed) trong kỳ đã chọn
                SUM(CASE WHEN status IN ('paid', 'completed') THEN total_price ELSE 0 END) as completed_revenue,
                
                -- 2. Doanh thu thực nhận (Tiền cọc của các đơn chưa xong + Tổng tiền các đơn đã xong) trong kỳ
                SUM(CASE 
                    WHEN status IN ('paid', 'completed') THEN total_price 
                    WHEN status IN ('confirmed', 'pending_confirmation', 'pending_payment') THEN IFNULL(deposit_amount, 0)
                    ELSE 0 
                END) as received_revenue,

                -- 2.1. Doanh thu dự kiến (Tổng giá trị tất cả đơn chưa hủy) trong kỳ
                SUM(total_price) as projected_revenue,

                -- 2.2. Số lượng đơn đặt sân thực tế trong kỳ đã lọc
                COUNT(b.id) as period_bookings,

                -- 3. Doanh thu hôm nay
                SUM(CASE WHEN DATE(created_at) = CURDATE() AND status IN ('paid', 'completed') THEN total_price ELSE 0 END) as today_revenue,

                -- 4. Doanh thu tháng này
                SUM(CASE WHEN MONTH(booking_date) = MONTH(CURDATE()) AND YEAR(booking_date) = YEAR(CURDATE()) AND status IN ('paid', 'completed') THEN total_price ELSE 0 END) as month_revenue,

                -- 5. Doanh thu năm nay
                SUM(CASE WHEN YEAR(booking_date) = YEAR(CURDATE()) AND status IN ('paid', 'completed') THEN total_price ELSE 0 END) as year_revenue,

                -- 6. Thống kê Lũy kế Thực tế (All-time)
                (SELECT IFNULL(SUM(total_price), 0) FROM bookings WHERE status IN ('paid', 'completed')) as all_time_revenue,
                (SELECT COUNT(*) FROM bookings WHERE status != 'cancelled') as all_time_bookings,

                -- 7. Số lượng đơn hôm nay
                COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as today_total_bookings,
                COUNT(CASE WHEN DATE(created_at) = CURDATE() AND status IN ('paid', 'completed') THEN 1 END) as today_paid_bookings,
                COUNT(CASE WHEN DATE(created_at) = CURDATE() AND status NOT IN ('paid', 'completed', 'cancelled') THEN 1 END) as today_unpaid_bookings
            FROM bookings b
            WHERE status != 'cancelled' ${dateCondition}
        `, params);

        // B. DOANH THU THEO NGÀY (CHO LINE CHART - 15 ngày gần nhất hoặc theo lọc)
        let dailyQuery = `
            SELECT booking_date as date, SUM(total_price) as revenue
            FROM bookings
            WHERE status IN ('paid', 'completed')
        `;
        if (startDate && endDate) {
            dailyQuery += " AND booking_date BETWEEN ? AND ?";
        } else {
            dailyQuery += " AND booking_date >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)";
        }
        dailyQuery += " GROUP BY booking_date ORDER BY booking_date ASC";
        const [dailyRev] = await db.execute(dailyQuery, params.length > 0 ? params : []);

        // Trích xuất năm động theo năm đang chọn từ bộ lọc ở frontend
        const queryYear = startDate ? new Date(startDate).getFullYear() : new Date().getFullYear();

        // C. DOANH THU THEO THÁNG (CHO BAR CHART - Lấy động theo năm đang chọn)
        const [monthlyRev] = await db.execute(`
            SELECT MONTH(booking_date) as month, SUM(total_price) as revenue
            FROM bookings
            WHERE status IN ('paid', 'completed') AND YEAR(booking_date) = ?
            GROUP BY MONTH(booking_date)
            ORDER BY month ASC
        `, [queryYear]);

        // D. XẾP HẠNG DOANH THU THEO SÂN (CONTRIBUTION)
        const [fieldContribution] = await db.execute(`
            SELECT 
                p.name as pitch_name,
                p.type as pitch_type,
                f.name as field_complex,
                COUNT(b.id) as total_bookings,
                SUM(b.total_price) as revenue
            FROM bookings b
            JOIN pitches p ON b.pitch_id = p.id
            JOIN fields f ON p.field_id = f.id
            WHERE b.status IN ('paid', 'completed') ${dateCondition}
            GROUP BY p.id
            ORDER BY revenue DESC
        `, params);

        // E. CHI TIẾT DOANH THU/ĐƠN THEO LOẠI SÂN QUA TỪNG THÁNG TRONG NĂM (Dữ liệu thực tế cho Tầng 2 - Lấy động theo năm đang chọn)
        const [pitchTypeMonthlyStats] = await db.execute(`
            SELECT 
                MONTH(b.booking_date) as month,
                p.type as pitch_type,
                SUM(b.total_price) as revenue,
                COUNT(b.id) as total_bookings
            FROM bookings b
            JOIN pitches p ON b.pitch_id = p.id
            WHERE b.status IN ('paid', 'completed') AND YEAR(b.booking_date) = ?
            GROUP BY MONTH(b.booking_date), p.type
            ORDER BY month ASC
        `, [queryYear]);

        res.json({
            success: true,
            data: {
                metrics: revenueMetrics[0],
                charts: {
                    daily: dailyRev,
                    monthly: monthlyRev,
                    pitchTypeMonthly: pitchTypeMonthlyStats
                },
                fieldRanking: fieldContribution
            }
        });
    } catch (error) {
        console.error('Lỗi lấy thống kê doanh thu:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};
