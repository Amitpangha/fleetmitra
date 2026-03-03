import { createUploadthing, type FileRouter } from "uploadthing/next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const f = createUploadthing()

export const ourFileRouter = {
  documentUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions)
      if (!session) throw new Error("Unauthorized")
      return { userId: session.user.id }
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log("Upload complete for user:", metadata.userId)
      console.log("File URL:", file.ufsUrl)
      return { uploadedBy: metadata.userId }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter