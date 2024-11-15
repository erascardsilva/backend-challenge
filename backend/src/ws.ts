// Erasmo Cardoso Websocket

import { WebSocketServer } from 'ws';

export function initializeWebSocket(server: any) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        console.log('WebSocket conectado.');

        ws.on('message', (message) => {
            console.log('Received:', message);
            ws.send(`Echo: ${message}`);
        });

        ws.on('close', () => {
            console.log('WebSocket conexao fechada.');
        });
    });

    return wss;
}
