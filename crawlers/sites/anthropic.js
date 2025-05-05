import { fetchHtml, formatArticleData, generateArticleFile, generateHtmlFile } from "../services/index.js";
import { parseDateString, filterRecentNews, mergeGptWithArticles, generateArticleId } from "../../utils/index.js";
import { classifyArticleListForWeekly } from "../../ai/services/classifyArticleListForWeekly.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const cheerio = require("cheerio");

const BASE_URL = "https://www.anthropic.com/news";
const PLATFORM = 'anthropic'


async function fetchAnthropicNews() {
    console.log(`📥 正在抓取 Anthropic 资讯...`);
    const html = await fetchHtml(BASE_URL)

    generateHtmlFile({ platform: PLATFORM, html })

    const $ = cheerio.load(html);
    const articles = [];

    $('a[class^="PostCard_post-card__"]').each((_, el) => {
        const $el = $(el);

        const url = "https://www.anthropic.com" + $el.attr("href");
        const title = $el.find("h3").text().trim();
        const category = $el.find(".text-label").first().text().trim();
        const date = $el.find('[class*="post-date__"]').text().trim(); // 发布时间容错匹配
        const img = $el.find("img").attr("src") || "";
        const coverImage = img.startsWith("http")
            ? img
            : `https://www.anthropic.com${img}`;

        if (title && url) {
            const formattedArticle = formatArticleData({
                id: generateArticleId(),
                author: "Anthropic",
                title,
                content: '',
                rawContent: '',
                link: url,
                date: parseDateString(date),
                summary: '',
                img: coverImage,
                category: [category],
                platform: PLATFORM,
            })

            articles.push(formattedArticle);
        }
    });

    console.log(`✅ 共抓取 ${articles.length} 条资讯 ✅`);
    return articles;
}


export async function crawlAnthropicNews() {
    // 所有的信息
    const allNews = await fetchAnthropicNews()

    // 过滤最近的新闻
    const recentNews = filterRecentNews(allNews)

    // 调用大模型进行分类
    const classifiedArticles = await classifyArticleListForWeekly(recentNews);

    // 合并 GPT 数据
    const mergedArticles = mergeGptWithArticles(classifiedArticles, recentNews);

    // 生成 log 文件
    await generateArticleFile({ platform: PLATFORM, mergedArticles, recentNews })

    return mergedArticles
}

