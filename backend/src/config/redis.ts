// ajustar depois do elastic
import { createClient } from 'redis';


const redisClient = createClient({
  url: 'redis://localhost:6379',  // URL do Redis
});

redisClient.on('error', (err) => {
  console.log('Erro no Redis:', err);
});

redisClient.connect();

export default redisClient;
