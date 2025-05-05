import { parseDateString, filterRecentNews, mergeGptWithArticles, generateArticleId } from "../../utils/index.js";
import { fetchHtml, formatArticleData, generateArticleFile, generateHtmlFile } from "../services/index.js";
import { classifyArticleListForWeekly } from "../../ai/services/classifyArticleListForWeekly.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const cheerio = require("cheerio");

const BASE_URL = 'https://deepmind.google/blocks/card_group_blog_block/';
const PLATFORM = 'google'

async function fetchGooglePage(page = 1) {
    const html = await fetchHtml(`${BASE_URL}?page=${page}&fetch=true`)
    await generateHtmlFile({ platform: PLATFORM, html })

    const $ = cheerio.load(html);
    const articles = [];

    $('a.glue-card.card').each((_, el) => {
        const $el = $(el);
        const title = $el.find('.glue-headline').text().trim();
        const href = $el.attr('href');
        const url = href?.startsWith('http') ? href : `https://deepmind.google${href}`;
        const category = $el.find('.glue-label').first().text().trim();
        const description = $el.find('.glue-card__description').text().trim();
        const publishedAtRaw = $el.find('time').attr('datetime');
        const image = $el.find('img').attr('src');

        if (title && url) {

            const formattedArticle = formatArticleData({
                id: generateArticleId(),
                author: 'google',
                title,
                content: description,
                rawContent: description,
                link: url,
                date: parseDateString(publishedAtRaw),
                summary: '',
                img: image,
                category: [category],
                platform: PLATFORM,
            })

            articles.push(formattedArticle);
        }
    });

    return articles;
}

export async function crawlGoogleNews({ maxPages = 3 }) {
    console.log(`📥 正在抓取 Google 资讯...`);
    let allArticles = [];
    for (let page = 1; page <= maxPages; page++) {
        console.log(`📥 正在抓取第 ${page} 页...`);
        const articles = await fetchGooglePage(page);
        if (articles.length === 0) {
            console.log(`🛑 第 ${page} 页为空，终止抓取`);
            break;
        }
        allArticles = allArticles.concat(articles);
    }

    // 过滤最近的新闻
    const recentNews = filterRecentNews(allArticles)

    // 调用大模型进行分类
    const classifiedArticles = await classifyArticleListForWeekly(recentNews);

    // 合并 GPT 数据
    const mergedArticles = mergeGptWithArticles(classifiedArticles, recentNews);

    // 生成 log 文件
    await generateArticleFile({ platform: PLATFORM, mergedArticles, recentNews })
    return mergedArticles;
}


