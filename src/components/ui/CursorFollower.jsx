import { useEffect, useRef } from 'react';

// Pixel cursor: a pixel-art arrow that replaces the system pointer on the page.
// - It sits exactly under the real pointer (no lag), so aiming stays precise.
// - Over links and buttons it turns into a pixel hand.
// - It shrinks a little while the mouse button is held down.
// - Over a project row it steps aside, because the "View Details" label takes over there.
// - Colors come from --cursor (fill) and --cursor-edge (outline), so it follows
//   day/night and eases between them.
// - Mouse: the system pointer is only hidden once this cursor has actually
//   appeared (first mouse move), so a visitor is never left without a pointer.
// - Touch / pen: there is no pointer to replace, so the same pixel cursor
//   appears under the finger while it is down (a bit bigger, so it is not
//   hidden by the fingertip), follows the finger, and fades out shortly
//   after it lifts.
// Styles: effects.css (.pixel-cursor).

const PX = 2; // one art pixel = 2 CSS pixels
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, summary';
const STAND_ASIDE = '.project-card';

// X = outline, O = fill, . = transparent
const ARROW = [
  'X...........',
  'XX..........',
  'XOX.........',
  'XOOX........',
  'XOOOX.......',
  'XOOOOX......',
  'XOOOOOX.....',
  'XOOOOOOX....',
  'XOOOOOOOX...',
  'XOOOOOOOOX..',
  'XOOOOOOOOOX.',
  'XOOOOOOXXXXX',
  'XOOXOOX.....',
  'XOX.XOOX....',
  'XX..XOOX....',
  'X....XOOX...',
  '.....XOOX...',
  '......XX....',
];

const HAND = [
  '....XX......',
  '...XOOX.....',
  '...XOOX.....',
  '...XOOX.....',
  '...XOOXXX...',
  '...XOOXOOXX.',
  '.XXXOOXOOXOX',
  'XOOXOOOOOOOX',
  'XOOOOOOOOOOX',
  '.XOOOOOOOOOX',
  '.XOOOOOOOOOX',
  '..XOOOOOOOX.',
  '..XOOOOOOOX.',
  '...XOOOOOX..',
  '...XOOOOOX..',
  '...XXXXXXX..',
];

// Turns a text grid into an SVG made of 1x1 art pixels (merged into runs per row).
function Sprite({ rows, className, hotspot = { x: 0, y: 0 } }) {
  const width = rows[0].length;
  const rects = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < width) {
      const char = row[x];
      if (char === '.') {
        x += 1;
        continue;
      }
      let end = x;
      while (end < width && row[end] === char) end += 1;
      rects.push(
        <rect
          key={`${y}-${x}`}
          x={x}
          y={y}
          width={end - x}
          height="1"
          className={char === 'X' ? 'px-edge' : 'px-fill'}
        />
      );
      x = end;
    }
  });

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${rows.length}`}
      width={width * PX}
      height={rows.length * PX}
      shapeRendering="crispEdges"
      style={{ left: -hotspot.x * PX, top: -hotspot.y * PX }}
      aria-hidden="true"
    >
      {rects}
    </svg>
  );
}

export default function CursorFollower() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return undefined;

    const root = document.documentElement;
    let x = 0;
    let y = 0;
    let frame = 0;
    let mouseStarted = false;
    let touchActive = false;
    let hideTimer = 0;

    const draw = () => {
      frame = 0;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const aim = (e, touch) => {
      x = e.clientX;
      y = e.clientY;
      const el = e.target instanceof Element ? e.target : null;
      cursor.classList.toggle('is-link', !!el?.closest(INTERACTIVE));
      // the "View Details" label only exists for the mouse
      cursor.classList.toggle('is-aside', !touch && !!el?.closest(STAND_ASIDE));
    };

    const onMove = (e) => {
      if (e.pointerType !== 'mouse') {
        if (touchActive) {
          aim(e, true);
          if (!frame) frame = requestAnimationFrame(draw);
        }
        return;
      }
      // A mouse is back (hybrid laptops): leave touch mode.
      clearTimeout(hideTimer);
      touchActive = false;
      cursor.classList.remove('is-touch');
      aim(e, false);
      if (!mouseStarted) {
        // First move: from now on this cursor stands in for the system pointer.
        mouseStarted = true;
        root.classList.add('has-pixel-cursor');
      }
      cursor.classList.add('is-on');
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const onDown = (e) => {
      cursor.classList.add('is-down');
      if (e.pointerType === 'mouse') return;
      // Finger / pen: show the cursor right where it touched.
      clearTimeout(hideTimer);
      touchActive = true;
      aim(e, true);
      if (frame) cancelAnimationFrame(frame);
      draw();
      cursor.classList.add('is-touch', 'is-on');
    };

    const onUp = (e) => {
      cursor.classList.remove('is-down');
      if (e.pointerType === 'mouse' || !touchActive) return;
      touchActive = false;
      // linger a moment so the cursor can be seen once the fingertip is gone;
      // a scroll gesture cancels the touch, so that one fades out sooner
      hideTimer = setTimeout(() => cursor.classList.remove('is-on'), e.type === 'pointercancel' ? 120 : 800);
    };

    const onLeave = (e) => {
      if (e.pointerType === 'mouse') cursor.classList.remove('is-on');
    };
    const onEnter = (e) => {
      if (e.pointerType === 'mouse' && mouseStarted) cursor.classList.add('is-on');
    };

    // The popup opening or closing changes what is under a mouse that has not
    // moved, and no pointer event says so. Look again shortly after a click
    // or a key press (Esc closes the popup).
    let recheckTimers = [];
    const recheck = () => {
      if (!mouseStarted || touchActive) return;
      const el = document.elementFromPoint(x, y);
      cursor.classList.toggle('is-link', !!el?.closest(INTERACTIVE));
      cursor.classList.toggle('is-aside', !!el?.closest(STAND_ASIDE));
    };
    const recheckSoon = () => {
      recheckTimers.forEach(clearTimeout);
      recheckTimers = [setTimeout(recheck, 80), setTimeout(recheck, 450)];
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('click', recheckSoon, { passive: true });
    window.addEventListener('keyup', recheckSoon, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onUp, { passive: true });
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('pointerenter', onEnter);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('click', recheckSoon);
      window.removeEventListener('keyup', recheckSoon);
      recheckTimers.forEach(clearTimeout);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('pointerenter', onEnter);
      root.classList.remove('has-pixel-cursor');
      clearTimeout(hideTimer);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={cursorRef} className="pixel-cursor" aria-hidden="true">
      <Sprite rows={ARROW} className="pixel-cursor__arrow" />
      <Sprite rows={HAND} className="pixel-cursor__hand" hotspot={{ x: 5, y: 0 }} />
    </div>
  );
}
