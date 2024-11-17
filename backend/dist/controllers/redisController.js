"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRedisCache = void 0;
const redis_1 = require("../config/redis");
const console_1 = require("console");
// Endpoint para testar a leitura e gravação de cache no Redis
const testRedisCache = async (req, res) => {
    const { key, value } = req.body;
    if (!key || !value) {
        res.status(400).send({ message: 'Chave e valor são obrigatórios!' });
    }
    try {
        // Gravar no Redis com um TTL de 3600 segundos (1 hora)
        await (0, redis_1.setCache)(key, value, 3600);
        // Ler o valor após a gravação
        const result = await (0, redis_1.getCache)(key);
        if (result === null) {
            res.status(404).send({ message: 'Chave não encontrada no cache!' });
        }
        res.status(200).send({
            message: 'Redis funcionando!',
            key,
            value: result,
        });
    }
    catch (err) {
        console.error('Erro ao manipular o Redis:', err);
        res.status(500).send({ message: 'Erro ao manipular o Redis', error: console_1.error });
    }
};
exports.testRedisCache = testRedisCache;
//# sourceMappingURL=redisController.js.map