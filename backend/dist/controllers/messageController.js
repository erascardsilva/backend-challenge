"use strict";
//Erasmo Cardoso
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
exports.deleteMessage = exports.updateMessage = exports.createMessage = exports.getAllMessages = void 0;
const messageService = __importStar(require("../service/message"));
const db_1 = require("../config/db");
const pool = (0, db_1.createPool)();
//  Search messages
const getAllMessages = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const messages = await messageService.getAllMessages(conn);
        res.json(messages);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar mensagens.' });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.getAllMessages = getAllMessages;
// Create messages
const createMessage = async (req, res) => {
    const { sender_id, receiver_id, message } = req.body;
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await messageService.createMessage(conn, sender_id, receiver_id, message);
        res.status(201).json({ message: 'Mensagem criada com sucesso.', result });
    }
    catch (err) {
        console.error('Erro ao criar mensagem:', err);
        res.status(500).json({ error: 'Erro ao criar mensagem.' });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.createMessage = createMessage;
// Update messages
const updateMessage = async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    let conn;
    try {
        conn = await pool.getConnection();
        await messageService.updateMessage(conn, parseInt(id), message);
        res.json({ message: 'Mensagem atualizada com sucesso.' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar mensagem.' });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.updateMessage = updateMessage;
// Deletar messages
const deleteMessage = async (req, res) => {
    const { id } = req.params;
    let conn;
    try {
        conn = await pool.getConnection();
        await messageService.deleteMessage(conn, parseInt(id));
        res.json({ message: 'Mensagem excluída com sucesso.' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao excluir mensagem.' });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.deleteMessage = deleteMessage;
//# sourceMappingURL=messageController.js.map