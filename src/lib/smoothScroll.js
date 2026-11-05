/**
 * Lenis lives outside the React tree: the header, hero buttons and footer all
 * need to scroll the page, and passing one instance down to each of them would
 * be more plumbing than it's worth.
 */

let lenis = null

export function setLenis(instance) {
  lenis = instance
}

/**
 * Freeze the page behind a modal.
 *
 * Lenis listens for wheel events on the window and preventDefault()s them, so
 * without this a wheel over an open dialog scrolls the page underneath while
 * the dialog itself stays put. Stopping Lenis for as long as the dialog is open
 * is the other half of the fix; `data-lenis-prevent` on the scrolling element
 * is what lets the dialog scroll itself.
 */
export function lockScroll(locked) {
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
    return
  }
  // No Lenis running (reduced motion): lock the page directly instead. The
  // native scrollbar is already hidden, so nothing shifts.
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

/**
 * Scroll to a selector. Falls back to native scrolling when Lenis isn't running
 * (reduced motion, or before the hook has mounted).
 */
export function scrollToSection(selector, { reduced = false } = {}) {
  const el = document.querySelector(selector)
  if (!el) return
  if (lenis) {
    lenis.scrollTo(el, { offset: selector === '#top' ? 0 : -70 })
  } else {
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }
}
