import React from 'react'

export const dynamic = 'force-dynamic'

export default function VendorPage() {
  return (
    <main id="main" className="vendors-page">
      <section style={{ height: '100vh' }}></section>

      <section data-section="vendors-list"></section>
    </main>
  )
}
