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
