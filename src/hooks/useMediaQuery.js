import { useEffect, useState } from 'react'

/** The width below which long lists collapse behind a "Read more". */
export const NARROW = '(max-width: 860px)'

/** Subscribes to a media query and re-renders when it changes. */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (event) => setMatches(event.matches)
    setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}
