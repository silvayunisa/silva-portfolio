import { useCallback, useState } from 'react';

// Light/dark mode.
//
// The <html data-theme="dark"> attribute is the single source of truth
// (the CSS reads it). The small script in index.html sets it before the
// page paints, so there's no flash; this hook just reads it and lets a
// button flip it, remembering the choice in localStorage ('light'/'dark').

const isDarkNow = () => document.documentElement.getAttribute('data-theme') === 'dark';

// While the theme flips, <html> carries "theme-fade" so all colors ease to their
// new values together (effects.css). It is removed again right after.
const FADE_MS = 500;
let fadeTimer = 0;
const fadeColors = () => {
  const root = document.documentElement;
  root.classList.add('theme-fade');
  clearTimeout(fadeTimer);
  fadeTimer = setTimeout(() => root.classList.remove('theme-fade'), FADE_MS);
};

export function useTheme() {
  const [isDark, setIsDark] = useState(isDarkNow);

  const toggle = useCallback(() => {
    const nextDark = !isDarkNow();
    fadeColors();

    if (nextDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    try {
      localStorage.setItem('theme', nextDark ? 'dark' : 'light');
    } catch (e) {
      /* localStorage unavailable (e.g. private browsing) — still works for this visit */
    }

    setIsDark(nextDark);
  }, []);

  return { isDark, toggle };
}
