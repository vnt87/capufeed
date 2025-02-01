import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useName } from '@/contexts/NameContext';
import { US, VN } from 'country-flag-icons/react/3x2';
import { Moon, Sun } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: string;
  toggleLanguage: () => void;
}

export function SettingsDialog({ 
  open, 
  onOpenChange,
  theme,
  toggleTheme,
  language,
  toggleLanguage
}: SettingsDialogProps) {
  const { t } = useTranslation();
  const { name, setName } = useName();
  const isMobile = useIsMobile();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[425px] ${isMobile ? "translate-y-[-20%]" : ""}`}>
        <DialogHeader>
          <DialogTitle>{t('settings')}</DialogTitle>
          <DialogDescription>
            {t('settingsDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t('babyName')}</Label>
            <Input
              id="name"
              value={name}
              onChange={handleNameChange}
              placeholder={t('enterBabyName')}
              maxLength={50}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>{t('language')}</Label>
            <Button
              variant="outline"
              className="flex justify-start gap-2 w-full"
              onClick={toggleLanguage}
            >
              {language === 'en' ? (
                <>
                  <US className="h-4 w-4" />
                  <span>English</span>
                </>
              ) : (
                <>
                  <VN className="h-4 w-4" />
                  <span>Tiếng Việt</span>
                </>
              )}
            </Button>
          </div>

          <div className="grid gap-2">
            <Label>{t('appearance')}</Label>
            <Button
              variant="outline"
              className="flex justify-start gap-2 w-full"
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
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button type="button" onClick={() => onOpenChange(false)}>
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
