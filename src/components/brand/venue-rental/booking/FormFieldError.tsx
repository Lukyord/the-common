type FormFieldErrorProps = {
  id: string
  message?: string
}

export default function FormFieldError({ id, message }: FormFieldErrorProps) {
  if (!message) return null

  return (
    <p id={id} className="field-error" role="alert">
      {message}
    </p>
  )
}
