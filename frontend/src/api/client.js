const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

/**
 * Standard fetch API wrapper with auth header injection and uniform error handling
 */
export async function apiClient(endpoint, { body, ...customConfig } = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token') || 'dummy-gov-jwt-token'}`
  };

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Request Failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    throw error;
  }
}
