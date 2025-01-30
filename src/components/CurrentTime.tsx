import { useEffect, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
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
    <div className="space-y-1">
      <p className="text-gray-600 dark:text-gray-400">
        {t("currentTime")}
      </p>
      <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        {format(time, "HH:mm:ss", {
          locale: i18n.language === 'vi' ? vi : undefined
        })}
      </div>
    </div>
  );
}
