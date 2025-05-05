import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // 读取 .env 文件

const RAPIDAPI_HOST = 'twitter-aio.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

/**
 * 获取指定用户的推文列表
 * @param {string} userId - 用户 ID
 * @param {number} [count=20] - 拉取的推文数量（默认20）
 * @param {string} [cursor] - 分页游标
 * @returns {Promise<Object|null>} 推文数据
 */
export async function fetchUserTweets(userId, count = 50, cursor = '') {
  const params = new URLSearchParams({
    count: count.toString(),
  });
  if (cursor) {
    params.append('cursor', cursor);
  }

  const url = `https://${RAPIDAPI_HOST}/user/${userId}/tweets?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
    });

    if (!response.ok) {
      console.error(`请求失败: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('请求出错:', err);
    return null;
  }
}
