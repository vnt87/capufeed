import { Client } from '@neondatabase/serverless';
import type { FeedRecord } from '../../../src/types/feed';

const client = new Client(process.env.DATABASE_URL);

export class FeedsDb {
  static async init() {
    await client.connect();
    // Create table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS feeds (
        id TEXT PRIMARY KEY,
        time TIMESTAMP WITH TIME ZONE NOT NULL,
        amount INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_feeds_time ON feeds(time DESC);
    `);
  }

  static async getAll(): Promise<FeedRecord[]> {
    const { rows } = await client.query<{id: string, time: Date, amount: number}>(
      'SELECT * FROM feeds ORDER BY time DESC'
    );
    return rows.map(row => ({
      id: row.id,
      time: new Date(row.time),
      amount: row.amount
    }));
  }

  static async add(feed: FeedRecord): Promise<FeedRecord> {
    await client.query(
      'INSERT INTO feeds (id, time, amount) VALUES ($1, $2, $3)',
      [feed.id, feed.time, feed.amount]
    );
    return feed;
  }

  static async update(id: string, updates: Partial<Omit<FeedRecord, 'id'>>): Promise<void> {
    const values: (Date | number | string)[] = [];
    const updateEntries = Object.entries(updates);
    if (updateEntries.length === 0) return;

    const setClauses = updateEntries.map(([key, value], index) => {
      if (value !== undefined) {
        values.push(value);
        return `${key} = $${index + 1}`;
      }
      return null;
    }).filter((clause): clause is string => clause !== null);

    if (setClauses.length === 0) return;
    
    // Add id as the last parameter
    values.push(id);
    await client.query(
      `UPDATE feeds SET ${setClauses.join(', ')} WHERE id = $${values.length}`,
      values
    );
  }

  static async getLatest(): Promise<FeedRecord | null> {
    const { rows } = await client.query<{id: string, time: Date, amount: number}>(
      'SELECT * FROM feeds ORDER BY time DESC LIMIT 1'
    );
    if (rows.length === 0) return null;
    
    const row = rows[0];
    return {
      id: row.id,
      time: new Date(row.time),
      amount: row.amount
    };
  }

  static async reset(): Promise<void> {
    await client.query('DELETE FROM feeds');
  }

  static async close() {
    await client.end();
  }
}
