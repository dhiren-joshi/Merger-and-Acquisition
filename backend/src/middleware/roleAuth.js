import { USER_ROLES } from '../utils/constants.js';

/**
 * Middleware to require specific role(s) for route access
 * @param {string|string[]} allowedRoles - Single role or array of roles allowed
 * @returns {Function} Express middleware function
 */
export const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        // Check if user is authenticated (auth middleware should run first)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Flatten array in case roles are passed as array
        const roles = allowedRoles.flat();

        // Check if user's role is in allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${roles.join(' or ')}`,
                userRole: req.user.role
            });
        }

        next();
    };
};

/**
 * Middleware to require Manager role
 */
export const requireManager = requireRole(USER_ROLES.MANAGER);

/**
 * Middleware to require Analyst role
 */
export const requireAnalyst = requireRole(USER_ROLES.ANALYST);

/**
 * Middleware that allows both Manager and Analyst (authenticated users)
 */
export const requireAnyRole = requireRole(USER_ROLES.MANAGER, USER_ROLES.ANALYST);
