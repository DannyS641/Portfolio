/**
 * Everything written on the site lives here.
 * Edit this file to make the portfolio yours — the components read from it and
 * nothing else needs touching.
 */

export const person = {
  name: 'Oluwanifemi Oso',
  // The two lines the hero particles spell out. Keep them short.
  particleLines: ['Oluwanifemi', 'Oso'],
  role: 'Software engineer and application manager, open to new roles',
  headline: 'Oluwanifemi Oso builds software and keeps it running.',
  domain: 'oluwanifemi.dev',
  year: 2026,
  // Shown after the name in the footer. Clear it once the content is real.
  
}

export const navLinks = [
  { href: '#system', label: 'What I do' },
  { href: '#work', label: 'Work' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
]

export const heroCaptions = ['Hi, I’m Nifemi.', 'I build software.', 'And I keep it running.']

export const heroHints = {
  pointer: 'Move through the dots, or click to scatter them',
  touch: 'Drag through the dots, or tap to scatter them',
}

export const bootLines = [
  [`Starting ${person.domain}`, ''],
  ['Loading projects ............ ', 'done'],
  ['Connecting APIs ............. ', 'done'],
  ['Warming up databases ........ ', 'done'],
  ['Checking monitoring ......... ', 'all green'],
  ['Ready.', ''],
]

/* ---------- "How the pieces fit" diagram ---------- */

export const diagramIntro = {
  heading: 'How the pieces fit',
  lede: 'I write the apps, connect the systems behind them, and look after them once they’re live: monitoring, fixes, upgrades and the people who use them.',
  // Sits under the diagram next to a tap icon. Two wordings: touch devices get
  // the second one, since “click” means nothing on a phone.
  hint: 'Click a box, or a name below, to see what I do there',
  hintTouch: 'Tap a box or a name below to see what I do there',
  pickLabel: 'Parts of the system',
  tourStop: 'Stop the tour',
  // Seconds each part is held during the automatic tour.
  tourStepSeconds: 3.4,
  // Shown before anything is picked, so the area under the diagram is never
  // empty. Set to null to start blank and fall back to emptyTip.
  defaultNodeId: 'web',
  emptyTip: {
    title: 'Select a part of the diagram',
    body: 'Each box is part of the job.',
  },
}

// x / y / w are coordinates inside the 600 x 520 SVG viewBox.
export const diagramNodes = [
  { id: 'users', x: 90, y: 100, w: 120, label: 'Users', tip: 'I talk to the people who use the systems, turn their problems into tickets, and train teams on new tools.' },
  { id: 'web', x: 300, y: 100, w: 140, label: 'Web apps', tip: 'I build web apps, staff portals and company websites, from the first sketch to release.' },
  { id: 'auto', x: 510, y: 100, w: 140, label: 'Automations', tip: 'I automate repetitive work: approvals, reminders and reports that used to be done by hand.' },
  { id: 'api', x: 300, y: 260, w: 140, label: 'APIs', tip: 'I design APIs and integrations so separate systems share data without anyone copying it across.' },
  { id: 'db', x: 510, y: 260, w: 140, label: 'Databases', tip: 'I design schemas, tune slow queries and make sure there’s a backup that actually restores.' },
  { id: 'srv', x: 300, y: 420, w: 140, label: 'Servers', tip: 'I run Linux servers and hosting, and plan migrations so moving platforms doesn’t mean downtime.' },
  { id: 'mon', x: 90, y: 420, w: 120, label: 'Monitoring', tip: 'I build dashboards and alerts that catch slowdowns and errors before users notice.' },
]

export const diagramEdges = [
  { id: 'e1', d: 'M150 100H230' },
  { id: 'e2', d: 'M370 100H450' },
  { id: 'e3', d: 'M300 128V232' },
  { id: 'e4', d: 'M510 128V180H370V250' },
  { id: 'e5', d: 'M370 260H450' },
  { id: 'e6', d: 'M300 288V392' },
  { id: 'e7', d: 'M230 420H150' },
  { id: 'e8', d: 'M90 392V200H230V128' },
  { id: 'e9', d: 'M510 288V420H370' },
]

// Edges that carry a steady trickle of packets, in the order they start.
export const diagramFlows = ['e1', 'e3', 'e5', 'e6', 'e7', 'e2', 'e4', 'e9', 'e8']

// The recurring "something broke, monitoring caught it" story.
export const diagramIncident = {
  nodeId: 'api',
  raised: 'Slow response on APIs. Alert sent from monitoring.',
  cleared: 'Fixed and back to normal in 3 minutes.',
}

/* ---------- Uptime strip ---------- */

export const statusStrip = {
  heading: 'Systems I look after today',
  note: 'Uptime over the last 60 days. Each bar is one day.',
  allOk: 'All systems working',
}

// `slowDays` are zero-based day indexes (0 = 60 days ago, 59 = today).
export const services = [
  { name: 'Company website', slowDays: [17, 42] },
  { name: 'Staff portal', slowDays: [30] },
  { name: 'HR system', slowDays: [] },
  { name: 'Learning platform', slowDays: [8, 51] },
]

/* ---------- "Two jobs, one person" ---------- */

export const buildRunIntro = {
  heading: 'Two jobs, one person',
  lede: 'Most teams hire someone to build software and someone else to run it. I do both, so what I build is easier to run.',
}

// `icon` is the inside of a 44 x 44 SVG drawn with stroke="currentColor", fill="none".
export const buildRun = {
  build: {
    tab: 'I build',
    heading: 'I build things people use every day',
    body: 'Web apps, internal tools and the plumbing that connects them, written to be easy to support later.',
    items: [
      {
        title: 'Web apps and staff portals',
        body: 'Fast, accessible front ends with clean, tested back ends.',
        icon: '<rect x="6" y="9" width="32" height="26" rx="3"/><path d="M6 16h32"/>',
      },
      {
        title: 'APIs and integrations',
        body: 'Systems that share data reliably, with clear error handling.',
        icon: '<circle cx="12" cy="22" r="5"/><circle cx="32" cy="12" r="5"/><circle cx="32" cy="32" r="5"/><path d="M17 20l10-6M17 24l10 6"/>',
      },
      {
        title: 'Workflow automation',
        body: 'Approvals, reminders and reports that run themselves.',
        icon: '<rect x="6" y="8" width="12" height="10" rx="2"/><rect x="26" y="26" width="12" height="10" rx="2"/><path d="M18 13h8v13"/>',
      },
      {
        title: 'Databases',
        body: 'Schemas, migrations and queries that stay fast as data grows.',
        icon: '<ellipse cx="22" cy="11" rx="13" ry="5"/><path d="M9 11v22c0 3 6 5 13 5s13-2 13-5V11M9 22c0 3 6 5 13 5s13-2 13-5"/>',
      },
    ],
  },
  run: {
    tab: 'I run',
    heading: 'I keep business systems healthy',
    body: 'Once something is live, I make sure it stays fast, secure and up to date, and that the people using it are looked after.',
    items: [
      {
        title: 'Monitoring and alerts',
        body: 'Dashboards that show problems early, and alerts that go to the right person.',
        icon: '<path d="M6 30l8-10 7 6 9-14 8 8"/><path d="M6 38h32"/>',
      },
      {
        title: 'Incident response',
        body: 'Calm fixes when things break, and root-cause notes so it doesn’t happen again.',
        icon: '<path d="M22 6l16 28H6z"/><path d="M22 17v8M22 29v1"/>',
      },
      {
        title: 'Patching and migrations',
        body: 'Planned upgrades and platform moves, with rollback ready.',
        icon: '<path d="M8 22a14 14 0 0 1 24-10M36 22a14 14 0 0 1-24 10"/><path d="M32 6v6h-6M12 38v-6h6"/>',
      },
      {
        title: 'Access and vendors',
        body: 'Regular access reviews, licences and working with suppliers.',
        icon: '<rect x="10" y="20" width="24" height="16" rx="3"/><path d="M15 20v-5a7 7 0 0 1 14 0v5"/>',
      },
    ],
  },
}

/* ---------- Selected work ---------- */

export const workIntro = {
  heading: 'Selected work',
  lede: 'Four projects, each from a different part of the job. Open one to see the problem, what I did and how it turned out.',
}

/**
 * `visual` picks the animated SVG drawn on the card. One of:
 * 'migration' | 'monitoring' | 'automation' | 'security'.
 * Reuse one for a new project, or add your own in src/components/caseVisuals.jsx.
 */
export const cases = [
  {
    id: 'mig',
    visual: 'migration',
    kind: 'Running',
    title: 'Moving 14 sites to a new platform',
    summary: 'Migrated production websites and portals off an ageing server, one at a time, with no lost data.',
    results: ['No data lost', 'Every cut-over out of hours'],
    problem: 'The company’s websites and portals ran on a server nearing end of life. Updates were risky and the hosting panel was out of support.',
    did: 'I listed every site, database and scheduled job, rebuilt the stack on a new Linux server, and moved each site with a tested rollback plan.',
    result: 'All 14 sites moved with no lost data and short, planned outages at night. The new server is now patched every month.',
    tools: 'Linux, Nginx, MySQL, PHP, DNS',
  },
  {
    id: 'mon',
    visual: 'monitoring',
    kind: 'Running',
    title: 'Catching problems before users do',
    summary: 'Set up performance dashboards and alerts across key applications, with a simple report for managers.',
    results: ['Problems found earlier', 'Weekly report for leadership'],
    problem: 'Slowdowns were only discovered when staff complained, and nobody could say which system was at fault.',
    did: 'I added performance monitoring to the main applications, built dashboards for each, and set alerts that go straight to the team’s chat.',
    result: 'Most issues are now spotted from an alert, not a complaint, and leadership gets a regular, branded summary.',
    tools: 'Grafana, Prometheus, alerting, SQL',
  },
  {
    id: 'auto',
    visual: 'automation',
    kind: 'Building',
    title: 'Replacing a paid tool with automation',
    summary: 'Rebuilt a team’s project boards inside the office suite they already paid for, with automatic reminders.',
    results: ['Subscription removed', 'Reminders sent automatically'],
    problem: 'Teams paid for a separate project tool mostly to send deadline reminders, and the data lived outside the company’s systems.',
    did: 'I recreated each board as a list in the existing office suite, built flows for reminders and approvals, and put it all inside the team chat app.',
    result: 'The extra subscription was cancelled, and reminders now go out on their own without anyone chasing.',
    tools: 'Microsoft 365, SharePoint lists, Power Automate, Teams',
  },
  {
    id: 'sec',
    visual: 'security',
    kind: 'Running',
    title: 'Closing security findings',
    summary: 'Worked through scan findings across company domains and sites: email settings, old plugins and exposed services.',
    results: ['Findings closed', 'Regular scans in place'],
    problem: 'External scans flagged weak email settings, outdated website plugins and a database open to the internet.',
    did: 'I ranked findings by risk, fixed the urgent ones first, tightened email authentication and firewall rules, and scheduled regular rescans.',
    result: 'The serious findings were closed within weeks, and new ones now show up in a monthly scan instead of an audit.',
    tools: 'DNS, email authentication, firewalls, WordPress, TLS',
  },
]

/* ---------- Skills ---------- */

export const skillsIntro = {
  heading: 'Skills, by project',
  lede: 'Choose a project to light up the skills it needed.',
  // The cloud collapses on narrow screens.
  more: 'Show all skills',
  less: 'Show fewer skills',
}

export const skillGroups = [
  { id: 'build', label: 'Building' },
  { id: 'run', label: 'Running' },
  { id: 'data', label: 'Data' },
  { id: 'work', label: 'Ways of working' },
]

export const skills = [
  { name: 'JavaScript', group: 'build' },
  { name: 'TypeScript', group: 'build' },
  { name: 'React', group: 'build' },
  { name: 'Node.js', group: 'build' },
  { name: 'PHP', group: 'build' },
  { name: 'Python', group: 'build' },
  { name: 'REST APIs', group: 'build' },
  { name: 'WordPress', group: 'build' },
  { name: 'Power Automate', group: 'build' },
  { name: 'Linux', group: 'run' },
  { name: 'Nginx', group: 'run' },
  { name: 'Docker', group: 'run' },
  { name: 'Grafana', group: 'run' },
  { name: 'Prometheus', group: 'run' },
  { name: 'DNS and email security', group: 'run' },
  { name: 'TLS certificates', group: 'run' },
  { name: 'Firewalls', group: 'run' },
  { name: 'Microsoft 365', group: 'run' },
  { name: 'SQL', group: 'data' },
  { name: 'MySQL', group: 'data' },
  { name: 'SharePoint lists', group: 'data' },
  { name: 'Backups and restores', group: 'data' },
  { name: 'Change management', group: 'work' },
  { name: 'Incident management', group: 'work' },
  { name: 'Vendor management', group: 'work' },
  { name: 'Access reviews', group: 'work' },
  { name: 'Training users', group: 'work' },
]

// Which skills each project used. Keys match `cases[].id`, values match `skills[].name`.
export const skillsByCase = {
  mig: ['Linux', 'Nginx', 'MySQL', 'PHP', 'WordPress', 'DNS and email security', 'TLS certificates', 'Backups and restores', 'Change management'],
  mon: ['Grafana', 'Prometheus', 'SQL', 'Linux', 'Incident management', 'Python'],
  auto: ['Power Automate', 'SharePoint lists', 'Microsoft 365', 'JavaScript', 'Training users', 'Change management'],
  sec: ['DNS and email security', 'TLS certificates', 'Firewalls', 'WordPress', 'Linux', 'Vendor management', 'Access reviews'],
}

/* ---------- Experience ---------- */

export const experienceHeading = 'Experience'

// Long roles collapse behind this on narrow screens.
export const experienceLabels = {
  more: 'Read more',
  less: 'Show less',
}

export const experience = [
  {
    when: '2024 to now',
    title: 'Application manager',
    org: 'FMDQ Group PLC',
    points: [
      'Provide first- and second-line application and technical support across FMDQ Group’s web platforms, internal systems, and infrastructure, covering system monitoring, troubleshooting, and incident resolution.',
      'Diagnose and resolve multi-layered connectivity issues on production systems including SSL/TLS certificate mismatches, and database connection failures.',
      'Administer and troubleshoot Apache/Nginx web servers and aaPanel-managed hosting environments, including WordPress and Elementor CMS compatibility issues across multiple subdirectory sites.',
      'Identify and remediate database availability issues on MySQL/MariaDB servers, including recovery from out-of-memory failures and correction of insecure service configurations, restoring both authentication integrity and remote connectivity.',
      'Manage server-to-server data migrations and large-file transfers, with attention to data integrity verification and minimal service disruption.',
      'Digitise legacy records into a central database with a focus on data accuracy and integrity.',
      'Test and validate models supporting internal systems, including property ownership verification workflows.',
      'Coordinate vendor security and compliance documentation and prepare IT change management requests for infrastructure changes.',
      'Document workflows and support internal knowledge base development',
    ],
  },
  {
    when: '2023 to 2024',
    title: 'Adhoc Digitizing Office',
    org: 'Detamainingu Limited',
    points: [
      'Supported database migration through large-scale document digitisation and data entry.',
      'Conducted quality checks, error tracking, and ensured adherence to digitisation protocols.',
      'Assisted in building simple verification models using internal platforms.',
      'Maintained digital file accuracy and followed best practices in information management',
      'Built web apps and internal tools for clients in finance and education.',
      'Designed APIs and integrations between payment, HR and reporting systems.',
    ],
  },
  {
    when: '2023 to 2024',
    title: 'Web Developer',
    org: 'Idea Konsult.',
    points: [
      'Designed and maintained scalable websites with user-centric design in mind.',
      'Collaborated with internal teams to troubleshoot user experience (UX) and browser compatibility issues.',
      'Conducted basic testing and documentation for feedback loops'
    ],
  },
  {
    when: '2022 to 2023',
    title: 'IT support',
    org: 'Management Information Centre, Office of the Executive Governor, Oyo State',
    points: [
      'Developed and maintained internal web platforms for state use.',
      'Supported the Smart Card project for civil servants, including user data collection and upload.',
      'Worked alongside application support staff to improve system accessibility and performance.',
      'Assisted in SEO optimisation, front-end debugging, and system reporting.',
    ],
  },
  {
    when: '2018 to 2023',
    title: 'BSc Computer Science',
    org: 'Kwara State University',
    points: [],
  },
]

/* ---------- Contact ---------- */

export const contact = {
  heading: 'Open a ticket',
  lede: 'Hiring, a project, or a system that needs looking after? Tell me what you need and I’ll reply within one working day.',
  // A link with `cv: true` is intercepted and shows `cvMessage` instead of navigating.
  links: [
    { label: 'Email', detail: 'danieloluwanifemi2002@gmail.com', href: 'mailto:danieloluwanifemi2002@gmail.com' },
    { label: 'LinkedIn', detail: 'Oluwanifemi Oso', href: 'https://www.linkedin.com/' },
    { label: 'GitHub', detail: '@DannyS641', href: 'https://github.com/' },
    { label: 'CV', detail: 'PDF, 2 pages', href: '#contact', cv: true },
  ],
  cvLabel: 'Download CV',
  cvMessage: 'The CV download would start here. In the mockup there’s no file yet.',
  topics: ['A job', 'A project', 'Support for a system', 'Just saying hello'],
  priorities: [
    { label: 'No rush', tone: 'low' },
    { label: 'This month', tone: 'mid' },
    { label: 'Urgent', tone: 'high' },
  ],
  errors: {
    name: 'Add your name so I know who to reply to.',
    email: 'Add an email address I can reply to.',
    details: 'Add a few details about what you need.',
  },
  steps: [
    { title: 'Received', note: 'Your message is in my inbox' },
    { title: 'Read', note: 'Usually within a few hours' },
    { title: 'Reply', note: 'Within one working day' },
  ],
}
