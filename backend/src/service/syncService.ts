// Erasmo Cardoso   ---  sincronizar elasticsearch com mysql
import { Client } from '@elastic/elasticsearch';
import { createPool } from '../config/db';

const pool = createPool();

// Função para sincronizar usuários com Elasticsearch
export const syncUsersToElastic = async (elasticClient: Client): Promise<void> => {
  try {
    // Buscar dados da tabela "users"
    const [users]: any = await pool.query('SELECT id, username, email, created_at, updated_at FROM users');

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
  } catch (err) {
    console.error('Erro ao sincronizar usuários com Elasticsearch:', err);
    throw err;
  }
};

// Função para sincronizar dados de mensagens no Elasticsearch
export const syncMessagesToElastic = async (elasticClient: Client): Promise<void> => {
  try {
    // Buscar dados da tabela "messages"
    const [messages]: any = await pool.query('SELECT id, sender_id, receiver_id, message, created_at FROM messages');

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
  } catch (err) {
    console.error('Erro ao sincronizar mensagens com Elasticsearch:', err);
    throw err;
  }
};

// Função principal para sincronizar todas as tabelas
export const syncDatabaseToElastic = async (elasticClient: Client): Promise<void> => {
  console.log('Iniciando sincronização com Elasticsearch...');
  await syncUsersToElastic(elasticClient);
  await syncMessagesToElastic(elasticClient);
  console.log('Sincronização concluída!');
};
