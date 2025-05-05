import { getRecentArticles, getAllArticles } from "../models/articleModel.js";


export async function fetchAllArticlesService(req, res) {
  // 获取所有文章（默认按日期降序排列）
  // const allArticles = await getAllArticles();

  // 获取特定平台的文章，限制10条
  // const qbitArticles = await getAllArticles({ 
  //   platform: 'qbit',
  //   limit: 10 
  // });

  // 获取特定标签的文章
  // const aiArticles = await getAllArticles({ tag: 'AI' });

  // 获取文章统计信息
  // const stats = await getArticlesStats();

  try {
    const allArticles = await getAllArticles();
    // 返回 JSON 响应
    res.json(success(allArticles, "获取文章成功"));
  } catch (error) {
    // 如果在爬取过程中发生错误，传递给错误处理中间件
    console.error("fetchAllArticles 出错:", error);
    // 或者直接返回错误响应
    res.status(500).json(fail("获取信息失败"));
  }
}


export async function getRecentAllPlatformArticlesService() {
  // 获取最近两周内的所有文章
  // const recentArticles = await getRecentArticles();

  // 获取最近一周内的文章
  // const lastWeekArticles = await getRecentArticles({ days: 7 });

  // 获取最近两周内的量子位文章
  // const recentQbitArticles = await getRecentArticles({ platform: 'qbitai' });

  // 获取最近两周内的特定标签文章，限制10条
  // const recentTaggedArticles = await getRecentArticles({ 
  //   tag: 'AI', 
  //   limit: 10 
  // });

  // 获取最近一个月内的文章，按评分排序
  // const topRatedArticles = await getRecentArticles({ 
  //   days: 30, 
  //   orderBy: 'score', 
  //   order: 'DESC' 
  // });


  // 获取最近 2 周所有的文章
  const allArticles = await getRecentArticles();



  return allArticles
}