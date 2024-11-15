//Erasmo Cardoso

import { Request, Response } from 'express';
import * as messageService from '../service/message';
import { createPool } from '../config/db';

const pool = createPool();
//  Search messages
export const getAllMessages = async (req: Request, res: Response) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const messages = await messageService.getAllMessages(conn);
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar mensagens.' });
    } finally {
        if (conn) conn.release();
    }
};

// Create messages
export const createMessage = async (req: Request, res: Response) => {
    const { sender_id, receiver_id, message } = req.body;
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await messageService.createMessage(conn, sender_id, receiver_id, message);
        res.status(201).json({ message: 'Mensagem criada com sucesso.', result });
    } catch (err) {
        console.error('Erro ao criar mensagem:', err);
        res.status(500).json({ error: 'Erro ao criar mensagem.' });
    } finally {
        if (conn) conn.release();
    }
};

// Update messages
export const updateMessage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { message } = req.body;
    let conn;
    try {
        conn = await pool.getConnection();
        await messageService.updateMessage(conn, parseInt(id), message);
        res.json({ message: 'Mensagem atualizada com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar mensagem.' });
    } finally {
        if (conn) conn.release();
    }
};

// Deletar messages
export const deleteMessage = async (req: Request, res: Response) => {
    const { id } = req.params;
    let conn;
    try {
        conn = await pool.getConnection();
        await messageService.deleteMessage(conn, parseInt(id));
        res.json({ message: 'Mensagem excluída com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao excluir mensagem.' });
    } finally {
        if (conn) conn.release();
    }
};
