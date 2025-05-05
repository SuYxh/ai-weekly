// 从各个工具文件导入所有方法
import * as dateUtils from './date.js';
import * as fileUtils from './file.js';
import * as responseUtils from './response.js';
import * as commonUtils from './utils.js';
import * as loggerUtils from './logger.js';

// 导出所有方法
export const {
  // 从 date.js 导出的方法
  parseDateString,
  formatDate,
  // 可能还有其他日期相关方法
} = dateUtils;

export const {
  // 从 file.js 导出的方法
  readFileContent,
  writeFileContent,
  pathExists,
  ensureDirectoryExists,
  removePath,
  copyPath,
  movePath,
  getCurrentDirname,
  resolvePathFromMeta
  // 可能还有其他文件操作相关方法
} = fileUtils;

export const {
  // 从 response.js 导出的方法
  success,
  fail
  // 可能还有其他响应相关方法
} = responseUtils;

export const {
  // 从 utils.js 导出的方法
  generateArticleId,
  filterRecentNews,
  sleep,
  extractGPTResults,
  mergeGptWithArticles
  // 可能还有其他通用工具方法
} = commonUtils;


// 也可以按命名空间导出
export {
  dateUtils,
  fileUtils,
  responseUtils,
  commonUtils,
  loggerUtils
};