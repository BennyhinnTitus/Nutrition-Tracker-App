import express from 'express'; 
import { db } from '../models/db.js';

const router = express.Router(); 

router.post('/user-target', async (req, res) => {
    // const { water_intake, body_weight, calorie_intake, calorie_burn } = req.body;
    // console.log(req.body);
    // const [rows] = await db.execute('SELECT id FROM userdata WHERE email = ?', [email]);
    
    // if (rows.length === 0) {
    //     return res.status(404).json( {success: false, message: 'User not found!'} );
    // }

    // const user_id = rows[0].id;
    // const query = 'INSERT INTO targetdata (userdata_id, water, weight, cal_intake, cal_burn) VALUES (?, ?, ?, ?, ?)';

    try {
        // console.log('🚀 Target Data Received:', req.body);
        // console.log('Received user target data:', { water_intake, body_weight, calorie_intake, calorie_burn });
        // await db.execute(query, [user_id, water_intake, body_intake, calorie_intake, calorie_burn]);
        res.status(201).json( {success: true, message: 'User data saved!', received_data: req.body} );
    }

    catch (err) {
        console.error('Database insert error: ', err);
        res.status(500).json( {success: false, message: 'Insert failed!'} );
    }
});

router.post('/user-target-data', async (req, res) => {
    console.log('Received user fitness data:', req.body);
  const { name, email, height, weight, age, target_water_intake, target_body_weight, target_cal_intake, target_cal_burn } = req.body;
  const query = `INSERT INTO userdata (user_name, user_email, height, weight, age, target_water_intake, target_body_weight, target_cal_intake, target_cal_burn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    console.log('Received user data:', { name, email, height, weight, age, target_water_intake, target_body_weight, target_cal_intake, target_cal_burn });
    const [result] = await db.execute(query, [name, email, height, weight, age, target_water_intake, target_body_weight, target_cal_intake, target_cal_burn]);
    // const id = result.insertId;
    console.log(result);
    res.status(201).json({ success: true, message: 'User data saved', id: result.insertId});
  } 
  catch (err) {
    console.error('DB insert error:', err);
    res.status(500).json({ success: false, message: 'Insert failed' });
  }
});

router.get('/user-index/:email', async (req, res) => {
    try {
        const email_ID = req.params.email;
        const [rows] = await db.execute('SELECT * FROM userdata WHERE user_email = ?', [email_ID]);

        if (rows.length === 0) {
            return res.status(404).json( {success: false, message: 'User not found!'} );
        }

        // console.log('User data fetched successfully:', rows[0]);

        const name = rows[0].user_name;
        const email = rows[0].user_email;
        const height = rows[0].height;
        const weight = rows[0].weight;
        const age = rows[0].age;

        const userData = {name, email, height, weight, age};
        // const userData = {
        //     name: 'John Doe',
        //     email: email_ID,
        //     height: 180,
        //     weight: 75,
        //     age: 30
        // };

        res.status(200).json({success: true, message: 'User data found!', data: userData});
    }
    catch (err) {
        console.error('Something went wrong!', err);
        res.status(500).json( {success: false, message: 'Cant find userdata and send'} );
    }
});

export default router;