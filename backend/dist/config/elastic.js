"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.elasticClient = void 0;
const elasticsearch_1 = require("@elastic/elasticsearch");
const dotenv_1 = __importDefault(require("dotenv"));
// Carregar variáveis de ambiente
dotenv_1.default.config();
// Validar variáveis de ambiente necessárias
const requiredEnvVars = ['ELASTIC_HOST'];
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        throw new Error(`A variável de ambiente ${varName} não foi definida!`);
    }
});
// Configurar o cliente Elasticsearch
exports.elasticClient = new elasticsearch_1.Client({
    node: process.env.ELASTIC_HOST, // Exemplo: http://localhost:9200
    auth: {
        username: process.env.ELASTIC_USER || 'elastic',
        password: process.env.ELASTIC_PASSWORD || 'changeme',
    },
});
// Testar conexão
exports.elasticClient
    .info()
    .then(() => console.log('Conexão com Elasticsearch bem-sucedida!'))
    .catch((err) => {
    console.error('Erro ao conectar ao Elasticsearch:', err.message || err);
});
exports.default = exports.elasticClient;
