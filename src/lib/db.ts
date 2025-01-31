import type { FeedRecord, FeedRecordUpdate } from '@/types/feed';

interface ApiFeed {
  id: string;
  time: string | number;
  amount: number;
}

const API_BASE = '/api/feeds';

export const feedsDb = {
  getAll: async (): Promise<FeedRecord[]> => {
    const response = await fetch(API_BASE);
    if (!response.ok) {
      throw new Error('Failed to fetch feeds');
    }
    const data = await response.json() as ApiFeed[];
    return data.map(feed => ({
      ...feed,
      time: new Date(feed.time)
    }));
  },
  
  add: async (feed: FeedRecord): Promise<FeedRecord> => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feed)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create feed');
    }
    
    return feed;
  },
  
  update: async (id: string, updates: FeedRecordUpdate): Promise<void> => {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update feed');
    }
  },

  getLatest: async (): Promise<FeedRecord | null> => {
    const feeds = await feedsDb.getAll();
    if (feeds.length === 0) return null;
    
    return feeds[0]; // Feeds are already sorted by time DESC from the API
  }
};
