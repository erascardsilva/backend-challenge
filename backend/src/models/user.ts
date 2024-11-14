// Erasmo Cardoso 

import { PoolConnection } from 'mysql2/promise';

export const getAllUsers = async (conn: PoolConnection) => {
    const [rows] = await conn.query('SELECT * FROM users');
    return rows;
};

export const createUser = async (conn: PoolConnection, username: string, email: string, password_hash: string) => {
    const [result] = await conn.query(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, password_hash]
    );
    return result;
};

export const updateUser = async (conn: PoolConnection, id: number, username: string, email: string) => {
    await conn.query('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, id]);
};

export const deleteUser = async (conn: PoolConnection, id: number) => {
    await conn.query('DELETE FROM users WHERE id = ?', [id]);
};
