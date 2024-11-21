# MentorConnect
MentorConnect is a platform that matches mentees with mentors based on shared interests and expertise. Users create profiles, search for matches, and connect through mutual interest. The platform features real-time chat, making it easy to communicate and schedule mentorship sessions efficiently.


## commands:
```docker compose up --build -d```
```docker exec -it mc-api python ./migrations/apply_migration.py ./migrations/001_initial_schema.sql```

/project-root
  ├── Dockerfile
  ├── next.config.ts         # Next.js configuration
  ├── package.json
  ├── postcss.config.mjs     # PostCSS configuration for Tailwind CSS
  ├── public/                # Public assets (accessible via /public paths)
  │   ├── favicon.ico
  │   ├── fonts/
  ├── README.md
  ├── tailwind.config.ts     # Tailwind CSS configuration
  ├── tsconfig.json          # TypeScript configuration
  ├── src/
  │   ├── app/               # Application routing and pages
  │   │   ├── favicon.ico
  │   │   ├── fonts/
  │   │   ├── globals.css    # Global CSS
  │   │   ├── layout.tsx     # Root layout for the app
  │   │   ├── page.tsx       # Home page
  │   │   ├── dashboard/     # Example feature-based route
  │   │   │   ├── layout.tsx # Layout specific to the dashboard
  │   │   │   └── page.tsx   # Dashboard page
  │   ├── components/        # Reusable components
  │   │   ├── Button.tsx
  │   │   ├── Navbar.tsx
  │   │   └── Footer.tsx
  │   ├── hooks/             # Custom React hooks
  │   │   └── useExample.ts
  │   ├── lib/               # Utilities and library code
  │   │   ├── api.ts         # Axios or fetch API wrapper
  │   │   └── helpers.ts     # Helper functions
  │   ├── styles/            # CSS Modules or additional styles
  │   │   └── custom.css
  │   ├── types/             # Global TypeScript type definitions
  │   │   └── index.d.ts
  │   └── utils/             # Utility functions
  │       └── constants.ts
  └── node_modules/          # Dependencies

