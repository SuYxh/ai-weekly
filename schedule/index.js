import cron from 'node-cron';
import { crawlAllPlatforms2 } from '../crawlers/tasks/crawlAll.js';


// 每分钟执行一次
// startCrawlScheduler('* * * * *');

// 每5分钟执行一次
// startCrawlScheduler('*/5 * * * *');

// 每小时执行一次
// startCrawlScheduler('0 * * * *');

// 每天早上8点执行
// const task = startScheduledCrawl('0 0 8 * * *', crawlOptions);

// 每周一凌晨执行
// const task = startScheduledCrawl('0 0 0 * * 1', crawlOptions);


/**
 * 启动定时爬取任务
 * @param {string} cronExpression - cron表达式
 */
export function startCrawlScheduler(cronExpression = '0 0 0 * * *') {
    console.log(`🕒 已启动定时爬取任务，将在 ${cronExpression} 执行`);
    
    // 设置定时任务 - 每天晚上12点执行
    const task = cron.schedule(cronExpression, async () => {
      const now = new Date();
      console.log(`\n🚀 开始执行定时爬取任务 - ${now.toLocaleString()}`);
      
      try {
        // 配置爬取选项
        const options = {
          reset: false,  // 不重置数据库，只添加新数据
          qbit: true,
          huggingface: true,
          anthropic: true,
          google: true,
          twitter: false  // 默认不爬取Twitter
        };
        
        const results = await crawlAllPlatforms2(options);
        console.log(`✅ 定时爬取任务完成 - ${new Date().toLocaleString()}`);
        console.log(`📊 爬取统计: 共爬取 ${results.total} 条数据`);
      } catch (error) {
        console.error(`❌ 定时爬取任务失败 - ${new Date().toLocaleString()}`);
        console.error(error);
      }
    }, {
      scheduled: true,
      timezone: "Asia/Shanghai" // 设置为中国时区
    });
    
    return task;
  }
  