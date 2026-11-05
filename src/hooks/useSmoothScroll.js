import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { setLenis } from '../lib/smoothScroll'

/**
 * Drives Lenis from GSAP's ticker so smooth scrolling and ScrollTrigger stay in
 * step — two independent rAF loops would otherwise fight each other.
 */
export function useSmoothScroll(enabled) {
  useEffect(() => {
    if (!enabled) return undefined

    const lenis = new Lenis({ lerp: .09 })
    setLenis(lenis)

    const update = () => ScrollTrigger.update()
    lenis.on('scroll', update)

    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.off('scroll', update)
      lenis.destroy()
      setLenis(null)
    }
  }, [enabled])
}
