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
    {
      providerId: providers[0]._id,
      title: "Custom Sublimation Apparel",
      description:
        "Fully customized sublimation for jerseys, polo shirts, and t-shirts. Durable, vibrant prints with your design or ours.",
      shortDescription:
        "Custom sublimation jerseys, polo shirts, and t-shirts.",
      price: { amount: 350, unit: "project" },
      category: "Business",
      tags: ["Sublimation", "Jersey", "Polo Shirt", "T-Shirt", "Printing"],
      images: [],
      featured: true,
      deliveryTime: "3-7 days",
      revisions: 2,
      requirements: [
        "Shirt type and sizes",
        "Design files or brief",
        "Color specifications",
      ],
      faqs: [
        {
          question: "Do you accept bulk orders?",
          answer: "Yes, we offer bulk pricing for teams and events.",
        },
        {
          question: "Can you help with the design?",
          answer: "We can create or refine your design as needed.",
        },
      ],
      rating: { average: 0, count: 0 },
      totalOrders: 0,
      packages: [
        {
          name: "Basic",
          description: "Single shirt design",
          price: 350,
          deliveryTime: "3-4 days",
          revisions: 1,
          features: ["1 shirt", "Front print", "Basic color options"],
        },
        {
          name: "Team Pack",
          description: "Up to 10 shirts",
          price: 3200,
          deliveryTime: "5-7 days",
          revisions: 2,
          features: [
            "10 shirts",
            "Front/back print",
            "Name/number customization",
          ],
        },
        {
          name: "Pro Team",
          description: "Up to 20 shirts",
          price: 6000,
          deliveryTime: "7-10 days",
          revisions: 2,
          features: [
            "20 shirts",
            "Full design customization",
            "Size mix included",
          ],
        },
      ],
    },
    {
      providerId: providers[0]._id,
      title: "Tarpaulin and Sticker Printing",
      description:
        "High-quality tarpaulin and sticker printing for events, businesses, and personal needs. Multiple sizes and finishes available.",
      shortDescription: "Tarpaulin banners and custom stickers.",
      price: { amount: 100, unit: "project" },
      category: "Business",
      tags: ["Tarpaulin", "Stickers", "Large Format", "Printing"],
      images: [],
      featured: false,
      deliveryTime: "1-3 days",
      revisions: 1,
      requirements: [
        "Dimensions and quantity",
        "Design files or brief",
        "Finishing preferences (matte/glossy)",
      ],
      faqs: [
        {
          question: "What sizes do you support?",
          answer: "We print common standard sizes and custom dimensions.",
        },
        {
          question: "Are stickers weatherproof?",
          answer: "Outdoor-grade options are available upon request.",
        },
      ],
      rating: { average: 0, count: 0 },
      totalOrders: 0,
      packages: [
        {
          name: "Sticker Set",
          description: "100pcs die-cut stickers",
          price: 500,
          deliveryTime: "2 days",
          revisions: 1,
          features: ["Vinyl material", "Die-cut", "Full color"],
        },
        {
          name: "Tarpaulin Standard",
          description: "2x3 ft tarpaulin",
          price: 300,
          deliveryTime: "1 day",
          revisions: 1,
          features: ["Full color", "Hem and grommets"],
        },
        {
          name: "Business Bundle",
          description: "Tarpaulin + 200 stickers",
          price: 1200,
          deliveryTime: "2-3 days",
          revisions: 1,
          features: ["Bundle discount", "Mixed sizes", "Color proofing"],
        },
      ],
    },
    {
      providerId: providers[1]._id,
      title: "Car Wash Packages",
      description:
        "Complete car wash services including exterior wash, interior vacuum, and tire black. Eco wash option available.",
      shortDescription: "Wash, vacuum, tire black, eco wash options.",
      price: { amount: 200, unit: "project" },
      category: "Other",
      tags: ["Car Wash", "Vacuum", "Tire Black", "Eco Wash"],
      images: [],
      featured: true,
      deliveryTime: "1-2 hours",
      revisions: 0,
      requirements: ["Vehicle type and size", "Service preferences"],
      faqs: [
        {
          question: "Do you have eco-friendly options?",
          answer:
            "Yes, our eco wash uses water-saving methods and eco-safe products.",
        },
        {
          question: "How long does it take?",
          answer: "Standard wash takes 1-2 hours depending on queue.",
        },
      ],
      rating: { average: 0, count: 0 },
      totalOrders: 0,
      packages: [
        {
          name: "Basic Wash",
          description: "Exterior wash + tire black",
          price: 200,
          deliveryTime: "1 hour",
          revisions: 0,
          features: ["Exterior wash", "Tire black"],
        },
        {
          name: "Eco Wash",
          description: "Water-saving eco wash + vacuum",
          price: 300,
          deliveryTime: "1-1.5 hours",
          revisions: 0,
          features: ["Eco wash", "Interior vacuum", "Tire black"],
        },
        {
          name: "Premium Clean",
          description: "Wash + vacuum + interior wipe-down",
          price: 450,
          deliveryTime: "1.5-2 hours",
          revisions: 0,
          features: [
            "Exterior wash",
            "Vacuum",
            "Interior wipe-down",
            "Tire black",
          ],
        },
      ],
    },
    {
      providerId: providers[1]._id,
      title: "Back-to-Zero Detailing",
      description:
        "Comprehensive restoration including engine wash, waxing, and deep interior clean to bring your car back to its best.",
      shortDescription: "Engine wash, waxing, and deep clean restoration.",
      price: { amount: 1500, unit: "project" },
      category: "Other",
      tags: ["Engine Wash", "Wax", "Detailing", "Back-to-Zero"],
      images: [],
      featured: false,
      deliveryTime: "4-6 hours",
      revisions: 0,
      requirements: [
        "Vehicle condition details",
        "Preferred schedule",
        "Special concerns",
      ],
      faqs: [
        {
          question: "Is engine wash safe?",
          answer: "We use proper methods to protect sensitive components.",
        },
        {
          question: "What is included?",
          answer:
            "Exterior decontamination, engine bay cleaning, waxing, and deep interior clean.",
        },
      ],
      rating: { average: 0, count: 0 },
      totalOrders: 0,
      packages: [
        {
          name: "Standard Restore",
          description: "Engine wash + wax",
          price: 1500,
          deliveryTime: "4 hours",
          revisions: 0,
          features: ["Engine wash", "Wax"],
        },
        {
          name: "Full Restore",
          description: "Engine wash + wax + deep interior",
          price: 2200,
          deliveryTime: "6 hours",
          revisions: 0,
          features: ["Engine wash", "Wax", "Deep interior clean"],
        },
      ],
    },
    {
      providerId: providers[2]._id,
      title: "Comprehensive Printing & Sublimation",
      description:
        "Tarpaulin, stickers, business cards, business documents, canvas, custom, digital, dye sublimation, photo and poster printing. High quality with fast turnaround.",
      shortDescription:
        "Tarps, stickers, cards, docs, canvas, dye sub, photo/poster.",
      price: { amount: 250, unit: "project" },
      category: "Business",
      tags: [
        "Tarpaulin",
        "Stickers",
        "Business Cards",
        "Documents",
        "Canvas",
        "Digital Printing",
        "Dye Sublimation",
        "Photo Printing",
        "Posters",
      ],
      images: [],
      featured: true,
      deliveryTime: "1-3 days",
      revisions: 1,
      requirements: [
        "Print dimensions and quantity",
        "Design files or brief",
        "Material/finish preferences",
      ],
      faqs: [
        {
          question: "Do you accept rush orders?",
          answer:
            "Yes, rush options are available depending on queue and size.",
        },
        {
          question: "Can you help with layout?",
          answer: "We provide basic layout assistance for simple jobs.",
        },
      ],
      rating: { average: 0, count: 0 },
      totalOrders: 0,
      packages: [
        {
          name: "Business Card Pack",
          description: "200 pcs standard cards",
          price: 300,
          deliveryTime: "1-2 days",
          revisions: 1,
          features: ["Full color", "Matte/glossy"],
        },
        {
          name: "Tarpaulin Standard",
          description: "2x3 ft tarpaulin",
          price: 300,
          deliveryTime: "1 day",
          revisions: 1,
          features: ["Full color", "Hem & grommets"],
        },
        {
          name: "Sticker Pack",
          description: "100 pcs die-cut",
          price: 500,
          deliveryTime: "2 days",
          revisions: 1,
          features: ["Vinyl", "Die-cut"],
        },
      ],
    },
    {
      providerId: providers[2]._id,
      title: "Laser Engraving Services",
      description:
        "Precision laser engraving for metals, acrylics, wood, leather, and more. Perfect for personalization and branding.",
      shortDescription: "Custom laser engraving on various materials.",
      price: { amount: 400, unit: "project" },
      category: "Business",
      tags: ["Laser Engraving", "Personalization", "Branding"],
      images: [],
      featured: false,
      deliveryTime: "2-3 days",
      revisions: 1,
      requirements: [
        "Material type",
        "Design file or text",
        "Size and placement",
      ],
      faqs: [
        {
          question: "What materials can you engrave?",
          answer: "Metals, wood, acrylic, leather, glass (etching), and more.",
        },
        {
          question: "Do you provide materials?",
          answer: "We can source common blanks or engrave on supplied items.",
        },
      ],
      rating: { average: 0, count: 0 },
      totalOrders: 0,
      packages: [
        {
          name: "Name Plate",
          description: "Small metal/acrylic plate",
          price: 400,
          deliveryTime: "2 days",
          revisions: 1,
          features: ["Vector engraving"],
        },
        {
          name: "Gift Personalization",
          description: "Engrave on provided item",
          price: 700,
          deliveryTime: "2-3 days",
          revisions: 1,
          features: ["Custom text/logo"],
        },
      ],
    },
    {
      providerId: providers[3]._id,
      title: "Laundry Wash & Fold with Pickup/Delivery",
      description:
        "Convenient wash & fold service with optional pickup and delivery. Fast turnaround and careful handling.",
      shortDescription: "Wash & fold with pickup/delivery.",
      price: { amount: 120, unit: "project" },
      category: "Other",
      tags: ["Laundry", "Wash & Fold", "Pickup", "Delivery", "Drying"],
      images: [],
      featured: true,
      deliveryTime: "1 day",
      revisions: 0,
      requirements: [
        "Pickup address and schedule",
        "Special instructions (detergent, fabric softener)",
      ],
      faqs: [
        {
          question: "Do you separate colors?",
          answer: "Yes, colors and whites are separated to prevent bleeding.",
        },
        {
          question: "Do you offer same-day?",
          answer: "Same-day may be available depending on queue.",
        },
      ],
      rating: { average: 0, count: 0 },
      totalOrders: 0,
      packages: [
        {
          name: "Basic Load",
          description: "Up to 5kg wash & fold",
          price: 120,
          deliveryTime: "1 day",
          revisions: 0,
          features: ["Wash", "Dry", "Fold"],
        },
        {
          name: "Family Load",
          description: "Up to 10kg wash & fold",
          price: 220,
          deliveryTime: "1 day",
          revisions: 0,
          features: ["Wash", "Dry", "Fold"],
        },
      ],
    },
    {
      providerId: providers[3]._id,
      title: "Specialty Cleaning & Dry Clean",
      description:
        "Dry cleaning and special care for comforters, bedding, drapery/window covers, leather/suede, and wedding gowns.",
      shortDescription: "Dry clean and specialty fabric care.",
      price: { amount: 300, unit: "project" },
      category: "Other",
      tags: [
        "Dry Cleaning",
        "Comforter",
        "Bedding",
        "Drapery",
        "Leather",
        "Suede",
        "Wedding Gown",
      ],
      images: [],
      featured: false,
      deliveryTime: "2-4 days",
      revisions: 0,
      requirements: [
        "Item type and material",
        "Stain/issue details",
        "Care label notes",
      ],
      faqs: [
        {
          question: "Do you handle delicate fabrics?",
          answer: "Yes, we follow care labels and use appropriate methods.",
        },
        {
          question: "Can you remove tough stains?",
          answer:
            "We will assess and apply the best technique; results vary by stain.",
        },
      ],
      rating: { average: 0, count: 0 },
      totalOrders: 0,
      packages: [
        {
          name: "Comforter Clean",
          description: "1 comforter dry clean",
          price: 300,
          deliveryTime: "2-3 days",
          revisions: 0,
          features: ["Delicate handling", "Odor removal"],
        },
        {
          name: "Wedding Gown",
          description: "Gown dry clean & preserve",
          price: 1500,
          deliveryTime: "4 days",
          revisions: 0,
          features: ["Gentle cleaning", "Storage advice"],
        },
      ],
    },
    {
      providerId: providers[4]._id,
      title: "Tacloban / Borongan Van Transport",
      description:
        "Scheduled passenger van trips between Guiuan and Tacloban/Borongan. Comfortable seats, air-conditioned vans, professional drivers.",
      shortDescription: "Scheduled van service to Tacloban/Borongan.",
      price: { amount: 350, unit: "project" },
      category: "Other",
      tags: ["Transport", "Van", "Tacloban", "Borongan", "Passenger"],
      images: [],
      featured: true,
      deliveryTime: "Same day",
      revisions: 0,
      requirements: [
        "Passenger count",
        "Preferred trip time",
        "Pickup location",
      ],
      faqs: [
        {
          question: "Do you accept reservations?",
          answer: "Yes, reserve your seat ahead to secure your slot.",
        },
        {
          question: "Baggage policy?",
          answer: "Standard luggage allowed; oversized items subject to space.",
        },
      ],
      rating: { average: 0, count: 0 },
      totalOrders: 0,
      packages: [
        {
          name: "Tacloban Trip",
          description: "One-way to/from Tacloban",
          price: 350,
          deliveryTime: "Same day",
          revisions: 0,
          features: ["AC van", "Reserved seating"],
        },
        {
          name: "Borongan Trip",
          description: "One-way to/from Borongan",
          price: 300,
          deliveryTime: "Same day",
          revisions: 0,
          features: ["AC van", "Reserved seating"],
        },
      ],
    },
    {
      providerId: providers[4]._id,
      title: "Eastern Samar Routes",
      description:
        "Passenger van services covering other municipalities in Eastern Samar. Safe and reliable trips.",
      shortDescription: "Van transport to other Eastern Samar towns.",
      price: { amount: 300, unit: "project" },
      category: "Other",
      tags: ["Transport", "Eastern Samar", "Van Service"],
      images: [],
      featured: false,
      deliveryTime: "Same day",
      revisions: 0,
      requirements: [
        "Route details",
        "Passenger count",
        "Pickup/drop-off points",
      ],
      faqs: [
        {
          question: "Custom routes?",
          answer: "Yes, subject to availability and fare adjustment.",
        },
        {
          question: "Group bookings?",
          answer: "We can accommodate private/group trips with advance notice.",
        },
      ],
      rating: { average: 0, count: 0 },
      totalOrders: 0,
      packages: [
        {
          name: "Private Trip",
          description: "Chartered van within Eastern Samar",
          price: 2500,
          deliveryTime: "Same day",
          revisions: 0,
          features: ["Dedicated van", "Flexible schedule"],
        },
        {
          name: "Shared Trip",
          description: "Per-seat shared transport",
          price: 300,
          deliveryTime: "Same day",
          revisions: 0,
          features: ["AC van", "Assigned seat"],
        },
      ],
    },
    {
      providerId: providers[5]._id,
      title: 'T-shirt Printing',
      description: 'High-quality t-shirt printing for personal, business, or event needs.',
      shortDescription: 'Custom printed t-shirts.',
      price: {
        amount: 250,
        currency: 'PHP'
      },
      category: 'Other', // use a valid enum value
      tags: ['T-shirt Printing', 'Custom Apparel', 'Event Printing'],
      images: [],
      featured: true,
      deliveryTime: '3 days',
      revisions: 1,
      requirements: ['T-shirt size and design'],
      faqs: [
        {
          question: 'Can I bring my own t-shirts for printing?',
          answer: 'Yes, you may provide your own shirts or use ours.'
        },
        {
          question: 'Do you accept bulk orders?',
          answer: 'Yes, we offer discounts for bulk orders of 20 shirts or more.'
        }
      ],
      rating: { average: 0, count: 0 },
      totalOrders: 0,
      packages: []
    },
    {
      providerId: providers[5]._id,
      title: 'Large Format Tarpaulin Printing',
      description: 'Durable and high-quality large format tarpaulin printing for events and promotions.',
      shortDescription: 'Large tarpaulin printing.',
      price: {
        amount: 700,
        currency: 'PHP'
      },
      category: 'Other', // must match your schema enum
      tags: ['Tarpaulin Printing', 'Large Format', 'Event Materials'],
      images: [],
      featured: false,
      deliveryTime: '2 days',
      revisions: 1,
      requirements: ['Tarpaulin size and design'],
      faqs: [
        {
          question: 'What is the maximum size of tarpaulin you can print?',
          answer: 'We can print up to 10ft wide tarpaulins.'
        },
        {
          question: 'How long does printing usually take?',
          answer: 'Most orders are completed within 2 days depending on size.'
        }
      ],
      rating: { average: 0, count: 0 },
      totalOrders: 0,
      packages: []
    }
    
  ];

  // No additional providers in fresh seed

  return services;
};
