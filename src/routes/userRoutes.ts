import express from 'express';
import { createUser, deleteUserById, getUserById, loginUser, verifyUser, updateUserById  } from '../controllers/userController';

const router = express.Router();

router.post('/register', createUser);
router.post('/verify', verifyUser);
router.get('/user/:id', getUserById);
router.delete('/user/:id', deleteUserById);
router.put('/user/:id', updateUserById);
router.post('/login', loginUser);

export default router;
