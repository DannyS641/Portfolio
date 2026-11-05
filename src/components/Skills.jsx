import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap, Flip } from '../lib/gsap'
import { useMediaQuery, NARROW } from '../hooks/useMediaQuery'
import { useClamp } from '../hooks/useClamp'
import MoreButton from './MoreButton'
import { skillsIntro, skillGroups, skills, skillsByCase, cases } from '../content'

const GROUP_COLORS = {
  build: 'var(--signal)',
  run: 'var(--ok)',
  data: 'var(--warn)',
  work: 'var(--bad)',
}

/**
 * Picking a project dims every skill it didn't use and floats the rest to the
 * front. React does the reordering; GSAP's Flip plugin animates the difference
 * between the old and new layout.
 */
export default function Skills({ animate }) {
  const sectionRef = useRef(null)
  const flipState = useRef(null)
  const compact = useMediaQuery(NARROW)
  const { ref: cloudRef, open, toggle, clamped, showToggle } = useClamp(compact)

  const [selected, setSelected] = useState('all')
  const used = selected === 'all' ? null : skillsByCase[selected]

  const ordered = useMemo(() => {
    if (!used) return skills
    // stable sort, so lit skills keep their relative order at the front
    return [...skills].sort((a, b) => (used.includes(b.name) ? 1 : 0) - (used.includes(a.name) ? 1 : 0))
  }, [used])

  function pick(id) {
    if (id === selected) return
    if (animate && cloudRef.current) {
      flipState.current = Flip.getState(cloudRef.current.children)
    }
    setSelected(id)
  }

  useLayoutEffect(() => {
    const state = flipState.current
    if (!state) return
    flipState.current = null

    Flip.from(state, { duration: .6, ease: 'power3.inOut', stagger: .01 })
    gsap.fromTo(cloudRef.current.querySelectorAll('.lit'),
      { scale: .85 },
      { scale: 1, duration: .5, ease: 'back.out(3)', stagger: .03, delay: .3 })
  }, [selected])

  useEffect(() => {
    if (!animate) return undefined
    const ctx = gsap.context(() => {
      gsap.from('.skill', {
        y: 30,
        opacity: 0,
        scale: .8,
        stagger: { each: .025, from: 'random' },
        duration: .5,
        ease: 'back.out(2)',
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: '.skills', start: 'top 85%' },
      })
      gsap.from('.proj-pick button', {
        x: -30,
        opacity: 0,
        stagger: .07,
        duration: .5,
        scrollTrigger: { trigger: '.proj-pick', start: 'top 85%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [animate])

  return (
    <section className="pad pad-top-0" id="skills" ref={sectionRef}>
      <div className="wrap">
        <h2 className="t">{skillsIntro.heading}</h2>
        <p className="lede">{skillsIntro.lede}</p>

        <div className="sk-grid">
          <div className="proj-pick">
            <button type="button" aria-pressed={selected === 'all'} onClick={() => pick('all')}>
              All skills<small>{skills.length}</small>
            </button>
            {cases.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected === item.id}
                onClick={() => pick(item.id)}
              >
                {item.title}
                <small>{skillsByCase[item.id].length} skills</small>
              </button>
            ))}
          </div>

          <div>
            <div
              id="skillcloud"
              className={`skills${used ? ' filtering' : ''}${clamped ? ' clamped' : ''}`}
              ref={cloudRef}
            >
              {ordered.map((skill) => (
                <span
                  className={`skill${used?.includes(skill.name) ? ' lit' : ''}`}
                  key={skill.name}
                  data-g={skill.group}
                >
                  <i aria-hidden="true" />
                  {skill.name}
                </span>
              ))}
            </div>

            {showToggle && (
              <MoreButton
                open={open}
                onToggle={toggle}
                controls="skillcloud"
                more={skillsIntro.more}
                less={skillsIntro.less}
              />
            )}

            <div className="sk-key" aria-hidden="true">
              {skillGroups.map((group) => (
                <span key={group.id}>
                  <i style={{ background: GROUP_COLORS[group.id] }} />
                  {group.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
