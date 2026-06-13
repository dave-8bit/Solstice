import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import pool from './db';
import { aiRouter } from './routes/ai';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/ai', aiRouter);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    game: 'SOLSTICE // TURING',
    timestamp: new Date().toISOString(),
  });
});

const port = Number(process.env.PORT ?? 3001);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`SOLSTICE // TURING -- Server running on David's port ${port}`);

  pool
    .query('SELECT NOW()')
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('DATABASE -- Connected successfully');
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('DATABASE -- Connection failed', err);
    });
});


