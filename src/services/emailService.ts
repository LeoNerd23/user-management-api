import nodemailer from 'nodemailer';

/**
 * Envia um e-mail.
 * @param to - Endereço de e-mail do destinatário.
 * @param subject - Assunto do e-mail.
 * @param text - Corpo do e-mail.
 * @returns Uma Promise que resolve quando o e-mail for enviado.
 */
export const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

