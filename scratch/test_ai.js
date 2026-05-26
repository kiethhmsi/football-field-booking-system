require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const db = require('../config/db');
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function runTest() {
    console.log("=== DIAGNOSTIC TEST START ===");
    console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 10)}...` : "❌ NOT FOUND");
    
    try {
        console.log("\n1. Testing Database Query...");
        const [fields] = await db.execute(`
            SELECT f.name as field_name, p.name as pitch_name, p.type, 
                   (SELECT MIN(price) FROM time_slots ts WHERE ts.field_id = f.id AND ts.pitch_type = p.type) as price
            FROM fields f
            JOIN pitches p ON f.id = p.field_id
            WHERE f.status != 'suspended' AND p.status = 'active'
        `);
        console.log(`✅ Database Query Successful! Found ${fields.length} rows.`);
        const fieldInfo = fields.map(f => `- ${f.field_name} (${f.pitch_name}): Loại ${f.type.replace('_nguoi', ' người')}, giá từ ${f.price ? f.price.toLocaleString() : 'N/A'}đ`).join('\n');
        console.log("Field info preview:\n", fieldInfo.substring(0, 300) + "...");
        
        console.log("\n2. Calling Google Generative AI (Gemini)...");
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("Vui lòng cấu hình GEMINI_API_KEY.");
        }
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        
        const prompt = `
Bạn là KASPORT AI - Trợ lý thông minh. Luôn xưng em và gọi khách là Anh/Chị. 
DỮ LIỆU SÂN BÓNG KASPORT:
${fieldInfo}
CHÍNH SÁCH: Website KASPORT.vn, Hotline 1900 6789. Đặt sân qua menu "Tìm sân".

Câu hỏi của khách: Xin chào, sân bóng HKSPORT Quận 7 có loại sân 7 người giá bao nhiêu?
`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("✅ Gemini API Call Successful!");
        console.log("Response text:\n", text);
        
    } catch (error) {
        console.error("❌ TEST FAILED!");
        console.error("Error Message:", error.message);
        console.error("Full Error Object:", error);
    } finally {
        // Exit process so database pool is closed
        process.exit(0);
    }
}

runTest();
