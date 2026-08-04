import { apiClient } from "../client";

export function loginUser(email, password) {
  return apiClient("/auth/login", {
    method: "POST",
    body: { email, password }
  });
}

export function logoutUser() {
  return apiClient("/auth/logout", {
    method: "POST"
  });
}

export function getMe() {
  return apiClient("/auth/me");
}
