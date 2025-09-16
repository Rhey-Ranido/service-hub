import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, X, RefreshCw } from 'lucide-react';
import { saveUserLocation, saveLocationPermission } from '../utils/locationUtils';

const LocationPermissionButton = ({ 
  locationPermission, 
  onLocationGranted, 
  onLocationDenied,
  onUseLocation, // New prop for when location is already granted
  className = ""
}) => {
  const [isRequesting, setIsRequesting] = useState(false);

  const toggleLocation = async () => {
    // If location is already granted, trigger location-based search
    if (locationPermission === 'granted') {
      if (onUseLocation) {
        onUseLocation();
      }
      return;
    }

    await requestLocationPermission();
  };

  const refreshLocation = async () => {
    if (locationPermission === 'granted') {
      await requestLocationPermission();
    }
  };

  const requestLocationPermission = async () => {
    console.log('LocationPermissionButton: Requesting location permission...');
    console.log('User Agent:', navigator.userAgent);
    console.log('Protocol:', location.protocol);
    console.log('Hostname:', location.hostname);
    
    if (!navigator.geolocation) {
      console.error('LocationPermissionButton: Geolocation not supported');
      onLocationDenied('Geolocation not supported by this browser');
      return;
    }

    // For mobile devices, we need to ensure user gesture and proper context
    // The button click should be a direct user interaction
    console.log('LocationPermissionButton: Geolocation API available');

    setIsRequesting(true);
    console.log('LocationPermissionButton: Starting geolocation request...');

    try {
      const position = await new Promise((resolve, reject) => {
        const options = {
          enableHighAccuracy: true,
          timeout: 30000, // Increased timeout for mobile
          maximumAge: 0 // Force fresh location for mobile
        };

        console.log('LocationPermissionButton: Geolocation options:', options);
        
        // Use the geolocation API directly in the user gesture context
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            console.log('LocationPermissionButton: Success callback triggered');
            resolve(pos);
          },
          (err) => {
            console.log('LocationPermissionButton: Error callback triggered');
            reject(err);
          },
          options
        );
      });

      console.log('LocationPermissionButton: Position received:', position);
      
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      console.log('LocationPermissionButton: Location data:', location);
      
      // Save location to localStorage
      saveUserLocation(location);
      saveLocationPermission('granted');
      
      onLocationGranted(location);
    } catch (error) {
      console.error('LocationPermissionButton: Geolocation error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      let reason = 'Unknown error';
      switch (error.code) {
        case 1: // PERMISSION_DENIED
          reason = 'Permission denied - Please enable location access in your browser settings';
          console.log('LocationPermissionButton: Permission denied');
          break;
        case 2: // POSITION_UNAVAILABLE
          reason = 'Position unavailable - Please check your GPS settings';
          console.log('LocationPermissionButton: Position unavailable');
          break;
        case 3: // TIMEOUT
          reason = 'Request timeout - Please try again';
          console.log('LocationPermissionButton: Request timeout');
          break;
        default:
          reason = `Error: ${error.message}`;
          console.log('LocationPermissionButton: Unknown error:', error.message);
      }
      
      // Save denied status to localStorage
      saveLocationPermission('denied');
      
      onLocationDenied(reason);
    } finally {
      setIsRequesting(false);
      console.log('LocationPermissionButton: Request completed');
    }
  };

  const getButtonVariant = () => {
    switch (locationPermission) {
      case 'granted':
        return 'default';
      case 'denied':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getButtonText = () => {
    if (isRequesting) {
      return 'Getting Location...';
    }
    
    switch (locationPermission) {
      case 'granted':
        return 'Use My Location';
      case 'denied':
        return 'Enable Location';
      default:
        return 'Use My Location';
    }
  };

  const getButtonIcon = () => {
    if (isRequesting) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    
    switch (locationPermission) {
      case 'granted':
        return <MapPin className="h-4 w-4" />;
      case 'denied':
        return <X className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={getButtonVariant()}
        size="sm"
        onClick={toggleLocation}
        disabled={isRequesting}
        className={`flex items-center gap-2 ${className}`}
        title={
          locationPermission === 'granted' 
            ? 'Click to use your current location for search'
            : 'Click to enable location access'
        }
      >
        {getButtonIcon()}
        {getButtonText()}
      </Button>
      
      {/* Refresh location button - only show when location is granted */}
      {locationPermission === 'granted' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshLocation}
          disabled={isRequesting}
          className="h-11 px-2 text-muted-foreground hover:text-foreground"
          title="Refresh your current location"
        >
          <RefreshCw className={`h-4 w-4 ${isRequesting ? 'animate-spin' : ''}`} />
        </Button>
      )}
    </div>
  );
};

export default LocationPermissionButton;
