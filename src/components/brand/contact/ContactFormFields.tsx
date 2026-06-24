'use client'

import { useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import AnimateOnScroll from '@/components/common/animate-on-scroll'
import CustomSelect from '@/components/common/CustomSelect'
import { syncFormControlsFilled } from '@/hooks/useFormInit'
import {
  contactFormErrorToastMessage,
  contactFormValuesFromFormData,
  createContactFormSchema,
  fieldErrorsFromZodError,
  normalizeContactFormValues,
  type ContactFormFieldKey,
} from './contactFormSchema'
import { resolveContactSubjects } from './contactFormSubjects'

type ContactFormFieldsProps = {
  subjects: string[]
  buttonColor?: string
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null

  return (
    <p id={id} className="field-error" role="alert">
      {message}
    </p>
  )
}

export default function ContactFormFields({ subjects, buttonColor }: ContactFormFieldsProps) {
  const resolvedSubjects = resolveContactSubjects(subjects)
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<Partial<Record<ContactFormFieldKey, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hasSubjects = resolvedSubjects.length > 0

  useLayoutEffect(() => {
    if (formRef.current) syncFormControlsFilled(formRef.current)
  }, [errors])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const values = contactFormValuesFromFormData(new FormData(form), hasSubjects)
    const result = createContactFormSchema(resolvedSubjects).safeParse(values)

    if (!result.success) {
      const fieldErrors = fieldErrorsFromZodError(result.error)
      setErrors(fieldErrors)
      toast.error(contactFormErrorToastMessage(fieldErrors))
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizeContactFormValues(result.data)),
      })

      const payload = (await response.json().catch((): null => null)) as {
        error?: string
        fieldErrors?: Partial<Record<ContactFormFieldKey, string>>
      } | null

      if (!response.ok) {
        const fieldErrors = payload?.fieldErrors
        if (fieldErrors) {
          setErrors(fieldErrors)
        }

        const message = fieldErrors
          ? contactFormErrorToastMessage(fieldErrors, payload?.error)
          : payload?.error

        toast.error(message ?? 'Unable to send your message. Please try again.')
        return
      }

      form.reset()
      syncFormControlsFilled(form)
      toast.success('Thank you. Your message has been sent.')
    } catch {
      toast.error('Unable to send your message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const errorId = (field: ContactFormFieldKey) => `contact-${field}-error`

  return (
    <form ref={formRef} action="" onSubmit={handleSubmit} noValidate>
      <div className="fields">
        <AnimateOnScroll triggerClass="fadeIn" className="form-label">
          <h3 className="type-d-body-l type-m-headliner-m weight-medium letter-spacing-002">
            Send Inquiry
          </h3>
        </AnimateOnScroll>

        <AnimateOnScroll triggerClass="fadeIn" className="field">
          <div className="input" data-has-error={errors.name ? '' : undefined}>
            <label className="label anim fixed" htmlFor="contact-name">
              <span>Name</span>
            </label>
            <input
              id="contact-name"
              type="text"
              name="contact-name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? errorId('name') : undefined}
            />
            <FieldError id={errorId('name')} message={errors.name} />
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll triggerClass="fadeIn" className="field">
          <div className="input" data-has-error={errors.email ? '' : undefined}>
            <label className="label anim fixed" htmlFor="contact-email">
              <span>Email</span>
            </label>
            <input
              id="contact-email"
              type="email"
              name="contact-email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? errorId('email') : undefined}
            />
            <FieldError id={errorId('email')} message={errors.email} />
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll triggerClass="fadeIn" className="field">
          <div className="input" data-has-error={errors.phone ? '' : undefined}>
            <label className="label anim fixed" htmlFor="contact-phone">
              <span>Phone number (Optional)</span>
            </label>
            <input
              id="contact-phone"
              type="tel"
              name="contact-phone"
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? errorId('phone') : undefined}
            />
            <FieldError id={errorId('phone')} message={errors.phone} />
          </div>
        </AnimateOnScroll>

        {hasSubjects && (
          <AnimateOnScroll
            triggerClass="fadeIn"
            className="field"
            style={{ position: 'relative', zIndex: 10 }}
          >
            <CustomSelect
              id="contact-subject"
              name="contact-subject"
              label="Subject"
              options={resolvedSubjects}
              error={errors.subject}
            />
            <FieldError id={errorId('subject')} message={errors.subject} />
          </AnimateOnScroll>
        )}

        <AnimateOnScroll triggerClass="fadeIn" className="field">
          <div className="input" data-has-error={errors.message ? '' : undefined}>
            <label className="label anim fixed" htmlFor="contact-message">
              <span>Write your inquiry here</span>
            </label>
            <textarea
              id="contact-message"
              name="contact-message"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? errorId('message') : undefined}
            />
            <FieldError id={errorId('message')} message={errors.message} />
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll triggerClass="fadeIn" className="form-submit">
          <button
            type="submit"
            className="button-template"
            disabled={isSubmitting}
            style={
              {
                '--button-bg-color': buttonColor ?? 'var(--color-saladaeng-orange)',
              } as React.CSSProperties
            }
          >
            <span>
              <span>{isSubmitting ? 'SENDING…' : 'SUBMIT'}</span>
            </span>
          </button>
        </AnimateOnScroll>
      </div>
    </form>
  )
}
