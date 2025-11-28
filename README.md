# MentorConnect 🤝

A full-stack mentorship matching platform that intelligently connects mentees with mentors based on shared interests, expertise, and geographic proximity. Built with real-time communication capabilities and modern web technologies.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.9+-blue.svg)
![React](https://img.shields.io/badge/react-18.3.1-blue.svg)
![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)

## ✨ Features

### Core Functionality
- 🎯 **Smart Matching Algorithm** - AI-powered mentor-mentee matching based on interests, expertise, and location
- 💬 **Real-time Chat** - WebSocket-based instant messaging with Socket.IO
- 🔔 **Live Notifications** - Real-time updates for matches, messages, and profile interactions
- 📍 **Geolocation Services** - PostGIS integration for location-based mentor discovery
- 👁️ **Profile Analytics** - Track profile views, likes, and visitor history
- ⭐ **Favorites System** - Save and manage favorite mentor/mentee profiles

### User Management
- 🔐 **Secure Authentication** - JWT-based auth with asymmetric encryption
- ✉️ **Email Verification** - Account verification via email
- 🔑 **Password Recovery** - Secure password reset flow
- 🚫 **Safety Features** - User blocking and reporting system
- 👤 **Rich Profiles** - Comprehensive user profiles with interests, bio, and expertise

### Technical Features
- 📱 **Responsive Design** - Mobile-first UI built with React and Tailwind CSS
- 🐳 **Containerized** - Full Docker support with Docker Compose
- 🔄 **Database Migrations** - Version-controlled schema management
- 🚀 **Production Ready** - Nginx reverse proxy and Gunicorn WSGI server
- 📊 **State Management** - Efficient client state with Zustand

## 🛠️ Tech Stack

### Backend
- **Framework**: Flask 2.1.3 with Flask-SocketIO for WebSockets
- **Database**: PostgreSQL 15 with PostGIS extension
- **Cache/Queue**: Redis for session management and message brokering
- **Authentication**: PyJWT with asymmetric key encryption
- **Email**: Flask-Mail for transactional emails
- **Server**: Gunicorn with Eventlet workers

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **State Management**: Zustand 5.0.2
- **UI Components**: Ant Design 5.22.5 + Tailwind CSS 3.4.16
- **Real-time**: Socket.IO Client 4.8.1
- **Routing**: React Router DOM 7.0.2
- **Maps**: React Leaflet 4.2.1
- **Build Tool**: Vite 6.0.3

### DevOps
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **Version Control**: Git

## 🏗️ Architecture
## 🏗️ Architecture

![MentorConnect Architecture](./docs/architecture-diagram.png)

### Design Patterns
- **MVC Architecture**: Clear separation between Controllers, Services, and Data layers
- **Service-Oriented**: Business logic isolated in service layer for reusability
- **Repository Pattern**: Database access abstracted through services
- **Event-Driven**: Real-time updates via WebSocket events

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose installed
- Git
- (Optional) Python 3.9+ and Node.js 18+ for local development

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/momeaizi/MentorConnect.git
cd MentorConnect
```

2. **Set up environment variables**
```bash
# Create .env file in project root
cp .env.example .env

# Edit .env with your configuration
nano .env
```

3. **Start the application**
```bash
# Build and start all containers
docker compose up --build -d

# Apply database migrations
docker exec -it mc-api python ./migrations/apply_migration.py ./migrations/001_initial_schema.sql

# (Optional) Seed database with sample data
docker exec -it mc-api python ./migrations/seed.py
```

4. **Access the application**
- Frontend: http://localhost:7777
- API: http://localhost:7777/api
- Database: localhost:5432

### Development Setup

**Backend Development**
```bash
cd mc-api

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
python application.py
```

**Frontend Development**
```bash
cd mc-ui

# Install dependencies
npm install

# Run development server
npm run dev
```

## 📁 Project Structure

```
MentorConnect/
├── mc-api/                      # Backend API
│   ├── app/
│   │   ├── main/
│   │   │   ├── controllers/    # Route handlers
│   │   │   ├── services/       # Business logic
│   │   │   └── utils/          # Helper functions
│   │   └── db/                 # Database connections
│   ├── migrations/             # Database migrations
│   ├── application.py          # Flask app entry point
│   ├── requirements.txt        # Python dependencies
│   └── dockerfile
│
├── mc-ui/                       # Frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API client
│   │   ├── hooks/              # Custom React hooks
│   │   ├── routes/             # Route configuration
│   │   ├── types/              # TypeScript types
│   │   └── utils/              # Utility functions
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml           # Container orchestration
├── nginx.conf                   # Nginx configuration
├── Makefile                     # Build automation
└── README.md
```

## 📚 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register              # Register new user
POST   /api/auth/login                 # Login user
POST   /api/auth/verify_account        # Resend verification email
GET    /api/auth/verify/<token>        # Verify email
POST   /api/auth/forgot-password       # Request password reset
POST   /api/auth/reset-password/<token> # Reset password
PATCH  /api/auth/update-password       # Update password
```

### Profile Endpoints
```
GET    /api/profiles/<username>        # Get profile by username
GET    /api/profiles/suggestions       # Get matching suggestions
GET    /api/profiles                   # Search profiles
POST   /api/profiles/<id>/view         # Record profile view
GET    /api/profiles/viewers           # Get who viewed your profile
GET    /api/profiles/viewed            # Get profiles you viewed
GET    /api/profiles/liked             # Get liked profiles
POST   /api/profiles/<id>/like         # Like a profile
DELETE /api/profiles/<id>/like         # Unlike a profile
```

### Chat Endpoints
```
GET    /api/chat/conversations         # Get all conversations
GET    /api/chat/<user_id>/messages    # Get messages with user
POST   /api/chat/<user_id>/messages    # Send message
```

### User Management
```
GET    /api/users                      # Get all users (admin)
GET    /api/users/<id>                 # Get user by ID
PATCH  /api/users/<id>                 # Update user
DELETE /api/users/<id>                 # Delete user
POST   /api/users/<id>/block           # Block user
POST   /api/users/<id>/report          # Report user
```

### WebSocket Events
```
connect                                # Client connects
disconnect                             # Client disconnects
send_message                           # Send chat message
receive_message                        # Receive chat message
notification                           # Receive notification
typing                                 # User typing indicator
```

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
# Database Configuration
DB_NAME=mentorconnect_db
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_HOST=mc-postgres
DB_PORT=5432

# Redis Configuration
REDIS_URL=redis://mc-redis:6379/0

# JWT Configuration
SECRET_KEY=your_secret_key_here
JWT_ALGORITHM=RS256
JWT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
JWT_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----

# Email Configuration
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# Application Configuration
APP_ENV=development
FRONTEND_URL=http://localhost:7777
```

### Generate JWT Keys
```bash
# Generate private key
openssl genrsa -out private_key.pem 2048

# Generate public key
openssl rsa -in private_key.pem -pubout -out public_key.pem

# Convert to single line for .env (replace \n with \\n)
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' private_key.pem
```

## 🧪 Testing

```bash
# Run backend tests
cd mc-api
pytest

# Run frontend tests
cd mc-ui
npm test

# Run E2E tests
npm run test:e2e
```

## 📦 Production Deployment

### Using Docker Compose
```bash
# Set APP_ENV=production in .env
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### Manual Deployment
1. Set up PostgreSQL and Redis
2. Configure environment variables
3. Build frontend: `cd mc-ui && npm run build`
4. Deploy backend with Gunicorn
5. Configure Nginx as reverse proxy

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- **Backend**: Follow PEP 8 guidelines
- **Frontend**: ESLint configuration provided
- Write meaningful commit messages
- Add tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Mohamed Ait Meziane**
- GitHub: [@momeaizi](https://github.com/momeaizi)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Flask and React communities
- Socket.IO for real-time capabilities
- PostgreSQL and PostGIS teams
- All contributors and supporters

## 📞 Support

If you have any questions or need help, please:
- Open an issue
- Contact: your.email@example.com
- Check existing documentation

---

**Made with ❤️ by Mohamed Ait Meziane**
