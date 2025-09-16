// Search results utility functions for managing search state in localStorage

const SEARCH_RESULTS_KEY = 'mapSearchResults';
const SEARCH_PARAMS_KEY = 'mapSearchParams';
const SEARCH_LOCATION_KEY = 'mapSearchLocation';

// Save search results to localStorage
export const saveSearchResults = (results, params = {}, userLocation = null) => {
  try {
    const searchData = {
      results: results || [],
      params: params || {},
      userLocation: userLocation || null,
      timestamp: Date.now(),
      totalResults: results?.length || 0
    };
    
    localStorage.setItem(SEARCH_RESULTS_KEY, JSON.stringify(searchData));
    localStorage.setItem(SEARCH_PARAMS_KEY, JSON.stringify(params));
    if (userLocation) {
      localStorage.setItem(SEARCH_LOCATION_KEY, JSON.stringify(userLocation));
    }
    
    console.log('Search results saved to localStorage:', {
      resultCount: results?.length || 0,
      params,
      hasLocation: !!userLocation
    });
  } catch (error) {
    console.error('Error saving search results to localStorage:', error);
  }
};

// Load search results from localStorage
export const loadSearchResults = () => {
  try {
    const storedData = localStorage.getItem(SEARCH_RESULTS_KEY);
    const storedParams = localStorage.getItem(SEARCH_PARAMS_KEY);
    const storedLocation = localStorage.getItem(SEARCH_LOCATION_KEY);
    
    if (!storedData) {
      return null;
    }

    const searchData = JSON.parse(storedData);
    const params = storedParams ? JSON.parse(storedParams) : {};
    const userLocation = storedLocation ? JSON.parse(storedLocation) : null;
    
    // Check if search results are not too old (2 hours)
    const maxAge = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    const isExpired = Date.now() - searchData.timestamp > maxAge;
    
    if (isExpired) {
      console.log('Stored search results are expired, clearing...');
      clearSearchResults();
      return null;
    }

    console.log('Search results loaded from localStorage:', {
      resultCount: searchData.results?.length || 0,
      params,
      hasLocation: !!userLocation
    });
    
    return {
      results: searchData.results || [],
      params: params,
      userLocation: userLocation,
      timestamp: searchData.timestamp,
      totalResults: searchData.totalResults || 0
    };
  } catch (error) {
    console.error('Error loading search results from localStorage:', error);
    return null;
  }
};

// Clear search results from localStorage
export const clearSearchResults = () => {
  try {
    localStorage.removeItem(SEARCH_RESULTS_KEY);
    localStorage.removeItem(SEARCH_PARAMS_KEY);
    localStorage.removeItem(SEARCH_LOCATION_KEY);
    console.log('Search results cleared from localStorage');
  } catch (error) {
    console.error('Error clearing search results from localStorage:', error);
  }
};

// Check if there are saved search results
export const hasSearchResults = () => {
  try {
    const storedData = localStorage.getItem(SEARCH_RESULTS_KEY);
    if (!storedData) return false;
    
    const searchData = JSON.parse(storedData);
    const maxAge = 2 * 60 * 60 * 1000; // 2 hours
    const isExpired = Date.now() - searchData.timestamp > maxAge;
    
    return !isExpired && searchData.results && searchData.results.length > 0;
  } catch (error) {
    console.error('Error checking search results:', error);
    return false;
  }
};

// Get search results count
export const getSearchResultsCount = () => {
  try {
    const storedData = localStorage.getItem(SEARCH_RESULTS_KEY);
    if (!storedData) return 0;
    
    const searchData = JSON.parse(storedData);
    const maxAge = 2 * 60 * 60 * 1000; // 2 hours
    const isExpired = Date.now() - searchData.timestamp > maxAge;
    
    return isExpired ? 0 : (searchData.results?.length || 0);
  } catch (error) {
    console.error('Error getting search results count:', error);
    return 0;
  }
};

// Save current search state (for back navigation)
export const saveCurrentSearchState = (searchResults, searchParams, userLocation, showMap = false, sourcePage = '/') => {
  try {
    // Extract service locations for map display
    const serviceLocations = (searchResults || []).map(service => ({
      id: service.id || service._id,
      title: service.title,
      provider: {
        id: service.provider?.id,
        name: service.provider?.name,
        location: service.provider?.location,
        coordinates: service.provider?.coordinates
      },
      category: service.category,
      price: service.price,
      rating: service.rating
    })).filter(service => service.provider?.coordinates && Array.isArray(service.provider.coordinates));

    const searchState = {
      results: searchResults || [],
      serviceLocations: serviceLocations,
      params: searchParams || {},
      userLocation: userLocation || null,
      showMap: showMap || false,
      sourcePage: sourcePage || '/',
      timestamp: Date.now()
    };
    
    localStorage.setItem('currentSearchState', JSON.stringify(searchState));
    console.log('Current search state saved:', {
      resultCount: searchResults?.length || 0,
      serviceLocationCount: serviceLocations.length,
      showMap,
      hasLocation: !!userLocation,
      sourcePage
    });
  } catch (error) {
    console.error('Error saving current search state:', error);
  }
};

// Load current search state
export const loadCurrentSearchState = () => {
  try {
    const storedState = localStorage.getItem('currentSearchState');
    if (!storedState) return null;
    
    const searchState = JSON.parse(storedState);
    
    // Check if state is not too old (1 hour)
    const maxAge = 60 * 60 * 1000; // 1 hour
    const isExpired = Date.now() - searchState.timestamp > maxAge;
    
    if (isExpired) {
      console.log('Stored search state is expired, clearing...');
      localStorage.removeItem('currentSearchState');
      return null;
    }
    
    return searchState;
  } catch (error) {
    console.error('Error loading current search state:', error);
    return null;
  }
};

// Clear current search state
export const clearCurrentSearchState = () => {
  try {
    localStorage.removeItem('currentSearchState');
    console.log('Current search state cleared');
  } catch (error) {
    console.error('Error clearing current search state:', error);
  }
};
