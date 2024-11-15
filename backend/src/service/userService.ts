//Erasmo Cardoso
import { PoolConnection, RowDataPacket } from 'mysql2/promise';
import elasticClient from '../config/elastic';
import { User } from '../models/userModels';

// -------------------- CRUD MySQL --------------------

export const createUser = async (
    conn: PoolConnection,
    username: string,
    email: string,
    password_hash: string
) => {
    try {
        const [result] = await conn.query(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, password_hash]
        );
        return result as { insertId: number };
    } catch (error) {
        console.error('Error creating user in MySQL:', error);
        throw new Error('Failed to create user in MySQL');
    }
};

export const getAllUsers = async (conn: PoolConnection) => {
    const [rows] = await conn.query<RowDataPacket[]>('SELECT * FROM users');
    return rows;
};

export const updateUser = async (
    conn: PoolConnection,
    id: number,
    username: string,
    email: string,
    password_hash: string
) => {
    try {
        await conn.query(
            'UPDATE users SET username = ?, email = ?, password_hash = ? WHERE id = ?',
            [username, email, password_hash, id]
        );
    } catch (error) {
        console.error('Error updating user in MySQL:', error);
        throw new Error('Failed to update user in MySQL');
    }
};

export const deleteUser = async (conn: PoolConnection, id: number) => {
    try {
        await conn.query('DELETE FROM users WHERE id = ?', [id]);
    } catch (error) {
        console.error('Error deleting user from MySQL:', error);
        throw new Error('Failed to delete user from MySQL');
    }
};

// -------------------- CRUD Elasticsearch --------------------

export const indexUserInElastic = async (user: User) => {
    try {
        const response = await elasticClient.index({
            index: 'users',
            id: user.id.toString(),
            body: {
                username: user.username,
                email: user.email,
                password_hash: user.password_hash,
            },
        });
        return response.result;
    } catch (error) {
        console.error('Error indexing user in Elasticsearch:', error);
        throw new Error('Failed to index user in Elasticsearch');
    }
};

export const updateUserInElastic = async (
    id: number,
    username: string,
    email: string,
    password_hash: string
) => {
    try {
        const getResponse = await elasticClient.get({
            index: 'users',
            id: id.toString(),
        }).catch(() => null);

        if (getResponse === null) {
            console.warn(`Document with ID ${id} not found. Indexing as new document.`);
            return await indexUserInElastic({ id, username, email, password_hash });
        }

        const updateResponse = await elasticClient.update({
            index: 'users',
            id: id.toString(),
            body: {
                doc: {
                    username,
                    email,
                    password_hash,
                },
            },
        });

        return updateResponse.result;
    } catch (error) {
        console.error('Error updating user in Elasticsearch:', error);
        throw new Error(`Failed to update user in Elasticsearch: ${error}`);
    }
};

export const deleteUserInElastic = async (id: number) => {
    try {
        const response = await elasticClient.delete({
            index: 'users',
            id: id.toString(),
        });
        return response.result;
    } catch (error) {
        console.error(`Error deleting user with ID ${id} in Elasticsearch:`, error);
        throw new Error(`Failed to delete user in Elasticsearch: ${error}`);
    }
};
