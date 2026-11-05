import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { statusStrip, services } from '../content'

const DAYS = 60

const uptimeFor = (slowDays) => (100 - slowDays.length * 0.04).toFixed(2)

const barLabel = (slowDays) =>
  slowDays.length
    ? `${slowDays.length} day${slowDays.length > 1 ? 's' : ''} with slowdowns, the rest fully working`
    : 'Fully working every day'

export default function StatusStrip({ animate }) {
  const sectionRef = useRef(null)
  const countRefs = useRef([])

  useEffect(() => {
    if (!animate) return undefined

    const ctx = gsap.context(() => {
      gsap.from('.bars i', {
        scaleY: 0,
        duration: .4,
        ease: 'power2.out',
        stagger: { each: .004, from: 'start' },
        scrollTrigger: { trigger: '.status', start: 'top 80%' },
      })
    }, sectionRef)

    // Counting up by writing textContent rather than through state: this ticks
    // every frame and React has nothing to gain from re-rendering that often.
    const triggers = countRefs.current.filter(Boolean).map((el) => {
      const target = Number(el.dataset.to)
      const proxy = { v: 95 }
      el.textContent = '95.00'
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(proxy, {
            v: target,
            duration: 1.6,
            ease: 'power3.out',
            onUpdate: () => { el.textContent = proxy.v.toFixed(2) },
          })
        },
      })
    })

    return () => {
      triggers.forEach((trigger) => trigger.kill())
      ctx.revert()
      // leave the final figures on screen
      countRefs.current.filter(Boolean).forEach((el) => { el.textContent = el.dataset.to })
    }
  }, [animate])

  return (
    <section className="wrap" ref={sectionRef} aria-labelledby="st-h">
      <div className="status">
        <div className="status-head">
          <div>
            <h2 id="st-h">{statusStrip.heading}</h2>
            <p>{statusStrip.note}</p>
          </div>
          <span className="allok"><i aria-hidden="true" />{statusStrip.allOk}</span>
        </div>

        {services.map((service, serviceIndex) => {
          const up = uptimeFor(service.slowDays)
          return (
            <div className="svc-row" key={service.name}>
              <b>{service.name}</b>
              <span className="bars" role="img" aria-label={barLabel(service.slowDays)}>
                {Array.from({ length: DAYS }, (_, day) => (
                  <i key={day} className={service.slowDays.includes(day) ? 'w' : undefined} />
                ))}
              </span>
              <span className="up">
                <span
                  className="cnt"
                  data-to={up}
                  ref={(el) => { countRefs.current[serviceIndex] = el }}
                >
                  {up}
                </span>%
              </span>
            </div>
          )
        })}

        <div className="legend" aria-hidden="true">
          <span>{DAYS} days ago</span>
          <span>Today</span>
        </div>
      </div>
    </section>
  )
}
