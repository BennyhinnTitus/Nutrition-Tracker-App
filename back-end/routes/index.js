import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/user-index/:email', async (req, res) => {
    try {
        const email_ID = req.params.email;
        const [rows] = await db.execute('SELECT * FROM userdata WHERE email = ?', [email_ID]);

        if (rows.length === 0) {
            return res.status(404).json( {success: false, message: 'User not found!'} );
        }

        const name = rows[0].name;
        const email = rows[0].email;
        const height = rows[0].height;
        const weight = rows[0].weight;
        const age = rows[0].age;

        const userData = {name, email, height, weight, age};

        res.status(200).json({success: true, message: 'User data found!', body: userData});
    }
    catch (err) {
        console.error('Something went wrong!', err);
        res.status(500).json( {success: false, message: 'Cant find userdata and send'} );
    }
});

export default router;