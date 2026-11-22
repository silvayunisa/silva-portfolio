import { useEffect } from 'react';

// Pointer tilt for the hero photo: while the mouse moves over the hero, the
// photo card leans a few degrees toward it. It only writes CSS variables:
//   --tilt-x / --tilt-y  on the card (degrees)
//   --mx / --my          on the whole hero, -1..1 (the name and photo drift
//                        in opposite directions for a little depth)
// The transforms themselves live in about.css.
//
// Mouse-only: touch screens and "reduce motion" visitors never get it, and
// the photo just sits at its resting angle.
//
//   const sectionRef = useRef(null);
//   const cardRef = useRef(null);
//   useTilt(sectionRef, cardRef);

const MAX_X = 5; // degrees, up/down
const MAX_Y = 8; // degrees, left/right

export function useTilt(areaRef, targetRef) {
  useEffect(() => {
    const area = areaRef.current;
    const target = targetRef.current;
    if (!area || !target) return undefined;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduced.matches) return undefined;

    let frame = 0;
    let next = { x: 0, y: 0, mx: 0, my: 0 };

    const apply = () => {
      frame = 0;
      target.style.setProperty('--tilt-x', `${next.x.toFixed(2)}deg`);
      target.style.setProperty('--tilt-y', `${next.y.toFixed(2)}deg`);
      area.style.setProperty('--mx', next.mx.toFixed(3));
      area.style.setProperty('--my', next.my.toFixed(3));
    };

    const onMove = (e) => {
      const box = area.getBoundingClientRect();
      // -1 .. 1 across the hero, 0 in the middle
      const nx = ((e.clientX - box.left) / box.width) * 2 - 1;
      const ny = ((e.clientY - box.top) / box.height) * 2 - 1;
      next = { x: -ny * MAX_X, y: nx * MAX_Y, mx: nx, my: ny };
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      next = { x: 0, y: 0, mx: 0, my: 0 };
      if (!frame) frame = requestAnimationFrame(apply);
    };

    area.addEventListener('pointermove', onMove);
    area.addEventListener('pointerleave', onLeave);
    return () => {
      area.removeEventListener('pointermove', onMove);
      area.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [areaRef, targetRef]);
}
