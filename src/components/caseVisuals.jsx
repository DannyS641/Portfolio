import { useMemo } from 'react'
import { gsap } from '../lib/gsap'

/**
 * The little animated diagrams on each work card.
 *
 * Each one is a React SVG plus a matching entry in `playCaseVisual`, which
 * animates it imperatively from a DOM node. Adding a new one means: export a
 * component here, list it in VISUALS, and add a branch to playCaseVisual.
 */

/* ---------- the five in use ---------- */

const ROSTER = ['Guard', 'Forward', 'Centre', 'Guard']

/** A5 Athletes: the pathway out, and the roster that fills in behind it. */
function ProfilesVisual() {
  return (
    <svg viewBox="0 0 640 320" aria-hidden="true">
      <path className="e arc" d="M46 78Q320 4 594 78" strokeDasharray="7 9" />
      <text className="s" x="46" y="108" textAnchor="middle">Lagos</text>
      <text className="s" x="594" y="108" textAnchor="middle">US prep</text>
      <circle className="sig token" cx="46" cy="78" r="8" />

      {ROSTER.map((position, i) => {
        const x = 32 + i * 152
        return (
          <g className="card" key={`${position}-${i}`}>
            <rect className="pf" x={x} y="138" width="120" height="148" rx="12" />
            <circle className="e" cx={x + 60} cy="178" r="20" />
            <rect className="sig" x={x + 24} y="212" width="72" height="9" rx="4.5" />
            <rect className="e" x={x + 24} y="232" width="72" height="22" rx="11" />
            <text className="s" x={x + 60} y="247" textAnchor="middle">{position}</text>
          </g>
        )
      })}
    </svg>
  )
}

/** Team portal: sign in, own a profile, and be marked present by joining. */
function PortalVisual() {
  return (
    <svg viewBox="0 0 640 320" aria-hidden="true">
      <rect className="pf" x="200" y="40" width="240" height="196" rx="16" />

      <g className="login">
        <text className="s" x="320" y="82" textAnchor="middle">Sign in</text>
        <rect className="e" x="228" y="98" width="184" height="30" rx="8" />
        <rect className="e" x="228" y="140" width="184" height="30" rx="8" />
        <rect className="sig fld" x="236" y="108" width="104" height="10" rx="5" />
        <rect className="sig fld" x="236" y="150" width="136" height="10" rx="5" />
        <rect className="sig go" x="228" y="184" width="184" height="34" rx="10" />
        <text className="on-fill" x="320" y="206" textAnchor="middle">Log in</text>
      </g>

      <g className="profile" opacity="0">
        <circle className="e" cx="320" cy="92" r="26" />
        <rect className="sig" x="266" y="134" width="108" height="11" rx="5.5" />
        <rect className="e" x="252" y="156" width="136" height="14" rx="7" />
        <rect className="e" x="266" y="182" width="108" height="14" rx="7" />
      </g>

      <g className="present">
        <rect className="okf" x="236" y="256" width="168" height="40" rx="20" />
        <path d="M266 276l9 9 17-19" stroke="#fff" strokeWidth="3.5" fill="none"
          strokeLinecap="round" strokeLinejoin="round" />
        <text className="on-fill" x="330" y="281">Present</text>
      </g>
    </svg>
  )
}

const CAMP_FIELDS = ['Player', 'Age and grade', 'Guardian', 'Emergency contact']

/** Summer camp: the whole registration happens on the page, in one pass. */
function SignupVisual() {
  return (
    <svg viewBox="0 0 640 320" aria-hidden="true">
      <rect className="pf" x="140" y="26" width="360" height="230" rx="16" />

      {CAMP_FIELDS.map((label, i) => {
        const y = 56 + i * 40
        return (
          <g key={label}>
            <text className="s" x="166" y={y + 4}>{label}</text>
            <rect className="e" x="166" y={y + 12} width="308" height="18" rx="9" />
            <rect className="sig fld" x="168" y={y + 14} width="304" height="14" rx="7" />
          </g>
        )
      })}

      <g className="go">
        <rect className="sig" x="166" y="210" width="308" height="34" rx="10" />
        <text className="on-fill" x="320" y="232" textAnchor="middle">Submit registration</text>
      </g>

      <g className="done" opacity="0">
        <circle className="okf" cx="320" cy="227" r="23" />
        <path d="M309 227l8 8 15-17" stroke="#fff" strokeWidth="3.5" fill="none"
          strokeLinecap="round" strokeLinejoin="round" />
      </g>

      <text className="s" x="320" y="290" textAnchor="middle">Ten days, Las Vegas to Los Angeles</text>
    </svg>
  )
}

