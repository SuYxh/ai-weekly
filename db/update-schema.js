import { getDb } from './sqlite.js';

async function updateSchema() {
  try {
    const db = await getDb();

    // 检查 avatar 列是否已存在
    const tableInfo = await db.all("PRAGMA table_info(articles)");

    // 检查 ownCategory 列
    const ownCategoryColumnExists = tableInfo.some(column => column.name === 'ownCategory');
    if (!ownCategoryColumnExists) {
      await db.exec("ALTER TABLE articles ADD COLUMN ownCategory TEXT");
      console.log("✅ 成功添加 ownCategory 列到 articles 表");
    } else {
      console.log("ℹ️ ownCategory 列已存在，无需添加");
    }

    // 检查 reason 列
    const reasonColumnExists = tableInfo.some(column => column.name === 'reason');
    if (!reasonColumnExists) {
      await db.exec("ALTER TABLE articles ADD COLUMN reason TEXT");
      console.log("✅ 成功添加 reason 列到 articles 表");
    } else {
      console.log("ℹ️ reason 列已存在，无需添加");
    }

    // 检查 isWeekly 列
    const isWeeklyColumnExists = tableInfo.some(column => column.name === 'isWeekly');
    if (!isWeeklyColumnExists) {
      await db.exec("ALTER TABLE articles ADD COLUMN isWeekly INTEGER DEFAULT 0");
      console.log("✅ 成功添加 isWeekly 列到 articles 表");
    } else {
      console.log("ℹ️ isWeekly 列已存在，无需添加");
    }

    // 检查 score 列
    const scoreColumnExists = tableInfo.some(column => column.name === 'score');
    if (!scoreColumnExists) {
      await db.exec("ALTER TABLE articles ADD COLUMN score INTEGER DEFAULT 0");
      console.log("✅ 成功添加 score 列到 articles 表");
    } else {
      console.log("ℹ️ score 列已存在，无需添加");
    }

    console.log("✅ 数据库表结构更新完成");
  } catch (error) {
    console.error("❌ 更新数据库表结构时出错:", error);
  }
}

// 执行更新
updateSchema();