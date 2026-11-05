import { useEffect, useId, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { contact } from '../content'

const EMAIL = /^\S+@\S+\.\S+$/
const TONE_CLASS = { low: 'p-low', mid: 'p-mid', high: 'p-high' }

const newTicketId = () => `#${1040 + Math.floor(Math.random() * 60)}`

/** The contact form, dressed up as a support ticket. Front end only — nothing is sent. */
export default function Contact({ animate, cvSignal, onCvClick }) {
  const sectionRef = useRef(null)
  const doneRef = useRef(null)
  const stepRefs = useRef([])
  const uid = useId()

  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: contact.topics[0],
    priority: contact.priorities[0].label,
    details: '',
  })
  const [error, setError] = useState('')
  const [ticket, setTicket] = useState(null)
  const [stepsDone, setStepsDone] = useState(0)

  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))

  // A CV click from here or from the header shows its note in the message slot.
  // `cvSignal` is a counter, so clicking twice re-announces it.
  useEffect(() => {
    if (cvSignal) setError(contact.cvMessage)
  }, [cvSignal])

  useEffect(() => {
    if (!animate) return undefined
    const ctx = gsap.context(() => {
      gsap.from('.reach a', {
        x: -40, opacity: 0, stagger: .08, duration: .6,
        scrollTrigger: { trigger: '.reach', start: 'top 85%' },
      })
      gsap.fromTo('.tform',
        { clipPath: 'inset(0 0 100% 0 round 20px)' },
        {
          clipPath: 'inset(0 0 0% 0 round 20px)',
          duration: 1,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: '.tform', start: 'top 85%' },
        })
    }, sectionRef)
    return () => ctx.revert()
  }, [animate])

  // Tick the first step shortly after the ticket opens.
  useEffect(() => {
    if (!ticket) return undefined
    doneRef.current?.focus()

    if (!animate) {
      setStepsDone(1)
      return undefined
    }

    const intro = gsap.from(doneRef.current.children, { y: 20, opacity: 0, stagger: .07, duration: .45 })
    const tick = gsap.delayedCall(.5, () => {
      setStepsDone(1)
      gsap.fromTo(stepRefs.current[0], { scale: .4 }, { scale: 1, duration: .4, ease: 'back.out(3)' })
    })

    return () => { intro.kill(); tick.kill() }
  }, [ticket, animate])

  function submit(event) {
    event.preventDefault()
    const name = form.name.trim()

    if (!name) return setError(contact.errors.name)
    if (!EMAIL.test(form.email.trim())) return setError(contact.errors.email)
    if (!form.details.trim()) return setError(contact.errors.details)

    setError('')
    setStepsDone(0)
    setTicket({
      id: newTicketId(),
      note: `Thanks, ${name.split(' ')[0]}. Topic: ${form.topic.toLowerCase()}. `
        + `Priority: ${form.priority.toLowerCase()}. `
        + `In the real site, a copy goes to ${form.email.trim()}.`,
    })
  }

  function reset() {
    setTicket(null)
    setStepsDone(0)
    setForm({
      name: '',
      email: '',
      topic: contact.topics[0],
      priority: contact.priorities[0].label,
      details: '',
    })
  }

  return (
    <section className="pad pad-top-0" id="contact" ref={sectionRef}>
      <div className="wrap">
        <h2 className="t">{contact.heading}</h2>
        <p className="lede">{contact.lede}</p>

        <div className="ticket">
          <div className="reach">
            {contact.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={link.cv ? (event) => { event.preventDefault(); onCvClick() } : undefined}
                {...(link.href.startsWith('http')
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {link.label}<small>{link.detail}</small>
              </a>
            ))}
          </div>

          <div className="tform">
            {!ticket ? (
              <form onSubmit={submit} noValidate>
                <div className="grid2">
                  <div>
                    <label className="l" htmlFor={`${uid}-name`}>Your name</label>
                    <input id={`${uid}-name`} autoComplete="name" value={form.name} onChange={set('name')} />
                  </div>

                  <div>
                    <label className="l" htmlFor={`${uid}-mail`}>Email</label>
                    <input id={`${uid}-mail`} type="email" autoComplete="email" value={form.email} onChange={set('email')} />
                  </div>

                  <fieldset className="full">
                    <legend>What’s this about?</legend>
                    <div className="chipset">
                      {contact.topics.map((topic) => (
                        <label key={topic}>
                          <input
                            type="radio"
                            name={`${uid}-topic`}
                            value={topic}
                            checked={form.topic === topic}
                            onChange={set('topic')}
                          />
                          <span>{topic}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="full">
                    <legend>How soon?</legend>
                    <div className="chipset">
                      {contact.priorities.map((priority) => (
                        <label key={priority.label}>
                          <input
                            type="radio"
                            name={`${uid}-pri`}
                            value={priority.label}
                            checked={form.priority === priority.label}
                            onChange={set('priority')}
                          />
                          <span className={TONE_CLASS[priority.tone]}><i />{priority.label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="full">
                    <label className="l" htmlFor={`${uid}-msg`}>Details</label>
                    <textarea
                      id={`${uid}-msg`}
                      placeholder="What do you need, and when?"
                      value={form.details}
                      onChange={set('details')}
                    />
                  </div>
                </div>

                <p className="terr" role="alert">{error}</p>
                <button className="btn" type="submit">Open ticket</button>
              </form>
            ) : (
              <div className="tdone" role="status" tabIndex={-1} ref={doneRef}>
                <span className="tid">Ticket {ticket.id}</span>
                <h3>Ticket opened</h3>

                <ol className="steps">
                  {contact.steps.map((step, i) => (
                    <li key={step.title} className={i < stepsDone ? 'ok' : undefined}>
                      <i aria-hidden="true" ref={(el) => { stepRefs.current[i] = el }}>
                        {i < stepsDone ? '✓' : ''}
                      </i>
                      <span>{step.title}<small>{step.note}</small></span>
                    </li>
                  ))}
                </ol>

                <p className="tmsg">{ticket.note}</p>
                <button className="btn ghost" type="button" onClick={reset}>Open another ticket</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
