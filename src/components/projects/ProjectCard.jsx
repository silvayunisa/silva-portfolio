import { useRef } from 'react';
import Reveal from '../ui/Reveal.jsx';
import { useCursorFollow } from '../../hooks/useCursorFollow.js';

// One project row. Everything shown comes from the project object in
// src/data/projects.js — nothing is written here.
//
// - Clicking anywhere on the row (except on one of its real links) opens
//   the details popup via `onOpen`.
// - `index` staggers the slide-in so rows cascade one after another.
export default function ProjectCard({ project, index, onOpen }) {
  const { category, name, description, meta, metaBold, image, tags, highlights, links } = project;

  const hintRef = useRef(null);
  const { cardProps, hintProps } = useCursorFollow(hintRef);

  const handleClick = (e) => {
    // The project's own links navigate normally instead of opening the popup.
    if (e.target.closest('a')) return;

    // Where focus returns to on close: the button if that was clicked,
    // otherwise the row's own button (an <article> can't take focus).
    const trigger = e.target.closest('.project-view-details') || hintRef.current;
    onOpen(project, trigger);
  };

  return (
    <Reveal
      as="article"
      className="project-card"
      delay={index * 0.08}
      onClick={handleClick}
      {...cardProps}
    >
      <div className="project-head">
        <p className="project-category">{category}</p>
        <h3 className="project-name">{name}</h3>
      </div>

      <div className="project-body">
        <p className="project-desc">{description}</p>

        {meta && <p className="project-meta">{metaBold ? <strong>{meta}</strong> : meta}</p>}

        {highlights && (
          <ul className="project-highlights">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}

        <ul className="project-tags">
          {tags.map((tag) => (
            <li key={tag} className="tag">
              {tag}
            </li>
          ))}
        </ul>

        <div className="project-links">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="project-link" target="_blank" rel="noopener">
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {image && <img src={image.src} alt={image.alt} className="project-image" />}

      <button ref={hintRef} type="button" className="project-view-details" {...hintProps}>
        View Details
      </button>
    </Reveal>
  );
}
