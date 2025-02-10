import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { addHours } from "date-fns";

interface NextFeedTimerProps {
  lastFeedTime: Date;
}

export function NextFeedTimer({ lastFeedTime }: NextFeedTimerProps) {
  const { t } = useTranslation();
  const [timeUntilNext, setTimeUntilNext] = useState("00:00:00");
  const [isOverdue, setIsOverdue] = useState(false);

  const updateTimer = useCallback(() => {
    const now = new Date();
    const nextFeedTime = addHours(lastFeedTime, 4);
    const diff = nextFeedTime.getTime() - now.getTime();
    
    if (diff <= 0) {
      setIsOverdue(true);
      setTimeUntilNext("00:00:00");
      return;
    }

    setIsOverdue(false);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTimeUntilNext(
      `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    );
  }, [lastFeedTime]);

  useEffect(() => {
    const interval = setInterval(updateTimer, 1000);
    updateTimer(); // Initial call
    
    return () => clearInterval(interval);
  }, [updateTimer]);

  return (
    <div className="text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
        {isOverdue ? t('feedingOverdue') : "Time until next feed (est.)"}
      </p>
      <div
        className={`text-4xl md:text-5xl font-bold tracking-wider ${
          isOverdue ? "text-destructive" : "text-baby-purple dark:text-purple-400"
        }`}
      >
        {timeUntilNext}
      </div>
    </div>
  );
}
