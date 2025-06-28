import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import { db } from '../models/db.js';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  const { credential } = req.body;
  // console.log(req.body);

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    console.log('Verified user:', email, name);

    let userId;

    // Check if user exists
    const [rows] = await db.query('SELECT id FROM userdata WHERE user_email = ?', [email]);
    const new_user = rows.length === 0;

    if (!new_user) {
      userId = rows[0]?.id;
    }

    res.json({
      success: true,
      message: 'User verified successfully',
      user: { email, name, picture },
      new_user,
      userId: userId || null,
    });
  } catch (err) {
    console.error('Verification failed:', err);
    res.status(401).json({ success: false, message: 'Token verification failed' });
  }
});

router.get('/get-client-id', (req, res) => {
  res.json({ success: true, clientId: process.env.GOOGLE_CLIENT_ID });
});

export default router;