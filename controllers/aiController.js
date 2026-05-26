const db = require('../config/db');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const handleChat = async (req, res) => {
    try {
        const { message, history } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(200).json({ success: false, message: "Vui lòng cấu hình GEMINI_API_KEY." });
        }

        // 1. Lấy dữ liệu sân bóng làm Context (Null-Safe)
        let fieldInfo = "";
        try {
            const [fields] = await db.execute(`
                SELECT f.name as field_name, p.name as pitch_name, p.type, 
                       (SELECT MIN(price) FROM time_slots ts WHERE ts.field_id = f.id AND ts.pitch_type = p.type) as price
                FROM fields f
                JOIN pitches p ON f.id = p.field_id
                WHERE f.status != 'suspended' AND p.status = 'active'
            `);
            
            fieldInfo = fields.map(f => {
                const priceText = f.price ? `${f.price.toLocaleString()}đ` : "chưa cập nhật";
                return `- ${f.field_name} (${f.pitch_name}): Loại ${f.type.replace('_nguoi', ' người')}, giá từ ${priceText}`;
            }).join('\n');
        } catch (dbError) {
            console.error("DB Query error in aiController:", dbError);
            fieldInfo = "Danh sách sân bóng đang được cập nhật.";
        }

        const systemPrompt = `Bạn là KASPORT AI - Trợ lý thông minh. Luôn xưng "em" và gọi khách hàng là "Anh/Chị".
DỮ LIỆU SÂN BÓNG KASPORT ĐANG HOẠT ĐỘNG:
${fieldInfo}

CHÍNH SÁCH & LIÊN HỆ:
- Website đặt sân chính thức: KASPORT.vn
- Hotline hỗ trợ trực tuyến: 1900 6789
- Hướng dẫn đặt sân: Khách hàng có thể đặt sân trực tiếp bằng cách nhấn vào nút "Đặt sân ngay" hoặc truy cập menu "Tìm sân" trên thanh điều hướng.

Hãy trả lời ngắn gọn, lịch sự, đúng trọng tâm và luôn dùng thông tin sân bóng thực tế trên để hỗ trợ khách hàng.`;

        // 2. Khởi tạo Gemini AI SDK
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // 3. Xử lý lịch sử hội thoại chuẩn Google SDK
        let chatHistory = (history || []).map(msg => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.text || msg.parts?.[0]?.text || "" }]
        }));

        // Lọc bỏ tin model ở đầu
        while (chatHistory.length > 0 && chatHistory[0].role === 'model') {
            chatHistory.shift();
        }

        // Đảm bảo đan xen user/model
        let cleanHistory = [];
        for (let i = 0; i < chatHistory.length; i++) {
            if (cleanHistory.length === 0) {
                if (chatHistory[i].role === 'user') {
                    cleanHistory.push(chatHistory[i]);
                }
            } else {
                const lastRole = cleanHistory[cleanHistory.length - 1].role;
                if (chatHistory[i].role !== lastRole) {
                    cleanHistory.push(chatHistory[i]);
                }
            }
        }

        // 4. Thử gọi API bằng gemini-2.0-flash, nếu lỗi thì tự động fallback sang gemini-1.5-flash-latest
        let text = "";
        let success = false;
        const modelsToTry = ["gemini-3.1-flash-lite", "gemini-2.5-flash", "gemini-2.0-flash"];

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ 
                    model: modelName,
                    systemInstruction: systemPrompt
                });

                const chat = model.startChat({
                    history: cleanHistory
                });

                const result = await chat.sendMessage(message);
                const response = await result.response;
                text = response.text();
                success = true;
                break; // Thành công thì thoát vòng lặp
            } catch (apiError) {
                console.warn(`Attempt with ${modelName} failed:`, apiError.message);
                // Nếu là lỗi Quota 429 hoặc lỗi khác, tiếp tục thử model tiếp theo
            }
        }

        if (!success) {
            throw new Error("Tất cả các model Gemini đều không phản hồi hoặc hết hạn mức.");
        }
        
        res.json({ success: true, message: text });

    } catch (error) {
        console.error("FULL ERROR IN AICONTROLLER:", error);
        
        let friendlyMessage = "⚠️ Em đang bận một chút, Anh/Chị thử lại sau giây lát nhé!";
        if (error.message.includes('429') || error.message.includes('quota')) {
            friendlyMessage = "⚠️ Hệ thống đang quá tải yêu cầu, Anh/Chị đợi em 30s nhé! 🙏";
        }

        res.json({ success: false, message: friendlyMessage });
    }
};

const testKey = async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.json({ success: false, error: "GEMINI_API_KEY is not defined in .env file." });
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello, say 'Gemini 3.1 is working!'" }] }]
            })
        });

        const data = await response.json();
        
        res.json({
            success: response.ok,
            status: response.status,
            apiUrl: apiUrl.replace(apiKey, "HIDDEN_KEY"),
            data: data
        });
    } catch (error) {
        res.json({
            success: false,
            error: error.message,
            stack: error.stack
        });
    }
};

module.exports = { handleChat, testKey };
