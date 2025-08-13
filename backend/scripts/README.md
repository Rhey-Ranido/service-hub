# Seed Data Structure

This directory contains a modular seed data system for better maintainability and organization.

## Directory Structure

```
backend/scripts/
├── data/                    # Data modules
│   ├── users.js            # User seed data
│   ├── providers.js        # Provider seed data  
│   ├── services.js         # Service seed data
│   └── reviews.js          # Review seed data
├── utils/                  # Utility functions
│   └── coordinates.js      # Location coordinate generation
├── seedData.js             # Main seed script
└── README.md               # This documentation
```

## Data Modules

### `data/users.js`
- Contains user data generation function
- Includes provider users, client users, and admin users
- All passwords are hashed using bcrypt
- Users are from Guiuan, Eastern Samar

### `data/providers.js`
- Contains provider profile data
- Uses coordinate utility for location generation
- Includes skills, categories, social links, and ratings
- Organized by service specializations

### `data/services.js`
- Contains service listings organized by categories:
  - Technology (Web Development)
  - Design (Video Editing, Motion Graphics)
  - Writing (Content Writing, Social Media)
  - Beauty & Wellness
  - Entertainment (Board Games)
  - Business (Agriculture, Printing)
  - Pet Services
  - Fitness & Sports
- Each service includes packages, pricing, and requirements

### `data/reviews.js`
- Contains review generation functions
- Generates both service and provider reviews
- Uses sample comments for variety
- Creates realistic rating distributions (4-5 stars)

## Utility Functions

### `utils/coordinates.js`
- Generates nearby coordinates within specified radius
- Uses Guiuan, Eastern Samar as central location
- Helps create realistic location data for providers

## Usage

Run the seed script:
```bash
node backend/scripts/seedData.js
```

The script will:
1. Clear existing data
2. Create users from the users module
3. Create providers using the providers module
4. Generate services using the services module
5. Create sample reviews using the reviews module
6. Update all rating statistics

## Benefits of Modular Structure

1. **Maintainability**: Each data type is in its own file
2. **Reusability**: Modules can be imported individually
3. **Testability**: Each module can be tested separately
4. **Scalability**: Easy to add new data types or modify existing ones
5. **Organization**: Clear separation of concerns
6. **Version Control**: Changes to specific data types are isolated

## Test Credentials

After seeding, you can use these credentials:
- **Provider**: jerson.caibog@example.com / password123
- **Client**: client@example.com / password123
- **Admin**: admin@example.com / password123
