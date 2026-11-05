/**
 * Sending for the contact form.
 *
 * Web3Forms relays the message straight to the inbox the access key was issued
 * to, so there is no server and no database here: the destination is an inbox,
 * which already stores and searches better than anything worth building.
 *
 * The key is visible in the built bundle. That is by design — a Web3Forms key
 * is a delivery address, not a credential. It can only post a message to the
 * one mailbox it belongs to, and you can lock it to a domain and rotate it from
 * their dashboard.
 */

const ENDPOINT = 'https://api.web3forms.com/submit'
const KEY = import.meta.env.VITE_W3F_KEY

/** False in a checkout with no .env.local, so the UI can say so honestly. */
export const canSend = Boolean(KEY)

export async function sendTicket({ reference, name, email, topic, priority, details }) {
  if (!KEY) {
    throw new Error('VITE_W3F_KEY is not set — copy .env.example to .env.local and add your key')
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: KEY,
      subject: `Portfolio ticket ${reference} — ${topic}`,
      from_name: 'Portfolio contact form',
      // so hitting reply in your mail client goes back to the sender
      replyto: email,
      // everything below is rendered as a labelled row in the email
      Reference: reference,
      Name: name,
      Email: email,
      Topic: topic,
      Priority: priority,
      Details: details,
    }),
  })

  const result = await response.json().catch(() => ({}))
  if (!response.ok || !result.success) {
    throw new Error(result.message || `Web3Forms refused the message (${response.status})`)
  }
  return result
}
