import { z } from 'zod'

import {
  FORM_SUBMISSION_ERROR_TOAST_MESSAGE,
  FORM_VALIDATION_TOAST_MESSAGE,
} from '@/constants/formToastMessages'

export const contactFormFieldKeys = [
  'name',
  'email',
  'phone',
  'subject',
  'message',
] as const

export type ContactFormFieldKey = (typeof contactFormFieldKeys)[number]

export type ContactFormValues = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export function createContactFormSchema(subjects: string[]) {
  const subjectSchema =
    subjects.length > 0
      ? z
          .string()
          .trim()
          .min(1, 'Please select a subject')
          .refine((value) => subjects.includes(value), 'Please select a subject')
      : z.string().optional()

  return z.object({
    name: z.string().trim().min(1, 'Name is required'),
    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .email('Enter a valid email address'),
    phone: z.string().trim().max(30, 'Phone number is too long').optional().or(z.literal('')),
    subject: subjectSchema,
    message: z.string().trim().min(1, 'Message is required'),
  })
}

export function contactFormValuesFromFormData(
  formData: FormData,
  hasSubjects: boolean,
): ContactFormValues {
  return {
    name: String(formData.get('contact-name') ?? ''),
    email: String(formData.get('contact-email') ?? ''),
    phone: String(formData.get('contact-phone') ?? ''),
    subject: hasSubjects ? String(formData.get('contact-subject') ?? '') : '',
    message: String(formData.get('contact-message') ?? ''),
  }
}

export function normalizeContactFormValues(
  values: z.infer<ReturnType<typeof createContactFormSchema>>,
): ContactFormValues {
  return {
    name: values.name,
    email: values.email,
    phone: values.phone ?? '',
    subject: values.subject ?? '',
    message: values.message,
  }
}

export function fieldErrorsFromZodError(
  error: z.ZodError,
): Partial<Record<ContactFormFieldKey, string>> {
  const errors: Partial<Record<ContactFormFieldKey, string>> = {}

  for (const issue of error.issues) {
    const key = issue.path[0]
    if (
      typeof key === 'string' &&
      contactFormFieldKeys.includes(key as ContactFormFieldKey) &&
      !errors[key as ContactFormFieldKey]
    ) {
      errors[key as ContactFormFieldKey] = issue.message
    }
  }

  return errors
}

export function contactFormErrorToastMessage(
  fieldErrors: Partial<Record<ContactFormFieldKey, string>>,
  fallback = FORM_SUBMISSION_ERROR_TOAST_MESSAGE,
): string {
  const hasFieldErrors = contactFormFieldKeys.some((key) => fieldErrors[key])

  return hasFieldErrors ? FORM_VALIDATION_TOAST_MESSAGE : fallback
}
