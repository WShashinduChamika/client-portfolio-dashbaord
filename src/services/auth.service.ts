/**
 * Auth service
 *
 * All auth-related API calls.  The axios instance handles token attachment and
 * the 401 → refresh → retry cycle automatically.
 *
 * Token persistence is handled here after each successful auth call so the
 * rest of the app never needs to think about it.
 */

import api from "@/lib/axios";
import { setAccessToken, setRefreshToken, clearTokens } from "@/utils/token.utils";
import type {
  ApiResponse,
  AuthData,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

/**
 * Authenticates the user and stores both tokens.
 * Returns the full auth data (user + tokens) on success.
 */
export const login = async (payload: LoginPayload): Promise<AuthData> => {
  const { data } = await api.post<ApiResponse<AuthData>>(
    "/api/users/login",
    payload
  );

  const { token, refreshToken } = data.data;

  setAccessToken(token);
  if (refreshToken) setRefreshToken(refreshToken);

  return data.data;
};

// ---------------------------------------------------------------------------
// Register
// ---------------------------------------------------------------------------

/**
 * Registers a new admin user and stores both tokens.
 */
export const register = async (payload: RegisterPayload): Promise<AuthData> => {
  const { data } = await api.post<ApiResponse<AuthData>>(
    "/api/users/register",
    payload
  );

  const { token, refreshToken } = data.data;

  setAccessToken(token);
  if (refreshToken) setRefreshToken(refreshToken);

  return data.data;
};

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------

/**
 * Clears all locally stored tokens.
 * Extend this to call a backend /logout endpoint if one is added later.
 */
export const logout = (): void => {
  clearTokens();
};
