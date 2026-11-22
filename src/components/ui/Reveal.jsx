import { useEffect, useRef, useState } from 'react';

// Scroll-reveal: wraps an element so it fades + slides up the first time it
// scrolls into view. It renders the element itself (no extra wrapper), so the
// layout and CSS selectors stay exactly as they were:
//
//   <Reveal as="h2" className="section-title">Projects</Reveal>
//   <Reveal as="article" className="project-card" delay={0.16}>...</Reveal>
//
// - `as`    the HTML tag to render (default "div")
// - `delay` seconds to wait before the animation starts (used to stagger cards)
//
// Anyone who has "reduce motion" turned on (or a browser without
// IntersectionObserver) just gets the element, fully visible, with no animation.
// The look itself is in effects.css (.reveal / .is-visible).

const canAnimate = () =>
  typeof window !== 'undefined' &&
  'IntersectionObserver' in window &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// One observer is shared by every Reveal on the page.
const callbacks = new WeakMap();
let sharedObserver = null;

function observe(element, onVisible) {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          callbacks.get(entry.target)?.();
          callbacks.delete(entry.target);
          sharedObserver.unobserve(entry.target);
        });
      },
      { threshold: 0, rootMargin: '0px 0px -5% 0px' }
    );
  }
  callbacks.set(element, onVisible);
  sharedObserver.observe(element);
}

function unobserve(element) {
  callbacks.delete(element);
  sharedObserver?.unobserve(element);
}

export default function Reveal({
  as: Tag = 'div',
  className = '',
  delay = 0,
  onTransitionEnd,
  children,
  ...rest
}) {
  const ref = useRef(null);
  const [animate] = useState(canAnimate);
  const [visible, setVisible] = useState(false);
  // Once the slide-in has finished, the stagger delay is dropped. Otherwise it
  // would stay on the element and delay its later hover animation too.
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!animate || !element) return undefined;

    observe(element, () => setVisible(true));
    return () => unobserve(element);
  }, [animate]);

  const handleTransitionEnd = (e) => {
    if (visible && e.target === e.currentTarget && e.propertyName === 'transform') {
      setSettled(true);
    }
    onTransitionEnd?.(e);
  };

  const classes = [className, animate && 'reveal', animate && visible && 'is-visible']
    .filter(Boolean)
    .join(' ');

  const style = animate && delay && !settled ? { transitionDelay: `${delay}s` } : undefined;

  return (
    <Tag
      ref={ref}
      className={classes}
      style={style}
      onTransitionEnd={delay ? handleTransitionEnd : onTransitionEnd}
      {...rest}
    >
      {children}
    </Tag>
  );
}
