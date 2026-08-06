const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

/**
 * Standard fetch API wrapper with auth header injection, query param
 * serialisation, and uniform error handling.
 *
 * Usage:
 *   apiClient('/employees')                          // GET
 *   apiClient('/employees', { body: { name: '…' } }) // POST (auto-detected)
 *   apiClient('/employees', { method: 'PUT', body: { … } })
 *   apiClient('/employees', { params: { search: 'x', status: 'active' } })
 */
export async function apiClient(endpoint, { body, params, ...customConfig } = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
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

  // Build URL with query params
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const cleanParams = {};
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        cleanParams[key] = val;
      }
    });
    const queryString = new URLSearchParams(cleanParams).toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  try {
    const response = await fetch(url, config);

    // Auto-logout on 401 Unauthorized
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if we're not already on the login page
      if (!window.location.hash.includes('/login')) {
        window.location.hash = '/login';
      }
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || `API request failed (${response.status})`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // Handle 204 No Content (e.g. DELETE responses)
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`[API Error] ${config.method} ${endpoint}:`, error);
    throw error;
  }
}
