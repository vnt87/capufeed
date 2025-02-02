import {
  format,
  isToday,
  isYesterday,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";
import { enUS, vi } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { Pencil, Milk } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { EditFeedDialog } from "./EditFeedDialog";
import type { FeedRecord, FeedRecordUpdate } from "@/types/feed";

interface TimelineProps {
  feeds: FeedRecord[];
  onUpdateFeed: (id: string, updates: FeedRecordUpdate) => Promise<void>;
}

export const Timeline = ({ feeds, onUpdateFeed }: TimelineProps) => {
  const { t, i18n } = useTranslation();
  const now = new Date();
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const [editingFeed, setEditingFeed] = useState<FeedRecord | null>(null);

  const recentFeeds = feeds
    .filter(feed => feed.time > fortyEightHoursAgo)
    .sort((a, b) => b.time.getTime() - a.time.getTime());

  const formatTimeLabel = (time: Date) => {
    if (isToday(time)) {
      return t('today');
    }
    if (isYesterday(time)) {
      return t('yesterday');
    }
    const days = differenceInDays(now, time);
    return t('daysAgo', { count: days });
  };

  const formatTime = (time: Date) => {
    return format(time, "HH:mm", {
      locale: i18n.language === 'vi' ? vi : enUS
    });
  };

  const formatTimeSinceLastFeed = (currentTime: Date, previousTime: Date | undefined) => {
    if (!previousTime) return null;

    const hours = differenceInHours(currentTime, previousTime);
    const minutes = differenceInMinutes(currentTime, previousTime) % 60;

    if (hours === 0) {
      return t('timeLastFeed', { time: t('minutesFormat', { minutes }) });
    }
    return t('timeLastFeed', { time: t('hoursMinutesFormat', { hours, minutes }) });
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-6 text-baby-purple dark:text-purple-400">
        {t('recentFeeds')}
      </h2>
      
      <div className="relative space-y-4">
        {/* Vertical Track */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-baby-blue/20 dark:bg-blue-600/20" />
        
        {recentFeeds.map((feed, index) => {
          const prevFeed = recentFeeds[index + 1];
          const timeSinceLastFeed = formatTimeSinceLastFeed(feed.time, prevFeed?.time);

          return (
            <div
              key={feed.id}
              className="relative flex items-center pl-12"
            >
              {/* Dot connected to track */}
              <div className="absolute left-3 w-3 h-3 rounded-full bg-white dark:bg-gray-900 border-4 border-baby-blue dark:border-blue-600" />
              
              {/* Feed info */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full shadow-sm transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {formatTime(feed.time)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
            if (!editingFeed) {
              setEditingFeed(feed);
            }
          }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {formatTimeLabel(feed.time)}
                  </span>
                  <span className="font-medium text-baby-blue dark:text-blue-400 flex items-center gap-1">
                    <Milk className="h-4 w-4" />
                    {feed.amount}ml
                  </span>
                </div>
                {timeSinceLastFeed && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {timeSinceLastFeed}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {recentFeeds.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            {t('noRecentFeeds')}
          </div>
        )}
      </div>

      {editingFeed && (
        <EditFeedDialog
          record={editingFeed}
          open={true}
          onOpenChange={(open) => !open && setEditingFeed(null)}
          onSubmit={onUpdateFeed}
        />
      )}
    </div>
  );
};
