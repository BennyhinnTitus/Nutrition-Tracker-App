import express from 'express';
import db from './db.js';

const router = express.Router();

router.post('/user-target', async (req, res) => {
    const { email, water_intake, body_intake, calorie_intake, calorie_burn } = req.body;
    const [rows] = await db.execute('SELECT id FROM userdata WHERE email = ?', [email]);
    
    if (rows.length === 0) {
        return res.status(404).json( {success: false, message: 'User not found!'} );
    }

    const user_id = rows[0].id;
    const query = 'INSERT INTO targetdata (userdata_id, water, weight, cal_intake, cal_burn) VALUES (?, ?, ?, ?, ?)';

    try {
        await db.execute(query, [user_id, water_intake, body_intake, calorie_intake, calorie_burn]);
        res.status(201).json( {success: true, message: 'User data saved!'} );
    }

    catch (err) {
        console.error('Database insert error: ', err);
        res.status(500).json( {success: false, message: 'Insert failed!'} );
    }
});

export default router;
