import { summarizeText } from './services/summarize.js';
import { translateText } from './services/translate.js';
import { rewriteText } from './services/rewrite.js';
import { chatWithAI as chatWithVolcengine } from './clients/volcengine.js'; 
import { getSystemPrompt } from './prompt/systemPrompts.js'; 

// 导出所有 AI 服务函数
export {
  summarizeText,
  translateText,
  rewriteText,
  chatWithVolcengine,       
  getSystemPrompt,
};