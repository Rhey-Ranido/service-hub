import { CENTRAL_COORDINATES, generateNearbyCoordinates } from '../utils/coordinates.js';

/**
 * Provider data for seeding the database
 * All providers are located in Guiuan, Eastern Samar
 */

/**
 * Generate provider data based on created users
 * @param {Array} users - Array of created user objects
 * @returns {Array} Array of provider objects
 */
export const generateProviders = (users) => {
  const providers = [
    {
      userId: users[0]._id,
      name: 'Jerson Caibog',
      bio: 'Professional web developer with expertise in modern web technologies. Specialized in creating responsive, user-friendly websites and web applications.',
      location: {
        address: 'Guiuan, Eastern Samar',
        type: 'Point',
        coordinates: generateNearbyCoordinates(CENTRAL_COORDINATES.lat, CENTRAL_COORDINATES.lng)
      },
      rating: {
        average: 4.8,
        count: 24
      },
      totalReviews: 24,
      totalServices: 1,
      isVerified: true,
      status: 'approved',
      categories: ['Technology'],
      skills: ['Web Development', 'JavaScript', 'React', 'Node.js', 'HTML/CSS'],
      languages: ['English', 'Filipino'],
      responseTime: 'within 2 hours',
      completedProjects: 156,
      socialLinks: {
        website: 'https://jersonweb.dev',
        linkedin: 'https://linkedin.com/in/jersoncaibog',
        github: 'https://github.com/jersoncaibog'
      }
    },
    {
      userId: users[1]._id,
      name: 'Ivan Yakit',
      bio: 'Professional video editor with years of experience in creating compelling visual content. Specialized in video editing, post-production, and motion graphics.',
      location: {
        address: 'Guiuan, Eastern Samar',
        type: 'Point',
        coordinates: generateNearbyCoordinates(CENTRAL_COORDINATES.lat, CENTRAL_COORDINATES.lng)
      },
      rating: {
        average: 4.9,
        count: 31
      },
      totalReviews: 31,
      totalServices: 2,
      isVerified: true,
      status: 'approved',
      categories: ['Design'],
      skills: ['Video Editing', 'Adobe Premiere Pro', 'After Effects', 'Motion Graphics', 'Color Grading'],
      languages: ['English', 'Filipino'],
      responseTime: 'within 4 hours',
      completedProjects: 89,
      socialLinks: {
        website: 'https://ivanyakit.com',
        linkedin: 'https://linkedin.com/in/ivanyakit'
      }
    },
    {
      userId: users[2]._id,
      name: 'Aina Oprin',
      bio: 'Professional content writer and copywriter with expertise in creating engaging, SEO-optimized content for various platforms and industries.',
      location: {
        address: 'Guiuan, Eastern Samar',
        type: 'Point',
        coordinates: generateNearbyCoordinates(CENTRAL_COORDINATES.lat, CENTRAL_COORDINATES.lng)
      },
      rating: {
        average: 0,
        count: 0
      },
      totalReviews: 0,
      totalServices: 2,
      isVerified: true,
      status: 'approved',
      categories: ['Writing'],
      skills: ['Content Writing', 'Copywriting', 'SEO Writing', 'Blog Writing', 'Technical Writing'],
      languages: ['English', 'Filipino'],
      responseTime: 'within 6 hours',
      completedProjects: 67,
      socialLinks: {
        website: 'https://ainawrites.com'
      }
    },
    {
      userId: users[3]._id,
      name: 'Jemerson Daganio',
      bio: 'Professional beauty and wellness specialist offering salon and spa services. Specialized in hair styling, beauty treatments, and wellness services.',
      location: {
        address: 'Guiuan, Eastern Samar',
        type: 'Point',
        coordinates: generateNearbyCoordinates(CENTRAL_COORDINATES.lat, CENTRAL_COORDINATES.lng)
      },
      rating: {
        average: 0,
        count: 0
      },
      totalReviews: 0,
      totalServices: 3,
      isVerified: true,
      status: 'approved',
      categories: ['Other'],
      skills: ['Hair Styling', 'Beauty Treatments', 'Spa Services', 'Wellness', 'Customer Service'],
      languages: ['English', 'Filipino'],
      responseTime: 'within 3 hours',
      completedProjects: 234,
      socialLinks: {
        website: 'https://jemersonbeauty.com'
      }
    },
    {
      userId: users[4]._id,
      name: 'Rhey Ranido',
      bio: 'Board game enthusiast and organizer offering game nights, tournaments, and custom board game experiences for events and gatherings.',
      location: {
        address: 'Guiuan, Eastern Samar',
        type: 'Point',
        coordinates: generateNearbyCoordinates(CENTRAL_COORDINATES.lat, CENTRAL_COORDINATES.lng)
      },
      rating: {
        average: 0,
        count: 0
      },
      totalReviews: 0,
      totalServices: 1,
      isVerified: true,
      status: 'approved',
      categories: ['Other'],
      skills: ['Board Games', 'Event Planning', 'Game Master', 'Tournament Organization', 'Entertainment'],
      languages: ['English', 'Filipino'],
      responseTime: 'within 12 hours',
      completedProjects: 145,
      socialLinks: {
        website: 'https://rheygames.com'
      }
    },
    {
      userId: users[5]._id,
      name: 'Marvin Opriassa',
      bio: 'Professional piggery and livestock management specialist with years of experience in sustainable farming practices and animal care.',
      location: {
        address: 'Guiuan, Eastern Samar',
        type: 'Point',
        coordinates: generateNearbyCoordinates(CENTRAL_COORDINATES.lat, CENTRAL_COORDINATES.lng)
      },
      rating: {
        average: 0,
        count: 0
      },
      totalReviews: 0,
      totalServices: 2,
      isVerified: true,
      status: 'approved',
      categories: ['Business'],
      skills: ['Piggery Management', 'Livestock Care', 'Sustainable Farming', 'Animal Health', 'Business Planning'],
      languages: ['English', 'Filipino'],
      responseTime: 'within 8 hours',
      completedProjects: 78,
      socialLinks: {
        linkedin: 'https://linkedin.com/in/marvinopriassa'
      }
    },
    {
      userId: users[6]._id,
      name: 'Beatriz Jane Dadula',
      bio: 'Professional printing services specialist offering custom printing solutions for business and personal needs. Expert in digital printing, design, and promotional materials.',
      location: {
        address: 'Guiuan, Eastern Samar',
        type: 'Point',
        coordinates: generateNearbyCoordinates(CENTRAL_COORDINATES.lat, CENTRAL_COORDINATES.lng)
      },
      rating: {
        average: 0,
        count: 0
      },
      totalReviews: 0,
      totalServices: 2,
      isVerified: true,
      status: 'approved',
      categories: ['Business'],
      skills: ['Digital Printing', 'Graphic Design', 'Business Cards', 'Promotional Materials', 'Custom Printing'],
      languages: ['English', 'Filipino'],
      responseTime: 'within 4 hours',
      completedProjects: 92,
      socialLinks: {
        website: 'https://beatrizprinting.com'
      }
    },
    {
      userId: users[7]._id,
      name: 'Fritz Kirby Delacruz',
      bio: 'Professional pet care specialist and animal trainer offering comprehensive pet services including grooming, training, boarding, and veterinary assistance.',
      location: {
        address: 'Guiuan, Eastern Samar',
        type: 'Point',
        coordinates: generateNearbyCoordinates(CENTRAL_COORDINATES.lat, CENTRAL_COORDINATES.lng)
      },
      rating: {
        average: 0,
        count: 0
      },
      totalReviews: 0,
      totalServices: 3,
      isVerified: true,
      status: 'approved',
      categories: ['Other'],
      skills: ['Pet Grooming', 'Animal Training', 'Pet Boarding', 'Veterinary Care', 'Pet Nutrition'],
      languages: ['English', 'Filipino'],
      responseTime: 'within 2 hours',
      completedProjects: 156,
      socialLinks: {
        website: 'https://fritzpetcare.com'
      }
    },
    {
      userId: users[8]._id,
      name: 'Alvin Alvarez',
      bio: 'Professional fitness trainer and sports coach offering personal training, group fitness classes, and sports coaching. Specialized in athletic performance and fitness programs.',
      location: {
        address: 'Guiuan, Eastern Samar',
        type: 'Point',
        coordinates: generateNearbyCoordinates(CENTRAL_COORDINATES.lat, CENTRAL_COORDINATES.lng)
      },
      rating: {
        average: 0,
        count: 0
      },
      totalReviews: 0,
      totalServices: 2,
      isVerified: true,
      status: 'approved',
      categories: ['Other'],
      skills: ['Personal Training', 'Sports Coaching', 'Fitness Programs', 'Nutrition Planning', 'Athletic Performance'],
      languages: ['English', 'Filipino'],
      responseTime: 'within 6 hours',
      completedProjects: 203,
      socialLinks: {
        website: 'https://alvinfitness.com'
      }
    }
  ];

  return providers;
};


