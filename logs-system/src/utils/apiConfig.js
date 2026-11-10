/**
 * API Configuration with Server Switcher
 * Allows switching between localhost and Railway production server
 */

// Server configurations
export const SERVERS = {
  LOCALHOST: {
    name: 'Localhost',
    url: 'http://127.0.0.1:8000/api',
    icon: '🖥️',
    color: 'blue',
  },
  RAILWAY: {
    name: 'Railway (Production)',
    url: 'https://logs-server-system-production.up.railway.app/api',
    icon: '🚂',
    color: 'green',
  },
};

// Storage key for active server
const ACTIVE_SERVER_KEY = 'active_api_server';

/**
 * Get the currently active server
 * @returns {string} 'LOCALHOST' or 'RAILWAY'
 */
export const getActiveServer = () => {
  const saved = localStorage.getItem(ACTIVE_SERVER_KEY);
  
  // Default based on environment or saved preference
  if (saved && SERVERS[saved]) {
    return saved;
  }
  
  // Default to LOCALHOST for development
  return import.meta.env.MODE === 'development' ? 'LOCALHOST' : 'RAILWAY';
};

/**
 * Set the active server
 * @param {string} serverKey - 'LOCALHOST' or 'RAILWAY'
 */
export const setActiveServer = (serverKey) => {
  if (!SERVERS[serverKey]) {
    console.error(`Invalid server key: ${serverKey}`);
    return false;
  }
  
  localStorage.setItem(ACTIVE_SERVER_KEY, serverKey);
  
  // Dispatch custom event to notify components
  window.dispatchEvent(new CustomEvent('serverChanged', { 
    detail: { server: serverKey, url: SERVERS[serverKey].url } 
  }));
  
  return true;
};

/**
 * Get the current API base URL
 * @returns {string} The active server URL
 */
export const getApiBaseUrl = () => {
  // Priority: Environment variable > Active server setting > Default
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  const activeServer = getActiveServer();
  return SERVERS[activeServer].url;
};

/**
 * Get server info
 * @param {string} serverKey - Optional server key, defaults to active server
 * @returns {object} Server configuration object
 */
export const getServerInfo = (serverKey = null) => {
  const key = serverKey || getActiveServer();
  return SERVERS[key];
};

/**
 * Check if a server is reachable
 * @param {string} serverKey - 'LOCALHOST' or 'RAILWAY'
 * @returns {Promise<boolean>} True if server is reachable
 */
export const checkServerHealth = async (serverKey) => {
  try {
    const server = SERVERS[serverKey];
    const response = await fetch(`${server.url}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    return response.ok;
  } catch (error) {
    console.error(`Server ${serverKey} health check failed:`, error);
    return false;
  }
};

/**
 * Auto-detect best server
 * @returns {Promise<string>} Best available server key
 */
export const autoDetectServer = async () => {
  // Try localhost first
  const localhostHealthy = await checkServerHealth('LOCALHOST');
  if (localhostHealthy) {
    return 'LOCALHOST';
  }
  
  // Fallback to Railway
  return 'RAILWAY';
};

export default {
  SERVERS,
  getActiveServer,
  setActiveServer,
  getApiBaseUrl,
  getServerInfo,
  checkServerHealth,
  autoDetectServer,
};
