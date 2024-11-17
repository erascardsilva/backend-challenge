"use strict";
/// Erasmo Cardoso     elastic ..............
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch_1 = require("@elastic/elasticsearch");
const dotenv_1 = __importDefault(require("dotenv"));
const syncService_1 = require("../service/syncService");
dotenv_1.default.config();
// Variáveis de ambiente 
const requiredEnvVars = ['ELASTIC_HOST', 'ELASTIC_USER', 'ELASTIC_PASSWORD'];
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        throw new Error(`A variável de ambiente ${varName} não foi definida!`);
    }
});
// Cliente Elasticsearch
const elasticClient = new elasticsearch_1.Client({
    node: process.env.ELASTIC_HOST,
    auth: {
        username: process.env.ELASTIC_USER,
        password: process.env.ELASTIC_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
//Testar a conexão com Elasticsearch
const testConnection = async () => {
    const retries = parseInt(process.env.ELASTIC_RETRIES || '15', 10);
    const backoffInterval = parseInt(process.env.ELASTIC_INTERVAL || '5000', 10);
    let attemptsLeft = retries;
    while (attemptsLeft > 0) {
        try {
            console.log(`Tentando conectar ao Elasticsearch em ${process.env.ELASTIC_HOST}...`);
            const response = await elasticClient.info();
            console.log(' Conexão com Elasticsearch bem-sucedida!');
            console.log('Informações do Elasticsearch:', response);
            return;
        }
        catch (err) {
            console.error(` Erro ao conectar ao Elasticsearch: ${err}`);
            attemptsLeft -= 1;
            if (attemptsLeft === 0) {
                console.error(` Não foi possível conectar ao Elasticsearch após ${retries} tentativas. Verifique a URL: ${process.env.ELASTIC_HOST}`);
                process.exit(1);
            }
            else {
                console.log(`↪ Tentando novamente em ${backoffInterval / 1000}s... (${attemptsLeft} tentativas restantes)`);
                await new Promise(resolve => setTimeout(resolve, backoffInterval));
            }
        }
    }
};
// Função de sincronização de dados
const syncDataWithElastic = async () => {
    try {
        console.log(' Sincronizando dados do banco de dados com Elasticsearch...');
        await (0, syncService_1.syncDatabaseToElastic)(elasticClient);
        console.log(' Sincronização concluída com sucesso!');
    }
    catch (err) {
        console.error(' Erro durante a sincronização com Elasticsearch:', err);
        process.exit(1);
    }
};
// Função de inicialização
const init = async () => {
    try {
        console.log(' Iniciando processo de conexão e sincronização...');
        await testConnection();
        await syncDataWithElastic();
    }
    catch (err) {
        console.error(' Erro ao iniciar o processo:', err);
        process.exit(1);
    }
};
init();
exports.default = elasticClient;
//# sourceMappingURL=elastic.js.map