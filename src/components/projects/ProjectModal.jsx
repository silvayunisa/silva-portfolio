import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// The "View Details" popup. One modal is shared by all projects: it shows
// whichever project was opened last, and its content is read from that
// project's entry in src/data/projects.js (nothing is written here).
//
// It stays mounted and is shown/hidden with the .is-open class, so the CSS
// can fade it in and out. `project` is kept after closing for that reason —
// otherwise the text would vanish in the middle of the fade-out.
//
// Behaviour: Esc / backdrop / × close it; the page behind can't scroll;
// Tab stays inside the popup; focus moves in on open and back to the
// button that opened it on close (the parent handles that last part).

const FOCUSABLE = 'a[href], button:not([disabled])';

export default function ProjectModal({ project, isOpen, onClose }) {
  const panelRef = useRef(null);

  // Lock page scroll and move focus into the popup while it's open.
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // The popup is visibility:hidden until the class above takes effect, so
    // focusing it in this same tick can silently fail. Wait one frame.
    const frame = requestAnimationFrame(() => panelRef.current?.focus());

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Esc closes it.
  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  // Tab / Shift+Tab loop around inside the popup instead of escaping to the page.
  const trapFocus = (e) => {
    if (e.key !== 'Tab' || !isOpen) return;

    const panel = panelRef.current;
    const items = panel ? panel.querySelectorAll(FOCUSABLE) : [];
    if (items.length === 0) return;

    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;

    // The panel itself holds focus right after opening, so Shift+Tab from
    // there must wrap too (it is "before" the first button).
    if (e.shiftKey && (active === first || active === panel)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const modal = (
    <div
      className={isOpen ? 'project-modal is-open' : 'project-modal'}
      id="project-modal"
      aria-hidden={!isOpen}
      onKeyDown={trapFocus}
    >
      <div className="project-modal-backdrop" onClick={onClose} />

      <div
        className="project-modal-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        tabIndex={-1}
      >
        <button
          type="button"
          className="project-modal-close"
          aria-label="Close project details"
          onClick={onClose}
        >
          &times;
        </button>

        {project && (
          <>
            <p className="project-modal-category">{project.category}</p>
            <h3 className="project-modal-title" id="project-modal-title">
              {project.name}
            </h3>

            {project.image && (
              <img
                className="project-modal-image"
                src={project.image.src}
                alt={project.image.alt || ''}
              />
            )}

            <p className="project-modal-desc">{project.description}</p>

            {project.meta && <p className="project-modal-meta">{project.meta}</p>}

            {project.highlights && (
              <ul className="project-modal-highlights">
                {project.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}

            <ul className="project-modal-tags">
              {project.tags.map((tag) => (
                <li key={tag} className="tag">
                  {tag}
                </li>
              ))}
            </ul>

            <div className="project-modal-links">
              {project.links.map((link) => (
                <a key={link.href} href={link.href} className="btn" target="_blank" rel="noopener">
                  {link.label}
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Rendered straight into <body> so no ancestor's styles can affect its fixed positioning.
  return createPortal(modal, document.body);
}
