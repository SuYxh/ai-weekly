export function generateArticleId() {
  const timestamp = Date.now();               // 毫秒时间戳
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `art_${timestamp}_${random}`;        // 例如：art_1714877743784_0932
}


export function filterRecentNews(newsList, days = 30) {
  const now = new Date();
  const cutoffDate = new Date();
  // 默认是最近 2 周
  cutoffDate.setDate(now.getDate() - days);

  return newsList.filter(item => {
      const publishedDate = new Date(item.date);
      return publishedDate >= cutoffDate;
  });
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function extractGPTResults(outputText) {
  // 安全处理（用于兼容 fallback 格式）
  const cleaned = outputText.replace(/```json|```/g, '').trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed) && parsed[0]?.id && parsed[0]?.ownCategory) {
      return parsed;
    } else {
      console.warn('返回结构不符合预期:', parsed);
      return [];
    }
  } catch (e) {
    console.error('解析失败:', e.message);
    console.error('返回内容:', cleaned);
    return [];
  }
}


export function mergeGptWithArticles(gptResults, articles) {
  const gptMap = new Map(gptResults.map(item => [item.id, item]));

  const merged = articles.map(article => {
    const gpt = gptMap.get(article.id);
    if (gpt) {
      return {
        ...article,
        ...gpt, // 简洁合并
      };
    } else {
      console.warn('❗未匹配到 GPT 数据的文章 ID:', article.id);
      return article;
    }
  });

  return merged;
}

export function groupArticlesByField(articles, field = 'ownCategory') {
  return articles.reduce((acc, article) => {
    const key = article[field] || 'uncategorized';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(article);
    return acc;
  }, {});
}

