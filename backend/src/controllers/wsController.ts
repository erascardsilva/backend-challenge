import { RequestHandler } from 'express';
import { wss } from '../ws';
import WebSocket from 'ws';

export const testWebsocket: RequestHandler = (req, res): void => {
  if (!wss || wss.clients.size === 0) {
     res.status(500).send({ message: 'Nenhum cliente WebSocket conectado!' });
  }

  let sentMessage = false;

  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ message: 'Rota /wstest foi acessada! WebSocket funcionando!' }));
      sentMessage = true;
    }
  });

  if (!sentMessage) {
    res.status(500).send({ message: 'Nenhum cliente WebSocket ativo!' });
  }
    res.status(200).send({ message: 'Mensagem enviada para clientes WebSocket conectados!' });
  };
