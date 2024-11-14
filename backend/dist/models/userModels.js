"use strict";
// Erasmo Cardoso
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getAllUsers = void 0;
const elastic_1 = __importDefault(require("../config/elastic"));
const getAllUsers = async (conn) => {
    // Simples consulta ao banco de dados sem cache no Redis
    const [rows] = await conn.query('SELECT * FROM users');
    return rows;
};
exports.getAllUsers = getAllUsers;
const createUser = async (conn, username, email, password_hash) => {
    const [result] = await conn.query('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, password_hash]);
    // Indexando o usuário no Elasticsearch
    await elastic_1.default.index({
        index: 'users',
        body: {
            username,
            email
        }
    });
    return result;
};
exports.createUser = createUser;
const updateUser = async (conn, id, username, email) => {
    // Atualizando o usuário no banco de dados
    await conn.query('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, id]);
    // Atualizando o usuário no Elasticsearch
    await elastic_1.default.update({
        index: 'users',
        id: id.toString(),
        body: {
            doc: {
                username,
                email
            }
        }
    });
};
exports.updateUser = updateUser;
const deleteUser = async (conn, id) => {
    // Deletando o usuário do banco de dados
    await conn.query('DELETE FROM users WHERE id = ?', [id]);
    // Deletando o usuário do Elasticsearch
    await elastic_1.default.delete({
        index: 'users',
        id: id.toString()
    });
};
exports.deleteUser = deleteUser;
