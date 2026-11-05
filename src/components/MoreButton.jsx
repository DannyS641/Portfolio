/** Shared "Read more / Show less" toggle for collapsed blocks. */
export default function MoreButton({ open, onToggle, controls, more, less }) {
  return (
    <button
      type="button"
      className="more"
      aria-expanded={open}
      aria-controls={controls}
      onClick={onToggle}
    >
      {open ? less : more}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  )
}
