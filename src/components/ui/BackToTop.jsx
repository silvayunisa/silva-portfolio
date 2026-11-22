import { useScrolledPast } from '../../hooks/useScroll.js';

// Round "↑" button, bottom-right. Appears after scrolling down a bit and
// scrolls smoothly back to the top (instantly if the visitor prefers reduced motion).
export default function BackToTop() {
  const visible = useScrolledPast(400);

  const scrollToTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      className={visible ? 'back-to-top is-visible' : 'back-to-top'}
      aria-label="Back to top"
      onClick={scrollToTop}
    >
      ↑
    </button>
  );
}
