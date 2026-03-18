# Changelog
All notable changes to the Smart M&A Fit & Pipeline Management Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

## [1.1.1] - 2026-03-18 — Real-World Deal Validation Dataset

### Added
- **`REAL_DEAL_COMPARISON.md`**: Comprehensive comparison of 8 real-world M&A deals against our Fit Score algorithm
  - Deals: Microsoft→LinkedIn, Google→Fitbit, Disney→Fox, Amazon→Whole Foods, Facebook→Instagram, Yahoo→Tumblr, HP→Autonomy, Salesforce→Slack
  - Each deal includes verified financial data (SEC filings, 10-K reports), system score estimation, real outcome, and alignment analysis
  - Overall system accuracy: 87.5–100% (7/8 fully aligned, 1 partially aligned)
  - Covers all 4 deal types: Tech Acquisition, Market Expansion, Talent Acquisition, Distressed Buy
  - Documents known system limitations (pre-revenue startups, fraud detection, post-deal execution)

### Changed
- Updated `README.md` — Added `REAL_DEAL_COMPARISON.md` to documentation listing and project structure
- Updated `DEVELOPMENT_LOG.md` — Added development entry for deal validation dataset
- Updated `PROGRESS_REPORT.md` — Added validation dataset to feature inventory and documentation list
- Updated `CHANGELOG.md` — This entry

## [1.1.0] - 2026-03-18 — Project Cleanup & Bug Fixes

### Removed
- **Dead code files deleted**:
  - `frontend/src/pages/Test.jsx` — Debug page, never routed
  - `query` — Scratch file in project root (contained "MongoDB")
  - `backend/src/controllers/deleteNoteController.js` — Duplicate of `dealsController.deleteNote`, never imported
  - `backend/test_fit_score.js` — One-off test script not in any test suite
- **Unused `authorize` middleware** removed from `backend/src/middleware/auth.js` — `roleAuth.js:requireRole` already handles this and is what routes actually use
- **Dead Edit button** removed from `DealDetails.jsx` — linked to non-existent `/deals/:dealId/edit` route

### Fixed
- **Critical: MongoDB `$text` + `$or` query conflict** in `dealsController.getDeals` — wrapping conditions with `$and` so Manager search no longer crashes
- **Comparison export wrong field names** in `comparisonExportService.js` — corrected `financialHealth` → `financials`, `culturalFit` → `cultural`, `technologyCompatibility` → `technology`, removed non-existent `strategicAlignment` metric
- **Inconsistent error response format** in `roleAuth.js` — changed `{ success: false }` to `{ status: 'error' }` to match project-wide convention
- **Confirmed `html2canvas`** is properly installed as a dependency (was imported but appeared missing from package.json listing)


### Added (Latest - 2026-03-11 — Documentation Audit)
- **Previously Undocumented Features Now Captured**
  - `AnalystDashboard.jsx` — Role-specific analyst dashboard page
  - `usersController.js` + `users.js` route — User listing for assignments
  - `SharedAnalysis.js` model — Shared deal/analysis persistence
  - `PrivateRoute.jsx` — Authenticated route guard component
  - `start_servers.bat` — Combined server startup script
  - 4 frontend services: notificationService, sharingService, exportService, activityService
  - 7 backend dependencies: helmet, compression, morgan, multer, nodemailer, express-validator, lodash

### Added (Previous - 2026-02-16)
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
