import { getDb } from '../db/sqlite.js';

/**
 * 单条添加文章（量子位）
 * @param {Object} article - 文章对象
 * @returns {Object|null} 插入成功返回文章对象，重复则返回 null
 */
export async function addNewsArticle(article) {
  const db = await getDb();

  try {
    const existing = await db.get(
      'SELECT * FROM articles WHERE link = ?',
      [article.link]
    );

    if (existing) {
      console.log('⚠️ 文章已存在:', article.title);
      return null;
    }

    const id = article.id;
    await db.run(
      `INSERT INTO articles (
        id, author, avatar, title, content, raw_content, link, date, summary, category, tags, platform,
        ownCategory, reason, isWeekly, score
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        article.author || '',
        article.avatar || '',
        article.title,
        article.content || '',
        article.raw_content || '',
        article.link,
        article.date || new Date().toISOString(),
        article.summary || '',
        JSON.stringify(article.category || []),
        JSON.stringify(article.tags || []),
        article.platform || '',
        article.ownCategory || null,
        article.reason || null,
        article.isWeekly || 0,
        article.score || null,
      ]
    );

    // 插入 media 表
    if (Array.isArray(article.media)) {
      for (const item of article.media) {
        if (item.url && ['photo', 'video'].includes(item.type)) {
          await db.run(
            `INSERT INTO media (article_id, type, url) VALUES (?, ?, ?)`,
            [id, item.type, item.url]
          );
        }
      }
    }

    // 插入 tags 表 + 关联表 article_tags
    if (Array.isArray(article.tags)) {
      for (const tag of article.tags) {
        if (!tag) continue;
        await db.run(`INSERT OR IGNORE INTO tags (name) VALUES (?)`, [tag]);
        await db.run(`INSERT OR IGNORE INTO article_tags (article_id, tag) VALUES (?, ?)`, [id, tag]);
      }
    }

    // 插入 categories 表 + 关联表 article_categories
    if (Array.isArray(article.category)) {
      for (const category of article.category) {
        if (!category) continue;
        await db.run(`INSERT OR IGNORE INTO categories (name) VALUES (?)`, [category]);
        await db.run(`INSERT OR IGNORE INTO article_categories (article_id, category) VALUES (?, ?)`, [id, category]);
      }
    }

    return { id, ...article };
  } catch (err) {
    console.error('插入文章失败:', err, article);
    return null;
  }
}

/**
 * 批量添加文章（量子位）
 * @param {Array} articles - 文章数组
 * @returns {Array} 成功添加的文章列表
 */
export async function addNewsBatch(articles) {
  console.log('开始批量添加文章...');
  const results = [];
  for (const article of articles) {
    const inserted = await addNewsArticle(article);
    if (inserted) results.push(inserted);
  }
  console.log('批量添加完成，成功添加:', results.length, '篇文章');
  return results;
}


/**
 * 获取所有文章
 * @param {Object} options - 查询选项
 * @param {number} options.limit - 限制返回数量
 * @param {number} options.offset - 分页偏移量
 * @param {string} options.source - 文章来源筛选
 * @returns {Array} - 文章列表
 */
export async function getArticles(options = {}) {
  const db = await getDb();

  let query = 'SELECT * FROM articles';
  const params = [];

  // 添加筛选条件
  if (options.source) {
    query += ' WHERE source = ?';
    params.push(options.source);
  }

  // 添加排序
  query += ' ORDER BY publish_date DESC';

  // 添加分页
  if (options.limit) {
    query += ' LIMIT ?';
    params.push(options.limit);

    if (options.offset) {
      query += ' OFFSET ?';
      params.push(options.offset);
    }
  }

  return await db.all(query, params);
}

/**
 * 根据ID获取文章
 * @param {number} id - 文章ID
 * @returns {Object|null} - 文章对象或null
 */
export async function getArticleById(id) {
  const db = await getDb();
  return await db.get('SELECT * FROM articles WHERE id = ?', [id]);
}

/**
 * 搜索文章
 * @param {string} keyword - 搜索关键词
 * @param {Object} options - 查询选项
 * @returns {Array} - 匹配的文章列表
 */
export async function searchArticles(keyword, options = {}) {
  const db = await getDb();

  let query = 'SELECT * FROM articles WHERE title LIKE ? OR content LIKE ?';
  const searchParam = `%${keyword}%`;
  const params = [searchParam, searchParam];

  // 添加来源筛选
  if (options.source) {
    query += ' AND source = ?';
    params.push(options.source);
  }

  // 添加排序
  query += ' ORDER BY publish_date DESC';

  // 添加分页
  if (options.limit) {
    query += ' LIMIT ?';
    params.push(options.limit);

    if (options.offset) {
      query += ' OFFSET ?';
      params.push(options.offset);
    }
  }

  return await db.all(query, params);
}

/**
 * 清空 articles 表
 * @returns {Object} 包含受影响行数的结果对象
 */
export async function clearArticlesTable() {
  const db = await getDb();

  try {
    // 执行 DELETE 语句清空表
    const result = await db.run('DELETE FROM articles');

    console.log(`已清空 articles 表，删除了 ${result.changes} 条记录`);

    return `成功清空 articles 表，共删除 ${result.changes} 条记录`;
  } catch (err) {
    console.error('清空 articles 表失败:', err);

    return '清空 articles 表失败';
  }
}

// 如果需要重置自增ID，可以使用这个方法
export async function resetArticlesTable() {
  const db = await getDb();

  try {
    // 先删除所有记录
    await db.run('DELETE FROM articles');

    // 重置自增ID（SQLite特有语法）
    await db.run('DELETE FROM sqlite_sequence WHERE name = "articles"');

    return '成功重置 articles 表，所有记录已删除且ID已重置';
  } catch (err) {
    console.error('重置 articles 表失败:', err);

    return '重置 articles 表失败';
  }
}

/**
 * 清空所有表并重置自增ID
 * @returns {Promise<string>} 操作结果消息
 */
export async function resetAllTables() {
  const db = await getDb();
  
  try {
    // 开始事务
    await db.exec('BEGIN TRANSACTION');
    
    // 清空所有表
    await db.run('DELETE FROM article_tags');
    await db.run('DELETE FROM article_categories');
    await db.run('DELETE FROM media');
    await db.run('DELETE FROM articles');
    await db.run('DELETE FROM tags');
    await db.run('DELETE FROM categories');
    await db.run('DELETE FROM users');
    
    // 重置所有自增ID
    await db.run("DELETE FROM sqlite_sequence WHERE name IN ('users', 'media')");
    
    // 提交事务
    await db.exec('COMMIT');
    
    console.log('✅ 所有表已清空，自增ID已重置');
    return '所有表已清空，自增ID已重置';
  } catch (err) {
    // 回滚事务
    await db.exec('ROLLBACK');
    console.error('❌ 清空表失败:', err);
    return `清空表失败: ${err.message}`;
  }
}

/**
 * 获取所有文章（包含完整信息）
 * @param {Object} options - 查询选项
 * @param {number} options.limit - 限制返回数量
 * @param {number} options.offset - 分页偏移量
 * @param {string} options.platform - 平台筛选
 * @param {string} options.tag - 标签筛选
 * @param {string} options.category - 分类筛选
 * @param {string} options.orderBy - 排序字段，默认为 date
 * @param {string} options.order - 排序方式，默认为 DESC
 * @returns {Array} - 文章列表（包含媒体、标签和分类信息）
 */
export async function getAllArticles(options = {}) {
  const db = await getDb();
  
  // 构建基础查询
  let query = 'SELECT * FROM articles';
  const params = [];
  const conditions = [];
  
  // 添加筛选条件
  if (options.platform) {
    conditions.push('platform = ?');
    params.push(options.platform);
  }
  
  // 添加标签筛选
  if (options.tag) {
    query = `
      SELECT a.* FROM articles a
      JOIN article_tags at ON a.id = at.article_id
      WHERE at.tag = ?
    `;
    params.push(options.tag);
    
    // 如果有其他条件，需要用 AND 连接
    if (conditions.length > 0) {
      query += ` AND ${conditions.join(' AND ')}`;
    }
  } 
  // 添加分类筛选
  else if (options.category) {
    query = `
      SELECT a.* FROM articles a
      JOIN article_categories ac ON a.id = ac.article_id
      WHERE ac.category = ?
    `;
    params.push(options.category);
    
    // 如果有其他条件，需要用 AND 连接
    if (conditions.length > 0) {
      query += ` AND ${conditions.join(' AND ')}`;
    }
  }
  // 如果没有标签和分类筛选，但有其他条件
  else if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  // 添加排序
  const orderBy = options.orderBy || 'date';
  const order = options.order || 'DESC';
  query += ` ORDER BY ${orderBy} ${order}`;
  
  // 添加分页
  if (options.limit) {
    query += ' LIMIT ?';
    params.push(options.limit);
    
    if (options.offset) {
      query += ' OFFSET ?';
      params.push(options.offset);
    }
  }
  
  // 获取文章列表
  const articles = await db.all(query, params);
  
  // 为每篇文章获取媒体、标签和分类信息
  const result = [];
  for (const article of articles) {
    // 获取媒体信息
    const media = await db.all(
      'SELECT type, url FROM media WHERE article_id = ?',
      [article.id]
    );
    
    // 获取标签
    const tags = await db.all(
      'SELECT tag FROM article_tags WHERE article_id = ?',
      [article.id]
    );
    
    // 获取分类
    const categories = await db.all(
      'SELECT category FROM article_categories WHERE article_id = ?',
      [article.id]
    );
    
    // 组合完整的文章信息
    result.push({
      ...article,
      media: media,
      tags: tags.map(t => t.tag),
      categories: categories.map(c => c.category)
    });
  }
  
  return result;
}


/**
 * 获取最近两周内的文章数据
 * @param {Object} options - 查询选项
 * @param {number} options.limit - 限制返回数量
 * @param {number} options.offset - 分页偏移量
 * @param {string} options.platform - 平台筛选
 * @param {string} options.tag - 标签筛选
 * @param {string} options.category - 分类筛选
 * @param {string} options.orderBy - 排序字段，默认为 date
 * @param {string} options.order - 排序方式，默认为 DESC
 * @param {number} options.days - 获取最近几天的数据，默认为14天（两周）
 * @returns {Array} - 文章列表（包含媒体、标签和分类信息）
 */
export async function getRecentArticles(options = {}) {
  const db = await getDb();
  
  // 计算两周前的日期
  const days = options.days || 14; // 默认两周
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - days);
  const twoWeeksAgoStr = twoWeeksAgo.toISOString();
  
  // 构建基础查询
  let query = 'SELECT * FROM articles WHERE date >= ?';
  const params = [twoWeeksAgoStr];
  
  // 添加筛选条件
  if (options.platform) {
    query += ' AND platform = ?';
    params.push(options.platform);
  }
  
  // 添加标签筛选
  if (options.tag) {
    query = `
      SELECT a.* FROM articles a
      JOIN article_tags at ON a.id = at.article_id
      WHERE a.date >= ? AND at.tag = ?
    `;
    params[1] = options.tag; // 替换第二个参数
    
    // 如果有平台筛选
    if (options.platform) {
      query += ' AND a.platform = ?';
      params.push(options.platform);
    }
  } 
  // 添加分类筛选
  else if (options.category) {
    query = `
      SELECT a.* FROM articles a
      JOIN article_categories ac ON a.id = ac.article_id
      WHERE a.date >= ? AND ac.category = ?
    `;
    params[1] = options.category; // 替换第二个参数
    
    // 如果有平台筛选
    if (options.platform) {
      query += ' AND a.platform = ?';
      params.push(options.platform);
    }
  }
  
  // 添加排序
  const orderBy = options.orderBy || 'date';
  const order = options.order || 'DESC';
  query += ` ORDER BY ${orderBy} ${order}`;
  
  // 添加分页
  if (options.limit) {
    query += ' LIMIT ?';
    params.push(options.limit);
    
    if (options.offset) {
      query += ' OFFSET ?';
      params.push(options.offset);
    }
  }
  
  // 获取文章列表
  const articles = await db.all(query, params);
  
  // 为每篇文章获取媒体、标签和分类信息
  const result = [];
  for (const article of articles) {
    // 获取媒体信息
    const media = await db.all(
      'SELECT type, url FROM media WHERE article_id = ?',
      [article.id]
    );
    
    // 获取标签
    const tags = await db.all(
      'SELECT tag FROM article_tags WHERE article_id = ?',
      [article.id]
    );
    
    // 获取分类
    const categories = await db.all(
      'SELECT category FROM article_categories WHERE article_id = ?',
      [article.id]
    );
    
    // 组合完整的文章信息
    result.push({
      ...article,
      media: media,
      tags: tags.map(t => t.tag),
      categories: categories.map(c => c.category)
    });
  }
  
  return result;
}


/**
 * 获取文章统计信息
 * @returns {Object} 包含文章总数、标签统计和分类统计的对象
 */
export async function getArticlesStats() {
  const db = await getDb();
  
  // 获取文章总数
  const totalCount = await db.get('SELECT COUNT(*) as count FROM articles');
  
  // 获取标签统计
  const tagStats = await db.all(`
    SELECT tag, COUNT(*) as count 
    FROM article_tags 
    GROUP BY tag 
    ORDER BY count DESC
  `);
  
  // 获取分类统计
  const categoryStats = await db.all(`
    SELECT category, COUNT(*) as count 
    FROM article_categories 
    GROUP BY category 
    ORDER BY count DESC
  `);
  
  // 获取平台统计
  const platformStats = await db.all(`
    SELECT platform, COUNT(*) as count 
    FROM articles 
    GROUP BY platform 
    ORDER BY count DESC
  `);
  
  return {
    totalArticles: totalCount.count,
    tagStats,
    categoryStats,
    platformStats
  };
}