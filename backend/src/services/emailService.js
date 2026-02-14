import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify transporter configuration (only if email is enabled)
if (process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true') {
    transporter.verify((error, success) => {
        if (error) {
            console.error('Email transporter verification failed:', error);
            console.log('In-app notifications will still work without email.');
        } else {
            console.log('Email service is ready to send messages');
        }
    });
} else {
    console.log('Email notifications are disabled. Only in-app notifications will be sent.');
    console.log('To enable email, set ENABLE_EMAIL_NOTIFICATIONS=true in .env');
}

/**
 * Send email when deal is assigned to analyst
 */
export const sendDealAssignedEmail = async (analyst, deal, manager) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: analyst.email,
        subject: `New Deal Assigned: ${deal.targetCompanyName}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                    .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
                    .deal-info { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
                    .label { font-weight: bold; color: #4b5563; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>New Deal Assigned</h1>
                    </div>
                    <div class="content">
                        <p>Hi ${analyst.name},</p>
                        <p>${manager.name} has assigned a new deal to you:</p>
                        
                        <div class="deal-info">
                            <p><span class="label">Company:</span> ${deal.targetCompanyName}</p>
                            <p><span class="label">Deal Name:</span> ${deal.dealName}</p>
                            <p><span class="label">Deal Type:</span> ${deal.dealType}</p>
                            <p><span class="label">Current Stage:</span> ${deal.currentStage}</p>
                            ${deal.fitScore ? `<p><span class="label">Fit Score:</span> ${Math.round(deal.fitScore.adjustedFitScore)}/100</p>` : ''}
                        </div>
                        
                        <p>Please review the deal details and update the status as you progress.</p>
                        
                        <a href="${process.env.FRONTEND_URL}/deals/${deal._id}" class="button">View Deal Details</a>
                        
                        <p>Best regards,<br>M&A Platform Team</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated notification from M&A Platform. Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Deal assigned email sent to ${analyst.email}`);
        return true;
    } catch (error) {
        console.error('Error sending deal assigned email:', error);
        return false;
    }
};

/**
 * Send email when analysis is shared
 */
export const sendDealSharedEmail = async (recipient, deal, sharer, shareMessage) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: recipient.email,
        subject: `${sharer.name} shared "${deal.targetCompanyName}" with you`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                    .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
                    .deal-info { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
                    .message { background: white; padding: 15px; border-left: 4px solid #4F46E5; margin: 15px 0; font-style: italic; }
                    .label { font-weight: bold; color: #4b5563; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Deal Analysis Shared</h1>
                    </div>
                    <div class="content">
                        <p>Hi ${recipient.name},</p>
                        <p>${sharer.name} has shared a deal analysis with you:</p>
                        
                        <div class="deal-info">
                            <p><span class="label">Company:</span> ${deal.targetCompanyName}</p>
                            <p><span class="label">Deal Type:</span> ${deal.dealType}</p>
                            ${deal.fitScore ? `<p><span class="label">Fit Score:</span> ${Math.round(deal.fitScore.adjustedFitScore)}/100</p>` : ''}
                        </div>
                        
                        ${shareMessage ? `<div class="message"><p><strong>Message from ${sharer.name}:</strong></p><p>${shareMessage}</p></div>` : ''}
                        
                        <a href="${process.env.FRONTEND_URL}/deals/${deal._id}" class="button">View Analysis</a>
                        
                        <p>Best regards,<br>M&A Platform Team</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated notification from M&A Platform. Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Deal shared email sent to ${recipient.email}`);
        return true;
    } catch (error) {
        console.error('Error sending deal shared email:', error);
        return false;
    }
};

/**
 * Send email when status is updated
 */
export const sendStatusUpdatedEmail = async (manager, deal, analyst, newStatus) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: manager.email,
        subject: `Status Updated: ${deal.targetCompanyName}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                    .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
                    .deal-info { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
                    .status { display: inline-block; padding: 6px 12px; background: #10b981; color: white; border-radius: 4px; font-weight: bold; }
                    .label { font-weight: bold; color: #4b5563; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Deal Status Updated</h1>
                    </div>
                    <div class="content">
                        <p>Hi ${manager.name},</p>
                        <p>${analyst.name} has updated the status of an assigned deal:</p>
                        
                        <div class="deal-info">
                            <p><span class="label">Company:</span> ${deal.targetCompanyName}</p>
                            <p><span class="label">Deal Name:</span> ${deal.dealName}</p>
                            <p><span class="label">New Status:</span> <span class="status">${newStatus}</span></p>
                            <p><span class="label">Updated By:</span> ${analyst.name}</p>
                        </div>
                        
                        <a href="${process.env.FRONTEND_URL}/deals/${deal._id}" class="button">View Deal Details</a>
                        
                        <p>Best regards,<br>M&A Platform Team</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated notification from M&A Platform. Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Status updated email sent to ${manager.email}`);
        return true;
    } catch (error) {
        console.error('Error sending status updated email:', error);
        return false;
    }
};

/**
 * Send generic notification email
 */
export const sendNotificationEmail = async (recipient, title, message, ctaLink, ctaText = 'View Details') => {
    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: recipient.email,
        subject: title,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                    .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>${title}</h1>
                    </div>
                    <div class="content">
                        <p>Hi ${recipient.name},</p>
                        <p>${message}</p>
                        
                        ${ctaLink ? `<a href="${ctaLink}" class="button">${ctaText}</a>` : ''}
                        
                        <p>Best regards,<br>M&A Platform Team</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated notification from M&A Platform. Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Notification email sent to ${recipient.email}`);
        return true;
    } catch (error) {
        console.error('Error sending notification email:', error);
        return false;
    }
};

