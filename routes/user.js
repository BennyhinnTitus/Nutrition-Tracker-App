import express from 'express'; 

const router = express.Router();
// import db from '../db.js';   

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

router.post('/user-fitness-data', async (req, res) => {
  const { name, email, height, weight, age } = req.body;
  const query = `INSERT INTO userdata (name, email, height, weight, age) VALUES (?, ?, ?, ?, ?)`;

  try {
    console.log('Received user data:', { name, email, height, weight, age });
    // await db.execute(query, [name, email, height, weight, age]);
    res.status(201).json({ success: true, message: 'User data saved' });
  } 
  catch (err) {
    console.error('DB insert error:', err);
    res.status(500).json({ success: false, message: 'Insert failed' });
  }
});

router.get('/user-index/:email', async (req, res) => {
    try {
        const email_ID = req.params.email;
        // const [rows] = await db.execute('SELECT * FROM userdata WHERE email = ?', [email_ID]);

        // if (rows.length === 0) {
        //     return res.status(404).json( {success: false, message: 'User not found!'} );
        // }

        // const name = rows[0].name;
        // const email = rows[0].email;
        // const height = rows[0].height;
        // const weight = rows[0].weight;
        // const age = rows[0].age;

        // const userData = {name, email, height, weight, age};
        const userData = {
            name: 'John Doe',
            email: email_ID,
            height: 180,
            weight: 75,
            age: 30
        };

        res.status(200).json({success: true, message: 'User data found!', data: userData});
    }
    catch (err) {
        console.error('Something went wrong!', err);
        res.status(500).json( {success: false, message: 'Cant find userdata and send'} );
    }
});

export default router;