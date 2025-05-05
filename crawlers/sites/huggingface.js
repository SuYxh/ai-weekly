import { formatArticleData, generateArticleFile, generateHtmlFile } from "../services/index.js";
import { parseDateString, filterRecentNews, mergeGptWithArticles, generateArticleId } from "../../utils/index.js";
import { classifyArticleListForWeekly } from "../../ai/services/classifyArticleListForWeekly.js";

const PLATFORM = 'huggingface'


export async function crawlHuggingfaceNews({ skip = 0 }) {
    console.log(`📥 正在抓取 HuggingFace 资讯...`);

    const response = await fetch(`https://huggingface.co/api/posts?skip=${skip}&sort=recent`, {
        headers: {
            'User-Agent': 'Mozilla/5.0',
            'Accept': 'application/json',
        },
    });

    const data = await response.json();

    await generateHtmlFile({ platform: PLATFORM, html: data, ext: 'txt' })

    const rawPosts = data?.socialPosts || [];

    const parsed = [];

    for (const [index, post] of rawPosts.entries()) {
        const coverImage = post.attachments?.find(a => a.type === 'image')?.url;

        const formattedArticle = formatArticleData({
            id: generateArticleId(),
            author: post.author.fullname,
            avatar: post.author.avatarUrl,
            title: post.rawContent.split('\n')[0].trim(),
            content: post.rawContent,
            rawContent: post.rawContent,
            link: `https://huggingface.co${post.url}`,
            date: parseDateString(post.publishedAt),
            summary: '',
            img: coverImage,
            platform: PLATFORM,
        })

        parsed.push(formattedArticle);
    }

    // 过滤最近的新闻
    const recentNews = filterRecentNews(parsed);

    // 调用大模型进行分类
    const classifiedArticles = await classifyArticleListForWeekly(recentNews);

    // 合并 GPT 数据
    const mergedArticles = mergeGptWithArticles(classifiedArticles, recentNews);

    // 生成 log 文件
    await generateArticleFile({ platform: PLATFORM, mergedArticles, recentNews })

    return mergedArticles;
}
