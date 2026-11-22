import { useEffect, useState } from 'react';

// true once the page has been scrolled further than `threshold` pixels.
//
// Used for things that switch on/off at a scroll position (navbar shadow,
// back-to-top button). State only changes when the answer flips, so React
// doesn't re-render on every scroll event.
export function useScrolledPast(threshold) {
  const [past, setPast] = useState(() => window.scrollY > threshold);

  useEffect(() => {
    const update = () => setPast(window.scrollY > threshold);

    update(); // in case the page loads (or is restored) already scrolled
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [threshold]);

  return past;
}
