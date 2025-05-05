import { Router } from 'express';
import { getQbitNews, getHuggingfaceNews, getAnthropicNews, getGoogleNews, getTwitterNews } from '../controllers/crawlersController.js';

export const router = Router();

router.get('/getQbitNews', getQbitNews);
router.get('/getHuggingfaceNews', getHuggingfaceNews);
router.get('/getAnthropicNews', getAnthropicNews);
router.get('/getGoogleNews', getGoogleNews);
router.get('/getTwitterNews', getTwitterNews);




