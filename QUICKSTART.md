# Quick Start Guide - Smart M&A Platform

## Prerequisites

- Node.js v18+ installed
- MongoDB installed and running
- npm package manager

## Installation Steps

### 1. Start MongoDB

Windows:
```powershell
# Start MongoDB service
mongod

# Or with full path:
"C:\Program Files\MongoDB\Server\[version]\bin\mongod.exe"
```

### 2. Backend Setup

```powershell
cd c:\Users\dhire\M&A\backend
npm install
npm run dev
```

Backend runs on: **http://localhost:5000**

### 3. Frontend Setup (New Terminal)

```powershell
cd c:\Users\dhire\M&A\frontend
npm install
npm run dev
```

Frontend runs on: **http://localhost:5173**

## First Time Usage

1. **Open Browser**: Navigate to http://localhost:5173
2. **Register**: Click "Sign up" and create an account
3. **Login**: Use your credentials to log in
4. **Create Deal**: Click the "+" button to create your first deal
5. **Complete Form**: Fill out the 6-step wizard
6. **View Dashboard**: See your deal with calculated Fit Score
7. **Drag & Drop**: Move deals between pipeline stages

## Default Configuration

- **MongoDB**: `mongodb://localhost:27017/mna_platform`
- **Backend Port**: 5000
- **Frontend Port**: 5173
- **JWT Secret**: Pre-configured (change in production!)

## Need Help?

See [README.md](file:///c:/Users/dhire/M&A/README.md) for detailed documentation.
