import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Provider from '../models/Provider.js';
import Service from '../models/Service.js';

dotenv.config();

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Provider.deleteMany({});
    await Service.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create sample users
    const users = [
      {
        email: 'john.smith@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'provider',
        firstName: 'John',
        lastName: 'Smith',
        isVerified: true
      },
      {
        email: 'sarah.johnson@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'provider',
        firstName: 'Sarah',
        lastName: 'Johnson',
        isVerified: true
      },
      {
        email: 'mike.chen@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'provider',
        firstName: 'Mike',
        lastName: 'Chen',
        isVerified: true
      },
      {
        email: 'emma.wilson@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'provider',
        firstName: 'Emma',
        lastName: 'Wilson',
        isVerified: true
      },
      {
        email: 'david.brown@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'provider',
        firstName: 'David',
        lastName: 'Brown',
        isVerified: true
      },
      {
        email: 'lisa.garcia@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'provider',
        firstName: 'Lisa',
        lastName: 'Garcia',
        isVerified: true
      },
      {
        email: 'client@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'client',
        firstName: 'Test',
        lastName: 'Client',
        isVerified: true
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('👥 Created users');

    // Create providers
    const providers = [
      {
        userId: createdUsers[0]._id,
        name: 'John Smith',
        bio: 'Full-stack developer with 8+ years of experience in modern web technologies. Specialized in React, Node.js, and cloud solutions.',
        location: {
          address: 'San Francisco, CA',
          type: 'Point',
          coordinates: [-122.4194, 37.7749]
        },
        rating: {
          average: 4.8,
          count: 24
        },
        totalReviews: 24,
        totalServices: 2,
        isVerified: true,
        status: 'approved',
        categories: ['Technology'],
        skills: ['React', 'Node.js', 'JavaScript', 'MongoDB', 'AWS'],
        languages: ['English', 'Spanish'],
        responseTime: 'within 2 hours',
        completedProjects: 156,
        socialLinks: {
          website: 'https://johnsmith.dev',
          linkedin: 'https://linkedin.com/in/johnsmith',
          github: 'https://github.com/johnsmith'
        }
      },
      {
        userId: createdUsers[1]._id,
        name: 'Sarah Johnson',
        bio: 'Digital marketing strategist helping businesses grow their online presence through SEO, content marketing, and social media.',
        location: {
          address: 'New York, NY',
          type: 'Point',
          coordinates: [-74.0060, 40.7128]
        },
        rating: {
          average: 4.9,
          count: 31
        },
        totalReviews: 31,
        totalServices: 1,
        isVerified: true,
        status: 'approved',
        categories: ['Marketing'],
        skills: ['SEO', 'Content Marketing', 'Google Analytics', 'Social Media', 'PPC'],
        languages: ['English'],
        responseTime: 'within 4 hours',
        completedProjects: 89,
        socialLinks: {
          website: 'https://sarahmarketing.com',
          linkedin: 'https://linkedin.com/in/sarahjohnson'
        }
      },
      {
        userId: createdUsers[2]._id,
        name: 'Mike Chen',
        bio: 'Mobile app developer specializing in React Native and Flutter. Creating beautiful, performant apps for iOS and Android.',
        location: {
          address: 'Seattle, WA',
          type: 'Point',
          coordinates: [-122.3321, 47.6062]
        },
        rating: {
          average: 4.7,
          count: 18
        },
        totalReviews: 18,
        totalServices: 1,
        isVerified: true,
        status: 'approved',
        categories: ['Technology'],
        skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase'],
        languages: ['English', 'Mandarin'],
        responseTime: 'within 6 hours',
        completedProjects: 67,
        socialLinks: {
          github: 'https://github.com/mikechen'
        }
      },
      {
        userId: createdUsers[3]._id,
        name: 'Emma Wilson',
        bio: 'Creative graphic designer and brand strategist. I help businesses create memorable visual identities and marketing materials.',
        location: {
          address: 'Los Angeles, CA',
          type: 'Point',
          coordinates: [-118.2437, 34.0522]
        },
        rating: {
          average: 4.9,
          count: 42
        },
        totalReviews: 42,
        totalServices: 1,
        isVerified: true,
        status: 'approved',
        categories: ['Design'],
        skills: ['Graphic Design', 'Branding', 'Adobe Creative Suite', 'Logo Design', 'Print Design'],
        languages: ['English'],
        responseTime: 'within 3 hours',
        completedProjects: 234,
        socialLinks: {
          website: 'https://emmadesigns.com',
          linkedin: 'https://linkedin.com/in/emmawilson'
        }
      },
      {
        userId: createdUsers[4]._id,
        name: 'David Brown',
        bio: 'Professional content writer and copywriter with expertise in SEO-optimized content, blog posts, and marketing copy.',
        location: {
          address: 'Austin, TX',
          type: 'Point',
          coordinates: [-97.7431, 30.2672]
        },
        rating: {
          average: 4.6,
          count: 28
        },
        totalReviews: 28,
        totalServices: 1,
        isVerified: false,
        status: 'approved',
        categories: ['Writing'],
        skills: ['Content Writing', 'Copywriting', 'SEO Writing', 'Blog Writing', 'Technical Writing'],
        languages: ['English'],
        responseTime: 'within 12 hours',
        completedProjects: 145,
        socialLinks: {
          website: 'https://davidwrites.com'
        }
      },
      {
        userId: createdUsers[5]._id,
        name: 'Lisa Garcia',
        bio: 'Business consultant with 15+ years of experience helping companies optimize operations, develop strategies, and drive growth.',
        location: {
          address: 'Chicago, IL',
          type: 'Point',
          coordinates: [-87.6298, 41.8781]
        },
        rating: {
          average: 4.8,
          count: 35
        },
        totalReviews: 35,
        totalServices: 1,
        isVerified: true,
        status: 'approved',
        categories: ['Business'],
        skills: ['Business Strategy', 'Operations', 'Financial Planning', 'Market Research', 'Process Optimization'],
        languages: ['English', 'Spanish'],
        responseTime: 'within 8 hours',
        completedProjects: 78,
        socialLinks: {
          linkedin: 'https://linkedin.com/in/lisagarcia'
        }
      }
    ];

    const createdProviders = await Provider.insertMany(providers);
    console.log('🏢 Created providers');

    // Create services
    const services = [
      {
        providerId: createdProviders[0]._id,
        title: 'Professional Web Development',
        description: 'I will create a custom website tailored to your business needs using modern technologies like React, Node.js, and MongoDB. This service includes responsive design, SEO optimization, performance optimization, and deployment to your preferred hosting platform.',
        shortDescription: 'Custom website development with modern technologies including React, Node.js, and responsive design.',
        price: {
          amount: 150,
          unit: 'hour'
        },
        category: 'Technology',
        tags: ['Web Development', 'React', 'Node.js', 'Responsive', 'SEO'],
        images: [],
        featured: true,
        deliveryTime: '1-2 weeks',
        revisions: 3,
        requirements: ['Project requirements document', 'Brand guidelines (if available)', 'Content and images'],
        faqs: [
          {
            question: 'Do you provide hosting?',
            answer: 'I can help you set up hosting on platforms like Netlify, Vercel, or AWS, but hosting costs are separate.'
          },
          {
            question: 'Will the website be mobile-friendly?',
            answer: 'Yes, all websites I create are fully responsive and optimized for mobile devices.'
          }
        ],
        rating: {
          average: 4.8,
          count: 24
        },
        totalOrders: 156,
        packages: [
          {
            name: 'Basic',
            description: 'Simple landing page with up to 3 sections',
            price: 800,
            deliveryTime: '5-7 days',
            revisions: 2,
            features: ['Responsive design', 'Contact form', 'SEO basics']
          },
          {
            name: 'Standard',
            description: 'Multi-page website with CMS integration',
            price: 1500,
            deliveryTime: '1-2 weeks',
            revisions: 3,
            features: ['Up to 5 pages', 'CMS integration', 'Advanced SEO', 'Analytics setup']
          },
          {
            name: 'Premium',
            description: 'Full-featured web application',
            price: 3000,
            deliveryTime: '2-3 weeks',
            revisions: 5,
            features: ['Custom functionality', 'Database integration', 'User authentication', 'Admin panel']
          }
        ]
      },
      {
        providerId: createdProviders[1]._id,
        title: 'Digital Marketing & SEO',
        description: 'Comprehensive digital marketing strategy to boost your online presence and drive more traffic to your business. Includes SEO audit, keyword research, content strategy, and performance tracking.',
        shortDescription: 'Comprehensive digital marketing strategies to boost your online presence and drive more traffic to your business.',
        price: {
          amount: 120,
          unit: 'hour'
        },
        category: 'Marketing',
        tags: ['SEO', 'Marketing', 'Analytics', 'Social Media'],
        images: [],
        featured: false,
        deliveryTime: '2-3 weeks',
        revisions: 2,
        requirements: ['Website access', 'Google Analytics access', 'Business goals and target audience info'],
        faqs: [
          {
            question: 'How long before I see results?',
            answer: 'SEO typically takes 3-6 months to show significant results, but you may see improvements in website traffic within the first month.'
          }
        ],
        rating: {
          average: 4.9,
          count: 31
        },
        totalOrders: 89
      },
      {
        providerId: createdProviders[2]._id,
        title: 'Mobile App Development',
        description: 'Native and cross-platform mobile app development for iOS and Android using React Native and Flutter. From concept to app store deployment.',
        shortDescription: 'Native and cross-platform mobile app development for iOS and Android with modern frameworks.',
        price: {
          amount: 180,
          unit: 'hour'
        },
        category: 'Technology',
        tags: ['Mobile', 'iOS', 'Android', 'React Native', 'Flutter'],
        images: [],
        featured: false,
        deliveryTime: '4-8 weeks',
        revisions: 3,
        requirements: ['App wireframes or mockups', 'Detailed feature requirements', 'App store developer accounts'],
        rating: {
          average: 4.7,
          count: 18
        },
        totalOrders: 67
      },
      {
        providerId: createdProviders[3]._id,
        title: 'Graphic Design & Branding',
        description: 'Creative graphic design services including logo design, branding packages, marketing materials, and print design. I help businesses create memorable visual identities.',
        shortDescription: 'Creative graphic design services including logo design, branding, and marketing materials for your business.',
        price: {
          amount: 85,
          unit: 'hour'
        },
        category: 'Design',
        tags: ['Design', 'Branding', 'Logo', 'Creative', 'Print'],
        images: [],
        featured: true,
        deliveryTime: '1-2 weeks',
        revisions: 4,
        requirements: ['Brand brief and preferences', 'Target audience information', 'Any existing brand materials'],
        rating: {
          average: 4.9,
          count: 42
        },
        totalOrders: 234
      },
      {
        providerId: createdProviders[4]._id,
        title: 'Content Writing & Copywriting',
        description: 'Professional content creation for websites, blogs, marketing materials, and social media platforms. SEO-optimized content that engages your audience and drives results.',
        shortDescription: 'Professional content creation for websites, blogs, marketing materials, and social media platforms.',
        price: {
          amount: 65,
          unit: 'hour'
        },
        category: 'Writing',
        tags: ['Writing', 'Content', 'Copywriting', 'SEO', 'Blog'],
        images: [],
        featured: false,
        deliveryTime: '3-5 days',
        revisions: 2,
        requirements: ['Content brief and target keywords', 'Brand voice guidelines', 'Target audience information'],
        rating: {
          average: 4.6,
          count: 28
        },
        totalOrders: 145
      },
      {
        providerId: createdProviders[5]._id,
        title: 'Business Consulting',
        description: 'Strategic business consulting to help grow your company, optimize operations, and increase profitability. Includes market analysis, process optimization, and growth strategies.',
        shortDescription: 'Strategic business consulting to help grow your company, optimize operations, and increase profitability.',
        price: {
          amount: 200,
          unit: 'hour'
        },
        category: 'Business',
        tags: ['Consulting', 'Strategy', 'Business', 'Growth', 'Operations'],
        images: [],
        featured: false,
        deliveryTime: '2-4 weeks',
        revisions: 1,
        requirements: ['Business overview and current challenges', 'Financial statements (if applicable)', 'Goals and objectives'],
        rating: {
          average: 4.8,
          count: 35
        },
        totalOrders: 78
      }
    ];

    await Service.insertMany(services);
    console.log('🛠️ Created services');

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users created: ${createdUsers.length}`);
    console.log(`🏢 Providers created: ${createdProviders.length}`);
    console.log(`🛠️ Services created: ${services.length}`);
    console.log('\n🔐 Test credentials:');
    console.log('Provider: john.smith@example.com / password123');
    console.log('Client: client@example.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the seed function
seedData(); 