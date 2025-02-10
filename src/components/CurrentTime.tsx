import { useEffect, useState } from "react";
import { format } from "date-fns";
import { enUS, vi } from "date-fns/locale";
import { useTranslation } from "react-i18next";

export function CurrentTime() {
  const [time, setTime] = useState(new Date());
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-4 left-4">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {format(time, "PPpp", {
          locale: i18n.language === 'vi' ? vi : enUS
        })}
      </div>
    </div>
  );
}
