/**
 * 将日期对象格式化为 'YYYY-MM-DD HH:mm:ss' 格式
 * @param {Date} date - 日期对象
 * @returns {string} - 格式化后的日期字符串
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要+1
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 解析日期字符串（支持相对时间如 "X分钟前", "X小时前", "昨天" 和绝对时间如 "YYYY-MM-DD"）
 * @param {string} dateStr - 输入的日期字符串
 * @returns {string} - 'YYYY-MM-DD HH:mm:ss' 格式的日期字符串，如果无法解析则返回原始字符串
 */
export function parseDateString(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') {
    return dateStr; // 返回原始值或空值
  }

  const now = new Date();
  let date = null;

  // 尝试匹配相对时间
  const minuteMatch = dateStr.match(/(\d+)\s*分钟前/);
  const hourMatch = dateStr.match(/(\d+)\s*小时前/);
  const dayMatch = dateStr.match(/(\d+)\s*天前/);
  // 匹配"前天 HH:MM"格式
  const dayBeforeYesterdayMatch = dateStr.match(/前天\s*(\d{1,2}):(\d{1,2})/);
  // 匹配"昨天 HH:MM"格式
  const yesterdayMatch = dateStr.match(/昨天\s*(\d{1,2}):(\d{1,2})/);
  // 匹配 ISO 格式日期 (如 2025-05-05T02:22:33.000Z)
  const isoMatch = dateStr.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/);


  if (minuteMatch) {
    const minutesAgo = parseInt(minuteMatch[1], 10);
    date = new Date(now.getTime() - minutesAgo * 60 * 1000);
  } else if (hourMatch) {
    const hoursAgo = parseInt(hourMatch[1], 10);
    date = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
  } else if (dayBeforeYesterdayMatch) {
    // 处理"前天 HH:MM"格式
    date = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const hours = parseInt(dayBeforeYesterdayMatch[1], 10);
    const minutes = parseInt(dayBeforeYesterdayMatch[2], 10);
    date.setHours(hours, minutes, 0, 0);
  } else if (yesterdayMatch) {
    // 处理"昨天 HH:MM"格式
    date = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const hours = parseInt(yesterdayMatch[1], 10);
    const minutes = parseInt(yesterdayMatch[2], 10);
    date.setHours(hours, minutes, 0, 0);
  } else if (dateStr.includes('前天')) {
    // 简单处理：设置为前天的当前时间
    date = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  } else if (dateStr.includes('昨天')) {
    // 简单处理：设置为昨天的当前时间
    date = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    // 如果需要精确到昨天某个时间点（如 00:00:00），需要更复杂的处理
    // date.setHours(0, 0, 0, 0); // 例如设置为昨天零点
  } else if (dayMatch) {
    const daysAgo = parseInt(dayMatch[1], 10);
    date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  } else if (isoMatch) {
    // 处理 ISO 格式日期
    date = new Date(dateStr);
  } else {
    // 尝试直接解析绝对时间 (YYYY-MM-DD, YYYY/MM/DD 等)
    // 注意：Date.parse 对格式敏感，不保证所有格式都能成功
    const parsedDate = new Date(dateStr.replace(/-/g, '/')); // 尝试替换 '-' 为 '/' 提高兼容性
    if (!isNaN(parsedDate.getTime())) {
      date = parsedDate;
    }
  }

  // 如果成功解析出 Date 对象，则格式化输出
  if (date instanceof Date && !isNaN(date.getTime())) {
    return formatDate(date);
  }

  // 如果无法解析，返回原始字符串
  console.warn(`无法解析日期字符串: "${dateStr}"，将返回原始值。`);
  return dateStr;
}