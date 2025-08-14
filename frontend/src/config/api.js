// API Configuration
// Automatically detect if we're running on localhost or network IP
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  
  // If accessing via network IP, use network IP for API calls
  if (hostname === '192.168.1.17') {
    return 'http://192.168.1.17:3000/api';
  }
  
  // Default to localhost for local development
  return 'http://localhost:3000/api';
};

const getSocketUrl = () => {
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
