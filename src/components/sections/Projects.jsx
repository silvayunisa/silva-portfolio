import { useCallback, useEffect, useRef, useState } from 'react';
import { projects } from '../../data/projects.js';
import ProjectCard from '../projects/ProjectCard.jsx';
import ProjectModal from '../projects/ProjectModal.jsx';
import SplitTitle from '../ui/SplitTitle.jsx';

// To add a project, add an entry in src/data/projects.js — no change needed here.
export default function Projects() {
  // The project shown in the popup. It is kept after the popup closes so the
  // fade-out still has content to show; `isOpen` decides whether it's visible.
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null); // the button to give focus back to on close

  const openProject = (project, trigger) => {
    triggerRef.current = trigger;
    setSelected(project);
    setIsOpen(true);
  };

  const closeProject = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Touch screens have no hover, so the project row in the middle of the
  // screen gets the "hover" look as you scroll (data-centered, see effects.css).
  useEffect(() => {
    if (!window.matchMedia('(hover: none)').matches || !('IntersectionObserver' in window)) {
      return undefined;
    }
    const rows = document.querySelectorAll('#projects .project-card');
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.setAttribute('data-centered', '');
          else entry.target.removeAttribute('data-centered');
        }),
      { rootMargin: '-45% 0px -45% 0px' }
    );
    rows.forEach((row) => observer.observe(row));
    return () => {
      observer.disconnect();
      rows.forEach((row) => row.removeAttribute('data-centered'));
    };
  }, []);

  return (
    <section id="projects" className="projects">
      <div className="section-inner">
        <SplitTitle>Projects</SplitTitle>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} onOpen={openProject} />
          ))}
        </div>
      </div>

      <ProjectModal project={selected} isOpen={isOpen} onClose={closeProject} />
    </section>
  );
}
