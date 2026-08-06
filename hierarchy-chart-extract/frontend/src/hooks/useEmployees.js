import { useQuery } from "@tanstack/react-query";
import { dummyEmployees } from "../data/dummy/employees";

// Set to true to run in self-contained mock data mode
// Set to false to connect to the Laravel backend API
const USE_DUMMY = true;

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      if (USE_DUMMY) {
        return Promise.resolve([...dummyEmployees]);
      }
      
      // Laravel API Endpoint integration (GET /api/employees)
      const token = localStorage.getItem('token');
      const response = await fetch('/api/employees', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch employees from API');
      }
      
      const rawData = await response.json();
      return Array.isArray(rawData) ? rawData : (rawData?.data || []);
    }
  });
}
