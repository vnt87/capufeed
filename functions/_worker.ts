import { Hono } from 'hono';

const app = new Hono();

// Load route handlers
import feeds from './api/feeds/[[route]]';
app.route('/api/feeds', feeds);

// Error handling
app.onError((err, c) => {
  console.error(`[${c.req.method}] ${c.req.url}:`, err);
  return c.json({
    error: 'Internal Server Error',
    message: err.message
  }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  }, 404);
});

export default app;
