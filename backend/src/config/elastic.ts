/// Erasmo Cardoso     elastic trabalhando .................

import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';
import { syncDatabaseToElastic } from '../service/syncService';


dotenv.config();

// Validar variáveis
const requiredEnvVars: string[] = ['ELASTIC_HOST', 'ELASTIC_USER', 'ELASTIC_PASSWORD'];
requiredEnvVars.forEach((varName: string) => {
  if (!process.env[varName]) {
    throw new Error(`A variável de ambiente ${varName} não foi definida!`);
  }
});

//  "http" ou "https"
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
    rejectUnauthorized: false,
  },
});

// Função para testar a conexão com Elasticsearch (15 tentativas)
const testConnection = async (): Promise<void> => {
  let retries = 15; // Número máximo de tentativas
  const backoffInterval = 5000; // Intervalo de 5 segundos entre as tentativas

  while (retries > 0) {
    try {
      // Tentando obter informações do servidor Elasticsearch
      const response = await elasticClient.info();
      console.log('Conexão com Elasticsearch bem-sucedida!', response);
      return; // OK
    } catch (err) {
      console.error('Erro ao conectar ao Elasticsearch:', err);
      retries -= 1;

      if (retries === 0) {
        console.error('Não foi possível conectar ao Elasticsearch após 15 tentativas.');
        process.exit(1); // Encerra o processo 
      } else {
        console.log(`Tentando novamente... (${retries} tentativas restantes)`);
        // Aguardar antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, backoffInterval));
      }
    }
  }
};

// Função de sincronização de dados
const syncDataWithElastic = async (): Promise<void> => {
  try {
    console.log('Sincronizando dados do banco de dados com Elasticsearch...');
    await syncDatabaseToElastic(elasticClient);
    console.log('Sincronização concluída!');
  } catch (err) {
    console.error('Erro durante a sincronização com Elasticsearch:', err);
    process.exit(1);
  }
};

// Função de inicialização
const init = async (): Promise<void> => {
  try {
    // Teste de conexão 
    await testConnection();

    // Sincronização de dados
    await syncDataWithElastic();
  } catch (err) {
    console.error('Erro ao iniciar o processo:', err);
    process.exit(1);
  }
};


init();

export default elasticClient;
