import { Router } from 'express';
import { getUsers, createUser } from '../controllers/userController.js';

export const router = Router();

router.get('/', getUsers);
router.post('/', createUser);
