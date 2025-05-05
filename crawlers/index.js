// 导入特定的爬虫
import { crawlQbitNews } from './sites/qbitai.js'
import { crawlHuggingfaceNews } from './sites/huggingface.js'
import { crawlAnthropicNews } from './sites/anthropic.js'


// 导入通用服务
import { fetchHtml } from './services/fetchHtml.js';


export {
  fetchHtml,
  // 量子位数据爬取
  crawlQbitNews,
  // Huggingface 数据爬取
  crawlHuggingfaceNews,
  // Anthropic 数据爬取
  crawlAnthropicNews
}