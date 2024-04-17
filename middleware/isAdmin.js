

const is_admin = async (req, res, next) => {
    try {

        const user = req.user;
        if (!user.is_admin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        next();
    } catch (error) {
        console.error('Error checking admin status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { is_admin };
