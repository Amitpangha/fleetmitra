"use client"

import { UploadButton } from "@/lib/uploadthing"
import { useState } from "react"

export default function TestUploadPage() {
  const [uploadedFile, setUploadedFile] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Test Upload</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <UploadButton
          endpoint="documentUploader"
          onClientUploadComplete={(res) => {
            console.log("Upload complete:", res)
            setUploadedFile(res?.[0])
            setError(null)
          }}
          onUploadError={(error: Error) => {
            console.error("Upload error:", error)
            setError(error.message)
          }}
          onUploadProgress={(progress) => {
            console.log("Progress:", progress)
          }}
          appearance={{
            button: "w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors",
            container: "w-full",
            allowedContent: "text-sm text-gray-500 mt-2 text-center",
          }}
          content={{
            button: "Choose File",
            allowedContent: "PDF or Image (max 4MB)",
          }}
        />

        {uploadedFile && (
          <div className="mt-4 p-4 bg-green-50 rounded-md">
            <p className="font-medium text-green-800">Upload successful!</p>
            <p className="text-sm text-green-600 mt-1">File: {uploadedFile.name}</p>
            <p className="text-sm text-green-600">URL: {uploadedFile.ufsUrl}</p>
          </div>
        )}
      </div>
    </div>
  )
}