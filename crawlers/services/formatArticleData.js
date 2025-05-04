import { parseDateString } from "../../utils/date.js";
/**
 * 将从不同平台提取的原始数据格式化为标准结构
 * @param {object} rawData - 包含原始数据的对象 { title, link, summary, dateStr, img, tags }
 * @returns {object} - 符合标准结构的文章对象
 */
export function formatArticleData(rawData) {
  const {
    id,
    author,
    title,
    content,
    rawContent,
    link,
    date,
    summary,
    media,
    img,
    video,
    category,
    tags,
    platform,
  } = rawData;

  media = media || [];
  if (img) {
    media.push({ type: "photo", url: img });
  }
  if (video) {
    media.push({ type: "video", url: video });
  }

  const formattedDate = parseDateString(date);

  return {
    id: id || "", // ID 需要生成策略，例如基于 link 哈希，暂时为空
    author: author || "", // 列表页通常没有作者信息
    title: title || "", // 确保有默认值
    content: content || "", // 完整内容需要访问详情页获取
    rawContent: rawContent || "", // 原始内容需要访问详情页获取
    link: link || "", // 确保有默认值
    date: formattedDate || "", // 暂时使用原始字符串
    summary: summary || "", // 确保有默认值
    media: media,
    category: category || [], // qbitai 这个分类下的文章，可以暂时硬编码或留空 []
    tags: tags || [], // 确保是数组
    platform: platform || "", // 平台标识
  };
}
