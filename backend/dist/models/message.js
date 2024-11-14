"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.updateMessage = exports.createMessage = exports.getAllMessages = void 0;
const getAllMessages = async (conn) => {
    const [rows] = await conn.query('SELECT * FROM messages');
    return rows;
};
exports.getAllMessages = getAllMessages;
const createMessage = async (conn, sender_id, receiver_id, message) => {
    const [result] = await conn.query('INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)', [sender_id, receiver_id, message]);
    return result;
};
exports.createMessage = createMessage;
const updateMessage = async (conn, id, message) => {
    await conn.query('UPDATE messages SET message = ? WHERE id = ?', [message, id]);
};
exports.updateMessage = updateMessage;
const deleteMessage = async (conn, id) => {
    await conn.query('DELETE FROM messages WHERE id = ?', [id]);
};
exports.deleteMessage = deleteMessage;
