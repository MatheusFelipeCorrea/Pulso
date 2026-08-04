/** Bandeiras via flagcdn.com (ISO 3166-1 alpha-2). */

export function getCountryFlagUrl(countryCode) {
  const code = String(countryCode ?? '').trim().toLowerCase()
  if (!/^[a-z]{2}$/.test(code)) return null
  return `https://flagcdn.com/w320/${code}.png`
}

/** Moeda → país principal (para fallback de bandeira). */
export const CURRENCY_COUNTRY_CODE = {
  AED: 'AE',
  ARS: 'AR',
  AUD: 'AU',
  BOB: 'BO',
  BRL: 'BR',
  CAD: 'CA',
  CHF: 'CH',
  CLP: 'CL',
  CNY: 'CN',
  COP: 'CO',
  CZK: 'CZ',
  DKK: 'DK',
  EGP: 'EG',
  EUR: 'EU',
  GBP: 'GB',
  HKD: 'HK',
  HUF: 'HU',
  IDR: 'ID',
  ILS: 'IL',
  INR: 'IN',
  JPY: 'JP',
  KRW: 'KR',
  MAD: 'MA',
  MXN: 'MX',
  MYR: 'MY',
  NOK: 'NO',
  NZD: 'NZ',
  PEN: 'PE',
  PHP: 'PH',
  PLN: 'PL',
  PYG: 'PY',
  RUB: 'RU',
  SEK: 'SE',
  SGD: 'SG',
  THB: 'TH',
  TRY: 'TR',
  TWD: 'TW',
  USD: 'US',
  UYU: 'UY',
  VND: 'VN',
  ZAR: 'ZA',
}
