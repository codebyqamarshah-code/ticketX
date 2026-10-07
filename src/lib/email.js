import { Resend } from 'resend';

// Resend instance
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendVerificationEmail(email, otp, isAdmin = false) {
  const subject = isAdmin 
    ? 'TicketX Admin Security: Verify your Super Admin email' 
    : 'TicketX: Verify your email address';

  const title = isAdmin 
    ? 'Verify your Super Admin email' 
    : 'Verify your email address';

  const ignoreText = isAdmin 
    ? 'If you did not initiate Super Admin setup, please ignore this email.' 
    : 'If you did not create a TicketX account, you can safely ignore this email.';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">TicketX</h2>
      <h3 style="color: #555; text-align: center;">${title}</h3>
      <p style="color: #555; font-size: 16px;">Your verification code is:</p>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #000;">
        ${otp}
      </div>
      <p style="color: #555; font-size: 14px; margin-top: 20px;">This code will expire in 10 minutes.</p>
      <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
      <p style="color: #999; font-size: 12px; text-align: center;">${ignoreText}</p>
    </div>
  `;

  // We recommend using a verified domain for production like 'onboarding@resend.dev' or your custom domain.
  // Using onboarding@resend.dev works for testing but requires the recipient to be added to Resend testing.
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  try {
    if (!resend) {
      console.warn('RESEND_API_KEY is not set. Simulating email send for OTP:', otp);
      return { success: true, data: { simulated: true } };
    }

    const data = await resend.emails.send({
      from: `TicketX <${fromEmail}>`,
      to: email,
      subject: subject,
      html: html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Resend Error:', error);
    return { success: false, error };
  }
}
