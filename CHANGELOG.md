# Changelog
All notable changes to the Smart M&A Fit & Pipeline Management Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added (Latest - 2026-02-16)
- **Notification System**
  - Real-time in-app notifications
  - NotificationBell and Dropdown components
  - Backend notification infrastructure (Model/Controller/Routes)

- **Deal Assignments**
  - AssignmentDropdown for deal delegation
  - Visual assignment status badges
  - Assignment history tracking

- **Enhanced Audit & Logging**
  - Middleware-based activity logging (`activityLogger.js`)
  - Comprehensive `ActivityLog` model
  - Expanded `ActivityTimeline` visualization

- **Service Architecture Refactoring**
  - Dedicated `excelExportService.js`
  - Dedicated `comparisonExportService.js`
  - Base `emailService.js` structure

### Added (Previous - 2026-02-13)
- **Deal Sharing System**
  - ShareModal component for email-based deal sharing
  - Permission management (View/Edit access levels)
  - Share link generation and invitation system
  - Access revocation capabilities
  - Share history tracking
  
- **Activity Tracking**
  - ActivityTimeline component for visual activity history
  - User action tracking (created, updated, moved stages, shared)
  - Timestamp display with relative time formatting
  - Icon-based activity type identification
  - Real-time activity updates

- **Role-Based Access Control (RBAC)**
  - Role authorization middleware (roleAuth.js)
  - Multi-role support: MANAGER and ANALYST  
  - Pre-configured middleware: requireManager, requireAnalyst, requireAnyRole
  - Role-based route protection
  - Authorization error handling

### Added (Previous - 2026-02-12)
- **Analytics Dashboard Page**
  - KPI cards showing total deals, average fit score, active deals, and high-fit deals
  - Interactive bar chart for deals by pipeline stage
  - Pie chart for fit score distribution
  - Pipeline summary table with percentages
  
- **Deal Comparison Page**
  - Multi-select deal comparison interface
  - Radar chart for visual metric comparison
  - Detailed side-by-side comparison table
  - Export comparison results

- **Enhanced Deal Details Page**
  - Circular gauge visualization for fit scores
  - Color-coded fit score categories
  - Metric breakdown with weighted scores
  - Insights cards for strengths, risks, and recommendations
  - Notes and collaboration section
  - PDF and Excel export functionality

- **New Visualization Components**
  - `CircularGauge.jsx` - SVG-based fit score gauge
  - `InsightsCard.jsx` - Strengths/risks/recommendations display
  - `MetricBarChart.jsx` - Metric comparison visualization
  - `WeightDistributionChart.jsx` - Donut chart for weight breakdown
  - `ComparisonRadarChart.jsx` - Multi-deal radar comparison
  - `ComparisonTable.jsx` - Side-by-side deal comparison table

- **Collaboration Features**
  - `NotesSection.jsx` - Team notes and comments on deals
  - Activity tracking for deal updates
  
- **Export Functionality**
  - PDF report generation with jspdf
  - Excel spreadsheet export with xlsx
  - Formatted tables in exports

- **New Dependencies**
  - jspdf & jspdf-autotable for PDF generation
  - xlsx for Excel exports
  - lucide-react for modern icons
  - zustand for state management
  - @tanstack/react-query for data fetching
  - zod for validation
  - date-fns for date utilities

- **Documentation System**
  - Comprehensive DEVELOPMENT_LOG.md for activity tracking
  - CHANGELOG.md for version history
  - ARCHITECTURE.md for system design documentation
  - Workflow documentation in .agent/workflows/

### Changed
- Reorganized component structure with dedicated folders (visualizations, comparison, collaboration)
- Enhanced package.json with additional production dependencies
- Improved data visualization across the platform

---

## [1.0.0] - Initial Release (Pre-Documentation)

### Added
- **Kanban-Style Deal Pipeline Dashboard**
  - Visual workflow management across 4 stages (Sourcing, Evaluation, Negotiation, Closing)
  - Drag-and-drop deal cards using @hello-pangea/dnd
  - Real-time pipeline statistics and analytics

- **Intelligent Fit Score Generator**
  - Weighted metric calculation (0-100 scale)
  - Four core metrics: Industry Match, Financials, Culture, Technology
  - Dynamic weighting based on deal type (Tech Acquisition, Market Expansion, Talent Acquisition, Distressed Buy)
  - Multi-step form wizard for comprehensive data collection

- **User Authentication System**
  - JWT-based authentication
  - Secure password hashing with bcryptjs
  - User registration and login
  - Protected routes and API endpoints

- **Frontend Features**
  - React 18 with Vite build tool
  - Tailwind CSS for styling
  - React Router for navigation
  - Recharts for data visualization
  - React Hook Form for form management
  - React Toastify for notifications

- **Backend Features**
  - Node.js + Express.js RESTful API
  - MongoDB database with Mongoose ODM
  - Comprehensive error handling middleware
  - CORS configuration for cross-origin requests
  - Environment-based configuration

- **API Endpoints**
  - Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
  - Deals: CRUD operations + stage updates + notes
  - Analytics: Pipeline statistics

- **Documentation**
  - README.md with setup instructions
  - M-A_Product_Description.md with full specification
  - MONGODB_SETUP.md for database configuration
  - QUICKSTART.md for quick setup

### Technical Stack
- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT
- **Dev Tools**: ESLint, PostCSS, Nodemon

---

## Template for Future Versions

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New features added

### Changed
- Changes to existing functionality

### Deprecated
- Features that will be removed in future versions

### Removed
- Features that were removed

### Fixed
- Bug fixes

### Security
- Security improvements or vulnerability fixes
```

---

## Version Numbering Guide

- **MAJOR** (X.0.0): Incompatible API changes, major features
- **MINOR** (0.Y.0): New functionality, backwards-compatible
- **PATCH** (0.0.Z): Bug fixes, minor improvements

---

[Unreleased]: https://github.com/yourrepo/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yourrepo/releases/tag/v1.0.0
