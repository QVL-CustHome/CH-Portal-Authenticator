// Client API du portail - tous les appels passent par le Gateway via /api/auth/*
// (route /api/auth du Gateway, strip_prefix vers CH-Api-Authenticator).
// Les tokens sont poses en cookies HttpOnly (ch_token / ch_refresh) par l'Authenticator :
// le front ne manipule jamais de token directement.

export interface Me {
  user_id: string;
  email: string;
  roles: Record<string, string>;
  whitelist_only: boolean;
  created_at: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/auth${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    ...init,
  });
  if (!res.ok) {
    let message = `Erreur ${res.status}`;
    try {
      const body = await res.json();
      if (typeof body?.error === "string") message = body.error;
      else if (typeof body?.message === "string") message = body.message;
    } catch {
      // corps non JSON : on garde le message generique
    }
    throw new ApiError(res.status, message);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export function login(email: string, password: string) {
  return request<unknown>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(email: string, password: string) {
  return request<unknown>("/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function forgotPassword(email: string) {
  return request<unknown>("/password/forgot", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(token: string, newPassword: string) {
  return request<unknown>("/password/reset", {
    method: "POST",
    body: JSON.stringify({ token, new_password: newPassword }),
  });
}

export function getMe() {
  return request<Me>("/me");
}

export function logout() {
  return request<unknown>("/logout", { method: "POST" });
}
