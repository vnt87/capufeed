import { Button } from '@/components/ui/button';
import { Heart, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useName } from '@/contexts/NameContext';

export function Footer() {
  const { t } = useTranslation();
  const { name } = useName();
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center justify-center gap-6">
          <span className="text-center text-xs text-muted-foreground">
            Made with <Heart className="inline h-4 w-4 text-red-500" /> by{' '}
            <a
              href="https://namvu.net"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-medium text-muted-foreground"
            >
              {name}'s Dad
            </a>
          </span>
          <span className="text-xs text-muted-foreground">|</span>
          <a 
            href="https://github.com/vnt87/capufeed" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center"
          >
            <Github className="h-4 w-4 mr-1" /> Source code
          </a>
        </div>
      </div>
    </footer>
  );
}
