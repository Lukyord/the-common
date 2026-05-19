'use client'

import { useState } from 'react'

export default function HeaderMenuCtrl() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="header-menu-ctrl hidden-device-md">
      <button className="menu-ctrl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
