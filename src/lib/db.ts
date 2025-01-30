import type { FeedRecord, FeedRecordUpdate } from '@/types/feed';

const DB_NAME = 'feed-track';
const STORE_NAME = 'feeds';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

async function getStore(mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, mode);
  return transaction.objectStore(STORE_NAME);
}

export const feedsDb = {
  getAll: async (): Promise<FeedRecord[]> => {
    const store = await getStore();
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        // Convert stored timestamps back to Date objects
        const feeds = request.result.map(feed => ({
          ...feed,
          time: new Date(feed.time)
        }));
        resolve(feeds);
      };
    });
  },
  
  add: async (feed: FeedRecord): Promise<FeedRecord> => {
    const store = await getStore('readwrite');
    return new Promise((resolve, reject) => {
      // Store dates as timestamps for better serialization
      const serializedFeed = {
        ...feed,
        time: feed.time.getTime()
      };
      const request = store.add(serializedFeed);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(feed);
    });
  },
  
  update: async (id: string, updates: FeedRecordUpdate): Promise<void> => {
    const store = await getStore('readwrite');
    return new Promise((resolve, reject) => {
      const getRequest = store.get(id);
      getRequest.onerror = () => reject(getRequest.error);
      getRequest.onsuccess = () => {
        const feed = getRequest.result;
        if (!feed) {
          reject(new Error('Feed not found'));
          return;
        }

        const updatedFeed = {
          ...feed,
          ...updates,
          time: updates.time ? updates.time.getTime() : feed.time
        };

        const putRequest = store.put(updatedFeed);
        putRequest.onerror = () => reject(putRequest.error);
        putRequest.onsuccess = () => resolve();
      };
    });
  },

  getLatest: async (): Promise<FeedRecord | null> => {
    const feeds = await feedsDb.getAll();
    if (feeds.length === 0) return null;
    
    return feeds.reduce((latest, feed) => 
      feed.time > latest.time ? feed : latest
    , feeds[0]);
  }
};
