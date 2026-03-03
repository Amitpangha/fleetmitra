import Link from "next/link"
import { ReactNode } from "react"

interface FormFooterProps {
  text: string
  linkText: string
  linkHref: string
}

export function FormFooter({ text, linkText, linkHref }: FormFooterProps) {
  return (
    <div className="mt-6 text-center">
      <p className="text-gray-700 dark:text-gray-300 font-medium">
        {text}{' '}
        <Link 
          href={linkHref} 
          className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 transition-colors"
        >
          {linkText}
        </Link>
      </p>
    </div>
  )
}

interface FormContainerProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function FormContainer({ children, title, subtitle }: FormContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {title}
          </h1>
          {subtitle && <p className="text-gray-700 dark:text-gray-300 font-medium mt-2">{subtitle}</p>}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          {children}
        </div>

        <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 mt-4">
          By continuing, you agree to our{' '}
          <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold underline underline-offset-2">
            Terms
          </a>
          {' '}and{' '}
          <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold underline underline-offset-2">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}

interface FormInputProps {
  label: string
  name: string
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  minLength?: number
  autoComplete?: string
  hint?: string
}

export function FormInput({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  minLength,
  autoComplete,
  hint,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-bold text-gray-800 dark:text-gray-200">
        {label} {required && <span className="text-red-500 dark:text-red-400">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium placeholder:text-gray-600 dark:placeholder:text-gray-400"
      />
      {hint && <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

interface FormSelectProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: Array<{ value: string; label: string }>
  required?: boolean
  placeholder?: string
}

export function FormSelect({ label, name, value, onChange, options, required = false, placeholder }: FormSelectProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-bold text-gray-800 dark:text-gray-200">
        {label} {required && <span className="text-red-500 dark:text-red-400">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold"
      >
        {placeholder && <option value="" className="font-medium">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="font-medium">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

interface FormTextareaProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  required?: boolean
  rows?: number
}

export function FormTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 3,
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-bold text-gray-800 dark:text-gray-200">
        {label} {required && <span className="text-red-500 dark:text-red-400">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium placeholder:text-gray-600 dark:placeholder:text-gray-400 min-h-[100px] resize-y"
      />
    </div>
  )
}

interface FormButtonProps {
  isLoading: boolean
  loadingText: string
  children: ReactNode
}

export function FormButton({ isLoading, loadingText, children }: FormButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  )
}

interface ErrorAlertProps {
  error: string | null
}

export function ErrorAlert({ error }: ErrorAlertProps) {
  if (!error) return null
  
  return (
    <div className="mb-6 bg-red-50 dark:bg-red-900/30 border-2 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-xl flex items-start gap-3">
      <span className="text-xl">❌</span>
      <span className="font-bold">{error}</span>
    </div>
  )
}

interface SuccessAlertProps {
  success: string | null
}

export function SuccessAlert({ success }: SuccessAlertProps) {
  if (!success) return null
  
  return (
    <div className="mb-6 bg-green-50 dark:bg-green-900/30 border-2 border-green-500 text-green-700 dark:text-green-400 p-4 rounded-xl flex items-start gap-3">
      <span className="text-xl">✅</span>
      <span className="font-bold">{success}</span>
    </div>
  )
}