'use client';

import { MoonStar, SunMedium } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('groweasy-theme') ?? 'dark';
    const isDark = stored === 'dark';
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }, []);

  function toggleTheme() {
    setDark((current) => {
      const nextTheme = !current;
      localStorage.setItem('groweasy-theme', nextTheme ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', nextTheme);
      document.documentElement.style.colorScheme = nextTheme ? 'dark' : 'light';
      return nextTheme;
    });
  }

  return (
    <Button type="button" variant="outline" onClick={toggleTheme} className="gap-3 px-3">
      <span className="hidden sm:inline text-sm font-medium">Theme</span>
      {dark ? <MoonStar className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
    </Button>
  );
}