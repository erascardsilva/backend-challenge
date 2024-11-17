"use strict";
// Erasmo Cardoso WebSocket
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWebSocket = exports.wss = void 0;
const ws_1 = __importDefault(require("ws"));
const initializeWebSocket = (wsServer) => {
    exports.wss = new ws_1.default.Server({ server: wsServer });
    console.log('Servidor WebSocket inicializado.');
    exports.wss.on('connection', (ws) => {
        console.log('Novo cliente WebSocket conectado');
        ws.on('message', (message) => {
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
exports.initializeWebSocket = initializeWebSocket;
//# sourceMappingURL=ws.js.map