import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { CaseVisual, playCaseVisual } from './caseVisuals'
import CaseDialog from './CaseDialog'
import { workIntro, cases } from '../content'

export default function Work({ animate }) {
  const sectionRef = useRef(null)
  const visRefs = useRef({})
  const playing = useRef({})
  const [openId, setOpenId] = useState(null)
  const lastOpener = useRef(null)

  useEffect(() => {
    if (!animate) return undefined

    const triggers = []
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.case').forEach((card, i) => {
        gsap.from(card, {
          y: 70,
          opacity: 0,
          duration: .8,
          ease: 'power3.out',
          delay: (i % 2) * .12,
          scrollTrigger: { trigger: card, start: 'top 88%' },
        })
      })
    }, sectionRef)

    // Play each card's diagram the first time it scrolls into view.
    cases.forEach((item) => {
      const node = visRefs.current[item.id]
      if (!node) return
      triggers.push(ScrollTrigger.create({
        trigger: node,
        start: 'top 70%',
        once: true,
        onEnter: () => { playing.current[item.id] = playCaseVisual(node, item.visual) },
      }))
    })

    return () => {
      triggers.forEach((trigger) => trigger.kill())
      Object.values(playing.current).forEach((tl) => tl?.kill())
      playing.current = {}
      ctx.revert()
    }
  }, [animate])

  function replay(item) {
    if (!animate) return
    const current = playing.current[item.id]
    if (current && current.isActive()) return
    playing.current[item.id] = playCaseVisual(visRefs.current[item.id], item.visual)
  }

  function open(item, event) {
    lastOpener.current = event.currentTarget
    setOpenId(item.id)
  }

  function close() {
    setOpenId(null)
    lastOpener.current?.focus()
  }

  return (
    <>
      <section className="pad pad-top-0" id="work" ref={sectionRef}>
        <div className="wrap">
          <h2 className="t">{workIntro.heading}</h2>
          <p className="lede">{workIntro.lede}</p>

          <div className="work-grid">
            {cases.map((item) => (
              <article className="case" key={item.id} onMouseEnter={() => replay(item)}>
                <div className="vis" ref={(el) => { visRefs.current[item.id] = el }}>
                  <CaseVisual name={item.visual} />
                </div>
                <div className="tx">
                  <span className="kind">{item.kind}</span>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <span className="res">
                    {item.results.map((result) => <span key={result}>{result}</span>)}
                  </span>
                  <button
                    type="button"
                    className="open"
                    onClick={(event) => open(item, event)}
                  >
                    Read the project<span className="sr"> — {item.title}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CaseDialog
        item={cases.find((c) => c.id === openId) ?? null}
        animate={animate}
        onClose={close}
      />
    </>
  )
}
