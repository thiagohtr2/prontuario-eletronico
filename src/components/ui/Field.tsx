import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

const controlBase =
  'w-full rounded-md border border-line bg-surface text-ink placeholder:text-slate-400 ' +
  'transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 ' +
  'disabled:bg-slate-50 disabled:text-muted'

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
    <div className={cn('w-full', className)}>
      <label htmlFor={htmlFor} className="field-label">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      {children}
      {error ? <p className="field-error">{error}</p> : hint ? <p className="field-hint">{hint}</p> : null}
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
        className={cn(controlBase, 'h-11 px-3 text-sm', error && 'border-danger focus:border-danger focus:ring-danger/25', className)}
        {...props}
      />
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
        className={cn(controlBase, 'px-3 py-2.5 text-sm leading-6 resize-y', error && 'border-danger focus:border-danger focus:ring-danger/25', className)}
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
        className={cn(
          controlBase,
          'h-11 px-3 text-sm appearance-none bg-no-repeat pr-10',
          error && 'border-danger focus:border-danger focus:ring-danger/25',
          className,
        )}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundPosition: 'right 12px center',
        }}
        {...props}
      >
        {children}
      </select>
    </FieldWrapper>
  )
})
