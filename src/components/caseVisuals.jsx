import { useMemo } from 'react'
import { gsap } from '../lib/gsap'

/**
 * The little animated diagrams on each work card.
 *
 * Each one is a React SVG plus a matching entry in `playCaseVisual`, which
 * animates it imperatively from a DOM node. Adding a new one means: export a
 * component here, list it in VISUALS, and add a branch to playCaseVisual.
 */

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

const AUTOMATION_STEPS = ['Deadline near', 'Check status', 'Send reminder', 'Update board']

function AutomationVisual() {
  return (
    <svg viewBox="0 0 640 320" aria-hidden="true">
      {AUTOMATION_STEPS.map((step, i) => {
        const x = 40 + i * 150
        return (
          <g className="stp" key={step}>
            <rect className="pf" x={x} y="110" width="120" height="70" rx="12" />
            <text x={x + 60} y="150" textAnchor="middle">{step}</text>
            <circle className="okf tick" cx={x + 108} cy="112" r="11" opacity="0" />
            {i < AUTOMATION_STEPS.length - 1 && (
              <path className="e" d={`M${x + 122} 145H${x + 148}`} />
            )}
          </g>
        )
      })}
      <circle className="sig tok" cx="40" cy="145" r="8" />
      <text className="s" x="320" y="250" textAnchor="middle">Runs every morning at 8:00</text>
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
  migration: MigrationVisual,
  monitoring: MonitoringVisual,
  automation: AutomationVisual,
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

  if (name === 'automation') {
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
