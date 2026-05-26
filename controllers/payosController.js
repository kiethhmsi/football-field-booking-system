const db = require('../config/db');
const payOS = require('../utils/payos');
const { createNotification } = require('./notificationController');
const { handleTournamentAutomation } = require('../utils/tournamentAutomation');

// --- 1. TẠO LINK THANH TOÁN ---
const createPaymentLink = async (req, res) => {
    try {
        const { bookingId, tournamentId, registrationData, amountType } = req.body; 

        let amount = 0;
        let description = '';
        let orderCode = Date.now(); // Sử dụng timestamp để tránh trùng lặp
        let returnUrl = process.env.PAYOS_RETURN_URL || 'http://localhost:5173/payment-success';
        let cancelUrl = process.env.PAYOS_CANCEL_URL || 'http://localhost:5173/history';

        if (bookingId) {
            // Logic cũ cho đặt sân
            const [bookings] = await db.execute('SELECT * FROM bookings WHERE id = ?', [bookingId]);
            if (bookings.length === 0) return res.status(404).json({ message: 'Không tìm thấy đơn đặt sân' });
            const booking = bookings[0];
            amount = amountType === 'deposit' ? Math.floor(booking.total_price * 0.5) : booking.total_price;
            description = `KASPORT ${booking.booking_code}`;
            orderCode = Number(bookingId); // Giữ tương thích cũ
        } else if (tournamentId && registrationData) {
            // Logic mới cho giải đấu
            const [tournaments] = await db.execute('SELECT * FROM tournaments WHERE id = ?', [tournamentId]);
            if (tournaments.length === 0) return res.status(404).json({ message: 'Không tìm thấy giải đấu' });
            
            const tournament = tournaments[0];
            // Lấy phí từ entry_fee (chuẩn hóa về số)
            amount = parseInt(tournament.entry_fee.replace(/[^0-9]/g, '')) || 0;
            
            // 1. Tạo bản ghi đăng ký chờ thanh toán
            const [regResult] = await db.execute(`
                INSERT INTO tournament_registrations 
                (tournament_id, user_id, team_name, team_logo_url, captain_name, phone, members_list, amount, order_code, registration_status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending_payment')
            `, [
                tournamentId, req.user.id, registrationData.team_name, registrationData.team_logo_url, 
                registrationData.captain_name, registrationData.phone, JSON.stringify(registrationData.players || []), 
                amount, orderCode
            ]);

            description = `DK GIAI ${tournament.id}`;
            returnUrl = `http://localhost:5173/tournaments/${tournamentId}?status=success`;
            cancelUrl = `http://localhost:5173/tournaments/${tournamentId}?status=cancel`;
        } else {
            return res.status(400).json({ message: 'Thiếu thông tin thanh toán' });
        }

        // 2. Chuẩn bị dữ liệu thanh toán cho PayOS
        const paymentData = {
            orderCode: orderCode, 
            amount: amount,
            description: description.substring(0, 25),
            cancelUrl: cancelUrl,
            returnUrl: returnUrl
        };

        let paymentLinkRes;
        if (typeof payOS.createPaymentLink === 'function') {
            paymentLinkRes = await payOS.createPaymentLink(paymentData);
        } else if (payOS.paymentRequests && typeof payOS.paymentRequests.create === 'function') {
            paymentLinkRes = await payOS.paymentRequests.create(paymentData);
        } else {
            throw new Error('Không tìm thấy hàm tạo link thanh toán trong thư viện PayOS');
        }

        res.json({
            message: 'Tạo link thanh toán thành công',
            data: { checkoutUrl: paymentLinkRes.checkoutUrl }
        });

    } catch (err) {
        console.error('LỖI TẠO LINK PAYOS:', err);
        res.status(500).json({ message: 'Lỗi server khi tạo link thanh toán', error: err.message });
    }
};

