// Erasmo Cardoso 
import { PoolConnection } from 'mysql2/promise';

export const getAllMessages = async (conn: PoolConnection) => {
    const [rows] = await conn.query('SELECT * FROM messages');
    return rows;
};

export const createMessage = async (conn: PoolConnection, sender_id: number, receiver_id: number, message: string) => {
    const [result] = await conn.query(
        'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
        [sender_id, receiver_id, message]
    );
    return result;
};

export const updateMessage = async (conn: PoolConnection, id: number, message: string) => {
    await conn.query('UPDATE messages SET message = ? WHERE id = ?', [message, id]);
};

export const deleteMessage = async (conn: PoolConnection, id: number) => {
    await conn.query('DELETE FROM messages WHERE id = ?', [id]);
};
