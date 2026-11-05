# Oluwanifemi Oso — Portfolio

A single-page portfolio for Oluwanifemi Oso, software engineer and application manager.
Built with **React 19** and **Vite**, animated with **GSAP** (ScrollTrigger, MotionPath, Flip)
and **Lenis** for smooth scrolling.

## Running it

```sh
npm install
npm run dev      # dev server with hot reload
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## Editing the content

**Everything written on the site lives in [`src/content.js`](src/content.js).** Change it there
and the components pick it up — you shouldn't need to touch any JSX to make this yours.

| What | Where in `content.js` |
| --- | --- |
| Name, role, headline, footer | `person` |
| Hero captions, and the two lines the particles spell | `heroCaptions`, `person.particleLines` |
| Boot screen lines | `bootLines` |
| System diagram boxes and wiring | `diagramNodes`, `diagramEdges`, `diagramFlows` |
| Uptime strip | `services` |
| "I build" / "I run" lists | `buildRun` |
| Case studies | `cases` |
| Skills, and which project used each | `skills`, `skillsByCase` |
| Jobs and education | `experience` |
| Contact links, form options, messages | `contact` |

Two things to know when editing:

- `cases[].visual` picks which animated diagram a card gets — `migration`, `monitoring`,
  `automation` or `security`. Reuse one, or add your own in
  [`src/components/caseVisuals.jsx`](src/components/caseVisuals.jsx).
- `skillsByCase` keys must match a `cases[].id`, and its values must match a `skills[].name`
  exactly, or the skill won't light up.

## Layout

```
src/
├── content.js              all site copy and data — edit this
├── App.jsx                 composes the sections, owns boot + CV state
├── main.jsx                entry point
├── components/             one file per section
├── hooks/                  reduced motion, Lenis + GSAP ticker
├── lib/
│   ├── gsap.js             registers the plugins once
│   ├── particles.js        the hero's canvas particle field
│   ├── scheduler.js        killable gsap.delayedCall pool
│   └── smoothScroll.js     shared Lenis instance
└── styles/                 tokens.css, layout.css, sections.css
```

## Sections

| Section | What it does |
| --- | --- |
| Boot screen | Fake service start-up, once per session, skippable |
| Hero | Particle canvas reshaping from the name, to `</>`, to a heartbeat as you scroll |
| How the pieces fit | System diagram with live packet traffic and a recurring incident |
| Systems I look after | 60-day uptime bars per service |
| Two jobs, one person | Build / run tab switch |
| Selected work | Case studies with animated SVGs, opened in a native `<dialog>` |
| Skills, by project | Skill cloud re-laid-out with GSAP Flip |
| Experience | Scroll-drawn timeline |
| Open a ticket | Contact form styled as a support ticket |

## Still to replace

The copy is placeholder. The employers, project write-ups, the `hello@example.com` address,
the LinkedIn and GitHub links, and the CV download all need real values. The footer says
"Portfolio mockup" until then — clear `person.footerNote` when it isn't one.

The contact form is front end only. It validates and shows a ticket, but nothing is sent
anywhere; wire it to a form service or your own endpoint in
[`src/components/Contact.jsx`](src/components/Contact.jsx).

## Accessibility

Every animated component takes an `animate` prop driven by `prefers-reduced-motion`. When it is
off, the boot screen is skipped, the particles are drawn once and left still, and all content
renders at full opacity instead of waiting on a scroll trigger. The site also follows
`prefers-color-scheme` for its light and dark themes.
