# MongoDB Setup & Troubleshooting

## Issue: Registration Failed

**Root Cause**: MongoDB is not running. The backend cannot connect to the database.

**Error Message**: `Error: connect ECONNREFUSED 127.0.0.1:27017`

## Solutions

### Option 1: Start MongoDB as Windows Service (Recommended)

If MongoDB was installed as a Windows service:

1. Open **Services** (Windows + R, type `services.msc`)
2. Find **MongoDB Server**
3. Right-click and select **Start**

Or use PowerShell (as Administrator):
```powershell
net start MongoDB
```

### Option 2: Start MongoDB Manually

If you know where MongoDB is installed:

```powershell
# Example path - adjust to your installation
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"

# Or if in PATH:
mongod
```

### Option 3: Use MongoDB Atlas (Cloud)

If you don't have MongoDB installed locally, use MongoDB Atlas:

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `backend\.env`:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>
   ```
   Replace:
   - `<username>` with your MongoDB Atlas username
   - `<password>` with your MongoDB Atlas password
   - `<cluster-url>` with your cluster URL
   - `<database-name>` with `mna_platform`

## After Starting MongoDB

1. **Restart the backend server**:
   ```powershell
   cd c:\Users\dhire\M&A\backend
   node src/server.js
   ```

2. **Verify connection**: You should see "MongoDB Connected" in the terminal

3. **Try registration again** at http://localhost:5173

## Quick Check

To verify MongoDB is running, open a new PowerShell window and run:
```powershell
mongo
# or
mongosh
```

If it connects, MongoDB is running correctly.
