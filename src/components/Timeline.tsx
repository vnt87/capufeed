import { format } from "date-fns";

interface TimelineProps {
  feedTimes: Date[];
}

export const Timeline = ({ feedTimes }: TimelineProps) => {
  const now = new Date();
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  
  const recentFeeds = feedTimes
    .filter(time => time > fortyEightHoursAgo)
    .sort((a, b) => b.getTime() - a.getTime());

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4 text-baby-purple">Recent Feeds</h2>
      <div className="space-y-2">
        {recentFeeds.map((time, index) => (
          <div
            key={time.getTime()}
            className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-baby-blue" />
            <span className="text-gray-600">
              {format(time, "MMM d, h:mm a")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};