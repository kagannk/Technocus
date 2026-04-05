const API_URL = typeof window === "undefined" 
  ? (process.env.DOCKER_API_URL || "http://technocus_backend:8000")
  : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000");

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
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
    const errorText = await res.text();
    console.error(`API Error [${res.status}] ${endpoint}:`, errorText);
    throw new Error(errorText);
  }

  return res.json();
};
