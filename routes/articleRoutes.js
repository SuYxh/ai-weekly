import { Router } from 'express';
import { cleanArticlesTable,fetchAllArticles, cleanAllTable, fetchRecentArticles, fetchWeeklyArticles, fetchGroupWeeklyArticles } from '../controllers/articleController.js';

export const router = Router();

// 清空所有表并重置自增ID
router.get('/cleanAllTable', cleanAllTable);
// 清空文章表
router.get('/cleanArticlesTable', cleanArticlesTable);
// 获取所有文章
router.get('/fetchAllArticles', fetchAllArticles);
// 获取最近 2 周的文章
router.get('/fetchRecentArticles', fetchRecentArticles);
// 获取周刊
router.get('/fetchWeeklyArticles', fetchWeeklyArticles);
// 获取周刊-分组
router.get('/fetchGroupWeeklyArticles', fetchGroupWeeklyArticles);






