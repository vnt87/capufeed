import type { FeedRecord, FeedRecordUpdate } from '@/types/feed';

const STORAGE_KEY = 'feed-track-feeds';

export const feedsDb = {
  getAll: async (): Promise<FeedRecord[]> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const feeds = stored ? JSON.parse(stored) : [];
    return feeds.map(feed => ({
      ...feed,
      time: new Date(feed.time)
    }));
  },
  
  add: async (feed: FeedRecord): Promise<FeedRecord> => {
    const feeds = await feedsDb.getAll();
    feeds.push(feed);
    const serializedFeeds = feeds.map(f => ({
      ...f,
      time: f.time.getTime()
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedFeeds));
    return feed;
  },
  
  update: async (id: string, updates: FeedRecordUpdate): Promise<void> => {
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
  },

  getLatest: async (): Promise<FeedRecord | null> => {
    const feeds = await feedsDb.getAll();
    if (feeds.length === 0) return null;
    
    return feeds.reduce((latest, feed) => 
      feed.time > latest.time ? feed : latest
    , feeds[0]);
  }
};
