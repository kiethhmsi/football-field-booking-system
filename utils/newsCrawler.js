const db = require('../config/db');

/**
 * Hàm tạo slug từ tiêu đề tiếng Việt
 */
const createSlug = (str) => {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/[^a-z0-9 ]/g, "");
    str = str.replace(/\s+/g, "-");
    return str.trim();
};

/**
 * Hàm Crawler lấy tin từ VnExpress RSS
 */
const syncNewsFromRSS = async () => {
    try {
        console.log('--- STARTING RSS SYNC (VnExpress Thể Thao) ---');
        
        const RSS_URL = 'https://vnexpress.net/rss/the-thao.rss';
        const response = await fetch(RSS_URL);
        const xmlText = await response.text();

        // 1. Tách các <item> bằng Regex (Đơn giản, không cần thư viện)
        const items = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || [];
        
        let newArticlesCount = 0;

        for (const item of items) {
            const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/);
            const linkMatch = item.match(/<link><!\[CDATA\[(.*?)\]\]><\/link>/) || item.match(/<link>(.*?)<\/link>/);
            const descMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/);
            const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);

            if (!titleMatch || !linkMatch) continue;

            const title = titleMatch[1];
            const link = linkMatch[1];
            const descriptionHtml = descMatch ? descMatch[1] : '';
            const pubDate = pubDateMatch ? new Date(pubDateMatch[1]) : new Date();

            // 2. Bóc tách ảnh và tóm tắt từ description HTML
            // VnExpress thường để: <a href="..."><img src="IMAGE_URL"></a>EXCERPT
            const imgMatch = descriptionHtml.match(/src="(.*?)"/);
            const coverImage = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800';
            
            // Xóa hết HTML để lấy text tóm tắt
            const excerpt = descriptionHtml.replace(/<[^>]*>?/gm, '').trim();
            const slug = createSlug(title);

            // 3. Kiểm tra xem bài viết đã tồn tại chưa (tránh trùng)
            const [existing] = await db.execute('SELECT id FROM news WHERE slug = ? OR title = ?', [slug, title]);
            
            if (existing.length === 0) {
                // 4. Chèn vào database (Mặc định author_id = 1 - Admin)
                await db.execute(`
                    INSERT INTO news (title, slug, cover_image, excerpt, content, category, author_id, status, published_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    title, 
                    slug, 
                    coverImage, 
                    excerpt, 
                    `<p>${excerpt}</p><p>Xem chi tiết tại: <a href="${link}" target="_blank">${link}</a></p>`, 
                    'Kinh nghiệm', 
                    1, 
                    'published', 
                    pubDate
                ]);
                newArticlesCount++;
            }
        }

        console.log(`--- SYNC COMPLETED: Added ${newArticlesCount} new articles ---`);
        return { success: true, count: newArticlesCount };
    } catch (error) {
        console.error('--- RSS SYNC ERROR ---', error);
        return { success: false, error: error.message };
    }
};

module.exports = { syncNewsFromRSS };
