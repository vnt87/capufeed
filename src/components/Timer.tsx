import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useName } from "@/contexts/NameContext";
import { ShieldAlert, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TimerProps {
  lastFeedTime: Date;
}

export const Timer = ({ lastFeedTime }: TimerProps) => {
  const { t } = useTranslation();
  const { name } = useName();
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const updateTimer = useCallback(() => {
    const now = new Date();
    const diff = now.getTime() - lastFeedTime.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setHours(hours);
    setMinutes(minutes);
    setElapsedTime(
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
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "text-5xl md:text-6xl font-bold tracking-wider",
          hours >= 4 ? "text-destructive" :
          (hours + minutes / 60) >= 2.75 ? "text-amber-500" :
          "text-baby-purple"
        )}
      >
        {elapsedTime}
      </div>
      
      {hours >= 4 ? (
        <Badge variant="destructive" className="mt-2">
          <AlertTriangle className="h-4 w-4 mr-1" />
          {t("timerDangerTooltip", { name })}
        </Badge>
      ) : (hours + minutes / 60) >= 2.75 ? (
        <Badge variant="default" className="mt-2 bg-amber-500 text-white">
          <ShieldAlert className="h-4 w-4 mr-1" />
          {t("timerAlertTooltip")}
        </Badge>
      ) : null}
    </div>
  );
};
