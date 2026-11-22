import { useCallback, useEffect, useRef } from 'react';

// The "View Details" label on a project card glides toward the mouse while
// the cursor moves inside the card (desktop / mouse only).
//
// It is animated here, frame by frame, instead of letting CSS jump to the
// pointer position on every mousemove — so it trails the cursor smoothly.
//
// Usage (see ProjectCard):
//   const hintRef = useRef(null);
//   const { cardProps, hintProps } = useCursorFollow(hintRef);
//   <article {...cardProps}> ... <button ref={hintRef} {...hintProps}> ... </article>

const EASE = 0.22; // how much of the remaining distance is covered each frame
const EDGE_PADDING = 10; // extra room for the label's tilt and corners

// Media queries are created once; `.matches` always reads the live value.
let finePointerQuery;
let reducedMotionQuery;
const isFinePointer = () => {
  finePointerQuery ??= window.matchMedia('(hover: hover) and (pointer: fine)');
  return finePointerQuery.matches;
};
const prefersReducedMotion = () => {
  reducedMotionQuery ??= window.matchMedia('(prefers-reduced-motion: reduce)');
  return reducedMotionQuery.matches;
};

export function useCursorFollow(hintRef) {
  // Mutable animation state lives in a ref: changing it must not re-render.
  const motion = useRef({
    target: { x: 0, y: 0 },
    current: null, // null until the cursor has entered a card once
    frame: 0,
  });

  const place = useCallback(
    (x, y) => {
      const hint = hintRef.current;
      if (!hint) return;
      hint.style.left = `${x}px`;
      hint.style.top = `${y}px`;
    },
    [hintRef]
  );

  const glide = useCallback(() => {
    const m = motion.current;
    if (!hintRef.current || !m.current) {
      m.frame = 0;
      return;
    }

    m.current.x += (m.target.x - m.current.x) * EASE;
    m.current.y += (m.target.y - m.current.y) * EASE;
    place(m.current.x, m.current.y);

    const closeEnough =
      Math.abs(m.target.x - m.current.x) < 0.5 && Math.abs(m.target.y - m.current.y) < 0.5;
    m.frame = closeEnough ? 0 : requestAnimationFrame(glide);
  }, [hintRef, place]);

  // Stop any running animation if the card goes away.
  useEffect(() => {
    const m = motion.current;
    return () => {
      cancelAnimationFrame(m.frame);
      m.frame = 0;
    };
  }, []);

  const onMouseMove = useCallback(
    (e) => {
      const hint = hintRef.current;
      if (!hint || !isFinePointer()) return;

      const m = motion.current;
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();

      // Keep the label fully inside the card (which clips its own overflow)
      // so it never gets cut off near an edge. Measured from its untransformed
      // layout size, plus a little room for the tilt.
      const halfW = hint.offsetWidth / 2 + EDGE_PADDING;
      const halfH = hint.offsetHeight / 2 + EDGE_PADDING;
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;
      m.target.x = Math.min(Math.max(rawX, halfW), rect.width - halfW);
      m.target.y = Math.min(Math.max(rawY, halfH), rect.height - halfH);

      if (!m.current || prefersReducedMotion()) {
        // First move inside this card (or reduced motion): place it right at
        // the cursor instead of gliding in from a stale corner.
        m.current = { x: m.target.x, y: m.target.y };
        place(m.current.x, m.current.y);
      } else if (!m.frame) {
        m.frame = requestAnimationFrame(glide);
      }
    },
    [hintRef, place, glide]
  );

  // Keyboard focus pins the label to a fixed corner (a :focus-visible rule
  // in projects.css). An inline left/top left over from an earlier mouse hover
  // would beat that rule, so it is cleared when the button gets focus.
  const onHintFocus = useCallback(() => {
    const hint = hintRef.current;
    if (!hint) return;
    hint.style.left = '';
    hint.style.top = '';
  }, [hintRef]);

  return {
    cardProps: { onMouseMove },
    hintProps: { onFocus: onHintFocus },
  };
}
