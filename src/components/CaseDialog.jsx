import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { lockScroll } from '../lib/smoothScroll'
import { CaseVisual, playCaseVisual } from './caseVisuals'

/** Native <dialog>, so Escape, focus trapping and the backdrop come for free. */
export default function CaseDialog({ item, animate, onClose }) {
  const dialogRef = useRef(null)
  const visRef = useRef(null)
  const bodyRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return undefined

    if (!item) {
      if (dialog.open) dialog.close()
      return undefined
    }

    dialog.showModal()
    lockScroll(true)
    if (!animate) return () => lockScroll(false)

    const tl = gsap.timeline()
      .fromTo(bodyRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: .45, ease: 'power3.out' }, .1)
      .fromTo(visRef.current,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: .55, ease: 'power3.inOut' }, 0)
      .from('.cd-cols > div', { y: 20, opacity: 0, stagger: .08, duration: .4 }, .3)

    const visual = item.shot
      ? null
      : gsap.delayedCall(.4, () => playCaseVisual(visRef.current, item.visual))

    return () => {
      lockScroll(false)
      tl.kill()
      visual?.kill()
    }
  }, [item, animate])

  return (
    <dialog
      className="case-dlg"
      ref={dialogRef}
      aria-labelledby="cd-h"
      onClose={onClose}
      onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close() }}
    >
      {item && (
        <>
          <button
            className="x"
            type="button"
            aria-label="Close project"
            onClick={() => dialogRef.current.close()}
          >
            ×
          </button>

          <div className="cd-vis" ref={visRef}>
            {item.shot
              ? <img src={item.shot} alt="" decoding="async" />
              : <CaseVisual name={item.visual} />}
          </div>
          {/* data-lenis-prevent: let this element keep its own wheel events */}
          <div className="cd-body" ref={bodyRef} data-lenis-prevent>
            <span className="cd-kind">{item.kind}</span>

            <h3 id="cd-h">{item.title}</h3>

            <div className="cd-cols">
              <div><h4>The problem</h4><p>{item.problem}</p></div>
              <div><h4>What I did</h4><p>{item.did}</p></div>
              <div><h4>The result</h4><p>{item.result}</p></div>
            </div>

            <p className="cd-tools">Tools: {item.tools}</p>

            {item.link && (
              <a className="cd-live" href={item.link} target="_blank" rel="noreferrer">
                Visit the live site
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
                <span className="sr"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </>
      )}
    </dialog>
  )
}
