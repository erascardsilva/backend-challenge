//  Erasmo Cardoso
import { Request, Response } from 'express';
import { createPool } from '../config/db';
import * as userService from '../service/userService';
import { User } from '../models/userModels';

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

        // Commit da transação se tudo der OK
        await conn.commit();

        // Atualizar no Elasticsearch
        const elasticResponse = await userService.updateUserInElastic(parseInt(id), username, email, password_hash);

        // Sucesso
        res.json({
            message: `Usuário atualizado com sucesso no banco de dados. Atualização no Elasticsearch: ${elasticResponse}`
        });
    } catch (err) {
        if (conn) await conn.rollback(); // Rollback errrrr
        
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
       
        // Commit da transação se tudo certo
        await conn.commit();

        // Excluir no Elasticsearch
         const elasticResponse = await userService.deleteUserInElastic(parseInt(id));
        // Sucesso
        res.json({
            message: `Usuário excluído com sucesso do banco de dados. Exclusão no Elasticsearch: ${elasticResponse}`
        });
    } catch (err) {
        if (conn) await conn.rollback(); // Rollback errrr
        
    } finally {
        if (conn) conn.release();
    }
};