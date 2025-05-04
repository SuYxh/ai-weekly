import { getDb } from '../db/sqlite.js';

export async function getAllUsers() {
  const db = await getDb();
  return db.all('SELECT * FROM users');
}

export async function addUser(name, email) {
  const db = await getDb();
  const result = await db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
  return { id: result.lastID, name, email };
}
