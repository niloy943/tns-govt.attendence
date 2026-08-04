import { apiClient } from '../client';

export async function fetchSettings() {
  return await apiClient('/settings');
}

export async function updateSettings(settingsData) {
  return await apiClient('/settings', { method: 'PUT', body: settingsData });
}
