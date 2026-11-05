import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { bootLines } from '../content'

/**
 * Types out a fake service start-up, then switches off like an old CRT.
 *
 * `onReveal` fires as the screen collapses (so the hero can begin underneath)
 * and `onDone` once the whole thing is finished and safe to unmount.
 */
export default function BootScreen({ onReveal, onDone }) {
  const rootRef = useRef(null)
  const logRef = useRef(null)
  const lineRef = useRef(null)
  const skipRef = useRef(null)
  const finishRef = useRef(() => {})

  useEffect(() => {
    const root = rootRef.current
    const log = logRef.current
    let done = false
    let exit = null

    function finish() {
      if (done) return
      done = true
      try { sessionStorage.setItem('nifemi-boot', '1') } catch { /* private mode */ }

      exit = gsap.timeline({
        onComplete: () => {
          document.documentElement.classList.remove('booting')
          ScrollTrigger.refresh()
          onDone()
        },
      })
        .to([log, skipRef.current], { opacity: 0, duration: .15 })
        .to(root, { scaleY: .006, duration: .28, ease: 'power4.in' })
        .set(lineRef.current, { opacity: 1 })
        .to(root, { scaleX: 0, duration: .3, ease: 'power4.in' })
        .add(onReveal, '-=.1')
        .to(root, { opacity: 0, duration: .15 })
    }

    finishRef.current = finish

    const typing = gsap.timeline({ onComplete: () => gsap.delayedCall(.35, finish) })
    let html = ''

    bootLines.forEach(([text, result]) => {
      const counter = { n: 0 }
      typing.to(counter, {
        n: text.length,
        duration: Math.min(.5, text.length * .018),
        ease: 'none',
        onUpdate() {
          log.innerHTML = `${html}${text.slice(0, Math.round(counter.n))}<span class="cur"></span>`
        },
        onComplete() {
          html += text + (result ? `<span class="ok">${result}</span>` : '') + '\n'
          log.innerHTML = `${html}<span class="cur"></span>`
        },
      })
      if (result) typing.to({}, { duration: .12 })
    })

    return () => {
      typing.kill()
      exit?.kill()
      document.documentElement.classList.remove('booting')
    }
  }, [onReveal, onDone])

  return (
    <div className="boot" ref={rootRef}>
      {/* decorative: the hero heading below carries the real content */}
      <pre ref={logRef} aria-hidden="true" />
      <span className="line" ref={lineRef} />
      <button
        className="skip"
        type="button"
        ref={skipRef}
        onClick={() => finishRef.current()}
      >
        Skip intro
      </button>
    </div>
  )
}
