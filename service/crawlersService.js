import { crawlQbitNews, crawlHuggingfaceNews, crawlAnthropicNews, crawlGoogleNews, crawlTwitterNews } from "../crawlers/index.js";
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

export async function getHuggingfaceNewsService(params) {
  // 调用爬虫函数，传递参数
  const newsArticles = await crawlHuggingfaceNews({ skip: params.skip });

  if (params.storage === 1 && newsArticles?.length > 0) {
    // 批量添加文章
    await addQbitNewsBatch(newsArticles)   
  }

  return newsArticles
}


export async function getAnthropicNewsService(params) {
  // 调用爬虫函数，传递参数
  const newsArticles = await crawlAnthropicNews();

  if (params.storage === 1 && newsArticles?.length > 0) {
    // 批量添加文章
    await addQbitNewsBatch(newsArticles)   
  }

  return newsArticles
}


export async function getGoogleNewsService(params) {
  // 调用爬虫函数，传递参数
  const newsArticles = await crawlGoogleNews({ maxPages: params.maxPages });

  if (params.storage === 1 && newsArticles?.length > 0) {
    // 批量添加文章
    await addQbitNewsBatch(newsArticles)   
  }

  return newsArticles
}

export async function getTwitterNewsService(params) {
  // 调用爬虫函数，传递参数
  const newsArticles = await crawlTwitterNews();

  if (params.storage === 1 && newsArticles?.length > 0) {
    // 批量添加文章
    await addQbitNewsBatch(newsArticles)   
  }

  return newsArticles
}