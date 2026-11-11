/**
 * Everything written on the site lives here.
 * Edit this file to make the portfolio yours — the components read from it and
 * nothing else needs touching.
 */

// Screenshots of the live sites, used as the card and dialog visuals. Vite
// fingerprints these and rewrites the URLs, so they survive a sub-path deploy.
// To replace one: screenshot at 1440x900, then resize to 1200px wide.
import shotA5 from './assets/work/a5-athletes.jpg'
import shotPortal from './assets/work/team-portal.jpg'
import shotCamp from './assets/work/summer-camp.jpg'
import shotCombine from './assets/work/combine.jpg'

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
  // No employer name, no system names, no real figures, and no 'today'.
  //
  // The scale and the domain are what a hiring manager is reading for, and both
  // survive you changing jobs. Naming the individual platforms would instead
  // advertise you as the person holding the keys to named financial
  // infrastructure, and would go stale the day you leave.
  heading: 'Systems I look after',
  note: 'Trading, post-trade and corporate platforms for a financial market infrastructure group — around 35 services on one dashboard. The bars are an illustration, not a live feed.',
  allOk: 'All systems working',
}

// `slowDays` are zero-based day indexes (0 = 60 days ago, 59 = today).
export const services = [
  { name: 'Trading platforms', slowDays: [17, 42] },
  { name: 'Post-trade portals', slowDays: [30] },
  { name: 'Reporting portals', slowDays: [] },
  { name: 'Corporate and brand sites', slowDays: [8, 51] },
  { name: 'Databases', slowDays: [23] },
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

/**
 * The Selected work deck: the section pins and each card is thrown off as you
 * scroll, with the next one rising behind it.
 *
 * `screensPerCard` is how much scrolling each card gets, in viewport heights.
 * Total pinned height is (cards - 1) x this. The mockup used 0.9, which was
 * written when there were four cards — at nine that would pin the page for
 * nearly seven screens before Skills comes into reach.
 *
 * Set `enabled: false` for the plain grid, which is also what reduced motion
 * and a failed script fall back to.
 */
export const workDeck = {
  enabled: true,
  screensPerCard: 0.6,
  hint: 'Keep scrolling to flip through',
}

export const workIntro = {
  heading: 'Selected work',
  lede: 'Sites and portals I’ve built, and the systems I keep running. Open one to see the problem, what I did and where it stands.',
}

/**
 * `shot` is a screenshot of the live site and wins over `visual` when present.
 * Prefer it wherever there is a real site to show.
 *
 * `visual` picks the animated SVG drawn instead. One of:
 * 'profiles' | 'portal' | 'signup' | 'event' | 'ledger' for the things built,
 * 'migration' | 'monitoring' | 'security' | 'records' for the things run.
 * Add your own in src/components/caseVisuals.jsx. Every case keeps a `visual`
 * so there is still something to draw if a screenshot is removed.
 *
 * `link` is optional. When present the dialog shows a link out to the live site.
 */
export const cases = [
  {
    id: 'a5',
    visual: 'profiles',
    shot: shotA5,
    kind: 'Marketing site',
    title: 'A5 Athletes',
    summary: 'The main site for a prep, NIL and global pathway programme taking young basketball players from Africa to the United States.',
    results: ['Athlete roster and profiles', 'Live on a5athletes.com'],
    problem: 'A5 runs prep programmes, an NIL platform, a documentary series and government partnerships across several countries, with nowhere that explained any of it or let an athlete, sponsor or partner get in touch.',
    did: 'I built the site end to end: the programme and leadership pages, an athlete roster with a profile page per player, a gallery, embedded YouTube and Instagram feeds, a live panel, a newsletter sign-up and a contact form that sorts enquiries by type. Images are served through Cloudinary so the roster still loads quickly on a phone in Lagos.',
    result: 'It is the front door for the programme. Athletes sign in to the team portal from it, and partner, media and representation enquiries all arrive through the one form.',
    tools: 'React, Vercel, Cloudinary, YouTube and Instagram embeds',
    link: 'https://a5athletes.com',
  },
  {
    id: 'portal',
    visual: 'portal',
    shot: shotPortal,
    kind: 'Web app',
    title: 'A5 team portal',
    summary: 'Sign-in portal where players keep their own profile up to date and mark themselves present by joining the session.',
    results: ['Attendance on one click', 'Players onboard themselves'],
    problem: 'Coaches tracked who turned up to online sessions by hand, and player details — position, jersey number, team, contact — lived scattered across messages and spreadsheets.',
    did: 'I built a portal with sign-up and log-in, a profile each player owns and edits, and attendance that records itself: opening the session link from inside the portal marks that player present, so nobody keeps a register.',
    result: 'Players onboard themselves, and attendance is captured as a side effect of joining rather than as a separate job for a coach.',
    tools: 'React, Vercel, authentication, session links',
    link: 'https://player-profile-omega.vercel.app/',
  },
  {
    id: 'camp',
    visual: 'signup',
    shot: shotCamp,
    kind: 'Event site',
    title: 'A5 basketball summer camp',
    summary: 'Registration site for a ten-day camp in Los Angeles that opens with a stop at NBA Summer League in Las Vegas.',
    results: ['Registration built into the page', 'Day-by-day itinerary'],
    problem: 'The camp had to sell a ten-day trip abroad to families in Africa and then take their registrations, without paying for a booking platform to do it.',
    did: 'I built the site in Next.js: a countdown to the next session, the camp highlights, a day-by-day itinerary that expands, coach profiles, testimonials, and a registration form that captures the player, their age and grade, their guardian and an emergency contact in a single pass.',
    result: 'A family can read the full itinerary and register in the same visit, with no third-party booking tool in between.',
    tools: 'Next.js, Vercel, image optimisation',
    link: 'https://adrenale5-basketball-summer-camp.vercel.app/',
  },
  {
    id: 'combine',
    visual: 'event',
    shot: shotCombine,
    kind: 'Event site',
    title: 'Adrenale 5 national combine',
    summary: 'One-page site for a basketball combine in Lagos, where scouts pick players for a US scholarship and the national prep team.',
    results: ['FAQ that answers the phone calls', 'Light and dark themes'],
    problem: 'Parents had to commit a 13-to-19-year-old to a day of athletic testing and scouting, and the questions that decided it — who can enter, what happens on the day, what to bring, whether scouts really attend — were all being asked by phone.',
    did: 'I built a single page that leads with the date, venue and division, answers each of those questions in an expanding FAQ, and hands off to the registration form the organisers already used rather than replacing it.',
    result: 'The repeat questions are answered on the page, and the tournament director’s number is there for the ones that aren’t.',
    tools: 'HTML, CSS, JavaScript, Vercel',
    link: 'https://adrenale5.vercel.app/',
  },
  {
    id: 'tchala',
    visual: 'ledger',
    kind: 'In progress',
    title: 'Klario Admin Dashboard',
    summary: 'The admin side of a fintech product at Klario, built jointly with the team there.',
    results: ['Built with a team', 'Still in progress'],
    problem: 'Tchala needs an admin side — the screens the team uses to run the product, as opposed to the ones customers see.',
    did: 'I work on this one jointly with the team at Klario, on the console behind the customer-facing product.',
    result: 'Still in progress.',
    tools: 'To confirm',
  },

  /*
   * The four below are the running side of the job, written from the bullets in
   * your own Experience section. They name no employer and no system, for the
   * same reason the uptime strip doesn't.
   *
   * They are deliberately free of figures. Each one would land harder with a
   * single concrete detail only you can supply — how many sites moved, how long
   * an outage ran, how many records went in. Add those and delete this note.
   */
  {
    id: 'mig',
    visual: 'migration',
    kind: 'Infrastructure',
    title: 'Moving production systems between servers',
    summary: 'Server-to-server migrations and large-file transfers, with data integrity verified on both ends and disruption kept inside a planned window.',
    results: ['Integrity verified both ends', 'Cut-overs planned, not improvised'],
    problem: 'Systems in daily use still have to move — to new hardware, new hosting, or a new platform — without losing data and without taking the business offline in the middle of a working day.',
    did: 'I treat the move as an inventory first: every site, database and scheduled job that has to come across. Then I rebuild the stack on the destination, transfer in stages, and verify integrity at both ends before anything is pointed at its new home.',
    result: 'Migrations land inside a planned window, with the data checked rather than assumed.',
    tools: 'Linux, Apache and Nginx, MySQL/MariaDB, aaPanel',
  },
  {
    id: 'mon',
    visual: 'monitoring',
    kind: 'Monitoring',
    title: 'Catching problems before anyone reports them',
    summary: 'Availability monitoring across websites, portals and databases, so a failure shows up on a dashboard instead of on the support line.',
    results: ['Around 35 checks on one dashboard', 'Split by layer, so it points somewhere'],
    problem: 'Without monitoring, the first sign that something is down is somebody ringing to say so — and nobody can tell which layer is at fault: the site, the server, or the database underneath it.',
    did: 'I keep availability checks for the websites, portals and databases on a single dashboard, grouped by type so a red row points at the layer it came from. First- and second-line support runs off that same view.',
    result: 'Problems are visible as they start rather than once they have been noticed, and "is it just me?" is answered in one glance.',
    tools: 'Grafana, availability checks, Linux, SQL',
  },
  {
    id: 'sec',
    visual: 'security',
    kind: 'Security',
    title: 'Untangling connectivity failures and hardening what caused them',
    summary: 'Multi-layered production failures — TLS certificate mismatches, refused database connections — traced to the layer they actually came from, then closed properly.',
    results: ['Authentication integrity restored', 'Changes documented, not just made'],
    problem: 'Connectivity failures rarely sit in one layer. A site that will not load can be a certificate mismatch, a refused database connection, or a service that came back up misconfigured after a crash — and each one looks the same from the outside.',
    did: 'I work down the stack until the real layer surfaces, fix it there, then harden the configuration so the same failure cannot come back quietly. Infrastructure changes go through a documented change request, and vendor security and compliance paperwork is kept current alongside.',
    result: 'Authentication integrity and remote connectivity restored, with a change trail showing what moved and why.',
    tools: 'TLS certificates, MySQL/MariaDB, Apache and Nginx, change management',
  },
  {
    id: 'rec',
    visual: 'records',
    kind: 'Data',
    title: 'Digitising legacy records into a central database',
    summary: 'Large-scale document digitisation where accuracy, not volume, is the deliverable — quality checks and error tracking on the way in.',
    results: ['Accuracy checked, not assumed', 'Searchable in one place'],
    problem: 'Records held on paper cannot be searched, backed up or reported on. A digitisation run measured only on throughput quietly fills the database with errors that are far more expensive to find later.',
    did: 'I digitise records into a central database and treat integrity as the job: quality checks as the data goes in, error tracking, and sticking to the digitisation protocol rather than chasing raw volume.',
    result: 'Legacy records become searchable in one place, and accurate enough to report from.',
    tools: 'MySQL, SQL, quality assurance, data integrity checks',
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
  { name: 'Next.js', group: 'build' },
  { name: 'Node.js', group: 'build' },
  { name: 'PHP', group: 'build' },
  { name: 'Python', group: 'build' },
  { name: 'REST APIs', group: 'build' },
  { name: 'HTML and CSS', group: 'build' },
  { name: 'Authentication', group: 'build' },
  { name: 'Cloudinary', group: 'build' },
  { name: 'WordPress', group: 'build' },
  { name: 'Elementor', group: 'build' },
  { name: 'Power Automate', group: 'build' },
  { name: 'Linux', group: 'run' },
  { name: 'Nginx', group: 'run' },
  { name: 'Apache', group: 'run' },
  { name: 'aaPanel', group: 'run' },
  { name: 'Vercel', group: 'run' },
  { name: 'Docker', group: 'run' },
  { name: 'Grafana', group: 'run' },
  { name: 'Prometheus', group: 'run' },
  { name: 'DNS and email security', group: 'run' },
  { name: 'TLS certificates', group: 'run' },
  { name: 'Firewalls', group: 'run' },
  { name: 'Microsoft 365', group: 'run' },
  { name: 'SQL', group: 'data' },
  { name: 'MySQL', group: 'data' },
  { name: 'MariaDB', group: 'data' },
  { name: 'SharePoint lists', group: 'data' },
  { name: 'Backups and restores', group: 'data' },
  { name: 'Data integrity', group: 'data' },
  { name: 'Change management', group: 'work' },
  { name: 'Incident management', group: 'work' },
  { name: 'Vendor management', group: 'work' },
  { name: 'Access reviews', group: 'work' },
  { name: 'Training users', group: 'work' },
]

// Which skills each project used. Keys match `cases[].id`, values match `skills[].name`.
export const skillsByCase = {
  a5: ['React', 'JavaScript', 'HTML and CSS', 'Cloudinary', 'Vercel', 'DNS and email security'],
  portal: ['React', 'JavaScript', 'Authentication', 'REST APIs', 'Vercel'],
  camp: ['Next.js', 'React', 'JavaScript', 'HTML and CSS', 'Vercel'],
  combine: ['HTML and CSS', 'JavaScript', 'Vercel'],
  tchala: ['React', 'JavaScript', 'Authentication'],
  mig: ['Linux', 'Apache', 'Nginx', 'aaPanel', 'MySQL', 'MariaDB', 'Backups and restores', 'Data integrity', 'Change management'],
  mon: ['Grafana', 'Linux', 'SQL', 'Incident management'],
  sec: ['TLS certificates', 'Firewalls', 'Linux', 'Apache', 'MariaDB', 'Change management', 'Vendor management'],
  rec: ['MySQL', 'SQL', 'Data integrity'],
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
      'Identify and remediate database availability issues on MySQL/MariaDB servers, including recovery from out-of-memory failures and hardening of service configurations, restoring both authentication integrity and remote connectivity.',
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

// The inbox the form delivers to, in one place so the link, the mail fallback
// and the "that didn't send" message can't drift out of step.
const INBOX = 'danieloluwanifemi2002@gmail.com'

// Where the CV lives. Best is a PDF that ships with the site: drop it in
// public/cv/ and set this to './cv/<name>.pdf'. A file served from your own
// deploy can't expire, has no sign-in in front of it, and opens straight in
// the browser's PDF viewer.
//
// A Drive or WPS share link works too, but check it in a private window
// first: if sharing isn't set to "anyone with the link", recruiters get a
// Request access wall instead of your CV, and you never hear about it.
//
// Empty means no CV yet, and both CV links say so rather than going nowhere.
const CV_HREF = './cv/Oluwanifemi-Oso-CV.pdf'

export const contact = {
  inbox: INBOX,
  heading: 'Open a ticket',
  lede: 'Hiring, a project, or a system that needs looking after? Tell me what you need and I’ll reply within one working day.',
  // A link with `cv: true` is intercepted and shows `cvMessage` instead of navigating.
  links: [
    { label: 'Email', detail: INBOX, href: `mailto:${INBOX}` },
    { label: 'LinkedIn', detail: 'Oluwanifemi Oso', href: 'https://www.linkedin.com/' },
    { label: 'GitHub', detail: '@DannyS641', href: 'https://github.com/' },
    { label: 'CV', detail: 'PDF, 2 pages', href: CV_HREF || './public/cv/Daniel_Oluwanifemi_Resume 1.pdf', cv: !CV_HREF },
  ],
  cvLabel: 'Download CV',
  cvHref: CV_HREF,
  // Shown by both CV links while CV_HREF is empty. Set it and this goes unused.
  cvMessage: 'The CV isn’t uploaded yet — email me and I’ll send it straight over.',
  submitLabel: 'Open ticket',
  sendingLabel: 'Opening ticket…',
  openedHeading: 'Ticket opened',
  // {first} {topic} {priority} {email} are filled in once the message has sent.
  sentNote: 'Thanks, {first}. Topic: {topic}. Priority: {priority}. I’ll reply to {email}.',
  // Used instead of the three keys above when no form relay is configured and
  // the ticket is handed to the visitor's own mail app. Nothing has arrived
  // until they press send, so none of this says that it has.
  mail: {
    submitLabel: 'Open ticket in email',
    sendingLabel: 'Opening your mail app…',
    openedHeading: 'Ticket drafted',
    firstStep: { title: 'Drafted', note: 'Waiting in your mail app' },
    note: `Your mail app should have opened with all of this written out — press send and it’s with me. If nothing opened, email ${INBOX} and quote {reference}.`,
  },
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
    send: `That didn’t send — email ${INBOX} directly and I’ll pick it up there.`,
  },
  // The first of these is swapped for `mail.firstStep` in mail mode.
  steps: [
    { title: 'Received', note: 'Your message is in my inbox' },
    { title: 'Read', note: 'Usually within a few hours' },
    { title: 'Reply', note: 'Within one working day' },
  ],
}
