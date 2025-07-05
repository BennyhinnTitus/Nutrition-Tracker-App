import express from 'express'; 
import { db } from '../models/db.js';

const router = express.Router(); 

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

        const user_name = rows[0].user_name;
        const user_email = rows[0].user_email;
        const height = rows[0].height;
        const weight = rows[0].weight;
        const age = rows[0].age;

        // const target_water_intake = rows[0].target_water_intake;
        // const target_body_weight = rows[0].target_body_weight;
        // const target_cal_intake = rows[0].target_cal_intake;
        // const target_cal_burn = rows[0].target_cal_burn;

        const userData = {user_name, user_email, height, weight, age};
        // const targetData = {target_water_intake, target_body_weight, target_cal_intake, target_cal_burn};

        // console.log(userData);
        // console.log(targetData);

        res.status(200).json({success: true, message: 'User data found!', user: userData});
    }
    catch (err) {
        console.error('Something went wrong!', err);
        res.status(500).json( {success: false, message: 'Cant find userdata and send'} );
    }
});

// Check if user exists
router.get('/check-user/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const [rows] = await db.query('SELECT id FROM userdata WHERE user_email = ?', [email]);
        res.json({ exists: rows.length > 0 });
    } catch (error) {
        console.error('Error checking user:', error);
        res.status(500).json({ error: 'Failed to check user' });
    }
});


router.post('/edit-target-data', async (req, res) => {
    try {
        console.log("executing try block on the server side");  
        const [rows] = await db.execute('UPDATE userdata SET target_water_intake = ?, target_cal_burn = ?, target_cal_intake = ?, target_body_weight = ? WHERE id = ?', [req.body.target_water_intake, req.body.target_cal_burn, req.body.target_cal_intake, req.body.target_body_weight, req.body.userId]);
        if (rows.affectedRows === 0) {
            console.log("user not found");  
            res.status(404).json({success: false, message: "User not found!"});
            return;
        }
        console.log("success");  
        res.status(201).json({success: true, message: "User's new goals are updated"});
    }

    catch (err) {
        console.error("Error updating user's goals: ", err);
        res.status(500).json({success: false, message: "Server Error. Can't set new goals right now."});
    }
});


export default router;