const COMBINE_CHIPS = ['23 May', 'Lagos', 'Ages 13–19']
const COMBINE_FAQ = ['Who can enter?', 'What happens on the day?', 'Do scouts attend?']

/** The combine: lead with the details, then answer the questions that decide it. */
function EventVisual() {
  return (
    <svg viewBox="0 0 640 320" aria-hidden="true">
      {COMBINE_CHIPS.map((chip, i) => {
        const x = 46 + i * 190
        return (
          <g className="chip" key={chip}>
            <rect className="e" x={x} y="28" width="168" height="40" rx="20" />
            <text x={x + 84} y="53" textAnchor="middle">{chip}</text>
          </g>
        )
      })}

      {COMBINE_FAQ.map((question, i) => {
        const y = 108 + i * 68
        return (
          <g className="faq" key={question}>
            <rect className="pf" x="46" y={y} width="548" height="38" rx="10" />
            <text x="70" y={y + 24}>{question}</text>
            <path className="chev" d={`M${552} ${y + 15}l9 9 9-9`} stroke="var(--signal)"
              strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <rect className="ans" x="70" y={y + 46} width="430" height="10" rx="5" fill="var(--line)" />
          </g>
        )
      })}
    </svg>
  )
}

const LEDGER_ROWS = 5

/** Tchala: the admin side, where the team works the queue rather than the customer. */
function LedgerVisual() {
  return (
    <svg viewBox="0 0 640 320" aria-hidden="true">
      <text className="s" x="46" y="42">Reference</text>
      <text className="s" x="300" y="42">Amount</text>
      <text className="s" x="500" y="42">Status</text>
      <path className="e" d="M46 56H594" />

      {Array.from({ length: LEDGER_ROWS }, (_, i) => {
        const y = 78 + i * 44
        return (
          <g className="row" key={i}>
            <rect x="46" y={y} width={150 - (i % 3) * 22} height="14" rx="7" fill="var(--line)" />
            <rect x={300 + (i % 4) * 16} y={y} width={120 - (i % 4) * 16} height="14" rx="7" fill="var(--line)" />
            <rect className="wf pill" x="500" y={y - 5} width="94" height="24" rx="12" />
          </g>
        )
      })}
    </svg>
  )
}

/* ---------- the run-side four ---------- */

function MigrationVisual() {
  return (
    <svg viewBox="0 0 640 320" aria-hidden="true">
      <rect className="k" x="70" y="26" width="150" height="176" rx="12" />
      <rect className="k" x="420" y="26" width="150" height="176" rx="12" />
      <text x="145" y="226" textAnchor="middle">Old server</text>
      <text x="495" y="226" textAnchor="middle">New server</text>
      <path className="e" d="M230 114H410" strokeDasharray="6 8" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} className="pf blk" x="90" y={42 + i * 24} width="110" height="18" rx="4" />
      ))}
      <text className="s mig-n" x="320" y="278" textAnchor="middle">0 of 6 moved</text>
    </svg>
  )
}

function MonitoringVisual() {
  // One random-but-stable trace: a gentle wave with a spike where the incident is.
  const path = useMemo(() => {
    let d = 'M30 210'
    for (let x = 0; x <= 580; x += 20) {
      const y = 200 - Math.sin(x / 40) * 18 - (x > 360 && x < 420 ? 90 : 0) - Math.random() * 10
      d += ` L${30 + x} ${y.toFixed(1)}`
    }
    return d
  }, [])

  return (
    <svg viewBox="0 0 640 320" aria-hidden="true">
      <path className="e" d="M30 250H610" />
      <path className="ws" d="M30 120H610" strokeWidth="2" strokeDasharray="8 8" fill="none" />
      <text className="s" x="34" y="110">Alert threshold</text>
      <path className="sigs spark" d={path} fill="none" strokeWidth="3" strokeLinejoin="round" />
      <g className="bubble" opacity="0">
        <rect className="pf" x="330" y="34" width="190" height="44" rx="10" />
        <circle className="wf" cx="352" cy="56" r="7" />
        <text x="368" y="61">Slowdown caught</text>
      </g>
      <circle className="ping wf" cx="420" cy="118" r="7" opacity="0" />
    </svg>
  )
}

const RECORD_STEPS = ['Scan', 'Check', 'Index', 'Store']

