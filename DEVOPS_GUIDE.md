# DevOps Learning Roadmap for M&A Platform

## 📚 Learning Path Overview

**Total Time**: 4-6 weeks (2-3 hours/day)
**Difficulty**: Beginner to Intermediate
**Goal**: Deploy your M&A platform to production with CI/CD, monitoring, and best practices

---

## 🎯 Phase 1: Docker (Week 1-2)

### Why Docker?
- Package your app with all dependencies
- Run anywhere (dev, test, prod) consistently
- Easy scaling and deployment
- Industry standard

### Learning Resources

**Free Courses** (Pick one):
1. **Docker Official Tutorial** (2-3 hours)
   - https://docs.docker.com/get-started/
   - Best starting point, official docs

2. **freeCodeCamp Docker Course** (2 hours)
   - https://www.youtube.com/watch?v=fqMOX6JJhGo
   - Great visual explanations

3. **Docker for Beginners** by Mumshad Mannambeth (4 hours)
   - https://kodekloud.com/courses/docker-for-the-absolute-beginner/
   - Free tier available, very hands-on

**Recommended Learning Order**:
1. Day 1-2: What is Docker, Images vs Containers
2. Day 3-4: Dockerfile basics, building images
3. Day 5-6: Docker Compose for multi-container apps
4. Day 7: Volumes and networking

### Hands-On Practice for Your App

#### Step 1: Install Docker Desktop
```bash
# Download from: https://www.docker.com/products/docker-desktop/
# Windows: Docker Desktop for Windows
# Verify installation:
docker --version
docker-compose --version
```

#### Step 2: Create Dockerfile for Backend
Create `backend/Dockerfile`:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]
```

#### Step 3: Create Dockerfile for Frontend
Create `frontend/Dockerfile`:
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Step 4: Create docker-compose.yml
Create in root directory:
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    container_name: mna-mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=mna_platform

  backend:
    build: ./backend
    container_name: mna-backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/mna_platform
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    container_name: mna-frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

#### Step 5: Test Locally
```bash
# Build and run all containers
docker-compose up --build

# Access app at http://localhost
# Stop with Ctrl+C, then:
docker-compose down
```

**Practice Exercises**:
- [ ] Build individual Docker images for backend/frontend
- [ ] Run containers and connect them
- [ ] Use docker-compose to orchestrate all services
- [ ] Debug inside containers with `docker exec -it <container> sh`

---

## 🚀 Phase 2: CI/CD with GitHub Actions (Week 3)

### Why CI/CD?
- Automatic testing on every code push
- Automatic deployment when tests pass
- Catch bugs early
- Consistent deployment process

### Learning Resources

**Free Courses**:
1. **GitHub Actions Tutorial** (1 hour)
   - https://docs.github.com/en/actions/learn-github-actions
   - Official GitHub tutorial

2. **CI/CD with GitHub Actions** by freeCodeCamp (2 hours)
   - https://www.youtube.com/watch?v=R8_veQiYBjI
   - Practical examples

**Recommended Learning Order**:
1. Day 1: What is CI/CD, GitHub Actions basics
2. Day 2: Workflows, jobs, and steps
3. Day 3: Testing automation
4. Day 4: Deployment automation
5. Day 5: Secrets management

### Hands-On Practice for Your App

#### Step 1: Create CI Workflow
Create `.github/workflows/ci.yml`:
```yaml
name: CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        working-directory: ./backend
        run: npm ci
        
      - name: Run tests
        working-directory: ./backend
        run: npm test
        
      - name: Lint code
        working-directory: ./backend
        run: npm run lint

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
        
      - name: Build
        working-directory: ./frontend
        run: npm run build
        
      - name: Run tests
        working-directory: ./frontend
        run: npm test
```

#### Step 2: Create CD Workflow (Deploy to VPS)
Create `.github/workflows/cd.yml`:
```yaml
name: CD Pipeline

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/mna-platform
            git pull origin main
            docker-compose down
            docker-compose up -d --build
