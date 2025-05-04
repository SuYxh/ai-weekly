import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'
import { fileURLToPath } from 'url';

import { router as indexRouter } from './routes/index.js';
import { router as usersRouter } from './routes/userRoutes.js';
import { router as crawlersRouter } from './routes/crawlersRoutes.js'
import { initDb } from './db/init.js'
import errorHandler from './middlewares/errorHandler.js';
import logger from './middlewares/logger.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ 允许跨域请求
app.use(cors({
  // origin: 'http://localhost:5173',
  // credentials: true,         // 如果你需要发送 Cookie 或身份验证头
  // methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// 解析请求体（JSON 等）
app.use(express.json());
// ✅ 解析 application/x-www-form-urlencoded 请求体（常见于表单提交）
app.use(express.urlencoded({ extended: true }));

// 🔍 注册日志中间件（在所有路由前）
app.use(logger);

// 路由（先挂 API）
app.use('/api', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/crawlers', crawlersRouter);

// 静态文件（仅用于非 API 的前端页面或资源）
app.use(express.static(path.join(__dirname, 'public')));

// 错误处理器（放最后）
app.use(errorHandler);

// 启动
async function main() {
  await initDb();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
}

main().catch(console.error);