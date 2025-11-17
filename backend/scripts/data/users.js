import bcrypt from 'bcryptjs';

/**
 * User data for seeding the database
 * All users are from Guiuan, Eastern Samar
 */

/**
 * Generate user data with hashed passwords
 * @returns {Promise<Array>} Array of user objects with hashed passwords
 */
export const generateUsers = async () => {
  const users = [
    {
      email: 'franz.graphics@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'provider',
      firstName: 'Franz',
      lastName: 'Graphics',
      isVerified: true
    },
    {
      email: 'autopilot.carspa@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'provider',
      firstName: 'Autopilot',
      lastName: 'Car Spa',
      isVerified: true
    },
    {
      email: 'd.graphics@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'provider',
      firstName: 'D.',
      lastName: 'Graphics',
      isVerified: true
    },
    {
      email: 'ka.laundry@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'provider',
      firstName: 'K&A',
      lastName: 'Laundry Shop',
      isVerified: true
    },
    {
      email: 'duptours@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'provider',
      firstName: 'Duptours',
      lastName: 'Transport',
      isVerified: true
    },
    {
      email: 'footprint.graphic@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'provider',
      firstName: 'Foot Print',
      lastName: 'Graphic',
      isVerified: true
    },
    {
      email: 'admin@admin.com',
      password: await bcrypt.hash('admin123', 12),
      role: 'admin',
      firstName: 'admin',
      lastName: 'admin',
      isVerified: true
    }
  ];

  return users;
};


