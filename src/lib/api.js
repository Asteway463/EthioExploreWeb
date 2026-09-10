const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://ethioexploreweb.onrender.com";

async function request(endpoint, options = {}) {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message || `Request failed with status ${response.status}`
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

export const api = {
  get: (endpoint, options = {}) =>
    request(endpoint, { method: "GET", ...options }),

  post: (endpoint, body, options = {}) =>
    request(endpoint, { method: "POST", body, ...options }),

  put: (endpoint, body, options = {}) =>
    request(endpoint, { method: "PUT", body, ...options }),

  delete: (endpoint, options = {}) =>
    request(endpoint, { method: "DELETE", ...options }),
};

export default api;