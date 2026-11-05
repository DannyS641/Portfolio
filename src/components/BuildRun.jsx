import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { buildRunIntro, buildRun } from '../content'

const TABS = ['build', 'run']

/**
 * Two tabs, one panel. The outgoing content animates away first, then React
 * swaps it, then the incoming content animates in from a layout effect — so the
 * DOM is always the source of truth and GSAP never fights a re-render.
 */
export default function BuildRun({ animate }) {
  const [tab, setTab] = useState('build')
  const [busy, setBusy] = useState(false)

  const sectionRef = useRef(null)
  const thumbRef = useRef(null)
  const tabRefs = useRef({})
  const headingRef = useRef(null)
  const bodyRef = useRef(null)
  const listRef = useRef(null)
  const firstRender = useRef(true)

  const panel = buildRun[tab]

  // Slide the pill under the selected tab, and keep it there on resize.
  useLayoutEffect(() => {
    function moveThumb(withMotion) {
      const button = tabRefs.current[tab]
      const thumb = thumbRef.current
      if (!button || !thumb) return
      const r = button.getBoundingClientRect()
      const parent = button.parentNode.getBoundingClientRect()
      const x = r.left - parent.left - 5
      if (animate && withMotion) {
        gsap.to(thumb, { x, width: r.width, duration: .45, ease: 'power3.inOut' })
      } else {
        thumb.style.width = `${r.width}px`
        thumb.style.transform = `translateX(${x}px)`
      }
    }

    moveThumb(!firstRender.current)

    const onResize = () => moveThumb(false)
    window.addEventListener('resize', onResize)
    // condensed webfont changes the button widths once it lands
    document.fonts?.ready.then(() => moveThumb(false))
    return () => window.removeEventListener('resize', onResize)
  }, [tab, animate])

  // Animate the new panel in (skipped on first paint — the scroll trigger below owns that).
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (!animate) return

    gsap.fromTo([headingRef.current, bodyRef.current],
      { yPercent: 30, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: .4, stagger: .06, ease: 'power3.out' })
    gsap.from(listRef.current.children, { x: 40, opacity: 0, duration: .45, stagger: .07, ease: 'power3.out' })
    gsap.from(listRef.current.querySelectorAll('svg'), {
      rotate: -30, scale: .6, duration: .6, stagger: .07, ease: 'back.out(2)',
    })
    setBusy(false)
  }, [tab, animate])

  // First reveal on scroll.
  useEffect(() => {
    if (!animate) return undefined
    const ctx = gsap.context(() => {
      gsap.from('.br-switch', {
        y: 20, opacity: 0, duration: .5,
        scrollTrigger: { trigger: '.br-switch', start: 'top 90%' },
      })
      gsap.from('.br-list li', {
        x: 40, opacity: 0, stagger: .08, duration: .6, ease: 'power3.out',
        scrollTrigger: { trigger: '.br-list', start: 'top 85%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [animate])

  function select(next) {
    if (next === tab || busy) return
    if (!animate) {
      setTab(next)
      return
    }
    setBusy(true)
    gsap.timeline({ onComplete: () => setTab(next) })
      .to([headingRef.current, bodyRef.current], { yPercent: -30, opacity: 0, duration: .2, stagger: .04 })
      .to(listRef.current.children, { x: -30, opacity: 0, duration: .2, stagger: .03 }, 0)
  }

  function onKeyDown(event) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const next = TABS[(TABS.indexOf(tab) + 1) % TABS.length]
    select(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section className="pad" id="what" ref={sectionRef}>
      <div className="wrap">
        <h2 className="t">{buildRunIntro.heading}</h2>
        <p className="lede">{buildRunIntro.lede}</p>

        <div className="br-switch" role="tablist" aria-label="What I do" onKeyDown={onKeyDown}>
          <span className="thumb" ref={thumbRef} aria-hidden="true" />
          {TABS.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tb-${id}`}
              aria-selected={tab === id}
              aria-controls="br-panel"
              tabIndex={tab === id ? 0 : -1}
              ref={(el) => { tabRefs.current[id] = el }}
              onClick={() => select(id)}
            >
              {buildRun[id].tab}
            </button>
          ))}
        </div>

        <div className="br-panel" id="br-panel" role="tabpanel" aria-labelledby={`tb-${tab}`}>
          <div>
            <h3 ref={headingRef}>{panel.heading}</h3>
            <p ref={bodyRef}>{panel.body}</p>
          </div>

          <ul className="br-list" ref={listRef}>
            {panel.items.map((item) => (
              <li key={item.title}>
                <svg
                  viewBox="0 0 44 44"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: item.icon }}
                />
                <span>
                  <b>{item.title}</b>
                  <span>{item.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
