import { apiClient } from '../client';

export async function fetchMinistries() {
  const data = await apiClient('/ministries');
  // Normalize fields if backend uses snake_case
  return data.map(item => ({
    id: item.id,
    name: item.name || item.ministry_name,
    code: item.code || item.ministry_code,
    type: item.type || item.office_type || 'Directorate',
    city: item.city || item.location_city,
    address: item.address,
    employeeCount: item.employeeCount ?? item.employee_count ?? 0,
    headOfOffice: item.headOfOffice || item.head_of_office || null,
    status: item.status || 'active',
    contactEmail: item.contactEmail || item.contact_email,
    contactPhone: item.contactPhone || item.contact_phone
  }));
}

export async function fetchMinistryById(id) {
  return await apiClient(`/ministries/${id}`);
}

export async function createMinistry(ministryData) {
  return await apiClient('/ministries', { body: ministryData });
}

export async function updateMinistry(id, ministryData) {
  return await apiClient(`/ministries/${id}`, { method: 'PUT', body: ministryData });
}

export async function deleteMinistry(id) {
  return await apiClient(`/ministries/${id}`, { method: 'DELETE' });
}
