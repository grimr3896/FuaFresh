import dotenv from 'dotenv';

dotenv.config();

export interface DarajaConfig {
  env: 'sandbox' | 'production';
  consumerKey: string;
  consumerSecret: string;
  passkey: string;
  businessShortCode: string;
  transactionType: string;
  partyB: string;
  callbackUrl: string;
  apiBaseUrl: string;
  oauthEndpoint: string;
  stkPushEndpoint: string;
  stkQueryEndpoint: string;
  port: number;
}

const environment = (
  process.env.MPESA_ENVIRONMENT ||
  process.env.MPESA_ENV ||
  'sandbox'
).toLowerCase();

if (!['sandbox', 'production'].includes(environment)) {
  throw new Error('MPESA_ENVIRONMENT must be either "sandbox" or "production".');
}

const env = environment as 'sandbox' | 'production';
const apiBaseUrl = env === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

const appUrl = (process.env.APP_URL || '').trim().replace(/\/$/, '');
const customCallback = (process.env.MPESA_CALLBACK_URL || '').trim();
const callbackUrl = customCallback || (appUrl ? `${appUrl}/api/mpesa/callback` : '');

export const config: DarajaConfig = {
  env,
  // Secrets are read only from server-side environment variables. Never hardcode credentials.
  consumerKey: (process.env.DARAJA_CONSUMER_KEY || process.env.MPESA_CONSUMER_KEY || '').trim(),
  consumerSecret: (process.env.DARAJA_CONSUMER_SECRET || process.env.MPESA_CONSUMER_SECRET || '').trim(),
  passkey: (process.env.MPESA_PASSKEY || '').trim(),
  businessShortCode: (process.env.MPESA_SHORTCODE || process.env.MPESA_BUSINESS_SHORTCODE || '').trim(),
  transactionType: (process.env.MPESA_TRANSACTION_TYPE || 'CustomerPayBillOnline').trim(),
  partyB: (process.env.MPESA_PARTY_B || process.env.MPESA_SHORTCODE || process.env.MPESA_BUSINESS_SHORTCODE || '').trim(),
  callbackUrl,
  apiBaseUrl,
  oauthEndpoint: `${apiBaseUrl}/oauth/v1/generate?grant_type=client_credentials`,
  stkPushEndpoint: `${apiBaseUrl}/mpesa/stkpush/v1/processrequest`,
  stkQueryEndpoint: `${apiBaseUrl}/mpesa/stkpushquery/v1/query`,
  port: Number.parseInt(process.env.PORT || '3000', 10),
};

export function getMissingDarajaConfig(): string[] {
  const missing: string[] = [];
  if (!config.consumerKey) missing.push('DARAJA_CONSUMER_KEY');
  if (!config.consumerSecret) missing.push('DARAJA_CONSUMER_SECRET');
  if (!config.passkey) missing.push('MPESA_PASSKEY');
  if (!config.businessShortCode) missing.push('MPESA_SHORTCODE');
  if (!config.partyB) missing.push('MPESA_PARTY_B (or MPESA_SHORTCODE)');
  if (!config.callbackUrl) missing.push('MPESA_CALLBACK_URL (or APP_URL)');
  if (config.callbackUrl && !config.callbackUrl.startsWith('https://')) {
    missing.push('MPESA_CALLBACK_URL must be a public HTTPS URL');
  }
  return missing;
}

export function getPublicConfigStatus() {
  const missing = getMissingDarajaConfig();
  return {
    environment: config.env,
    businessShortCode: config.businessShortCode || null,
    transactionType: config.transactionType,
    hasConsumerKey: Boolean(config.consumerKey),
    hasConsumerSecret: Boolean(config.consumerSecret),
    hasPasskey: Boolean(config.passkey),
    hasCallbackUrl: Boolean(config.callbackUrl),
    missing,
    isReady: missing.length === 0,
  };
}
