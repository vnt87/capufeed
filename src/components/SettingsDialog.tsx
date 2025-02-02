import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useName } from '@/contexts/NameContext';
import { US, VN } from 'country-flag-icons/react/3x2';
import { Download, Moon, Sun, Upload } from 'lucide-react';
import { feedsDb } from '@/lib/db';

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
            <div className="flex justify-between gap-2">
              <div className="flex-1">
                <Label>{t('language')}</Label>
                <Button
                  variant="outline"
                  className="flex justify-center gap-2 w-full mt-2"
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
              <div className="flex-1">
                <Label>{t('appearance')}</Label>
                <Button
                  variant="outline"
                  className="flex justify-center gap-2 w-full mt-2"
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
          </div>

          <div className="grid gap-2">
            <Label>{t('data')}</Label>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="flex gap-2 flex-1"
                onClick={async () => {
                  const feeds = await feedsDb.getAll();
                  const serializedFeeds = feeds.map(f => ({
                    ...f,
                    time: f.time.getTime()
                  }));
                  const blob = new Blob([JSON.stringify(serializedFeeds, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'timeline.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="h-4 w-4" />
                {t('export')}
              </Button>
              <Button
                variant="secondary"
                className="flex gap-2 flex-1"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.json';
                  input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (!file) return;

                    try {
                      const text = await file.text();
                      const data = JSON.parse(text);
                      
                      // Validate data structure
                      if (!Array.isArray(data)) throw new Error('Invalid data format');
                      
                      for (const item of data) {
                        if (!item.id || !item.time || typeof item.amount !== 'number') {
                          throw new Error('Invalid data structure');
                        }
                      }

                      localStorage.setItem('feed-track-feeds', text);
                      window.location.reload(); // Reload to reflect changes
                    } catch (error) {
                      alert(t('invalidFile'));
                    }
                  };
                  input.click();
                }}
              >
                <Upload className="h-4 w-4" />
                {t('import')}
              </Button>
            </div>
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
