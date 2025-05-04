import { chatWithAI } from '../clients/volcengine';
// 如果有特定的润色 System Prompt，可以取消下面的注释并确保路径正确
import { getSystemPrompt } from '../prompt/systemPrompts';

// 可以预先定义一些常用的 System Prompt
const rewritePrompt = getSystemPrompt('chinesePolisher'); // 假设有一个名为 'textPolisher' 的 prompt

/**
 * 优化润色文本内容
 * @param {string} content 需要润色的文本内容
 * @param {'professional' | 'casual' | 'concise' | 'expand' | 'formal' | 'friendly'} [style='professional'] 润色风格，默认为 'professional'
 * @returns {Promise<string>} 润色后的文本内容
 */
export async function rewriteText(content, style = 'professional') {
  // 动态构建 User Message，指示 AI 进行润色
  const userMessageContent = `
请根据 "${style}" 的风格，优化润色以下文本内容：

${content}
`;

  // 调用 AI 进行润色
  const response = await chatWithAI({
    systemPrompt: rewritePrompt.content, // 使用上面定义的 System Prompt
    messages: [
      { role: 'user', content: userMessageContent },
    ],
    // 根据需要调整模型参数，例如 temperature 可能需要适中以平衡创造性和准确性
    // temperature: 0.7,
  });

  // 假设 AI 返回的直接就是润色后的结果
  // 如果 AI 返回的格式是 JSON 或其他结构，需要在这里解析
  return response;
}

// 示例用法 (可以在其他文件中导入并使用):
/*
async function exampleUsage() {
  try {
    const originalText = "这个功能有点问题，需要改改。";

    const professionalRewrite = await rewriteText(originalText, 'professional');
    console.log(`原文: "${originalText}"`);
    console.log(`专业风格润色: ${professionalRewrite}`);

    const conciseRewrite = await rewriteText(originalText, 'concise');
    console.log(`简洁风格润色: ${conciseRewrite}`);

    const friendlyRewrite = await rewriteText(originalText, 'friendly');
    console.log(`友好风格润色: ${friendlyRewrite}`);

  } catch (error) {
    console.error("润色过程中出错:", error);
  }
}

exampleUsage();
*/