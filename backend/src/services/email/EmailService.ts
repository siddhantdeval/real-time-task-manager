import { IEmailProvider } from './IEmailProvider';
import { MockEmailProvider } from './providers/MockEmailProvider';
import { BrevoEmailProvider } from './providers/BrevoEmailProvider';
import { logger } from '../../utils/logger';

export class EmailService {
  private provider: IEmailProvider;

  constructor() {
    const providerType = process.env.EMAIL_PROVIDER || 'mock';
    if (providerType === 'brevo') {
      logger.info('[EmailService] Initializing BrevoEmailProvider');
      this.provider = new BrevoEmailProvider();
    } else {
      logger.info('[EmailService] Initializing MockEmailProvider explicitly or by default');
      this.provider = new MockEmailProvider();
    }
  }

  /**
   * Invites a team member to a project via email
   * @param email Target user's email
   * @param role Target role
   * @param inviterName Name of the person sending the invite
   * @param projectName Name of the project
   * @param inviteLink The sign-up or accept link
   * @returns success boolean
   */
  async sendTeamInvite(email: string, role: string, inviterName: string, projectName: string, inviteLink: string): Promise<boolean> {
    const subject = `You've been invited to join ${projectName} on TaskFlow`;
    const html = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
        <h2>Join ${projectName} on TaskFlow</h2>
        <p>Hi there,</p>
        <p><strong>${inviterName}</strong> has invited you to join the <strong>${projectName}</strong> project as a <strong>${role}</strong>.</p>
        <p>TaskFlow is a platform to manage your tasks and projects in real-time.</p>
        <div style="margin: 30px 0;">
          <a href="${inviteLink}" style="background-color: #5348ea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Accept Invitation</a>
        </div>
        <p style="color: #666; font-size: 14px;">If you don't use TaskFlow, you can safely ignore this email.</p>
      </div>
    `;

    return this.provider.sendEmail(email, subject, html);
  }
}

// Export a singleton instance for ease of use
export const emailService = new EmailService();