function RecordsVisual() {
  return (
    <svg viewBox="0 0 640 320" aria-hidden="true">
      {RECORD_STEPS.map((step, i) => {
        const x = 40 + i * 150
        return (
          <g className="stp" key={step}>
            <rect className="pf" x={x} y="110" width="120" height="70" rx="12" />
            <text x={x + 60} y="150" textAnchor="middle">{step}</text>
            <circle className="okf tick" cx={x + 108} cy="112" r="11" opacity="0" />
            {i < RECORD_STEPS.length - 1 && (
              <path className="e" d={`M${x + 122} 145H${x + 148}`} />
            )}
          </g>
        )
      })}
      <circle className="sig tok" cx="40" cy="145" r="8" />
      <text className="s" x="320" y="250" textAnchor="middle">Accuracy checked on the way in</text>
    </svg>
  )
}

const FINDINGS = [
  [150, 90], [230, 150], [120, 190], [300, 80], [260, 230], [180, 250],
  [340, 180], [400, 110], [460, 210], [520, 140], [480, 70], [560, 240],
]

function SecurityVisual() {
  return (
    <svg viewBox="0 0 640 320" aria-hidden="true">
      {FINDINGS.map(([cx, cy], i) => (
        <circle key={`${cx}-${cy}`} className={`${i % 3 ? 'wf' : 'bf'} fnd`} cx={cx} cy={cy} r="9" />
      ))}
      <rect className="sigs scan" x="20" y="40" width="4" height="240" fill="var(--signal)" />
      <text className="s sec-n" x="320" y="300" textAnchor="middle">
        {FINDINGS.length} open findings
      </text>
    </svg>
  )
}

const VISUALS = {
  profiles: ProfilesVisual,
  portal: PortalVisual,
  signup: SignupVisual,
  event: EventVisual,
  ledger: LedgerVisual,
  migration: MigrationVisual,
  monitoring: MonitoringVisual,
  records: RecordsVisual,
  security: SecurityVisual,
}

export function CaseVisual({ name }) {
  const Component = VISUALS[name]
  return Component ? <Component /> : null
}

/**
 * Play the animation for a visual already in the DOM.
 * `root` is the element wrapping the SVG; returns the timeline so the caller
 * can check `isActive()` before replaying.
 */
