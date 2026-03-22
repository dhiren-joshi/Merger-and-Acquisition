# Smart M&A Fit & Pipeline Management Platform

A comprehensive web-based platform for managing Merger & Acquisition workflows with intelligent Fit Score generation.

## Features

- **Kanban-Style Deal Pipeline**: Visual workflow management across 4 stages (Sourcing, Evaluation, Negotiation, Closing)
- **Intelligent Fit Score Generator**: Weighted metric calculation (0-100) based on Industry, Financials, Culture, and Technology
- **Drag-and-Drop Interface**: Intuitive deal card movement between pipeline stages
- **Multi-Step Form Wizard**: Comprehensive data collection for accurate fit score calculation
- **Real-time Analytics**: Pipeline statistics, KPI cards, and deal distribution charts
- **User Authentication**: Secure JWT-based authentication with role-based access control (RBAC)
- **Deal Comparison**: Side-by-side comparison with radar charts and exportable reports
- **Notification System**: Real-time in-app notifications with bell indicator and dropdown
- **Deal Assignments**: Assign deals to team members with status badges and tracking
- **Activity Tracking**: Automated audit trail with visual timeline for all deal actions
- **Deal Sharing**: Email-based sharing with granular permissions (View/Edit)
- **Export Functionality**: PDF, Excel, and JSON export for deals and comparisons

## Documentation

This project includes comprehensive documentation to help you understand the system:

- **[PROGRESS_REPORT.md](PROGRESS_REPORT.md)**: Complete project progress report with all features and phases
- **[DEVELOPMENT_LOG.md](DEVELOPMENT_LOG.md)**: Detailed log of all development activities, decisions, and changes
- **[CHANGELOG.md](CHANGELOG.md)**: Version history and release notes
- **[ARCHITECTURE.md](ARCHITECTURE.md)**: System architecture, design decisions, and component interactions
- **[DEVOPS_GUIDE.md](DEVOPS_GUIDE.md)**: DevOps and deployment guide
- **[M-A_Product_Description.md](M-A_Product_Description.md)**: Complete product specification (1445 lines)
- **[MONGODB_SETUP.md](MONGODB_SETUP.md)**: Database configuration guide
- **[QUICKSTART.md](QUICKSTART.md)**: Quick setup guide
- **[QUICK_START_FRONTEND.md](QUICK_START_FRONTEND.md)**: Frontend-specific quick start
- **[REAL_DEAL_COMPARISON.md](REAL_DEAL_COMPARISON.md)**: Real-world M&A deal validation — 8 deals compared against our Fit Score algorithm
- **[.agent/workflows/documentation.md](.agent/workflows/documentation.md)**: How to maintain project documentation


## Tech Stack

### Backend
- **Node.js** + **Express.js**: RESTful API server
- **MongoDB** + **Mongoose**: Database and ODM
- **JWT** + **bcryptjs**: Authentication and password hashing
- **Helmet**: HTTP security headers
- **Compression**: Response compression
- **Morgan**: HTTP request logging
- **Multer**: File upload handling
- **Nodemailer**: Email service
- **express-validator**: Input validation
- **Lodash**: Utility functions

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling framework
- **React Router v6**: Client-side routing
- **@hello-pangea/dnd**: Drag-and-drop functionality
- **Recharts**: Data visualization and charts
- **React Hook Form** + **Zod**: Form management and validation
- **Zustand**: Lightweight state management
- **@tanstack/react-query**: Server state and data fetching
- **Axios**: HTTP client
- **jspdf** + **xlsx**: PDF and Excel export
- **lucide-react**: Modern icon library
- **date-fns**: Date utility functions
- **React Toastify**: Toast notifications

## Project Structure

```
M&A/
├── backend/
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── dealsController.js
│   │   │   ├── analyticsController.js
│   │   │   ├── sharingController.js
│   │   │   ├── notificationController.js
│   │   │   ├── activityController.js
│   │   │   └── usersController.js
│   │   ├── models/            # MongoDB models
│   │   │   ├── User.js
│   │   │   ├── Deal.js
│   │   │   ├── Notification.js
│   │   │   ├── ActivityLog.js
│   │   │   └── SharedAnalysis.js
│   │   ├── routes/            # API routes
│   │   │   ├── auth.js
│   │   │   ├── deals.js
│   │   │   ├── analytics.js
│   │   │   ├── sharing.js
│   │   │   ├── notifications.js
│   │   │   ├── activity.js
│   │   │   └── users.js
│   │   ├── services/          # Business logic
│   │   │   ├── fitScoreService.js
│   │   │   └── emailService.js
│   │   ├── middleware/        # Auth, logging & error handling
│   │   │   ├── auth.js
│   │   │   ├── roleAuth.js
│   │   │   ├── activityLogger.js
│   │   │   └── errorHandler.js
│   │   ├── utils/             # Constants and helpers
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # Entry point
│   ├── .env                   # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # Header, Sidebar, PrivateRoute, LoadingSpinner
│   │   │   ├── dashboard/     # KanbanBoard, DealCard, Assignment*
│   │   │   ├── fitScore/      # FitScoreForm (multi-step wizard)
│   │   │   ├── visualizations/# CircularGauge, MetricBarChart, InsightsCard
│   │   │   ├── comparison/    # ComparisonRadarChart, ComparisonTable
│   │   │   ├── collaboration/ # NotesSection
│   │   │   ├── notifications/ # NotificationBell, Dropdown, Item
│   │   │   ├── sharing/       # ShareModal
│   │   │   └── activity/      # ActivityTimeline
│   │   ├── pages/             # Dashboard, Analytics, DealDetails, etc.
│   │   ├── services/          # API services (9 service modules)
│   │   ├── utils/             # Constants and helpers
│   │   ├── styles/            # Global CSS
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── run_backend.bat            # One-click backend starter
├── run_frontend.bat           # One-click frontend starter
├── start_servers.bat          # Start both servers
├── REAL_DEAL_COMPARISON.md     # Real-world deal validation dataset
└── Documentation (11 .md files)
```

## Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher) - Running locally or MongoDB Atlas
- **npm** or **yarn**

## Installation & Setup

### 1. Clone the Repository

### 2. Backend Setup

```bash
cd backend
npm install
```

The `.env` file is already created with development defaults. Make sure MongoDB is running on your local machine.

**Start MongoDB** (if not already running):
```bash
# Windows
mongod

# Or on Windows with default installation:
"C:\Program Files\MongoDB\Server\[version]\bin\mongod.exe"
```

### 3. Run the Application

You can now start the application using the provided utility scripts:

**Option A: Using Scripts (Recommended)**
1. Double-click `run_backend.bat` to start the API server
2. Double-click `run_frontend.bat` to start the frontend

**Option B: Manual Startup**

**Start the Backend**:
```bash
# In the backend directory
npm run dev
```

**Start the Frontend**:
```bash
# In the frontend directory
npm install
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## Usage

### 1. Create an Account

1. Navigate to `http://localhost:5173`
2. Click "Sign up" and create a new account
3. Fill in your details and submit

### 2. Dashboard

After logging in, you'll see the Kanban dashboard with 4 columns:
- **Sourcing**: Initial target identification
- **Evaluation**: In-depth analysis
- **Negotiation**: Deal terms discussion
- **Closing**: Final completion

### 3. Create a Deal with Fit Score

1. Click the **+** button (bottom right) or navigate to "Fit Score Generator"
2. Complete the 6-step form:
   - **Step 1**: Basic deal information
   - **Step 2**: Industry and strategic data
   - **Step 3**: Financial metrics (target & acquirer)
   - **Step 4**: Cultural and operational data
   - **Step 5**: Technology stack information
   - **Step 6**: Review and submit
3. Submit to automatically calculate the Fit Score
4. The deal appears on your dashboard with the calculated score

### 4. Manage Deals

- **Drag & Drop**: Move deals between stages by dragging cards
- **Filter**: Use the filter controls to find specific deals
- **View Details**: Click on a deal card to see full information

## Fit Score Calculation

The Fit Score is calculated using weighted metrics based on deal type:

| Metric | Tech Acquisition | Market Expansion | Talent Acquisition | Distressed Buy |
|--------|-----------------|------------------|-------------------|----------------|
| Industry Match | 15% | 50% | 10% | 5% |
| Financials | 15% | 20% | 10% | 70% |
| Cultural Fit | 10% | 20% | 50% | 15% |
| Technology | 60% | 10% | 30% | 10% |

**Score Categories**:
- **81-100**: Strong Fit (Green)
- **61-80**: Good Fit (Light Green)
- **41-60**: Moderate Fit (Yellow/Orange)
- **21-40**: Weak Fit (Orange/Red)
- **0-20**: Poor Fit (Red)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Deals
- `GET /api/deals` - Get all deals (with filters)
- `POST /api/deals` - Create new deal
- `GET /api/deals/:dealId` - Get single deal
- `PUT /api/deals/:dealId` - Update deal
- `DELETE /api/deals/:dealId` - Delete deal
- `PATCH /api/deals/:dealId/stage` - Update deal stage
- `POST /api/deals/:dealId/notes` - Add note to deal
- `DELETE /api/deals/:dealId/notes/:noteId` - Delete a note

### Analytics
- `GET /api/analytics/pipeline` - Get pipeline statistics

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete notification

### Sharing
- `POST /api/sharing` - Share a deal/analysis
- `GET /api/sharing` - Get shared items
- `DELETE /api/sharing/:id` - Revoke sharing access

### Users
- `GET /api/users` - Get all users (for assignments)

### Activity
- `GET /api/activity` - Get activity logs
- `GET /api/activity/:dealId` - Get deal-specific activity

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mna_platform
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=24h
ALLOWED_ORIGINS=http://localhost:5173
```

## Development

### Backend Development
```bash
cd backend
npm run dev  # Runs with nodemon (auto-restart)
```

### Frontend Development
```bash
cd frontend
npm run dev  # Runs Vite dev server with HMR
```

### Building for Production

**Frontend**:
```bash
cd frontend
npm run build
npm run preview  # Preview production build
```

**Backend**:
```bash
cd backend
npm start  # Production mode
```

## Testing

Run MongoDB first, then:

1. Register a test user
2. Create several deals with different deal types
3. Test drag-and-drop between stages
4. Verify Fit Score calculations
5. Test filtering and search

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or start MongoDB service
- Check the `MONGODB_URI` in `.env` file
- Default: `mongodb://localhost:27017/mna_platform`

### Port Already in Use
- Backend (5000): Change `PORT` in backend `.env`
- Frontend (5173): Change port in `vite.config.js`

### CORS Errors
- Check `ALLOWED_ORIGINS` in backend `.env`
- Ensure frontend URL is included

## Future Enhancements
279: 
280: - AI-powered insights (GPT integration)
281: - Mobile responsive improvements
282: - Advanced search/filtering with ElasticSearch
283: - Multi-tenancy support
284: - SSO integration

## License

MIT

## Author

Built following the Smart M&A Fit & Pipeline Management Platform specification.
