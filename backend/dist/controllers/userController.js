"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getAllUsers = void 0;
const userModel = __importStar(require("../models/userModels"));
const db_1 = require("../config/db");
const elastic_1 = __importDefault(require("../config/elastic"));
const pool = (0, db_1.createPool)();
const getAllUsers = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        // Buscar os usuários diretamente no banco de dados
        const users = await userModel.getAllUsers(conn);
        res.json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.getAllUsers = getAllUsers;
const createUser = async (req, res) => {
    const { username, email, password_hash } = req.body;
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await userModel.createUser(conn, username, email, password_hash);
        // Indexar o novo usuário no Elasticsearch
        await elastic_1.default.index({
            index: 'users', // Nome do índice
            body: {
                username,
                email
            }
        });
        res.status(201).json({ message: 'Usuário criado com sucesso.', result });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar usuário.' });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;
    let conn;
    try {
        conn = await pool.getConnection();
        await userModel.updateUser(conn, parseInt(id), username, email);
        // Atualizar no Elasticsearch
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
        res.json({ message: 'Usuário atualizado com sucesso.' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    let conn;
    try {
        conn = await pool.getConnection();
        await userModel.deleteUser(conn, parseInt(id));
        // Deletar o usuário do Elasticsearch
        await elastic_1.default.delete({
            index: 'users',
            id: id.toString()
        });
        res.json({ message: 'Usuário excluído com sucesso.' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao excluir usuário.' });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.deleteUser = deleteUser;
