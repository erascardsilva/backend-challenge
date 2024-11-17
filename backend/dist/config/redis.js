"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCache = exports.getCache = void 0;
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redisClient = (0, redis_1.createClient)({
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
});
redisClient.on('connect', () => {
    console.log('Conectado ao Redis com sucesso!');
});
redisClient.on('error', (err) => {
    console.error(`Erro ao conectar com o Redis: ${err}`);
});
//  Redis
redisClient.connect();
// Fechar o cliente 
process.on('SIGINT', () => {
    redisClient.quit().then(() => {
        console.log('Desconectado do Redis com sucesso.');
        process.exit(0);
    }).catch((err) => {
        console.error(`Erro ao desconectar do Redis: ${err}`);
        process.exit(1);
    });
});
//buscar
const getCache = async (key) => {
    try {
        return await redisClient.get(key);
    }
    catch (err) {
        console.error('Erro ao obter do cache:', err);
        return null;
    }
};
exports.getCache = getCache;
const setCache = async (key, value, ttl) => {
    try {
        await redisClient.setEx(key, ttl, value);
    }
    catch (err) {
        console.error('Erro ao salvar no cache:', err);
    }
};
exports.setCache = setCache;
exports.default = redisClient;
//# sourceMappingURL=redis.js.map