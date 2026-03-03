"use client"

import { useState } from "react"
import Link from "next/link"
import { FormContainer, FormInput, FormButton, ErrorAlert, SuccessAlert, FormFooter } from "@/components/FormComponents"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset email")
      }

      setSuccess("Password reset instructions have been sent to your email.")
      setEmail("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormContainer title="FleetMitra" subtitle="Reset your password">
      <ErrorAlert error={error} />
      <SuccessAlert success={success} />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          autoComplete="email"
        />

        <FormButton isLoading={isLoading} loadingText="Sending...">
          Send Reset Instructions
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