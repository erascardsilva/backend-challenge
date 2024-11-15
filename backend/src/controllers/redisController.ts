import { RequestHandler } from 'express';
import { getCache, setCache } from '../config/redis';  
import { error } from 'console';

// Endpoint para testar a leitura e gravação de cache no Redis
export const testRedisCache: RequestHandler = async (req, res): Promise<void> => {
  const { key, value } = req.body;

  if (!key || !value) {
     res.status(400).send({ message: 'Chave e valor são obrigatórios!' });
  }

  try {
    // Gravar no Redis com um TTL de 3600 segundos (1 hora)
    await setCache(key, value, 3600);

    // Ler o valor após a gravação
    const result = await getCache(key);

    if (result === null) {
       res.status(404).send({ message: 'Chave não encontrada no cache!' });
    }

    res.status(200).send({
      message: 'Redis funcionando!',
      key,
      value: result,  
    });

  } catch (err) {
    console.error('Erro ao manipular o Redis:', err);
     res.status(500).send({ message: 'Erro ao manipular o Redis', error });
  }
};
