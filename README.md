

​          

# AI Weekly

一个用于抓取、处理和展示 AI 相关资讯的项目。

## 功能特性

*   **资讯爬虫**: 目前支持抓取 [QbitAI](https://www.qbitai.com/) 网站的最新资讯。
*   **API 服务**: 提供 RESTful API 接口获取爬取的资讯数据。
*   **简单前端**: 一个基于 Vue.js 的静态页面，用于展示和筛选爬取的资讯。
*   **AI 集成 (占位)**: 包含了连接 OpenAI 和 Volcengine (火山引擎) 大模型的客户端，以及用于文本摘要、改写、翻译的服务框架。
*   **数据存储**: 使用 SQLite 存储数据（例如用户信息，尽管用户相关功能可能尚未完全实现）。
*   **模块化结构**: 代码按功能（爬虫、AI、控制器、路由、工具函数等）组织。

## 技术栈

*   **后端**: Node.js, Express.js
*   **爬虫**: Cheerio (用于 HTML 解析), node-fetch (用于 HTTP 请求)
*   **前端**: Vue.js (通过 CDN 引入), HTML, CSS
*   **数据库**: SQLite, sqlite3, sqlite
*   **开发工具**: nodemon (用于开发环境热重载), dotenv (用于环境变量管理)
*   **AI**: OpenAI API (已集成客户端), Volcengine API (已集成客户端)

## 安装与设置

1.  **克隆仓库**:
    ```bash
    git clone <your-repository-url>
    cd ai-weekly

2.  **安装依赖**: 推荐使用 pnpm (根据 `pnpm-lock.yaml` 文件判断)，如果未安装 pnpm，请先安装 `npm install -g pnpm`。
    ```bash
    pnpm install
    ```
    或者，如果使用 npm:
    ```bash
    npm install
    ```

3.  **配置环境变量**:
    *   复制 `.env.example` 文件为 `.env`：
        ```bash
        cp .env.example .env
        ```
    *   编辑 `.env` 文件，填入必要的 API 密钥等信息，例如：
        ```dotenv
        PORT=3000
        OPENAI_API_KEY=your_openai_api_key
        # VOLCENGINE_API_KEY=your_volcengine_api_key # 如果需要使用
        # ... 其他可能的配置
        ```

## 如何运行

*   **开发模式** (使用 nodemon 自动重启):
    ```bash
    npm run dev
    ```

*   **生产模式**:
    ```bash
    npm start
    ```

    服务启动后，默认监听在 `http://localhost:3000` (或你在 `.env` 文件中指定的端口)。

## 主要 API 端点

*   `GET /api/v1/crawlers/getQbitNews`: 获取 QbitAI 的新闻资讯。
    *   查询参数:
        *   `pages` (可选, 数字, 默认 1): 要抓取的页数。
        *   `perPage` (可选, 数字, 默认 20): 每页抓取的条数。
*   `GET /`: 基础欢迎接口。
*   `GET /api/v1/users`: 获取用户列表 (需要数据库和模型支持)。
*   `POST /api/v1/users`: 创建新用户 (需要数据库和模型支持)。

## 项目结构概览

```
ai-weekly/
├── ai/               # AI 相关功能 (客户端, Prompt, 服务)
│   ├── clients/      # AI 模型 API 客户端 (OpenAI, Volcengine)
│   ├── prompt/       # 系统 Prompt 定义
│   └── services/     # AI 应用服务 (摘要, 翻译等)
├── config/           # 配置文件 (如数据库配置)
├── controllers/      # Express 控制器 (处理请求逻辑)
├── crawlers/         # 爬虫相关代码
│   ├── data/         # 存储爬取的数据 (如 JSON 文件)
│   ├── services/     # 爬虫通用服务 (如 HTML 获取)
│   └── sites/        # 针对特定网站的爬虫实现
├── db/               # 数据库文件和初始化脚本
├── middlewares/      # Express 中间件 (日志, 错误处理)
├── models/           # 数据模型 (如用户模型)
├── public/           # 静态文件 (前端页面)
├── routes/           # Express 路由定义
├── utils/            # 通用工具函数 (文件操作, 响应格式化)
├── .env.example      # 环境变量示例文件
├── .gitignore        # Git 忽略配置
├── index.js          # 应用入口文件
├── package.json      # 项目依赖和脚本配置
└── README.md         # 项目说明文件
```

## 注意事项

*   爬虫依赖于目标网站的 HTML 结构，如果网站更新，爬虫代码可能需要相应调整。
*   请确保遵守目标网站的 `robots.txt` 规则和使用条款，避免过于频繁的请求。
*   AI 功能需要有效的 API 密钥才能正常工作。

​        