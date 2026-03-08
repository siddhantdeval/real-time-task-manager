import { IEmailProvider } from '../IEmailProvider';
import { logger } from '../../../utils/logger';
import { config } from '../../../config';

export class BrevoEmailProvider implements IEmailProvider {
  private readonly apiKey: string;
  private readonly fromEmail: string;

  constructor() {
    this.apiKey = config.email.brevoApiKey;
    this.fromEmail = config.email.fromAddress;

    if (!this.apiKey) {
      logger.warn('[BrevoEmailProvider] BREVO_API_KEY is not set. Email sending will fail.');
    }
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          sender: { email: this.fromEmail, name: 'TaskFlow' },
          to: [{ email: to }],
          subject: subject,
          htmlContent: html,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        logger.error(`[BrevoEmailProvider] Failed to send email: ${response.status} ${response.statusText} - ${errorData}`);
        return false;
      }

      logger.info(`[BrevoEmailProvider] Email successfully sent to ${to}`);
      return true;
    } catch (error) {
      logger.error(`[BrevoEmailProvider] Exception while sending email to ${to}:`, error);
      return false;
    }
  }
}
