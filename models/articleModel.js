import { getDb } from '../db/sqlite.js';

export async function insertArticle(article) {
  const db = await getDb();

  await db.run(`
    INSERT OR IGNORE INTO articles (id, author, title, content, raw_content, link, date, summary, category, tags, platform)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    article.id,
    article.author,
    article.title,
    article.content,
    article.rawContent,
    article.link,
    article.date,
    article.summary,
    article.category?.join(',') || '',
    article.tags?.join(',') || '',
    article.platform,
  ]);

  for (const tag of article.tags || []) {
    await db.run(`INSERT OR IGNORE INTO article_tags (article_id, tag) VALUES (?, ?)`, [article.id, tag]);
  }

  for (const cat of article.category || []) {
    await db.run(`INSERT OR IGNORE INTO article_categories (article_id, category) VALUES (?, ?)`, [article.id, cat]);
  }

  for (const media of article.media || []) {
    await db.run(`INSERT INTO media (article_id, type, url) VALUES (?, ?, ?)`, [article.id, media.type, media.url]);
  }
}

export async function getArticles() {
  const db = await getDb();
  return db.all(`SELECT * FROM articles ORDER BY date DESC`);
}
