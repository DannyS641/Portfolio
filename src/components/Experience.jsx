import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useMediaQuery, NARROW } from '../hooks/useMediaQuery'
import { useClamp } from '../hooks/useClamp'
import MoreButton from './MoreButton'
import { experienceHeading, experienceLabels, experience } from '../content'

function Role({ role, index, lit, compact, onToggle }) {
  const { ref, open, toggle, clamped, showToggle } = useClamp(compact && role.points.length > 0)
  const listId = `role-${index}-points`

  function handleToggle() {
    toggle()
    onToggle()
  }

  return (
    <article className={`role${lit ? ' on' : ''}`}>
      <span className="when">{role.when}</span>
      <h3>{role.title}</h3>
      <span className="org">{role.org}</span>

      {role.points.length > 0 && (
        <ul id={listId} className={clamped ? 'clamped' : undefined} ref={ref}>
          {role.points.map((point) => <li key={point}>{point}</li>)}
        </ul>
      )}

      {showToggle && (
        <MoreButton
          open={open}
          onToggle={handleToggle}
          controls={listId}
          more={experienceLabels.more}
          less={experienceLabels.less}
        />
      )}
    </article>
  )
}

/** A rail that fills as you scroll, with a dot riding down it. */
export default function Experience({ animate }) {
  const sectionRef = useRef(null)
  const timelineRef = useRef(null)
  const compact = useMediaQuery(NARROW)
  const [reached, setReached] = useState(() => new Set())

  useEffect(() => {
    if (!animate) return undefined

    const ctx = gsap.context(() => {
      const tl = timelineRef.current

      gsap.to('#railfill', {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: tl, start: 'top 60%', end: 'bottom 60%', scrub: .4 },
      })

      gsap.to('#runner', {
        y: () => tl.offsetHeight - 17,
        ease: 'none',
        scrollTrigger: {
          trigger: tl,
          start: 'top 60%',
          end: 'bottom 60%',
          scrub: .4,
          invalidateOnRefresh: true,
        },
      })

      gsap.utils.toArray('.role').forEach((role, i) => {
        gsap.from(role.children, {
          x: 40,
          opacity: 0,
          stagger: .08,
          duration: .6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: role,
            start: 'top 75%',
            onEnter: () => setReached((prev) => new Set(prev).add(i)),
            onLeaveBack: () => setReached((prev) => {
              const next = new Set(prev)
              next.delete(i)
              return next
            }),
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [animate])

  // Expanding a role changes the timeline's height, so the rail and the runner
  // need their start/end positions recalculated.
  function remeasure() {
    if (animate) requestAnimationFrame(() => ScrollTrigger.refresh())
  }

  return (
    <section className="pad pad-top-0" id="experience" ref={sectionRef}>
      <div className="wrap">
        <h2 className="t">{experienceHeading}</h2>

        <div className="tl" ref={timelineRef}>
          <div className="rail" aria-hidden="true"><i id="railfill" /></div>
          <span className="runner" id="runner" aria-hidden="true" />

          {experience.map((role, i) => (
            <Role
              key={`${role.org}-${role.when}`}
              role={role}
              index={i}
              lit={reached.has(i)}
              compact={compact}
              onToggle={remeasure}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
