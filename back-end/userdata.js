import express from 'express';
import db from './db.js';

const router = express.Router();

router.post('/user-data', async (req, res) => {
  const { name, email, height, weight, age } = req.body;
  const query = `INSERT INTO userdata (name, email, height, weight, age) VALUES (?, ?, ?, ?, ?)`;

  try {
    await db.execute(query, [name, email, height, weight, age]);
    res.status(201).json({ success: true, message: 'User data saved' });
  } 
  catch (err) {
    console.error('DB insert error:', err);
    res.status(500).json({ success: false, message: 'Insert failed' });
  }
});

export default router;
