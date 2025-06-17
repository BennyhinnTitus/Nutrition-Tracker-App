import express from 'express';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/auth/google', async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    console.log('Verified user:', email, name);

    res.json({
      success: true,
      message: 'User verified successfully',
      user: { email, name, picture },
    });
  } catch (err) {
    console.error('Verification failed:', err);
    res.status(401).json({ success: false, message: 'Token verification failed' });
  }
});

export default router;
