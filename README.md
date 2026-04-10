# SchoolOS

A comprehensive school management system with frontend and backend services.

## Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL (for local development)
- Redis (for caching)

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd frontend && npm install
   ```

3. Install backend dependencies:
   ```bash
   cd server && npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.production.example server/.env
   ```

### Development

Start frontend:
```bash
cd frontend && npm run dev
```

Start backend:
```bash
cd server && npm run dev
```

## Testing

### Frontend Tests (Vitest)
```bash
cd frontend && npm run test
```

Run with coverage:
```bash
cd frontend && npm run test -- --coverage
```

### Backend Tests (Jest)
```bash
cd server && npm test
```

Run with coverage:
```bash
cd server && npm test -- --coverage
```

## Docker Deployment

### Local Development with Docker Compose
```bash
docker-compose up -d
```

This starts:
- Frontend on http://localhost:3000
- Backend on http://localhost:3001
- PostgreSQL on port 5432
- Redis on port 6379

### Production Deployment
```bash
chmod +x deploy.sh
./deploy.sh production
```

Or manually:
```bash
# Build images
docker-compose -f docker-compose.yml build

# Start services
docker-compose up -d

# Run migrations
docker-compose exec backend npx prisma migrate deploy
```

## Environment Variables

Copy `.env.production.example` to `.env` and configure:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3001)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `REDIS_URL` - Redis connection string

## CI/CD

- **CI**: GitHub Actions runs linting, type checking, and tests on push/PR to main or develop branches
- **Deploy**: Manual trigger via GitHub Actions workflow dispatch to staging or production

## Project Structure

```
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   └── __tests__/  # Frontend tests
│   └── vitest.config.js
├── server/             # Express + TypeScript backend
│   ├── src/
│   │   └── __tests__/  # Backend tests
│   └── jest.config.js
├── .github/workflows/  # CI/CD configuration
└── docker-compose.yml  # Docker services
```