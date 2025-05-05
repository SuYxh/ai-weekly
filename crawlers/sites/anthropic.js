import { fetchHtml, formatArticleData } from "../services/index.js";
import { parseDateString, filterRecentNews, writeFileContent, resolvePathFromMeta } from "../../utils/index.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const cheerio = require("cheerio");

const BASE_URL = "https://www.anthropic.com/news";

async function fetchAnthropicNews() {
    console.log(`📥 正在抓取 Anthropic 资讯...`);
    const html = await fetchHtml(BASE_URL)

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
                author: "Anthropic",
                title,
                content: '',
                rawContent: '',
                link: url,
                date: parseDateString(date),
                summary: '',
                img: coverImage,
                category: [category],
                platform: 'Anthropic',
            })

            articles.push(formattedArticle);
        }
    });

    console.log(`✅ 共抓取 ${articles.length} 条资讯 ✅`);
    return articles;
}


export async function crawlAnthropicNews() {
    const allNews = await fetchAnthropicNews()

    // 使用 __dirname 构建路径 (代码不变)
    const outputFilePath = resolvePathFromMeta(import.meta.url, '..', 'data', 'anthropic-news.json');
    await writeFileContent(outputFilePath, allNews)

    let recentTwoWeeksNews = filterRecentNews(allNews);
    console.log(`🔍 筛选出最近 2 周发布的 ${recentTwoWeeksNews.length} 条资讯 🔍`);

    if (recentTwoWeeksNews.length === 0) {
        console.log("❌ 最近 2 周没有发布新的资讯 ❌, 准备获取最近 1 个月的资讯...");
        recentTwoWeeksNews = filterRecentNews(allNews, 30);
    }

    return recentTwoWeeksNews
}

