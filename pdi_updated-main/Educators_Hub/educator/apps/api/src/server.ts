import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import coreRoutes from './routes/core.js';

dotenv.config({ path: '../../.env' });

const app = express();
app.use(cors({ origin: 'http://localhost:4173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', coreRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Ekya Educator API' });
});

const port = process.env.PORT || 4174;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${port}`);
});
