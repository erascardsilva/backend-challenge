"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
// Cria o cliente Redis
const redisClient = (0, redis_1.createClient)({
    url: 'redis://localhost:6379', // URL do Redis
});
redisClient.on('error', (err) => {
    console.log('Erro no Redis:', err);
});
redisClient.connect();
exports.default = redisClient;
