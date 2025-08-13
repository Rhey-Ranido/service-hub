import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  Navigation, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Info
} from 'lucide-react';

const LocationInput = ({ 
  value = '', 
  onChange, 
  placeholder = "Enter your location (e.g., San Francisco, CA)", 
  required = false,
  showCoordinates = false 
}) => {
  const [locationStatus, setLocationStatus] = useState('idle'); // idle, loading, success, error, denied
  const [coordinates, setCoordinates] = useState(null);
  const [address, setAddress] = useState(value);

  useEffect(() => {
    setAddress(value);
  }, [value]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }

    setLocationStatus('loading');
    
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        setCoordinates(coords);
        setLocationStatus('success');
        
        // Reverse geocode to get address
        reverseGeocode(coords.lat, coords.lng);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationStatus('error');
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationStatus('denied');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationStatus('error');
            break;
          case error.TIMEOUT:
            setLocationStatus('error');
            break;
          default:
            setLocationStatus('error');
        }
      },
      options
    );
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        const addressParts = [];
        
        if (data.address) {
          if (data.address.city) addressParts.push(data.address.city);
          if (data.address.state) addressParts.push(data.address.state);
          if (data.address.country) addressParts.push(data.address.country);
        }
        
        const formattedAddress = addressParts.length > 0 
          ? addressParts.join(', ') 
          : data.display_name?.split(', ').slice(0, 3).join(', ') || '';
        
        setAddress(formattedAddress);
        if (onChange) {
          onChange({
            address: formattedAddress,
            coordinates: [lng, lat] // MongoDB expects [longitude, latitude]
          });
        }
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // If reverse geocoding fails, just use coordinates
      if (onChange) {
        onChange({
          address: address,
          coordinates: [lng, lat]
        });
      }
    }
  };

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    if (onChange) {
      onChange({
        address: newAddress,
        coordinates: coordinates ? [coordinates.lng, coordinates.lat] : null
      });
    }
  };

  const getLocationStatusMessage = () => {
    switch (locationStatus) {
      case 'loading':
        return 'Getting your location...';
      case 'success':
        return `Location found: ${coordinates?.lat.toFixed(4)}, ${coordinates?.lng.toFixed(4)}`;
      case 'denied':
        return 'Location access denied. Please enable location permissions in your browser settings.';
      case 'error':
        return 'Unable to get your location. Please check your browser permissions or try again.';
      default:
        return 'Click the location button to automatically detect your location.';
    }
  };

  const getLocationStatusIcon = () => {
    switch (locationStatus) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'denied':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="location">
        Location {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            id="location"
            type="text"
            value={address}
            onChange={handleAddressChange}
            placeholder={placeholder}
            required={required}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={getCurrentLocation}
          disabled={locationStatus === 'loading'}
          className="flex items-center gap-2"
        >
          {locationStatus === 'loading' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
          {locationStatus === 'loading' ? 'Getting...' : 'Get Location'}
        </Button>
      </div>

      {/* Location Status */}
      {locationStatus !== 'idle' && (
        <Alert variant={locationStatus === 'success' ? 'default' : 'destructive'}>
          {getLocationStatusIcon()}
          <AlertDescription>
            {getLocationStatusMessage()}
          </AlertDescription>
        </Alert>
      )}

      {/* Coordinates Display */}
      {showCoordinates && coordinates && locationStatus === 'success' && (
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            <span>
              Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground ml-5">
            Accuracy: ±{Math.round(coordinates.accuracy)} meters
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationInput;