export function playCaseVisual(root, name) {
  if (!root) return null
  const tl = gsap.timeline()

  if (name === 'profiles') {
    const cards = root.querySelectorAll('.card')
    const arc = root.querySelector('.arc')
    const token = root.querySelector('.token')

    gsap.set(cards, { opacity: 0, y: 26, scale: .9, transformOrigin: 'center bottom' })
    gsap.set(token, { opacity: 1 })

    tl.to(token, {
      duration: 1.8,
      ease: 'power1.inOut',
      motionPath: { path: arc, align: arc, alignOrigin: [.5, .5] },
    }, 0)
      .to(cards, { opacity: 1, y: 0, scale: 1, duration: .5, ease: 'back.out(2)', stagger: .14 }, .45)
  }

  if (name === 'portal') {
    const login = root.querySelector('.login')
    const profile = root.querySelector('.profile')
    const present = root.querySelector('.present')
    const fields = root.querySelectorAll('.login .fld')

    gsap.set(login, { opacity: 1, y: 0 })
    gsap.set(fields, { scaleX: 0, transformOrigin: 'left center' })
    gsap.set(profile, { opacity: 0 })
    gsap.set(profile.children, { opacity: 0, y: 12 })
    gsap.set(present, { opacity: 0 })

    tl.to(fields, { scaleX: 1, duration: .45, ease: 'power2.out', stagger: .3 })
      .to(root.querySelector('.go'), {
        scale: .94, transformOrigin: 'center', duration: .12, yoyo: true, repeat: 1,
      })
      .to(login, { opacity: 0, y: -16, duration: .3 })
      .set(profile, { opacity: 1 })
      .to(profile.children, { opacity: 1, y: 0, duration: .35, ease: 'power2.out', stagger: .09 })
      .fromTo(present, { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: .45, ease: 'back.out(2)' }, '-=.15')
  }

  if (name === 'signup') {
    const fields = root.querySelectorAll('.fld')
    const go = root.querySelector('.go')
    const done = root.querySelector('.done')

    gsap.set(fields, { scaleX: 0, transformOrigin: 'left center' })
    gsap.set(go, { opacity: 1 })
    gsap.set(done, { opacity: 0, scale: 0, transformOrigin: 'center' })

    tl.to(fields, { scaleX: 1, duration: .4, ease: 'power2.out', stagger: .26 })
      .to(go, { scale: .95, transformOrigin: 'center', duration: .12, yoyo: true, repeat: 1 })
      .to(go, { opacity: 0, duration: .25 })
      .to(done, { opacity: 1, scale: 1, duration: .45, ease: 'back.out(3)' }, '-=.1')
  }

  if (name === 'event') {
    const chips = root.querySelectorAll('.chip')
    const rows = root.querySelectorAll('.faq')

    gsap.set(chips, { opacity: 0, scale: .85, transformOrigin: 'center' })
    rows.forEach((row) => {
      gsap.set(row.querySelector('.ans'), { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(row.querySelector('.chev'), { rotation: 0, transformOrigin: 'center' })
    })

    tl.to(chips, { opacity: 1, scale: 1, duration: .4, ease: 'back.out(2)', stagger: .12 })
    rows.forEach((row, i) => {
      tl.to(row.querySelector('.chev'), { rotation: 180, duration: .3, ease: 'power2.inOut' }, .6 + i * .45)
        .to(row.querySelector('.ans'), { scaleX: 1, duration: .4, ease: 'power2.out' }, .68 + i * .45)
    })
  }

  if (name === 'ledger') {
    const rows = root.querySelectorAll('.row')

    rows.forEach((row) => {
      gsap.set(row, { opacity: 0, x: -24 })
      row.querySelector('.pill').style.fill = 'var(--warn)'
    })

    rows.forEach((row, i) => {
      const pill = row.querySelector('.pill')
      tl.to(row, { opacity: 1, x: 0, duration: .35, ease: 'power2.out' }, i * .16)
        .to(pill, {
          scale: 1.14,
          transformOrigin: 'center',
          duration: .18,
          yoyo: true,
          repeat: 1,
          onStart() { pill.style.fill = 'var(--ok)' },
        }, .9 + i * .22)
    })
  }

  if (name === 'migration') {
    const blocks = root.querySelectorAll('.blk')
    const counter = root.querySelector('.mig-n')
    gsap.set(blocks, { x: 0, fill: 'var(--surface)' })
    counter.textContent = `0 of ${blocks.length} moved`

    blocks.forEach((block, i) => {
      tl.to(block, {
        x: 330,
        duration: .55,
        ease: 'power2.inOut',
        onComplete() {
          block.style.fill = 'color-mix(in srgb, var(--ok) 28%, var(--surface))'
          counter.textContent = `${i + 1} of ${blocks.length} moved`
        },
      }, i * .35)
    })
  }

  if (name === 'monitoring') {
    const spark = root.querySelector('.spark')
    const length = spark.getTotalLength()
    gsap.set(spark, { strokeDasharray: length, strokeDashoffset: length })

    tl.to(spark, { strokeDashoffset: 0, duration: 2.2, ease: 'none' })
      .to(root.querySelector('.ping'), { opacity: 1, duration: .1 }, 1.5)
      .fromTo(root.querySelector('.ping'),
        { scale: 1, transformOrigin: 'center' },
        { scale: 3, opacity: 0, duration: .9, repeat: 2 }, 1.5)
      .to(root.querySelector('.bubble'), { opacity: 1, y: -6, duration: .4 }, 1.6)
  }

  if (name === 'records') {
    const token = root.querySelector('.tok')
    const ticks = root.querySelectorAll('.tick')
    gsap.set(token, { x: 0, opacity: 1 })
    gsap.set(ticks, { opacity: 0, scale: 0, transformOrigin: 'center' })

    ticks.forEach((tick, i) => {
      tl.to(token, { x: 60 + i * 150, duration: .5, ease: 'power2.inOut' })
        .to(tick, { opacity: 1, scale: 1, duration: .35, ease: 'back.out(3)' })
    })
    tl.to(token, { opacity: 0, duration: .2 })
  }

  if (name === 'security') {
    const dots = root.querySelectorAll('.fnd')
    const counter = root.querySelector('.sec-n')
    const scan = root.querySelector('.scan')
    const left = { v: dots.length }

    gsap.set(dots, { opacity: 1, scale: 1, transformOrigin: 'center' })
    gsap.set(scan, { x: 0 })
    counter.textContent = `${dots.length} open findings`

    tl.to(scan, { x: 600, duration: 2.4, ease: 'none' })

    // clear each finding as the scan line sweeps past it
    Array.from(dots)
      .sort((a, b) => a.cx.baseVal.value - b.cx.baseVal.value)
      .forEach((dot) => {
        const at = (dot.cx.baseVal.value - 20) / 600 * 2.4
        tl.to(dot, {
          scale: 0,
          opacity: 0,
          duration: .25,
          ease: 'back.in(2)',
          onComplete() {
            left.v -= 1
            counter.textContent = left.v
              ? `${left.v} open finding${left.v > 1 ? 's' : ''}`
              : 'All findings closed'
          },
        }, at)
      })
  }

  return tl
}
