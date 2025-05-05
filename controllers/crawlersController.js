import { getQbitNewsService, getHuggingfaceNewsService, getAnthropicNewsService } from "../service/crawlersService.js";
import { success, fail } from "../utils/response.js";

export async function getQbitNews(req, res) {
  // 添加 next 用于错误处理
  try {
    // 从 req.query 获取参数，并提供默认值。使用 parseInt 确保它们是数字，如果解析失败或未提供，则使用默认值
    const pages = parseInt(req.query.pages, 10) || 1;
    const perPage = parseInt(req.query.perPage, 10) || 20;
    const storage = parseInt(req.query.storage, 10) || 1;
    console.log("getQbitNews 参数:", { pages, perPage });

    const newsArticles = await getQbitNewsService({ pages, perPage, storage });

    // 返回 JSON 响应
    res.json(success(newsArticles, "获取成功"));
  } catch (error) {
    // 如果在爬取过程中发生错误，传递给错误处理中间件
    console.error("获取 Qbit News 时出错:", error);
    // 或者直接返回错误响应
    res.status(500).json(fail("获取信息失败"));
  }
}

export async function getHuggingfaceNews(req, res) {
  // 添加 next 用于错误处理
  try {
    // 从 req.query 获取参数，并提供默认值。使用 parseInt 确保它们是数字，如果解析失败或未提供，则使用默认值
    const skip = parseInt(req.query.skip, 10) || 0;
    const storage = parseInt(req.query.storage, 10) || 1;
    console.log("getHuggingfaceNews 参数:", { skip, storage });

    const newsArticles = await getHuggingfaceNewsService({ skip, storage });

    // 返回 JSON 响应
    res.json(success(newsArticles, "获取成功"));
  } catch (error) {
    // 如果在爬取过程中发生错误，传递给错误处理中间件
    console.error("获取 getHuggingfaceNews 时出错:", error);
    // 或者直接返回错误响应
    res.status(500).json(fail("获取信息失败"));
  }
}

export async function getAnthropicNews(req, res) {
  // 添加 next 用于错误处理
  try {
    // 从 req.query 获取参数，并提供默认值。使用 parseInt 确保它们是数字，如果解析失败或未提供，则使用默认值
    const storage = parseInt(req.query.storage, 10) || 1;
    console.log("getAnthropicNews 参数:", { storage });

    const newsArticles = await getAnthropicNewsService({ storage });

    // 返回 JSON 响应
    res.json(success(newsArticles, "获取成功"));
  } catch (error) {
    // 如果在爬取过程中发生错误，传递给错误处理中间件
    console.error("获取 getAnthropicNews 时出错:", error);
    // 或者直接返回错误响应
    res.status(500).json(fail("获取信息失败"));
  }
}
