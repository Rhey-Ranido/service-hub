import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, User, MapPin, Clock } from 'lucide-react';

const ServiceCard = ({ service, onClick }) => {
  // Handle missing service data gracefully
  if (!service) {
    return null;
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick(service);
    }
  };

  // Format price display
  const formatPrice = (price, unit) => {
    if (!price) return 'Price on request';
    return `$${price}${unit ? `/${unit}` : ''}`;
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 shadow-md overflow-hidden"
      onClick={handleCardClick}
    >
      <div className="relative">
        {/* Service Image */}
        <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <div className="text-primary/30">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        </div>
        
        {/* Featured badge */}
        {service.featured && (
          <div className="absolute top-3 left-3">
            <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-white">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}
        
        {/* Price badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-900 font-semibold">
            {formatPrice(service.price, service.priceUnit)}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
              {service.title || 'Untitled Service'}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 mt-1 line-clamp-2">
              {service.shortDescription || service.description || 'No description available'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Tags */}
        {service.tags && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {service.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs px-2 py-1 bg-gray-50 text-gray-700 border-gray-200"
              >
                {tag}
              </Badge>
            ))}
            {service.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-1 bg-gray-50 text-gray-500">
                +{service.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Provider Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {service.provider?.name || 'Unknown Provider'}
              </p>
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-gray-500">
                  {service.provider?.location || 'Location not specified'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Rating */}
          {(service.provider?.rating > 0 || service.rating?.average > 0) && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-900">
                {service.provider?.rating || service.rating?.average || 0}
              </span>
              <span className="text-xs text-gray-500">
                ({service.provider?.reviewCount || service.rating?.count || 0})
              </span>
            </div>
          )}
        </div>

        {/* Additional info */}
        <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
          {service.deliveryTime && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Delivery: {service.deliveryTime}</span>
            </div>
          )}
          {service.totalOrders > 0 && (
            <span>{service.totalOrders} orders completed</span>
          )}
        </div>

        {/* Action Button */}
        <Button 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when button is clicked
            handleCardClick();
          }}
        >
          <Clock className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ServiceCard; 