import type { FeedRecord, FeedRecordUpdate } from '@/types/feed';

const STORAGE_KEY = 'feed-track-feeds';

export const feedsDb = {
  getAll: async (): Promise<FeedRecord[]> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const feeds = JSON.parse(stored);
      if (!Array.isArray(feeds)) throw new Error('Invalid data format');
      
      return feeds.map(feed => ({
        ...feed,
        time: new Date(feed.time)
      }));
    } catch (err) {
      console.error('Error reading from localStorage:', err);
      throw new Error('Failed to read feed data');
    }
  },
  
  add: async (feed: FeedRecord): Promise<FeedRecord> => {
    try {
      const feeds = await feedsDb.getAll();
      feeds.push(feed);
      const serializedFeeds = feeds.map(f => ({
        ...f,
        time: f.time.getTime()
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedFeeds));
      return feed;
    } catch (err) {
      console.error('Error adding feed:', err);
      throw new Error('Failed to save feed data');
    }
  },
  
  update: async (id: string, updates: FeedRecordUpdate): Promise<void> => {
    try {
      const feeds = await feedsDb.getAll();
      const index = feeds.findIndex(feed => feed.id === id);
      
      if (index === -1) {
        throw new Error('Feed not found');
      }

      feeds[index] = {
        ...feeds[index],
        ...updates
      };

      const serializedFeeds = feeds.map(f => ({
        ...f,
        time: f.time.getTime()
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedFeeds));
    } catch (err) {
      console.error('Error updating feed:', err);
      throw new Error('Failed to update feed data');
    }
  },

  getLatest: async (): Promise<FeedRecord | null> => {
    try {
      const feeds = await feedsDb.getAll();
      if (feeds.length === 0) return null;
      
      return feeds.reduce((latest, feed) => 
        feed.time > latest.time ? feed : latest
      , feeds[0]);
    } catch (err) {
      console.error('Error getting latest feed:', err);
      throw new Error('Failed to get latest feed data');
    }
  },

  reset: async (): Promise<void> => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Error resetting database:', err);
      throw new Error('Failed to reset feed data');
    }
  }
};
