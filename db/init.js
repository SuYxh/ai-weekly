import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function initDb() {
  const db = await open({
    filename: "./db/database.sqlite",
    driver: sqlite3.Database,
  });

  // 初始化表（只执行一次）
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    )
  `);

  // 创建 articles 表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      author TEXT,
      title TEXT NOT NULL,
      content TEXT,
      raw_content TEXT,
      link TEXT UNIQUE NOT NULL,
      date TEXT,
      summary TEXT,
      category TEXT,
      tags TEXT,
      platform TEXT
    );
  `);

  // 创建 media 表（图片、视频等）
  await db.exec(`
    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id TEXT NOT NULL,
      type TEXT CHECK(type IN ('photo', 'video')),
      url TEXT NOT NULL,
      FOREIGN KEY(article_id) REFERENCES articles(id) ON DELETE CASCADE
    );
  `);

  // ✅ 创建 tags 主表（全局唯一 tag 名）
  await db.exec(`
      CREATE TABLE IF NOT EXISTS tags (
        name TEXT PRIMARY KEY
      );
    `);

  // ✅ 创建 categories 主表（全局唯一分类）
  await db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        name TEXT PRIMARY KEY
      );
    `);

  // 创建 article_tags 表（标签多对多）
  await db.exec(`
    CREATE TABLE IF NOT EXISTS article_tags (
      article_id TEXT NOT NULL,
      tag TEXT NOT NULL,
      PRIMARY KEY (article_id, tag),
      FOREIGN KEY(article_id) REFERENCES articles(id) ON DELETE CASCADE
    );
  `);

  // 创建 article_categories 表（分类多对多）
  await db.exec(`
    CREATE TABLE IF NOT EXISTS article_categories (
      article_id TEXT NOT NULL,
      category TEXT NOT NULL,
      PRIMARY KEY (article_id, category),
      FOREIGN KEY(article_id) REFERENCES articles(id) ON DELETE CASCADE
    );
  `);

  console.log("✅ 数据库表已初始化");
  return db;
}
