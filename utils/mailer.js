const nodemailer = require('nodemailer');

let transporterPromise;

const APPROVED_STATUS = 'confirmed';
const CANCELLED_STATUS = 'cancelled';

const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return new Intl.DateTimeFormat('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};

const formatTime = (value) => {
    if (!value) return '';
    return String(value).slice(0, 5);
};

const formatCurrency = (value) => {
    const amount = Number(value || 0);
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

const getMailConfig = () => {
    const host = process.env.MAIL_HOST || process.env.SMTP_HOST;
    const port = Number(process.env.MAIL_PORT || process.env.SMTP_PORT || 587);
    const user = process.env.MAIL_USER || process.env.SMTP_USER || process.env.GMAIL_USER;
    const pass = process.env.MAIL_PASS || process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

    if (!host && user && pass) {
        return {
            service: 'gmail',
            auth: { user, pass }
        };
    }

    if (host && user && pass) {
        return {
            host,
            port,
            secure: port === 465,
            auth: { user, pass }
        };
    }

    return null;
};

const createTransporter = async () => {
    const mailConfig = getMailConfig();

    if (mailConfig) {
        return nodemailer.createTransport(mailConfig);
    }

    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });
};

const getTransporter = () => {
    if (!transporterPromise) {
        transporterPromise = createTransporter();
    }

    return transporterPromise;
};

const buildRow = (label, value) => `
    <tr>
        <td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;background:#f8fafc;width:38%;font-size:13px;font-weight:700;color:#475569;">${escapeHtml(label)}</td>
        <td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:700;color:#0f172a;">${escapeHtml(value || '-')}</td>
    </tr>
`;

const buildBookingStatusEmail = (booking) => {
    const isApproved = booking.status === APPROVED_STATUS;
    const statusLabel = isApproved ? 'Da duoc duyet' : 'Da bi huy';
    const accentColor = isApproved ? '#16a34a' : '#dc2626';
    const softColor = isApproved ? '#ecfdf5' : '#fef2f2';
    const title = isApproved
        ? 'Don dat san cua ban da duoc duyet'
        : 'Don dat san cua ban da bi huy';
    const intro = isApproved
        ? 'HKSPORT da xac nhan lich dat san cua ban. Vui long den dung khung gio va mang theo ma don khi can doi chieu.'
        : 'HKSPORT rat tiec phai thong bao lich dat san nay da bi huy. Neu can ho tro them, vui long lien he bo phan cham soc khach hang.';

    const html = `
        <!doctype html>
        <html lang="vi">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${escapeHtml(title)}</title>
        </head>
        <body style="margin:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:32px 12px;">
                <tr>
                    <td align="center">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;">
                            <tr>
                                <td style="background:#0f172a;padding:28px 32px;color:#ffffff;">
                                    <div style="font-size:13px;letter-spacing:3px;font-weight:700;color:#93c5fd;">HKSPORT</div>
                                    <div style="font-size:28px;font-weight:800;margin-top:10px;line-height:1.25;">${escapeHtml(title)}</div>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:30px 32px;">
                                    <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">Xin chao <strong>${escapeHtml(booking.customer_name || 'Quy khach')}</strong>,</p>
                                    <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#475569;">${escapeHtml(intro)}</p>
                                    <div style="display:inline-block;background:${softColor};color:${accentColor};font-weight:800;border-radius:999px;padding:10px 16px;margin-bottom:24px;">
                                        ${escapeHtml(statusLabel)}
                                    </div>
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
                                        ${buildRow('Ma don', booking.booking_code)}
                                        ${buildRow('Cum san', booking.field_name)}
                                        ${buildRow('San', booking.pitch_name)}
                                        ${buildRow('Ngay dat', formatDate(booking.booking_date))}
                                        ${buildRow('Khung gio', `${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}`)}
                                        ${buildRow('Tong thanh toan', formatCurrency(booking.total_price))}
                                    </table>
                                    <p style="margin:26px 0 0;font-size:13px;line-height:1.6;color:#64748b;">
                                        Email nay duoc gui tu he thong thong bao tu dong cua HKSPORT. Vui long khong tra loi truc tiep email nay.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;

    return {
        subject: `[HKSPORT] ${title} - ${booking.booking_code || booking.id}`,
        html
    };
};

const sendBookingStatusEmail = async (booking) => {
    console.log(`[DEBUG MAILER] Bắt đầu xử lý email cho booking ${booking.id}, status: ${booking.status}`);
    if (![APPROVED_STATUS, CANCELLED_STATUS].includes(booking.status)) {
        console.log(`[DEBUG MAILER] Trạng thái ${booking.status} không hợp lệ để gửi email.`);
        return null;
    }

    if (!booking.customer_email) {
        console.warn(`[DEBUG MAILER] Cannot send booking status email: booking ${booking.id} has no customer email.`);
        return null;
    }

    const isRealSmtp = !!getMailConfig();
    console.log(`[DEBUG MAILER] Khởi tạo Transporter (${isRealSmtp ? 'Gmail/SMTP thật' : 'Ethereal test account'})...`);

    const transporter = await getTransporter();
    const { subject, html } = buildBookingStatusEmail(booking);
    const from = process.env.MAIL_FROM
        || process.env.SMTP_FROM
        || process.env.GMAIL_USER
        || 'HKSPORT <no-reply@hksport.local>';

    const info = await transporter.sendMail({
        from,
        to: booking.customer_email,
        subject,
        html
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
        console.log(`Preview booking email: ${previewUrl}`);
    }

    return info;
};

module.exports = {
    sendBookingStatusEmail
};
