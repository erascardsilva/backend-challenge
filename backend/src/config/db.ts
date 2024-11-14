// Erasmo Cardoso conect MYSQL

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const createPool = () => {
  const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error('A variável de ambiente ${varName} não foi definida!');
    }
  });

  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      connectionLimit: 5,
      connectTimeout: 10000,
    });

    // Connection tests

    pool.getConnection()
      .then(() => console.log('Conexão com o banco de dados estabelecida com sucesso!'))
      .catch((err) => {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Erro ao conectar ao banco de dados:', errorMessage);
      });

    return pool;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Erro ao conectar ao banco de dados:', errorMessage);
    throw err;
  }
};