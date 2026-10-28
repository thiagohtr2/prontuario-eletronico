import { forwardRef, useId, useState } from 'react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../../lib/cn'

// Fonte de 16 px evita o zoom automático do iOS ao focar o campo.
const controlBase =
  'w-full rounded-field border border-line-control bg-surface text-md text-ink placeholder:text-placeholder ' +
  'transition-colors hover:border-line-hover focus:border-line-focus focus:outline-none ' +
  'focus-visible:outline-none focus:shadow-[0_0_0_3px_var(--brand-focus-ring)] ' +
  'disabled:cursor-not-allowed disabled:border-line disabled:bg-disabled disabled:text-disabled-fg'

const controlError = 'border-danger hover:border-danger focus:border-danger'

type FieldWrapperProps = {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  required?: boolean
  className?: string
  children: ReactNode
}

function FieldWrapper({ label, htmlFor, hint, error, required, className, children }: FieldWrapperProps) {
  return (
    <div className={cn('w-full min-w-0', className)}>
      <label htmlFor={htmlFor} className="field-label">
        {label}
        {required && (
          <span className="text-danger" aria-hidden>
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-message`} className="field-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-message`} className="field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
  error?: string
  wrapperClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, wrapperClassName, className, id, required, ...props },
  ref,
) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  return (
    <FieldWrapper
      label={label}
      htmlFor={fieldId}
      hint={hint}
      error={error}
      required={required}
      className={wrapperClassName}
    >
      <input
        ref={ref}
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${fieldId}-message` : undefined}
        className={cn(controlBase, 'h-control px-4', error && controlError, className)}
        {...props}
      />
    </FieldWrapper>
  )
})

type PasswordInputProps = Omit<InputProps, 'type'>

/** Campo de senha com botão de mostrar/ocultar acessível por teclado. */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { label, hint, error, wrapperClassName, className, id, required, ...props },
  ref,
) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const [visible, setVisible] = useState(false)
  return (
    <FieldWrapper
      label={label}
      htmlFor={fieldId}
      hint={hint}
      error={error}
      required={required}
      className={wrapperClassName}
    >
      <div className="relative">
        <input
          ref={ref}
          id={fieldId}
          type={visible ? 'text' : 'password'}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${fieldId}-message` : undefined}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className={cn(controlBase, 'h-control pl-4 pr-14', error && controlError, className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={visible}
          aria-controls={fieldId}
          className="absolute right-0.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-pill text-icon transition-colors hover:bg-surface-hover hover:text-icon-hover"
        >
          {visible ? <EyeOff size={19} aria-hidden /> : <Eye size={19} aria-hidden />}
        </button>
      </div>
    </FieldWrapper>
  )
})

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  hint?: string
  error?: string
  wrapperClassName?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, wrapperClassName, className, id, required, rows = 4, ...props },
  ref,
) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  return (
    <FieldWrapper
      label={label}
      htmlFor={fieldId}
      hint={hint}
      error={error}
      required={required}
      className={wrapperClassName}
    >
      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${fieldId}-message` : undefined}
        className={cn(controlBase, 'resize-y px-4 py-3 leading-6', error && controlError, className)}
        {...props}
      />
    </FieldWrapper>
  )
})

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  hint?: string
  error?: string
  wrapperClassName?: string
}

// Seta do select no token de ícone (#a27984).
const selectArrow =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%23a27984' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")"

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, wrapperClassName, className, id, required, children, ...props },
  ref,
) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  return (
    <FieldWrapper
      label={label}
      htmlFor={fieldId}
      hint={hint}
      error={error}
      required={required}
      className={wrapperClassName}
    >
      <select
        ref={ref}
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${fieldId}-message` : undefined}
        className={cn(
          controlBase,
          'h-control appearance-none truncate bg-no-repeat pl-4 pr-11',
          error && controlError,
          className,
        )}
        style={{ backgroundImage: selectArrow, backgroundPosition: 'right 14px center' }}
        {...props}
      >
        {children}
      </select>
    </FieldWrapper>
  )
})

/** Mensagem de erro de formulário, próxima do botão de envio. */
export function FormError({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-field bg-danger-soft px-4 py-3 text-sm text-danger" role="alert">
      {children}
    </p>
  )
}
