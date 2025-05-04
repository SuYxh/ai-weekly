// 导入特定的爬虫
import { crawlQbitNews } from './sites/qbitai.js'
// 导入通用服务
import { fetchHtml } from './services/fetchHtml.js';


export {
  fetchHtml,
  // 量子位数据爬取
  crawlQbitNews,
}