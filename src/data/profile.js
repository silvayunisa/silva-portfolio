// =========================================================
// PROFILE — name, photo, bio, and contact/social links.
// Edit your personal information here (one place only).
// The same `links` list feeds both the icon row in About
// and the rows in the Contact section.
// =========================================================

export const profile = {
  name: 'Silva Yunisa Nasution',
  // Short version shown as the logo in the navbar
  logo: 'Silva Yunisa',

  photo: {
    src: '/silva-profile.jpg',
    alt: 'Silva Yunisa Nasution',
  },

  bio: [
    'I’m a Computer Science student at BINUS University with an interest in technology, design, and data. I enjoy exploring how technology can be used to create useful and engaging digital experiences.',
    'Currently, I’m learning and building projects in data analytics, UI/UX design, and web development, while continuing to explore new ways to combine creativity with technology.',
  ],

  // Two short captions in the bottom corners of the hero (desktop only).
  // Both are lifted straight from the bio above.
  heroNotes: [
    'Computer Science student at BINUS University',
    'Data analytics, UI/UX design, and web development',
  ],

  // The two buttons under the bio in About
  actions: [
    { label: 'View My Work', href: '#projects', variant: 'primary' },
    { label: 'Contact Me', href: '#contact', variant: 'outline' },
  ],

  // Contact + social links.
  //   label / value  -> text shown in the Contact section rows
  //   ariaLabel      -> accessible name of the icon button in About
  //   external       -> opens in a new tab (mailto: links don't)
  links: [
    {
      id: 'email',
      label: 'Email',
      value: 'silvasatuenamlima@gmail.com',
      href: 'mailto:silvasatuenamlima@gmail.com',
      ariaLabel: 'Email Silva',
      external: false,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      value: 'linkedin.com/in/silva165',
      href: 'https://www.linkedin.com/in/silva165',
      ariaLabel: "Silva's LinkedIn profile",
      external: true,
    },
    {
      id: 'github',
      label: 'GitHub',
      value: 'github.com/silvayunisa',
      href: 'https://github.com/silvayunisa',
      ariaLabel: "Silva's GitHub profile",
      external: true,
    },
  ],
};

// Used by <head> in index.html (kept here for reference / future use)
export const siteMeta = {
  title: 'Silva Yunisa Portfolio',
  description:
    'Personal biography and portfolio of Silva Yunisa, a Computer Science student exploring UI/UX, data analytics, web development and creative design.',
};
