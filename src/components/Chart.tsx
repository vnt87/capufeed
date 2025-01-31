import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { FeedRecord } from '@/types/feed';

interface ChartProps {
  feeds: FeedRecord[];
}

export const Chart: React.FC<ChartProps> = ({ feeds }) => {
  const chartData = [...feeds]
    .reverse()
    .map(feed => ({
      time: feed.time.toLocaleTimeString(),
      amount: feed.amount,
    }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="amount" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};
