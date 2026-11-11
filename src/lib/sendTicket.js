import { contact } from '../content'

/**
 * Sending for the contact form.
 *
 * There is no server and no database here: the destination is an inbox, which
 * already stores and searches better than anything worth building. The message
 * gets there one of two ways.
 *
 * A relay, when VITE_FORM_ENDPOINT (or VITE_W3F_KEY) is set. The form POSTs
 * JSON and the message has left before the ticket screen appears. The payload
 * below carries each provider's spelling of the same few fields, so the
 * endpoint URL is the only thing that changes between Web3Forms, Formspree and
 * FormSubmit — see .env.example.
 *
 * Otherwise the visitor's own mail app, opened with the message already
 * written. It costs nothing, needs no account and works the day you deploy,
 * but it asks one thing of the sender: press send. So the ticket screen says
 * that instead of claiming the message has arrived.
 *
 * Any key here is visible in the built bundle. That is fine — a form key is a
 * delivery address, not a credential. It can only post to the one mailbox it
 * belongs to, and every provider lets you lock it to a domain and rotate it.
 */

const KEY = import.meta.env.VITE_FORM_KEY || import.meta.env.VITE_W3F_KEY || ''

// A bare key with no endpoint means Web3Forms, which is what .env.example
// talks you through first.
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT
  || (KEY ? 'https://api.web3forms.com/submit' : '')

/** 'relay' once a provider is configured, 'mail' until then. */
export const sendMode = ENDPOINT ? 'relay' : 'mail'

const subjectFor = (t) => `Portfolio ticket ${t.reference} — ${t.topic}`

/** The ticket as plain lines, which is how it reads in a mail client. */
const lines = (t) => [
  `Reference: ${t.reference}`,
  `Name: ${t.name}`,
  `Email: ${t.email}`,
  `Topic: ${t.topic}`,
  `Priority: ${t.priority}`,
  '',
  t.details,
]

async function relay(ticket) {
  const subject = subjectFor(ticket)

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      ...(KEY && { access_key: KEY }),
      // the same two things under each provider's spelling
      subject,
      _subject: subject,
      replyto: ticket.email,
      _replyto: ticket.email,
      from_name: 'Portfolio contact form',
      // everything below becomes a labelled row in the email
      Reference: ticket.reference,
      Name: ticket.name,
      Email: ticket.email,
      Topic: ticket.topic,
      Priority: ticket.priority,
      Details: ticket.details,
    }),
  })

  const result = await response.json().catch(() => ({}))
  // Web3Forms sends {success: true}, Formspree {ok: true}, FormSubmit the
  // string "true". Only an explicit false is a failure a 200 can hide.
  if (!response.ok || result.success === false) {
    throw new Error(result.message || `The form service refused the message (${response.status})`)
  }
  return result
}

// Outlook on Windows has historically cut mailto links off around 2083
// characters, and it does it silently. Better to cut it ourselves, somewhere
// the sender can see it happen and do something about it.
const MAX_URL = 1900
const CUT = '\n\n[…cut here to fit the email link — paste the rest below]'

function draft(ticket) {
  const href = (details) => {
    const body = lines({ ...ticket, details }).join('\n')
    return `mailto:${contact.inbox}`
      + `?subject=${encodeURIComponent(subjectFor(ticket))}`
      + `&body=${encodeURIComponent(body)}`
  }

  let url = href(ticket.details)
  if (url.length > MAX_URL) {
    // Percent-encoding costs anywhere from one byte a character to nine, so
    // how much of the message fits can't be calculated, only searched for.
    // Binary search for the longest prefix that still makes the limit.
    let lo = 0
    let hi = ticket.details.length
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2)
      if (href(ticket.details.slice(0, mid) + CUT).length <= MAX_URL) lo = mid
      else hi = mid - 1
    }
    url = href(ticket.details.slice(0, lo) + CUT)
  }

  // An anchor rather than `location.href =`: handing off to an external
  // protocol is the browser's job, and this way the page is never left in a
  // half-navigated state when no mail app answers.
  const link = document.createElement('a')
  link.href = url
  link.rel = 'noopener'
  link.style.display = 'none'
  document.body.append(link)
  link.click()
  link.remove()
}

/**
 * Hands the ticket off and resolves with the mode that handled it, so the
 * ticket screen can word itself honestly.
 */
export async function sendTicket(ticket) {
  if (sendMode === 'relay') {
    await relay(ticket)
    return 'relay'
  }
  draft(ticket)
  return 'mail'
}
