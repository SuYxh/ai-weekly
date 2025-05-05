import { Router } from 'express';
import { getQbitNews, getHuggingfaceNews } from '../controllers/crawlersController.js';

export const router = Router();

router.get('/getQbitNews', getQbitNews);
router.get('/getHuggingfaceNews', getHuggingfaceNews);

