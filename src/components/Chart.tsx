import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import type { FeedRecord } from '@/types/feed';
import type { TooltipProps } from 'recharts';
import { format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface ChartProps {
  feeds: FeedRecord[];
}

export const Chart: React.FC<ChartProps> = ({ feeds }) => {
  const { t } = useTranslation();

  const [mode, setMode] = useState<'hourly' | 'daily'>('hourly');
  
  // Get the last 3 days for display
  const last3Days = Array.from({ length: 3 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toLocaleDateString();
  });

  // Calculate stats for each day
  const dailyStats = last3Days.map(date => {
    const stats = feeds.reduce(
      (acc, feed) => {
        if (feed.time.toLocaleDateString() === date) {
          acc.totalAmount += feed.amount;
          acc.feedCount += 1;
        }
        return acc;
      },
      { totalAmount: 0, feedCount: 0, date }
    );
    return stats;
  });

  const getHourlyData = (feeds: FeedRecord[]) => {
    return [...feeds]
      .reverse()
      .map(feed => ({
        time: feed.time.toLocaleTimeString(),
        amount: feed.amount,
        timestamp: feed.time.toISOString(),
      }));
  };

  const getDailyData = (feeds: FeedRecord[]) => {
    const dailyData: { [date: string]: { amount: number, feeds: FeedRecord[] } } = {};
    
    feeds.forEach(feed => {
      const date = format(feed.time, 'MM/dd');
      if (!dailyData[date]) {
        dailyData[date] = { amount: 0, feeds: [] };
      }
      dailyData[date].amount += feed.amount;
      dailyData[date].feeds.push(feed);
    });

    return Object.entries(dailyData)
      .map(([date, data]) => ({
        time: date,
        amount: data.amount
      }))
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  interface TooltipFeed {
    time: string;
    amount: number;
  }

  interface ChartData {
    time: string;
    amount: number;
    timestamp?: string;
    feeds?: TooltipFeed[];
  }

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (!active || !payload || !payload.length) return null;
    
    const data = payload[0].payload;
    
    return (
      <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-lg border dark:border-gray-700">
        {mode === 'hourly' ? (
          <div className="space-y-1">
            <p className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(data.timestamp), 'MM/dd HH:mm')}</span>
            </p>
            <p>{t('amount')}: {data.amount}ml</p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{data.time}</span>
            </p>
            <p>{t('totalAmount', { amount: data.amount })}</p>
          </div>
        )}
      </div>
    );
  };

  const chartData = mode === 'hourly' ? getHourlyData(feeds) : getDailyData(feeds);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {dailyStats.map(({ date, totalAmount, feedCount }) => (
          <div key={date} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center space-y-2">
            <h3 className="font-medium flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </h3>
            <p>{t('totalAmount', { amount: totalAmount })}</p>
            <p>{t('feedCount', { count: feedCount })}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mb-4">
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(value) => value && setMode(value as 'hourly' | 'daily')}
          className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow"
        >
          <ToggleGroupItem value="hourly" className="px-4">
            {t('hourlyMode')}
          </ToggleGroupItem>
          <ToggleGroupItem value="daily" className="px-4">
            {t('dailyMode')}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
