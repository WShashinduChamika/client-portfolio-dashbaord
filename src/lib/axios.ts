/**
 * Axios instance with auth interceptors
 *
 * Request interceptor  → attaches the Bearer access token on every request.
 * Response interceptor → on 401, attempts a silent token refresh then retries the
 *                        original request.  If the refresh also fails the user is
 *                        redirected to /login.
 *
 * The refresh token is stored in a cookie ("refreshToken").  Because the axios
 * instance is created with `withCredentials: true`, the browser sends that cookie
 * automatically on every request — including the refresh call itself.
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "@/utils/token.utils";
import type { ApiResponse, AuthData } from "@/types/auth";

// ---------------------------------------------------------------------------
// Base instance
// ---------------------------------------------------------------------------

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // sends the refreshToken cookie on every request
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------------------------------------------------------------------
// Request interceptor — attach access token
// ---------------------------------------------------------------------------

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ---------------------------------------------------------------------------
// Response interceptor — silent token refresh on 401
// ---------------------------------------------------------------------------

/**
 * Queues requests that arrive while a token refresh is in flight, then
 * resolves or rejects them once the refresh completes.
 */
type QueueItem = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error);
    } else {
      item.resolve(token as string);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only attempt refresh on 401 and only once per request
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      });
    }

    // Mark this request so it won't loop back here on a second 401
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      /**
       * Call the refresh endpoint.
       * The refresh token cookie is sent automatically (withCredentials).
       * The backend returns a new access token and a rotated refresh token.
       */
      const { data } = await axios.post<ApiResponse<AuthData>>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/refresh`,
        {},
        { withCredentials: true }
      );

      const newAccessToken = data.data.token;
      const newRefreshToken = data.data.refreshToken;

      // Persist the new tokens
      setAccessToken(newAccessToken);
      if (newRefreshToken) setRefreshToken(newRefreshToken);

      // Flush the waiting queue with the new access token
      processQueue(null, newAccessToken);

      // Retry the original request with the refreshed access token
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed — clear all tokens and send every waiting request to the rejection path
      processQueue(refreshError, null);
      clearTokens();

      // Redirect to login (only in browser context)
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
