import express from 'express';
import { createUser, verifyUser  } from '../controllers/userController';

const router = express.Router();

router.post('/register', createUser);
router.post('/verify', verifyUser);

export default router;
