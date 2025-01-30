import { useEffect, useState } from "react";

interface TimerProps {
  lastFeedTime: Date;
}

export const Timer = ({ lastFeedTime }: TimerProps) => {
  const [elapsedTime, setElapsedTime] = useState("00:00:00");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = now.getTime() - lastFeedTime.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setElapsedTime(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    const interval = setInterval(updateTimer, 1000);
    updateTimer(); // Initial call

    return () => clearInterval(interval);
  }, [lastFeedTime]);

  return (
    <div className="text-5xl md:text-6xl font-bold text-baby-purple tracking-wider">
      {elapsedTime}
    </div>
  );
};