import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { createScheduler } from '../lib/scheduler'
import {
  diagramIntro,
  diagramNodes,
  diagramEdges,
  diagramFlows,
  diagramIncident,
} from '../content'

const SVG_NS = 'http://www.w3.org/2000/svg'

/** Lucide "pointer" — a hand about to tap. */
function TapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 14a8 8 0 0 1-8 8" />
      <path d="M18 11v-1a2 2 0 0 0-4 0" />
      <path d="M14 10V9a2 2 0 0 0-4 0v1" />
      <path d="M10 9.5V4a2 2 0 0 0-4 0v10" />
      <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  )
}

/**
 * The boxes-and-wires picture of the job. Packets trickle along the edges, and
 * every so often one goes slow, monitoring pings, and it clears again.
 *
 * Nothing here depends on hovering: a row of buttons under the diagram selects
 * each part, and when the section first scrolls into view it tours itself so
 * the picture explains its own behaviour. Any interaction ends the tour for good.
 */
export default function SystemDiagram({ animate }) {
  const sectionRef = useRef(null)
  const frameRef = useRef(null)
  const packetsRef = useRef(null)
  const tookOver = useRef(false)

  const [activeId, setActiveId] = useState(diagramIntro.defaultNodeId ?? null)
  const [touring, setTouring] = useState(false)
  const [touch, setTouch] = useState(false)
  const [alerting, setAlerting] = useState(false)
  const [log, setLog] = useState({ text: '', warn: false })

  const active = diagramNodes.find((node) => node.id === activeId)

  useEffect(() => {
    setTouch(window.matchMedia('(hover: none)').matches)
  }, [])

  /** Any deliberate pick — this is what stops the tour. */
  function pick(id) {
    tookOver.current = true
    setTouring(false)
    setActiveId(id)
  }

  function stopTour() {
    tookOver.current = true
    setTouring(false)
  }

  // Start the tour the first time the diagram is properly on screen.
  useEffect(() => {
    if (!animate) return undefined
    const frame = frameRef.current
    if (!frame) return undefined

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tookOver.current) setTouring(true)
      },
      { threshold: .25 },
    )
    io.observe(frame)
    return () => io.disconnect()
  }, [animate])

  // Step through the parts while the tour runs.
  useEffect(() => {
    if (!touring) return undefined
    const timer = setInterval(() => {
      setActiveId((current) => {
        const i = diagramNodes.findIndex((node) => node.id === current)
        return diagramNodes[(i + 1) % diagramNodes.length].id
      })
    }, diagramIntro.tourStepSeconds * 1000)
    return () => clearInterval(timer)
  }, [touring])

  // Intro: the diagram assembles, the wires draw themselves, then traffic starts.
  useEffect(() => {
    if (!animate) return undefined

    const scheduler = createScheduler()

    const ctx = gsap.context(() => {
      const edges = gsap.utils.toArray('.edge')
      edges.forEach((edge) => {
        const length = edge.getTotalLength()
        gsap.set(edge, { strokeDasharray: length, strokeDashoffset: length })
      })

      gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } })
        .from('h2.t, .lede', { y: 30, opacity: 0, duration: .6, stagger: .1 })
        .from('.diagram', {
          y: 60,
          opacity: 0,
          rotateX: 20,
          duration: .8,
          ease: 'power3.out',
          transformPerspective: 1200,
        }, .1)
        .from('.node .nb', {
          scale: 0,
          transformOrigin: '50% 50%',
          duration: .5,
          ease: 'back.out(2)',
          stagger: .08,
        }, .4)
        .to(edges, { strokeDashoffset: 0, duration: .6, stagger: .07, ease: 'power2.out' }, .8)
        .add(startTraffic, '-=.2')
    }, sectionRef)

    function packet(edgeId, warn, delay = 0) {
      const dot = document.createElementNS(SVG_NS, 'circle')
      dot.setAttribute('r', warn ? 7 : 5.5)
      dot.setAttribute('class', `pk${warn ? ' warn' : ''}`)
      packetsRef.current.appendChild(dot)
      gsap.set(dot, { opacity: 0 })

      return gsap.timeline({ delay, onComplete: () => dot.remove() })
        .set(dot, { opacity: 1 })
        .to(dot, {
          motionPath: { path: `#${edgeId}`, align: `#${edgeId}`, alignOrigin: [.5, .5] },
          duration: 1.1 + Math.random() * .6,
          ease: 'none',
        })
        .to(dot, { opacity: 0, duration: .15 })
    }

    function startTraffic() {
      diagramFlows.forEach((edgeId, i) => {
        scheduler.after(i * .25, function loop() {
          packet(edgeId, false)
          scheduler.after(.9 + Math.random() * 1.6, loop)
        })
      })
      scheduler.after(4, raiseIncident)
    }

    function raiseIncident() {
      packet('e6', true)
      packet('e7', true, 1.2)

      scheduler.after(1.2, () => {
        setAlerting(true)
        setLog({ text: diagramIncident.raised, warn: true })
        gsap.fromTo('#n-mon .nb',
          { scale: 1 },
          { scale: 1.12, transformOrigin: '50% 50%', duration: .25, yoyo: true, repeat: 3 })
      })

      scheduler.after(4, () => {
        setAlerting(false)
        setLog({ text: diagramIncident.cleared, warn: false })
        gsap.fromTo(`#n-${diagramIncident.nodeId} .nb`,
          { scale: 1.1, transformOrigin: '50% 50%' },
          { scale: 1, duration: .5, ease: 'back.out(3)' })
      })

      scheduler.after(9, () => setLog({ text: '', warn: false }))
      scheduler.after(16, raiseIncident)
    }

    return () => {
      scheduler.kill()
      ctx.revert()
      if (packetsRef.current) packetsRef.current.replaceChildren()
    }
  }, [animate])

  // The frame tips a little towards the pointer.
  useEffect(() => {
    const frame = frameRef.current
    if (!animate || !frame) return undefined

    const rotX = gsap.quickTo(frame, 'rotationX', { duration: .6 })
    const rotY = gsap.quickTo(frame, 'rotationY', { duration: .6 })
    gsap.set(frame, { transformPerspective: 1200 })

    const onMove = (event) => {
      if (event.pointerType === 'touch') return
      const r = frame.getBoundingClientRect()
      rotY(((event.clientX - r.left) / r.width - .5) * 8)
      rotX((.5 - (event.clientY - r.top) / r.height) * 6)
    }
    const onLeave = () => { rotX(0); rotY(0) }

    frame.addEventListener('pointermove', onMove)
    frame.addEventListener('pointerleave', onLeave)
    return () => {
      frame.removeEventListener('pointermove', onMove)
      frame.removeEventListener('pointerleave', onLeave)
      gsap.set(frame, { clearProps: 'rotationX,rotationY,transformPerspective' })
    }
  }, [animate])

  // Fade the description in when a different part is shown.
  useEffect(() => {
    if (!animate || !activeId) return
    gsap.fromTo('#dtip', { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .3 })
  }, [activeId, animate])

  return (
    <section className="pad system" id="system" ref={sectionRef}>
      <div className="wrap">
        <div>
          <h2 className="t">{diagramIntro.heading}</h2>
          <p className="lede">{diagramIntro.lede}</p>
        </div>

        <div className="diagram" ref={frameRef}>
          <svg viewBox="0 0 600 520" role="img" aria-labelledby="dg-t">
            <title id="dg-t">Diagram of the systems I build and look after</title>

            <g id="edges">
              {diagramEdges.map((edge) => (
                <path className="edge" key={edge.id} id={edge.id} d={edge.d} />
              ))}
            </g>

            {/* packets are created and removed imperatively by GSAP */}
            <g id="packets" ref={packetsRef} />

            <g id="nodes">
              {diagramNodes.map((node) => {
                const on = node.id === activeId
                const classes = ['node']
                if (on) classes.push('hot')
                if (on && touring) classes.push('touring')
                if (alerting && node.id === diagramIncident.nodeId) classes.push('alert')

                return (
                  <g
                    key={node.id}
                    id={`n-${node.id}`}
                    className={classes.join(' ')}
                    transform={`translate(${node.x} ${node.y})`}
                    tabIndex={0}
                    role="button"
                    aria-pressed={on}
                    aria-label={`${node.label}: ${node.tip}`}
                    onMouseEnter={() => pick(node.id)}
                    onFocus={() => pick(node.id)}
                    onClick={() => pick(node.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        pick(node.id)
                      }
                    }}
                  >
                    {/* pulsing halo, only while the tour is on this part */}
                    <rect
                      className="ring"
                      x={-node.w / 2 - 7}
                      y={-35}
                      width={node.w + 14}
                      height={70}
                      rx={16}
                    />
                    <g className="nb">
                      <rect x={-node.w / 2} y={-28} width={node.w} height={56} rx={12} />
                      <text x={0} y={1}>{node.label}</text>
                      <circle className="led" cx={node.w / 2 - 12} cy={-16} r={5} />
                    </g>
                  </g>
                )
              })}
            </g>
          </svg>

          <p className="dtip" id="dtip" aria-live="polite">
            <b>{active ? active.label : diagramIntro.emptyTip.title}</b>
            {active ? active.tip : diagramIntro.emptyTip.body}
          </p>

          <p className={`dlog${log.warn ? ' warn' : ''}`} aria-live="polite">{log.text}</p>

          <p className="dhint">
            <TapIcon />
            <span>{touch ? diagramIntro.hintTouch : diagramIntro.hint}</span>
            {touring && (
              <button type="button" className="stop" onClick={stopTour}>
                {diagramIntro.tourStop}
              </button>
            )}
          </p>

          <div className="dpick" role="group" aria-label={diagramIntro.pickLabel}>
            {diagramNodes.map((node) => (
              <button
                key={node.id}
                type="button"
                aria-pressed={node.id === activeId}
                onClick={() => pick(node.id)}
              >
                {node.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