// --- 2. XỬ LÝ WEBHOOK TỪ PAYOS (TỰ ĐỘNG XÁC NHẬN) ---
const handleWebhook = async (req, res) => {
    try {
        const webhookData = req.body;
        console.log('📩 Nhận Webhook từ PayOS:', webhookData);

        // 1. Xác thực dữ liệu (Cực kỳ quan trọng)
        if (!webhookData || !webhookData.data) {
            return res.json({ message: 'No data' });
        }

        let verifiedData = null;
        try {
            if (typeof payOS.verifyPaymentData === 'function') {
                verifiedData = await payOS.verifyPaymentData(webhookData.data);
            } else if (payOS.webhooks && typeof payOS.webhooks.verify === 'function') {
                verifiedData = await payOS.webhooks.verify(webhookData);
            }
        } catch (verifyError) {
            // Nếu là test signature thì bỏ qua lỗi xác thực
            if (webhookData.signature === 'test') {
                console.log('🧪 Nhận tín hiệu MOCK TEST - Bỏ qua xác thực chữ ký');
                verifiedData = webhookData.data;
            } else {
                console.error('❌ Lỗi xác thực Webhook:', verifyError.message);
                return res.status(400).json({ message: 'Invalid signature' });
            }
        }

        console.log('🔍 Dữ liệu sau xác thực:', verifiedData);

        if (webhookData.code === '00' && verifiedData) {
            const orderCode = verifiedData.orderCode || verifiedData.data?.orderCode;
            const amountPaid = verifiedData.amount || verifiedData.data?.amount;

            console.log(`📌 Processing Webhook - OrderCode: ${orderCode}, Amount: ${amountPaid}`);

            // 1. Kiểm tra xem đây là Đặt sân hay Đăng ký giải đấu
            // Check tournament first if orderCode is large (Date.now() style)
            const [tourRegs] = await db.execute('SELECT * FROM tournament_registrations WHERE order_code = ?', [orderCode]);
            
            if (tourRegs.length > 0) {
                const reg = tourRegs[0];
                console.log('🏆 Xử lý thanh toán Giải đấu cho:', reg.team_name);

                // Cập nhật trạng thái đăng ký
                await db.execute(`
                    UPDATE tournament_registrations 
                    SET payment_status = 'paid', registration_status = 'registered' 
                    WHERE id = ?
                `, [reg.id]);

                // CHỈ KHI THANH TOÁN THÀNH CÔNG: TẠO ĐỘI VÀ THÊM VÀO GIẢI
                // 1. Tạo đội trong bảng teams
                const [teamResult] = await db.execute(`
                    INSERT INTO teams (name, logo_url, captain_id, skill_level) 
                    VALUES (?, ?, ?, 'amateur')
                `, [reg.team_name, reg.team_logo_url, reg.user_id]);
                
                const newTeamId = teamResult.insertId;

                // 2. Thêm vào tournament_teams
                await db.execute(`
                    INSERT INTO tournament_teams (tournament_id, team_id, status, payment_status) 
                    VALUES (?, ?, 'confirmed', 'paid')
                `, [reg.tournament_id, newTeamId]);

                console.log(`✅ Đã tạo đội ${reg.team_name} (ID: ${newTeamId}) và thêm vào giải đấu.`);

                // Socket.io thông báo Admin
                const io = req.app.get('io');
                if (io) {
                    io.emit('new_notification', {
                        title: '🏆 Đăng ký giải mới',
                        message: `Đội ${reg.team_name} đã thanh toán và tham gia giải đấu.`,
                        type: 'tournament'
                    });
                }

                // CHẠY AUTOMATION: Thông báo khách, Đóng giải, Xếp lịch
                await handleTournamentAutomation(reg.tournament_id, reg.user_id, reg.team_name, io);

                return res.json({ message: 'OK' });
            }

            // 2. Nếu không phải giải đấu, kiểm tra Đặt sân (Logic cũ)
            const [bookings] = await db.execute('SELECT * FROM bookings WHERE id = ?', [orderCode]);
            if (bookings.length > 0) {
                const booking = bookings[0];
                let amountPaidValue = amountPaid || 0;
                let paymentStatus = amountPaidValue >= (booking.total_price || 0) ? 'paid' : 'partial';

                await db.execute(
                    `UPDATE bookings SET deposit_amount = ?, payment_status = ?, status = 'confirmed', payment_method = 'online' WHERE id = ?`,
                    [amountPaidValue, paymentStatus, orderCode]
                );

                console.log(`✅ TỰ ĐỘNG XÁC NHẬN ĐƠN ${booking.booking_code} THÀNH CÔNG!`);
                
                const io = req.app.get('io');
                // Thông báo khách hàng
                await createNotification(
                    booking.user_id,
                    '⚽ Đặt sân thành công',
                    `Đơn đặt sân ${booking.booking_code} của bạn đã được xác nhận.`,
                    'booking',
                    io
                );
                if (io) {
                    io.emit('booking_updated', { action: 'auto_confirmed', booking_id: orderCode, status: 'confirmed' });
                    io.emit('new_notification', {
                        title: '💰 Thanh toán mới',
                        message: `Đơn hàng ${booking.booking_code} đã thanh toán thành công qua PayOS.`,
                        type: 'payment'
                    });
                }
            }
        }

        // Trả về cho PayOS biết đã nhận thành công
        res.json({ message: 'OK' });

    } catch (err) {
        console.error('LỖI WEBHOOK PAYOS:', err);
        res.status(500).json({ message: 'Lỗi Webhook' });
    }
};

module.exports = {
    createPaymentLink,
    handleWebhook
};
