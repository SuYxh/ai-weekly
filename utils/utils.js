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