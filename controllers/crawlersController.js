import { crawlQbitNews } from "../crawlers/index.js";
import { success, fail } from "../utils/response.js";

export async function getQbitNews(req, res, next) {
  // 添加 next 用于错误处理
  try {
    // 从 req.query 获取参数，并提供默认值
    // 使用 parseInt 确保它们是数字，如果解析失败或未提供，则使用默认值
    const pages = parseInt(req.query.pages, 10) || 1;
    const perPage = parseInt(req.query.perPage, 10) || 20;
    console.log("获取 Qbit News 参数:", { pages, perPage });

    // 调用爬虫函数，传递参数
    const newsArticles = await crawlQbitNews({ pages, perPage });

    // 返回 JSON 响应
    res.json(success(newsArticles, "获取成功"));
  } catch (error) {
    // 如果在爬取过程中发生错误，传递给错误处理中间件
    console.error("获取 Qbit News 时出错:", error);
    // 可以选择传递错误给 Express 的错误处理中间件
    // next(error);
    // 或者直接返回错误响应
    res.status(500).json(fail("获取信息失败"));
  }
}
