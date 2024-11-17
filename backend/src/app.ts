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

const EXPRESS_PORT = process.env.PORT || 3000;  
const WS_PORT = process.env.WS_PORT || 8080;   

const server = createServer(app);

initializeWebSocket(server);

app.use(cors());
app.use(express.json());
app.use('/api', router);

server.listen(EXPRESS_PORT, () => {
  console.log(`App Express rodando na porta ${EXPRESS_PORT}`);
});

const wsServer = createServer();
wsServer.listen(WS_PORT, () => {
  console.log(`Servidor WebSocket rodando na porta ${WS_PORT}`);
});
