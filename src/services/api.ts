
import { Complaint, Agency, ApiError } from "../types";

const API_URL = "https://report-it-backend.onrender.com/api";

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData
    });
    throw new Error(`API Error (${response.status}): ${errorData.message || errorData.error || 'Unknown error'}`);
  }
  
  // For 204 responses (no content)
  if (response.status === 204) {
    return {} as T;
  }
  
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to parse response:', error);
    throw new Error('Failed to parse API response');
  }
}

// Complaint API functions
export const complaintsApi = {
  getAll: async (): Promise<Complaint[]> => {
    const response = await fetch(`${API_URL}/complaints`);
    return handleResponse<Complaint[]>(response);
  },
  
  getById: async (id: number): Promise<Complaint> => {
    const response = await fetch(`${API_URL}/complaints/${id}`);
    return handleResponse<Complaint>(response);
  },
  
  create: async (complaint: Omit<Complaint, 'id'>): Promise<Complaint> => {
    const response = await fetch(`${API_URL}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(complaint)
    });
    return handleResponse<Complaint>(response);
  },
  
  update: async (id: number, complaint: Partial<Complaint>): Promise<Complaint> => {
    const response = await fetch(`${API_URL}/complaints/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(complaint)
    });
    return handleResponse<Complaint>(response);
  },
  
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/complaints/${id}`, {
      method: 'DELETE'
    });
    return handleResponse<void>(response);
  }
};

// Agency API functions
export const agenciesApi = {
  getAll: async (): Promise<Agency[]> => {
    const response = await fetch(`${API_URL}/agencies`);
    return handleResponse<Agency[]>(response);
  },
  
  getById: async (id: number): Promise<Agency> => {
    const response = await fetch(`${API_URL}/agencies/${id}`);
    return handleResponse<Agency>(response);
  },
  
  create: async (agency: Omit<Agency, 'id'>): Promise<Agency> => {
    const response = await fetch(`${API_URL}/agencies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agency)
    });
    return handleResponse<Agency>(response);
  },
  
  update: async (id: number, agency: Partial<Agency>): Promise<Agency> => {
    const response = await fetch(`${API_URL}/agencies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agency)
    });
    return handleResponse<Agency>(response);
  },
  
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/agencies/${id}`, {
      method: 'DELETE'
    });
    return handleResponse<void>(response);
  }
};
