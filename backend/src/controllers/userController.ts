// Erasmo Cardoso 
import { Request, Response } from 'express';
import * as userModel from '../models/user';
import { createPool } from '../config/db';

const pool = createPool();

export const getAllUsers = async (req: Request, res: Response) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const users = await userModel.getAllUsers(conn);
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar usuários.' });
    } finally {
        if (conn) conn.release();
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { username, email, password_hash } = req.body;
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await userModel.createUser(conn, username, email, password_hash);
        res.status(201).json({ message: 'Usuário criado com sucesso.', result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar usuário.' });
    } finally {
        if (conn) conn.release();
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, email } = req.body;
    let conn;
    try {
        conn = await pool.getConnection();
        await userModel.updateUser(conn, parseInt(id), username, email);
        res.json({ message: 'Usuário atualizado com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    } finally {
        if (conn) conn.release();
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    let conn;
    try {
        conn = await pool.getConnection();
        await userModel.deleteUser(conn, parseInt(id));
        res.json({ message: 'Usuário excluído com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao excluir usuário.' });
    } finally {
        if (conn) conn.release();
    }
};
