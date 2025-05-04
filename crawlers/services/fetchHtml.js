import fetch from 'node-fetch';

/**
 * 默认的请求头，模拟浏览器访问
 */
const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Connection': 'keep-alive',
};

/**
 * 异步获取指定 URL 的 HTML 内容
 * @param {string} url - 需要获取 HTML 的网页 URL
 * @param {object} [options={}] - node-fetch 的额外选项，可以覆盖默认 headers
 * @param {object} [options.headers] - 自定义请求头，会与默认请求头合并
 * @param {number} [options.timeout=15000] - 请求超时时间（毫秒），默认为 15000ms
 * @returns {Promise<string>} - 返回包含 HTML 内容的 Promise 对象
 * @throws {Error} - 如果请求失败或超时，则抛出错误
 */
export async function fetchHtml(url, options = {}) {
  const { headers: customHeaders, timeout = 15000, ...restOptions } = options;

  // 合并默认请求头和自定义请求头
  const requestHeaders = {
    ...DEFAULT_HEADERS,
    ...customHeaders, // 自定义请求头会覆盖默认值
  };

  try {
    console.log(`🌐 正在请求: ${url}`);
    const response = await fetch(url, {
      headers: requestHeaders,
      timeout: timeout, // 设置超时
      ...restOptions, // 其他 fetch 选项
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status} ${response.statusText} - URL: ${url}`);
    }

    const html = await response.text();
    console.log(`✅ 请求成功: ${url}`);
    return html;

  } catch (error) {
    // 区分是 fetch 本身的错误还是超时错误
    if (error.name === 'AbortError' || error.type === 'request-timeout') {
       console.error(`请求超时: ${url} (超时时间: ${timeout}ms)`);
       throw new Error(`请求超时: ${url}`);
    } else if (error instanceof Error && error.message.startsWith('请求失败')) {
        // 如果是上面我们主动抛出的请求失败错误，直接重新抛出
        console.error(error.message);
        throw error;
    } else {
        // 其他未知错误
        console.error(`获取 HTML 时发生未知错误: ${url}`, error);
        throw new Error(`获取 HTML 时发生未知错误: ${url} - ${error.message}`);
    }
  }
}

// 示例用法 (可以在其他文件中导入并使用):
/*
async function exampleUsage() {
  try {
    const qbitHtml = await fetchHtml('https://www.qbitai.com/');
    console.log('QbitAI HTML 获取成功，长度:', qbitHtml.length);

    // 示例：自定义请求头和超时
    // const customHtml = await fetchHtml('https://example.com', {
    //   headers: { 'X-Custom-Header': 'value' },
    //   timeout: 5000 // 5秒超时
    // });
    // console.log('Example.com HTML 获取成功，长度:', customHtml.length);

  } catch (error) {
    console.error("获取 HTML 过程中出错:", error.message);
  }
}

exampleUsage();
*/