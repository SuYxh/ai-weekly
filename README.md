
# AI 周刊项目

## 项目简介

AI 周刊是一个专注于收集、整理和展示人工智能领域最新动态的平台。本项目通过爬取多个权威 AI 资讯来源（如 Google、OpenAI、Anthropic、HuggingFace、量子位等），对内容进行分类、整理，并以周刊形式呈现给用户，帮助大家及时了解 AI 领域的前沿发展。



![index](https://qn.huat.xyz/mac/202505061242857.png)



![explain](https://qn.huat.xyz/mac/202505061240781.png)



## 项目特点

- **多源数据采集**：自动爬取多个权威 AI 资讯平台的最新内容
- **智能内容分类**：使用 AI 技术对文章进行分类和标记
- **精美静态页面**：提供用户友好的阅读界面
- **定期更新机制**：通过调度系统实现自动化内容更新
- **多语言支持**：支持中英文内容处理

## 项目结构

```
ai-weekly/
├── ai/                    # AI 相关功能模块
│   ├── clients/           # AI 服务客户端（OpenAI、火山引擎等）
│   ├── prompt/            # 提示词模板
│   └── services/          # AI 服务（分类、重写、摘要、翻译）
├── config/                # 配置文件
├── controllers/           # 控制器
├── crawlers/              # 爬虫模块
│   ├── data/              # 爬取的原始数据
│   ├── services/          # 爬虫服务
│   ├── sites/             # 各站点爬虫实现
│   └── tasks/             # 爬虫任务
├── db/                    # 数据库相关
├── middlewares/           # 中间件
├── models/                # 数据模型
├── routes/                # 路由
├── schedule/              # 定时任务
├── service/               # 业务服务
├── static-page/           # 静态页面
│   ├── public/            # 公共资源
│   └── src/               # 前端源码
└── utils/                 # 工具函数
```

## 核心功能模块

### 1. 爬虫系统 (crawlers/)

负责从各大 AI 资讯平台获取最新内容，支持的平台包括：
- Google AI
- Anthropic
- HuggingFace
- 量子位
- Twitter/X
- Product Hunt

### 2. AI 处理模块 (ai/)

利用大语言模型对爬取的内容进行：
- 内容分类
- 文章摘要生成
- 内容重写
- 多语言翻译

### 3. 数据管理 (db/)

使用 SQLite 数据库存储和管理文章数据，支持：
- 文章存储与检索
- 数据备份
- 模式更新

### 4. 静态页面展示 (static-page/)

基于现代前端技术构建的展示界面，提供：
- 响应式设计，适配各种设备
- 分类浏览功能
- 文章详情展示
- 入选说明页面

## 内容分类标准

AI 周刊对文章进行以下分类：

- **🚀 highlight_tech / 技术亮点**：有显著技术创新或突破点，展示方法、架构、论文成果等
- **📊 model_progress / 模型进展**：模型能力更新，SOTA 结果、训练效率优化、评估表现等
- **🧩 product_update / 产品更新**：新产品、新功能上线，如 Claude、ChatGPT 等平台集成或体验优化
- **🧠 safety_alignment / 安全与对齐**：涉及 AI 安全性、伦理问题、对齐策略、政策管控等
- **🗞️ company_news / 公司动态**：公司级别的重要声明、合作、裁员、开源动态、投资消息等

## 入选原则

文章入选 AI 周刊的评判维度：

- **📢 来源可信度**：官方机构、知名研究团队、主流媒体
- **🧠 技术深度**：有明确成果、论文、发布内容（如新模型、新框架）
- **📡 行业趋势**：体现大方向：多模态、开源、AI 社会影响等
- **📊 数据可靠性**：引用实验证据、性能指标等
- **🧩 实用性/产品化**：有开发者可用资源，如 API、工具、框架发布
- **🔥 话题热度/争议性**：具讨论度/观点冲突，可配合背景材料适当选用

## 安装与使用

### 环境要求

- Node.js 16+
- npm 或 pnpm

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/yourusername/ai-weekly.git
cd ai-weekly
```

2. 安装依赖
```bash
pnpm install
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填入必要的 API 密钥和配置
```

4. 初始化数据库
```bash
node db/init.js
```

### 运行项目

1. 启动爬虫任务
```bash
node crawlers/tasks/crawlAll.js
```

2. 启动 Web 服务
```bash
node index.js
```

3. 构建静态页面
```bash
cd static-page
pnpm build
```

## 定时任务

项目使用 Node.js 的调度系统自动执行以下任务：

- 每日爬取最新 AI 资讯
- 每周生成周刊内容
- 定期数据库备份

## 贡献指南

欢迎对 AI 周刊项目做出贡献！您可以通过以下方式参与：

1. 提交 Issue 报告 bug 或提出新功能建议
2. 提交 Pull Request 改进代码
3. 完善文档
4. 分享项目给更多人

## 联系方式

- 邮箱：y170088888@163.com
- 微信公众号：AI周刊【暂无】

## 许可证

本项目采用 [待定] 许可证。
