import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import type { FeedRecord } from '@/types/feed';

interface ChartProps {
  feeds: FeedRecord[];
}

export const Chart: React.FC<ChartProps> = ({ feeds }) => {
  const { t } = useTranslation();

  // Calculate today's stats
  const today = new Date().toLocaleDateString();
  const todayStats = feeds.reduce(
    (acc, feed) => {
      if (feed.time.toLocaleDateString() === today) {
        acc.totalAmount += feed.amount;
        acc.feedCount += 1;
      }
      return acc;
    },
    { totalAmount: 0, feedCount: 0 }
  );

  const chartData = [...feeds]
    .reverse()
    .map(feed => ({
      time: feed.time.toLocaleTimeString(),
      amount: feed.amount,
    }));

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center space-y-2">
        <h3 className="font-medium">{today}</h3>
        <p>{t('totalAmount', { amount: todayStats.totalAmount })}</p>
        <p>{t('feedCount', { count: todayStats.feedCount })}</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
