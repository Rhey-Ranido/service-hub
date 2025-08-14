/**
 * Service data for seeding the database
 * Organized by service categories and providers
 */

/**
 * Generate service data based on created providers
 * @param {Array} providers - Array of created provider objects
 * @returns {Array} Array of service objects
 */
export const generateServices = (providers) => {
  const services = [
    // Jerson Caibog - Web Development
    {
      providerId: providers[0]._id,
      title: 'Professional Web Development Services',
      description: 'I will create custom websites and web applications tailored to your business needs using modern technologies like React, Node.js, and responsive design. This service includes full-stack development, database integration, and deployment.',
      shortDescription: 'Custom website development with modern technologies including React, Node.js, and responsive design.',
      price: {
        amount: 150,
        unit: 'hour'
      },
      category: 'Technology',
      tags: ['Web Development', 'React', 'Node.js', 'Responsive', 'Full-stack'],
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
        average: 0,
        count: 0
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

    // Ivan Yakit - Video Editing
    {
      providerId: providers[1]._id,
      title: 'Professional Video Editing & Post-Production',
      description: 'High-quality video editing services for commercials, social media content, YouTube videos, and corporate presentations. Includes color grading, motion graphics, and special effects.',
      shortDescription: 'Professional video editing services for commercials, social media, and corporate content with advanced post-production.',
      price: {
        amount: 120,
        unit: 'hour'
      },
      category: 'Design',
      tags: ['Video Editing', 'Post-Production', 'Motion Graphics', 'Color Grading', 'Adobe Premiere'],
      images: [],
      featured: true,
      deliveryTime: '3-5 days',
      revisions: 2,
      requirements: ['Raw video footage', 'Project brief and style preferences', 'Brand guidelines'],
      faqs: [
        {
          question: 'What video formats do you work with?',
          answer: 'I work with all major video formats including MP4, MOV, AVI, and can export in any format you need.'
        },
        {
          question: 'Do you provide music and sound effects?',
          answer: 'I can suggest royalty-free music and sound effects, or you can provide your own audio files.'
        }
      ],
      rating: {
        average: 0,
        count: 0
      },
      totalOrders: 89,
      packages: [
        {
          name: 'Basic Edit',
          description: 'Simple video editing with basic transitions',
          price: 200,
          deliveryTime: '2-3 days',
          revisions: 1,
          features: ['Basic editing', 'Simple transitions', 'Color correction']
        },
        {
          name: 'Standard Edit',
          description: 'Advanced editing with motion graphics',
          price: 400,
          deliveryTime: '3-5 days',
          revisions: 2,
          features: ['Advanced editing', 'Motion graphics', 'Color grading', 'Sound mixing']
        },
        {
          name: 'Premium Edit',
          description: 'Full post-production with special effects',
          price: 800,
          deliveryTime: '5-7 days',
          revisions: 3,
          features: ['Special effects', 'Advanced motion graphics', 'Professional color grading', 'Audio mastering']
        }
      ]
    },

    // Ivan Yakit - Motion Graphics (Second service)
    {
      providerId: providers[1]._id,
      title: 'Motion Graphics & Animation Services',
      description: 'Professional motion graphics and animation services for commercials, explainer videos, and digital content. Specialized in creating engaging animated content that tells your story.',
      shortDescription: 'Professional motion graphics and animation for commercials and digital content.',
      price: {
        amount: 180,
        unit: 'hour'
      },
      category: 'Design',
      tags: ['Motion Graphics', 'Animation', 'After Effects', 'Digital Content', 'Commercials'],
      images: [],
      featured: false,
      deliveryTime: '5-7 days',
      revisions: 2,
      requirements: ['Project concept and storyboard', 'Brand assets and guidelines', 'Audio files if needed'],
      rating: {
        average: 0,
        count: 0
      },
      totalOrders: 45,
      packages: [
        {
          name: 'Simple Animation',
          description: 'Basic motion graphics and simple animations',
          price: 800,
          deliveryTime: '3-5 days',
          revisions: 1,
          features: ['Simple animations', 'Basic motion graphics', 'Logo animation']
        },
        {
          name: 'Complex Animation',
          description: 'Advanced motion graphics and complex animations',
          price: 1500,
          deliveryTime: '5-7 days',
          revisions: 2,
          features: ['Complex animations', 'Character animation', 'Advanced effects', 'Sound integration']
        }
      ]
    },

    // Aina Oprin - Content Writing
    {
      providerId: providers[2]._id,
      title: 'Professional Content Writing & Copywriting',
      description: 'Engaging content creation for websites, blogs, marketing materials, and social media platforms. SEO-optimized content that drives traffic and converts visitors into customers.',
      shortDescription: 'Professional content creation for websites, blogs, marketing materials, and social media platforms.',
      price: {
        amount: 65,
        unit: 'hour'
      },
      category: 'Writing',
      tags: ['Content Writing', 'Copywriting', 'SEO', 'Blog Writing', 'Marketing'],
      images: [],
      featured: false,
      deliveryTime: '3-5 days',
      revisions: 2,
      requirements: ['Content brief and target keywords', 'Brand voice guidelines', 'Target audience information'],
      rating: {
        average: 0,
        count: 0
      },
      totalOrders: 67,
      packages: [
        {
          name: 'Blog Post',
          description: 'SEO-optimized blog post (800-1200 words)',
          price: 150,
          deliveryTime: '3-5 days',
          revisions: 1,
          features: ['SEO optimization', 'Keyword research', 'Internal linking suggestions']
        },
        {
          name: 'Website Content',
          description: 'Complete website content package',
          price: 300,
          deliveryTime: '1 week',
          revisions: 2,
          features: ['Homepage content', 'About page', 'Service pages', 'Contact page']
        },
        {
          name: 'Content Strategy',
          description: 'Monthly content strategy and writing',
          price: 800,
          deliveryTime: 'Ongoing',
          revisions: 2,
          features: ['Content calendar', '8 blog posts/month', 'Social media content', 'SEO optimization']
        }
      ]
    },

    // Aina Oprin - Social Media Content (Second service)
    {
      providerId: providers[2]._id,
      title: 'Social Media Content Creation',
      description: 'Comprehensive social media content creation including posts, captions, hashtag research, and content strategy for various social media platforms.',
      shortDescription: 'Social media content creation and strategy for various platforms.',
      price: {
        amount: 45,
        unit: 'hour'
      },
      category: 'Writing',
      tags: ['Social Media', 'Content Creation', 'Instagram', 'Facebook', 'Content Strategy'],
      images: [],
      featured: false,
      deliveryTime: '2-3 days',
      revisions: 2,
      requirements: ['Brand guidelines and voice', 'Target audience information', 'Platform preferences'],
      rating: {
        average: 0,
        count: 0
      },
      totalOrders: 89,
      packages: [
        {
          name: 'Weekly Content',
          description: 'Social media content for one week',
          price: 500,
          deliveryTime: '2-3 days',
          revisions: 1,
          features: ['7 posts', 'Captions', 'Hashtag research', 'Content calendar']
        },
        {
          name: 'Monthly Package',
          description: 'Complete monthly social media content',
          price: 1800,
          deliveryTime: '1 week',
          revisions: 2,
          features: ['30 posts', 'Content strategy', 'Hashtag research', 'Analytics tracking', 'Monthly report']
        }
      ]
    }
  ];

  // Add remaining services for other providers
  services.push(...getBeautyWellnessServices(providers));
  services.push(...getEntertainmentServices(providers));
  services.push(...getBusinessServices(providers));
  services.push(...getPetServices(providers));
  services.push(...getFitnessServices(providers));

  return services;
};

// Beauty & Wellness Services (Jemerson Daganio)
const getBeautyWellnessServices = (providers) => [
  {
    providerId: providers[3]._id,
    title: 'Professional Beauty & Wellness Services',
    description: 'Comprehensive beauty and wellness services including hair styling, beauty treatments, spa services, and wellness consultations. Professional services for individuals and events.',
    shortDescription: 'Professional beauty and wellness services including hair styling, beauty treatments, and spa services.',
    price: {
      amount: 85,
      unit: 'hour'
    },
    category: 'Other',
    tags: ['Beauty', 'Wellness', 'Hair Styling', 'Spa Services', 'Beauty Treatments'],
    images: [],
    featured: false,
    deliveryTime: 'Same day - 1 week',
    revisions: 1,
    requirements: ['Service preferences', 'Skin/hair type information', 'Allergies or sensitivities'],
    rating: {
      average: 0,
      count: 0
    },
    totalOrders: 234,
    packages: [
      {
        name: 'Basic Hair Service',
        description: 'Haircut and basic styling',
        price: 500,
        deliveryTime: '2-3 hours',
        revisions: 1,
        features: ['Haircut', 'Basic styling', 'Hair consultation']
      },
      {
        name: 'Beauty Treatment',
        description: 'Facial and beauty treatment',
        price: 800,
        deliveryTime: '1-2 hours',
        revisions: 1,
        features: ['Facial treatment', 'Skin analysis', 'Beauty consultation']
      },
      {
        name: 'Spa Package',
        description: 'Complete spa and wellness experience',
        price: 1500,
        deliveryTime: '2-3 hours',
        revisions: 1,
        features: ['Full body massage', 'Facial treatment', 'Wellness consultation', 'Relaxation techniques']
      }
    ]
  },
  {
    providerId: providers[3]._id,
    title: 'Bridal & Event Beauty Services',
    description: 'Specialized bridal and event beauty services including makeup, hair styling, and beauty coordination for weddings and special events.',
    shortDescription: 'Bridal and event beauty services for weddings and special occasions.',
    price: {
      amount: 150,
      unit: 'project'
    },
    category: 'Other',
    tags: ['Bridal Makeup', 'Event Beauty', 'Wedding Services', 'Hair Styling', 'Special Events'],
    images: [],
    featured: false,
    deliveryTime: '1-2 days',
    revisions: 1,
    requirements: ['Event details and timeline', 'Beauty preferences and style', 'Skin type and allergies'],
    rating: {
      average: 0,
      count: 0
    },
    totalOrders: 67,
    packages: [
      {
        name: 'Bridal Package',
        description: 'Complete bridal beauty service',
        price: 3000,
        deliveryTime: '4-6 hours',
        revisions: 1,
        features: ['Bridal makeup', 'Hair styling', 'Trial session', 'Touch-ups']
      },
      {
        name: 'Event Beauty',
        description: 'Beauty services for special events',
        price: 1500,
        deliveryTime: '2-3 hours',
        revisions: 1,
        features: ['Event makeup', 'Hair styling', 'Beauty consultation']
      }
    ]
  },
  {
    providerId: providers[3]._id,
    title: 'Wellness & Relaxation Therapy',
    description: 'Professional wellness and relaxation therapy services including massage therapy, aromatherapy, and stress relief treatments.',
    shortDescription: 'Wellness and relaxation therapy services for stress relief and rejuvenation.',
    price: {
      amount: 120,
      unit: 'hour'
    },
    category: 'Other',
    tags: ['Wellness', 'Massage Therapy', 'Relaxation', 'Aromatherapy', 'Stress Relief'],
    images: [],
    featured: false,
    deliveryTime: '1-2 hours',
    revisions: 1,
    requirements: ['Health status and preferences', 'Specific areas of concern', 'Preferred therapy type'],
    rating: {
      average: 0,
      count: 0
    },
    totalOrders: 123,
    packages: [
      {
        name: 'Relaxation Session',
        description: 'Basic relaxation and massage therapy',
        price: 800,
        deliveryTime: '1 hour',
        revisions: 1,
        features: ['Full body massage', 'Aromatherapy', 'Relaxation techniques']
      },
      {
        name: 'Wellness Package',
        description: 'Complete wellness and therapy session',
        price: 1500,
        deliveryTime: '2 hours',
        revisions: 1,
        features: ['Full body massage', 'Aromatherapy', 'Stress relief therapy', 'Wellness consultation']
      }
    ]
  }
];

// Entertainment Services (Rhey Ranido)
const getEntertainmentServices = (providers) => [
  {
    providerId: providers[4]._id,
    title: 'Board Game Events & Entertainment',
    description: 'Professional board game events, tournaments, and entertainment services for parties, corporate events, and gatherings. Custom game experiences and tournament organization.',
    shortDescription: 'Professional board game events, tournaments, and entertainment services for parties and gatherings.',
    price: {
      amount: 100,
      unit: 'hour'
    },
    category: 'Other',
    tags: ['Board Games', 'Entertainment', 'Events', 'Tournaments', 'Game Master'],
    images: [],
    featured: false,
    deliveryTime: '1-2 weeks',
    revisions: 1,
    requirements: ['Event details and preferences', 'Number of participants', 'Venue information'],
    rating: {
      average: 0,
      count: 0
    },
    totalOrders: 145,
    packages: [
      {
        name: 'Game Night',
        description: 'Board game night for small groups',
        price: 800,
        deliveryTime: '1 week',
        revisions: 1,
        features: ['Game selection', 'Game master', 'Equipment provided', '3-4 hours']
      },
      {
        name: 'Tournament Event',
        description: 'Board game tournament for larger groups',
        price: 1500,
        deliveryTime: '2 weeks',
        revisions: 1,
        features: ['Tournament organization', 'Prizes', 'Equipment', 'Full day event']
      },
      {
        name: 'Corporate Event',
        description: 'Team building with board games',
        price: 2000,
        deliveryTime: '2 weeks',
        revisions: 1,
        features: ['Team building games', 'Professional facilitation', 'Equipment', 'Custom activities']
      }
    ]
  }
];

// Business Services (Marvin Opriassa, Beatriz Jane Dadula)
const getBusinessServices = (providers) => [
  {
    providerId: providers[5]._id,
    title: 'Piggery & Livestock Management Consulting',
    description: 'Professional piggery and livestock management services including farm setup, animal care, breeding programs, and sustainable farming practices. Expert consultation for farmers and agricultural businesses.',
    shortDescription: 'Professional piggery and livestock management services with sustainable farming practices.',
    price: {
      amount: 200,
      unit: 'hour'
    },
    category: 'Business',
    tags: ['Piggery', 'Livestock', 'Farming', 'Agriculture', 'Consulting'],
    images: [],
    featured: false,
    deliveryTime: '2-4 weeks',
    revisions: 1,
    requirements: ['Farm location and size', 'Current livestock information', 'Business goals'],
    rating: {
      average: 0,
      count: 0
    },
    totalOrders: 78,
    packages: [
      {
        name: 'Farm Assessment',
        description: 'Complete farm assessment and recommendations',
        price: 2000,
        deliveryTime: '1 week',
        revisions: 1,
        features: ['Site evaluation', 'Infrastructure assessment', 'Detailed report', 'Recommendations']
      },
      {
        name: 'Setup Consultation',
        description: 'New piggery setup and management',
        price: 5000,
        deliveryTime: '2-4 weeks',
        revisions: 1,
        features: ['Facility design', 'Equipment selection', 'Management systems', 'Training']
      },
      {
        name: 'Ongoing Management',
        description: 'Monthly management and consultation',
        price: 3000,
        deliveryTime: 'Monthly',
        revisions: 1,
        features: ['Monthly visits', 'Health monitoring', 'Performance tracking', 'Continuous improvement']
      }
    ]
  },
  {
    providerId: providers[5]._id,
    title: 'Agricultural Consulting & Training',
    description: 'Professional agricultural consulting and training services for farmers and agricultural businesses. Specialized in crop management, soil analysis, and farming techniques.',
    shortDescription: 'Agricultural consulting and training for farmers and agricultural businesses.',
    price: {
      amount: 180,
      unit: 'hour'
    },
    category: 'Business',
    tags: ['Agriculture', 'Farming Consultation', 'Crop Management', 'Soil Analysis', 'Training'],
    images: [],
    featured: false,
    deliveryTime: '1-2 weeks',
    revisions: 1,
    requirements: ['Farm details and current practices', 'Agricultural goals', 'Soil and crop information'],
    rating: {
      average: 0,
      count: 0
    },
    totalOrders: 34,
    packages: [
      {
        name: 'Farm Assessment',
        description: 'Complete agricultural assessment and recommendations',
        price: 2500,
        deliveryTime: '1 week',
        revisions: 1,
        features: ['Soil analysis', 'Crop assessment', 'Farming recommendations', 'Detailed report']
      },
      {
        name: 'Training Program',
        description: 'Agricultural training and education program',
        price: 5000,
        deliveryTime: '2 weeks',
        revisions: 1,
        features: ['Hands-on training', 'Best practices education', 'Ongoing support', 'Resource materials']
      }
    ]
  },
  {
    providerId: providers[6]._id,
    title: 'Professional Printing & Design Services',
    description: 'Comprehensive printing services for business and personal needs including business cards, flyers, banners, promotional materials, and custom printing solutions. High-quality digital printing with fast turnaround times.',
    shortDescription: 'Professional printing services for business cards, flyers, banners, and promotional materials.',
    price: {
      amount: 50,
      unit: 'project'
    },
    category: 'Business',
    tags: ['Printing', 'Design', 'Business Cards', 'Marketing Materials', 'Promotional Items'],
    images: [],
    featured: false,
    deliveryTime: '2-5 days',
    revisions: 2,
    requirements: ['Design specifications or content', 'Preferred colors and branding', 'Quantity requirements'],
    rating: {
      average: 0,
      count: 0
    },
    totalOrders: 92,
    packages: [
      {
        name: 'Basic Printing',
        description: 'Standard printing services for basic materials',
        price: 300,
        deliveryTime: '2-3 days',
        revisions: 1,
        features: ['Business cards (500 pcs)', 'Basic design', 'Standard paper quality']
      },
      {
        name: 'Premium Package',
        description: 'High-quality printing with design services',
        price: 800,
        deliveryTime: '3-5 days',
        revisions: 2,
        features: ['Custom design', 'Premium materials', 'Multiple items', 'Logo design']
      }
    ]
  },
  {
    providerId: providers[6]._id,
    title: 'Custom Promotional Materials & Branding',
    description: 'Create eye-catching promotional materials and branding solutions for your business. Includes logo design, brochures, posters, and complete brand identity packages.',
    shortDescription: 'Custom promotional materials and branding solutions for businesses.',
    price: {
      amount: 75,
      unit: 'project'
    },
    category: 'Business',
    tags: ['Branding', 'Logo Design', 'Promotional Materials', 'Marketing', 'Brand Identity'],
    images: [],
    featured: false,
    deliveryTime: '1 week',
    revisions: 3,
    requirements: ['Business information and preferences', 'Target audience details', 'Brand vision and style preferences'],
    rating: {
      average: 0,
      count: 0
    },
    totalOrders: 67,
    packages: [
      {
        name: 'Logo Design',
        description: 'Professional logo design with variations',
        price: 1200,
        deliveryTime: '5-7 days',
        revisions: 3,
        features: ['3 logo concepts', 'Unlimited revisions', 'Multiple file formats', 'Brand guidelines']
      },
      {
        name: 'Complete Branding',
        description: 'Full brand identity package',
        price: 2500,
        deliveryTime: '1-2 weeks',
        revisions: 3,
        features: ['Logo design', 'Business cards', 'Letterhead', 'Brand guidelines', 'Marketing materials']
      }
    ]
  }
];

// Pet Services (Fritz Kirby Delacruz)
const getPetServices = (providers) => [
  {
    providerId: providers[7]._id,
    title: 'Professional Pet Grooming Services',
    description: 'Complete pet grooming services including bathing, hair cutting, nail trimming, and styling. Professional care for dogs and cats with premium products and techniques.',
    shortDescription: 'Professional pet grooming services for dogs and cats with premium care.',
    price: {
      amount: 800,
      unit: 'project'
    },
    category: 'Other',
    tags: ['Pet Grooming', 'Pet Care', 'Animal Services', 'Dog Grooming', 'Cat Grooming'],
    images: [],
    featured: false,
    deliveryTime: '2-4 hours',
    revisions: 1,
    requirements: ['Pet information and health status', 'Grooming preferences', 'Any special needs or allergies'],
    rating: {
      average: 0,
      count: 0
    },
    totalOrders: 156,
    packages: [
      {
        name: 'Basic Grooming',
        description: 'Essential grooming services',
        price: 500,
        deliveryTime: '2 hours',
        revisions: 1,
        features: ['Bath and dry', 'Basic haircut', 'Nail trimming', 'Ear cleaning']
      },
      {
        name: 'Full Service',
        description: 'Complete grooming and styling',
        price: 800,
        deliveryTime: '3 hours',
        revisions: 1,
        features: ['Premium bath', 'Professional styling', 'Nail care', 'Dental cleaning', 'Aromatherapy']
      }
    ]
  },
  {
    providerId: providers[7]._id,
    title: 'Pet Training & Behavioral Services',
    description: 'Professional pet training services including obedience training, behavioral correction, and specialized training programs. Expert guidance for pet owners to build strong relationships with their pets.',
    shortDescription: 'Professional pet training and behavioral services for dogs and cats.',
    price: {
      amount: 120,
      unit: 'hour'
    },
    category: 'Other',
    tags: ['Pet Training', 'Animal Behavior', 'Obedience Training', 'Pet Psychology', 'Animal Care'],
    images: [],
    featured: false,
    deliveryTime: '2-8 weeks',
    revisions: 1,
    requirements: ['Pet information and current behavior', 'Training goals and objectives', 'Owner availability for sessions'],
    rating: {
      average: 0,
      count: 0
    },
    totalOrders: 89,
    packages: [
      {
        name: 'Basic Obedience',
        description: 'Essential obedience training',
        price: 1500,
        deliveryTime: '4 weeks',
        revisions: 1,
        features: ['Basic commands', '8 training sessions', 'Owner guidance', 'Progress tracking']
      },
      {
        name: 'Advanced Training',
        description: 'Comprehensive training program',
        price: 3000,
        deliveryTime: '8 weeks',
        revisions: 1,
        features: ['Advanced commands', 'Behavioral correction', '16 sessions', 'Specialized training']
      }
    ]
  },
  {
    providerId: providers[7]._id,
    title: 'Pet Boarding & Care Services',
    description: 'Safe and comfortable pet boarding services with 24/7 care and attention. Professional pet sitting, feeding, exercise, and companionship while owners are away.',
    shortDescription: 'Professional pet boarding and care services with 24/7 attention.',
    price: {
      amount: 600,
      unit: 'day'
    },
    category: 'Other',
    tags: ['Pet Boarding', 'Pet Sitting', 'Animal Care', 'Pet Services', 'Pet Companionship'],
    images: [],
    featured: false,
    deliveryTime: 'Flexible',
    revisions: 1,
    requirements: ['Pet health records and vaccination', 'Feeding schedule and preferences', 'Emergency contact information'],
    rating: {
      average: 0,
      count: 0
    },
    totalOrders: 134,
    packages: [
      {
        name: 'Day Care',
        description: 'Daily pet care and supervision',
        price: 400,
        deliveryTime: '8-10 hours',
        revisions: 1,
        features: ['Feeding', 'Exercise', 'Companionship', 'Basic grooming']
      },
      {
        name: 'Overnight Boarding',
        description: 'Complete overnight care',
        price: 600,
        deliveryTime: '24 hours',
        revisions: 1,
        features: ['24/7 supervision', 'Feeding', 'Exercise', 'Comfort items', 'Updates to owner']
      }
    ]
  }
];

// Fitness Services (Alvin Alvarez)
const getFitnessServices = (providers) => [
  {
    providerId: providers[8]._id,
    title: 'Personal Fitness Training & Coaching',
    description: 'Professional personal training services with customized workout programs, nutrition guidance, and fitness coaching. Specialized in athletic performance, weight management, and overall fitness improvement.',
    shortDescription: 'Professional personal training with customized workout programs and nutrition guidance.',
    price: {
      amount: 150,
      unit: 'hour'
    },
    category: 'Other',
    tags: ['Personal Training', 'Fitness Coaching', 'Athletic Performance', 'Nutrition', 'Weight Management'],
    images: [],
    featured: false,
    deliveryTime: 'Ongoing',
    revisions: 1,
    requirements: ['Fitness goals and objectives', 'Current fitness level assessment', 'Health history and limitations'],
    rating: {
      average: 0,
      count: 0
    },
    totalOrders: 203,
    packages: [
      {
        name: 'Basic Training',
        description: 'Personal training sessions',
        price: 1200,
        deliveryTime: '1 month',
        revisions: 1,
        features: ['8 training sessions', 'Workout plan', 'Basic nutrition guidance', 'Progress tracking']
      },
      {
        name: 'Complete Program',
        description: 'Comprehensive fitness program',
        price: 3000,
        deliveryTime: '3 months',
        revisions: 1,
        features: ['24 sessions', 'Custom meal plans', 'Performance tracking', 'Lifestyle coaching']
      }
    ]
  },
  {
    providerId: providers[8]._id,
    title: 'Sports Coaching & Athletic Development',
    description: 'Professional sports coaching for various sports including basketball, volleyball, and general athletic development. Focus on skill improvement, strategy, and competitive performance.',
    shortDescription: 'Professional sports coaching and athletic development for competitive performance.',
    price: {
      amount: 180,
      unit: 'hour'
    },
    category: 'Other',
    tags: ['Sports Coaching', 'Athletic Development', 'Basketball', 'Volleyball', 'Competition Training'],
    images: [],
    featured: false,
    deliveryTime: 'Ongoing',
    revisions: 1,
    requirements: ['Sport and skill level', 'Training goals and timeline', 'Available training schedule'],
    rating: {
      average: 0,
      count: 0
    },
    totalOrders: 145,
    packages: [
      {
        name: 'Individual Coaching',
        description: 'One-on-one sports coaching',
        price: 1500,
        deliveryTime: '1 month',
        revisions: 1,
        features: ['8 coaching sessions', 'Skill development', 'Performance analysis', 'Training plan']
      },
      {
        name: 'Team Coaching',
        description: 'Team training and development',
        price: 4000,
        deliveryTime: '1 month',
        revisions: 1,
        features: ['Team strategy', 'Group training', 'Competition preparation', 'Performance tracking']
      }
    ]
  }
];


