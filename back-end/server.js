import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './auth.js';
import userRoutes from './userdata.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(authRoutes);
app.use(userRoutes);

app.get('/', (req, res) => {
  res.send('Hello from Backend!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
