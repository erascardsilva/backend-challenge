// Erasmo Cardoso 
import { Router } from 'express';
import * as userController from '../controllers/userController';
import * as messageController from '../controllers/messageController';

const router = Router();

// ============================ Router USERS ============================
router.get('/users', userController.getAllUsers);  
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// ============================ Router MESSAGES ============================
router.get('/messages', messageController.getAllMessages);
router.post('/messages', messageController.createMessage);
router.put('/messages/:id', messageController.updateMessage);
router.delete('/messages/:id', messageController.deleteMessage);

export default router;
