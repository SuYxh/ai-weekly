import { success, fail } from "../utils/response.js";
import { resetArticlesTable, resetAllTables, getAllArticles } from "../models/articleModel.js";

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

export async function fetchAllArticles(req, res) {
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



