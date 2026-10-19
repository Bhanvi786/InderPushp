import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const apiKey = process.env.RESEND_API_KEY;
export const resend = apiKey ? new Resend(apiKey) : null;

export interface EnquiryEmailData {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  enquiryId?: string;
}

/**
 * Sends an email notification to the studio when a customer submits an enquiry.
 * Tries the primary FROM_EMAIL first (domain-based), and if unverified, falls back
 * gracefully to the onboarding@resend.dev test address.
 */
export async function sendEnquiryNotification(data: EnquiryEmailData): Promise<boolean> {
  if (!resend) {
    console.warn('[Resend] RESEND_API_KEY is not defined. Skipping email notification.');
    return false;
  }

  const notificationRecipient = process.env.NOTIFICATION_EMAIL || 'inderpushphouseofart@yahoo.com';
  const primaryFrom = process.env.FROM_EMAIL || 'InderPushp <contact@inderpushphouseofart.com>';
  const fallbackFrom = process.env.FALLBACK_FROM_EMAIL || 'InderPushp <onboarding@resend.dev>';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Art Enquiry - InderPushp</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #F8F5F0; font-family: 'Georgia', serif; color: #263248;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F5F0; padding: 32px 16px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #E8DFD1; box-shadow: 0 4px 16px rgba(38,50,72,0.06);">
                
                <!-- Header -->
                <tr>
                  <td style="background-color: #263248; padding: 36px 32px; text-align: center; border-bottom: 3px solid #B79A5A;">
                    <h1 style="margin: 0; font-size: 26px; color: #FAF7F0; letter-spacing: 3px; font-weight: normal; text-transform: uppercase;">
                      INDER PUSHP
                    </h1>
                    <p style="margin: 6px 0 0; color: #D8C594; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                      House of Art &middot; New Collector Enquiry
                    </p>
                  </td>
                </tr>

                <!-- Content Area -->
                <tr>
                  <td style="padding: 36px 32px;">
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #263248;">
                      You have received a new inquiry from your website portfolio:
                    </p>

                    <!-- Details Card -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF7F0; border-radius: 8px; border: 1px solid #EAE0D3; margin-bottom: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                      <tr>
                        <td style="padding: 14px 18px; border-bottom: 1px solid #EAE0D3; width: 30%; font-size: 12px; color: #7B8594; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                          Client Name
                        </td>
                        <td style="padding: 14px 18px; border-bottom: 1px solid #EAE0D3; font-size: 15px; color: #263248; font-weight: 600;">
                          ${data.fullName}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 14px 18px; border-bottom: 1px solid #EAE0D3; font-size: 12px; color: #7B8594; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                          Email
                        </td>
                        <td style="padding: 14px 18px; border-bottom: 1px solid #EAE0D3; font-size: 14px; color: #263248;">
                          <a href="mailto:${data.email}" style="color: #9E7D3B; text-decoration: none; font-weight: 500;">
                            ${data.email}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 14px 18px; border-bottom: 1px solid #EAE0D3; font-size: 12px; color: #7B8594; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                          Phone
                        </td>
                        <td style="padding: 14px 18px; border-bottom: 1px solid #EAE0D3; font-size: 14px; color: #263248;">
                          ${data.phone ? `<a href="tel:${data.phone}" style="color: #263248; text-decoration: none;">${data.phone}</a>` : '<span style="color: #9BA3AF;">Not provided</span>'}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 14px 18px; font-size: 12px; color: #7B8594; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                          Subject
                        </td>
                        <td style="padding: 14px 18px; font-size: 14px; color: #9E7D3B; font-weight: 600;">
                          ${data.subject}
                        </td>
                      </tr>
                    </table>

                    <!-- Message Body -->
                    <div style="margin-bottom: 28px;">
                      <h4 style="margin: 0 0 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #7B8594; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        Client Message
                      </h4>
                      <div style="background-color: #FFFFFF; border-left: 3px solid #B79A5A; padding: 18px 20px; font-family: 'Georgia', serif; font-size: 15px; line-height: 1.7; color: #2C3545; font-style: italic; border-radius: 0 6px 6px 0; border: 1px solid #EAE0D3; border-left: 3px solid #B79A5A;">
                        ${data.message.replace(/\n/g, '<br />')}
                      </div>
                    </div>

                    <!-- Quick Reply CTA Button -->
                    <div style="text-align: center; margin-top: 32px;">
                      <a href="mailto:${data.email}?subject=${encodeURIComponent(`Re: [InderPushp] ${data.subject}`)}"
                         style="background-color: #263248; color: #FAF7F0; padding: 14px 28px; text-decoration: none; border-radius: 9999px; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; display: inline-block; border: 1px solid #B79A5A;">
                        Reply to ${data.fullName.split(' ')[0]}
                      </a>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #FAF7F0; padding: 20px 32px; text-align: center; border-top: 1px solid #E8DFD1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #8C94A0;">
                    InderPushp House of Art &middot; Dedicated Fine Art Portal &middot;
                    ${data.enquiryId ? `Enquiry ID: ${data.enquiryId}` : ''}
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const plainTextContent = `New Art Enquiry - InderPushp

Client Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Subject: ${data.subject}

Message:
${data.message}

Enquiry ID: ${data.enquiryId || ''}
`;

  // Attempt 1: Send via primary custom domain
  try {
    const result = await resend.emails.send({
      from: primaryFrom,
      to: [notificationRecipient],
      replyTo: data.email,
      subject: `New Art Enquiry from ${data.fullName}: ${data.subject}`,
      html: htmlContent,
      text: plainTextContent,
    });

    if (result.error) {
      console.warn('[Resend] Primary FROM_EMAIL failed, trying fallback:', result.error.message);
      // Attempt 2: Fallback to onboarding address if domain is not yet verified in Resend
      const fallbackResult = await resend.emails.send({
        from: fallbackFrom,
        to: [notificationRecipient],
        replyTo: data.email,
        subject: `New Art Enquiry from ${data.fullName}: ${data.subject}`,
        html: htmlContent,
        text: plainTextContent,
      });

      if (fallbackResult.error) {
        console.error('[Resend] Fallback also failed:', fallbackResult.error);
        return false;
      }
    }

    console.log(`[Resend] Successfully dispatched email notification! Email ID: ${result.data?.id}`);
    return true;
  } catch (err) {
    console.error('[Resend] Error sending enquiry notification:', err);
    return false;
  }
}