```

#### Step 3: Setup GitHub Secrets
1. Go to your GitHub repo → Settings → Secrets and variables → Actions
2. Add secrets:
   - `VPS_HOST`: Your server IP
   - `VPS_USERNAME`: SSH username
   - `VPS_SSH_KEY`: Your SSH private key
   - `JWT_SECRET`: Your JWT secret

**Practice Exercises**:
- [ ] Push code and watch GitHub Actions run
- [ ] Make tests fail on purpose and see CI catch it
- [ ] Set up automatic deployment to a VPS or cloud platform
- [ ] Add code coverage reporting

---

## ☁️ Phase 3: Deployment Options (Week 4)

### Free/Cheap Deployment Platforms

#### Option A: Railway.app (Easiest, $5/month)
**Pros**: Auto-deploy from GitHub, free trial, easy setup
**Tutorial**: https://railway.app/

```bash
# Steps:
1. Sign up at railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repo
4. Railway auto-detects Docker/Node.js
5. Add environment variables
6. Deploy ✅
```

#### Option B: DigitalOcean Droplet ($6/month)
**Pros**: Full control, learn Linux, scalable
**Tutorial**: https://www.digitalocean.com/community/tutorials

```bash
# Steps:
1. Create Ubuntu 22.04 droplet
2. SSH into server
3. Install Docker and Docker Compose
4. Clone your repo
5. Run docker-compose up -d
6. Setup Nginx reverse proxy
7. Get free SSL with Let's Encrypt
```

#### Option C: Vercel (Frontend) + Railway (Backend)
**Pros**: Frontend free forever, backend cheap
- Frontend on Vercel: https://vercel.com/
- Backend on Railway: https://railway.app/

#### Option D: AWS Free Tier (More Complex)
**Pros**: Industry standard, resume value
**Cons**: Steeper learning curve
**Tutorial**: https://aws.amazon.com/getting-started/

### Recommended: Start with Railway
**Why**: Easiest to learn, focus on concepts not server management

**Learning Path**:
1. Week 4 Day 1-2: Deploy to Railway
2. Week 4 Day 3-4: Set up custom domain
3. Week 4 Day 5-7: Learn DigitalOcean for full control

---

## 📊 Phase 4: Monitoring & Logging (Week 5-6)

### Why Monitoring?
- Know when your app is down
- Track performance issues
- Understand user behavior
- Debug production issues

### Learning Resources

**Free Tools to Learn**:
1. **Sentry** (Error Tracking)
   - https://sentry.io/
   - Free tier: 5,000 errors/month
   - Tutorial: https://docs.sentry.io/platforms/javascript/

2. **LogRocket** (Session Replay)
   - https://logrocket.com/
   - Free tier: 1,000 sessions/month
   - See what users do before bugs

3. **Uptime Robot** (Uptime Monitoring)
   - https://uptimerobot.com/
   - Free: 50 monitors
   - Get alerts when site is down

4. **Google Analytics** (User Analytics)
   - https://analytics.google.com/
   - Completely free
   - Track user engagement

### Hands-On Practice

#### Step 1: Add Sentry Error Tracking

**Backend** (`backend/src/app.js`):
```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Add before error handlers
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

**Frontend** (`frontend/src/main.jsx`):
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

#### Step 2: Add Health Check Endpoint

**Backend** (`backend/src/routes/health.js`):
```javascript
router.get('/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});
```

#### Step 3: Setup Uptime Robot
1. Sign up at uptimerobot.com
2. Add monitor: HTTP(s) type
3. URL: https://your-app.com/api/health
4. Interval: 5 minutes
5. Add alert contacts (email, SMS)

#### Step 4: Add Logging

**Install Winston**:
```bash
npm install winston
```

**Create logger** (`backend/src/utils/logger.js`):
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;
```

**Use in code**:
```javascript
const logger = require('./utils/logger');

