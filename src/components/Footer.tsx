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
        <div className="flex justify-center items-center gap-4 mb-2">
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
            {name}'s Dad
          </a>
        </div>
      </div>
    </footer>
  );
}
