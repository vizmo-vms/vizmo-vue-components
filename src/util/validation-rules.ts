import { isValidPhoneNumber, CountryCode } from 'libphonenumber-js/mobile';
export function isRequired(val: unknown) {
  if (!val) return 'Required';
  return true;
}

export function isPhone(val: string, countryCode: CountryCode) {
  if (!isValidPhoneNumber(val, countryCode)) return 'Phone is invalid';
  return true;
}
