const db = require('../config/db');

const getAllMaintenance = async (req, res) => {
    try {
        const [records] = await db.execute(`
            SELECT m.*, p.name as pitch_name, f.name as field_name
            FROM pitch_maintenance m
            JOIN pitches p ON m.pitch_id = p.id
            JOIN fields f ON p.field_id = f.id
            ORDER BY m.start_date DESC
        `);
        res.json({ message: 'Thành công', data: records });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const createMaintenance = async (req, res) => {
    try {
        const { pitch_id, maintenance_type, description, start_date, end_date, cost } = req.body;
        await db.execute(
            'INSERT INTO pitch_maintenance (pitch_id, maintenance_type, description, start_date, end_date, cost) VALUES (?, ?, ?, ?, ?, ?)',
            [pitch_id, maintenance_type, description, start_date, end_date, cost || 0]
        );
        res.status(201).json({ message: 'Tạo lịch bảo trì thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const updateMaintenanceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, end_date } = req.body;
        
        let query = 'UPDATE pitch_maintenance SET status = ?';
        let params = [status];
        
        if (end_date) {
            query += ', end_date = ?';
            params.push(end_date);
        }
        
        query += ' WHERE id = ?';
        params.push(id);
        
        await db.execute(query, params);
        res.json({ message: 'Cập nhật trạng thái thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const deleteMaintenance = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM pitch_maintenance WHERE id = ?', [id]);
        res.json({ message: 'Xóa lịch bảo trì thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

module.exports = {
    getAllMaintenance,
    createMaintenance,
    updateMaintenanceStatus,
    deleteMaintenance
};
