import { useEffect, useId, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { contact } from '../content'
import { sendTicket, sendMode } from '../lib/sendTicket'

const EMAIL = /^\S+@\S+\.\S+$/

// A new tab for anything that leaves the page — an outside host, or a PDF
// shipped with the site. Not mailto, which would strand an empty tab behind
// the mail client, and not an in-page anchor.
const opensAway = (href) => href.startsWith('http') || href.includes('.pdf')
const TONE_CLASS = { low: 'p-low', mid: 'p-mid', high: 'p-high' }

/**
 * A reference the sender can quote back, not a running count.
 *
 * This used to be a random number between #1040 and #1099, which claimed a
 * thousand previous tickets on a form that had never been submitted, and could
 * hand two people the same number. Date plus a short random suffix is unique
 * and claims nothing.
 */
const newTicketId = () => {
  const now = new Date()
  const stamp = [now.getFullYear() % 100, now.getMonth() + 1, now.getDate()]
    .map((part) => String(part).padStart(2, '0'))
    .join('')
  return `#${stamp}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

const blankForm = () => ({
  name: '',
  email: '',
  topic: contact.topics[0],
  priority: contact.priorities[0].label,
  details: '',
  // Hidden from people, irresistible to bots. Anything in here means spam.
  botcheck: '',
})

/**
 * The contact form, dressed up as a support ticket.
 *
 * With a form relay configured the message is gone by the time the ticket
 * screen appears. Without one it is handed to the visitor's own mail app, and
 * the screen says so rather than claiming an arrival that hasn't happened —
 * every label on it comes from whichever of the two is in play.
 */
export default function Contact({ animate, cvSignal, onCvClick }) {
  const mailMode = sendMode === 'mail'
  const copy = mailMode ? contact.mail : contact
  const steps = mailMode ? [contact.mail.firstStep, ...contact.steps.slice(1)] : contact.steps

  const sectionRef = useRef(null)
  const doneRef = useRef(null)
  const stepRefs = useRef([])
  const uid = useId()

  const [form, setForm] = useState(blankForm)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
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

  async function submit(event) {
    event.preventDefault()
    if (sending) return

    const name = form.name.trim()
    const email = form.email.trim()
    const details = form.details.trim()

    if (!name) return setError(contact.errors.name)
    if (!EMAIL.test(email)) return setError(contact.errors.email)
    if (!details) return setError(contact.errors.details)

    // A bot filled a field no person can see. Say nothing, send nothing.
    if (form.botcheck) return

    setError('')
    const reference = newTicketId()

    setSending(true)
    let mode
    try {
      mode = await sendTicket({ reference, name, email, topic: form.topic, priority: form.priority, details })
    } catch (cause) {
      // The ticket screen speaks for the message, so it only appears once the
      // message has actually gone. A failure says so and gives the address.
      console.error('Ticket send failed:', cause)
      return setError(contact.errors.send)
    } finally {
      setSending(false)
    }

    setStepsDone(0)
    setTicket({
      id: reference,
      note: (mode === 'mail' ? contact.mail.note : contact.sentNote)
        .replace('{first}', name.split(' ')[0])
        .replace('{topic}', form.topic.toLowerCase())
        .replace('{priority}', form.priority.toLowerCase())
        .replace('{email}', email)
        .replace('{reference}', reference),
    })
  }

  function reset() {
    setTicket(null)
    setStepsDone(0)
    setError('')
    setForm(blankForm())
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
                {...(opensAway(link.href)
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

                {/* Hidden from people and from screen readers; bots fill it in. */}
                <input
                  className="botcheck"
                  type="text"
                  name="botcheck"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={form.botcheck}
                  onChange={set('botcheck')}
                />

                <p className="terr" role="alert">{error}</p>
                <button className="btn" type="submit" disabled={sending}>
                  {sending ? copy.sendingLabel : copy.submitLabel}
                </button>
              </form>
            ) : (
              <div className="tdone" role="status" tabIndex={-1} ref={doneRef}>
                <span className="tid">Ticket {ticket.id}</span>
                <h3>{copy.openedHeading}</h3>

                <ol className="steps">
                  {steps.map((step, i) => (
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
