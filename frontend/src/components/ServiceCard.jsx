import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, User, MapPin, Clock, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

const ServiceCard = ({ service, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle missing service data gracefully
  if (!service) {
    return null;
  }

  // Log the service data for debugging
  console.log('🎴 ServiceCard rendering:', {
    serviceId: service.id,
    title: service.title,
    provider: {
      name: service.provider?.name,
      id: service.provider?.id,
      profileImage: service.provider?.profileImage,
      profileImageUrl: service.provider?.profileImageUrl,
      hasProfileImage: !!service.provider?.profileImageUrl
    }
  });

  const handleCardClick = () => {
    if (onClick) {
      onClick(service);
    }
  };

  // Format price display
  const formatPrice = (price, unit) => {
    if (!price) return 'Price on request';
    return `₱${price}${unit ? `/${unit}` : ''}`;
  };

  // Handle image navigation
  const handleImageNavigation = (direction, e) => {
    e.stopPropagation(); // Prevent card click
    if (!service.imageUrls?.length) return;
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === service.imageUrls.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? service.imageUrls.length - 1 : prev - 1
      );
    }
  };

  // Get current image URL - only return service images, not provider images
  const getCurrentImage = () => {
    if (service.imageUrls && service.imageUrls.length > 0) {
      console.log(`🖼️ Service has ${service.imageUrls.length} images, using service image`);
      return service.imageUrls[currentImageIndex];
    }
    
    // Return null if no service images - this will show the icon fallback
    console.log(`📷 No service images available, will show icon fallback`);
    return null;
  };

  const currentImage = getCurrentImage();
  const hasServiceImages = service.imageUrls && service.imageUrls.length > 0;

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 shadow-md overflow-hidden w-full"
      onClick={handleCardClick}
    >
      <div className="relative">
        {/* Service Image */}
        <div className="h-40 sm:h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden">
          {currentImage ? (
            <img
              src={currentImage}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="text-primary/30">
              <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16" />
            </div>
          )}
          
          {/* Image Navigation for multiple images - only show for service images */}
          {hasServiceImages && service.imageUrls.length > 1 && (
            <>
              <Button
                size="sm"
                variant="secondary"
                className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white border-0 h-8 w-8 p-0"
                onClick={(e) => handleImageNavigation('prev', e)}
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white border-0 h-8 w-8 p-0"
                onClick={(e) => handleImageNavigation('next', e)}
              >
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              
              {/* Image indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                {service.imageUrls.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                      index === currentImageIndex 
                        ? 'bg-white' 
                        : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          

        </div>
        

        
        {/* Price badge */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <Badge variant="secondary" className="bg-background/90 text-foreground font-semibold text-xs sm:text-sm">
            {formatPrice(service.price, service.priceUnit)}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {service.title || 'Untitled Service'}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
              {service.shortDescription || service.description || 'No description available'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 px-3 sm:px-6 pb-3 sm:pb-6">
        {/* Tags */}
        {service.tags && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
            {service.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-muted text-muted-foreground border-border"
              >
                {tag}
              </Badge>
            ))}
            {service.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-muted text-muted-foreground">
                +{service.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Enhanced Provider Profile Section */}
        <div className="mb-3 sm:mb-4">
          {/* Provider Header with Profile */}
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              {/* Enhanced Provider Profile Image */}
              {service.provider?.profileImageUrl ? (
                <>
                  {console.log(`🖼️ Displaying profile image for ${service.provider.name}:`, service.provider.profileImageUrl)}
                  <div className="relative flex-shrink-0">
                    <img
                      src={service.provider.profileImageUrl}
                      alt={`${service.provider.name || 'Provider'}'s profile`}
                      className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-primary/20 shadow-sm"
                      onError={(e) => {
                        // If image fails to load, hide it and show the fallback icon
                        console.log(`❌ Profile image failed to load for ${service.provider.name}:`, service.provider.profileImageUrl);
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Verified badge overlay */}
                    {service.provider?.isVerified && (
                      <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex items-center justify-center border-2 border-background">
                        <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {console.log(`👤 No profile image available for ${service.provider?.name || 'Unknown Provider'}, showing fallback icon`)}
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center border-2 border-primary/20">
                      <User className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    {/* Verified badge overlay */}
                    {service.provider?.isVerified && (
                      <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex items-center justify-center border-2 border-background">
                        <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                    {service.provider?.name || 'Unknown Provider'}
                  </p>
                  {service.provider?.isVerified && (
                    <Badge variant="secondary" className="text-xs px-1 sm:px-2 py-0.5 bg-green-100 text-green-700 border-green-200 flex-shrink-0">
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-1 mt-0.5 sm:mt-1">
                  <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground flex-shrink-0" />
                  <p className="text-xs text-muted-foreground truncate">
                    {service.provider?.location || 'Location not specified'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Rating */}
            {(service.provider?.rating > 0 || service.rating?.average > 0) && (
              <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  {(service.provider?.rating || service.rating?.average || 0).toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  ({service.provider?.reviewCount || service.rating?.count || 0})
                </span>
              </div>
            )}
          </div>
          
          {/* Provider Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/30 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">


            </div>
            {service.provider?.responseTime && (
              <span className="text-primary font-medium text-xs flex-shrink-0 hidden sm:inline">
                Responds in {service.provider.responseTime}
              </span>
            )}
          </div>
        </div>

        {/* Additional info */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 text-xs text-muted-foreground">
          {service.deliveryTime && (
            <div className="flex items-center space-x-1">
              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>Delivery: {service.deliveryTime}</span>
            </div>
          )}

        </div>

        {/* Action Button */}
        <Button 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-sm sm:text-base h-9 sm:h-10"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when button is clicked
            handleCardClick();
          }}
        >
          <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ServiceCard; 