import { writeFileContent, resolvePathFromMeta, } from "../../utils/index.js";

export async function generateArticleFile({ platform, mergedArticles, recentNews }) {  
    const recentNewsOutputFilePath = resolvePathFromMeta(import.meta.url, '..', 'data', `${platform}-news-recentNews.json`);
    await writeFileContent(recentNewsOutputFilePath, recentNews)

    const mergedArticlesOutputFilePath = resolvePathFromMeta(import.meta.url, '..', 'data', `${platform}-news-mergedArticles.json`);
    await writeFileContent(mergedArticlesOutputFilePath, mergedArticles)
  
    const isWeeklyNum = mergedArticles.filter((article) => article.isWeekly == 1)?.length;
  
    console.log(`✅ 共抓取 ${recentNews.length} 条资讯, 共合并 ${mergedArticles.length} 条资讯，周刊推荐 ${isWeeklyNum} 条资讯 ✅`);
}

export async function generateHtmlFile({ platform, html }) {  
    const outputFilePath = resolvePathFromMeta(import.meta.url, '..', 'data', `${platform}-html.json`);
    await writeFileContent(outputFilePath, html)
}