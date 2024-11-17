"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testWebsocket = void 0;
const ws_1 = require("../ws");
const ws_2 = __importDefault(require("ws"));
const testWebsocket = (req, res) => {
    if (!ws_1.wss || ws_1.wss.clients.size === 0) {
        res.status(500).send({ message: 'Nenhum cliente WebSocket conectado!' });
    }
    let sentMessage = false;
    ws_1.wss.clients.forEach((client) => {
        if (client.readyState === ws_2.default.OPEN) {
            client.send(JSON.stringify({ message: 'Rota /wstest foi acessada! WebSocket funcionando!' }));
            sentMessage = true;
        }
    });
    if (!sentMessage) {
        res.status(500).send({ message: 'Nenhum cliente WebSocket ativo!' });
    }
    res.status(200).send({ message: 'Mensagem enviada para clientes WebSocket conectados!' });
};
exports.testWebsocket = testWebsocket;
//# sourceMappingURL=wsController.js.map