import { profile } from '../../data/profile.js';
import Reveal from '../ui/Reveal.jsx';
import SplitTitle from '../ui/SplitTitle.jsx';

// Contact is the page footer (id="contact", which the navbar links to).
export default function Contact() {
  return (
    <footer id="contact" className="contact">
      <div className="section-inner">
        <SplitTitle>Contact</SplitTitle>

        <Reveal className="contact-list">
          {profile.links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="contact-row"
              {...(link.external ? { target: '_blank', rel: 'noopener' } : {})}
            >
              <span className="contact-label">{link.label}</span>
              <span className="contact-value">{link.value}</span>
            </a>
          ))}
        </Reveal>

        {/* Year updates itself, so it never goes stale every January */}
        <p className="footer-note">© {new Date().getFullYear()} Silva Yunisa</p>
      </div>
    </footer>
  );
}
