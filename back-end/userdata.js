import express from 'express';
import db from './db.js';

const router = express.Router();

router.post('/user-data', async (req, res) => {
  const { name, email, weight, height, age } = req.body;
  const query = `INSERT INTO userdata (name, email, weight, height, age) VALUES (?, ?, ?, ?, ?)`;

  try {
    await db.execute(query, [name, email, weight, height, age]);
    res.json({ success: true, message: 'User data saved' });
  } catch (err) {
    console.error('DB insert error:', err);
    res.status(500).json({ success: false, message: 'Insert failed' });
  }
});

export default router;
