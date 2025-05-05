export function generateArticleId() {
    const timestamp = Date.now();               // 毫秒时间戳
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `art_${timestamp}_${random}`;        // 例如：art_1714877743784_0932
  }
  