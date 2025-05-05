import { Router } from 'express';
import { cleanArticlesTable,fetchAllArticles } from '../controllers/articleController.js';

export const router = Router();

// 清空文章表
router.get('/cleanArticlesTable', cleanArticlesTable);
// 获取所有文章
router.get('/fetchAllArticles', fetchAllArticles);

