/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, User, Building2, AlertCircle, Loader2, Star, DollarSign, CheckCircle } from 'lucide-react';

// Fix for default markers in react-leaflet when using bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createCustomIcon = (color = '#3b82f6', isUser = false) => {
  const iconColor = isUser ? '#ef4444' : color;
  const iconSymbol = isUser ? '📍' : '🏢';
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${iconColor};
        width: ${isUser ? '40px' : '32px'};
        height: ${isUser ? '40px' : '32px'};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: ${isUser ? '16px' : '12px'};
        ">${iconSymbol}</div>
      </div>
    `,
    iconSize: isUser ? [40, 40] : [32, 32],
    iconAnchor: isUser ? [20, 40] : [16, 32],
    popupAnchor: [0, -30]
  });
};

// Haversine distance (km)
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
};

const getCategoryColor = (category) => {
  const colors = {
    'Technology': '#3b82f6',
    'Marketing': '#10b981',
    'Design': '#f59e0b',
    'Writing': '#8b5cf6',
    'Business': '#ef4444',
    'Other': '#6b7280'
  };
  return colors[category] || '#3b82f6';
};

const FitBounds = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (!points || points.length === 0) return;
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [24, 24] });
  }, [points, map]);
  return null;
};

const ServiceLocationMap = ({ service, className = 'h-96', onLocationUpdate }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle | loading | success | denied | error
  const [currentService, setCurrentService] = useState(service);
  const [locationUpdated, setLocationUpdated] = useState(false);

  const serviceLatLng = useMemo(() => {
    // Try multiple shapes where coordinates may be present
    const candidates = [
      currentService?.provider?.coordinates,
      currentService?.provider?.location?.coordinates,
      currentService?.location?.coordinates,
      currentService?.coordinates
    ];
    for (const coords of candidates) {
      if (Array.isArray(coords) && coords.length === 2 &&
          typeof coords[0] === 'number' && typeof coords[1] === 'number') {
        const [lng, lat] = coords; // GeoJSON order [lng, lat]
        return { lat, lng };
      }
    }
    return null;
  }, [currentService]);

  const defaultCenter = useMemo(() => {
    if (serviceLatLng) return [serviceLatLng.lat, serviceLatLng.lng];
    return [14.5995, 120.9842]; // Manila fallback
  }, [serviceLatLng]);

  const points = useMemo(() => {
    const arr = [];
    if (serviceLatLng) arr.push([serviceLatLng.lat, serviceLatLng.lng]);
    if (userLocation) arr.push([userLocation.lat, userLocation.lng]);
    return arr;
  }, [serviceLatLng, userLocation]);

  const distanceKm = useMemo(() => {
    if (!userLocation || !serviceLatLng) return null;
    return calculateDistanceKm(userLocation.lat, userLocation.lng, serviceLatLng.lat, serviceLatLng.lng);
  }, [userLocation, serviceLatLng]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLocationStatus('success');
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setLocationStatus('denied');
        else setLocationStatus('error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  useEffect(() => {
    // Try to get location automatically; user can retry with button
    getLocation();
  }, []);

  // Listen for provider location updates
  useEffect(() => {
    const handleProviderLocationUpdate = (event) => {
      console.log('Provider location updated:', event.detail);
      if (event.detail && event.detail.providerId === currentService?.provider?.id) {
        // Update the current service data with new location
        setCurrentService(prevService => ({
          ...prevService,
          provider: {
            ...prevService.provider,
            location: event.detail.location,
            coordinates: event.detail.coordinates
          }
        }));
        
        // Show visual indicator that location was updated
        setLocationUpdated(true);
        setTimeout(() => setLocationUpdated(false), 3000); // Hide after 3 seconds
        
        // Notify parent component if callback provided
        if (onLocationUpdate) {
          onLocationUpdate(event.detail);
        }
      }
    };

    // Add event listener for provider location updates
    window.addEventListener('providerLocationUpdated', handleProviderLocationUpdate);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('providerLocationUpdated', handleProviderLocationUpdate);
    };
  }, [currentService?.provider?.id, onLocationUpdate]);

  // Update currentService when service prop changes
  useEffect(() => {
    setCurrentService(service);
  }, [service]);

  return (
    <>
      <style jsx>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          border: 1px solid #e5e7eb;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
          border: 1px solid #e5e7eb;
        }
      `}</style>
      <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <span className="text-gray-900">Service Location</span>
          {locationUpdated && (
            <Badge variant="default" className="ml-2 bg-green-100 text-green-800 animate-pulse">
              <CheckCircle className="h-3 w-3 mr-1" />
              Updated
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Location Information Panel */}
        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Service Location */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Service Location</p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {currentService?.provider?.location || 'Location not specified'}
                </p>
                {serviceLatLng && (
                  <p className="text-xs text-gray-600 font-mono">
                    {serviceLatLng.lat.toFixed(4)}, {serviceLatLng.lng.toFixed(4)}
                  </p>
                )}
              </div>
            </div>

            {/* Distance */}
            {distanceKm !== null && (
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Navigation className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Distance</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {distanceKm} km away
                  </p>
                  <p className="text-xs text-gray-600">
                    {distanceKm < 5 ? 'Very close' : distanceKm < 20 ? 'Nearby' : distanceKm < 50 ? 'Moderate distance' : 'Far away'}
                  </p>
                </div>
              </div>
            )}

            {/* User Location Status */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                {locationStatus === 'loading' && <Loader2 className="h-5 w-5 text-red-600 animate-spin" />}
                {locationStatus === 'success' && <User className="h-5 w-5 text-red-600" />}
                {locationStatus === 'denied' && <AlertCircle className="h-5 w-5 text-red-600" />}
                {locationStatus === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
                {locationStatus === 'idle' && <User className="h-5 w-5 text-gray-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Your Location</p>
                {locationStatus === 'loading' && (
                  <p className="text-sm font-semibold text-gray-900">Getting location...</p>
                )}
                {locationStatus === 'success' && userLocation && (
                  <>
                    <p className="text-sm font-semibold text-gray-900">Located</p>
                    <p className="text-xs text-gray-600 font-mono">
                      {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                    </p>
                    <p className="text-xs text-gray-500">±{Math.round(userLocation.accuracy)}m accuracy</p>
                  </>
                )}
                {locationStatus === 'denied' && (
                  <p className="text-sm font-semibold text-red-600">Location blocked</p>
                )}
                {locationStatus === 'error' && (
                  <p className="text-sm font-semibold text-red-600">Location error</p>
                )}
                {locationStatus === 'idle' && (
                  <p className="text-sm font-semibold text-gray-500">Not located</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            {(locationStatus === 'error' || locationStatus === 'denied') && (
              <Button size="sm" variant="outline" onClick={getLocation} className="flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                Retry Location
              </Button>
            )}
            {serviceLatLng && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`https://www.google.com/maps?q=${serviceLatLng.lat},${serviceLatLng.lng}`, '_blank')}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                Open in Maps
              </Button>
            )}
          </div>
        </div>

        <div className={`${className} relative`} style={{ minHeight: '320px' }}>
          <MapContainer 
            center={defaultCenter} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }} 
            className="rounded-b-lg shadow-lg"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {points.length > 0 && <FitBounds points={points} />}

            {serviceLatLng && (
              <Marker position={[serviceLatLng.lat, serviceLatLng.lng]} icon={createCustomIcon('#3b82f6', false)}>
                <Popup className="custom-popup">
                  <div className="min-w-[280px] p-2">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-gray-900">{currentService?.title || 'Service'}</h3>
                        <p className="text-xs text-gray-600">{currentService?.provider?.name}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs font-medium">Rating</span>
                        </div>
                        <span className="text-xs font-semibold">{(currentService?.rating?.average || 0).toFixed(1)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-green-600" />
                          <span className="text-xs font-medium">Price</span>
                        </div>
                        <span className="text-xs font-semibold">₱{currentService?.price?.amount || 0}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-blue-600" />
                          <span className="text-xs font-medium">Location</span>
                        </div>
                        <span className="text-xs text-gray-600 text-right max-w-[120px] truncate">
                          {currentService?.provider?.location || 'Unknown'}
                        </span>
                      </div>
                      
                      {distanceKm !== null && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Navigation className="h-3 w-3 text-purple-600" />
                            <span className="text-xs font-medium">Distance</span>
                          </div>
                          <span className="text-xs font-semibold text-purple-600">{distanceKm} km</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`https://www.google.com/maps?q=${serviceLatLng.lat},${serviceLatLng.lng}`, '_blank')}
                        className="w-full text-xs"
                      >
                        <Navigation className="h-3 w-3 mr-1"/>
                        Directions
                      </Button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}

            {userLocation && (
              <>
                <Marker position={[userLocation.lat, userLocation.lng]} icon={createCustomIcon('#ef4444', true)}>
                  <Popup className="custom-popup">
                    <div className="min-w-[240px] p-2">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-gray-900">Your Location</h3>
                          <p className="text-xs text-gray-600">Current position</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-blue-600" />
                            <span className="text-xs font-medium">Coordinates</span>
                          </div>
                          <span className="text-xs font-mono text-gray-600">
                            {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Navigation className="h-3 w-3 text-green-600" />
                            <span className="text-xs font-medium">Accuracy</span>
                          </div>
                          <span className="text-xs font-semibold text-green-600">
                            ±{Math.round(userLocation.accuracy)}m
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}`, '_blank')}
                          className="w-full text-xs"
                        >
                          <Navigation className="h-3 w-3 mr-1"/>
                          Open in Maps
                        </Button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
                <Circle
                  center={[userLocation.lat, userLocation.lng]}
                  radius={50000}
                  pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1, weight: 2 }}
                />
              </>
            )}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
    </>
  );
};

export default ServiceLocationMap;


