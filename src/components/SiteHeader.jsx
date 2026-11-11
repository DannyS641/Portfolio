import { useEffect, useState } from 'react'
import SmoothLink from './SmoothLink'
import { person, navLinks, contact } from '../content'

export default function SiteHeader({ onCvClick }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  // Light up the nav link for whichever section is crossing the middle of the screen.
  useEffect(() => {
    const sections = document.querySelectorAll('main section[id]')
    if (!sections.length) return undefined

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )

    sections.forEach((section) => io.observe(section))
    return () => io.disconnect()
  }, [])

  const close = () => setOpen(false)

  // With a CV to link to the button is just a link. Without one it stays on
  // the page and asks the contact form to explain itself.
  const cvProps = contact.cvHref
    ? { href: contact.cvHref, target: '_blank', rel: 'noopener noreferrer', onClick: close }
    : {
        href: '#contact',
        onClick: (event) => { event.preventDefault(); close(); onCvClick() },
      }

  return (
    <header className="site">
      <div className="wrap">
        <SmoothLink className="logo" href="#top" onNavigate={close}>
          <span className="st" aria-hidden="true" />
          {person.name}
        </SmoothLink>

        <button
          className="menu-btn"
          type="button"
          aria-expanded={open}
          aria-controls="nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>

        <nav className={`links${open ? ' open' : ''}`} id="nav" aria-label="Sections">
          {navLinks.map((link) => (
            <SmoothLink
              key={link.href}
              href={link.href}
              className={active === link.href ? 'on' : undefined}
              onNavigate={close}
            >
              {link.label}
            </SmoothLink>
          ))}
          <a className="btn" {...cvProps}>{contact.cvLabel}</a>
        </nav>
      </div>
    </header>
  )
}
