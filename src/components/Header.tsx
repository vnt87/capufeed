import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { US } from 'country-flag-icons/react/3x2';
import { VN } from 'country-flag-icons/react/3x2';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Settings } from 'lucide-react';
import { SettingsDialog } from './SettingsDialog';
import { useName } from '@/contexts/NameContext';

export function Header() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { name } = useName();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <>
      <header className="fixed top-0 right-0 z-50">
        <div className="p-2">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost"
                className="w-12 h-12 rounded-full bg-background/50 backdrop-blur-sm shadow-sm hover:bg-accent"
              >
                <Menu className="h-8 w-8" aria-hidden="true" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col space-y-4 mt-4">
                <Button
                  variant="ghost"
                  className="flex justify-start px-4 py-3"
                  onClick={() => {
                    setSettingsOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>{t('settings')}</span>
                  </div>
                </Button>
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    className="flex justify-start px-4 py-3 w-full"
                    onClick={toggleLanguage}
                  >
                    {i18n.language === 'en' ? (
                      <div className="flex items-center gap-2">
                        <US className="h-4 w-4" />
                        <span>English</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <VN className="h-4 w-4" />
                        <span>Tiếng Việt</span>
                      </div>
                    )}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  className="flex justify-start gap-2 px-4 py-3"
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? (
                    <>
                      <Moon className="h-4 w-4" />
                      <span>{t('darkMode')}</span>
                    </>
                  ) : (
                    <>
                      <Sun className="h-4 w-4" />
                      <span>{t('lightMode')}</span>
                    </>
                  )}
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
