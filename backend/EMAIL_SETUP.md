# Phase 7: Email Notification Setup Guide

## Overview
This guide explains how to configure email notifications for the M&A Platform using Gmail (or any SMTP provider).

---

## Gmail Setup (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to **Security**
3. Enable **2-Step Verification**

### Step 2: Generate App-Specific Password
1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select app: **Mail**
3. Select device: **Other (Custom name)**
4. Enter name: **M&A Platform**
5. Click **Generate**
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Update .env File
Add the following to your `backend/.env` file:

```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop  # App password from Step 2 (remove spaces)
EMAIL_FROM="M&A Platform <noreply@maplatform.com>"
FRONTEND_URL=http://localhost:5173
```

**Important**: Remove spaces from the app password!

---

## Alternative SMTP Providers

### Outlook/Office 365
```bash
# In emailService.js, change transporter to:
const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
```

### Custom SMTP Server
```bash
# In emailService.js, change transporter to:
const transporter = nodemailer.createTransport({
    host: 'smtp.your-domain.com',
    port: 587,  # or 465 for SSL
    secure: false,  # true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
```

---

## Testing Email Configuration

### Method 1: Start the server and watch logs
1. Update `.env` with your credentials
2. Start backend: `cd backend && npm run dev`
3. Look for: `"Email service is ready to send messages"`
4. If error appears, check credentials

### Method 2: Trigger a test notification
1. Assign a deal to an analyst
2. Check the analyst's email inbox
3. Verify email arrived with correct formatting

---

## Email Template Customization

All email templates are in `backend/src/services/emailService.js`.

### Example: Customize Deal Assigned Email
```javascript
const sendDealAssignedEmail = async (analyst, deal, manager) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: analyst.email,
        subject: `🎯 New Deal Assigned: ${deal.targetCompanyName}`,  // Add emoji
        html: `
            <!-- Update colors, add logo, etc. -->
            <div style="background: #your-brand-color;">
                <!-- Your custom HTML template -->
            </div>
        `
    };
    // ...
};
```

---

## Troubleshooting

### Error: "Invalid login"
- **Cause**: Incorrect email/password
- **Fix**: Double-check EMAIL_USER and EMAIL_PASSWORD in .env

### Error: "Self-signed certificate"
- **Cause**: SSL certificate issue
- **Fix**: Add to transporter config:
```javascript
tls: { rejectUnauthorized: false }
```

### Emails going to spam
- **Cause**: SPF/DKIM not configured
- **Fix**: 
  - Use your domain's email (not Gmail) for production
  - Configure SPF records for your domain
  - Use a dedicated email service (SendGrid, AWS SES)

### No error but emails not sending
- **Cause**: Email sending is async and errors are caught
- **Fix**: Check server logs for "Email send error:"

---

## Production Recommendations

1. **Use Dedicated Email Service**:
   - SendGrid (99% deliverability)
   - AWS SES (cost-effective)
   - Mailgun (developer-friendly)

2. **Environment-Specific Emails**:
```bash
# Development
EMAIL_USER=dev-notifications@yourdomain.com

# Production
EMAIL_USER=notifications@yourdomain.com
```

3. **Rate Limiting**:
   - Gmail: 500 emails/day (free)
   - Consider queuing for bulk notifications

4. **Email Queue** (Future Enhancement):
```bash
npm install bull redis
# Implement background job queue for emails
```

---

## Security Best Practices

✅ **Never commit .env files** to version control
✅ **Use app-specific passwords**, not account passwords
✅ **Rotate credentials** every 90 days
✅ **Monitor email logs** for suspicious activity
✅ **Limit EMAIL_FROM** to verified domains in production

---

## Notification Types Implemented

| Event | Email Template | Recipient |
|-------|---------------|-----------|
| Deal Assigned | `sendDealAssignedEmail` | Analyst |
| Deal Reassigned | `sendDealAssignedEmail` | New Analyst |
| Deal Shared | `sendDealSharedEmail` | Selected Users |
| Status Updated | `sendStatusUpdatedEmail` | Manager |

---

## Next Steps

1. Configure .env with your credentials
2. Test email sending
3. Customize email templates for your brand
4. (Optional) Set up dedicated email service for production

---

For issues, check:
- Backend logs: `backend/logs/`
- Email service verification on startup
- Gmail security settings if using Gmail
