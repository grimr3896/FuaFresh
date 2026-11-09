import { config } from './config';

interface OAuthTokenCache {
  accessToken: string;
  expiresAt: number; // epoch ms
}

let cachedToken: OAuthTokenCache | null = null;

/**
 * Validates and normalizes any Kenyan phone number to the Daraja 254XXXXXXXXX standard (12 digits).
 */
export function formatPhoneNumber(input: string): string {
  const cleaned = input.replace(/\D/g, '');

  if (/^254(7|1)\d{8}$/.test(cleaned)) {
    return cleaned;
  }
  if (/^0(7|1)\d{8}$/.test(cleaned)) {
    return '254' + cleaned.slice(1);
  }
  if (/^(7|1)\d{8}$/.test(cleaned)) {
    return '254' + cleaned;
  }

  throw new Error(`Invalid Kenyan phone number format "${input}". Expected 07XXXXXXXX or 01XXXXXXXX.`);
}

/**
 * Generates the 14-digit timestamp YYYYMMDDHHmmss required by Daraja.
 */
export function getDarajaTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

/**
 * Generates Daraja STK Push base64 password from Shortcode, Passkey, and Timestamp.
 */
export function generateDarajaPassword(shortCode: string, passkey: string, timestamp: string): string {
  return Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');
}

/**
 * Obtains an OAuth access token from Safaricom Daraja using Consumer Key and Consumer Secret.
 */
export async function getDarajaOAuthToken(): Promise<string> {
  if (!config.consumerKey || !config.consumerSecret) {
    throw new Error('MISSING_CREDENTIALS: MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET is not configured.');
  }

  // Return cached token if valid with 60s buffer
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) {
    return cachedToken.accessToken;
  }

  const authString = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString('base64');

  const response = await fetch(config.oauthEndpoint, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${authString}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Daraja OAuth authentication failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const expiresIn = parseInt(data.expires_in || '3599', 10);

  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + expiresIn * 1000,
  };

  return data.access_token;
}

export interface StkPushParams {
  amount: number;
  phoneNumber: string;
  orderId: string;
  accountReference?: string;
  transactionDesc?: string;
  callbackUrl?: string;
}

export interface StkPushResponse {
  merchantRequestId: string;
  checkoutRequestId: string;
  responseCode: string;
  responseDescription: string;
  customerMessage: string;
}

/**
 * Initiates an M-Pesa Express (STK Push) transaction via Safaricom Daraja.
 */
export async function initiateStkPush(params: StkPushParams): Promise<StkPushResponse> {
  if (!config.consumerKey) {
    throw new Error('MISSING_CREDENTIALS: MPESA_CONSUMER_KEY is missing.');
  }
  if (!config.consumerSecret) {
    throw new Error('MISSING_CREDENTIALS: MPESA_CONSUMER_SECRET is missing. Please set it in server secrets.');
  }
  if (!config.passkey) {
    throw new Error('MISSING_CREDENTIALS: MPESA_PASSKEY is missing. Please set it in server secrets.');
  }

  const accessToken = await getDarajaOAuthToken();
  const formattedPhone = formatPhoneNumber(params.phoneNumber);
  const timestamp = getDarajaTimestamp();
  const password = generateDarajaPassword(config.businessShortCode, config.passkey, timestamp);

  const callbackUrl = params.callbackUrl || config.callbackUrl;

  const payload = {
    BusinessShortCode: config.businessShortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: config.transactionType,
    Amount: Math.round(params.amount),
    PartyA: formattedPhone,
    PartyB: config.partyB,
    PhoneNumber: formattedPhone,
    CallBackURL: callbackUrl,
    AccountReference: params.accountReference || 'FuaFresh',
    TransactionDesc: params.transactionDesc || `Order ${params.orderId}`,
  };

  const response = await fetch(config.stkPushEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responseData = await response.json();

  if (!response.ok || responseData.ResponseCode !== '0') {
    const errorMsg = responseData.errorMessage || responseData.ResponseDescription || 'STK Push request rejected by Daraja';
    throw new Error(`Daraja STK Push Error: ${errorMsg}`);
  }

  return {
    merchantRequestId: responseData.MerchantRequestID,
    checkoutRequestId: responseData.CheckoutRequestID,
    responseCode: responseData.ResponseCode,
    responseDescription: responseData.ResponseDescription,
    customerMessage: responseData.CustomerMessage,
  };
}

export interface StkQueryResponse {
  responseCode: string;
  responseDescription: string;
  merchantRequestId: string;
  checkoutRequestId: string;
  resultCode: string;
  resultDesc: string;
}

/**
 * Actively queries Daraja STK Push status in case callback is delayed or in sandbox mode.
 */
export async function queryStkPush(checkoutRequestId: string): Promise<StkQueryResponse> {
  if (!config.consumerKey || !config.consumerSecret || !config.passkey) {
    throw new Error('MISSING_CREDENTIALS: Daraja credentials not fully configured.');
  }

  const accessToken = await getDarajaOAuthToken();
  const timestamp = getDarajaTimestamp();
  const password = generateDarajaPassword(config.businessShortCode, config.passkey, timestamp);

  const payload = {
    BusinessShortCode: config.businessShortCode,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestId,
  };

  const response = await fetch(config.stkQueryEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  return {
    responseCode: data.ResponseCode || '',
    responseDescription: data.ResponseDescription || '',
    merchantRequestId: data.MerchantRequestID || '',
    checkoutRequestId: data.CheckoutRequestID || '',
    resultCode: String(data.ResultCode ?? ''),
    resultDesc: data.ResultDesc || '',
  };
}
