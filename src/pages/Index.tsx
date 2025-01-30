import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Timer } from "@/components/Timer";
import { Timeline } from "@/components/Timeline";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";

const Index = () => {
  const [feedTimes, setFeedTimes] = useState<Date[]>([new Date()]);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleFeed = () => {
    const newFeedTime = new Date();
    setFeedTimes([...feedTimes, newFeedTime]);
    toast({
      title: t('feedRecorded'),
      description: t('feedRecordedDesc'),
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
          <Timer lastFeedTime={feedTimes[feedTimes.length - 1]} />
        </div>

        <div className="text-center">
          <Button
            onClick={handleFeed}
            className="bg-baby-blue hover:bg-baby-purple dark:bg-blue-600 dark:hover:bg-purple-600 text-white px-8 py-6 text-xl rounded-full transition-colors"
          >
            {t('feedButton')}
          </Button>
        </div>

        <Timeline feedTimes={feedTimes} />
      </div>
    </div>
  );
};

export default Index;
