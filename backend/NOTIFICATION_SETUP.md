# Notification System Setup

## Overview
The M&A Platform has a **dual notification system**:
1. **In-App Notifications** (Always enabled) ✅
2. **Email Notifications** (Optional, disabled by default) 📧

---

## Quick Start (In-App Notifications Only)

### Default Configuration
By default, **only in-app notifications are enabled**. No email setup required!

```bash
# backend/.env
ENABLE_EMAIL_NOTIFICATIONS=false  # Default - no email needed
FRONTEND_URL=http://localhost:5173
```

### What You Get
✅ Notification bell in header with unread badge  
✅ Dropdown panel with recent notifications  
✅ Click notifications to navigate to deals  
✅ Mark as read / Mark all as read functionality  
✅ Auto-refresh every 30 seconds  

### Notification Types
- 🎯 Deal Assigned
- 🔄 Deal Reassigned  
- 📤 Deal Shared
- ✅ Status Updated

---

## Testing In-App Notifications

1. **Start the backend**:
```bash
cd backend
npm run dev
# Should see: "Email notifications are disabled. Only in-app notifications will be sent."
```

2. **Start the frontend**:
```bash
cd frontend
npm run dev
```

3. **Test the flow**:
   - Login as **Manager**
   - Assign a deal to an analyst
   - Login as **Analyst** (different browser/incognito)
   - See notification bell with badge (🔔 with red "1")
   - Click bell → See "New Deal Assigned" notification
   - Click notification → Navigate to deal details

4. **Other test scenarios**:
   - Share a deal → Recipients see notification
   - Update assignment status → Manager sees notification
   - Mark notification as read → Badge decreases

---

## Optional: Enable Email Notifications

If you want to add email notifications later:

### Step 1: Update .env
```bash
ENABLE_EMAIL_NOTIFICATIONS=true
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM="M&A Platform <noreply@maplatform.com>"
```

### Step 2: Configure Email Provider
Follow [EMAIL_SETUP.md](./EMAIL_SETUP.md) for detailed Gmail or SMTP setup.

### Step 3: Restart Backend
```bash
cd backend
npm run dev
# Should see: "Email service is ready to send messages"
```

---

## Troubleshooting

### No notifications appearing
- **Check**: Backend is running (`npm run dev` in backend/)
- **Check**: Frontend is running (`npm run dev` in frontend/)
- **Check**: User is logged in
- **Check**: Browser console for errors (F12 → Console tab)

### Notification bell not showing
- **Check**: User is in a role (Manager or Analyst)
- **Check**: Header.jsx includes `<NotificationBell />`
- **Check**: No import errors in browser console

### Badge count not updating
- **Check**: Auto-refresh is working (updates every 30 seconds)
- **Check**: Network tab in browser (F12 → Network)
- **Check**: `/api/notifications/unread-count` endpoint is being called

### Email errors (if enabled)
- **Check**: `ENABLE_EMAIL_NOTIFICATIONS=true` in .env
- **Check**: Valid EMAIL_USER and EMAIL_PASSWORD
- **Solution**: Set `ENABLE_EMAIL_NOTIFICATIONS=false` to disable email

---

## Architecture

### Backend Notification Flow
```
1. User action (assign deal, share, update status)
   ↓
2. Activity logged (activityLogger.js)
   ↓
3. Notification created in database (Notification model)
   ↓
4. Email sent (if ENABLE_EMAIL_NOTIFICATIONS=true)
```

### Frontend Notification Flow
```
1. NotificationBell component mounts
   ↓
2. Fetch unread count every 30 seconds
   ↓
3. User clicks bell → Fetch notifications
   ↓
4. Display NotificationDropdown with list
   ↓
5. User clicks notification → Navigate + mark as read
```

---

## Database

Notifications are stored in MongoDB:
- Collection: `notifications`
- Fields: `userId`, `type`, `title`, `message`, `metadata`, `isRead`, `createdAt`
- Auto-cleanup: Notifications older than 90 days are removed

---

## Performance

- Unread count cached for 30 seconds
- Pagination: 10-20 notifications per fetch
- Indexed queries on `userId + isRead + createdAt`
- Async email sending (non-blocking)

---

## Next Steps

1. ✅ Test in-app notifications
2. ⏭️ (Optional) Enable email if needed
3. 🎨 Customize notification UI/colors
4. 📊 Monitor notification database size

---

**Recommendation**: Start with in-app notifications only. Add email later if users request it!
