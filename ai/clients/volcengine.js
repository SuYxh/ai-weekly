import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { getSystemPrompt } from '../prompt/systemPrompts.js'

dotenv.config();

const prompt = getSystemPrompt('assistant')
const VOLCENGINE_API_KEY = process.env.VOLCENGINE_API_KEY;
const VOLCENGINE_API_URL = 'https://ark-cn-beijing.bytedance.net/api/v3/chat/completions';

console.log("VOLCENGINE_API_KEY", VOLCENGINE_API_KEY)

/**
 * 通用 OpenAI 对话接口
 * @param {Object} options
 * @param {string} [options.model] 默认 'gpt-4o'
 * @param {string} [options.systemPrompt] 系统提示词，默认是中文语言助手
 * @param {Array} options.messages 必须包含至少一条 user 消息（不包含 system）
 * @param {number} [options.temperature]
 * @param {number} [options.max_tokens]
 * @returns {string} assistant 回复
 */
export async function chatWithAI({
  model = 'ep-20250327200452-mrqlt',
  systemPrompt = prompt.content,
  messages = [],
  // temperature = 0.7,
}) {

  if (typeof systemPrompt !== 'string') {
    systemPrompt = systemPrompt.content
  } else {
    systemPrompt = systemPrompt
  }

  // console.log("chatWithAI-systemPrompt", systemPrompt)
  try {
    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ];

    const res = await fetch(VOLCENGINE_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VOLCENGINE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: fullMessages,
        // temperature,
        // max_tokens,
      }),
    });

    const json = await res.json();

    if (json.error) {
      throw new Error(json.error.message || 'volcengine API 错误');
    }

    return json.choices?.[0]?.message?.content ?? '';
  } catch (err) {
    console.error('[volcengine Error]', err.message);
    throw err;
  }
}
