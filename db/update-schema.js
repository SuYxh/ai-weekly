import { getDb } from './sqlite.js';

async function updateSchema() {
  try {
    const db = await getDb();
    
    // 检查 avatar 列是否已存在
    const tableInfo = await db.all("PRAGMA table_info(articles)");
    const avatarColumnExists = tableInfo.some(column => column.name === 'avatar');
    
    if (!avatarColumnExists) {
      // 添加 avatar 列
      await db.exec("ALTER TABLE articles ADD COLUMN avatar TEXT");
      console.log("✅ 成功添加 avatar 列到 articles 表");
    } else {
      console.log("ℹ️ avatar 列已存在，无需添加");
    }
    
    console.log("✅ 数据库表结构更新完成");
  } catch (error) {
    console.error("❌ 更新数据库表结构时出错:", error);
  }
}

// 执行更新
updateSchema();