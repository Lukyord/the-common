import React from 'react'
import Link from 'next/link'

export default function VenueRentalEmptyState() {
  return (
    <section className="venue-rental-empty header-padding bg-beige">
      <div className="sc-inner pc-t-200 pc-b-200 mb-t-100 mb-b-100">
        <div className="container">
          <h1 className="type-d-display type-m-display weight-medium letter-spacing-002">
            Venue Rental
          </h1>

          <p className="type-d-body-l type-m-body-m letter-spacing-002">Venue Rental not found.</p>

          <Link
            href="/"
            className="button-template"
            style={{ '--button-bg-color': 'var(--color-saladaeng-orange)' } as React.CSSProperties}
          >
            <span>
              <span>Back to Home</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
