import { chatWithAI } from '../clients/volcengine.js';
import { extractGPTResults } from '../../utils/index.js';
import {  getClassifyArticlesSystemPrompt } from '../prompt/classifyArticleForWeeklyPrompt.js';


export async function classifyArticleListForWeekly(articleList) {

  // 根据中文或者英文获取不同的系统提示词
  const systemPrompt = getClassifyArticlesSystemPrompt(articleList[0]?.platform)

  const userPrompt = `以下是本期待评估的文章列表，请按照说明进行处理：
    ${JSON.stringify(articleList, null, 2)}
  `;

  const response = await chatWithAI({
    systemPrompt, // 使用上面定义的 System Prompt
    messages: [
      { role: 'user', content: userPrompt },
    ],
    // 根据需要调整模型参数，例如 temperature 可能需要低一些以获得更精确的回复
    // temperature: 0.5,
  });

  // 如果 AI 返回的格式是 JSON 或其他结构，需要在这里解析
  return extractGPTResults(response);
}