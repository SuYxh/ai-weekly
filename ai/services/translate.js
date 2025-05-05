import { chatWithAI } from '../clients/volcengine.js';
// 如果有特定的翻译 System Prompt，可以取消下面的注释并确保路径正确
import { getSystemPrompt } from '../prompt/systemPrompts.js';

// 可以预先定义一些常用的 System Prompt，或者在函数内动态生成
const translationPrompt = getSystemPrompt('translator'); // 假设有一个名为 'translator' 的 prompt

/**
 * 翻译文本内容
 * @param {string} content 需要翻译的文本内容
 * @param {string} targetLanguage 目标语言代码 (例如 'zh' 代表中文, 'en' 代表英文)，默认为 'zh'
 * @param {string} [sourceLanguage] 源语言代码 (例如 'en', 'zh')。如果未提供，会提示 AI 自动检测或假定一个默认值（如下面的 prompt 所示）。
 * @returns {Promise<string>} 翻译后的文本内容
 */
export async function translateText(content, targetLanguage = 'zh', sourceLanguage) {
  // 动态构建 User Message，指示 AI 进行翻译
  // 你可以根据需要调整这个 prompt 的精确度
  let userMessageContent = `请将以下文本翻译成 ${targetLanguage}`;
  if (sourceLanguage) {
    userMessageContent += ` (原文是 ${sourceLanguage})`;
  } else {
    userMessageContent += ` (请自动检测原文语言)`; // 或者假定一个默认源语言，例如 '英文'
  }
  userMessageContent += `:\n\n${content}`;

  // 调用 AI进行翻译
  const response = await chatWithAI({
    systemPrompt: translationPrompt, // 使用上面定义的 System Prompt
    messages: [
      { role: 'user', content: userMessageContent },
    ],
    // 根据需要调整模型参数，例如 temperature 可能需要低一些以获得更精确的翻译
    // temperature: 0.5,
  });

  // 假设 AI 返回的直接就是翻译结果
  // 如果 AI 返回的格式是 JSON 或其他结构，需要在这里解析
  return response;
}

// 示例用法 (可以在其他文件中导入并使用):
/*
async function exampleUsage() {
  try {
    const englishText = "Hello, world!";
    const chineseTranslation = await translateText(englishText, 'zh', 'en');
    console.log(`英文 "${englishText}" 翻译成中文: ${chineseTranslation}`);

    const chineseText = "你好，世界！";
    const englishTranslation = await translateText(chineseText, 'en', 'zh');
    console.log(`中文 "${chineseText}" 翻译成英文: ${englishTranslation}`);

    const autoDetectText = "Bonjour le monde!"; // 法语
    const chineseFromAuto = await translateText(autoDetectText, 'zh');
    console.log(`自动检测语言 "${autoDetectText}" 翻译成中文: ${chineseFromAuto}`);

  } catch (error) {
    console.error("翻译过程中出错:", error);
  }
}

exampleUsage();
*/