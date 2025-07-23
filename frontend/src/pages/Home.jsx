// src/pages/Home.jsx
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ServiceCard from "../components/ServiceCard";
import TestimonialCarousel from "../components/TestimonialCarousel";
import Footer from "../components/Footer";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white">
      <Navbar />
      
      <div className="flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-800">
            Welcome to{' '}
            <span className="text-primary">ServiceHub</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find and connect with skilled service providers near you. Get the help you need, when you need it.
          </p>

          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="px-8 py-3 text-lg"
                onClick={() => navigate("/register")}
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-3 text-lg"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            </div>
          ) : (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Welcome back, {user.email}!
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="px-8 py-3 text-lg"
                  onClick={() => navigate("/services")}
                >
                  Browse Services
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-3 text-lg"
                  onClick={() => navigate("/providers")}
                >
                  Find Providers
                </Button>
              </div>
            </div>
          )}

          {/* Top Services Section */}
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Top Services</h2>
                <p className="text-gray-600">Discover our most popular and highly-rated services</p>
              </div>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 hover:gap-3 transition-all"
                onClick={() => navigate("/services")}
              >
                See All Services
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ServiceCard 
                service={{
                  id: '1',
                  title: 'Professional Web Development',
                  description: 'Custom website development with modern technologies including React, Node.js, and responsive design.',
                  price: 150,
                  tags: ['Web Development', 'React', 'Node.js', 'Responsive'],
                  provider: {
                    name: 'John Smith',
                    rating: 4.8,
                    reviewCount: 24,
                    location: 'San Francisco, CA'
                  },
                  featured: true
                }}
                onClick={(service) => console.log('Service clicked:', service)}
              />
              
              <ServiceCard 
                service={{
                  id: '2',
                  title: 'Digital Marketing & SEO',
                  description: 'Comprehensive digital marketing strategies to boost your online presence and drive more traffic to your business.',
                  price: 120,
                  tags: ['SEO', 'Marketing', 'Analytics'],
                  provider: {
                    name: 'Sarah Johnson',
                    rating: 4.9,
                    reviewCount: 31,
                    location: 'New York, NY'
                  },
                  featured: false
                }}
                onClick={(service) => console.log('Service clicked:', service)}
              />
              
              <ServiceCard 
                service={{
                  id: '3',
                  title: 'Mobile App Development',
                  description: 'Native and cross-platform mobile app development for iOS and Android with modern frameworks.',
                  price: 180,
                  tags: ['Mobile', 'iOS', 'Android', 'React Native'],
                  provider: {
                    name: 'Mike Chen',
                    rating: 4.7,
                    reviewCount: 18,
                    location: 'Seattle, WA'
                  },
                  featured: false
                }}
                onClick={(service) => console.log('Service clicked:', service)}
              />
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="mt-20 py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Don't just take our word for it. Here's what real users have to say about their experience with ServiceHub.
              </p>
            </div>
            
            <TestimonialCarousel />
          </div>

          {/* Features section */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="text-center p-6">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Find Services</h3>
              <p className="text-gray-600">
                Search and discover qualified service providers in your area for any task.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Connect & Chat</h3>
              <p className="text-gray-600">
                Communicate directly with service providers to discuss your needs and requirements.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Rate & Review</h3>
              <p className="text-gray-600">
                Share your experience and help others make informed decisions about service providers.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
