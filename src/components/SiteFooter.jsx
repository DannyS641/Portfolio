import SmoothLink from './SmoothLink'
import { person } from '../content'

export default function SiteFooter() {
  return (
    <footer>
      <div className="wrap">
        <span>
          © {person.name} {person.year}.{person.footerNote ? ` ${person.footerNote}` : ''}
        </span>
        <span><SmoothLink href="#top">Back to top</SmoothLink></span>
      </div>
    </footer>
  )
}
