const API_BASE_URL = 'http://localhost:5001/api';

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token in localStorage
const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Helper function to remove auth token from localStorage
const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  register: async (userData: { name: string; email: string; password: string }) => {
    const response = await apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  logout: () => {
    removeAuthToken();
  },

  getProfile: async () => {
    return await apiRequest('/profile');
  },

  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },

  getToken: getAuthToken,
};

// Products API calls
export const productsAPI = {
  getAll: async () => {
    return await apiRequest('/products');
  },

  create: async (productData: {
    name: string;
    category: string;
    sku: string;
    stock: number;
    price: number;
    cost: number;
    supplier?: string;
  }) => {
    return await apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  update: async (id: number, productData: {
    name: string;
    category: string;
    sku: string;
    stock: number;
    price: number;
    cost: number;
    supplier?: string;
    status?: string;
  }) => {
    return await apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  delete: async (id: number) => {
    return await apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  uploadCSV: async (file: File) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload-csv`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('CSV upload failed:', error);
      throw error;
    }
  },
};

// Customers API calls
export const customersAPI = {
  getAll: async () => {
    return await apiRequest('/customers');
  },

  create: async (customerData: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  }) => {
    return await apiRequest('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  },
};

// Export utility functions
export { getAuthToken, setAuthToken, removeAuthToken }; 