import { Router } from 'express';
import * as userController from '../controllers/userController';
import * as messageController from '../controllers/messageController';
import * as wsController from '../controllers/wsController';
import * as redisController from '../controllers/redisController';
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

// ============================ Teste Redis ============================
router.get('/redis', redisController.testRedisCache);

//============================= Rota Websocket============================
router.get('/wstest', wsController.testWebsocket);

export default router;
