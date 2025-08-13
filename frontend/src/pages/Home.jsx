/* eslint-disable no-unused-vars */
// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServiceCard from "../components/ServiceCard";
import ServiceSearch from "../components/ServiceSearch";
import TestimonialCarousel from '../components/TestimonialCarousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Loader2, Map, Grid3X3, MapPin, Star, DollarSign } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [featuredServices, setFeaturedServices] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('unknown'); // unknown, granted, denied

  const API_BASE_URL = 'http://localhost:3000/api';

  const handleServiceClick = (service) => {
    // Navigate to service details page
    navigate(`/services/${service.id}`);
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const handleMapToggle = () => {
    setShowMap(!showMap);
  };

  const handleLocationGranted = (location) => {
    setUserLocation(location);
    setLocationPermission('granted');
  };

  const handleLocationDenied = (reason) => {
    setLocationPermission('denied');
    console.log('Location access denied:', reason);
  };

  const fetchFeaturedServices = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch featured services from the backend
      const response = await fetch(`${API_BASE_URL}/services?featured=true&limit=3`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch featured services');
      }
      
      const data = await response.json();
      console.log('Featured services:', data);
      
      // Log the featured services to see the data structure
      console.log('🏠 Home page - Featured services data:');
      if (data.services && data.services.length > 0) {
        data.services.forEach((service, index) => {
          console.log(`Featured Service ${index + 1}: "${service.title}"`);
          console.log(`  - Provider: ${service.provider?.name}`);
          console.log(`  - Provider ID: ${service.provider?.id}`);
          console.log(`  - Profile Image: ${service.provider?.profileImage}`);
          console.log(`  - Profile Image URL: ${service.provider?.profileImageUrl}`);
          console.log(`  - Has Profile Image: ${!!service.provider?.profileImageUrl}`);
          console.log('  ---');
        });
      } else {
        console.log('No featured services found');
      }
      
      // Use the services directly from the backend
      setFeaturedServices(data.services || []);
    } catch (err) {
      console.error('Error fetching featured services:', err);
      setError('Failed to load featured services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedServices();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Find the Perfect
              <span className="text-primary block">Service Provider</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Connect with verified professionals for all your service needs. From web development to home services, we've got you covered.
            </p>
            


            {/* Search Section */}
            <div className="mb-8">
              <ServiceSearch 
                onSearchResults={handleSearchResults}
                onMapToggle={handleMapToggle}
                showMap={showMap}
                userLocation={userLocation}
                locationPermission={locationPermission}
                onLocationGranted={handleLocationGranted}
                onLocationDenied={handleLocationDenied}
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && !showMap && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    Search Results ({searchResults.length})
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((service) => {
                    // Calculate distance if user location is available
                    let distance = null;
                    if (userLocation && service.provider?.coordinates) {
                      const [lng, lat] = service.provider.coordinates;
                      const R = 6371; // Earth's radius in km
                      const dLat = (lat - userLocation.lat) * Math.PI / 180;
                      const dLon = (lng - userLocation.lng) * Math.PI / 180;
                      const a = 
                        Math.sin(dLat/2) * Math.sin(dLat/2) +
                        Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * 
                        Math.sin(dLon/2) * Math.sin(dLon/2);
                      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                      distance = Math.round(R * c * 10) / 10;
                    }

                    return (
                      <div key={service.id} className="relative">
                        <ServiceCard 
                          service={service}
                          onClick={handleServiceClick}
                        />
                        {distance && (
                          <Badge 
                            variant="secondary" 
                            className="absolute top-2 right-2 flex items-center gap-1"
                          >
                            <MapPin className="h-3 w-3" />
                            {distance} km
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-3"
                onClick={() => navigate("/services")}
              >
                Browse All Services
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-3"
                onClick={() => navigate("/register")}
              >
                Become a Provider
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover top-rated services from our verified providers. Quality guaranteed, satisfaction assured.
            </p>
            <Button 
                variant="outline" 
                className="flex items-center gap-2 hover:gap-3 transition-all mt-6"
                onClick={() => navigate("/services")}
              >
                See All Services
                <ArrowRight className="w-4 h-4" />
              </Button>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading featured services...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={fetchFeaturedServices} variant="outline">
                Try Again
              </Button>
            </div>
          ) : featuredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices.map((service) => (
                <ServiceCard 
                  key={service.id}
                  service={service}
                  onClick={handleServiceClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No featured services available</p>
              <Button onClick={() => navigate("/services")} variant="outline">
                Browse All Services
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Find Services</h3>
              <p className="text-muted-foreground">
                Search and discover qualified service providers in your area for any task.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Connect & Chat</h3>
              <p className="text-muted-foreground">
                Direct messaging with providers to discuss your project requirements and get quotes.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Get It Done</h3>
              <p className="text-muted-foreground">
                Hire the right provider and get your project completed with quality and satisfaction guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-muted/50 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what real users have to say about their experience with ServiceHub.
            </p>
          </div>
          
          <TestimonialCarousel />
        </div>
      </section>

      <Footer />
    </div>
  );
}
