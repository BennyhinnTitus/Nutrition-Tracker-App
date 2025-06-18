import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/userdata.js';
import targetRoutes from './routes/targetdata.js';
import indexRoutes from './routes/index.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api',userRoutes);
app.use('/api',targetRoutes);
app.use('/api',indexRoutes);

app.get('/', (req, res) => {
  res.send('Hello from Backend!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
