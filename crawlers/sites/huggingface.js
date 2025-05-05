import { formatArticleData } from '../services/formatArticleData.js'
import { parseDateString, filterRecentNews, writeFileContent, resolvePathFromMeta } from "../../utils/index.js";


export async function crawlHuggingfaceNews({ skip = 0 }) {
    console.log(`📥 正在抓取 HuggingFace 资讯...`);
    const response = await fetch(`https://huggingface.co/api/posts?skip=${skip}&sort=recent`, {
        headers: {
            'User-Agent': 'Mozilla/5.0',
            'Accept': 'application/json',
        },
    });

    const data = await response.json();

    const rawPosts = data?.socialPosts || [];

    const parsed = [];

    for (const [index, post] of rawPosts.entries()) {
        const coverImage = post.attachments?.find(a => a.type === 'image')?.url;

        // const summary = await summarizeText(post.rawContent); // ⬅️ 添加自动摘要
        // const content = await translateText(post.rawContent); // ⬅️ 添加自动翻译

        const summary = ''; // ⬅️ 添加自动摘要
        const content = ''; // ⬅️ 添加自动翻译

        const formattedArticle = formatArticleData({
            author: post.author.fullname,
            avatar: post.author.avatarUrl,
            title: post.rawContent.split('\n')[0].trim(),
            content,
            rawContent: post.rawContent,
            link: `https://huggingface.co${post.url}`,
            date: parseDateString(post.publishedAt),
            summary,
            img: coverImage,
            platform: 'huggingface',
        })

        parsed.push(formattedArticle);
    }


    const recentNews = filterRecentNews(parsed);

    // 使用 __dirname 构建路径 (代码不变)
    const outputFilePath = resolvePathFromMeta(import.meta.url, '..', 'data', 'huggingface-news.json');
    await writeFileContent(outputFilePath, recentNews)

    console.log(`✅ 共抓取 ${recentNews.length} 条资讯 ✅`);
    return recentNews;
}
