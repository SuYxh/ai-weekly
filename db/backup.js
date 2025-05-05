import { getDb } from './sqlite.js';
import fsExtra from 'fs-extra';
import path from 'path';

/**
 * 备份所有数据表
 * @param {Object} options - 备份选项
 * @param {string} options.backupDir - 备份文件存放目录，默认为 './backups'
 * @returns {Promise<string>} 备份文件路径
 */
export async function backupAllTables(options = {}) {
    const db = await getDb();
    
    // 默认选项
    const opts = {
        backupDir: './backups',
        ...options
    };

    try {
        console.log('📦 开始备份数据...');

        // 确保备份目录存在
        if (!fsExtra.existsSync(opts.backupDir)) {
            fsExtra.mkdirSync(opts.backupDir, { recursive: true });
        }

        // 生成备份文件名（使用时间戳）
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(opts.backupDir, `db-backup-${timestamp}.json`);

        // 获取所有表的数据
        const articles = await db.all('SELECT * FROM articles');
        const media = await db.all('SELECT * FROM media');
        const tags = await db.all('SELECT * FROM tags');
        const categories = await db.all('SELECT * FROM categories');
        const articleTags = await db.all('SELECT * FROM article_tags');
        const articleCategories = await db.all('SELECT * FROM article_categories');
        const users = await db.all('SELECT * FROM users');

        // 创建备份对象
        const backup = {
            timestamp,
            tables: {
                articles,
                media,
                tags,
                categories,
                article_tags: articleTags,
                article_categories: articleCategories,
                users
            }
        };

        // 写入备份文件
        await fsExtra.writeFile(backupFile, JSON.stringify(backup, null, 2));
        console.log(`✅ 数据已备份到: ${backupFile}`);
        
        return backupFile;
    } catch (err) {
        console.error('❌ 备份数据失败:', err);
        throw err;
    }
}

/**
 * 清空所有表并重置自增ID
 * @returns {Promise<string>} 操作结果消息
 */
export async function clearAllTables() {
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
 * 清空所有表并重置自增ID，同时进行备份
 * @param {Object} options - 操作选项
 * @param {boolean} options.backup - 是否进行备份，默认为 true
 * @param {string} options.backupDir - 备份文件存放目录，默认为 './backups'
 * @returns {Promise<string>} 操作结果消息
 */
export async function resetAllTables(options = {}) {
    // 默认选项
    const opts = {
        backup: true,
        backupDir: './backups',
        ...options
    };

    try {
        // 如果需要备份
        let backupFile = null;
        if (opts.backup) {
            backupFile = await backupAllTables({ backupDir: opts.backupDir });
        }

        // 清空所有表
        const clearResult = await clearAllTables();
        
        return opts.backup 
            ? `${clearResult}，数据已备份到: ${backupFile}` 
            : clearResult;
    } catch (err) {
        console.error('❌ 重置表失败:', err);
        return `重置表失败: ${err.message}`;
    }
}

/**
 * 从备份文件恢复数据
 * @param {string} backupFile - 备份文件路径
 * @returns {Promise<string>} 恢复结果消息
 */
export async function restoreFromBackup(backupFile) {
    const db = await getDb();

    try {
        // 检查备份文件是否存在
        if (!fsExtra.existsSync(backupFile)) {
            return `恢复失败: 备份文件 ${backupFile} 不存在`;
        }

        // 读取备份文件
        const backupData = JSON.parse(await fsExtra.readFile(backupFile, 'utf8'));

        // 开始事务
        await db.exec('BEGIN TRANSACTION');

        // 清空现有数据
        await db.run('DELETE FROM article_tags');
        await db.run('DELETE FROM article_categories');
        await db.run('DELETE FROM media');
        await db.run('DELETE FROM articles');
        await db.run('DELETE FROM tags');
        await db.run('DELETE FROM categories');
        await db.run('DELETE FROM users');

        // 恢复数据
        console.log('🔄 开始恢复数据...');

        // 恢复 articles 表
        for (const article of backupData.tables.articles) {
            await db.run(
                `INSERT INTO articles (
            id, author, avatar, title, content, raw_content, link, date, summary, 
            category, tags, platform, ownCategory, reason, isWeekly, score
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    article.id,
                    article.author,
                    article.avatar,
                    article.title,
                    article.content,
                    article.raw_content,
                    article.link,
                    article.date,
                    article.summary,
                    article.category,
                    article.tags,
                    article.platform,
                    article.ownCategory,
                    article.reason,
                    article.isWeekly,
                    article.score
                ]
            );
        }
        console.log(`✅ 已恢复 ${backupData.tables.articles.length} 条文章记录`);

        // ... existing code ...

        // 提交事务
        await db.exec('COMMIT');

        console.log('✅ 数据恢复完成');
        return `成功从备份文件 ${backupFile} 恢复数据`;
    } catch (err) {
        // 回滚事务
        await db.exec('ROLLBACK');
        console.error('❌ 恢复数据失败:', err);
        return `恢复数据失败: ${err.message}`;
    }
}

/**
 * 获取备份文件列表
 * @param {string} backupDir - 备份目录路径，默认为 './backups'
 * @returns {Promise<Array>} 备份文件信息列表
 */
export async function listBackups(backupDir = './backups') {
    try {
        // 检查备份目录是否存在
        if (!fsExtra.existsSync(backupDir)) {
            return [];
        }

        // 读取目录中的所有文件
        const files = fsExtra.readdirSync(backupDir)
            .filter(file => file.startsWith('db-backup-') && file.endsWith('.json'));

        // 获取文件信息
        return files.map(file => {
            const filePath = path.join(backupDir, file);
            const stats = fsExtra.statSync(filePath);

            // 从文件名中提取时间戳
            const timestamp = file.replace('db-backup-', '').replace('.json', '');

            return {
                filename: file,
                path: filePath,
                size: stats.size,
                created: stats.birthtime,
                timestamp
            };
        }).sort((a, b) => b.created - a.created); // 按创建时间降序排序
    } catch (err) {
        console.error('❌ 获取备份列表失败:', err);
        return [];
    }
}