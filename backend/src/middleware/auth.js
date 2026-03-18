import jwt from 'jsonwebtoken';

/**
 * Middleware to protect routes with JWT authentication
 */
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Not authorized to access this route'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user ID and role to request
            req.userId = decoded.id;
            req.user = {
                _id: decoded.id,
                id: decoded.id,
                role: decoded.role
            };
            next();
        } catch (error) {
            return res.status(401).json({
                status: 'error',
                message: 'Token is invalid or expired'
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Server error during authentication'
        });
    }
};
