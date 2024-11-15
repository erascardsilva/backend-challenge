//  Erasmo Cardoso
import { Request, RequestHandler, Response } from 'express';
import { createPool } from '../config/db';
import * as userService from '../service/userService';
import { User } from '../models/userModels';
import redisClient from '@/config/redis';

const pool = createPool();

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    let conn;
    try {
        conn = await pool.getConnection();
        const users = await userService.getAllUsers(conn);
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar usuários.' });
    } finally {
        if (conn) conn.release();
    }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password_hash } = req.body;
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction(); //  transação

        // Criar o usuário 
        const result = await userService.createUser(conn, username, email, password_hash);

        //cria um objeto do tipo User
        const newUser: User = {
            id: result.insertId, 
            username,
            email,
            password_hash
        };

        // Indexar o usuário no Elasticsearch
        const elasticResponse = await userService.indexUserInElastic(newUser);

        // Commit da transação se tudo estiver OK
        await conn.commit();

        // sucesso
        res.status(201).json({ 
            message: `Usuário criado com sucesso no banco de dados. Índice no Elasticsearch: ${elasticResponse}` 
        });
    } catch (err) {
        if (conn) await conn.rollback(); // Rollback err
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar usuário.' });
    } finally {
        if (conn) conn.release();
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { username, email, password_hash } = req.body;
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction(); //  transação

        // Atualizar o usuário no banco de dados
        await userService.updateUser(conn, parseInt(id), username, email, password_hash);

        // Atualizar no Elasticsearch
        const elasticResponse = await userService.updateUserInElastic(parseInt(id), username, email, password_hash);

        // Commit da transação se tudo der OK
        await conn.commit();

        // Sucesso
        res.json({ 
            message: `Usuário atualizado com sucesso no banco de dados. Atualização no Elasticsearch: ${elasticResponse}` 
        });
    } catch (err) {
        if (conn) await conn.rollback(); // Rollback errrrr
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    } finally {
        if (conn) conn.release();
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction(); //  transação

        // Excluir o usuário do MYSQL
        await userService.deleteUser(conn, parseInt(id));

        // Excluir no Elasticsearch
        const elasticResponse = await userService.deleteUserInElastic(parseInt(id));

        // Commit da transação se tudo certo
        await conn.commit();

        // Sucesso
        res.json({ 
            message: `Usuário excluído com sucesso do banco de dados. Exclusão no Elasticsearch: ${elasticResponse}` 
        });
    } catch (err) {
        if (conn) await conn.rollback(); // Rollback errrr
        console.error(err);
        res.status(500).json({ error: 'Erro ao excluir usuário.' });
    } finally {
        if (conn) conn.release();
    }
};

// Redis teste
export const testRedisCache: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const cacheKey = 'testKey';  
    const cacheValue = 'Redis is working!';

    try {
        // Tenta obter a chave do cache
        const cachedValue = await redisClient.get(cacheKey);

        if (cachedValue) {
            // Se o valor estiver no cache, retorna o valor do cache
            console.log('Cache hit!');
            res.json({ message: 'Cache hit!', data: cachedValue });
        } else {
            // Se não houver cache, armazene o valor
            await redisClient.setEx(cacheKey, 3600, cacheValue);  // Expira em 1 hora
            console.log('Cache miss! Valor armazenado no Redis.');
            res.json({ message: 'Cache miss! Valor armazenado no Redis.', data: cacheValue });
        }
    } catch (err) {
        console.error('Erro ao acessar o Redis:', err);
        res.status(500).json({ error: 'Erro ao testar o Redis' });
    }
};