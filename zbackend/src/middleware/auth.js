const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Check if the Authorization header exists and if it contains the Bearer token
    const token = req.header('Authorization') && req.header('Authorization').startsWith('Bearer ') 
                  ? req.header('Authorization').split(' ')[1]
                  : null;

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        // Verify the token using the JWT secret
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;  // Attach the verified user information to req.user
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = verifyToken;
