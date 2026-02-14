# Quick Start - Frontend Manual Launch

## Issue
Your system has a PATH configuration that prevents automated npm script execution.

## Solution: Start Frontend Manually

### Option 1: Using VS Code (EASIEST) ⭐

1. **Open VS Code**
2. **Click Terminal menu** → New Terminal (or press `` Ctrl+` ``)
3. **Copy and paste this**:
```powershell
cd C:\Users\dhire\M&A\frontend
.\node_modules\.bin\vite
```
4. **Press Enter**

### Option 2: Using Windows Terminal/PowerShell

1. **Open Windows Terminal** or **PowerShell**
2. **Run**:
```powershell
cd C:\Users\dhire\M&A\frontend
.\node_modules\.bin\vite
```

### Option 3: Direct Node Execution

```powershell
cd C:\Users\dhire\M&A\frontend
node node_modules/vite/bin/vite.js
```

---

## Expected Output

You should see:
```
VITE v5.x.x ready in XXXms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

---

## Then Open Browser

1. Open your browser (Chrome, Edge, Firefox)
2. Go to: **http://localhost:5173**
3. You should see the M&A Platform login page

---

## Backend Status ✅

- **Backend**: Already running on port 5000
- **MongoDB**: Connected
- **Notifications**: Ready (in-app only, email disabled)

Once frontend starts, you're ready to test!

---

## Quick Test

After frontend loads:
1. **Login** (use your existing credentials)
2. **Look for** the bell icon (🔔) in the header
3. **Click it** to see notifications
4. **Try** assigning a deal to test notification creation

Let me know when the frontend is running!
