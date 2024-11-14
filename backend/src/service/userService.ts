// Erasmo Cardoso  

import { PoolConnection } from 'mysql2/promise';
import elasticClient from '../config/elastic';
import { User } from '../models/userModels';

// Buscar todos os usuários no banco de dados
export const getAllUsers = async (conn: PoolConnection) => {
    const [rows] = await conn.query('SELECT * FROM users');
    return rows;
};

// Criar um novo usuário no banco de dados
export const createUser = async (conn: PoolConnection, username: string, email: string, password_hash: string) => {
    const [result] = await conn.query(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, password_hash]
    );
    
    // O insertId está dentro de result, que é do tipo ResultSetHeader
    return result as { insertId: number };
};

// Atualizar um usuário no banco de dados
export const updateUser = async (conn: PoolConnection, id: number, username: string, email: string, password_hash: string) => {
    await conn.query(
        'UPDATE users SET username = ?, email = ?, password_hash = ? WHERE id = ?',
        [username, email, password_hash, id]
    );
};

// Excluir um usuário no banco de dados
export const deleteUser = async (conn: PoolConnection, id: number) => {
    await conn.query('DELETE FROM users WHERE id = ?', [id]);
};

// Indexar um usuário no Elasticsearch
export const indexUserInElastic = async (user: User) => {
    const response = await elasticClient.index({
        index: 'users',
        body: {
            username: user.username,
            email: user.email,
            password_hash: user.password_hash
        }
    });
    return response.result;
};

// Atualizar um usuário no Elasticsearch
export const updateUserInElastic = async (id: number, username: string, email: string, password_hash: string) => {
    const response = await elasticClient.update({
        index: 'users',
        id: id.toString(),
        body: {
            doc: {
                username,
                email,
                password_hash
            }
        }
    });
    return response.result;
};

// Deletar um usuário no Elasticsearch
export const deleteUserInElastic = async (id: number) => {
    const response = await elasticClient.delete({
        index: 'users',
        id: id.toString()
    });
    return response.result;
};
