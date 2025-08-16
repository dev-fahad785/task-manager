import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.token || req.headers.authorization;
  // console.log("🔐 Incoming Auth Header:", authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // console.log("⛔ Token missing or improperly formatted.");
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const rawToken = authHeader.split(' ')[1];
  const token = rawToken.replace(/^"|"$/g, ''); // remove surrounding quotes
  // console.log("🧪 Extracted Token:", token);
  // console.log("🧪 Extracted Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("✅ Token verified. User info:", decoded);
    req.user = decoded; // decoded = { id, role, iat, exp }
    next();
  } catch (error) {
    // console.error("❌ Token verification failed:", error.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
