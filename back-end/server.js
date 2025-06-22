import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import progresssRoutes from './routes/progress.js';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/progress', progresssRoutes);

app.get('/', (req, res) => {
  res.send('Hello from Backend!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});