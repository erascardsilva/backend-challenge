import { RequestHandler } from 'express';
import { wss } from '../ws'; 
import WebSocket from 'ws'; 

export const testWebsocket: RequestHandler = (req, res): void => {

    if (!wss || wss.clients.size === 0) {
        res.status(500).send({ message: 'Nenhum cliente WebSocket conectado!' });
    }

    wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ message: 'Rota /wstest foi acessada! WebSocket funcionando!' }));
        }
    });

    res.status(200).send({ message: 'Servidor e WebSocket funcionando!' });
};
