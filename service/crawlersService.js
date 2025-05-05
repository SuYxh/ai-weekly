import { crawlQbitNews } from "../crawlers/index.js";
import { addQbitNewsBatch } from "../models/articleModel.js";




export async function getQbitNewsService(params) {
  // 调用爬虫函数，传递参数
  const newsArticles = await crawlQbitNews(params);

  if (params.storage === 1 && newsArticles?.length > 0) {
    // 批量添加文章
    await addQbitNewsBatch(newsArticles)   
  }

  return newsArticles
}
