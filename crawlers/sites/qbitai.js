import { createRequire } from "module";
import { fetchHtml, formatArticleData, generateArticleFile, generateHtmlFile } from '../services/index.js'
import { generateArticleId, parseDateString, filterRecentNews, writeFileContent, resolvePathFromMeta, mergeGptWithArticles } from "../../utils/index.js";
import { classifyArticleListForWeekly } from "../../ai/services/classifyArticleListForWeekly.js";
const require = createRequire(import.meta.url);
const cheerio = require("cheerio");

const BASE_URL = "https://www.qbitai.com/category/%E8%B5%84%E8%AE%AF?page=";
const PLATFORM = 'qbitai'

export async function fetchOnePage(page = 1, perPage = 10) {
  const html = await fetchHtml(`${BASE_URL}${page}`);

  // 记录一下 html 结构
  await generateHtmlFile({ platform: PLATFORM, html })

  const $ = cheerio.load(html);
  const articles = [];

  $(".picture_text").each((index, el) => {
    if (index >= perPage) return;

    const title = $(el).find(".text_box h4 a").text().trim();
    const link = $(el).find(".text_box h4 a").attr("href");
    const summary = $(el).find(".text_box p").text().trim();
    const date = $(el).find(".info .time").text().trim();
    const authorElement = $(el).find(".info .author a");
    const authorName = authorElement.text().trim();

    // ✅ 图片提取：picture 下 img 标签的 src 属性
    const img = $(el).find(".picture img").attr("src");

    // ✅ 标签提取：tags_s 下所有 a 标签文本
    const tags = [];
    $(el)
      .find(".tags_s a")
      .each((_, tagEl) => {
        const tagText = $(tagEl).text().trim();
        if (tagText) tags.push(tagText);
      });

    if (title && link) {
      articles.push(formatArticleData({
        id: generateArticleId(),
        author: authorName,
        avatar: '',
        title, link, 
        date: parseDateString(date), 
        summary, 
        img, 
        tags, 
        platform: PLATFORM
      }));
    }
  });

  return articles;
}

export async function crawlQbitNews({ pages = 1, perPage = 20 }) {
  console.log(`📥 正在抓取量子位资讯...`);
  let allArticles = [];

  for (let i = 1; i <= pages; i++) {
    console.log(`📥 正在抓取第 ${i} 页...`);
    const pageArticles = await fetchOnePage(i, perPage);
    if (pageArticles.length === 0) break; // 没数据说明翻到底了
    allArticles = allArticles.concat(pageArticles);
  }

  // 过滤最近的新闻
  const recentNews = filterRecentNews(allArticles, 14)

  // 调用大模型进行分类
  const classifiedArticles = await classifyArticleListForWeekly(recentNews); 

  // 合并 GPT 数据
  const mergedArticles = mergeGptWithArticles(classifiedArticles, recentNews);

  // 生成 log 文件
  await generateArticleFile({ platform: PLATFORM, mergedArticles, recentNews })

  return mergedArticles;
}

