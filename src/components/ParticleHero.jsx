import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { createParticleField } from '../lib/particles'
import SmoothLink from './SmoothLink'
import { person, heroCaptions, heroHints } from '../content'

const MODES = ['name', 'code', 'pulse']

/**
 * Full-screen canvas of particles that spell the name, then `</>`, then a
 * heartbeat, as the section stays pinned and you scroll through it.
 *
 * `ready` goes true once the boot screen is out of the way.
 */
export default function ParticleHero({ animate, ready }) {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const fieldRef = useRef(null)
  const whoRef = useRef(null)
  const hintRef = useRef(null)
  const capsRef = useRef([])
  const prevPhase = useRef(0)

  const [phase, setPhase] = useState(0)
  const [hint, setHint] = useState(heroHints.pointer)

  // Build the field once. It owns its own canvas listeners and rAF loop.
  useEffect(() => {
    const field = createParticleField(canvasRef.current, { lines: person.particleLines })
    fieldRef.current = field

    if (window.matchMedia('(hover: none)').matches) setHint(heroHints.touch)

    return () => {
      field.destroy()
      fieldRef.current = null
    }
  }, [])

  // Only run the loop while the hero is on screen.
  useEffect(() => {
    const field = fieldRef.current
    if (!field || !animate) return undefined

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? field.start() : field.stop()))
    })
    io.observe(canvasRef.current)
    return () => {
      io.disconnect()
      field.stop()
    }
  }, [animate])

  // Pin the section and map scroll progress onto the three shapes.
  useEffect(() => {
    if (!animate) return undefined
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=180%',
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        setPhase(self.progress < .34 ? 0 : self.progress < .68 ? 1 : 2)
      },
    })
    return () => trigger.kill()
  }, [animate])

  // Reshape + swap the caption whenever the phase changes.
  useEffect(() => {
    const field = fieldRef.current
    const previous = prevPhase.current
    if (!field || previous === phase) return
    prevPhase.current = phase

    field.assign(MODES[phase], animate)
    if (!animate) {
      field.drawStatic()
      return
    }

    const [cx, cy] = field.center()
    field.burst(cx, cy, phase > previous ? 26 : 18)

    gsap.to(capsRef.current[previous], { yPercent: -60, opacity: 0, duration: .35, ease: 'power2.in' })
    gsap.fromTo(
      capsRef.current[phase],
      { yPercent: 60, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: .5, ease: 'power3.out', delay: .15 },
    )
  }, [phase, animate])

  // Once the boot screen clears, scatter the particles and let them fly home.
  useEffect(() => {
    const field = fieldRef.current
    if (!field || !ready) return undefined

    if (!animate) {
      field.drawStatic()
      return undefined
    }

    field.scatter()
    field.start()
    const tween = gsap.from([whoRef.current, capsRef.current[0], hintRef.current], {
      y: 30,
      opacity: 0,
      duration: .8,
      stagger: .12,
      ease: 'power3.out',
      delay: .4,
    })
    return () => tween.kill()
  }, [ready, animate])

  return (
    <section className="phero" id="top" ref={sectionRef} aria-labelledby="hero-h">
      <h1 className="sr" id="hero-h">{person.headline}</h1>
      <canvas id="pcv" ref={canvasRef} aria-hidden="true" />

      <div className="ov">
        <div className="wrap">
          <p className="who" ref={whoRef}>
            <i aria-hidden="true" />
            {person.role}
          </p>

          <div className="bottom">
            <div className="caps" aria-hidden="true">
              {heroCaptions.map((caption, i) => (
                <p
                  key={caption}
                  className={i === phase ? 'on' : undefined}
                  ref={(el) => { capsRef.current[i] = el }}
                >
                  {caption}
                </p>
              ))}
            </div>

            <div className="hint" ref={hintRef}>
              <span>{hint}</span>
              <div className="phase" aria-hidden="true">
                {MODES.map((mode, i) => (
                  <i key={mode} className={i === phase ? 'on' : undefined} />
                ))}
              </div>
              <div className="acts">
                <SmoothLink className="btn" href="#work">See my work</SmoothLink>
                <SmoothLink className="btn ghost" href="#contact">Get in touch</SmoothLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
