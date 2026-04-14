# Deployment Guide — Smart M&A Platform

> **Total time**: ~25 minutes | **Cost**: $0 (all free tiers)
>
> **Architecture**: MongoDB Atlas (DB) → Render (Backend API) → Vercel (Frontend)

---

## Part 1: MongoDB Atlas — Free Cloud Database (10 min)

### Step 1.1 — Create Account
1. Open **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with your **Google account** or email + password
3. You may be asked to fill a questionnaire — pick any answers and click **Finish**

### Step 1.2 — Create a Free Cluster
1. After signing in, click **"Build a Database"** (or **"Create"** if you already have the dashboard)
2. Select **M0 FREE** tier (the free option)
3. Choose a cloud provider — **AWS** is fine
4. Pick the **region closest to you** (e.g., `Mumbai (ap-south-1)` for India)
5. Cluster name: leave as `Cluster0` or name it `mna-cluster`
6. Click **"Create Deployment"**

### Step 1.3 — Create Database User
1. You'll be prompted to create a database user
2. Choose **Username and Password** authentication
3. Set:
   - **Username**: `mna_admin` (or anything you like)
   - **Password**: Click **"Autogenerate Secure Password"** → **COPY THIS PASSWORD and save it somewhere!**
4. Click **"Create Database User"**

### Step 1.4 — Set Network Access (Allow All IPs)
1. You'll be prompted about where you're connecting from
2. Click **"Add My Current IP Address"** — BUT also:
3. Go to **Network Access** (left sidebar) → **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** — this sets `0.0.0.0/0`
5. Click **"Confirm"**

> ⚠️ This is needed because Render's free tier uses changing IP addresses.

