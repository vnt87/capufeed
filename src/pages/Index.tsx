import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Timer } from "@/components/Timer";
import { Timeline } from "@/components/Timeline";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { FeedDialog } from "@/components/FeedDialog";
import type { FeedRecord, FeedRecordUpdate } from "@/types/feed";

const generateId = () => Math.random().toString(36).slice(2);

const Index = () => {
  const [feeds, setFeeds] = useState<FeedRecord[]>([{
    id: generateId(),
    time: new Date(),
    amount: 120
  }]);
  const [feedDialogOpen, setFeedDialogOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const getLastFeed = () => {
    return feeds.reduce((latest, feed) => 
      feed.time > latest.time ? feed : latest
    , feeds[0]);
  };

  const handleFeed = (amount: number) => {
    const newFeed: FeedRecord = {
      id: generateId(),
      time: new Date(),
      amount
    };
    setFeeds([...feeds, newFeed]);
    toast({
      title: t('feedRecorded'),
      description: t('feedRecordedDesc'),
    });
  };

  const handleUpdateFeed = (id: string, updates: FeedRecordUpdate) => {
    setFeeds(currentFeeds => {
      const newFeeds = currentFeeds.map(feed => 
        feed.id === id 
          ? { ...feed, ...updates }
          : feed
      );
      // Sort feeds by time
      newFeeds.sort((a, b) => b.time.getTime() - a.time.getTime());
      return newFeeds;
    });
    toast({
      title: t('updateSuccess'),
    });
  };

  return (
    <div className="min-h-screen bg-baby-background dark:bg-gray-900 p-4 transition-colors">
      <Header />
      <div className="max-w-md mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-baby-purple dark:text-purple-400 mt-8">
          {t('title')}
        </h1>
        
        <div className="text-center space-y-2">
          <p className="text-gray-600 dark:text-gray-400">{t('timeSinceLastFeed')}</p>
          <Timer lastFeedTime={getLastFeed().time} />
        </div>

        <div className="text-center">
          <Button
            onClick={() => setFeedDialogOpen(true)}
            className="bg-baby-blue hover:bg-baby-purple dark:bg-blue-600 dark:hover:bg-purple-600 text-white px-8 py-6 text-xl rounded-full transition-colors"
          >
            {t('feedButton')}
          </Button>
        </div>

        <Timeline
          feeds={feeds}
          onUpdateFeed={handleUpdateFeed}
        />

        <FeedDialog
          open={feedDialogOpen}
          onOpenChange={setFeedDialogOpen}
          onSubmit={handleFeed}
        />
      </div>
    </div>
  );
};

export default Index;