logger.info('User logged in', { userId: user.id });
logger.error('Database connection failed', { error: err.message });
```

---

## 🎓 Complete Learning Path Summary

### Week 1-2: Docker Fundamentals
- [ ] Complete Docker tutorial
- [ ] Containerize backend
- [ ] Containerize frontend
- [ ] Create docker-compose.yml
- [ ] Test locally

### Week 3: CI/CD with GitHub Actions
- [ ] Learn GitHub Actions basics
- [ ] Create CI workflow (testing)
- [ ] Create CD workflow (deployment)
- [ ] Set up secrets
- [ ] Test full pipeline

### Week 4: Deployment
- [ ] Choose platform (Railway recommended)
- [ ] Deploy to production
- [ ] Set up custom domain
- [ ] Configure SSL certificate
- [ ] Test live app

### Week 5-6: Monitoring & Maintenance
- [ ] Set up Sentry for error tracking
- [ ] Add health check endpoints
- [ ] Configure Uptime Robot
- [ ] Set up logging with Winston
- [ ] Create admin dashboard

---

## 📚 Best Free Learning Resources

### Video Courses
1. **Docker Mastery** by Bret Fisher (Udemy - often free)
2. **CI/CD with GitHub Actions** by freeCodeCamp (YouTube)
3. **DevOps Bootcamp** by TechWorld with Nana (YouTube)

### Interactive Learning
1. **Play with Docker** - https://labs.play-with-docker.com/
2. **Katacoda Docker Scenarios** - https://www.katacoda.com/courses/docker
3. **GitHub Learning Lab** - https://lab.github.com/

### Documentation
1. **Docker Docs** - https://docs.docker.com/
2. **GitHub Actions Docs** - https://docs.github.com/en/actions
3. **DigitalOcean Tutorials** - https://www.digitalocean.com/community/tutorials

### Books (Free)
1. **Docker Deep Dive** by Nigel Poulton (Preview chapters)
2. **The DevOps Handbook** (Available in libraries)

---

## 💡 Pro Tips

### Learning Tips
1. **Learn by doing**: Don't just watch tutorials, actually dockerize your app
2. **Break it down**: Master one tool at a time (Docker → CI/CD → Monitoring)
3. **Read docs**: Official docs are often better than random tutorials
4. **Join communities**: r/docker, r/devops on Reddit
5. **Build projects**: This M&A app is perfect practice!

### Cost-Effective Strategy
- **Month 1**: Railway ($5) + Sentry free tier
- **Month 2-3**: Add monitoring tools
- **Month 4+**: Consider AWS if scaling

### Resume Boosters
- Docker proficiency: Very valuable skill
- CI/CD pipelines: Expected by employers
- Cloud deployment: AWS/Azure/GCP experience
- Monitoring: Shows you care about production

---

## ✅ Your 30-Day Action Plan

| Week | Focus | Goal | Time |
|------|-------|------|------|
| 1 | Docker basics | Run app in containers | 10h |
| 2 | Docker Compose | Multi-container orchestration | 10h |
| 3 | GitHub Actions | Automated CI/CD | 10h |
| 4 | Deployment | Live on Railway/DO | 15h |
| 5 | Monitoring | Sentry + Uptime Robot | 8h |
| 6 | Optimization | Performance + Security | 7h |

**Total**: 60 hours over 6 weeks = ~2 hours/day

---

## 🎯 Next Steps

**Start Today**:
1. Install Docker Desktop
2. Complete "Docker in 2 hours" tutorial
3. Containerize your backend (tomorrow)
4. Containerize your frontend (day 3)
5. Create docker-compose.yml (day 4)

**Questions to Ask**:
- "How do I debug inside a container?"
- "What's the difference between CMD and ENTRYPOINT?"
- "When should I use volumes vs bind mounts?"

**Projects for Practice**:
1. This M&A platform ✅ (Perfect!)
2. Add Redis for caching
3. Add Elasticsearch for search
4. Multi-stage builds for optimization

---

## 📞 Getting Help

**When Stuck**:
1. Stack Overflow (tag: docker, github-actions)
2. Docker Community Slack
3. r/docker subreddit
4. GitHub Discussions

**Good luck!** 🚀

Start with Docker this week, and you'll be deploying like a pro in a month!