### Step 1.5 — Get Your Connection String
1. Go back to **Database** (left sidebar)
2. Click **"Connect"** on your cluster
3. Select **"Drivers"** (Node.js)
4. Copy the connection string. It will look like:
   ```
   mongodb+srv://mna_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
5. **Replace `<password>`** with the password you saved in Step 1.3
6. **Add the database name** before the `?`. Final string should look like:
   ```
   mongodb+srv://mna_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/mna_platform?retryWrites=true&w=majority&appName=Cluster0
   ```

> 📋 **Save this connection string** — you'll need it in Part 2.

---

## Part 2: Render — Deploy Backend API (8 min)

### Step 2.1 — Create Account
1. Open **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (recommended — it will auto-connect your repos)

### Step 2.2 — Create a Web Service
1. From the Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub account if not already connected
3. Find and select your repo: **`dhiren-joshi/Merger-and-Acquisition`**
4. Click **"Connect"**

### Step 2.3 — Configure the Service
Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `mna-backend` (or any name you want) |
| **Region** | Pick closest to you (e.g., Singapore or Oregon) |
| **Branch** | `master` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** |

### Step 2.4 — Add Environment Variables
Scroll down to **"Environment Variables"** section (or go to the Environment tab after creating) and add these:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your Atlas connection string from Part 1, Step 1.5 |
| `JWT_SECRET` | Any long random string (e.g., `mna-jwt-secret-key-2026-production-xYz123!@#`) |
| `JWT_REFRESH_SECRET` | Another random string (e.g., `mna-refresh-secret-2026-prod-AbC456$%^`) |
| `NODE_ENV` | `production` |
| `JWT_EXPIRE` | `24h` |
| `JWT_REFRESH_EXPIRE` | `7d` |
| `ALLOWED_ORIGINS` | `https://placeholder.vercel.app` (we'll update this after Vercel deploy) |

> 💡 **Tip**: To generate proper random secrets, open a terminal and run:
> ```
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```
> Run it twice — once for `JWT_SECRET`, once for `JWT_REFRESH_SECRET`.

### Step 2.5 — Deploy
1. Click **"Create Web Service"**
2. Render will start building your backend — wait for the build to complete (~2-5 minutes)
3. Once deployed, you'll see a URL like: **`https://mna-backend.onrender.com`**
4. **Copy this URL** — you'll need it for Part 3

### Step 2.6 — Verify Backend
1. Visit `https://YOUR-RENDER-URL.onrender.com/health` in your browser
2. You should see: `{"status":"ok","timestamp":"..."}`
3. If you see this, your backend is live! 🎉

---

## Part 3: Vercel — Deploy Frontend (5 min)

### Step 3.1 — Create Account
1. Open **https://vercel.com**
2. Click **"Sign Up"**
3. Sign up with **GitHub** (same account)

### Step 3.2 — Import Your Project
1. From the Vercel Dashboard, click **"Add New..."** → **"Project"**
2. Find and select your repo: **`Merger-and-Acquisition`**
3. Click **"Import"**

### Step 3.3 — Configure the Project
Fill in these settings:

| Setting | Value |
|---------|-------|
| **Project Name** | `mna-platform` (or any name) |
| **Framework Preset** | `Vite` (it should auto-detect) |
| **Root Directory** | Click **"Edit"** → type `frontend` → click **"Continue"** |
| **Build Command** | `npm run build` (should auto-fill) |
| **Output Directory** | `dist` (should auto-fill) |

### Step 3.4 — Add Environment Variable
Expand **"Environment Variables"** section and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://YOUR-RENDER-URL.onrender.com/api` |

> ⚠️ **Replace `YOUR-RENDER-URL`** with the actual Render URL from Part 2, Step 2.5.
>
> **Make sure to include `/api` at the end!**

### Step 3.5 — Deploy
1. Click **"Deploy"**
2. Vercel will build and deploy your frontend (~1-2 minutes)
3. Once done, you'll get a URL like: **`https://mna-platform.vercel.app`**
4. **Copy this URL** — you need it for Part 4

---

## Part 4: Connect Everything (2 min)

### Step 4.1 — Update Render CORS
1. Go back to **Render Dashboard** → your `mna-backend` service
2. Go to the **"Environment"** tab
3. Find `ALLOWED_ORIGINS` and **edit** it to your actual Vercel URL:
   ```
   https://mna-platform.vercel.app
   ```
   (Replace `mna-platform` with your actual Vercel project name)
4. Click **"Save Changes"**
5. Render will auto-redeploy with the new setting

### Step 4.2 — Test Your Live App!
1. Open your Vercel URL in the browser (e.g., `https://mna-platform.vercel.app`)
2. Test the following:

| Test | Expected Result |
|------|----------------|
| Visit the site | Login/Register page loads |
| Create an account | Registration succeeds, redirects to dashboard |
| Create a deal | Fit Score form works, deal appears on Kanban |
| Drag a deal | Card moves between pipeline stages |
| Open Analytics | Charts and stats load correctly |

---

## Troubleshooting

### "Network Error" or API calls failing
- Check the **CORS** setting: `ALLOWED_ORIGINS` in Render must exactly match your Vercel URL (with `https://`, no trailing slash)
- Check that `VITE_API_URL` on Vercel includes `/api` at the end

### Backend shows "MongoServerError: bad auth"
- Your Atlas password has special characters that need URL-encoding
- Go to Atlas → Database Access → Edit user → reset password to something simpler (letters + numbers only)

### First load is very slow (~50 seconds)
- This is normal on Render's free tier — the server sleeps after 15 min of inactivity
- Subsequent requests will be fast until it sleeps again

### Vercel shows 404 on page refresh
- Make sure `frontend/vercel.json` exists with the SPA rewrite rule (already done ✓)

### "Cannot find module" error on Render
- Make sure **Root Directory** is set to `backend` in Render settings
- Make sure **Build Command** is `npm install`

---

## Quick Reference — Your URLs

After deployment, fill these in for your records:

```
MongoDB Atlas:    https://cloud.mongodb.com  (dashboard)
Render Backend:   https://__________________.onrender.com
Render Health:    https://__________________.onrender.com/health
Vercel Frontend:  https://__________________.vercel.app
GitHub Repo:      https://github.com/dhiren-joshi/Merger-and-Acquisition
```
