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
      email: 'jerson.caibog@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'provider',
      firstName: 'Jerson',
      lastName: 'Caibog',
      profileImage: 'profiles/IMG_20230723_194132-1754998212749-962197956.jpg',
      isVerified: true
    },
    {
      email: 'ivan.yakit@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'provider',
      firstName: 'Ivan',
      lastName: 'Yakit',
      profileImage: 'profiles/vitanitas-1753919330058-890385048.jpg',
      isVerified: true
    },
    {
      email: 'aina.oprin@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'provider',
      firstName: 'Aina',
      lastName: 'Oprin',
      profileImage: 'profiles/heroImage-1753531824758-508842195.jpg',
      isVerified: true
    },
    {
      email: 'jemerson.daganio@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'provider',
      firstName: 'Jemerson',
      lastName: 'Daganio',
      profileImage: 'profiles/heroImage-1753234516939-132793031.jpg',
      isVerified: true
    },
    {
      email: 'rhey.ranido@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'provider',
      firstName: 'Rhey',
      lastName: 'Ranido',
      profileImage: 'profiles/IMG_20230723_194132-1754998212749-962197956.jpg',
      isVerified: true
    },
    {
      email: 'marvin.opriassa@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'provider',
      firstName: 'Marvin',
      lastName: 'Opriassa',
      profileImage: 'profiles/vitanitas-1753919330058-890385048.jpg',
      isVerified: true
    },
    {
      email: 'beatriz.dadula@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'provider',
      firstName: 'Beatriz Jane',
      lastName: 'Dadula',
      profileImage: 'profiles/heroImage-1753531824758-508842195.jpg',
      isVerified: true
    },
    {
      email: 'fritz.delacruz@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'provider',
      firstName: 'Fritz Kirby',
      lastName: 'Delacruz',
      profileImage: 'profiles/vitanitas-1753919330058-890385048.jpg',
      isVerified: true
    },
    {
      email: 'alvin.alvarez@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'provider',
      firstName: 'Alvin',
      lastName: 'Alvarez',
      profileImage: 'profiles/heroImage-1753234516939-132793031.jpg',
      isVerified: true
    },
    {
      email: 'client@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'client',
      firstName: 'Test',
      lastName: 'Client',
      isVerified: true
    },
    {
      email: 'admin@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      isVerified: true
    }
  ];

  return users;
};


