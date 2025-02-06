import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { FeedRecord, FeedRecordUpdate } from '../../../src/types/feed';
import { FeedsDb } from './db';

type Bindings = {
  DATABASE_URL: string;
};

type Variables = {
  dbInitialized: boolean;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Enable CORS for all routes
app.use('*', cors());

// Initialize database
import type { MiddlewareHandler } from 'hono';

async function initDb(c: Parameters<MiddlewareHandler<{ Bindings: Bindings; Variables: Variables }>>[0]) {
  await FeedsDb.init();
  c.set('dbInitialized', true);
}

// GET /api/feeds - Get all feeds
app.get('/', async (c) => {
  try {
    if (!c.get('dbInitialized')) await initDb(c);
    const feeds = await FeedsDb.getAll();
    return c.json(feeds);
  } catch (error) {
    console.error('Failed to fetch feeds:', error);
    return c.json({ error: 'Failed to fetch feeds' }, 500);
  }
});

// POST /api/feeds - Create new feed
app.post('/', async (c) => {
  try {
    if (!c.get('dbInitialized')) await initDb(c);
    const data = await c.req.json<FeedRecord>();
    const feed = await FeedsDb.add(data);
    return c.json(feed, 201);
  } catch (error) {
    console.error('Failed to create feed:', error);
    return c.json({ error: 'Failed to create feed' }, 500);
  }
});

// PUT /api/feeds/:id - Update feed
app.put('/:id', async (c) => {
  try {
    if (!c.get('dbInitialized')) await initDb(c);
    const id = c.req.param('id');
    const updates = await c.req.json<FeedRecordUpdate>();
    await FeedsDb.update(id, updates);

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to update feed' }, 500);
  }
});

export default app;
