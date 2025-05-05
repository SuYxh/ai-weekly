import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// 邮件配置
const mailConfig = {
  host: process.env.MAIL_HOST || 'smtp.163.com',
  port: process.env.MAIL_PORT || 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER || 'your-email@163.com',
    pass: process.env.MAIL_PASS || 'your-password-or-token'
  }
};

// 创建邮件传输器
const transporter = nodemailer.createTransport(mailConfig);

/**
 * 生成爬虫报告的HTML内容
 * @param {Object} results - 爬虫结果
 * @returns {string} HTML格式的报告内容
 */
function generateReportHtml(results) {
  const date = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  
  // 生成平台数据表格
  let platformsHtml = '';
  for (const [platform, data] of Object.entries(results.platforms)) {
    if (data.error) {
      platformsHtml += `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${platform}</td>
          <td style="padding: 8px; border: 1px solid #ddd; color: red;">失败</td>
          <td style="padding: 8px; border: 1px solid #ddd;">0</td>
          <td style="padding: 8px; border: 1px solid #ddd;">0</td>
          <td style="padding: 8px; border: 1px solid #ddd; color: red;">${data.error}</td>
        </tr>
      `;
    } else {
      platformsHtml += `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${platform}</td>
          <td style="padding: 8px; border: 1px solid #ddd; color: green;">成功</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${data.crawled || 0}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${data.saved || 0}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">-</td>
        </tr>
      `;
    }
  }
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <h2 style="color: #333;">AI 周刊爬虫任务报告</h2>
      <p>任务完成时间: ${date}</p>
      
      <div style="margin: 20px 0;">
        <h3 style="color: #333;">总体统计</h3>
        <p>总计成功保存文章数: <strong>${results.total}</strong> 条</p>
      </div>
      
      <div style="margin: 20px 0;">
        <h3 style="color: #333;">平台详情</h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; border: 1px solid #ddd;">平台</th>
              <th style="padding: 8px; border: 1px solid #ddd;">状态</th>
              <th style="padding: 8px; border: 1px solid #ddd;">爬取数量</th>
              <th style="padding: 8px; border: 1px solid #ddd;">保存数量</th>
              <th style="padding: 8px; border: 1px solid #ddd;">错误信息</th>
            </tr>
          </thead>
          <tbody>
            ${platformsHtml}
          </tbody>
        </table>
      </div>
      
      <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
        <p>此邮件由系统自动发送，请勿直接回复。</p>
        <p>如有问题，请联系管理员。</p>
      </div>
    </div>
  `;
}

/**
 * 发送爬虫报告邮件
 * @param {Object} results - 爬虫结果
 * @param {Object} options - 邮件选项
 * @returns {Promise<Object>} 发送结果
 */
export async function sendCrawlReport(results, options = {}) {
  const defaultOptions = {
    to: process.env.REPORT_EMAIL || 'recipient@example.com',
    cc: process.env.REPORT_CC || '',
    subject: 'AI 周刊爬虫任务完成报告'
  };
  
  const opts = { ...defaultOptions, ...options };
  const htmlContent = generateReportHtml(results);
  
  try {
    const info = await transporter.sendMail({
      from: `"AI 周刊爬虫" <${mailConfig.auth.user}>`,
      to: opts.to,
      cc: opts.cc,
      subject: opts.subject,
      html: htmlContent
    });
    
    console.log('✅ 爬虫报告邮件发送成功:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ 爬虫报告邮件发送失败:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 测试邮件发送功能
 */
export async function testMailer() {
  const testResults = {
    total: 42,
    platforms: {
      qbit: { crawled: 20, saved: 15 },
      huggingface: { crawled: 15, saved: 12 },
      anthropic: { crawled: 10, saved: 8 },
      google: { crawled: 12, saved: 7 },
      twitter: { error: '连接超时' }
    }
  };
  
  return await sendCrawlReport(testResults);
}