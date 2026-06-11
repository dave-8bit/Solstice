import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    game: 'SOLSTICE // TURING',
    timestamp: new Date().toISOString()
  });
});

const port = Number(process.env.PORT ?? 3001);

app.listen(port, () => {
  // eslint-disable-next-line no-console
 console.log(`SOLSTICE // TURING -- Server running on David's port ${port}`);
});

