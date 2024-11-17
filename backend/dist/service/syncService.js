"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncDatabaseToElastic = exports.syncMessagesToElastic = exports.syncUsersToElastic = void 0;
const db_1 = require("../config/db");
const pool = (0, db_1.createPool)();
// Função para sincronizar usuários com Elasticsearch
const syncUsersToElastic = async (elasticClient) => {
    try {
        // Buscar dados da tabela "users"
        const [users] = await pool.query('SELECT id, username, email, created_at, updated_at FROM users');
        // Indexar os dados no Elasticsearch
        for (const user of users) {
            await elasticClient.index({
                index: 'users',
                id: user.id.toString(),
                body: {
                    username: user.username,
                    email: user.email,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                },
            });
        }
        console.log('Usuários sincronizados com sucesso no Elasticsearch!');
    }
    catch (err) {
        console.error('Erro ao sincronizar usuários com Elasticsearch:', err);
        throw err;
    }
};
exports.syncUsersToElastic = syncUsersToElastic;
// Função para sincronizar dados de mensagens no Elasticsearch
const syncMessagesToElastic = async (elasticClient) => {
    try {
        // Buscar dados da tabela "messages"
        const [messages] = await pool.query('SELECT id, sender_id, receiver_id, message, created_at FROM messages');
        // Indexar os dados no Elasticsearch
        for (const message of messages) {
            await elasticClient.index({
                index: 'messages',
                id: message.id.toString(),
                body: {
                    sender_id: message.sender_id,
                    receiver_id: message.receiver_id,
                    message: message.message,
                    created_at: message.created_at,
                },
            });
        }
        console.log('Mensagens sincronizadas com sucesso no Elasticsearch!');
    }
    catch (err) {
        console.error('Erro ao sincronizar mensagens com Elasticsearch:', err);
        throw err;
    }
};
exports.syncMessagesToElastic = syncMessagesToElastic;
// Função principal para sincronizar todas as tabelas
const syncDatabaseToElastic = async (elasticClient) => {
    console.log('Iniciando sincronização com Elasticsearch...');
    await (0, exports.syncUsersToElastic)(elasticClient);
    await (0, exports.syncMessagesToElastic)(elasticClient);
    console.log('Sincronização concluída!');
};
exports.syncDatabaseToElastic = syncDatabaseToElastic;
//# sourceMappingURL=syncService.js.map