import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './middleware/auth.js';
import userRoutes from './routes/user.js';
import progresssRoutes from './routes/progress.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
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

// 🏠 Serve index.html on "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/signup-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup-login.html'));
});

app.get('/targetdata', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'targetdata.html')); 
});

app.get('/userdata', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'userdata.html'));
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`Server running at ${HOSTNAME}:${PORT}`);
});
