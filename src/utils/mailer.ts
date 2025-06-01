import nodemailer from 'nodemailer'

export async function mailer(
  receiver: string | null | undefined,
  mailTemplate: string,
  subject: string
) {
  if (receiver == null) {
    throw new Error('No receiver found')
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  })

  const mailOptions = {
    from: process.env.GMAIL,
    to: receiver,
    subject: subject,
    html: mailTemplate,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.response)
  } catch (error) {
    console.error(error)
  }
}
