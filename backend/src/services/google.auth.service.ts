import { OAuth2Client } from 'google-auth-library';
import { config } from '../config';

const client = new OAuth2Client(config.google.clientId);

export const verifyGoogleToken = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: config.google.clientId,
  });
  const payload = ticket.getPayload();
  return payload;
};
