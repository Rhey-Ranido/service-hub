import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Grid3X3, 
  List, 
  MapPin, 
  Star,
  DollarSign,
  Clock,
  Users,
  X
} from 'lucide-react';

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const servicesPerPage = 12;

  // API Configuration
  const API_BASE_URL = 'http://localhost:3000/api';

  // Fetch services from backend
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/services`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched services:', data);
      
      // The backend already provides the correct format, just use it directly
      const transformedServices = data.services?.map(service => ({
        id: service.id, // Use the id field that backend already provides
        title: service.title,
        description: service.description,
        shortDescription: service.shortDescription,
        price: service.price || 0,
        priceUnit: service.priceUnit || 'hour',
        tags: service.tags || [],
        category: service.category,
        featured: service.featured || false,
        createdAt: service.createdAt,
        deliveryTime: service.deliveryTime,
        revisions: service.revisions,
        totalOrders: service.totalOrders || 0,
        provider: {
          id: service.provider?.id,
          name: service.provider?.name || 'Unknown Provider',
          rating: service.provider?.rating || 0,
          reviewCount: service.provider?.reviewCount || 0,
          location: service.provider?.location || 'Location not specified'
        },
        rating: {
          average: service.rating?.average || 0,
          count: service.rating?.count || 0
        }
      })) || [];

      setServices(transformedServices);
      setFilteredServices(transformedServices);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from services
  const getCategories = () => {
    const uniqueCategories = ['all', ...new Set(services.map(service => service.category).filter(Boolean))];
    return uniqueCategories;
  };

  // Get unique locations from services
  const getLocations = () => {
    const uniqueLocations = ['all', ...new Set(services.map(service => service.provider?.location).filter(Boolean))];
    return uniqueLocations;
  };

  const categories = getCategories();
  const locations = getLocations();
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-50', label: '$0 - $50' },
    { value: '51-100', label: '$51 - $100' },
    { value: '101-150', label: '$101 - $150' },
    { value: '151-200', label: '$151 - $200' },
    { value: '200+', label: '$200+' }
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    let filtered = [...services];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(service => service.provider?.location === selectedLocation);
    }

    // Price range filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(service => {
        const price = service.price;
        switch (priceRange) {
          case '0-50': return price <= 50;
          case '51-100': return price >= 51 && price <= 100;
          case '101-150': return price >= 101 && price <= 150;
          case '151-200': return price >= 151 && price <= 200;
          case '200+': return price > 200;
          default: return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.provider?.rating || a.rating?.average || 0;
          bValue = b.provider?.rating || b.rating?.average || 0;
          break;
        case 'reviews':
          aValue = a.provider?.reviewCount || a.rating?.count || 0;
          bValue = b.provider?.reviewCount || b.rating?.count || 0;
          break;
        case 'name':
          aValue = a.title?.toLowerCase() || '';
          bValue = b.title?.toLowerCase() || '';
          break;
        default:
          aValue = a.provider?.rating || a.rating?.average || 0;
          bValue = b.provider?.rating || b.rating?.average || 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredServices(filtered);
    setCurrentPage(1);
  }, [services, searchTerm, selectedCategory, selectedLocation, priceRange, sortBy, sortOrder]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setPriceRange('all');
    setSortBy('rating');
    setSortOrder('desc');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedLocation !== 'all' || priceRange !== 'all';

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);
  const startIndex = (currentPage - 1) * servicesPerPage;
  const endIndex = startIndex + servicesPerPage;
  const currentServices = filteredServices.slice(startIndex, endIndex);

  const handleServiceClick = (service) => {
    if (!service.id) {
      console.error('Service ID is undefined!');
      return;
    }
    
    // Navigate to service detail page
    navigate(`/services/${service.id}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load services</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={fetchServices}>
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Services</h1>
          <p className="text-gray-600">
            Discover professional services from verified providers ({services.length} services available)
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search services, skills, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters {hasActiveFilters && <Badge className="ml-2">!</Badge>}
                </Button>

                {/* View Mode Toggle */}
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Filters Row */}
              <div className={`${showFilters || window.innerWidth >= 1024 ? 'block' : 'hidden'} lg:block`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t">
                  {/* Category Filter */}
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Location Filter */}
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>
                          {location === 'all' ? 'All Locations' : location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Price Range Filter */}
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map(range => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Sort By */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="reviews">Reviews</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Sort Order & Clear */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="flex-1"
                    >
                      {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    </Button>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="flex-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredServices.length)} of {filteredServices.length} services
          </p>
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              {searchTerm && <Badge variant="secondary">{searchTerm}</Badge>}
              {selectedCategory !== 'all' && <Badge variant="secondary">{selectedCategory}</Badge>}
              {selectedLocation !== 'all' && <Badge variant="secondary">{selectedLocation}</Badge>}
              {priceRange !== 'all' && <Badge variant="secondary">{priceRanges.find(r => r.value === priceRange)?.label}</Badge>}
            </div>
          )}
        </div>

        {/* Services Grid */}
        {currentServices.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            : "space-y-4 mb-8"
          }>
            {currentServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={handleServiceClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
            <Button onClick={clearFilters} variant="outline">
              Clear all filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    size="sm"
                  >
                    {page}
                  </Button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2">...</span>;
              }
              return null;
            })}
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Services; 