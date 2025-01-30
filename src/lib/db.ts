import Database from 'better-sqlite3';
import type { FeedRecord, FeedRecordUpdate } from '@/types/feed';

interface DbRow {
  id: string;
  time: number;
  amount: number;
}

const db = new Database('feeds.db');

// Create feeds table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS feeds (
    id TEXT PRIMARY KEY,
    time INTEGER NOT NULL,
    amount INTEGER NOT NULL
  )
`);

export const feedsDb = {
  getAll: (): FeedRecord[] => {
    const rows = db.prepare('SELECT * FROM feeds').all() as DbRow[];
    return rows.map(row => ({
      id: row.id,
      time: new Date(row.time),
      amount: row.amount
    }));
  },
  
  add: (feed: FeedRecord): FeedRecord => {
    const stmt = db.prepare(
      'INSERT INTO feeds (id, time, amount) VALUES (?, ?, ?)'
    );
    stmt.run(feed.id, feed.time.getTime(), feed.amount);
    return feed;
  },
  
  update: (id: string, updates: FeedRecordUpdate): void => {
    const sets: string[] = [];
    const values: (number | string)[] = [];
    
    if (updates.time) {
      sets.push('time = ?');
      values.push(updates.time.getTime());
    }
    if (typeof updates.amount !== 'undefined') {
      sets.push('amount = ?');
      values.push(updates.amount);
    }
    values.push(id);
    
    if (sets.length > 0) {
      const stmt = db.prepare(
        `UPDATE feeds SET ${sets.join(', ')} WHERE id = ?`
      );
      stmt.run(...values);
    }
  },

  getLatest: (): FeedRecord | null => {
    const row = db.prepare(
      'SELECT * FROM feeds ORDER BY time DESC LIMIT 1'
    ).get() as DbRow | undefined;
    
    if (row) {
      return {
        id: row.id,
        time: new Date(row.time),
        amount: row.amount
      };
    }
    return null;
  }
};
