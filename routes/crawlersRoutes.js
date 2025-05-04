import { Router } from 'express';
import { getQbitNews } from '../controllers/crawlersController.js';

export const router = Router();

router.get('/getQbitNews', getQbitNews);
