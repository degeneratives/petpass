'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="border-2 border-primary"
      >
        <span className="text-lg">🌙</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="border-2 border-primary hover:bg-primary/10 transition-colors"
    >
      {theme === 'dark' ? (
        <span className="text-lg">☀️</span>
      ) : (
        <span className="text-lg">🌙</span>
      )}
    </Button>
  );
}
