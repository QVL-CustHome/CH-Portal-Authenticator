export interface Me {
  user_id: string;
  name: string;
  email: string;
  roles: string[];
  whitelist_only: boolean;
  created_at: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
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
    let code: string | undefined;
    try {
      const body = await res.json();
      if (typeof body?.error === "string") code = body.error;
      if (typeof body?.message === "string") message = body.message;
      else if (code) message = code;
    } catch {

    }
    throw new ApiError(res.status, message, code);
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

export function register(name: string, email: string, password: string) {
  return request<unknown>("/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
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
