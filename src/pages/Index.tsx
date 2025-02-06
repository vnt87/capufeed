import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useName } from "@/contexts/NameContext";
import { Milk } from "lucide-react";
import { Timer } from "@/components/Timer";
import { Timeline } from "@/components/Timeline";
import { Chart } from "@/components/Chart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { FeedDialog } from "@/components/FeedDialog";
import { CurrentTime } from "@/components/CurrentTime";
import { useFeedStore } from "@/hooks/use-feed-store";

const Index = () => {
  const { feeds, addFeed, updateFeed } = useFeedStore();
  const [feedDialogOpen, setFeedDialogOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { name } = useName();

  // Update document title when name or language changes
  useEffect(() => {
    document.title = t('title', { name });
  }, [t, name]);

  const getLatestFeed = () => {
    return feeds[0]; // Feeds are already sorted by time desc
  };

  const handleFeed = async (amount: number, time: Date) => {
    await addFeed(amount, time);
    toast({
      title: t('feedRecorded'),
      description: t('feedRecordedDesc'),
    });
  };

  if (feeds.length === 0) {
    return (
    <div className="min-h-full bg-baby-background dark:bg-gray-900 p-4 pb-20 transition-colors">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-baby-background dark:bg-gray-900 p-4 pb-20 transition-colors">
      <Header />
      <div className="max-w-md mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-baby-purple dark:text-purple-400 mt-8">
          {t('title', { name })}
        </h1>
        
        <div className="text-center space-y-4">
          <CurrentTime />
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400">{t('timeSinceLastFeed')}</p>
            <Timer lastFeedTime={getLatestFeed().time} />
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => setFeedDialogOpen(true)}
            className="bg-baby-blue hover:bg-baby-purple dark:bg-blue-600 dark:hover:bg-purple-600 text-white px-8 py-6 text-xl rounded-full transition-colors flex items-center gap-2 justify-center"
          >
            <Milk className="w-6 h-6" />
            {t('feedButton')}
          </Button>
        </div>

        <Tabs defaultValue="timeline">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timeline">{t('recentFeeds')}</TabsTrigger>
            <TabsTrigger value="chart">{t('chart')}</TabsTrigger>
          </TabsList>
          <TabsContent value="timeline">
            <Timeline
              feeds={feeds}
              onUpdateFeed={updateFeed}
            />
          </TabsContent>
          <TabsContent value="chart">
            <Chart feeds={feeds} />
          </TabsContent>
        </Tabs>

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
