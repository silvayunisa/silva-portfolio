import { Fragment, useEffect, useRef } from 'react';
import { profile } from '../../data/profile.js';
import { useTilt } from '../../hooks/useTilt.js';
import { socialIcons } from '../ui/Icons.jsx';
import Reveal from '../ui/Reveal.jsx';

// About doubles as the landing section: name, photo, bio, buttons, socials.
// These are 5 direct children of .about-grid on purpose — CSS grid areas
// (see about.css) reorder them per screen size: photo beside the name on
// desktop (name on the left, photo on the right), photo -> name -> bio ->
// buttons -> socials on tablet/phone.
// (<Reveal> renders the element itself, so they still are.)
export default function About() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  useTilt(sectionRef, cardRef); // the photo leans toward the mouse (desktop only)

  // Tap (or click) a letter of the name: a wave of hops runs outward from it.
  const nameRef = useRef(null);
  const waveTimer = useRef(0);
  useEffect(() => () => clearTimeout(waveTimer.current), []);

  const startWave = (e) => {
    const heading = nameRef.current;
    const letter = e.target instanceof Element ? e.target.closest('.hero-letter') : null;
    if (!heading || !letter) return;
    const origin = Number(letter.dataset.k);

    heading.classList.remove('is-wave'); // restart if it was still running
    heading.querySelectorAll('.hero-letter').forEach((el) => {
      el.style.animationDelay = `${Math.abs(Number(el.dataset.k) - origin) * 45}ms`;
    });
    void heading.offsetWidth; // let the browser notice the class was removed
    heading.classList.add('is-wave');
    clearTimeout(waveTimer.current);
    waveTimer.current = setTimeout(() => heading.classList.remove('is-wave'), 1600);
  };

  // Tap (or click) the photo: it wobbles like a pinned picture.
  const wobblePhoto = () => {
    const card = cardRef.current;
    if (!card) return;
    card.classList.remove('is-wobble');
    void card.offsetWidth;
    card.classList.add('is-wobble');
  };

  let letterIndex = 0; // numbers the letters across the whole name, for the wave

  return (
    <section id="about" className="about about--landing" ref={sectionRef}>
      <div className="section-inner">
        <div className="about-grid">
          {/* Each word rises in on load (CSS, see about.css) */}
          {/* Letters are split only for the hover effect; the heading keeps one
              plain label for screen readers. */}
          <h1 className="hero-name" aria-label={profile.name} ref={nameRef} onPointerDown={startWave}>
            {profile.name.split(' ').map((word, i) => (
              <Fragment key={word}>
                <span className="hero-word" aria-hidden="true" style={{ '--i': i }}>
                  {[...word].map((letter, j) => (
                    <span key={j} className="hero-letter" data-k={letterIndex++}>
                      {letter}
                    </span>
                  ))}
                </span>{' '}
              </Fragment>
            ))}
          </h1>

          <Reveal className="about-photo-wrap">
            <div
              className="about-photo-card"
              ref={cardRef}
              onPointerDown={wobblePhoto}
              onAnimationEnd={(e) => e.currentTarget.classList.remove('is-wobble')}
            >
              <img src={profile.photo.src} alt={profile.photo.alt} className="about-image" />
            </div>
          </Reveal>

          <Reveal className="about-bio">
            {profile.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>

          <Reveal className="about-actions">
            {profile.actions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                className={action.variant === 'outline' ? 'btn btn-outline' : 'btn'}
              >
                {action.label}
              </a>
            ))}
          </Reveal>

          <Reveal className="about-socials">
            {profile.links.map((link) => {
              const Icon = socialIcons[link.id];
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className="social-icon"
                  aria-label={link.ariaLabel}
                  {...(link.external ? { target: '_blank', rel: 'noopener' } : {})}
                >
                  <Icon />
                </a>
              );
            })}
          </Reveal>
        </div>

        {/* Corner captions, desktop only (hidden on tablet/phone in responsive.css) */}
        <div className="hero-notes">
          {profile.heroNotes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
