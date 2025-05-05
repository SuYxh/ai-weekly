import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // 加载 .env 文件中的环境变量

const RAPIDAPI_HOST = 'twitter-aio.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

/**
 * 获取 Twitter 用户信息
 * @param {string} username - 要查询的 Twitter 用户名
 * @returns {Promise<Object|null>} - 用户信息 JSON 或 null（失败时）
 */
export async function fetchTwitterUser(username) {
  const url = `https://${RAPIDAPI_HOST}/user/by/username/${username}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
    });

    if (!response.ok) {
      console.error('请求失败:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('请求出错:', err);
    return null;
  }
}
