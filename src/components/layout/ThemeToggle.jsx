import { useTheme } from '../../hooks/useTheme.js';
import { MoonIcon, SunIcon } from '../ui/Icons.jsx';

// Shows the icon of the mode you'd switch TO: a moon while in light mode,
// a sun while in dark mode.
export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      onClick={toggle}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
