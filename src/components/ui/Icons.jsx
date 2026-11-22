// Line icons, drawn as inline SVG. They use stroke="currentColor", so they
// automatically follow the text color of whatever button they sit in
// (including hover and dark-mode colors).

const baseProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

// ---- Theme toggle ----
export function SunIcon() {
  return (
    <svg {...baseProps} width="18" height="18">
      <circle cx="12" cy="12" r="4.3" />
      <line x1="12" y1="2" x2="12" y2="4.5" />
      <line x1="12" y1="19.5" x2="12" y2="22" />
      <line x1="2" y1="12" x2="4.5" y2="12" />
      <line x1="19.5" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="6.64" y2="6.64" />
      <line x1="17.36" y1="17.36" x2="19.07" y2="19.07" />
      <line x1="4.93" y1="19.07" x2="6.64" y2="17.36" />
      <line x1="17.36" y1="6.64" x2="19.07" y2="4.93" />
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg {...baseProps} width="18" height="18">
      <path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.8 6.8 0 0 0 10.7 10.7Z" />
    </svg>
  );
}

// ---- Social icons (sized by the .social-icon svg rule in about.css) ----
export function MailIcon() {
  return (
    <svg {...baseProps}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

export function LinkedInIcon() {
  return (
    <svg {...baseProps}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function GitHubIcon() {
  return (
    <svg {...baseProps}>
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    </svg>
  );
}

// Which icon belongs to which entry of `profile.links` (matched by its id)
export const socialIcons = {
  email: MailIcon,
  linkedin: LinkedInIcon,
  github: GitHubIcon,
};
