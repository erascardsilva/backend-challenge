// Erasmo Cardoso WebSocket

import WebSocket from 'ws';

/**
 * Inicializa o servidor WebSocket.
 * @param wsServer O servidor HTTP para o WebSocket.
 */
export let wss: WebSocket.Server;

export const initializeWebSocket = (wsServer: any): void => {
  wss = new WebSocket.Server({ server: wsServer });

  console.log('Servidor WebSocket inicializado.');

  wss.on('connection', (ws: WebSocket) => {
    console.log('Novo cliente WebSocket conectado');

    ws.on('message', (message: string) => {
      console.log('Mensagem recebida do cliente:', message);

      ws.send(JSON.stringify({ message: 'Mensagem recebida com sucesso!' }));
    });

    ws.on('close', () => {
      console.log('Cliente WebSocket desconectado');
    });

    ws.on('error', (error) => {
      console.error('Erro no WebSocket:', error);
    });

    ws.send(JSON.stringify({ message: 'Bem-vindo ao WebSocket!' }));
  });
};
