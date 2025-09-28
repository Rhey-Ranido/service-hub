// API Configuration
// Centralized configuration for all environments

const getApiBaseUrl = () => {
  // Check for environment variable first (for production deployments)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Check for Render backend URL
  if (import.meta.env.VITE_RENDER_BACKEND_URL) {
    return `${import.meta.env.VITE_RENDER_BACKEND_URL}/api`;
  }
  
  // Development environment detection
  const hostname = window.location.hostname;
  
  // If accessing via network IP, use network IP for API calls
  if (hostname === '192.168.1.17') {
    return 'http://192.168.1.17:3000/api';
  }
  
  // Default to localhost for local development
  return 'http://localhost:3000/api';
};

const getSocketUrl = () => {
  // Check for environment variable first (for production deployments)
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  
  // Check for Render backend URL
  if (import.meta.env.VITE_RENDER_BACKEND_URL) {
    return import.meta.env.VITE_RENDER_BACKEND_URL;
  }
  
  // Development environment detection
  const hostname = window.location.hostname;
  
  // If accessing via network IP, use network IP for socket connection
  if (hostname === '192.168.1.17') {
    return 'http://192.168.1.17:3000';
  }
  
  // Default to localhost for local development
  return 'http://localhost:3000';
};

export const API_BASE_URL = getApiBaseUrl();
export const SOCKET_URL = getSocketUrl();

// For debugging
console.log('🌐 API Base URL:', API_BASE_URL);
console.log('🔌 Socket URL:', SOCKET_URL);
console.log('🖥️ Current hostname:', window.location.hostname);
console.log('🔧 Environment:', import.meta.env.MODE);
