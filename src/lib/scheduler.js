import { gsap } from './gsap'

/**
 * A pool of `gsap.delayedCall`s that can all be killed at once.
 *
 * The diagram schedules work that reschedules itself (packet loops, the
 * recurring incident). Without this, an unmounted component would keep firing
 * callbacks into dead DOM — which React's StrictMode double-mount surfaces
 * immediately in development.
 */
export function createScheduler() {
  const calls = new Set()
  let killed = false

  return {
    after(delay, fn) {
      if (killed) return null
      const call = gsap.delayedCall(delay, () => {
        calls.delete(call)
        if (!killed) fn()
      })
      calls.add(call)
      return call
    },
    kill() {
      killed = true
      calls.forEach((call) => call.kill())
      calls.clear()
    },
  }
}
