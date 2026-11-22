import { useEffect, useState } from 'react';

// Which section is currently in the middle of the screen?
//
// A section counts as "current" while it overlaps a thin band through the
// middle of the viewport (the -45% margins shrink the watched area to the
// middle 10%). Returns that section's id, or null before any section has
// reached the band. Used to highlight the matching navbar link.
export function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(null);

  // `ids` is a fresh array on each render if the caller builds it inline,
  // so the effect depends on its contents instead of its identity.
  const key = ids.join(',');

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );

    key.split(',').forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [key]);

  return activeId;
}
