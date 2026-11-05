import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

/** The thin line across the top that tracks how far down the page you are. */
export default function ProgressBar({ animate }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!animate) return undefined
    const tween = gsap.to(ref.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: .2 },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [animate])

  return <div className="progress" ref={ref} aria-hidden="true" />
}
