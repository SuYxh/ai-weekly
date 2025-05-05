import { Router } from 'express';
import { cleanArticlesTable,fetchAllArticles, cleanAllTable } from '../controllers/articleController.js';

export const router = Router();

// 清空所有表并重置自增ID
router.get('/cleanAllTable', cleanAllTable);
// 清空文章表
router.get('/cleanArticlesTable', cleanArticlesTable);
// 获取所有文章
router.get('/fetchAllArticles', fetchAllArticles);



