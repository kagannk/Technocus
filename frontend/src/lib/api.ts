import { getStorageItem, clearStorage } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getStorageItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  } as Record<string, string>;

  const isAuthEndpoint = endpoint.match(/\/auth\/(login|register)($|\?)/);

  if (token && !isAuthEndpoint) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401 && !isAuthEndpoint && typeof window !== "undefined") {
      clearStorage();
      const isAdminPage = window.location.pathname.startsWith("/admin");
      window.location.href = isAdminPage ? "/admin/login" : "/login";
      return;
    }
    const errorText = await res.text();
    console.error(`API Error [${res.status}] ${endpoint}:`, errorText);
    
    let errorMessage = errorText;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed && typeof parsed === "object") {
        if (typeof parsed.detail === "string") {
          errorMessage = parsed.detail;
        } else if (typeof parsed.detail === "object" && parsed.detail !== null) {
          errorMessage = JSON.stringify(parsed.detail);
        } else if (parsed.message) {
          errorMessage = parsed.message;
        }
      }
    } catch (e) {
      // not JSON
    }
    throw new Error(errorMessage);
  }

  return res.json();
};
