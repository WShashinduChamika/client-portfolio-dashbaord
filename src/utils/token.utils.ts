/**
 * Token utilities
 *
 * Access token  → stored in localStorage (cleared on tab close via sessionStorage
 *                 variant is also fine; localStorage persists across tabs).
 * Refresh token → stored as a client-side cookie named "refreshToken".
 *                 The Express backend reads it from req.cookies.refreshToken.
 *                 Cookie is set with SameSite=Lax, not HttpOnly (JS must write it),
 *                 but guarded by CORS + credentials.
 */

import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "admin_access_token";
const REFRESH_TOKEN_COOKIE = "refreshToken"; // must match backend req.cookies.refreshToken

// ---------------------------------------------------------------------------
// Access token helpers
// ---------------------------------------------------------------------------

/** Returns the stored access token or null. */
export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/** Persists the access token. */
export const setAccessToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

/** Removes the access token from storage. */
export const removeAccessToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

// ---------------------------------------------------------------------------
// Refresh token helpers (cookie — sent automatically with withCredentials)
// ---------------------------------------------------------------------------

/** Returns the refresh token cookie or undefined. */
export const getRefreshToken = (): string | undefined => {
  return Cookies.get(REFRESH_TOKEN_COOKIE);
};

/**
 * Stores the refresh token as a cookie.
 * Expires in 7 days to match the default backend setting.
 */
export const setRefreshToken = (token: string): void => {
  Cookies.set(REFRESH_TOKEN_COOKIE, token, {
    expires: 7,       // days
    sameSite: "Lax",  // protects against CSRF while allowing normal navigation
    secure: process.env.NODE_ENV === "production",
  });
};

/** Removes the refresh token cookie. */
export const removeRefreshToken = (): void => {
  Cookies.remove(REFRESH_TOKEN_COOKIE);
};

// ---------------------------------------------------------------------------
// Combined helper
// ---------------------------------------------------------------------------

/** Clears both tokens — call on logout or auth failure. */
export const clearTokens = (): void => {
  removeAccessToken();
  removeRefreshToken();
};
