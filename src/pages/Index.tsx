import { useState } from "react";
import { Timer } from "@/components/Timer";
import { Timeline } from "@/components/Timeline";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [feedTimes, setFeedTimes] = useState<Date[]>([new Date()]);
  const { toast } = useToast();

  const handleFeed = () => {
    const newFeedTime = new Date();
    setFeedTimes([...feedTimes, newFeedTime]);
    toast({
      title: "Feed recorded!",
      description: "New feeding time has been added to the timeline.",
    });
  };

  return (
    <div className="min-h-screen bg-baby-background p-4">
      <div className="max-w-md mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-baby-purple mt-8">
          Baby Feeding Tracker
        </h1>
        
        <div className="text-center space-y-2">
          <p className="text-gray-600">Time since last feed</p>
          <Timer lastFeedTime={feedTimes[feedTimes.length - 1]} />
        </div>

        <div className="text-center">
          <Button
            onClick={handleFeed}
            className="bg-baby-blue hover:bg-baby-purple text-white px-8 py-6 text-xl rounded-full transition-colors"
          >
            Feed
          </Button>
        </div>

        <Timeline feedTimes={feedTimes} />
      </div>
    </div>
  );
};

export default Index;