import User from '../models/User.js';

/**
 * Get all users (for assignment dropdown)
 * GET /api/users
 */
export const getUsers = async (req, res) => {
    try {
        // Only return basic user info, no sensitive data
        const users = await User.find({ isActive: true })
            .select('firstName lastName email role')
            .sort('firstName lastName');

        res.status(200).json({
            status: 'success',
            data: { users }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching users'
        });
    }
};

/**
 * Get analysts only (for assignment)
 * GET /api/users/analysts
 */
export const getAnalysts = async (req, res) => {
    try {
        const analysts = await User.find({ role: 'Analyst', isActive: true })
            .select('firstName lastName email role')
            .sort('firstName lastName');

        res.status(200).json({
            status: 'success',
            data: { analysts }
        });
    } catch (error) {
        console.error('Get analysts error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching analysts'
        });
    }
};
