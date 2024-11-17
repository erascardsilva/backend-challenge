"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserInElastic = exports.updateUserInElastic = exports.indexUserInElastic = exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.createUser = void 0;
const elastic_1 = __importDefault(require("../config/elastic"));
// -------------------- CRUD MySQL --------------------
const createUser = async (conn, username, email, password_hash) => {
    try {
        const [result] = await conn.query('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, password_hash]);
        return result;
    }
    catch (error) {
        console.error('Error creating user in MySQL:', error);
        throw new Error('Failed to create user in MySQL');
    }
};
exports.createUser = createUser;
const getAllUsers = async (conn) => {
    const [rows] = await conn.query('SELECT * FROM users');
    return rows;
};
exports.getAllUsers = getAllUsers;
const updateUser = async (conn, id, username, email, password_hash) => {
    try {
        await conn.query('UPDATE users SET username = ?, email = ?, password_hash = ? WHERE id = ?', [username, email, password_hash, id]);
    }
    catch (error) {
        console.error('Error updating user in MySQL:', error);
        throw new Error('Failed to update user in MySQL');
    }
};
exports.updateUser = updateUser;
const deleteUser = async (conn, id) => {
    try {
        await conn.query('DELETE FROM users WHERE id = ?', [id]);
    }
    catch (error) {
        console.error('Error deleting user from MySQL:', error);
        throw new Error('Failed to delete user from MySQL');
    }
};
exports.deleteUser = deleteUser;
// -------------------- CRUD Elasticsearch --------------------
const indexUserInElastic = async (user) => {
    try {
        const response = await elastic_1.default.index({
            index: 'users',
            id: user.id.toString(),
            body: {
                username: user.username,
                email: user.email,
                password_hash: user.password_hash,
            },
        });
        return response.result;
    }
    catch (error) {
        console.error('Error indexing user in Elasticsearch:', error);
        throw new Error('Failed to index user in Elasticsearch');
    }
};
exports.indexUserInElastic = indexUserInElastic;
const updateUserInElastic = async (id, username, email, password_hash) => {
    try {
        const getResponse = await elastic_1.default.get({
            index: 'users',
            id: id.toString(),
        }).catch(() => null);
        if (getResponse === null) {
            console.warn(`Document with ID ${id} not found. Indexing as new document.`);
            return await (0, exports.indexUserInElastic)({ id, username, email, password_hash });
        }
        const updateResponse = await elastic_1.default.update({
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
    }
    catch (error) {
        console.error('Error updating user in Elasticsearch:', error);
        throw new Error(`Failed to update user in Elasticsearch: ${error}`);
    }
};
exports.updateUserInElastic = updateUserInElastic;
const deleteUserInElastic = async (id) => {
    try {
        const response = await elastic_1.default.delete({
            index: 'users',
            id: id.toString(),
        });
        return response.result;
    }
    catch (error) {
        console.error(`Error deleting user with ID ${id} in Elasticsearch:`, error);
        throw new Error(`Failed to delete user in Elasticsearch: ${error}`);
    }
};
exports.deleteUserInElastic = deleteUserInElastic;
//# sourceMappingURL=userService.js.map