import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './middleware/auth.js';
import userRoutes from './routes/user.js';
import progresssRoutes from './routes/progress.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkConnection, db } from './models/db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 300;
const HOSTNAME = process.env.HOSTNAME || 'localhost';

// 🔧 Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔐 Middleware
app.use(cors());
app.use(express.json());

// 📂 Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// 🛣️ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/progress', progresssRoutes);

// 🏠 Routes for pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/userdata', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'userdata.html'));
});

// app.get('/userdata', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'userdata.html'));
// });

app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json({ success: true, result: rows[0].result });
  } catch (err) {
    console.error('Database connection failed:', err);
    res.status(500).json({ success: false, error: 'DB connection error' });
  }
});

app.get('/userdata-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM userdata');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Database query failed:', err);
    res.status(500).json({ success: false, error: 'DB query error' });
  }
});

// 🚀 Start server
app.listen(PORT, async() => {
  console.log(`Server running at ${HOSTNAME}:${PORT}`);
  try {
    await checkConnection();
  } catch (err) {
    console.error('Failed to connect to the database:', err);
  }
});
