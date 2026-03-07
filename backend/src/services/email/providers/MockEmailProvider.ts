import { IEmailProvider } from '../IEmailProvider';
import { logger } from '../../../utils/logger';

export class MockEmailProvider implements IEmailProvider {
  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    logger.info(`[MockEmailProvider] Sending Email to: ${to}`);
    logger.info(`[MockEmailProvider] Subject: ${subject}`);
    logger.debug(`[MockEmailProvider] Content: ${html}`);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    logger.info(`[MockEmailProvider] Email sent successfully.`);
    return true;
  }
}
