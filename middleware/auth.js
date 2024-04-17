const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
/**
 * Authentication middleware. This middleware is responsible for
 * verifying the presence of a valid JWT in the Authorization header
 * and authenticating the user using that token.
 */
const authMiddleware = async (req, res, next) => {
    // Check if Authorization header is present
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        // If no Authorization header is present, send an unauthorized response
        return res.status(401).json({ message: 'Authorization header is missing' });
    }

    try {
        // Extract token from Authorization header
        const token = authHeader.split(' ')[1];
        if (!token) {
            // If no token is extracted, send an unauthorized response
            return res.status(401).json({ message: 'Token is missing' });
        }


        // Verify token using the secret key
        // The secret key is a string that only the server knows. It is used
        // to sign the token and verify its authenticity
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // The jwt.verify() method returns a decoded payload if the token is valid

        // Find the user using the id in the decoded payload
        const user = await User.findById(decoded.id);
        if (!user) {
            // If no user is found, the token is invalid, so send an unauthorized response
            return res.status(404).json({ message: 'User not found in the database or no user in the token' });
        }

        // Attach the user information to the request object
        // This is useful for accessing the user information in the subsequent route handlers
        req.user = user;

        // Call the next middleware or route handler
        next();
    } catch (error) {
        // If any error occurs during token verification, log the error and send an unauthorized response
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};


module.exports = authMiddleware;
