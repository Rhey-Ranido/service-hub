/**
 * Review data for seeding the database
 * Contains sample reviews for services and providers
 */

/**
 * Sample review comments for variety
 */
const sampleComments = [
  'Excellent work! Very professional and delivered exactly what I needed.',
  'Great communication throughout the project. Highly recommended!',
  'Quality work and fast delivery. Will definitely work with again.',
  'Very skilled and knowledgeable. Exceeded my expectations.',
  'Professional service with attention to detail. Great experience!',
  'Reliable and trustworthy. Delivered on time and within budget.',
  'Outstanding quality and customer service. Highly satisfied!',
  'Very responsive and easy to work with. Great results!',
  'Skilled professional who delivers quality work consistently.',
  'Excellent communication and timely delivery. Highly recommended!',
  'Great attention to detail and professional approach.',
  'Very satisfied with the work quality and service.',
  'Reliable provider who understands client needs perfectly.',
  'Professional, punctual, and delivers excellent results.',
  'Great experience working together. Highly skilled provider!'
];

/**
 * Generate service reviews
 * @param {Array} services - Array of created service objects
 * @param {Array} users - Array of created user objects
 * @returns {Array} Array of service review objects
 */
export const generateServiceReviews = (services, users) => {
  const serviceReviews = [];
  const usedCombinations = new Set(); // Track used service-user combinations
  
  // Get non-provider users (client and admin users are at indices 9, 10)
  const reviewerUsers = users.slice(9); // Get client and admin users
  
  for (let i = 0; i < services.length; i++) {
    const service = services[i];
    const reviewCount = Math.min(2, reviewerUsers.length); // Create up to 2 reviews per service
    
    // Create reviews for each service using different users
    const usedUserIds = new Set();
    for (let j = 0; j < reviewCount; j++) {
      let reviewerUser;
      let attempts = 0;
      
      // Find a user that hasn't reviewed this service yet
      do {
        reviewerUser = reviewerUsers[Math.floor(Math.random() * reviewerUsers.length)];
        attempts++;
      } while (usedUserIds.has(reviewerUser._id.toString()) && attempts < 10);
      
      // Skip if we can't find a unique user (shouldn't happen with our data)
      if (usedUserIds.has(reviewerUser._id.toString())) {
        continue;
      }
      
      usedUserIds.add(reviewerUser._id.toString());
      const combinationKey = `${service._id}-${reviewerUser._id}`;
      
      // Skip if this combination already exists
      if (usedCombinations.has(combinationKey)) {
        continue;
      }
      
      usedCombinations.add(combinationKey);
      
      const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars mostly
      const comment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
      
      serviceReviews.push({
        serviceId: service._id,
        userId: reviewerUser._id,
        rating: rating,
        comment: comment,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
      });
    }
  }
  
  return serviceReviews;
};

/**
 * Generate provider reviews
 * @param {Array} providers - Array of created provider objects
 * @param {Array} users - Array of created user objects
 * @returns {Array} Array of provider review objects
 */
export const generateProviderReviews = (providers, users) => {
  const providerReviews = [];
  const usedCombinations = new Set(); // Track used provider-user combinations
  
  // Get non-provider users (client and admin users are at indices 9, 10)
  const reviewerUsers = users.slice(9); // Get client and admin users
  
  for (let i = 0; i < providers.length; i++) {
    const provider = providers[i];
    const reviewCount = Math.min(2, reviewerUsers.length); // Create up to 2 reviews per provider
    
    // Create reviews for each provider using different users
    const usedUserIds = new Set();
    for (let j = 0; j < reviewCount; j++) {
      let reviewerUser;
      let attempts = 0;
      
      // Find a user that hasn't reviewed this provider yet
      do {
        reviewerUser = reviewerUsers[Math.floor(Math.random() * reviewerUsers.length)];
        attempts++;
      } while (usedUserIds.has(reviewerUser._id.toString()) && attempts < 10);
      
      // Skip if we can't find a unique user (shouldn't happen with our data)
      if (usedUserIds.has(reviewerUser._id.toString())) {
        continue;
      }
      
      usedUserIds.add(reviewerUser._id.toString());
      const combinationKey = `${provider._id}-${reviewerUser._id}`;
      
      // Skip if this combination already exists
      if (usedCombinations.has(combinationKey)) {
        continue;
      }
      
      usedCombinations.add(combinationKey);
      
      const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars mostly
      const comment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
      
      providerReviews.push({
        providerId: provider._id,
        userId: reviewerUser._id,
        rating: rating,
        comment: comment,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
      });
    }
  }
  
  return providerReviews;
};
