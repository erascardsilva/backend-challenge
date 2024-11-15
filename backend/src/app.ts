// Erasmo Cardoso
// App Principal

import express from 'express';
import 'web-streams-polyfill';
import cors from 'cors';
import router from './routes/routes';
import dotenv from 'dotenv';
import './config/elastic';
import './service/syncService';
import './config/db';
import './config/redis';
     

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
