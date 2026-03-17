export const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const PHONE_REGEX = /^\d{10}$/;
export const PIN_CODE_REGEX = /^\d{6}$/;
export const UPI_REGEX = /^[A-Za-z0-9._-]{2,}@[A-Za-z]{2,}$/;
export const CARD_NUMBER_REGEX = /^\d{16}$/;
export const CVV_REGEX = /^\d{3}$/;
export const CARDHOLDER_REGEX = /^[A-Za-z][A-Za-z\s]{1,49}$/;
export const NAME_REGEX = /^[A-Za-z][A-Za-z\s.'-]{1,99}$/;
export const CITY_REGEX = /^[A-Za-z][A-Za-z\s.'-]{1,99}$/;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{};:'",.<>/?\\|`~_\-+=]).{8,}$/;

export function trimValue(value) {
  return String(value || "").trim();
}

export function normalizePhone(value) {
  return String(value || "").replace(/\D/g, "");
}

export function isValidEmail(value) {
  return EMAIL_REGEX.test(trimValue(value));
}

export function isValidPhone(value) {
  return PHONE_REGEX.test(normalizePhone(value));
}

export function isValidPinCode(value) {
  return PIN_CODE_REGEX.test(trimValue(value));
}

export function isValidPassword(value) {
  return PASSWORD_REGEX.test(String(value || ""));
}

export function getPasswordChecks(value) {
  const password = String(value || "");

  return {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()[\]{};:'",.<>/?\\|`~_\-+=]/.test(password),
    isValid: isValidPassword(password),
  };
}

export function isValidName(value, minLength = 3) {
  const trimmed = trimValue(value);
  return trimmed.length >= minLength && NAME_REGEX.test(trimmed);
}

export function isValidCity(value) {
  return CITY_REGEX.test(trimValue(value));
}

export function isValidUpi(value) {
  return UPI_REGEX.test(trimValue(value));
}

export function formatCardNumber(value) {
  const digits = String(value || "")
    .replace(/\D/g, "")
    .slice(0, 16);
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(" ") : digits;
}

export function isValidCardNumber(value) {
  return CARD_NUMBER_REGEX.test(String(value || "").replace(/\D/g, ""));
}

export function formatExpiryDate(value) {
  const digits = String(value || "")
    .replace(/\D/g, "")
    .slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function isValidExpiryDate(value) {
  const trimmed = trimValue(value);
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(trimmed);

  if (!match) {
    return false;
  }

  const month = Number(match[1]);
  const year = Number(`20${match[2]}`);
  const expiry = new Date(year, month, 0, 23, 59, 59, 999);

  return expiry >= new Date();
}

export function isValidCardholderName(value) {
  return CARDHOLDER_REGEX.test(trimValue(value));
}

export function isValidCvv(value) {
  return CVV_REGEX.test(String(value || ""));
}
