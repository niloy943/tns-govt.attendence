import { apiClient } from '../client';

/**
 * GET /api/salary/settings
 * Fetches global salary_settings database record (working_days, pf_percentage, tax_percentage, etc.)
 */
export async function fetchSalarySettings() {
  return await apiClient('/salary/settings');
}

/**
 * PUT /api/salary/settings
 * Updates global salary_settings configuration schema record
 */
export async function updateSalarySettings(settingsData) {
  return await apiClient('/salary/settings', { 
    method: 'PUT', 
    body: settingsData 
  });
}
