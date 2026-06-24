import FormFieldError from './FormFieldError'

type FormTextFieldProps = {
  id: string
  name: string
  label: string
  type?: 'text' | 'email' | 'tel'
  autoComplete?: string
  error?: string
  errorId: string
  multiline?: boolean
}

export default function FormTextField({
  id,
  name,
  label,
  type = 'text',
  autoComplete,
  error,
  errorId,
  multiline = false,
}: FormTextFieldProps) {
  const inputProps = {
    id,
    name,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? errorId : undefined,
  }

  return (
    <div className="field">
      <div className="input" data-has-error={error ? '' : undefined}>
        <label htmlFor={id} className="label anim fixed">
          <span>{label}</span>
        </label>

        {multiline ? (
          <textarea {...inputProps} />
        ) : (
          <input {...inputProps} type={type} autoComplete={autoComplete} />
        )}

        <FormFieldError id={errorId} message={error} />
      </div>
    </div>
  )
}
