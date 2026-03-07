export interface IEmailProvider {
  /**
   * Send an email using the underlying provider strategy.
   * @param to The recipient's email address
   * @param subject The email subject line
   * @param html The HTML content of the email
   * @returns A boolean indicating success or failure
   */
  sendEmail(to: string, subject: string, html: string): Promise<boolean>;
}
