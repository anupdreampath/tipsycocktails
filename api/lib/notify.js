import nodemailer from 'nodemailer'

function formatInquiryBody(contact) {
  return [
    'New quote request',
    '',
    `Name: ${contact.name}`,
    `Email: ${contact.email}`,
    `Phone: ${contact.phone || 'Not provided'}`,
    '',
    'Message:',
    contact.message,
  ].join('\n')
}

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.QUOTE_NOTIFY_EMAIL)
}

export async function notifyQuoteRequest(contact) {
  if (!smtpConfigured()) return

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.QUOTE_FROM_EMAIL || process.env.SMTP_USER,
      to: process.env.QUOTE_NOTIFY_EMAIL,
      replyTo: contact.email,
      subject: `New quote request from ${contact.name}`,
      text: formatInquiryBody(contact),
    })
  } catch (error) {
    console.error('Quote email notification failed:', error)
  }
}
