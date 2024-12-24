# MentorConnect
MentorConnect is a platform that matches mentees with mentors based on shared interests and expertise. Users create profiles, search for matches, and connect through mutual interest. The platform features real-time chat, making it easy to communicate and schedule mentorship sessions efficiently.


## commands:
```docker compose up --build -d```
```docker exec -it mc-api python ./migrations/apply_migration.py ./migrations/001_initial_schema.sql```

src/
├── assets/                # Static files like images, fonts, and global styles
│   ├── images/            # Images and icons
│   ├── fonts/             # Fonts
│   ├── styles/            # Global CSS/SCSS files or Tailwind configurations
│   └── ...                # Other static assets
├── components/            # Reusable UI components
│   ├── Button/            # Example of a component folder
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   └── index.ts       # Barrel file (optional)
│   ├── Header/            # Example of another reusable component
│   └── ...
├── features/              # Feature-specific components and logic
│   ├── User/              # Example: User feature
│   │   ├── components/    # Feature-specific components
│   │   ├── hooks/         # Feature-specific hooks
│   │   ├── types.ts       # Type definitions for the feature
│   │   ├── utils.ts       # Utility functions for the feature
│   │   └── ...           
│   └── ...
├── hooks/                 # Reusable custom hooks
│   ├── useAuth.ts
│   ├── useFetch.ts
│   └── ...
├── layouts/               # Layout components (e.g., MainLayout, AuthLayout)
│   ├── MainLayout.tsx
│   ├── AuthLayout.tsx
│   └── ...
├── pages/                 # Page components (mapped to routes)
│   ├── Home/              # Example: Home page
│   │   ├── Home.tsx
│   │   ├── Home.module.css
│   │   └── index.ts       # Barrel file (optional)
│   ├── About/             # Example: About page
│   └── ...
├── providers/             # Context providers and global state
│   ├── AuthProvider.tsx
│   ├── ThemeProvider.tsx
│   ├── index.ts           # Barrel file (optional)
│   └── ...
├── routes/                # Routing configuration (if separated from pages)
│   ├── AppRoutes.tsx      # Centralized route definitions
│   └── ...
├── services/              # API calls and service integrations
│   ├── api/               # API request functions
│   │   ├── userApi.ts
│   │   ├── authApi.ts
│   │   └── ...
│   ├── storage/           # Utility functions for localStorage/sessionStorage
│   └── ...
├── store/                 # Global state management (e.g., Redux, Zustand, etc.)
│   ├── slices/            # Redux slices or Zustand stores
│   ├── index.ts           # Store initialization
│   └── ...
├── types/                 # Global TypeScript types
│   ├── index.d.ts         # Type declarations
│   ├── api.d.ts           # API response types
│   ├── user.d.ts          # User-related types
│   └── ...
├── utils/                 # Utility functions/helpers
│   ├── formatDate.ts
│   ├── logger.ts
│   └── ...
├── App.tsx                # Main app component
├── main.tsx               # Entry point for React and Vite
├── vite-env.d.ts          # TypeScript definitions for Vite
└── index.html             # HTML template for Vite