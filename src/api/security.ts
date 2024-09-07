import * as CryptoJS from "crypto-js";

export function encryptSHA256(data: string): string {
  const hash = CryptoJS.SHA256(data);

  const hexHash = hash.toString(CryptoJS.enc.Hex);

  return hexHash;
}
