import { useEffect, useRef } from 'react';

// Thin bar across the very top of the page that fills as you scroll down.
// The width is written straight to the element (not React state), so
// scrolling never triggers a re-render.
export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const bar = barRef.current;
      if (!bar) return;

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      bar.style.width = `${percent}%`;
    };

    update(); // in case the page loads already scrolled
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update); // the page height changes with the window width
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return <div id="scroll-progress" ref={barRef} aria-hidden="true" />;
}
