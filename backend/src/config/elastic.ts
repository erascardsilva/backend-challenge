/// Erasmo Cardoso     elastic trabalhando .................

import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';
import { syncDatabaseToElastic } from '../service/syncService'; // Serviço para sincronização de dados

// Carregar variáveis de ambiente
dotenv.config();

// Validar variáveis de ambiente necessárias
const requiredEnvVars: string[] = ['ELASTIC_HOST', 'ELASTIC_USER', 'ELASTIC_PASSWORD'];
requiredEnvVars.forEach((varName: string) => {
  if (!process.env[varName]) {
    throw new Error(`A variável de ambiente ${varName} não foi definida!`);
  }
});

// Verificação adicional para garantir que a URL do Elasticsearch comece com "http" ou "https"
const elasticHost = process.env.ELASTIC_HOST as string;
if (!/^https?:\/\//i.test(elasticHost)) {
  throw new Error('A variável ELASTIC_HOST deve começar com "http://" ou "https://".');
}

// Configurar o cliente Elasticsearch
const elasticClient = new Client({
  node: elasticHost,
  auth: {
    username: process.env.ELASTIC_USER as string,
    password: process.env.ELASTIC_PASSWORD as string,
  },
  tls: {
    rejectUnauthorized: false, // Ignorar certificados autoassinados (ajuste conforme necessário)
  },
});

// Função para testar a conexão com Elasticsearch
const testConnection = async (): Promise<void> => {
  try {
    // Tentando obter informações do servidor Elasticsearch
    const response = await elasticClient.info();
    console.log('Conexão com Elasticsearch bem-sucedida!', response);
  } catch (err) {
    console.error('Erro ao conectar ao Elasticsearch:', err);
    process.exit(1); // Encerra o processo se a conexão falhar
  }
};

// Função de sincronização de dados
const syncDataWithElastic = async (): Promise<void> => {
  try {
    console.log('Sincronizando dados do banco de dados com Elasticsearch...');
    await syncDatabaseToElastic(elasticClient); // Sincronizar os dados
    console.log('Sincronização concluída!');
  } catch (err) {
    console.error('Erro durante a sincronização com Elasticsearch:', err);
    process.exit(1);
  }
};

// Função de inicialização
const init = async (): Promise<void> => {
  // Teste de conexão com Elasticsearch
  await testConnection();

  // Sincronização de dados
  await syncDataWithElastic();
};

// Inicializando o processo
init();

// Exportar o cliente Elasticsearch para uso em outras partes do código
export default elasticClient;
