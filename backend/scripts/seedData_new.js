import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Provider from '../models/Provider.js';
import Service from '../models/Service.js';
import ServiceReview from '../models/ServiceReview.js';
import ProviderReview from '../models/ProviderReview.js';

// Import data modules
import { generateUsers } from './data/users.js';
import { generateProviders } from './data/providers.js';
import { generateServices } from './data/services.js';
import { generateServiceReviews, generateProviderReviews } from './data/reviews.js';

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
    await ServiceReview.deleteMany({});
    await ProviderReview.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Generate and create users
    const users = await generateUsers();
    const createdUsers = await User.insertMany(users);
    console.log('👥 Created users');

    // Generate and create providers
    const providers = generateProviders(createdUsers);
    const createdProviders = await Provider.insertMany(providers);
    console.log('🏢 Created providers');

    // Generate and create services
    const services = generateServices(createdProviders);
    const createdServices = await Service.insertMany(services);
    console.log('🛠️ Created services');

    // Generate and create reviews
    console.log('📝 Creating sample reviews...');
    
    const serviceReviews = generateServiceReviews(createdServices, createdUsers);
    const providerReviews = generateProviderReviews(createdProviders, createdUsers);

    // Insert reviews
    await ServiceReview.insertMany(serviceReviews);
    await ProviderReview.insertMany(providerReviews);
    console.log(`📝 Created ${serviceReviews.length} service reviews and ${providerReviews.length} provider reviews`);
    
    // Update all ratings after creating reviews
    console.log('📊 Updating all ratings...');
    await Service.updateAllRatingStats();
    await Provider.updateAllRatingStats();
    console.log('✅ All ratings updated');

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users created: ${createdUsers.length}`);
    console.log(`🏢 Providers created: ${createdProviders.length}`);
    console.log(`🛠️ Services created: ${services.length}`);
    console.log(`📝 Service reviews created: ${serviceReviews.length}`);
    console.log(`📝 Provider reviews created: ${providerReviews.length}`);
    console.log('\n🔐 Test credentials:');
    console.log('Provider: jerson.caibog@example.com / password123');
    console.log('Client: client@example.com / password123');
    console.log('\n📍 All providers are located within 1-5km of your location in Guiuan, Eastern Samar');

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
























