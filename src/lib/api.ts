import axios from "axios";

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth tokens, logging, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
        {
          data: config.data,
          params: config.params,
        }
      );
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        {
          status: response.status,
          data: response.data,
        }
      );
    }

    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      console.error(
        `❌ API Error: ${error.config?.method?.toUpperCase()} ${
          error.config?.url
        }`,
        {
          status,
          data,
        }
      );

      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - clear auth token and redirect to login
          if (typeof window !== "undefined") {
            localStorage.removeItem("authToken");
            window.location.href = "/login";
          }
          break;
        case 403:
          console.error("Access forbidden");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Internal server error");
          break;
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request);
    } else {
      // Something else happened
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

interface HoroscopeFilters {
  date?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface CreateHoroscopeData {
  level: number;
  description: string;
  note?: string;
}

type UpdateHoroscopeData = Partial<CreateHoroscopeData>;

export const horoscopeAPI = {
  // Get all horoscopes with optional filters
  getAll: (params?: HoroscopeFilters) => {
    return apiClient.get("/api/horoscopes", { params });
  },

  // Get single horoscope by ID
  getById: (id: number) => {
    return apiClient.get(`/api/horoscope/${id}`);
  },

  // Get random horoscope
  getRandom: (excludeId?: number) => {
    if (excludeId) {
      return apiClient.get(`/api/horoscope/random?${excludeId}`);
    }
    return apiClient.get("/api/horoscope/random");
  },

  // Create new horoscope
  create: (data: CreateHoroscopeData) => {
    return apiClient.post("/api/horoscope", data);
  },

  // Update horoscope
  update: (id: number, data: UpdateHoroscopeData) => {
    return apiClient.put(`/api/horoscope/${id}`, data);
  },

  // Delete horoscope
  delete: (id: number) => {
    return apiClient.delete(`/api/horoscope/${id}`);
  },

  login: (username: string, password: string) => {
    return apiClient.post("/api/login", {
      email: username,
      password: password,
    });
  },

  logout: () => {
    return apiClient.post("/api/logout");
  },
};

// Generic API functions
export const api = {
  // GET request
  get: (url: string, params?: Record<string, unknown>) => {
    return apiClient.get(url, { params });
  },

  // POST request
  post: (url: string, data?: Record<string, unknown>) => {
    return apiClient.post(url, data);
  },

  // PUT request
  put: (url: string, data?: Record<string, unknown>) => {
    return apiClient.put(url, data);
  },

  // DELETE request
  delete: (url: string) => {
    return apiClient.delete(url);
  },

  // PATCH request
  patch: (url: string, data?: Record<string, unknown>) => {
    return apiClient.patch(url, data);
  },
};

export default apiClient;
