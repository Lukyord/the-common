'use client'

import { useEffect, type Dispatch, type SetStateAction } from 'react'

const HEADER_MENU_HTML_CLASS = 'header-menu-enabled'

type HeaderMenuCtrlProps = {
  isMenuOpen: boolean
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>
}

export default function HeaderMenuCtrl({ isMenuOpen, setIsMenuOpen }: HeaderMenuCtrlProps) {

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle(HEADER_MENU_HTML_CLASS, isMenuOpen)
    return () => root.classList.remove(HEADER_MENU_HTML_CLASS)
  }, [isMenuOpen])

  return (
    <div className="header-menu-ctrl hidden-device-md">
      <button
        type="button"
        className="menu-ctrl"
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span className="hamburger">
          <span className="bars">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </span>
        </span>
      </button>
    </div>
  )
}
