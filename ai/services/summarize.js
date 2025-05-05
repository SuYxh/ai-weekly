import { chatWithAI } from '../clients/volcengine.js';
import { getSystemPrompt } from '../prompt/systemPrompts.js';

// 英文文档总结 Prompt
const promptEnToZh = getSystemPrompt('articleSummarizerEnToZh');
// 中文文档总结 Prompt
const promptZhToZh = getSystemPrompt('contentHelper');


/**
 * 总结文本内容
 * @param {string} content 需要总结的文本内容
 * @param {'en' | 'zh'} language 输入内容的语言 ('en' 代表英文, 'zh' 代表中文)，默认为 'en'
 * @returns {Promise<string>} 总结后的文本内容
 */
export async function summarizeText(content, language = 'en') {
  let selectedPrompt;
  let userMessageContent;

  if (language === 'zh') {
    selectedPrompt = promptZhToZh;
    // 对于中文内容，可以直接使用 contentHelper 的 prompt
    // 注意：你需要确保 'contentHelper' prompt 的设计是接收原始内容并进行总结
    // 如果 'contentHelper' 需要特定的格式，请在这里调整 userMessageContent
    userMessageContent = `
请阅读以下内容，并总结其核心内容：

${content}
`;;
  } else { // 默认为英文转中文
    selectedPrompt = promptEnToZh;
    // 使用原有的英文转中文的提示结构
    userMessageContent = `
请阅读以下英文内容，并用中文总结其核心内容：

${content}
`;
  }

  // 检查 selectedPrompt 是否成功获取
  if (!selectedPrompt || !selectedPrompt.content) {
    throw new Error(`无法获取语言 '${language}' 对应的 System Prompt。请检查 'systemPrompts.js' 或 getSystemPrompt 函数。`);
  }

  const response = await chatWithAI({
    // 使用获取到的 System Prompt 内容
    systemPrompt: selectedPrompt.content,
    messages: [
      // User message 包含需要总结的内容和指示
      { role: 'user', content: userMessageContent },
    ],
  });
  return response;
}