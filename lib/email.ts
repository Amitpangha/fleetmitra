import nodemailer from 'nodemailer'

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"FleetMitra" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html,
    })
    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

// Email templates
export const emailTemplates = {
  documentExpiringSoon: (data: {
    userName: string
    documentType: string
    documentNumber: string
    entityName?: string
    expiryDate: Date
    daysLeft: number
  }) => ({
    subject: `⚠️ Document Expiring Soon: ${data.documentType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2563eb; margin: 0;">FleetMitra</h1>
          <p style="color: #6b7280; margin: 5px 0;">Document Expiry Alert</p>
        </div>
        
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px;">
          <p style="margin: 0; color: #92400e; font-weight: bold;">⚠️ This document will expire in ${data.daysLeft} days</p>
        </div>
        
        <p>Hello ${data.userName},</p>
        
        <p>The following document is expiring soon:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; background-color: #f3f4f6; font-weight: bold; width: 40%;">Document Type:</td>
            <td style="padding: 10px;">${data.documentType}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: #f3f4f6; font-weight: bold;">Document Number:</td>
            <td style="padding: 10px;">${data.documentNumber}</td>
          </tr>
          ${data.entityName ? `
          <tr>
            <td style="padding: 10px; background-color: #f3f4f6; font-weight: bold;">Associated With:</td>
            <td style="padding: 10px;">${data.entityName}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 10px; background-color: #f3f4f6; font-weight: bold;">Expiry Date:</td>
            <td style="padding: 10px; color: #dc2626; font-weight: bold;">${data.expiryDate.toLocaleDateString()}</td>
          </tr>
        </table>
        
        <p>Please renew this document as soon as possible to avoid any compliance issues.</p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.NEXTAUTH_URL}/dashboard/documents" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Documents</a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #6b7280; text-align: center;">
          <p>This is an automated message from FleetMitra. Please do not reply to this email.</p>
        </div>
      </div>
    `,
  }),

  documentExpired: (data: {
    userName: string
    documentType: string
    documentNumber: string
    entityName?: string
    expiryDate: Date
  }) => ({
    subject: `❌ Document Expired: ${data.documentType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2563eb; margin: 0;">FleetMitra</h1>
          <p style="color: #6b7280; margin: 5px 0;">Document Expired Alert</p>
        </div>
        
        <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin-bottom: 20px;">
          <p style="margin: 0; color: #991b1b; font-weight: bold;">❌ This document has expired</p>
        </div>
        
        <p>Hello ${data.userName},</p>
        
        <p>The following document has expired:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; background-color: #f3f4f6; font-weight: bold; width: 40%;">Document Type:</td>
            <td style="padding: 10px;">${data.documentType}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: #f3f4f6; font-weight: bold;">Document Number:</td>
            <td style="padding: 10px;">${data.documentNumber}</td>
          </tr>
          ${data.entityName ? `
          <tr>
            <td style="padding: 10px; background-color: #f3f4f6; font-weight: bold;">Associated With:</td>
            <td style="padding: 10px;">${data.entityName}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 10px; background-color: #f3f4f6; font-weight: bold;">Expired On:</td>
            <td style="padding: 10px; color: #dc2626; font-weight: bold;">${data.expiryDate.toLocaleDateString()}</td>
          </tr>
        </table>
        
        <p>Please update this document immediately to maintain compliance.</p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.NEXTAUTH_URL}/dashboard/documents" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Update Documents</a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #6b7280; text-align: center;">
          <p>This is an automated message from FleetMitra. Please do not reply to this email.</p>
        </div>
      </div>
    `,
  }),
}