// Location utility functions for managing user location in localStorage

const LOCATION_STORAGE_KEY = 'userLocation';
const LOCATION_PERMISSION_KEY = 'locationPermission';

// Save user location to localStorage
export const saveUserLocation = (locationData) => {
  try {
    const locationWithTimestamp = {
      ...locationData,
      timestamp: Date.now()
    };
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locationWithTimestamp));
    console.log('Location saved to localStorage:', locationData);
  } catch (error) {
    console.error('Error saving location to localStorage:', error);
  }
};

// Load user location from localStorage
export const loadUserLocation = () => {
  try {
    const storedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (!storedLocation) {
      return null;
    }

    const locationData = JSON.parse(storedLocation);
    
    // Check if location is not too old (24 hours)
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const isExpired = Date.now() - locationData.timestamp > maxAge;
    
    if (isExpired) {
      console.log('Stored location is expired, clearing...');
      clearUserLocation();
      return null;
    }

    console.log('Location loaded from localStorage:', locationData);
    return locationData;
  } catch (error) {
    console.error('Error loading location from localStorage:', error);
    return null;
  }
};

// Clear user location from localStorage
export const clearUserLocation = () => {
  try {
    localStorage.removeItem(LOCATION_STORAGE_KEY);
    localStorage.removeItem(LOCATION_PERMISSION_KEY);
    console.log('Location cleared from localStorage');
    
    // Dispatch event to notify components
    window.dispatchEvent(new CustomEvent('userLocationCleared'));
  } catch (error) {
    console.error('Error clearing location from localStorage:', error);
  }
};

// Save location permission status
export const saveLocationPermission = (permission) => {
  try {
    localStorage.setItem(LOCATION_PERMISSION_KEY, permission);
    console.log('Location permission saved:', permission);
  } catch (error) {
    console.error('Error saving location permission:', error);
  }
};

// Load location permission status
export const loadLocationPermission = () => {
  try {
    const permission = localStorage.getItem(LOCATION_PERMISSION_KEY);
    console.log('Location permission loaded:', permission);
    return permission || 'unknown';
  } catch (error) {
    console.error('Error loading location permission:', error);
    return 'unknown';
  }
};

// Check if user is logged in (for clearing location on logout)
export const isUserLoggedIn = () => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

// Initialize location from localStorage (call this on app start)
export const initializeLocationFromStorage = () => {
  const storedLocation = loadUserLocation();
  const storedPermission = loadLocationPermission();
  
  return {
    location: storedLocation,
    permission: storedPermission
  };
};
