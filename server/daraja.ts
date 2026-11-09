import { config, getMissingDarajaConfig } from './config';

interface OAuthTokenCache {
  accessToken: string;
  expiresAt: number;
}

let cachedToken: OAuthTokenCache | null = null;

async function readDarajaResponse(response: Response, operation: string): Promise<any> {
  const raw = await response.text();
  let data: any;
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    const preview = raw.replace(/\s+/g, ' ').slice(0, 240);
    throw new Error(`${operation} returned non-JSON content (HTTP ${response.status}, ${response.headers.get('content-type') || 'unknown content type'}): ${preview || 'empty response'}`);
  }

  if (!response.ok) {
    const message = data.errorMessage || data.error_description || data.ResponseDescription || data.message || response.statusText;
    throw new Error(`${operation} failed (HTTP ${response.status}): ${message}`);
  }
  return data;
}

/** Normalize a Kenyan mobile number to Daraja's 254XXXXXXXXX format. */
export function formatPhoneNumber(input: string): string {
  const cleaned = input.replace(/\D/g, '');
  if (/^254(7|1)\d{8}$/.test(cleaned)) return cleaned;
  if (/^0(7|1)\d{8}$/.test(cleaned)) return '254' + cleaned.slice(1);
  if (/^(7|1)\d{8}$/.test(cleaned)) return '254' + cleaned;
  throw new Error('Invalid Kenyan phone number. Enter 07XXXXXXXX, 01XXXXXXXX, or 254XXXXXXXXX.');
}

/** Daraja expects a timestamp in the Africa/Nairobi timezone. */
export function getDarajaTimestamp(): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Nairobi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const value = (type: string) => parts.find((part) => part.type === type)?.value || '';
  return `${value('year')}${value('month')}${value('day')}${value('hour')}${value('minute')}${value('second')}`;
}

export function generateDarajaPassword(shortCode: string, passkey: string, timestamp: string): string {
  return Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');
}

export async function getDarajaOAuthToken(): Promise<string> {
  const missing = getMissingDarajaConfig();
  if (missing.length) {
    throw new Error(`MISSING_CREDENTIALS: Missing or invalid Daraja configuration: ${missing.join(', ')}`);
  }

  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.accessToken;
  }

  const authString = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString('base64');
  const response = await fetch(config.oauthEndpoint, {
    method: 'GET',
    headers: { Authorization: `Basic ${authString}` },
    signal: AbortSignal.timeout(15_000),
  });
  const data = await readDarajaResponse(response, 'Daraja OAuth');

  if (!data.access_token) {
    throw new Error('Daraja OAuth response did not contain an access token.');
  }

  const expiresIn = Number.parseInt(String(data.expires_in || '3599'), 10);
  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (Number.isFinite(expiresIn) ? expiresIn : 3599) * 1000,
  };
  return cachedToken.accessToken;
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

export async function initiateStkPush(params: StkPushParams): Promise<StkPushResponse> {
  const amount = Math.round(Number(params.amount));
  if (!Number.isFinite(amount) || amount < 1) {
    throw new Error('STK Push amount must be a positive whole number of Kenya shillings.');
  }

  const accessToken = await getDarajaOAuthToken();
  const formattedPhone = formatPhoneNumber(params.phoneNumber);
  const timestamp = getDarajaTimestamp();
  const password = generateDarajaPassword(config.businessShortCode, config.passkey, timestamp);
  const callbackUrl = params.callbackUrl || config.callbackUrl;

  if (!callbackUrl || !callbackUrl.startsWith('https://')) {
    throw new Error('A publicly accessible HTTPS MPESA_CALLBACK_URL is required.');
  }

  const payload = {
    BusinessShortCode: config.businessShortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: config.transactionType,
    Amount: amount,
    PartyA: formattedPhone,
    PartyB: config.partyB,
    PhoneNumber: formattedPhone,
    CallBackURL: callbackUrl,
    AccountReference: (params.accountReference || 'FuaFresh').slice(0, 12),
    TransactionDesc: (params.transactionDesc || `Order ${params.orderId}`).slice(0, 13),
  };

  const response = await fetch(config.stkPushEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20_000),
  });
  const data = await readDarajaResponse(response, 'Daraja STK Push');

  if (String(data.ResponseCode) !== '0') {
    throw new Error(data.errorMessage || data.ResponseDescription || 'Daraja rejected the STK Push request.');
  }
  if (!data.CheckoutRequestID || !data.MerchantRequestID) {
    throw new Error('Daraja accepted the request but returned incomplete request identifiers.');
  }

  return {
    merchantRequestId: data.MerchantRequestID,
    checkoutRequestId: data.CheckoutRequestID,
    responseCode: String(data.ResponseCode),
    responseDescription: data.ResponseDescription || '',
    customerMessage: data.CustomerMessage || 'Check your phone to complete the M-Pesa payment.',
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

export async function queryStkPush(checkoutRequestId: string): Promise<StkQueryResponse> {
  if (!checkoutRequestId) throw new Error('checkoutRequestId is required.');

  const accessToken = await getDarajaOAuthToken();
  const timestamp = getDarajaTimestamp();
  const password = generateDarajaPassword(config.businessShortCode, config.passkey, timestamp);
  const response = await fetch(config.stkQueryEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      BusinessShortCode: config.businessShortCode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    }),
    signal: AbortSignal.timeout(20_000),
  });
  const data = await readDarajaResponse(response, 'Daraja STK status query');

  return {
    responseCode: String(data.ResponseCode ?? ''),
    responseDescription: data.ResponseDescription || '',
    merchantRequestId: data.MerchantRequestID || '',
    checkoutRequestId: data.CheckoutRequestID || checkoutRequestId,
    resultCode: data.ResultCode === undefined || data.ResultCode === null ? '' : String(data.ResultCode),
    resultDesc: data.ResultDesc || '',
  };
}
