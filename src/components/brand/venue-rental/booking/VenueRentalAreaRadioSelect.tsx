import type { CSSProperties } from 'react'

import FormFieldError from './FormFieldError'
import AnimateOnScroll from '@/components/common/animate-on-scroll'

type VenueRentalAreaRadioOption = {
  value: string
  label: string
}

type VenueRentalAreaRadioSelectProps = {
  legend: string
  name: string
  options: VenueRentalAreaRadioOption[]
  style?: CSSProperties
  error?: string
  errorId?: string
  onOptionChange?: (value: string) => void
}

export default function VenueRentalAreaRadioSelect({
  legend,
  name,
  options,
  style,
  error,
  errorId,
  onOptionChange,
}: VenueRentalAreaRadioSelectProps) {
  return (
    <AnimateOnScroll triggerClass="fadeIn">
      <fieldset className="field field--select">
        <legend className="field-label type-d-body-s type-m-body-m letter-spacing-002 uppercase weight-medium">
          {legend}
        </legend>

        <div className="venue-area-select" style={style}>
          {options.map((option, index) => (
            <label key={option.value} className="venue-area-select__option">
              <input
                type="radio"
                name={name}
                value={option.value}
                className="venue-area-select__input"
                defaultChecked={index === 0}
                onChange={onOptionChange ? () => onOptionChange(option.value) : undefined}
              />
              <span className="venue-area-select__button type-d-body-label type-m-body-r letter-spacing-002 uppercase weight-medium">
                {option.label}
              </span>
            </label>
          ))}
        </div>

        {errorId && <FormFieldError id={errorId} message={error} />}
      </fieldset>
    </AnimateOnScroll>
  )
}

export function venueRentalAreaRadioOptionsFromLabels(
  labels: string[],
): VenueRentalAreaRadioOption[] {
  return labels.map((label) => ({ value: label, label }))
}
