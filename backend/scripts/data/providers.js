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
      name: 'Franz Graphics',
      bio: 'We offer fully customized sublimation for jerseys, polo shirts, and t-shirts, plus high-quality tarpaulin and sticker printing.',
      location: {
        address: 'Guiuan, Eastern Samar',
        type: 'Point',
        coordinates: [125.73479, 11.026404]
      },
      rating: { average: 0, count: 0 },
      totalReviews: 0,
      totalServices: 0,
      isVerified: true,
      status: 'approved',
      categories: ['Business', 'Design'],
      skills: ['Sublimation Printing', 'Tarpaulin Printing', 'Sticker Printing', 'Graphic Design'],
      languages: ['English', 'Filipino'],
      responseTime: 'within 24 hours',
      completedProjects: 0,
      socialLinks: {}
    },
    {
      userId: users[1]._id,
      name: 'Autopilot Car Spa',
      bio: 'Car care services including wash, vacuum, tire black, eco wash, engine wash, wax, and back-to-zero detailing.',
      location: {
        address: 'Guiuan, Eastern Samar',
        type: 'Point',
        coordinates: [125.726319, 11.028362]
      },
      rating: { average: 0, count: 0 },
      totalReviews: 0,
      totalServices: 0,
      isVerified: true,
      status: 'approved',
      categories: ['Other', 'Business'],
      skills: ['Car Wash', 'Vacuum', 'Tire Black', 'Eco Wash', 'Engine Wash', 'Wax', 'Back-to-Zero'],
      languages: ['English', 'Filipino'],
      responseTime: 'within 24 hours',
      completedProjects: 0,
      socialLinks: {}
    },
    {
      userId: users[2]._id,
      name: 'D. Graphics',
      bio: 'Comprehensive print and personalization: tarpaulin, stickers, full dye sublimation, business cards, documents, canvas, custom/digital/photo/poster printing, and laser engraving.',
      location: {
        address: 'Guiuan, Eastern Samar',
        type: 'Point',
        coordinates: [125.72548963410482, 11.031308341344237]
      },
      rating: { average: 0, count: 0 },
      totalReviews: 0,
      totalServices: 0,
      isVerified: true,
      status: 'approved',
      categories: ['Business', 'Design'],
      skills: ['Tarpaulin Printing', 'Sticker Printing', 'Dye Sublimation', 'Business Cards', 'Document Printing', 'Canvas Printing', 'Photo Printing', 'Poster Printing', 'Laser Engraving'],
      languages: ['English', 'Filipino'],
      responseTime: 'within 24 hours',
      completedProjects: 0,
      socialLinks: {}
    },
    {
      userId: users[3]._id,
      name: 'K&A Laundry Shop',
      bio: 'Laundry services: wash and fold, pickup/delivery, drying, dry cleaning, comforter and bedding, drapery/window covers, leather/suede, special care fabrics, and wedding gown dry clean.',
      location: {
        address: 'Guiuan, Eastern Samar',
        type: 'Point',
        coordinates: [125.7230544, 11.0306320]
      },
      rating: { average: 0, count: 0 },
      totalReviews: 0,
      totalServices: 0,
      isVerified: true,
      status: 'approved',
      categories: ['Other', 'Business'],
      skills: ['Laundry', 'Dry Cleaning', 'Pickup & Delivery', 'Special Care Fabrics', 'Wedding Gown Cleaning'],
      languages: ['English', 'Filipino'],
      responseTime: 'within 24 hours',
      completedProjects: 0,
      socialLinks: {}
    },
    {
      userId: users[4]._id,
      name: 'Duptours',
      bio: 'Passenger van transportation to Tacloban, Borongan, and other parts of Eastern Samar. Safe, reliable, and on schedule.',
      location: {
        address: 'Guiuan, Eastern Samar',
        type: 'Point',
        coordinates: [125.72459195093332, 11.030035953219619]
      },
      rating: { average: 0, count: 0 },
      totalReviews: 0,
      totalServices: 0,
      isVerified: true,
      status: 'approved',
      categories: ['Other'],
      skills: ['Passenger Transport', 'Van Service', 'Route Operations', 'Logistics'],
      languages: ['English', 'Filipino'],
      responseTime: 'within 2 hours',
      completedProjects: 0,
      socialLinks: {}
    },
    {
      userId: users[5]._id, // Adjust index based on order
      name: 'Foot Print Graphic',
      bio: 'We provide high-quality printing services including lamination, mug printing, t-shirt printing, product labels, ID pictures, souvenirs, and large-format tarpaulin printing.',
      location: {
        address: 'Guiuan, Eastern Samar',
        type: 'Point',
        coordinates: [125.723878497157, 11.033556955229262]
      },
      rating: { average: 0, count: 0 },
      totalReviews: 0,
      totalServices: 0,
      isVerified: true,
      status: 'approved',
      categories: ['Business', 'Design'],
      skills: ['Lamination', 'Mug Printing', 'T-shirt Printing', 'Product Labels', 'ID Pictures', 'Souvenirs', 'Large Format Tarpaulin Printing'],
      languages: ['English', 'Filipino'],
      responseTime: 'within 24 hours',
      completedProjects: 0,
      socialLinks: {}
    }
    
  ];

  return providers;
};


