/**
 * Utility functions for coordinate generation
 */

// Central location coordinates (Guiuan, Eastern Samar)
export const CENTRAL_COORDINATES = {
  lat: 11.0350,
  lng: 125.7267
};

/**
 * Generate nearby coordinates within a specified radius
 * @param {number} baseLat - Base latitude
 * @param {number} baseLng - Base longitude
 * @param {number} minDistanceKm - Minimum distance in kilometers (default: 1)
 * @param {number} maxDistanceKm - Maximum distance in kilometers (default: 5)
 * @returns {number[]} Array of [longitude, latitude] coordinates
 */
export const generateNearbyCoordinates = (baseLat, baseLng, minDistanceKm = 1, maxDistanceKm = 5) => {
  const distance = Math.random() * (maxDistanceKm - minDistanceKm) + minDistanceKm;
  const angle = Math.random() * 2 * Math.PI;
  const latOffset = (distance * Math.cos(angle)) / 111; // 1 degree ≈ 111 km
  const lngOffset = (distance * Math.sin(angle)) / (111 * Math.cos(baseLat * Math.PI / 180));
  return [baseLng + lngOffset, baseLat + latOffset];
};
