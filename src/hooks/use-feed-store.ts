import { useState, useEffect, useCallback } from "react";
import { feedsDb } from "@/lib/db";
import type { FeedRecord, FeedRecordUpdate } from "@/types/feed";

const generateId = () => Math.random().toString(36).slice(2);

export function useFeedStore() {
  const [feeds, setFeeds] = useState<FeedRecord[]>([]);

  // Load initial data
  useEffect(() => {
    async function loadFeeds() {
      let storedFeeds = await feedsDb.getAll();
      
      if (storedFeeds.length === 0) {
        // Add initial feed if no data exists
        const initialFeed: FeedRecord = {
          id: generateId(),
          time: new Date(),
          amount: 120
        };
        await feedsDb.add(initialFeed);
        storedFeeds = [initialFeed];
      }

      setFeeds(storedFeeds.sort((a, b) => b.time.getTime() - a.time.getTime()));
    }

    loadFeeds();
  }, []);

  const addFeed = useCallback(async (amount: number) => {
    const newFeed: FeedRecord = {
      id: generateId(),
      time: new Date(),
      amount
    };
    await feedsDb.add(newFeed);
    setFeeds(current => 
      [...current, newFeed].sort((a, b) => b.time.getTime() - a.time.getTime())
    );
    return newFeed;
  }, []);

  const updateFeed = useCallback(async (id: string, updates: FeedRecordUpdate) => {
    await feedsDb.update(id, updates);
    setFeeds(current => {
      const newFeeds = current.map(feed => 
        feed.id === id 
          ? { ...feed, ...updates }
          : feed
      );
      return newFeeds.sort((a, b) => b.time.getTime() - a.time.getTime());
    });
  }, []);

  return {
    feeds,
    addFeed,
    updateFeed
  };
}
