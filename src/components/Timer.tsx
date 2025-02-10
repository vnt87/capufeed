import { useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useName } from "@/contexts/NameContext";
import { ShieldAlert, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CircularProgress } from "@/components/ui/circular-progress";
import { cn } from "@/lib/utils";

interface TimerProps {
  lastFeedTime: Date;
  children?: React.ReactNode;
}

export const Timer = ({ lastFeedTime, children }: TimerProps) => {
  const { t } = useTranslation();
  const { name } = useName();
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const notificationPermission = useRef<NotificationPermission | null>(null);
  const alertNotificationSent = useRef(false);
  const dangerNotificationSent = useRef(false);

  useEffect(() => {
    // Request notification permission on component mount
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        notificationPermission.current = permission;
      });
    }
  }, []);

  const sendNotification = useCallback((title: string, body: string) => {
    if (notificationPermission.current !== 'granted') return;
    
    // Only send notification if the page is not visible
    if (document.visibilityState !== 'visible') {
      new Notification(title, {
        body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png'
      });
    }
  }, []);

  useEffect(() => {
    // Send notifications when thresholds are crossed
    if (hours >= 4 && !dangerNotificationSent.current) {
      sendNotification(
        t('timerDangerNotificationTitle', { name }),
        t('timerDangerTooltip', { name })
      );
      dangerNotificationSent.current = true;
    } else if ((hours + minutes / 60) >= 2.75 && !alertNotificationSent.current) {
      sendNotification(
        t('timerAlertNotificationTitle'),
        t('timerAlertTooltip')
      );
      alertNotificationSent.current = true;
    }

    // Reset notification flags if time goes below thresholds
    if ((hours + minutes / 60) < 2.75) {
      alertNotificationSent.current = false;
      dangerNotificationSent.current = false;
    }
  }, [hours, minutes, sendNotification, t, name]);

  const updateTimer = useCallback(() => {
    const now = new Date();
    const diff = now.getTime() - lastFeedTime.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Calculate progress percentage (4 hours = 100%)
    const totalMinutes = hours * 60 + minutes;
    const progressPercent = Math.min((totalMinutes / (4 * 60)) * 100, 100);
    
    setHours(hours);
    setMinutes(minutes);
    setProgressValue(progressPercent);
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
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          {t("timeSinceLastFeed")}
        </p>
        <div
          className={cn(
            "text-4xl md:text-5xl font-bold tracking-wider",
            hours >= 4 ? "text-destructive" :
            (hours + minutes / 60) >= 2.75 ? "text-amber-500" :
            "text-baby-purple"
          )}
        >
          {elapsedTime}
        </div>
      </div>

      <CircularProgress value={progressValue} size={280} strokeWidth={12}>
        <div className="flex flex-col items-center z-10">
          {children}
        </div>
      </CircularProgress>

      <div className="mt-6">
        {hours >= 4 ? (
          <Badge variant="destructive">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {t("timerDangerTooltip", { name })}
          </Badge>
        ) : (hours + minutes / 60) >= 2.75 ? (
          <Badge variant="default" className="bg-amber-500 text-white">
            <ShieldAlert className="h-4 w-4 mr-1" />
            {t("timerAlertTooltip")}
          </Badge>
        ) : null}
      </div>
    </div>
  );
};
