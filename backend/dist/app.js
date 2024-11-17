"use strict";
// Erasmo Cardoso   Principal
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config/elastic");
require("./service/syncService");
require("./config/db");
require("./config/redis");
require("web-streams-polyfill");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes/routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const ws_1 = require("./ws");
dotenv_1.default.config();
const app = (0, express_1.default)();
const EXPRESS_PORT = process.env.PORT || 3000;
const WS_PORT = process.env.WS_PORT || 8080;
const server = (0, http_1.createServer)(app);
(0, ws_1.initializeWebSocket)(server);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api', routes_1.default);
server.listen(EXPRESS_PORT, () => {
    console.log(`App Express rodando na porta ${EXPRESS_PORT}`);
});
const wsServer = (0, http_1.createServer)();
wsServer.listen(WS_PORT, () => {
    console.log(`Servidor WebSocket rodando na porta ${WS_PORT}`);
});
//# sourceMappingURL=app.js.map