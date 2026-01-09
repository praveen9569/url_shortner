# URL Shortener - Complete Deployment Guide

## 🚀 Deployment Overview

Your URL Shortener has three components to deploy:
1. **Backend** - Node.js/Express API
2. **Frontend** - React/Vite application
3. **Database** - PostgreSQL

---

## ✅ Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Backend builds without errors
- [ ] Frontend builds without errors
- [ ] Database migrations ready
- [ ] Choose hosting platform
- [ ] Domain name ready (optional but recommended)

---

## 📋 Option 1: Deploy on Vercel (Recommended for Beginners)

### ✨ Why Vercel?
- Free tier available
- Easy setup with Git integration
- Automatic deployments on push
- Built-in environment variables
- Fast CDN for frontend

### Step 1: Prepare Backend (.env file)

Create `.env` in your root directory:
```
DATABASE_URL=postgresql://username:password@your-db-host:5432/url_shortner_db
NODE_ENV=production
PORT=3000
JWT_SECRET=your-secret-key-here-change-this-to-something-secure
CORS_ORIGIN=https://your-frontend-domain.com
```

### Step 2: Setup Database on Railway or Supabase

**Option A: Railway (Easiest)**
1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project → Add PostgreSQL
4. Copy DATABASE_URL from Railway
5. Paste into .env

**Option B: Supabase (Free tier)**
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database → Connection String
4. Copy and paste into .env

### Step 3: Prepare Backend for Deployment

Add to `package.json` build script:
```json
"scripts": {
  "start": "node index.js",
  "build": "echo 'Backend ready'",
  "dev": "node --watch index"
}
```

Create `vercel.json` in root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

### Step 4: Deploy Backend

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables from .env
5. Deploy!

Your backend URL: `https://your-project.vercel.app`

### Step 5: Deploy Frontend

1. Update `frontend/.env.production`:
```
VITE_API_URL=https://your-project.vercel.app
```

2. Go to Vercel dashboard
3. New project → Import `frontend` folder
4. Add environment variable
5. Deploy!

Your frontend URL: `https://your-frontend.vercel.app`

---

## 📋 Option 2: Deploy on Render (Recommended)

### Why Render?
- Free tier with automatic deployments
- Better for Node.js apps
- Easy database integration
- Custom domains included

### Step 1: Create Render Account
Go to https://render.com and sign up

### Step 2: Deploy Database
1. Dashboard → New + → PostgreSQL
2. Name: `url-shortener-db`
3. Choose free tier
4. Create
5. Copy External Database URL

### Step 3: Deploy Backend
1. Push code to GitHub
2. Dashboard → New + → Web Service
3. Connect GitHub repository
4. Fill details:
   - Name: `url-shortener-api`
   - Runtime: `Node`
   - Build: `npm install`
   - Start: `npm start`
5. Add Environment Variables:
   - `DATABASE_URL` = (from PostgreSQL)
   - `JWT_SECRET` = (your secret key)
   - `CORS_ORIGIN` = (your frontend URL)
6. Deploy!

Your backend URL: `https://url-shortener-api.onrender.com`

### Step 4: Deploy Frontend
1. Update `frontend/.env.production`:
```
VITE_API_URL=https://url-shortener-api.onrender.com
```

2. In frontend folder, create `render.yaml`:
```yaml
services:
  - type: web
    name: url-shortener-frontend
    buildCommand: pnpm install && pnpm run build
    startCommand: pnpm run preview
    envVars:
      - key: VITE_API_URL
        value: https://url-shortener-api.onrender.com
```

3. Push to GitHub
4. Dashboard → New + → Web Service
5. Connect frontend repo
6. Deploy!

---

## 📋 Option 3: Docker Deployment (Advanced)

### Why Docker?
- Consistent across all environments
- Easy to manage with docker-compose
- Deploy anywhere (AWS, DigitalOcean, etc.)

### Step 1: Create Backend Dockerfile

Create `Dockerfile` in root:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Step 2: Create Frontend Dockerfile

Create `frontend/Dockerfile`:
```dockerfile
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Step 3: Update docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:16
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: url_shortner_db
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: .
    restart: always
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@db:5432/url_shortner_db
      NODE_ENV: production
      JWT_SECRET: ${JWT_SECRET}
      CORS_ORIGIN: http://frontend:3000
    ports:
      - "3000:3000"
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    restart: always
    environment:
      VITE_API_URL: http://backend:3000
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  db_data:
```

### Step 4: Deploy with Docker

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

---

## 🔐 Environment Variables Checklist

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
NODE_ENV=production
JWT_SECRET=your-random-secret-key-min-32-characters
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend-domain.com
```

---

## 🗄️ Database Migration Steps

### Before Deployment:
1. Test locally with `npm run db:push`
2. Verify migrations run: `npm run db:studio`

### After Deployment:
```bash
# Push database schema to production
DATABASE_URL=your_production_url npm run db:push
```

---

## ✅ Post-Deployment Verification

- [ ] Backend API responds: `https://your-backend/health`
- [ ] Frontend loads without errors
- [ ] Can create account
- [ ] Can login
- [ ] Can shorten URLs
- [ ] Redirects work correctly

---

## 🚨 Common Issues & Solutions

### Frontend can't connect to backend
- Check CORS_ORIGIN matches frontend URL
- Verify VITE_API_URL in frontend .env.production
- Check if backend is running

### Database connection fails
- Verify DATABASE_URL format
- Check if database is accessible
- Ensure firewall allows connection
- Verify credentials are correct

### Build fails
- Clear node_modules and reinstall
- Check Node.js version (need v18+)
- Verify all environment variables are set

---

## 📞 Quick Start (Recommended Path)

### For Quick Deployment (5-10 minutes):
1. Use **Render** (free tier)
2. Deploy database first
3. Deploy backend with DATABASE_URL
4. Deploy frontend with API_URL
5. Test everything

### Expected Timeline:
- Database setup: 2 minutes
- Backend deployment: 3 minutes
- Frontend deployment: 2 minutes
- Testing: 3 minutes
- **Total: ~10 minutes**

---

## 🎯 Next Steps

Choose your deployment option above and follow step-by-step. Need help? Check the troubleshooting section or the specific platform's documentation.

**Happy Deploying! 🚀**
