import React from 'react'

type MoodFilterTagProps = {
  label: string
  isActive: boolean
  onClick: () => void
  showClose?: boolean
}

export default function MoodFilterTag({
  label,
  isActive,
  onClick,
  showClose = true,
}: MoodFilterTagProps) {
  return (
    <button
      type="button"
      className={`tags-filter__tag${isActive ? ' is-active' : ''}`}
      onClick={onClick}
      aria-pressed={isActive}
    >
      <span className="tags-filter__text type-d-body-l uppercase type-m-body-s letter-spacing-002 weight-medium">
        {label}
      </span>
      {showClose && (
        <span className="tags-filter__close" aria-hidden={!isActive}>
          <i className="ic ic-close-bold" />
        </span>
      )}
    </button>
  )
}
