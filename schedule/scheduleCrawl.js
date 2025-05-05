import cron from 'node-cron';
import { crawlAllPlatforms2 } from '../crawlers/tasks/crawlAll.js';
import { formatDate } from '../utils/date.js';

/**
 * 启动定时爬取任务
 * @param {string} cronExpression - cron表达式，默认为每天晚上12点（'0 0 0 * * *'）
 * @param {Object} options - 爬取选项，传递给crawlAllPlatforms函数
 */
export function startScheduledCrawl(cronExpression = '0 0 0 * * *', options = {}) {
  console.log(`🕒 已启动定时爬取任务，将在 ${cronExpression} 执行`);
  console.log(`🕒 下次执行时间: ${getNextExecutionTime(cronExpression)}`);
  
  // 设置定时任务
  const task = cron.schedule(cronExpression, async () => {
    const now = new Date();
    console.log(`\n🚀 开始执行定时爬取任务 - ${formatDate(now)}`);
    
    try {
      const results = await crawlAllPlatforms2(options);
      console.log(`✅ 定时爬取任务完成 - ${formatDate(new Date())}`);
      console.log(`📊 爬取统计: 共爬取 ${results.total} 条数据`);
      console.log(`🕒 下次执行时间: ${getNextExecutionTime(cronExpression)}`);
    } catch (error) {
      console.error(`❌ 定时爬取任务失败 - ${formatDate(new Date())}`);
      console.error(error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Shanghai" // 设置为中国时区
  });
  
  return task;
}

/**
 * 获取下次执行时间
 * @param {string} cronExpression - cron表达式
 * @returns {string} - 格式化的下次执行时间
 */
function getNextExecutionTime(cronExpression) {
  const scheduler = cron.schedule(cronExpression, () => {});
  const nextDate = scheduler.nextDate();
  scheduler.stop();
  return formatDate(nextDate.toDate());
}