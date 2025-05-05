import { Router } from 'express';
import { getQbitNews, getHuggingfaceNews, getAnthropicNews } from '../controllers/crawlersController.js';

export const router = Router();

router.get('/getQbitNews', getQbitNews);
router.get('/getHuggingfaceNews', getHuggingfaceNews);
router.get('/getAnthropicNews', getAnthropicNews);


