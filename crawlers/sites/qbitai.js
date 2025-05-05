import { createRequire } from "module";
import { fetchHtml, formatArticleData } from '../services/index.js'
import { parseDateString, filterRecentNews, writeFileContent, resolvePathFromMeta } from "../../utils/index.js";
const require = createRequire(import.meta.url);
const cheerio = require("cheerio");

const BASE_URL = "https://www.qbitai.com/category/%E8%B5%84%E8%AE%AF?page=";

export async function fetchOnePage(page = 1, perPage = 10) {
  const html = await fetchHtml(`${BASE_URL}${page}`);

  const outputFilePath = resolvePathFromMeta(import.meta.url, '..', 'data', 'qbit-html.txt');
  await writeFileContent(outputFilePath, html)

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
        author: authorName,
        avatar: '',
        title, link, 
        date: parseDateString(date), summary, img, tags, platform: 'qbitai'
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

  // 使用 __dirname 构建路径 (代码不变)
  const outputFilePath = resolvePathFromMeta(import.meta.url, '..', 'data', 'qbit-news.json');
  await writeFileContent(outputFilePath, recentNews)

  console.log(`✅ 共抓取 ${recentNews.length} 条资讯 ✅`);
  return recentNews;
}

