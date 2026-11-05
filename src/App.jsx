import { useCallback, useState } from 'react'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { scrollToSection } from './lib/smoothScroll'

import BootScreen from './components/BootScreen'
import ProgressBar from './components/ProgressBar'
import SiteHeader from './components/SiteHeader'
import ParticleHero from './components/ParticleHero'
import SystemDiagram from './components/SystemDiagram'
import StatusStrip from './components/StatusStrip'
import BuildRun from './components/BuildRun'
import Work from './components/Work'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Contact from './components/Contact'
import SiteFooter from './components/SiteFooter'

export default function App() {
  const reduced = useReducedMotion()
  const animate = !reduced

  // Decided by the inline script in index.html, before first paint.
  const [booting, setBooting] = useState(() => animate && window.__shouldBoot === true)
  const [heroReady, setHeroReady] = useState(() => !(animate && window.__shouldBoot === true))
  const [cvSignal, setCvSignal] = useState(0)

  useSmoothScroll(animate)

  // Stable identities: BootScreen keeps these in an effect dependency list.
  const revealHero = useCallback(() => setHeroReady(true), [])
  const finishBoot = useCallback(() => setBooting(false), [])

  const handleCvClick = useCallback(() => {
    scrollToSection('#contact', { reduced })
    setCvSignal((n) => n + 1)
  }, [reduced])

  return (
    <>
      {booting && <BootScreen onReveal={revealHero} onDone={finishBoot} />}

      <ProgressBar animate={animate} />
      <SiteHeader onCvClick={handleCvClick} />

      <main>
        <ParticleHero animate={animate} ready={heroReady} />
        <SystemDiagram animate={animate} />
        <StatusStrip animate={animate} />
        <BuildRun animate={animate} />
        <Work animate={animate} />
        <Skills animate={animate} />
        <Experience animate={animate} />
        <Contact animate={animate} cvSignal={cvSignal} onCvClick={handleCvClick} />
      </main>

      <SiteFooter />
    </>
  )
}
