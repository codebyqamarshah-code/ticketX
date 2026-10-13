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

export async function sendPasswordResetEmail(email, otp, isAdmin = false) {
  const subject = isAdmin
    ? 'TicketX Security: Reset your Super Admin password'
    : 'TicketX: Reset your password';

  const title = isAdmin
    ? 'Super Admin Password Reset Request'
    : 'Password Reset Request';

  const alertBadge = isAdmin
    ? '<div style="display: inline-block; background-color: #fee2e2; color: #b91c1c; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 9999px; margin-bottom: 12px; text-transform: uppercase;">Super Admin Security</div>'
    : '';

  const ignoreText = isAdmin
    ? 'If you did not request a password reset for Super Admin, please ignore this email immediately. Your account credentials remain unchanged.'
    : 'If you did not request a password reset, you can safely ignore this email. Your account is secure.';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #0f172a; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">Ticket<span style="color: #e11d48;">X</span></h2>
        ${alertBadge}
      </div>
      <h3 style="color: #1e293b; text-align: center; margin: 0 0 16px 0; font-size: 20px;">${title}</h3>
      <p style="color: #475569; font-size: 15px; line-height: 1.5; margin: 0 0 16px 0; text-align: center;">
        We received a request to reset your password. Use the verification code below to authorize the password reset:
      </p>
      <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; padding: 20px; text-align: center; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #e11d48; margin: 24px 0;">
        ${otp}
      </div>
      <p style="color: #64748b; font-size: 13px; text-align: center; margin: 0 0 24px 0;">
        ⚠️ This code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="color: #94a3b8; font-size: 12px; text-align: center; line-height: 1.5; margin: 0;">
        ${ignoreText}
      </p>
    </div>
  `;

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  try {
    if (!resend) {
      console.warn('RESEND_API_KEY is not set. Simulating password reset email for OTP:', otp);
      return { success: true, data: { simulated: true } };
    }

    const data = await resend.emails.send({
      from: `TicketX Security <${fromEmail}>`,
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

export async function sendTicketConfirmationEmail(email, order) {
  const subject = `TicketX Confirmation: Your Tickets for ${order.eventTitle} (#${order.orderId})`;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  const itemsHtml = (order.items || []).map((item, idx) => `
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 10px 0; color: #1e293b; font-weight: 600;">${item.ticketId || `TKT-${idx + 1}`}</td>
      <td style="padding: 10px 0; color: #475569;">${item.ticketType || order.ticketType}</td>
      <td style="padding: 10px 0; color: #475569;">${item.sectionName || 'GA'} · Seat ${item.seatNumber || 'GA'}</td>
      <td style="padding: 10px 0; color: #e11d48; font-weight: 700; text-align: right;">$${Number(item.price || 0).toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #0f172a; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">Ticket<span style="color: #e11d48;">X</span></h1>
        <p style="color: #10b981; font-weight: 700; font-size: 14px; margin: 6px 0 0 0;">✓ OFFICIAL BOOKING CONFIRMED</p>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-bottom: 24px;">
        <p style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px 0; font-weight: 700;">Order Reference</p>
        <h2 style="color: #0f172a; font-size: 22px; margin: 0 0 12px 0; font-family: monospace;">#${order.orderId}</h2>
        <h3 style="color: #1e293b; font-size: 18px; margin: 0 0 6px 0;">${order.eventTitle}</h3>
        <p style="color: #475569; font-size: 13px; margin: 0;">Date: ${new Date(order.createdAt).toLocaleDateString()} · Quantity: ${order.quantity} ticket(s)</p>
      </div>

      <h4 style="color: #0f172a; font-size: 14px; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">Issued Admission Passes:</h4>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
        <thead>
          <tr style="border-bottom: 2px solid #e2e8f0; text-align: left; color: #64748b; font-size: 11px; text-transform: uppercase;">
            <th style="padding-bottom: 8px;">Ticket ID</th>
            <th style="padding-bottom: 8px;">Tier</th>
            <th style="padding-bottom: 8px;">Seating</th>
            <th style="padding-bottom: 8px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="background-color: #f8fafc; border-radius: 8px; padding: 14px; margin-bottom: 24px; font-size: 13px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #475569;">
          <span>Subtotal</span>
          <span>$${Number(order.pricing?.subtotal || 0).toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #475569;">
          <span>Service & Processing</span>
          <span>$${Number(order.pricing?.serviceFee || 0).toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 15px; color: #0f172a; border-top: 1px solid #e2e8f0; padding-top: 8px; margin-top: 8px;">
          <span>Grand Total Paid</span>
          <span style="color: #e11d48;">$${Number(order.pricing?.grandTotal || 0).toFixed(2)} USD</span>
        </div>
      </div>

      <p style="color: #64748b; font-size: 12px; text-align: center; margin: 0 0 12px 0;">
        Present these ticket IDs at venue entry gates. Digital barcode verification is active.
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">
        TicketX Primary Box Office · Customer Support: support@ticketx.com
      </p>
    </div>
  `;

  try {
    if (!resend) {
      console.warn('RESEND_API_KEY is not set. Simulating ticket confirmation email for order:', order.orderId);
      return { success: true, data: { simulated: true } };
    }

    const data = await resend.emails.send({
      from: `TicketX Box Office <${fromEmail}>`,
      to: email,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Ticket confirmation email error:', error);
    return { success: false, error };
  }
}


