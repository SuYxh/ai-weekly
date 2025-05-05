// 国内平台
import { crawlQbitNews } from './sites/qbitai.js'
// 国外平台
import { crawlHuggingfaceNews } from './sites/huggingface.js'
import { crawlAnthropicNews } from './sites/anthropic.js'
import { crawlGoogleNews } from './sites/google.js'


// 导入通用服务
import { fetchHtml } from './services/fetchHtml.js';


export {
  fetchHtml,
  // 量子位数据爬取
  crawlQbitNews,
  // Huggingface 数据爬取
  crawlHuggingfaceNews,
  // Anthropic 数据爬取
  crawlAnthropicNews,
  // Google 数据爬取
  crawlGoogleNews
}