import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Collapses a block to a fixed height and reports whether there is anything
 * hidden, so the toggle only appears when it would actually do something.
 *
 * The content stays in the DOM either way — it is clipped with CSS, not sliced
 * out — so screen readers and search engines still get all of it, and GSAP Flip
 * in the skill cloud keeps seeing a stable set of elements.
 *
 * @param enabled false on wide screens, where nothing is collapsed at all
 */
export function useClamp(enabled) {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [overflowing, setOverflowing] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) {
      setOverflowing(false)
      return undefined
    }
    // Only meaningful while clamped: once open, scrollHeight === clientHeight.
    if (open) return undefined

    const measure = () => setOverflowing(el.scrollHeight - el.clientHeight > 4)
    measure()

    // The webfont lands after first paint and changes how the text wraps.
    document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [enabled, open])

  const toggle = useCallback(() => setOpen((v) => !v), [])

  // Collapse again if the viewport grows past the breakpoint and back.
  useEffect(() => {
    if (!enabled) setOpen(false)
  }, [enabled])

  return {
    ref,
    open,
    toggle,
    clamped: enabled && !open,
    showToggle: enabled && (overflowing || open),
  }
}
