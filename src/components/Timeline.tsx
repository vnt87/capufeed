import { format, isToday, isYesterday, differenceInDays } from "date-fns";
import { vi } from "date-fns/locale";
import { useTranslation } from "react-i18next";

interface TimelineProps {
  feedTimes: Date[];
}

export const Timeline = ({ feedTimes }: TimelineProps) => {
  const { t, i18n } = useTranslation();
  const now = new Date();
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  
  const recentFeeds = feedTimes
    .filter(time => time > fortyEightHoursAgo)
    .sort((a, b) => b.getTime() - a.getTime());

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
      locale: i18n.language === 'vi' ? vi : undefined
    });
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-6 text-baby-purple dark:text-purple-400">
        {t('recentFeeds')}
      </h2>
      
      <div className="relative space-y-4">
        {/* Vertical Track */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-baby-blue/20 dark:bg-blue-600/20" />
        
        {recentFeeds.map((time, index) => (
          <div
            key={time.getTime()}
            className="relative flex items-center pl-12"
          >
            {/* Dot connected to track */}
            <div className="absolute left-3 w-3 h-3 rounded-full bg-white dark:bg-gray-900 border-4 border-baby-blue dark:border-blue-600" />
            
            {/* Time info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full shadow-sm transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {formatTime(time)}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {formatTimeLabel(time)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {recentFeeds.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            {t('noRecentFeeds')}
          </div>
        )}
      </div>
    </div>
  );
};
