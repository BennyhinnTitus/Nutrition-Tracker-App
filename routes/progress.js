import express from 'express';
import { db } from '../models/db.js';

const router = express.Router();

router.post('/daily-progress/:email', async (req, res) => {
    try {
        console.log('🚀 Daily Progress Data Received:', req.body)

        const email = req.params.email;
        // console.log('🚀 Email from request params:', email);

        const query_1 = 'SELECT id FROM userdata WHERE user_email = ?';
        const [rows_1] = await db.query(query_1, [email]);

        if (rows_1.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found!' });
        }

        const user_id = rows_1[0].id;
        console.log('🚀 User ID:', user_id);

        const today = new Date();
        const current_date = today.toISOString().split('T')[0];
        console.log(current_date);

        const query_2 = 'SELECT * FROM historydata WHERE userdata_id = ? AND log_date = ?';
        const [rows_2] = await db.query(query_2, [user_id, current_date]);

        console.log('🚀 Rows from historydata:', rows_2);

        let daily = {};

        if (rows_2.length !== 0) {
            const query_3 = 'UPDATE historydata SET water = ?, cal_intake = ?, cal_burn = ?, weight = ? WHERE userdata_id = ? AND log_date = ?';

            const past_water = rows_2[0].water;
            const past_cal_intake = rows_2[0].cal_intake;
            const past_cal_burn = rows_2[0].cal_burn;
            const past_weight = rows_2[0].weight;

            console.log('🚀 Past data:', { past_water, past_cal_intake, past_cal_burn, past_weight });

            const water = past_water + Number(req.body.water);
            const cal_intake = past_cal_intake +  Number(req.body.intake);
            const cal_burn = past_cal_burn +  Number(req.body.burn);
            const weight = past_weight +  Number(req.body.weight);

            console.log('🚀 Updated data:', { water, cal_intake, cal_burn, weight });

            await db.query(query_3, [water, cal_intake, cal_burn, weight, user_id, current_date]);

            daily = {water, cal_intake, cal_burn};
        }
        else {
            const query_4 = 'INSERT INTO historydata (userdata_id, water, cal_intake, cal_burn, weight, log_date) VALUES (?, ?, ?, ?, ?, ?)';
            const water =  Number(req.body.water);
            const cal_intake =  Number(req.body.intake);
            const cal_burn =  Number(req.body.burn);
            const weight =  Number(req.body.weight);

            await db.query(query_4, [user_id, water, cal_intake, cal_burn, weight, current_date]);
            
            daily = {water, cal_intake, cal_burn};
        }
        // console.log('🚀 Daily Progress:', daily);

        let targetData = {};
        const query_5 = 'SELECT target_water_intake, target_cal_intake, target_cal_burn FROM userdata WHERE user_email = ?';
        const [rows_5] = await db.query(query_5, [email]);

        const target_water_intake = rows_5[0].target_water_intake;
        const target_cal_intake = rows_5[0].target_cal_intake;
        const target_cal_burn = rows_5[0].target_cal_burn;

        targetData = {
            target_water_intake,
            target_cal_intake,
            target_cal_burn
        };

        console.log('🚀 Target Data:', targetData);
        
        res.status(200).json({ success: true, message: 'Daily progress recorded successfully!', dailyData: daily, target: targetData});
    }
    catch (err) {
        console.error('Error in daily progress route:', err);
        res.status(500).json({ success: false, message: 'Failed to record daily progress.' });
    }
});

router.get('/history/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // console.log('🚀 ID from request params:', id);

        const query = 'SELECT water, cal_intake, cal_burn, weight, log_date FROM historydata WHERE userdata_id = ? ORDER BY log_date ASC';
        const [rows] = await db.query(query, [id]);

        // console.log('🚀 Rows from historydata:', rows);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'No history found for this user.' });
        }

        // const formatted = rows.map(row => ({
        //     ...row,
        //     log_date: row.log_date.toISOString().split('T')[0]
        // }));

        res.status(200).json({ success: true, message: 'History fetched successfully!', data: rows });
    }

    catch (err) {
        console.error('Error in history route:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch history.' });
    }
});

export default router;