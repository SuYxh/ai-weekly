import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let dbInstance;

export async function getDb() {
  if (!dbInstance) {
    dbInstance = await open({
      filename: './db/database.sqlite',
      driver: sqlite3.Database,
    });
  }
  return dbInstance;
}
