const db = require('../config/db');
const { syncNewsFromRSS } = require('../utils/newsCrawler');

// --- 1. LẤY DANH SÁCH TIN TỨC TRANG CHỦ ---
const getAllNews = async (req, res) => {
    try {
        // Chỉ lấy các bài đã xuất bản (published) và order bài mới nhất lên trên
        const [news] = await db.execute(`
            SELECT id, title, slug, cover_image, excerpt, category, views_count, published_at 
            FROM news 
            WHERE status = 'published' 
            ORDER BY published_at DESC 
            LIMIT 12
        `);

        res.json({ message: 'Thành công', data: news });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- 2. XEM CHI TIẾT 1 BÀI VIẾT BẰNG SLUG DÀNH CHO SEO ---
const getNewsDetail = async (req, res) => {
    try {
        const { slug } = req.params; // Lấy keyword từ link URL

        const [news] = await db.execute(`
            SELECT n.*, u.full_name as author_name 
            FROM news n
            JOIN users u ON n.author_id = u.id
            WHERE n.slug = ? AND n.status = 'published'
        `, [slug]);

        if (news.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy bài viết' });
        }

        // Feature phụ: Tự động Tăng View cho bài viết +1 mỗi lần bấm vào đọc
        await db.execute('UPDATE news SET views_count = views_count + 1 WHERE id = ?', [news[0].id]);

        res.json({ message: 'Thành công', data: news[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- 3. SYNC TIN TỨC TỪ RSS ---
const syncNews = async (req, res) => {
    const result = await syncNewsFromRSS();
    if (result.success) {
        res.json({ message: `Đã đồng bộ thành công ${result.count} bài viết mới!`, count: result.count });
    } else {
        res.status(500).json({ message: 'Lỗi khi đồng bộ tin tức', error: result.error });
    }
};

module.exports = { getAllNews, getNewsDetail, syncNews };
