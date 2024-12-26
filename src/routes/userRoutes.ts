import express from 'express';
import { createUser, deleteUserById, getUserById, verifyUser, updateUserById  } from '../controllers/userController';

const router = express.Router();

router.post('/register', createUser);
router.post('/verify', verifyUser);
router.get('/user/:id', getUserById);
router.delete('/user/:id', deleteUserById);
router.put('/user/:id', updateUserById);

export default router;
