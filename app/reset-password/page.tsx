"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FormContainer, FormInput, FormButton, ErrorAlert, SuccessAlert, FormFooter } from "@/components/FormComponents"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password")
      }

      setSuccess("Password has been reset successfully!")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <FormContainer title="FleetMitra" subtitle="Invalid reset link">
        <ErrorAlert error="This password reset link is invalid or has expired." />
        <FormFooter
          text="Go back to"
          linkText="Sign in"
          linkHref="/login"
        />
      </FormContainer>
    )
  }

  return (
    <FormContainer title="FleetMitra" subtitle="Create new password">
      <ErrorAlert error={error} />
      <SuccessAlert success={success} />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="New Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter new password"
          required
          minLength={8}
          autoComplete="new-password"
          hint="Must be at least 8 characters long"
        />

        <FormInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
          required
          autoComplete="new-password"
        />

        <FormButton isLoading={isLoading} loadingText="Resetting...">
          Reset Password
        </FormButton>
      </form>

      <FormFooter
        text="Remember your password?"
        linkText="Sign in"
        linkHref="/login"
      />
    </FormContainer>
  )
}