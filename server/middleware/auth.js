/* server/middleware/auth.js

Enhanced Auth Service (JWT Implementation)
*/

import jwt from 'jsonwebtoken';

const authenticate = (roles = []) => async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // RBAC Check
    if(roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ 
        error: 'Insufficient privileges' 
      });
    }
    
    req.user = {
      id: decoded.sub,
      role: decoded.role,
      session: decoded.session
    };
    next();
  } catch (error) {
    res.status(401).json({ 
      error: 'Invalid or expired token',
      code: 'AUTH_REQUIRED' 
    });
  }
};

export { authenticate };
