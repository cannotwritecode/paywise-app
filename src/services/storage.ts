// src/services/storage.ts
import localforage from "localforage";

localforage.config({
  name: "paywise",
  storeName: "keyvalue",
});

export async function setItem<T = any>(k: string, v: T) {
  return localforage.setItem(k, v);
}
export async function getItem<T = any>(k: string): Promise<T | null> {
  const v = await localforage.getItem(k);
  return v ?? null;
}
export async function removeItem(k: string) {
  return localforage.removeItem(k);
}

// auth helpers
const AUTH_TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
export async function setAuthToken(token: string, refreshToken?: string) {
  await setItem(AUTH_TOKEN_KEY, token);
  if (refreshToken) await setItem(REFRESH_TOKEN_KEY, refreshToken);
}
export async function getAuthToken() {
  return getItem<string>(AUTH_TOKEN_KEY);
}
export async function getRefreshToken() {
  return getItem<string>(REFRESH_TOKEN_KEY);
}
export async function clearAuthTokens() {
  await removeItem(AUTH_TOKEN_KEY);
  await removeItem(REFRESH_TOKEN_KEY);
}
