在这个项目中加入爬虫功能，特别是用于抓取文章类内容（例如 AI 行业资讯等），推荐你为爬虫相关逻辑单独创建一个清晰的目录结构，以便：

- 避免和 Web API 逻辑耦合；
- 支持复用、调度和扩展；
- 后续支持计划任务、队列、数据清洗等更复杂的处理流程。

------

## ✅ 推荐目录结构（适用于你现在的 Express 项目）：

```
my-express-app/
├── crawlers/                  # 🔍 爬虫主目录
│   ├── index.mjs              # 爬虫入口或调度器
│   ├── sites/                 # 各网站专属爬虫模块
│   │   ├── anthropic.mjs      # 示例：抓取 Anthropic 新闻
│   │   ├── huggingface.mjs
│   │   └── producthunt.mjs
│   ├── services/              # 通用逻辑，如请求器、解析器、存储等
│   │   ├── fetchHtml.mjs
│   │   └── parseArticle.mjs
│   └── tasks/                 # 定时任务入口或批量任务
│       └── crawlAll.mjs
```

------

## 📌 各目录职责简述：

| 目录/文件            | 用途说明                                                 |
| -------------------- | -------------------------------------------------------- |
| `crawlers/`          | 总入口，建议加一个统一调度器（例如抓所有文章、批处理等） |
| `crawlers/sites/`    | 每个网站一个模块，便于维护各自逻辑（不同 HTML 结构）     |
| `crawlers/services/` | 工具函数，如请求封装、解析器、去重、日志等               |
| `crawlers/tasks/`    | 支持后续自动化或计划任务（如定时抓取）                   |

------

## ✅ 示例代码：`crawlers/sites/anthropic.mjs`

```js
import { fetchHtml } from '../services/fetchHtml.mjs';
import cheerio from 'cheerio';

export async function crawlAnthropicNews() {
  const html = await fetchHtml('https://www.anthropic.com/news');
  const $ = cheerio.load(html);

  const articles = [];

  $('.ArticleCard').each((_, el) => {
    const title = $(el).find('h2').text().trim();
    const url = 'https://www.anthropic.com' + $(el).find('a').attr('href');
    articles.push({ title, url });
  });

  return articles;
}
```

------

## ✅ 示例通用请求器：`crawlers/services/fetchHtml.mjs`

```js
import fetch from 'node-fetch';

export async function fetchHtml(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.text();
}
```

------

## ✅ 示例统一入口：`crawlers/index.mjs`

```js
import { crawlAnthropicNews } from './sites/anthropic.mjs';

const data = await crawlAnthropicNews();
console.log(data);
```





## ✅ 统一结构

```
 {
 		id: "",
 		// 作者
 		author: "",
    // 标题
    "title": "3B模型逆袭7B巨头！Video-XL-Pro突破长视频理解极限，大海捞针准确率超98%",
    // 处理后的内容
    content: "",
    // 原始内容
    rawContent: "",
    // 地址
    "link": "https://www.qbitai.com/2025/05/279960.html",
    // 日期：希望是  2025-04-04 23:38:09 这种格式
    "date": "49分钟前",
    // 文章摘要
    "summary": "单卡可处理近万帧视频，超长视频理解新SOTA",
    // 媒体资源
    "media": [
    	{
        "type": "video",
        "url": "https://video.twimg.com/amplify_video/1893245395435745280/vid/avc1/720x960/qpKe9FBZPY1-ZJ10.mp4?tag=16"
      },
      {
        "type": "photo",
        "url": "https://www.qbitai.com/wp-content/uploads/2025/05/WX20250504-223638@2x-e1746369954406.png"
      }
    ]
    // 分类
    category: ["Product"]
		// 标签
    "tags": [
      "上海交通大学",
      "大海捞针",
      "视频理解"
    ],
    // 平台
    platform: ""
    
  },
```

