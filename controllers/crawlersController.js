import { getQbitNewsService, getHuggingfaceNewsService, getAnthropicNewsService, getGoogleNewsService, getTwitterNewsService } from "../service/crawlersService.js";
import { crawlAllPlatforms } from "../crawlers/tasks/crawlAll.js";
import { success, fail } from "../utils/response.js";
import { testMailer } from "../utils/mailer.js";

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

export async function getGoogleNews(req, res) {
  // 添加 next 用于错误处理
  try {
    // 从 req.query 获取参数，并提供默认值。使用 parseInt 确保它们是数字，如果解析失败或未提供，则使用默认值
    const storage = parseInt(req.query.storage, 10) || 1;
    const maxPages = parseInt(req.query.maxPages, 10) || 1;

    console.log("getGoogleNews 参数:", { maxPages, storage });

    const newsArticles = await getGoogleNewsService({ maxPages, storage });

    // 返回 JSON 响应
    res.json(success(newsArticles, "获取成功"));
  } catch (error) {
    // 如果在爬取过程中发生错误，传递给错误处理中间件
    console.error("获取 getGoogleNews 时出错:", error);
    // 或者直接返回错误响应
    res.status(500).json(fail("获取信息失败"));
  }
}


export async function getTwitterNews(req, res) {
  // 添加 next 用于错误处理
  try {
    // 从 req.query 获取参数，并提供默认值。使用 parseInt 确保它们是数字，如果解析失败或未提供，则使用默认值
    const storage = parseInt(req.query.storage, 10) || 1;

    console.log("getTwitterNews 参数:", { storage });

    const newsArticles = await getTwitterNewsService({ storage });

    // 返回 JSON 响应
    res.json(success(newsArticles, "获取成功"));
  } catch (error) {
    // 如果在爬取过程中发生错误，传递给错误处理中间件
    console.error("获取 getTwitterNews 时出错:", error);
    // 或者直接返回错误响应
    res.status(500).json(fail("获取信息失败"));
  }
}


export async function startAllCrawlers(req, res) {
  try {
    console.log("startAllCrawlers！！！");

    // 执行爬虫
    crawlAllPlatforms();

    // 返回 JSON 响应
    res.json(success({}, "数据爬取任务已经开始，结束后通过邮件告知"));
  } catch (error) {
    // 如果在爬取过程中发生错误，传递给错误处理中间件
    console.error("获取 startAllCrawlers 时出错:", error);
    // 或者直接返回错误响应
    res.status(500).json(fail("获取信息失败"));
  }
}

export async function sendTestCrawlReport(req, res) {
  try {
    console.log("sendTestCrawlReport 开始执行");

    // 发送测试邮件
    testMailer();

    // 返回 JSON 响应
    res.json(success({}, "邮件已发送，请注意查收"));
  } catch (error) {
    // 如果在爬取过程中发生错误，传递给错误处理中间件
    console.error("sendTestCrawlReport 时出错:", error);
    // 或者直接返回错误响应
    res.status(500).json(fail("获取信息失败"));
  }
}