import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { SettingsDialog } from './SettingsDialog';
import { useName } from '@/contexts/NameContext';

export function Header() {
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { name } = useName();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <>
      <header className="fixed top-0 right-0 z-50">
        <div className="p-2">
          <Button 
            variant="ghost"
            className="w-12 h-12 rounded-full bg-background/50 backdrop-blur-sm shadow-sm hover:bg-accent"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="h-8 w-8" aria-hidden="true" />
            <span className="sr-only">Open settings</span>
          </Button>
        </div>
      </header>
      <SettingsDialog 
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        theme={theme}
        toggleTheme={toggleTheme}
        language={i18n.language}
        toggleLanguage={toggleLanguage}
      />
    </>
  );
}
