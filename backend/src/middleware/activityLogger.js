import ActivityLog from '../models/ActivityLog.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Deal from '../models/Deal.js';
import { sendDealAssignedEmail, sendDealSharedEmail, sendStatusUpdatedEmail } from '../services/emailService.js';

/**
 * Create notifications and send emails based on activity type
 */
const createNotificationsFromActivity = async (activity, req, data) => {
    try {
        const action = activity.action;
        const userId = activity.userId;
        const targetId = activity.targetId;

        // Get current user
        const currentUser = await User.findById(userId);
        if (!currentUser) return;

        // Handle different action types
        switch (action) {
            case 'DEAL_ASSIGNED': {
                // Get deal and analyst
                const deal = await Deal.findById(targetId).populate('assignedTo');
                if (!deal || !deal.assignedTo) break;

                const analyst = deal.assignedTo;

                // Create notification for analyst
                await Notification.createNotification({
                    userId: analyst._id,
                    type: 'DEAL_ASSIGNED',
                    title: 'New Deal Assigned',
                    message: `${currentUser.name} assigned "${deal.targetCompanyName}" to you`,
                    metadata: {
                        dealId: deal._id,
                        actorId: userId,
                        actionType: 'DEAL_ASSIGNED',
                        dealName: deal.targetCompanyName,
                        actorName: currentUser.name
                    }
                });

                // Send email (if enabled)
                if (process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true') {
                    sendDealAssignedEmail(analyst, deal, currentUser).catch(err =>
                        console.error('Email send error:', err)
                    );
                }
                break;
            }

            case 'DEAL_REASSIGNED': {
                // Get deal and new analyst
                const deal = await Deal.findById(targetId).populate('assignedTo');
                if (!deal || !deal.assignedTo) break;

                const newAnalyst = deal.assignedTo;

                // Create notification for new analyst
                await Notification.createNotification({
                    userId: newAnalyst._id,
                    type: 'DEAL_REASSIGNED',
                    title: 'Deal Reassigned to You',
                    message: `${currentUser.name} reassigned "${deal.targetCompanyName}" to you`,
                    metadata: {
                        dealId: deal._id,
                        actorId: userId,
                        actionType: 'DEAL_REASSIGNED',
                        dealName: deal.targetCompanyName,
                        actorName: currentUser.name
                    }
                });

                // Send email (if enabled)
                if (process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true') {
                    sendDealAssignedEmail(newAnalyst, deal, currentUser).catch(err =>
                        console.error('Email send error:', err)
                    );
                }
                break;
            }

            case 'DEAL_SHARED': {
                // Get shared user IDs from request body
                const sharedUserIds = req.body.userIds || [];
                const deal = await Deal.findById(targetId);
                if (!deal) break;

                const shareMessage = req.body.shareMessage || '';

                // Create notifications for all shared users
                for (const sharedUserId of sharedUserIds) {
                    const recipient = await User.findById(sharedUserId);
                    if (!recipient) continue;

                    await Notification.createNotification({
                        userId: sharedUserId,
                        type: 'DEAL_SHARED',
                        title: 'Deal Analysis Shared',
                        message: `${currentUser.name} shared "${deal.targetCompanyName}" with you`,
                        metadata: {
                            dealId: deal._id,
                            actorId: userId,
                            actionType: 'DEAL_SHARED',
                            dealName: deal.targetCompanyName,
                            actorName: currentUser.name
                        }
                    });

                    // Send email (if enabled)
                    if (process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true') {
                        sendDealSharedEmail(recipient, deal, currentUser, shareMessage).catch(err =>
                            console.error('Email send error:', err)
                        );
                    }
                }
                break;
            }

            case 'STATUS_UPDATED': {
                // Get deal and find the manager (deal creator or assignedBy)
                const deal = await Deal.findById(targetId).populate('createdBy assignedTo');
                if (!deal) break;

                const newStatus = req.body.status || data.data?.deal?.assignmentStatus;
                const manager = deal.createdBy;

                // Only notify manager if analyst updated the status
                if (manager && manager._id.toString() !== userId.toString()) {
                    await Notification.createNotification({
                        userId: manager._id,
                        type: 'STATUS_UPDATED',
                        title: 'Deal Status Updated',
                        message: `${currentUser.name} updated "${deal.targetCompanyName}" to ${newStatus}`,
                        metadata: {
                            dealId: deal._id,
                            actorId: userId,
                            actionType: 'STATUS_UPDATED',
                            dealName: deal.targetCompanyName,
                            actorName: currentUser.name
                        }
                    });

                    // Send email (if enabled)
                    if (process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true') {
                        sendStatusUpdatedEmail(manager, deal, currentUser, newStatus).catch(err =>
                            console.error('Email send error:', err)
                        );
                    }
                }
                break;
            }

            default:
                // No notification for other actions
                break;
        }
    } catch (error) {
        console.error('Error creating notifications from activity:', error);
        // Don't throw - notification creation should not break the main flow
    }
};

/**
 * Middleware to automatically log key activities
 */
export const activityLogger = (action, targetType, getDescription) => {
    return async (req, res, next) => {
        // Store original res.json
        const originalJson = res.json.bind(res);

        // Override res.json
        res.json = async function (data) {
            // Only log on successful responses
            if (res.statusCode >= 200 && res.statusCode < 300 && data.status === 'success') {
                try {
                    const targetId = req.params.dealId || req.params.id || data.data?._id || data.data?.deal?._id;

                    if (targetId) {
                        const description = typeof getDescription === 'function'
                            ? getDescription(req, data)
                            : getDescription;

                        const activity = await ActivityLog.logActivity({
                            action,
                            userId: req.userId,
                            targetType,
                            targetId,
                            description,
                            metadata: {
                                method: req.method,
                                path: req.path,
                                body: req.body
                            },
                            ipAddress: req.ip,
                            userAgent: req.get('user-agent')
                        });

                        // Create notifications and send emails
                        await createNotificationsFromActivity(activity, req, data);
                    }
                } catch (error) {
                    console.error('Activity logging error:', error);
                    // Don't fail the request if logging fails
                }
            }

            return originalJson(data);
        };

        next();
    };
};

/**
 * Manual activity logging helper
 */
export const logActivity = async ({
    action,
    userId,
    targetType,
    targetId,
    description,
    metadata = {},
    req = null
}) => {
    try {
        await ActivityLog.logActivity({
            action,
            userId,
            targetType,
            targetId,
            description,
            metadata,
            ipAddress: req?.ip,
            userAgent: req?.get('user-agent')
        });
    } catch (error) {
        console.error('Activity logging error:', error);
        // Don't throw - logging should not break the main flow
    }
};

export default { activityLogger, logActivity };
