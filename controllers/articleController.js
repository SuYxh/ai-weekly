import { success, fail } from "../utils/response.js";
import { resetArticlesTable, resetAllTables } from "../models/articleModel.js";
import { fetchAllArticlesService, getRecentAllPlatformArticlesService } from "../service/articleService.js";
import { groupArticlesByField, enhanceGroupedArticles } from "../utils/index.js";

export async function fetchAllArticles(req, res) {
  try {
    const allArticles = await fetchAllArticlesService();
    // 返回 JSON 响应
    res.json(success(allArticles, "获取文章成功"));
  } catch (error) {
    // 如果在爬取过程中发生错误，传递给错误处理中间件
    console.error("fetchAllArticles 出错:", error);
    // 或者直接返回错误响应
    res.status(500).json(fail("获取信息失败"));
  }
}

// 获取最近 2 周的全部数据
export async function fetchRecentArticles(req, res) {
  try {
    const recentArticles = await getRecentAllPlatformArticlesService();
    // 返回 JSON 响应
    res.json(success(recentArticles, "获取文章成功"));
  } catch (error) {
    // 如果在爬取过程中发生错误，传递给错误处理中间件
    console.error("fetchRecentArticles 出错:", error);
    // 或者直接返回错误响应
    res.status(500).json(fail("获取信息失败"));
  }
}

// 获取周刊数据
export async function fetchWeeklyArticles(req, res) {
  try {
    const recentArticles = await getRecentAllPlatformArticlesService();
    
    const weeklyArticles = recentArticles.filter(item => item.isWeekly === 1)

    const goodsArticles = recentArticles.filter(item => item.score >= 4)
    
    console.log(`最近2周共计有文章 ${recentArticles.length} 篇, 其中周刊有 ${weeklyArticles.length} 篇， 高评分的有 ${goodsArticles.length} 篇`)
    
    // 返回 JSON 响应
    res.json(success(goodsArticles, "获取文章成功"));
  } catch (error) {
    // 如果在爬取过程中发生错误，传递给错误处理中间件
    console.error("fetchRecentArticles 出错:", error);
    // 或者直接返回错误响应
    res.status(500).json(fail("获取信息失败"));
  }
}

// 获取周刊数据-分组后的数据
export async function fetchGroupWeeklyArticles(req, res) {
  try {
    const recentArticles = await getRecentAllPlatformArticlesService();
    
    const weeklyArticles = recentArticles.filter(item => item.isWeekly === 1)

    const goodsArticles = recentArticles.filter(item => item.score >= 4)
    
    const groupArticles = groupArticlesByField(goodsArticles)

    console.log(`最近2周共计有文章 ${recentArticles.length} 篇, 其中周刊有 ${weeklyArticles.length} 篇， 高评分的有 ${goodsArticles.length} 篇`)
    
    // 返回 JSON 响应
    res.json(success(groupArticles, "获取文章成功"));
  } catch (error) {
    // 如果在爬取过程中发生错误，传递给错误处理中间件
    console.error("fetchRecentArticles 出错:", error);
    // 或者直接返回错误响应
    res.status(500).json(fail("获取信息失败"));
  }
}

export async function fetchGroupWeeklyArticlesForCoze(req, res) {
  try {
    const recentArticles = await getRecentAllPlatformArticlesService();
    
    const weeklyArticles = recentArticles.filter(item => item.isWeekly === 1)

    const goodsArticles = recentArticles.filter(item => item.score >= 4)
    
    const groupArticles = groupArticlesByField(goodsArticles)

    const enhanceArticles = enhanceGroupedArticles(groupArticles)

    console.log(`最近2周共计有文章 ${recentArticles.length} 篇, 其中周刊有 ${weeklyArticles.length} 篇， 高评分的有 ${goodsArticles.length} 篇`)
    
    // 返回 JSON 响应
    res.json(success(enhanceArticles, "获取文章成功"));
  } catch (error) {
    // 如果在爬取过程中发生错误，传递给错误处理中间件
    console.error("fetchGroupWeeklyArticlesForCoze 出错:", error);
    // 或者直接返回错误响应
    res.status(500).json(fail("获取信息失败"));
  }
}

export async function cleanAllTable(req, res) {
  try {
    const message = await resetAllTables();
    // 返回 JSON 响应
    res.json(success({}, message));
  } catch (error) {
    // 如果在爬取过程中发生错误，传递给错误处理中间件
    console.error("cleanAllTable 出错:", error);
    // 或者直接返回错误响应
    res.status(500).json(fail("获取信息失败"));
  }
}

export async function cleanArticlesTable(req, res) {
  try {
    const message = await resetArticlesTable();
    // 返回 JSON 响应
    res.json(success({}, message));
  } catch (error) {
    // 如果在爬取过程中发生错误，传递给错误处理中间件
    console.error("cleanArticlesTable 出错:", error);
    // 或者直接返回错误响应
    res.status(500).json(fail("获取信息失败"));
  }
}





