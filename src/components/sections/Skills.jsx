import { skillGroups } from '../../data/skills.js';
import Reveal from '../ui/Reveal.jsx';
import SplitTitle from '../ui/SplitTitle.jsx';

// Add or remove items in src/data/skills.js — no change needed here.
export default function Skills() {
  return (
    <section id="skills" className="skills">
      <div className="section-inner">
        <SplitTitle>{'Skills & Tools'}</SplitTitle>

        <div className="skills-groups">
          {skillGroups.map((group) => (
            <Reveal key={group.title} className="skills-group">
              <h3 className="skills-group-title">{group.title}</h3>
              <ul className="skills-list">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="skill-tag" target="_blank" rel="noopener">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
