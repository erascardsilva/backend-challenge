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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getAllUsers = void 0;
const db_1 = require("../config/db");
const userService = __importStar(require("../service/userService"));
const pool = (0, db_1.createPool)();
const getAllUsers = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const users = await userService.getAllUsers(conn);
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
        await conn.beginTransaction(); //  transação
        // Criar o usuário 
        const result = await userService.createUser(conn, username, email, password_hash);
        //cria um objeto do tipo User
        const newUser = {
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
    }
    catch (err) {
        if (conn)
            await conn.rollback(); // Rollback err
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
    }
    catch (err) {
        if (conn)
            await conn.rollback(); // Rollback errrrr
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
    }
    catch (err) {
        if (conn)
            await conn.rollback(); // Rollback errrr
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map