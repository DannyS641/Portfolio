import { scrollToSection } from '../lib/smoothScroll'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * An in-page anchor that scrolls through Lenis instead of jumping.
 * Keeps a real href so it still works as a link (middle-click, copy, no JS).
 */
export default function SmoothLink({ href, children, onNavigate, ...rest }) {
  const reduced = useReducedMotion()

  function handleClick(event) {
    if (!href || !href.startsWith('#') || href.length < 2) return
    event.preventDefault()
    scrollToSection(href, { reduced })
    onNavigate?.(href)
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
