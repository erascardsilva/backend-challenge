// Erasmo Cardoso   Principal
 
import './config/elastic';
import './service/syncService';
import './config/db';
import './config/redis';
import 'web-streams-polyfill';
import express from 'express';
import cors from 'cors';
import router from './routes/routes';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initializeWebSocket } from './ws';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', router);

const server = createServer(app);
initializeWebSocket(server);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
