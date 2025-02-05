import { useState, useEffect, useCallback } from "react";
import { feedsDb } from "@/lib/db";
import type { FeedRecord, FeedRecordUpdate } from "@/types/feed";

const generateId = () => Math.random().toString(36).slice(2);

export function useFeedStore() {
  const [feeds, setFeeds] = useState<FeedRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    let mounted = true;
    
    async function loadFeeds() {
      try {
        setIsLoading(true);
        setError(null);
        
        let storedFeeds = await feedsDb.getAll();
        
        // Only proceed if component is still mounted
        if (!mounted) return;
        
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
      } catch (err) {
        if (!mounted) return;
        console.error('Failed to load feeds:', err);
        setError('Failed to load data. Please refresh the page.');
        
        // Try to recover by loading from backup or clearing corrupted data
        try {
          await feedsDb.reset();
          const initialFeed: FeedRecord = {
            id: generateId(),
            time: new Date(),
            amount: 120
          };
          await feedsDb.add(initialFeed);
          setFeeds([initialFeed]);
          setError(null);
        } catch (recoveryErr) {
          console.error('Recovery failed:', recoveryErr);
          setError('Unable to recover data. Please clear your browser data and refresh.');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadFeeds();
    
    return () => {
      mounted = false;
    };
  }, []);

  const addFeed = useCallback(async (amount: number, time: Date = new Date()) => {
    try {
      const newFeed: FeedRecord = {
        id: generateId(),
        time,
        amount
      };
      await feedsDb.add(newFeed);
      setFeeds(current => 
        [...current, newFeed].sort((a, b) => b.time.getTime() - a.time.getTime())
      );
      return newFeed;
    } catch (err) {
      console.error('Error adding feed:', err);
      setError('Failed to save feed data. Please try again.');
      throw err;
    }
  }, []);

  const updateFeed = useCallback(async (id: string, updates: FeedRecordUpdate) => {
    try {
      await feedsDb.update(id, updates);
      setFeeds(current => {
        const newFeeds = current.map(feed => 
          feed.id === id 
            ? { ...feed, ...updates }
            : feed
        );
        return newFeeds.sort((a, b) => b.time.getTime() - a.time.getTime());
      });
    } catch (err) {
      console.error('Error updating feed:', err);
      setError('Failed to update feed data. Please try again.');
      throw err;
    }
  }, []);

  return {
    feeds,
    isLoading,
    error,
    addFeed,
    updateFeed
  };
}
