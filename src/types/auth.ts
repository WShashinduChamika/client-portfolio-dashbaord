// ---------------------------------------------------------------------------
// API wrapper types
// ---------------------------------------------------------------------------

/** Standard envelope returned by every backend endpoint */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

// ---------------------------------------------------------------------------
// User entity
// ---------------------------------------------------------------------------

export interface User {
  _id: string;
  name: string;
  email: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ---------------------------------------------------------------------------
// Auth payloads (request bodies)
// ---------------------------------------------------------------------------

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

// ---------------------------------------------------------------------------
// Auth response shapes (inside ApiResponse.data)
// ---------------------------------------------------------------------------

export interface AuthData {
  user: User;
  /** Short-lived JWT access token (15 min by default) */
  token: string;
  /** Long-lived refresh token returned in body — stored as cookie by the client */
  refreshToken?: string;
}
