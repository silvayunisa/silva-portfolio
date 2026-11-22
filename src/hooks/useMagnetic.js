import { useEffect } from 'react';

// "Magnetic" buttons: when the mouse comes near a button / chip / icon it
// leans a few pixels toward the pointer, and settles back when the mouse
// leaves. Uses the CSS `translate` property, so it never fights with the
// element's own hover/active transforms.
//
// Mouse-only (not on touch, not with "reduce motion").
//
//   useMagnetic('.btn, .social-icon, .skill-tag');   // once, in App

const REACH = 36; // px around the element where the pull starts
const PULL = 0.28; // fraction of the distance to the pointer
const MAX = 6; // px, never move further than this (small enough that neighbouring chips never collide)

export function useMagnetic(selector) {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduced.matches) return undefined;

    const offsets = new WeakMap(); // current pull per element, so we can measure its resting position
    let pulled = new Set();
    let pointer = null;
    let frame = 0;

    const clamp = (v) => Math.max(-MAX, Math.min(MAX, v));

    const update = () => {
      frame = 0;
      const nowPulled = new Set();

      if (pointer) {
        document.querySelectorAll(selector).forEach((el) => {
          const box = el.getBoundingClientRect();
          if (box.bottom < 0 || box.top > window.innerHeight) return; // off screen

          const offset = offsets.get(el) ?? { x: 0, y: 0 };
          // rest position = where it is now, minus the pull we already applied
          const cx = box.left + box.width / 2 - offset.x;
          const cy = box.top + box.height / 2 - offset.y;
          const dx = pointer.x - cx;
          const dy = pointer.y - cy;

          if (Math.abs(dx) < box.width / 2 + REACH && Math.abs(dy) < box.height / 2 + REACH) {
            const next = { x: clamp(dx * PULL), y: clamp(dy * PULL) };
            offsets.set(el, next);
            el.style.translate = `${next.x.toFixed(1)}px ${next.y.toFixed(1)}px`;
            nowPulled.add(el);
          }
        });
      }

      pulled.forEach((el) => {
        if (!nowPulled.has(el)) {
          offsets.delete(el);
          el.style.translate = '';
        }
      });
      pulled = nowPulled;
    };

    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onMove = (e) => {
      pointer = { x: e.clientX, y: e.clientY };
      request();
    };
    const onLeave = () => {
      pointer = null;
      request();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
      pulled.forEach((el) => {
        el.style.translate = '';
      });
    };
  }, [selector]);
}
