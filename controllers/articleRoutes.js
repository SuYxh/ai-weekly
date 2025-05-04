import { Router } from 'express';
import { insertArticle, getArticles } from '../models/articleModel.js';
import { success, fail } from '../utils/response.js';

export const router = Router();

router.get('/articleRoutes', async (req, res) => {
  try {
    const articles = await getArticles();
    res.json(success(articles));
  } catch (err) {
    res.status(500).json(fail(err.message));
  }
});

router.post('/articleRoutes', async (req, res) => {
  try {
    const article = req.body;
    await insertArticle(article);
    res.json(success({}, '文章入库成功'));
  } catch (err) {
    res.status(500).json(fail(err.message));
  }
});
