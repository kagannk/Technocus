export const getStorageItem = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key) || sessionStorage.getItem(key);
};

export const setStorageItem = (key: string, value: string, remember: boolean = true) => {
  if (typeof window === "undefined") return;
  if (remember) {
    localStorage.setItem(key, value);
    sessionStorage.removeItem(key); // Clean up from other storage to prevent confusion
  } else {
    sessionStorage.setItem(key, value);
    localStorage.removeItem(key); // Clean up from other storage to prevent confusion
  }
};

export const removeStorageItem = (key: string) => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
};

export const clearStorage = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user_name");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("user_name");
};
