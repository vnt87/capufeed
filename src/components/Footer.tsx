import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Heart, Github } from 'lucide-react';
import { US } from 'country-flag-icons/react/3x2';
import { VN } from 'country-flag-icons/react/3x2';

export function Footer() {
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-center items-center gap-4 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="rounded-full"
          >
            {i18n.language === 'en' ? (
              <US className="h-5 w-5" />
            ) : (
              <VN className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            asChild
          >
            <a
              href="https://github.com/vnt87/feed-track-snap"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" />
            </a>
          </Button>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Made with <Heart className="inline h-4 w-4 text-red-500" /> by{' '}
          <a
            href="https://namvu.net"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline font-medium text-foreground"
          >
            Capu's Dad
          </a>
        </div>
      </div>
    </footer>
  );
}
