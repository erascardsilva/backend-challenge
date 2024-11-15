// Erasmo Cardoso Websocket
import WebSocket from 'ws';
import { Server } from 'http';

export let wss: WebSocket.Server;

export const initializeWebSocket = (server: Server) => {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Novo cliente WebSocket conectado');
    ws.on('message', (message) => {
      console.log('Mensagem recebida: %s', message);
    });

    ws.send(JSON.stringify({ message: 'Bem-vindo ao WebSocket!' }));
  });
};
