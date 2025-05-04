import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function getDb() {
  const db = await open({
    filename: './db/database.sqlite',
    driver: sqlite3.Database
  });

  // 初始化表（只执行一次）
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    )
  `);

  return db;
}
