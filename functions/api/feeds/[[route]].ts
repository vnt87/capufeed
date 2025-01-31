import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { FeedRecord, FeedRecordUpdate } from '../../../src/types/feed';

interface DbFeed {
  id: string;
  time: number;
  amount: number;
}

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for all routes
app.use('*', cors());

// GET /api/feeds - Get all feeds
app.get('/', async (c) => {
  try {
    const result = await c.env.DB
      .prepare('SELECT * FROM feeds ORDER BY time DESC')
      .all<DbFeed>();
    
    const feeds = (result.results || []).map(row => ({
      id: row.id,
      time: new Date(row.time),
      amount: row.amount
    }));

    return c.json(feeds);
  } catch (error) {
    return c.json({ error: 'Failed to fetch feeds' }, 500);
  }
});

// POST /api/feeds - Create new feed
app.post('/', async (c) => {
  try {
    const data = await c.req.json<FeedRecord>();
    
    await c.env.DB
      .prepare('INSERT INTO feeds (id, time, amount) VALUES (?, ?, ?)')
      .bind(data.id, data.time.getTime(), data.amount)
      .run();

    return c.json(data, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create feed' }, 500);
  }
});

// PUT /api/feeds/:id - Update feed
app.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json<FeedRecordUpdate>();
    
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

    if (sets.length > 0) {
      values.push(id);
      await c.env.DB
        .prepare(`UPDATE feeds SET ${sets.join(', ')} WHERE id = ?`)
        .bind(...values)
        .run();
    }

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to update feed' }, 500);
  }
});

export default app;
