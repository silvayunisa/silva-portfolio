// =========================================================
// PROJECTS — one entry per project card.
// This is the single source of truth: the card AND the
// "View Details" modal both read from here, so nothing is
// written twice. To add a project, copy one entry below.
//
// Fields (all optional except id, category, name, description,
// tags, links):
//   meta           short italic line under the description
//   metaBold       true -> show `meta` in bold (used by the HR dashboard)
//   image          { src, alt } screenshot shown on the card and in the modal
//   highlights     bullet list of key facts
//   links          every link opens in a new tab
//   layout: 'full' -> (not used by the Fase 4 list design: every project is one row;
//                      kept here so the data stays as it was)
// =========================================================

export const projects = [
  {
    id: 'customer-behavior',
    category: 'Data Analytics',
    name: 'Customer Behavior & Marketing Analytics',
    description:
      'Analyzing 20,000 electronics retail transactions to explore customer behavior, product performance, sales patterns, and order cancellations using data analysis, statistical methods, and machine learning.',
    tags: ['Python', 'Pandas', 'Statistical Analysis', 'Machine Learning'],
    links: [
      // The PDF lives in /public so this URL works locally and on Vercel
      { label: 'View Project PDF', href: '/Data_Analytics_Project.pdf' },
    ],
  },

  {
    id: 'studybuddy',
    category: 'Software Engineering',
    name: 'StudyBuddy',
    description:
      'A web-based platform designed to help students find compatible study partners based on their courses, schedules, and learning goals. StudyBuddy helps students connect, form study groups, manage schedules, and communicate with other students.',
    // Team-project disclosure — keep this visible; do not present this as solo work
    meta: 'This was a Software Engineering team project. My part covered UI/UX design in Figma, the presentation, and project documentation.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'MySQL'],
    links: [
      {
        label: 'View on GitHub',
        href: 'https://github.com/silvayunisa/studybuddy-software-engineering',
      },
    ],
  },

  {
    id: 'ship-deck',
    category: 'UI/UX Design · Human-Computer Interaction',
    name: 'Ship Deck',
    description:
      'A Semester 2 Human-Computer Interaction lab project where I was assigned to design and develop a website based on a ship deck theme. I created the interface and turned the design into a functional web experience.',
    meta: 'Human-Computer Interaction Lab Project',
    tags: ['Figma', 'HTML', 'CSS', 'JavaScript', 'Vercel'],
    links: [
      { label: 'View Live Website', href: 'https://ship-deckk-silva.vercel.app' },
      {
        label: 'View Figma Design',
        href: 'https://www.figma.com/design/VSkzQX7PcVqYZijY5WyXyC/ShipDeckK?node-id=0-1&t=yx1T8kuCjYB8Q0Pj-1',
      },
    ],
  },

  {
    id: 'hr-attrition-dashboard',
    // Full-width row: sits on its own line below the 3 cards above
    layout: 'full',
    category: 'Data Visualization',
    image: {
      src: '/hr-attrition-dashboard.png',
      alt: 'HR Employee Attrition Dashboard — Tableau dashboard screenshot',
    },
    name: 'HR Employee Attrition Dashboard',
    description:
      'An interactive Tableau dashboard designed to explore employee attrition patterns across departments, job roles, education levels, and time.',
    // Team-project disclosure — keep this visible; do not present this as solo work
    meta: 'Data Visualization Team Project',
    metaBold: true,
    tags: ['Tableau', 'Data Visualization', 'Dashboard Design'],
    highlights: [
      '100,000 employee records',
      '10.01% overall attrition',
      'Attrition analysis by department',
      'Attrition analysis by job title',
      'Education-level composition',
      'Monthly headcount and attrition trend',
      'Interactive department and job title filters',
    ],
    links: [
      {
        label: 'View Dashboard',
        href: 'https://public.tableau.com/views/HR_EmployeeAttritionDashboard_17905151270160/MainDashboard',
      },
    ],
  },
];
