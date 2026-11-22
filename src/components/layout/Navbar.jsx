import { useEffect, useRef, useState } from 'react';
import { profile } from '../../data/profile.js';
import { navLinks } from '../../data/nav.js';
import ThemeToggle from './ThemeToggle.jsx';
import { useActiveSection } from '../../hooks/useActiveSection.js';
import { useScrolledPast } from '../../hooks/useScroll.js';

const sectionIds = navLinks.map((link) => link.id);

export default function Navbar() {
  // A soft shadow appears under the bar once the page is scrolled a little,
  // and the link for the section in the middle of the screen is highlighted.
  const scrolled = useScrolledPast(20);
  const activeId = useActiveSection(sectionIds);

  // Only matters on phones: whether the dropdown menu is open.
  // (On desktop the links are always visible and the burger is hidden by CSS.)
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef(null);

  const closeMenu = () => setMenuOpen(false);

  // Escape closes the menu and gives focus back to the burger button.
  useEffect(() => {
    if (!menuOpen) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        burgerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <header className={scrolled ? 'navbar is-scrolled' : 'navbar'}>
      <div className="nav-inner">
        <a href="#about" className="nav-logo">
          {profile.logo}
        </a>

        <div className={menuOpen ? 'nav-right is-open' : 'nav-right'}>
          <button
            ref={burgerRef}
            type="button"
            className="nav-burger"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          {/* Dims the page behind the open mobile menu; tapping it closes the menu. */}
          <div className="nav-backdrop" aria-hidden="true" onClick={closeMenu} />

          <nav className="nav-menu" id="primary-nav" aria-label="Primary">
            {navLinks.map((link) => {
              const isActive = link.id === activeId;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className={isActive ? 'nav-link active' : 'nav-link'}
                  aria-current={isActive ? 'location' : undefined}
                  onClick={closeMenu}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
