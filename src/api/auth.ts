import { ApiError, createApiClient } from "canopui";

export { ApiError };

export interface Me {
  user_id: string;
  name: string;
  email: string;
  roles: string[];
  whitelist_only: boolean;
  created_at: string;
}

const client = createApiClient({ basePath: "/api/auth" });
const request = client.request;

export function login(email: string, password: string) {
  return request<unknown>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(
  name: string,
  email: string,
  password: string,
  acceptedTermsVersion: string
) {
  return request<unknown>("/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
      accepted_terms_version: acceptedTermsVersion,
    }),
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

export interface RegistrationSetting {
  enabled: boolean;
}

export function getRegistrationEnabled() {
  return request<RegistrationSetting>("/settings/registration");
}

export function getMe() {
  return request<Me>("/me");
}

export function logout() {
  return request<unknown>("/logout", { method: "POST" });
}
