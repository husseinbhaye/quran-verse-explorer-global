
// Base API configuration and utilities
const BASE_URL = 'https://api.alquran.cloud/v1';

export const fetchFromAPI = async (endpoint: string) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`API fetch error: ${endpoint}`, error);
    throw error;
  }
};
