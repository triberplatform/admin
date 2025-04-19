// /app/lib/server-api.ts
import axios, { AxiosRequestConfig } from 'axios';

// Server-side API client for making backend requests
export async function serverFetch<T = any>(
  endpoint: string,
  options: AxiosRequestConfig = {},
  authToken?: string
): Promise<T> {
  // Create request config with backend URL
  const config: AxiosRequestConfig = {
    url: `${process.env.BACKEND_URL}${endpoint}`,
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
  
  // Ensure headers exist
  if (!config.headers) {
    config.headers = {};
  }

  // If auth token is provided directly, use it
  if (authToken) {
    config.headers['Authorization'] = `Bearer ${authToken}`; // Ensure Bearer prefix
    console.log(`[ServerFetch] Using provided auth token for ${endpoint}`);
  }
  
  // If auth token is in the options.headers, preserve it
  else if (options.headers?.Authorization) {
    // Make sure Bearer prefix is present
    if (!String(options.headers.Authorization).startsWith('Bearer ')) {
      config.headers['Authorization'] = `Bearer ${options.headers.Authorization}`;
    }
    console.log(`[ServerFetch] Using headers.Authorization for ${endpoint}`);
  }
  
  // No token available
  else {
    console.log(`[ServerFetch] No auth token available for ${endpoint}`);
  }
  
  try {
    console.log(`[ServerFetch] Calling ${endpoint} with method ${config.method || 'GET'}`);
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`[ServerFetch] Error calling ${endpoint}:`,
        error.response?.status,
        error.response?.data || error.message
      );
      
      // Structured error response
      throw {
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Server error',
        data: error.response?.data,
      };
    }
    
    console.error(`[ServerFetch] Unknown error calling ${endpoint}:`, error);
    throw {
      status: 500,
      message: 'Unknown server error',
    };
  }
}