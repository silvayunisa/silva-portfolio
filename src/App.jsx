import SkipLink from './components/layout/SkipLink.jsx';
import Navbar from './components/layout/Navbar.jsx';
import About from './components/sections/About.jsx';
import Projects from './components/sections/Projects.jsx';
import Skills from './components/sections/Skills.jsx';
import Contact from './components/sections/Contact.jsx';
import ScrollProgress from './components/ui/ScrollProgress.jsx';
import BackToTop from './components/ui/BackToTop.jsx';
import CursorFollower from './components/ui/CursorFollower.jsx';
import { useMagnetic } from './hooks/useMagnetic.js';

export default function App() {
  // Buttons, social icons and skill chips lean toward the mouse when it gets close.
  useMagnetic('.btn, .social-icon, .skill-tag, .theme-toggle');

  return (
    <>
      <SkipLink />
      <ScrollProgress />
      <Navbar />

      <main id="main">
        <About />
        <Projects />
        <Skills />
      </main>

      <Contact />

      <BackToTop />
      <CursorFollower />
    </>
  );
}
