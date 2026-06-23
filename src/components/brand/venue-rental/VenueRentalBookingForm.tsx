'use client'

import { MarkdownContent } from '@/components/common/markdown-content'
import { bindFormControls } from '@/hooks/useFormInit'
import { useLayoutEffect, useRef, type CSSProperties, type FormEvent } from 'react'

import type { VenueRentalBookingCta } from './types'

type VenueRentalBookingFormProps = {
  title?: string
  showBackMobile?: boolean
  formAreaOptions?: string[]
  bookingCta?: VenueRentalBookingCta | null
}

export default function VenueRentalBookingForm({
  title,
  showBackMobile: _showBackMobile,
  formAreaOptions = [],
  bookingCta,
}: VenueRentalBookingFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  const desiredAreaOptions = formAreaOptions

  const areaSelectStyle = {
    '--venue-area-selected-bg': bookingCta?.formSelectedButtonBgColor ?? undefined,
    '--venue-area-selected-text': bookingCta?.formSelectedButtonTextColor ?? undefined,
  } as CSSProperties

  useLayoutEffect(() => {
    if (!formRef.current) return
    return bindFormControls(formRef.current)
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <div className="venue-form">
      <div className="venue-form-inner">
        {title && (
          <MarkdownContent
            as="h2"
            className="form-ttl type-d-body-l type-m-title weight-medium letter-spacing-002 uppercase"
          >
            {title}
          </MarkdownContent>
        )}

        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="fields">
            {desiredAreaOptions.length > 0 && (
              <fieldset className="field field--select">
                <legend className="field-label type-d-body-s type-m-body-m letter-spacing-002 uppercase weight-medium">
                  Desired area
                </legend>

                <div className="venue-area-select" style={areaSelectStyle}>
                  {desiredAreaOptions.map((option, index) => (
                    <label key={option} className="venue-area-select__option">
                      <input
                        type="radio"
                        name="desired-area"
                        value={option}
                        className="venue-area-select__input"
                        required={index === 0}
                        defaultChecked={index === 0}
                      />
                      <span className="venue-area-select__button type-d-body-label type-m-body-r letter-spacing-002 uppercase weight-medium">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="field">
              <div className="input">
                <label htmlFor="venue-rental-name" className="label anim fixed">
                  <span>Name</span>
                </label>
                <input id="venue-rental-name" name="name" type="text" required />
              </div>
            </div>

            <div className="field">
              <div className="input">
                <label htmlFor="venue-rental-email" className="label anim fixed">
                  <span>Email</span>
                </label>
                <input
                  id="venue-rental-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="field">
              <div className="input">
                <label htmlFor="venue-rental-phone" className="label anim fixed">
                  <span>Phone number (Optional)</span>
                </label>
                <input id="venue-rental-phone" name="phone" type="tel" autoComplete="tel" />
              </div>
            </div>

            <div className="field">
              <div className="input">
                <label htmlFor="venue-rental-inquiry" className="label anim fixed">
                  <span>Further inquiry here (Optional)</span>
                </label>
                <textarea id="venue-rental-inquiry" name="inquiry" />
              </div>
            </div>
          </div>

          <div className="form-submit">
            <button
              type="submit"
              className={[
                'button-template',
                bookingCta?.formSubmitWhiteTextOnHover && 'c-white-hover',
                bookingCta?.formSubmitDarkBrownTextOnHover && 'c-dark-brown-hover',
              ]
                .filter(Boolean)
                .join(' ')}
              style={
                {
                  '--button-bg-color': bookingCta?.formSubmitButtonBgColor,
                } as CSSProperties
              }
            >
              <span>
                <span>SUBMIT</span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
