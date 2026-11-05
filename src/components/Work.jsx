import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { CaseVisual, playCaseVisual } from './caseVisuals'
import CaseDialog from './CaseDialog'
import { workIntro, workDeck, cases } from '../content'

const pad2 = (n) => String(n).padStart(2, '0')

/** Resting offset of the card `k` places below the top of the deck. */
const rest = (i, k) => ({
  y: k * 16,
  scale: 1 - k * .045,
  rotate: (i % 2 ? 1 : -1) * k * 1.6,
  opacity: k > 2 ? 0 : 1,
})

export default function Work({ animate }) {
  const sectionRef = useRef(null)
  const visRefs = useRef({})
  const playing = useRef({})
  const deckNum = useRef(null)
  const deckBar = useRef(null)
  const [openId, setOpenId] = useState(null)
  const lastOpener = useRef(null)

  const deck = animate && workDeck.enabled && cases.length > 1

  function play(item) {
    // A screenshot has nothing to animate.
    if (item.shot) return
    const node = visRefs.current[item.id]
    if (!node) return
    playing.current[item.id]?.kill()
    playing.current[item.id] = playCaseVisual(node, item.visual)
  }

  function killAll() {
    Object.values(playing.current).forEach((tl) => tl?.kill())
    playing.current = {}
  }

  // Plain grid: cards fade up, and each diagram plays the first time it is seen.
  useEffect(() => {
    if (!animate || deck) return undefined

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

    cases.forEach((item) => {
      const node = visRefs.current[item.id]
      if (!node) return
      triggers.push(ScrollTrigger.create({
        trigger: node,
        start: 'top 70%',
        once: true,
        onEnter: () => play(item),
      }))
    })

    return () => {
      triggers.forEach((trigger) => trigger.kill())
      killAll()
      ctx.revert()
    }
  }, [animate, deck])

  // Deck: the section pins, and scrolling throws the top card away.
  useEffect(() => {
    if (!deck) return undefined

    const root = document.documentElement
    root.classList.add('has-deck')
    let shown = -1

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.case')
      const n = cards.length

      // `inert` takes the buried cards out of the tab order and out of reach of
      // the pointer, so only the card on top can be opened or focused.
      const face = (card, top) => {
        card.classList.toggle('back', !top)
        if (top) card.removeAttribute('inert')
        else card.setAttribute('inert', '')
      }

      cards.forEach((card, i) => {
        gsap.set(card, { zIndex: n - i, transformOrigin: '50% 100%', ...rest(i, i) })
        face(card, i === 0)
      })

      const setTop = (i) => {
        if (i === shown) return
        shown = i
        cards.forEach((card, k) => face(card, k === i))
        if (deckNum.current) deckNum.current.textContent = pad2(i + 1)
        play(cases[i])
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.work-pin',
          start: 'top top',
          end: () => `+=${(n - 1) * window.innerHeight * workDeck.screensPerCard}`,
          pin: true,
          scrub: .7,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(deckBar.current, { scaleX: .25 + self.progress * .75 })
            setTop(Math.min(n - 1, Math.round(self.progress * (n - 1))))
          },
        },
      })

      for (let i = 0; i < n - 1; i += 1) {
        const dir = i % 2 ? 1 : -1
        tl.to(cards[i], {
          yPercent: -125, xPercent: dir * 35, rotate: dir * 22,
          opacity: 0, duration: 1, ease: 'power2.in',
        }, i)

        for (let k = i + 1; k < n; k += 1) {
          tl.to(cards[k], { duration: .8, ease: 'power2.out', ...rest(k, k - i - 1) }, i + .2)
        }
      }

      // The deck drops onto the table the first time it scrolls into view.
      gsap.from(cards, {
        y: 220,
        rotate: (i) => (i % 2 ? 1 : -1) * 14,
        opacity: 0,
        stagger: .08,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.work-grid', start: 'top 85%' },
        onComplete: () => setTop(0),
      })
    }, sectionRef)

    return () => {
      root.classList.remove('has-deck')
      killAll()
      ctx.revert()
    }
  }, [deck])

  function replay(item) {
    if (!animate) return
    if (playing.current[item.id]?.isActive()) return
    play(item)
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
      <section id="work" className="pad pad-top-0" ref={sectionRef}>
        <div className="work-pin">
          <div className="wrap">
            <div className="work-head">
              <div>
                <h2 className="t">{workIntro.heading}</h2>
                <p className="lede">{workIntro.lede}</p>
              </div>

              <div className="deck-meta" aria-hidden="true">
                <span className="deck-n" ref={deckNum}>01</span>
                <span className="deck-of">/ {pad2(cases.length)}</span>
                <span className="deck-bar"><i ref={deckBar} /></span>
                <span className="deck-hint">{workDeck.hint}</span>
              </div>
            </div>

            <div className="work-grid">
              {cases.map((item) => (
                <article className="case" key={item.id} onMouseEnter={() => replay(item)}>
                  <div className="vis" ref={(el) => { visRefs.current[item.id] = el }}>
                    {item.shot
                      ? <img src={item.shot} alt="" loading="lazy" decoding="async" />
                      : <CaseVisual name={item.visual} />}
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
