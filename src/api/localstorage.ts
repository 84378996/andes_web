import { tokenKey, userKey } from "@/settings";
export function getStoredToken() {
  // return "12345678910";
  return localStorage.getItem(tokenKey);
}

export function setStoredToken(value: string) {
  localStorage.setItem(tokenKey, value);
}

export function removeStoredToken() {
  localStorage.removeItem(tokenKey);
}

export function getStoredUserKey() {
  return localStorage.getItem(userKey);
}

export function setStoredUserKey(value: string) {
  localStorage.setItem(userKey, value);
}

export function removeStoredUserKey() {
  localStorage.removeItem(userKey);
}
