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
        // console.log('🚀 User ID:', userId);

        const today = new Date();
        const current_date = today.toISOString().split('T')[0];
        console.log(current_date);

        const query_2 = 'SELECT * FROM historydata WHERE userdata_id = ? AND log_date = ?';
        const [rows_2] = await db.query(query_2, [user_id, current_date]);

        console.log('🚀 Rows from historydata:', rows_2);

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
        }
        else {
            const query_4 = 'INSERT INTO historydata (userdata_id, water, cal_intake, cal_burn, weight, log_date) VALUES (?, ?, ?, ?, ?, ?)';
            const water =  Number(req.body.water);
            const cal_intake =  Number(req.body.intake);
            const cal_burn =  Number(req.body.burn);
            const weight =  Number(req.body.weight);

            await db.query(query_4, [user_id, water, cal_intake, cal_burn, weight, current_date]);  
        }
        
        res.status(200).json({ success: true, message: 'Daily progress recorded successfully!'});
    }
    catch (err) {
        console.error('Error in daily progress route:', err);
        res.status(500).json({ success: false, message: 'Failed to record daily progress.' });
    }
});

export default router;