import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST ,
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
export const getCache = async (key: string): Promise<string | null> => {
    try {
      return await redisClient.get(key);  
    } catch (err) {
      console.error('Erro ao obter do cache:', err);
      return null;
    }
  };
  
  export const setCache = async (key: string, value: string, ttl: number): Promise<void> => {
    try {
      await redisClient.setEx(key, ttl, value);  
    } catch (err) {
      console.error('Erro ao salvar no cache:', err);
    }
  };

export default redisClient;
