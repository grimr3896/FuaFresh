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

const env = (process.env.MPESA_ENV || 'sandbox').toLowerCase() === 'production' ? 'production' : 'sandbox';
const apiBaseUrl = env === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

const appUrl = (process.env.APP_URL || '').replace(/\/$/, '');
const customCallback = (process.env.MPESA_CALLBACK_URL || '').trim();
const defaultCallback = appUrl ? `${appUrl}/api/mpesa/callback` : 'https://sandbox.safaricom.co.ke/mpesa/stkpush/callback';

export const config: DarajaConfig = {
  env,
  // Default sandbox Consumer Key supplied in specification
  consumerKey: process.env.MPESA_CONSUMER_KEY || 'HieidBRu3Ux4aG4ozA0p3gWVcsQRiP0R9HmXabzPGW2tZRBj',
  // Read secrets from server-side environment variables or provided sandbox credentials
  consumerSecret: process.env.MPESA_CONSUMER_SECRET || 'wqypArkTXVo81ZbGHfR2AYMiEHvgVdSnHN0IYXnVJxk5ydwpele0R3V8Wqi0E0J3',
  passkey: process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
  businessShortCode: process.env.MPESA_BUSINESS_SHORTCODE || '174379',
  transactionType: process.env.MPESA_TRANSACTION_TYPE || 'CustomerPayBillOnline',
  partyB: process.env.MPESA_PARTY_B || '174379',
  callbackUrl: customCallback || defaultCallback,
  apiBaseUrl,
  oauthEndpoint: `${apiBaseUrl}/oauth/v1/generate?grant_type=client_credentials`,
  stkPushEndpoint: `${apiBaseUrl}/mpesa/stkpush/v1/processrequest`,
  stkQueryEndpoint: `${apiBaseUrl}/mpesa/stkpushquery/v1/query`,
  port: parseInt(process.env.PORT || '3000', 10),
};

export function getPublicConfigStatus() {
  return {
    environment: config.env,
    businessShortCode: config.businessShortCode,
    transactionType: config.transactionType,
    hasConsumerKey: Boolean(config.consumerKey),
    hasConsumerSecret: Boolean(config.consumerSecret),
    hasPasskey: Boolean(config.passkey),
    callbackUrl: config.callbackUrl,
    isReady: Boolean(config.consumerKey && config.consumerSecret && config.passkey),
  };
}
