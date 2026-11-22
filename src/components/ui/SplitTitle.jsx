import { Fragment } from 'react';
import Reveal from './Reveal.jsx';

// A section heading whose letters rise into place one after another the
// first time it scrolls into view. Screen readers get the plain text
// (aria-label); the split letters are decorative.
//
//   <SplitTitle>Projects</SplitTitle>
//
// Without animation (reduce motion), the letters simply sit in place.
// Styles: effects.css (.split-title).
export default function SplitTitle({ children }) {
  const text = String(children);
  let index = 0;

  return (
    <Reveal as="h2" className="section-title split-title" aria-label={text}>
      {text.split(' ').map((word, w) => (
        <Fragment key={w}>
          <span className="split-word" aria-hidden="true">
            {[...word].map((letter, l) => (
              <span key={l} className="split-letter" style={{ '--i': index++ }}>
                {letter}
              </span>
            ))}
          </span>{' '}
        </Fragment>
      ))}
    </Reveal>
  );
}
